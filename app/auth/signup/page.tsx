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
import { Mail, KeyRound, Loader2, User } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    setLanguage(navigator.language.startsWith("tr") ? "tr" : "en")
  }, [])

  const t = translations[language]

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName || email.split("@")[0],
          },
        },
      })
      if (error) throw error

      if (data.user && !data.session) {
        toast.success(t.checkEmail)
      } else {
        toast.success(t.loginSuccess)
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast.error(error.message || t.loginError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <AuthLayout title={t.signUpTitle} subtitle={t.signUpSubtitle}>
        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="relative animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.displayName}
              className="bg-slate-800/50 border-slate-700 pl-11 h-12 text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="relative animate-in fade-in slide-in-from-left-4 duration-500 delay-400">
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

          <div className="relative animate-in fade-in slide-in-from-left-4 duration-500 delay-500">
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

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-600">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : t.signUp}
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-slate-800 animate-in fade-in duration-500 delay-700">
            <p className="text-slate-400 text-sm">
              {t.haveAccount}{" "}
              <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                {t.signIn}
              </Link>
            </p>
          </div>
        </form>
      </AuthLayout>
    </>
  )
}
