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
import { motion } from "framer-motion"

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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
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
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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
          </motion.div>
        </form>
      </AuthLayout>
    </>
  )
}
