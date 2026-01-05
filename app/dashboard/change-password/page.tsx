"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase-client"
import { translations, type Language } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowLeft, KeyRound, Loader2, CheckCircle } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { userData, loading } = useAuth()
  const [language, setLanguage] = useState<Language>("en")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setLanguage(navigator.language.startsWith("tr") ? "tr" : "en")
  }, [])

  useEffect(() => {
    if (!loading && !userData) {
      router.push("/auth/login")
    }
  }, [loading, userData, router])

  const t = translations[language]

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error(language === "tr" ? "Şifreler eşleşmiyor" : "Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      toast.error(language === "tr" ? "Şifre en az 6 karakter olmalı" : "Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error

      toast.success(t.passwordChanged)
      setTimeout(() => router.push("/dashboard"), 1500)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <Loader2 className="animate-spin text-indigo-400" size={40} />
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              <span>{t.backToDashboard}</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">{t.changePassword}</h2>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t.newPasswordPlaceholder}
                    className="bg-slate-800/50 border-slate-700 pl-11 h-12 text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
                    required
                    minLength={6}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={language === "tr" ? "Şifreyi onayla" : "Confirm password"}
                    className="bg-slate-800/50 border-slate-700 pl-11 h-12 text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
                    required
                    minLength={6}
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
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
                        {t.changePassword}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
