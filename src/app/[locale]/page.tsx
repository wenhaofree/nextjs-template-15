import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Instagram, Linkedin, Star, Twitter, Github } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { Check } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-black font-bold">P</span>
            </div>
            <span className="text-lg font-semibold">Proactiv</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="#features" className="text-sm text-gray-300 hover:text-white">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-gray-300 hover:text-white">
              Pricing
            </Link>
            <Link href="#blog" className="text-sm text-gray-300 hover:text-white">
              Blog
            </Link>
            <Link href="#contact" className="text-sm text-gray-300 hover:text-white">
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Register
            </Button>
            <Button className="bg-cyan-400 text-black hover:bg-cyan-500">
              Book a demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 text-center px-6 lg:px-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto mb-6">
          Transform Your Marketing with Proactiv
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Automate Campaigns, Engage Audiences, and Boost Lead Generation with Our All-in-One Marketing Solution
        </p>

        <div className="flex justify-center items-center mb-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="w-12 h-12 rounded-full border-2 border-black overflow-hidden -ml-2 first:ml-0"
            >
              <Image
                src={`https://img.wenhaofree.com/avatar${i}.jpg`}
                alt={`Testimonial ${i}`}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-400">Trusted by 27,000+ creators</p>
        </div>

        <Button className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-6">
          Book a demo →
        </Button>
      </main>

      {/* Social Media Features */}
      <section className="py-24 px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-800 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">Automate your social media</h2>
          <p className="text-gray-400 mb-16 max-w-2xl mx-auto">
            Proactiv houses a rich set of features to automate your marketing efforts across all social medias
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Post to Multiple Platforms Card */}
            <div className="bg-gray-900 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-semibold mb-4">Post to multiple platforms at once</h3>
              <p className="text-gray-400 mb-8">With our AI-powered platform, you can post to multiple platforms at once, saving you time and effort.</p>
              <div className="grid grid-cols-4 gap-4">
                {['instagram', 'tiktok', 'twitter', 'facebook', 'meta', 'linkedin', 'slack'].map((platform) => (
                  <div key={platform} className="bg-gray-800 p-2 rounded-xl">
                    <Image
                      src={`https://img.wenhaofree.com/${platform}.png`}
                      alt={platform}
                      width={32}
                      height={32}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-gray-900 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-semibold mb-4">Analytics for everything</h3>
              <p className="text-gray-400 mb-8">Check analytics, track your posts, and get insights into your audience.</p>
              <div className="relative h-32">
                <svg className="w-full h-full" viewBox="0 0 300 100">
                  <path
                    d="M0,50 C50,30 100,70 150,50 C200,30 250,70 300,50"
                    fill="none"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                  />
                  <circle cx="150" cy="50" r="4" fill="white" />
                </svg>
                <div className="absolute top-0 right-0 text-sm text-gray-400">+200 connections</div>
              </div>
            </div>

            {/* Integrated AI Card */}
            <div className="bg-gray-900 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-semibold mb-4">Integrated AI</h3>
              <p className="text-gray-400 mb-8">Proactiv uses AI to help you create engaging content.</p>
              <div className="flex justify-center gap-4">
                <div className="bg-gray-800 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"/>
                  </svg>
                </div>
                <div className="bg-gray-800 p-3 rounded-full">
                  <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8zm-1-4h2v2h-2zm1-10c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                  </svg>
                </div>
                <div className="bg-gray-800 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Easy Collaboration Card */}
            <div className="bg-gray-900 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-semibold mb-4">Easy Collaboration</h3>
              <p className="text-gray-400 mb-8">Proactive can integrate with Zapier, Slack and every other popular integration tools.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3">
                  <span>Twitter post</span>
                  <div className="ml-auto">
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3">
                  <span>Email Campaign</span>
                  <div className="ml-auto">
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Know Your Audience Card */}
            <div className="bg-gray-900 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-semibold mb-4">Know your audience</h3>
              <p className="text-gray-400 mb-8">Based on your audience, create funnels and drive more traffic.</p>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="https://img.wenhaofree.com/avatar1.jpg"
                  alt="Profile"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="font-semibold">Manu Arora</div>
                  <div className="text-sm text-gray-400">Most engagements • 69,420</div>
                </div>
              </div>
              <div className="h-16">
                <svg className="w-full h-full" viewBox="0 0 300 100">
                  <path
                    d="M0,50 C100,20 200,80 300,50"
                    fill="none"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-t-2xl bg-gray-900 shadow-2xl">
          <Image
            src="/placeholder.svg?height=800&width=1400"
            alt="Dashboard preview"
            width={1400}
            height={800}
            className="w-full"
            priority
          />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Automate your social media</h2>
            <p className="text-gray-400 text-lg">
              Proactiv houses a rich set of features to automate your marketing efforts across all social medias
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Post to multiple platforms at once</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-8">
                  With our AI-powered platform, you can post to multiple platforms at once, saving you time and effort.
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                    <div key={i} className="flex items-center justify-center h-16 w-16 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                      <Icon className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Analytics for everything</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-8">
                  Check analytics, track your posts, and get insights into your audience.
                </p>
                <div className="relative h-48 w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg" />
                  <div className="absolute bottom-0 left-0 right-0 h-32">
                    <div className="h-full w-full bg-gradient-to-t from-cyan-400/20 to-transparent rounded-b-lg" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-cyan-400 text-lg font-semibold">+200 connections</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Automated scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-8">
                  Schedule your posts ahead of time and let our AI handle the optimal posting times.
                </p>
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 w-16 rounded-lg bg-gray-800 animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Engagement tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-8">
                  Track engagement across all platforms in one unified dashboard.
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Profile"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">69,420</div>
                    <div className="text-sm text-gray-400">Total engagements</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* First Column */}
            <div className="space-y-8">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-6">
                    What a fantastic AI Proactiv AI is, I just love it. It has completely transformed the way I approach problems and develop solutions.
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>MA</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Manu Arora</div>
                      <div className="text-sm text-gray-400">Tech Innovator & Entrepreneur</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-6">
                    This AI has transformed the way I work! It's like having a brilliant assistant who knows exactly what I need before I do.
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>TD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Tyler Durden</div>
                      <div className="text-sm text-gray-400">Creative Director & Business Owner</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Center Column - Featured Testimonial */}
            <div className="lg:mt-24">
              <Card className="bg-gray-900/50 border-gray-800 relative">
                <CardContent className="p-6">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <Avatar className="h-24 w-24 border-4 border-gray-900">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback>TD</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="pt-16 text-center">
                    <p className="text-xl text-gray-300 mb-6">
                      I made a soap with the help of AI, it was so easy to use. I'm so glad this happened because it revolutionized my entire business model and production process.
                    </p>
                    <div className="inline-flex flex-col items-center">
                      <div className="font-semibold">Tyler Durden</div>
                      <div className="text-sm text-gray-400">Creative Director & Business Owner</div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      <span className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-400">Tech Innovator & Entrepreneur</span>
                      <span className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-400">Creative Director & Business Owner</span>
                      <span className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-400">Senior Software Engineer</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Third Column */}
            <div className="space-y-8">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-6">
                    It's incredibly intuitive and easy to use. Even those without technical expertise can leverage its power to improve their workflows.
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>JH</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Jack Hall</div>
                      <div className="text-sm text-gray-400">Product Manager</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-6">
                    It helps us achieve what was once thought impossible. The AI's capabilities are groundbreaking and have opened new avenues for us.
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>KA</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Kathy Adams</div>
                      <div className="text-sm text-gray-400">Innovation Lead</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 lg:px-8" id="pricing">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple pricing</h2>
            <p className="text-gray-400 text-lg">
              Simple pricing for startups, small businesses, medium scale businesses and enterprises.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className="text-sm text-gray-400">monthly</span>
              <Switch id="billing-toggle" />
              <span className="text-sm text-gray-400">yearly</span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Hobby Plan */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Hobby</CardTitle>
                <div className="text-3xl font-bold">$0 / month</div>
                <p className="text-sm text-gray-400">For individuals trying out the product</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Access to all tools for 14 days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>No credit card required</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Community Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Access to Aceternity UI</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Get Started</Button>
              </CardFooter>
            </Card>

            {/* Starter Plan */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="text-3xl font-bold">$20 / month</div>
                <p className="text-sm text-gray-400">For serious founders</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Everything in Hobby +</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Access to Proactiv AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Priority tools access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Support for Slack and Twitter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>99.67% Uptime SLA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Access to Aceternity UI Templates</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Get Started</Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gray-900 border-gray-800 ring-2 ring-cyan-400">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">$30 / month</div>
                <p className="text-sm text-gray-400">For small to large businesses</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Everything in Starter +</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Access to our dev team</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Coffee with the CEO</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Access to Aceternity UI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Request tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Customizable dashboards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Unlimited data storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Enhanced security features</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-cyan-400 text-black hover:bg-cyan-500">Get Started</Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold">Custom</div>
                <p className="text-sm text-gray-400">For large scale businesses</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Everything in Pro +</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>HIPAA and SOC2 compliance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Bulk email support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>Customizable dashboards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-cyan-400" />
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Book a demo</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-24 px-6 lg:px-8 border-t border-gray-800">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-medium text-gray-400 mb-12">
            Trusted by big industries
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-7">
            {[
              { name: 'Google', width: 120 },
              { name: 'Meta', width: 100 },
              { name: 'OnlyFans', width: 130 },
              { name: 'Netflix', width: 140 },
              { name: 'Google', width: 120 },
              { name: 'Meta', width: 100 },
              { name: 'OnlyFans', width: 130 },
            ].map((company, i) => (
              <div key={i} className="flex items-center justify-center">
                <Image
                  src={`/placeholder.svg?height=40&width=${company.width}`}
                  alt={company.name}
                  width={company.width}
                  height={40}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border-gray-800">
              <AccordionTrigger className="text-left hover:no-underline">
                What is Proactic?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Proactic is an AI-powered social media management platform that helps businesses and creators automate their social media presence, schedule posts, analyze performance, and engage with their audience more effectively.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-gray-800">
              <AccordionTrigger className="text-left hover:no-underline">
                How does Proactic work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Proactic uses advanced AI algorithms to help you create, schedule, and optimize your social media content. Simply connect your social media accounts, and our platform will help you manage everything from a single dashboard, providing insights and recommendations to improve your social media strategy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-gray-800">
              <AccordionTrigger className="text-left hover:no-underline">
                Which social media platforms does Proactic support?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Proactic supports all major social media platforms including Instagram, Twitter, Facebook, LinkedIn, TikTok, and more. We continuously add support for new platforms based on user demand and market trends.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-gray-800">
              <AccordionTrigger className="text-left hover:no-underline">
                Can I schedule posts in advance with Proactic?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Yes! You can schedule posts weeks or months in advance. Our AI will even suggest the best posting times for maximum engagement based on your audience's activity patterns and historical data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-gray-800">
              <AccordionTrigger className="text-left hover:no-underline">
                What kind of analytics does Proactic provide?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Proactic provides comprehensive analytics including engagement rates, audience growth, best performing content, optimal posting times, and competitor analysis. All metrics are presented in easy-to-understand dashboards with actionable insights.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 border-t border-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                Get started today with Proactiv to kickstart your marketing efforts
              </h2>
              <p className="text-lg text-gray-400">
                Proactiv houses the best in class software tools to kickstart your marketing journey. Join 127,000+ other users to get started.
              </p>

              <div className="space-y-4">
                <div className="flex -space-x-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="relative">
                      <Image
                        src={`/placeholder.svg?height=48&width=48`}
                        alt={`User ${i + 1}`}
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-black"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    Trusted by 27,000+ creators
                  </span>
                </div>
              </div>

              <Button className="bg-cyan-400 text-black hover:bg-cyan-500 px-8 py-6 text-lg">
                Book a demo →
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
              <div className="relative z-0">
                <Image
                  src="/placeholder.svg?height=800&width=1200"
                  alt="Proactiv dashboard preview"
                  width={1200}
                  height={800}
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Logo and Copyright */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white" />
                <span className="text-lg font-semibold">Proactiv</span>
              </Link>
              <div className="mt-4 text-sm text-gray-400">
                <p>Copyright 2024 Proactiv INC</p>
                <p>All rights reserved</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                {/* Company Links */}
                <div>
                  <ul className="space-y-3">
                    <li>
                      <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link href="#blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Legal Links */}
                <div>
                  <ul className="space-y-3">
                    <li>
                      <Link href="#privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="#terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link href="#refund" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Refund Policy
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        href="https://twitter.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="https://linkedin.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
