import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as '2024-10-28.acacia',
})

// 直接使用环境变量，不做额外处理
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

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

      //根据URL截图
      if (submissionName && submissionUrl) {
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

          // 创建工具记录
          const submitResponse = await fetch(`${baseUrl}/api/tools/addtool`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: submissionName,
              url: submissionUrl,
              image_url: url,
              summary: 'AI摘要',
              tags: 'AI工具,AI助手',
              status: 'active',
              price_type: planType,
              submit_user_id: userId
            })
          })

          if (!submitResponse.ok) {
            const submitData = await submitResponse.json()
            throw new Error(submitData.error || '工具提交失败')
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