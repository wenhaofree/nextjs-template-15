"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter, Youtube, MessageCircle } from "lucide-react"
import { useTheme } from "next-themes"

interface FooterProps {
  footer?: {
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      subscribe: string;
      subscribeAria: string;
    };
    quickLinks: {
      title: string;
      home: string;
      features: string;
      pricing: string;
      gallery: string;
      blog: string;
      about: string;
    };
    resources: {
      title: string;
      documentation: string;
      tutorials: string;
      community: string;
      support: string;
      api: string;
    };
    company: {
      title: string;
      about: string;
      careers: string;
      press: string;
      contact: string;
      partners: string;
    };
    social: {
      title: string;
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
      youtube: string;
      discord: string;
    };
    legal: {
      title: string;
      privacy: string;
      terms: string;
      cookies: string;
      dmca: string;
    };
    contact: {
      title: string;
      address: string;
      email: string;
      phone: string;
      hours: string;
    };
    theme: {
      light: string;
      dark: string;
      toggle: string;
    };
    copyright: string;
    tagline: string;
  };
}

function Footer({ footer }: FooterProps) {
  const { theme, setTheme } = useTheme()

  // If no footer data is provided, return null or a default footer
  if (!footer) {
    return null;
  }

  return (
    <footer className="relative border-t bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-background transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_50%,#3c8dfc05,transparent)]" />
        <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f03_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f03_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Newsletter Section */}
          <div className="relative lg:col-span-2">
            <h2 className="mb-4 text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {footer.newsletter.title}
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed">
              {footer.newsletter.description}
            </p>
            <form className="relative mb-6">
              <Input
                type="email"
                placeholder={footer.newsletter.placeholder}
                className="pr-12 backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-full h-12"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">{footer.newsletter.subscribeAria}</span>
              </Button>
            </form>
            <p className="text-sm text-muted-foreground italic">{footer.tagline}</p>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">{footer.quickLinks.title}</h3>
            <nav className="space-y-3 text-sm">
              <a href="#hero" className="block transition-colors hover:text-primary font-medium">
                {footer.quickLinks.home}
              </a>
              <a href="#benefit" className="block transition-colors hover:text-primary">
                {footer.quickLinks.features}
              </a>
              <a href="#pricing" className="block transition-colors hover:text-primary">
                {footer.quickLinks.pricing}
              </a>
              <a href="#showcase" className="block transition-colors hover:text-primary">
                {footer.quickLinks.gallery}
              </a>
              <a href="/blog" className="block transition-colors hover:text-primary">
                {footer.quickLinks.blog}
              </a>
              <a href="/about" className="block transition-colors hover:text-primary">
                {footer.quickLinks.about}
              </a>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">{footer.resources.title}</h3>
            <nav className="space-y-3 text-sm">
              <a href="/docs" className="block transition-colors hover:text-primary">
                {footer.resources.documentation}
              </a>
              <a href="/tutorials" className="block transition-colors hover:text-primary">
                {footer.resources.tutorials}
              </a>
              <a href="/community" className="block transition-colors hover:text-primary">
                {footer.resources.community}
              </a>
              <a href="/support" className="block transition-colors hover:text-primary">
                {footer.resources.support}
              </a>
              <a href="/api" className="block transition-colors hover:text-primary">
                {footer.resources.api}
              </a>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">{footer.company.title}</h3>
            <nav className="space-y-3 text-sm">
              <a href="/about" className="block transition-colors hover:text-primary">
                {footer.company.about}
              </a>
              <a href="/careers" className="block transition-colors hover:text-primary">
                {footer.company.careers}
              </a>
              <a href="/press" className="block transition-colors hover:text-primary">
                {footer.company.press}
              </a>
              <a href="/contact" className="block transition-colors hover:text-primary">
                {footer.company.contact}
              </a>
              <a href="/partners" className="block transition-colors hover:text-primary">
                {footer.company.partners}
              </a>
            </nav>
          </div>
        </div>

        {/* Social Media and Contact Section */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Social Media */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">{footer.social.title}</h3>
            <div className="flex flex-wrap gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{footer.social.facebook}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{footer.social.twitter}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-pink-50 hover:border-pink-200 dark:hover:bg-pink-900/20">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{footer.social.instagram}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{footer.social.linkedin}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20">
                      <Youtube className="h-4 w-4" />
                      <span className="sr-only">YouTube</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{footer.social.youtube}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-900/20">
                      <MessageCircle className="h-4 w-4" />
                      <span className="sr-only">Discord</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{footer.social.discord}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">{footer.contact.title}</h3>
            <address className="space-y-3 text-sm not-italic text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {footer.contact.address}
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <a href={`mailto:${footer.contact.email}`} className="hover:text-primary transition-colors">
                  {footer.contact.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <a href={`tel:${footer.contact.phone}`} className="hover:text-primary transition-colors">
                  {footer.contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                {footer.contact.hours}
              </p>
            </address>
          </div>

          {/* Theme Toggle */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">{footer.theme.toggle}</h3>
            <div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-full w-fit">
              <Sun className="h-4 w-4 text-orange-500" />
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="data-[state=checked]:bg-blue-600"
              />
              <Moon className="h-4 w-4 text-blue-500" />
              <Label htmlFor="dark-mode" className="sr-only">
                {footer.theme.toggle}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {theme === "dark" ? footer.theme.dark : footer.theme.light}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-gray-200 dark:border-gray-700 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            {footer.copyright}
          </p>
          <nav className="flex flex-wrap gap-6 text-sm">
            <a href="/privacy" className="transition-colors hover:text-primary">
              {footer.legal.privacy}
            </a>
            <a href="/terms" className="transition-colors hover:text-primary">
              {footer.legal.terms}
            </a>
            <a href="/cookies" className="transition-colors hover:text-primary">
              {footer.legal.cookies}
            </a>
            <a href="/dmca" className="transition-colors hover:text-primary">
              {footer.legal.dmca}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footer }