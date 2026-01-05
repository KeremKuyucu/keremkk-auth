"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { translations, type Language } from "@/lib/translations"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound, Loader2, CheckCircle } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    setLanguage(navigator.language.startsWith("tr") ? "tr" : "en")
  }, [])

  const t = translations[language]

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success(t.updateSuccess)
      setTimeout(() => router.push("/dashboard"), 1500)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <AuthLayout title={t.updatePasswordTitle} subtitle={t.updatePasswordDesc}>
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div className="relative animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.newPasswordPlaceholder}
              className="bg-slate-800/50 border-slate-700 pl-11 h-12 text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
              required
              minLength={6}
            />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <CheckCircle size={20} />
                  {t.updatePasswordBtn}
                </>
              )}
            </Button>
          </div>
        </form>
      </AuthLayout>
    </>
  )
}
