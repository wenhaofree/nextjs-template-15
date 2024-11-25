import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { analyzeUrl } from '@/lib/ai'
import { getServerSession } from "next-auth"
import { authOptions } from '../../auth/auth.config'
import { getToolContent, generateAndSaveContent,generateAndSaveToolJson,getToolJson } from '@/lib/content'
import { getTool,DbTool } from '@/lib/neon'
import { getLocale } from 'next-intl/server'
import { updateUserPlan } from '@/lib/user/plan'
import { generateToolJsonContent } from '@/lib/tools'
import { captureAndUploadScreenshot } from '@/lib/screenshot'



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion,
})

// 直接使用环境变量，不做额外处理
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Add type validation helper
const isValidPlanType = (plan: string): plan is "free" | "one-time" | "unlimited" | "sponsor" => {
  return ["free", "one-time", "unlimited", "sponsor"].includes(plan);
}

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headerList = await headers()
    const stripeSignature = headerList.get('stripe-signature')
    
    if (!stripeSignature) {
      console.error('❌ No stripe signature found')
      return NextResponse.json(
        { error: 'No stripe signature found' },
        { status: 400 }
      )
    }

    if (!webhookSecret) {
      console.error('❌ No webhook secret found:', {
        webhookSecret,
        env: process.env.NODE_ENV
      })
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    let event: Stripe.Event
    try {
      // 使用原始的 webhookSecret
      event = stripe.webhooks.constructEvent(
        body,
        stripeSignature,
        webhookSecret
      )

      console.log('✅ Webhook signature verified:', {
        eventId: event.id,
        type: event.type
      })
    } catch (err) {
      const error = err as Error
      console.error('❌ Webhook signature verification failed:', {
        error: error.message,
        signature: stripeSignature.slice(0, 10) + '...',
        webhookSecretLength: webhookSecret.length
      })
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // 处理事件
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const { metadata } = session
      
      if (!metadata) {
        throw new Error('No metadata in session')
      }

      const { planType,userLevel, submissionName, submissionUrl } = metadata
      const userId = session.client_reference_id

      if (!userId || !planType) {
        throw new Error('Missing userId or planType in session metadata')
      }

      console.log('✅ Processing checkout session:', {
        userId,
        planType,
        userLevel,
        submissionName,
        submissionUrl
      })


      // 更新用户订阅计划DB和Session
      await updateUserPlan({
        userId,//邮箱
        planType,
        userLevel
      })

      
      if (submissionName && submissionUrl) {
        //TODO-fwh-Bug-AI失败导致用户提交不成功.

        // AI analysis
        try {
          if (!isValidPlanType(planType)) {
            throw new Error(`Invalid plan type: ${planType}`);
          }

          //0. 将内容保存到json文件中
          // const slug = submissionName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const { summary, tags, success, error } = await generateToolJsonContent({
            submissionName,
            submissionUrl,
            userId,
            planType
          })
          if (!success) {
            console.error('❌ Failed to generate tool JSON:', error)
            // Continue processing - don't block webhook
          }

          
          try {
            //1.根据URL截图
            // Use the same parameter structure as the working version
            // Replace the screenshot code block with:
            const screenshotResult = await captureAndUploadScreenshot({
              url: submissionUrl
            });

            if (!screenshotResult.success) {
              console.error('❌ Screenshot generation failed:', screenshotResult.error);
              // Continue processing - don't block webhook
            }

            const imageUrl = screenshotResult.url;


            // 2.创建工具记录
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const submitResponse = await fetch(`${baseUrl}/api/tools/addtool`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                title: submissionName,
                url: submissionUrl,
                image_url: imageUrl,
                summary: summary,
                tags: tags,
                status: 'pending',//'active', 'inactive', 'pending'
                price_type: planType,
                submit_user_id: userId
              })
            })
            

            if (!submitResponse.ok) {
              const submitData = await submitResponse.json()
              throw new Error(submitData.error || '工具提交失败')
            }

            // After successful tool submission:
            const submitData = await submitResponse.json()
            const toolId = submitData.id // Assuming the API returns the created tool ID

            // Get the tool data
            const tool = await getTool(toolId)
            if (!tool) {
              console.error('❌ Failed to fetch tool data after creation')
              // Continue webhook processing - don't block on content generation
              return NextResponse.json({ received: true })
            }

            // 3. 异步生成内容
            // Check and generate content asynchronously
            try {
              const slug = submissionName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              const content = await getToolContent(slug)
              if (!content) {
                // Generate content in the background
                console.log('📝 Generating content for:', slug)
                generateAndSaveContent(tool).catch(err => {
                  console.error('❌ Failed to generate content:', err)
                })
              }
            } catch (err) {
              // Log error but don't fail the webhook
              console.error('❌ Error checking/generating content:', err)
            }

          } catch (err) {
            console.error('❌ Screenshot/upload process error:', {
              timestamp: new Date().toISOString(),
              error: err instanceof Error ? err.message : 'Unknown error',
              stack: err instanceof Error ? err.stack : undefined,
              submissionUrl,
            });
            throw err;
          }
        } catch (error) {
          console.error('❌ AI analysis failed:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            url: submissionUrl
          });
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const err = error as Error
    console.error('❌ Webhook error:', {
      message: err.message,
      stack: err.stack
    })
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
} 