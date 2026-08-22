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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || t.loginError)
      setIsGoogleLoading(false)
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

          {/* Separator */}
          <div className="relative animate-in fade-in duration-500 delay-650">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/50 px-2 text-slate-500">{t.orContinueWith}</span>
            </div>
          </div>

          {/* Google Sign In */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-700">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              variant="outline"
              className="w-full h-12 bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white font-medium rounded-lg transition-all"
            >
              {isGoogleLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                <svg className="mr-2" width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {isGoogleLoading ? t.signingInWithGoogle : t.googleSignIn}
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-slate-800 animate-in fade-in duration-500 delay-750">
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
