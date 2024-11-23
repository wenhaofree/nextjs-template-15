import { Session } from 'next-auth'

interface UpdatePlanParams {
  userId: string
  planType: string
  userLevel: string
}

export async function updateUserPlan({ userId, planType, userLevel }: UpdatePlanParams) {
  // Skip update for free users with one-time plan
  if (userLevel === 'free' && planType === 'one-time') {
    console.log('当前用户不需要更新level')
    return
  }

  console.log('开始更新用户DB的Level:', planType)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
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

  // Update logged-in user's subscription plan in session
//   console.log('userSession level:', userSession?.user.level)
//   if (userSession?.user.level) {
//     if (userSession.user.level === 'free' || userSession.user.level === 'one-time') {
//       userSession.user.level = planType
//     } else if (userSession.user.level === 'unlimited' && planType === 'sponsor') {
//       userSession.user.level = planType
//     }
//     console.log('Update user level:', planType)
//   }
} 