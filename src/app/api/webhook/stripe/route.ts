import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
// import { UserAPI } from '@/lib/api/user'
// import { createTool } from '@/app/actions'
// import { PlanType } from '@/types/user'

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

      // Update user's plan type after successful payment
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
      console.log('Update plan request:', {
        email: userId,
        planType
      });
      console.log('Update plan response:', {
        status: updateResponse.status,
        ok: updateResponse.ok,
        statusText: updateResponse.statusText
      });
      
      if (!updateResponse.ok) {
        const updateData = await updateResponse.json()
        throw new Error(updateData.error || '更新用户计划失败')
      }




      // 创建工具记录
      if (submissionName && submissionUrl) {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const submitResponse = await fetch(`${baseUrl}/api/tools/addtool`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // TODO-FWH-基础数据填充
          body: JSON.stringify({
            title: submissionName,
            url: submissionUrl,
            image_url: 'https://cdn.aiwith.me/s2%2Fscreenshot_getinboxzero.com.webp',//输入网址,截图首页
            summary:'AI摘要',//输入网址,AI总结摘要
            tags:'AI工具,AI助手',//输入网址,AI总结标签
            status:'active',
            price_type: planType, //根据用户订阅计划值
            submit_user_id: userId
          })
        })

        console.log('Submit tool request:', {
          title: submissionName,
          url: submissionUrl,
          price_type: planType,
          submit_user_id: userId
        });
        console.log('Submit tool response:', {
          status: submitResponse.status,
          ok: submitResponse.ok,
          statusText: submitResponse.statusText
        });
  
        if (!submitResponse.ok) {
          const submitData = await submitResponse.json()
          throw new Error(submitData.error || '工具提交失败')
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