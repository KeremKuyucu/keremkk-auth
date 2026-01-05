"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase-client"
import { translations, type Language } from "@/lib/translations"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, KeyRound, Loader2 } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    setLanguage(navigator.language.startsWith("tr") ? "tr" : "en")
  }, [])

  const t = translations[language]

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success(t.loginSuccess)
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || t.loginError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <AuthLayout title={t.loginTitle} subtitle={t.loginSubtitle}>
        <form onSubmit={handleSignIn} className="space-y-5">
          <div className="relative animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="bg-slate-800/50 border-slate-700 pl-11 h-12 text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div className="relative animate-in fade-in slide-in-from-left-4 duration-500 delay-400">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="bg-slate-800/50 border-slate-700 pl-11 h-12 text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div className="flex justify-end animate-in fade-in duration-500 delay-500">
            <Link
              href="/auth/reset-password"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {t.forgotPassword}
            </Link>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-600">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : t.signIn}
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-slate-800 animate-in fade-in duration-500 delay-700">
            <p className="text-slate-400 text-sm">
              {t.noAccount}{" "}
              <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
                {t.signUp}
              </Link>
            </p>
          </div>
        </form>
      </AuthLayout>
    </>
  )
}
