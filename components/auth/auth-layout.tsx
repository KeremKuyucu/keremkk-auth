"use client"

import type React from "react"

import { Card } from "@/components/ui/card"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 shadow-2xl p-6 sm:p-8">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 animate-in fade-in slide-in-from-top-2 duration-500 delay-100">
              {title}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm animate-in fade-in duration-500 delay-200">{subtitle}</p>
          </div>
          {children}
        </Card>
      </div>
    </div>
  )
}
