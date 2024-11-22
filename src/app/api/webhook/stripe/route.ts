import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { analyzeUrl } from '@/lib/ai'
import { getServerSession } from "next-auth"
import { authOptions } from '../../auth/auth.config'
import { getToolContent, generateAndSaveContent } from '@/lib/content'
import { getTool } from '@/lib/neon'


const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion,
})

// 直接使用环境变量，不做额外处理
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  try {
    const userSession = await getServerSession(authOptions)
    
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

      const { planType, submissionName, submissionUrl } = metadata
      const userId = session.client_reference_id

      if (!userId || !planType) {
        throw new Error('Missing userId or planType in session metadata')
      }

      console.log('✅ Processing checkout session:', {
        userId,
        planType,
        submissionName,
        submissionUrl
      })

      // 更新用户计划
      console.log('开始更新用户DB的Level:',planType);
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      const updateResponse = await fetch(`${baseUrl}/api/auth/update-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userId,
          planType
        }),
      })

      if (!updateResponse.ok) {
        const updateData = await updateResponse.json()
        throw new Error(updateData.error || '更新用户计划失败')
      }

      // Update logged-in user's subscription plan
      console.log('userSession level:', userSession?.user.level);
      if (userSession?.user.level) {
        if (userSession.user.level === 'free' || userSession.user.level === 'one-time') {
          userSession.user.level = planType;
        } else if (userSession.user.level === 'unlimited' && planType === 'sponsor') {
          userSession.user.level = planType;
        }
        console.log('Update user level:', planType);
      }

      
      if (submissionName && submissionUrl) {
        // AI analysis
        try {
          console.log('🤖 Starting AI analysis for URL:', submissionUrl);
          
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
          const aiResponse = await analyzeUrl(submissionUrl, baseUrl);
          
          console.log('✅ AI analysis completed:', {
            summary: aiResponse.summary,
            tags: aiResponse.tags,
            status: aiResponse.status
          });

          const summary = aiResponse.summary;
          const tags = aiResponse.tags.join(',');

          
          //1.根据URL截图
          try {
            // Use the same parameter structure as the working version
            const screenshotParams = {
              url: submissionUrl,  // rename to match API expectation
              size: '16:9' as const  // explicitly type as const
            };

            console.log('📸 Screenshot request params:', {
              timestamp: new Date().toISOString(),
              ...screenshotParams
            });

            // Get screenshot blob
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
            const response = await fetch(`${baseUrl}/api/screenshot`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(screenshotParams),  // use renamed params
            });

            if (!response.ok) {
              console.error('❌ Screenshot API error:', {
                timestamp: new Date().toISOString(),
                status: response.status,
                statusText: response.statusText,
                params: screenshotParams
              });
              throw new Error('Screenshot generation failed');
            }

            console.log('✅ Screenshot generated successfully:', {
              timestamp: new Date().toISOString(),
              status: response.status,
            });

            const blob = await response.blob();
            
            // Create FormData and directly append blob with filename
            const formData = new FormData();
            formData.append('file', blob, `screenshot-${Date.now()}.png`);  // 直接使用 blob，不需要创建 File 对象

            console.log('📤 Uploading screenshot to R2:', {
              timestamp: new Date().toISOString(),
              fileSize: blob.size,
              fileType: 'image/png',
            });

            // Upload to R2
            const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
              method: 'POST',
              body: formData
            });

            if (!uploadResponse.ok) {
              console.error('❌ R2 upload error:', {
                timestamp: new Date().toISOString(),
                status: uploadResponse.status,
                statusText: uploadResponse.statusText,
              });
              throw new Error('Failed to upload screenshot');
            }

            const { url } = await uploadResponse.json();
            
            console.log('✅ Screenshot uploaded successfully:', {
              timestamp: new Date().toISOString(),
              url,
            });

            // 2.创建工具记录
            const submitResponse = await fetch(`${baseUrl}/api/tools/addtool`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                title: submissionName,
                url: submissionUrl,
                image_url: url,
                summary: summary,
                tags: tags,
                status: 'active',
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
          
          // Fallback to default values if AI analysis fails
          const summary = 'AI工具描述';
          const tags = 'AI工具,AI助手';
          
          // Continue with submission using fallback values...
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