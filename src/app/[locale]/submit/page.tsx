'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Globe, LinkIcon, Languages, CreditCard, Check, Copy } from 'lucide-react'
import { useSession } from "next-auth/react"
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { toast } from "sonner"
import { useLocale } from 'next-intl'
import { Session } from 'next-auth'
import { updateUserPlan } from '@/lib/user/plan'
import { generateToolJsonContent } from '@/lib/tools'
import { captureAndUploadScreenshot } from '@/lib/screenshot'
import { getToolContent, generateAndSaveContent } from '@/lib/content'
import { getTool,DbTool } from '@/lib/neon'



const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

// Add URL validation helper function
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Error message component
const ErrorMessage = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <p className="text-red-500 text-sm mt-1">{message}</p>
  );
};

// Add type for user level
type UserLevel = 'free' | 'one-time' | 'unlimited' | 'sponsor'

// Update the session type to include user info
interface UserSession {
  user?: {
    level?: UserLevel
    email?: string
  }
}

// Helper to determine submission type
type SubmissionType = 'free' | 'payment' | 'direct'

const getSubmissionType = (userLevel: string | undefined, selectedPlan: string): SubmissionType => {
  // Unlimited/sponsor users can submit directly
  if (userLevel === 'unlimited' || userLevel === 'sponsor' || userLevel === 'one-time') {
    return 'direct'
  }

  // Free plan requires backlink check
  if (selectedPlan === 'free') {
    return 'free'
  }

  // All other combinations require payment
  return 'payment'
}

export default function Component() {
  const t = useTranslations('Submit')
  const router = useRouter()
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [formData, setFormData] = useState({
    name: '',
    url: '',
  })

  // Get locale from pathname
  // const locale = pathname.split('/')[1] || 'zh'
  const locale = useLocale();


  // Add URL validation state
  const [errors, setErrors] = useState({
    name: '',
    url: ''
  });

  // Add validation state
  const [showValidation, setShowValidation] = useState(false);

  // Form validation logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (name === 'name') {
      if (!value.trim()) {
        setErrors(prev => ({
          ...prev,
          name: t('form.validation.required')
        }));
      } else if (value.trim().length < 2) {
        setErrors(prev => ({
          ...prev,
          name: t('form.validation.minLength')
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          name: ''
        }));
      }
    }

    if (name === 'url') {
      if (!value.trim()) {
        setErrors(prev => ({
          ...prev,
          url: t('form.validation.required')
        }));
      } else if (!isValidUrl(value.trim())) {
        setErrors(prev => ({
          ...prev,
          url: t('form.validation.invalidUrl')
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          url: ''
        }));
      }
    }
  };

  const features = [
    {
      title: t('features.audience.title'),
      description: t('features.audience.description'),
      icon: Globe,
    },
    {
      title: t('features.backlinks.title'),
      description: t('features.backlinks.description'),
      icon: LinkIcon,
    },
    {
      title: t('features.languages.title'),
      description: t('features.languages.description'),
      icon: Languages,
    },
    {
      title: t('features.pricing.title'),
      description: t('features.pricing.description'),
      icon: CreditCard,
    },
  ]

  const plans = [
    {
      id: 'free',
      name: t('plans.free.name'),
      price: "0",
      description: t('plans.free.description'),
      features: t.raw('plans.free.features') as any[]
    },
    {
      id: 'one-time',
      name: t('plans.oneTime.name'),
      price: "16.9",
      originalPrice: "19.9",
      description: t('plans.oneTime.description'),
      features: t.raw('plans.oneTime.features') as string[]
    },
    {
      id: 'unlimited',
      name: t('plans.unlimited.name'),
      price: "24.9",
      originalPrice: "39.9",
      description: t('plans.unlimited.description'),
      features: t.raw('plans.unlimited.features') as string[]
    },
    {
      id: 'sponsor',
      name: t('plans.sponsor.name'),
      price: "39.9",
      originalPrice: "59.9",
      description: t('plans.sponsor.description'),
      features: t.raw('plans.sponsor.features') as string[]
    },
  ]

  const faqs = t.raw('faq.items') as Array<{question: string, answer: string}>

  // Simplified submit handler
  const handleSubmit = async () => {
    try {
      setShowValidation(true)

      if (!isAuthenticated) {
        toast.error(t('error.loginRequired'))
        return
      }

      if (errors.name || errors.url) {
        toast.error(t('error.formErrors'))
        return
      }

      if (formData.name.trim() === '' || formData.url.trim() === '') {
        return
      }

      console.log('Form submission:', {
        name: formData.name.trim(),
        url: formData.url.trim(),
        planId: selectedPlan
      })

      console.log('当前用户level:', session.user.level);
      const submissionType = getSubmissionType(session.user.level, selectedPlan)
      console.log('当前用户submissionType:', submissionType);
      
      switch (submissionType) {
        case 'free':
          // Handle free submission with backlink check
          const hasValidBacklink = await checkBacklink(formData.url)
          if (!hasValidBacklink) {
            toast.error(t('error.backlinkRequired'))
            return
          }
          await submitTool(formData, session)
          break

        case 'payment':
          // Redirect to payment page
          const checkoutUrl = await createCheckoutSession({
            email: session?.user?.email,
            planType: selectedPlan,
            submission: formData
          })
          router.push(checkoutUrl)
          break

        case 'direct':
          // Direct submission for unlimited/sponsor users
          await submitTool(formData, session)
          break
      }

      setFormData({ name: '', url: '' })

    } catch (error) {
      console.error('Error:', error)
      toast.error(t('error.submissionFailed'))
    }
  }

  // Helper functions
  const checkBacklink = async (url: string) => {
    const response = await fetch('/api/tools/check-backlink', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    
    if (!response.ok) {
      throw new Error('Failed to check backlink')
    }
    
    const { hasBacklink } = await response.json()
    return hasBacklink
  }

  const submitTool = async (data: typeof formData, session: Session | null) => {
    //TODO-fwh-提交工具数据
    const submitResponse = await fetch('/api/tools/addtool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.name.trim(),
        url: data.url.trim(),
        // image_url: 'https://cdn.aistak.com/s2%2Fscreenshot_getinboxzero.com.webp',
        // summary: 'AI摘要', // TODO: Generate with AI
        // tags: 'AI工具,AI助手', // TODO: Generate with AI
        status: 'pending', //先保存数据-后续AI内容优化数据修改状态
        price_type: session?.user?.level || '',
        submit_user_id: session?.user?.email || ''
      })
    })

    if (!submitResponse.ok) {
      throw new Error('Failed to submit tool')
    }

    // 用户level: one-time 提交成功 更新为free
    if (submitResponse.ok && session?.user.level === 'one-time') {
      await updateUserPlan({
        userId: session.user.email,
        planType: 'free',
        userLevel: session.user.level
      })
    }
    //TODO-考虑48小时内处理提示
    toast.success(t('success.submitPlan'))

    
    //AI内容生成
    //1.截图URL
    // Add retry logic for screenshot capture
    // let screenshotResult;
    // let retries = 3;
    // while (retries > 0) {
    //   try {
    //     screenshotResult = await captureAndUploadScreenshot({
    //       url: data.url.trim()
    //     });
        
    //     if (screenshotResult.success) {
    //       break; // Success - exit retry loop
    //     }
        
    //     console.error(`❌ Screenshot attempt ${4-retries}/3 failed:`, screenshotResult.error);
    //     retries--;
        
    //     if (retries > 0) {
    //       // Wait 2 seconds before retrying
    //       await new Promise(resolve => setTimeout(resolve, 2000));
    //     }
        
    //   } catch (error) {
    //     console.error(`❌ Screenshot attempt ${4-retries}/3 error:`, error);
    //     retries--;
        
    //     if (retries > 0) {
    //       await new Promise(resolve => setTimeout(resolve, 2000));
    //     }
    //   }
    // }
    // const imageUrl = screenshotResult?.url;
    
    // //2.简介内容JSON
    // const { summary, tags, success, error } = await generateToolJsonContent({
    //   submissionName:data.name.trim(),
    //   submissionUrl:data.url.trim(),
    //   userId:session?.user?.email,
    //   planType:session?.user?.level
    // })
    // if (!success) {
    //   console.error('❌ Failed to generate tool JSON:', error)
    //   // Continue processing - don't block webhook
    // }

    // //3.生成详情内容MD
    // // After successful tool submission:
    // const submitData = await submitResponse.json()
    // const toolId = submitData.id // Assuming the API returns the created tool ID
    // const tool = await getTool(toolId)
    // if (!tool) {
    //   console.error('❌ Failed to fetch tool data after creation')
    //   const slug = data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    //   const content = await getToolContent(slug)
    //   if (!content) {
    //     // Generate content in the background
    //     console.log('📝 Generating content for:', slug)
    //     generateAndSaveContent(tool).catch(err => {
    //       console.error('❌ Failed to generate content:', err)
    //     })
    //   }
    // }

    // //4.更新数据库状态
    // const updateResponse = await fetch('/api/tools/updatetool', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     id: toolId,
    //     image_url: imageUrl,
    //     summary: summary,
    //     tags: tags,
    //     status: 'active'
    //   })
    // })

    // if (!updateResponse.ok) {
    //   console.error('❌ Failed to update tool status')
    // }
  

  }

  const createCheckoutSession = async (params: {
    email?: string,
    planType: string,
    submission: typeof formData
  }) => {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        planType: params.planType,
        userLevel: session?.user.level,
        submissionName: params.submission.name.trim(),
        submissionUrl: params.submission.url.trim(),
        submission: params.submission,
        locale
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create payment session')
    }

    const data = await response.json()
    return data.url
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#7B68EE] to-[#4169E1]">
            {t('hero.title')}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-[#32CD32]">✓</span>
            <span className="text-[#B0B0DA]">{t('hero.badge')}</span>
          </div>
          <p className="text-[#B0B0DA] max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-[#12122A] border-[#2A2A4A] p-6">
              <feature.icon className="w-8 h-8 text-[#7B68EE] mb-4" />
              <h3 className="text-lg font-semibold text-[#7B68EE] mb-2">{feature.title}</h3>
              <p className="text-[#B0B0DA] text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Submission Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="space-y-4">
            <div>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('form.name.placeholder')}
                className={`bg-[#12122A] border-[#2A2A4A] text-[#E0E0FF] placeholder:text-[#B0B0DA] ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              <ErrorMessage message={errors.name} />
            </div>
            
            <div>
              <Input
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder={t('form.url.placeholder')}
                className={`bg-[#12122A] border-[#2A2A4A] text-[#E0E0FF] placeholder:text-[#B0B0DA] ${
                  errors.url ? 'border-red-500' : ''
                }`}
              />
              <ErrorMessage message={errors.url} />
            </div>
          </div>

          {/* Plan Selection */}
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`bg-[#12122A] border-2 cursor-pointer transition-all h-full ${
                  selectedPlan === plan.id ? 'border-[#7B68EE]' : 'border-[#2A2A4A]'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="p-6 flex flex-col h-full">
                  <div>
                    <h3 className="font-semibold text-[#7B68EE] text-lg">{plan.name}</h3>
                    <div className="flex items-baseline mt-2 gap-2">
                      <span className="text-3xl font-bold text-[#7B68EE]">${plan.price}</span>
                      {plan.originalPrice && (
                        <span className="text-sm text-[#B0B0DA] line-through">
                          ${plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-[#B0B0DA] text-sm">{plan.description}</p>
                  </div>
                  
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#B0B0DA]">
                        <Check className="w-4 h-4 text-[#32CD32] mt-0.5 shrink-0" />
                        {typeof feature === 'string' ? (
                          <span>{feature}</span>
                        ) : feature.type === 'code' ? (
                          <div className="flex-1">
                            <div className="bg-[#1A1A2E] p-2 rounded-md font-mono text-xs relative group">
                              {feature.content}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(feature.content);
                                }}
                                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="复制代码"
                              >
                                <Copy className="w-4 h-4 hover:text-[#7B68EE]" />
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link 
              href={`/${locale}/price`}
              className="text-[#7B68EE] hover:text-[#6A5ACD] text-sm"
            >
              {t('button.viewPricing')}
            </Link>
          </div>
          
          {showValidation && (formData.name.trim() === '' || formData.url.trim() === '') && (
            <div className="text-red-500 text-sm mt-2 text-center">
              {formData.name.trim() === '' ? t('form.name.error') : t('form.url.error')}
            </div>
          )}
          <Button 
            onClick={handleSubmit}
            disabled={!isAuthenticated}
            className="w-full mt-4 bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B] disabled:opacity-50"
          >
            {!isAuthenticated ? t('button.pleaseLogin') : t('button.submit')}
          </Button>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#7B68EE] mb-8">
            {t('faq.title')}
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-[#12122A] border border-[#2A2A4A] rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-[#1E1E3A]">
                  <span className="text-[#E0E0FF]">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-4 text-[#B0B0DA]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </div>
  )
}