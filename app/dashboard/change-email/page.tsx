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
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"

export default function ChangeEmailPage() {
  const router = useRouter()
  const { userData, loading } = useAuth()
  const [language, setLanguage] = useState<Language>("en")
  const [newEmail, setNewEmail] = useState("")
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

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEmail || !newEmail.includes("@")) {
      toast.error(language === "tr" ? "Geçerli bir e-posta adresi girin" : "Please enter a valid email address")
      return
    }

    if (newEmail === userData?.email) {
      toast.error(language === "tr" ? "Yeni e-posta mevcut ile aynı" : "New email is the same as current email")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      })
      if (error) throw error

      toast.success(t.emailChangeSuccess)
      setNewEmail("")
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm sm:text-base"
            >
              <ArrowLeft size={20} />
              <span>{t.backToDashboard}</span>
            </Link>
          </div>

          <div className="animate-in fade-in zoom-in-95 duration-500 delay-100">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 shadow-2xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t.changeEmail}</h2>
              <p className="text-slate-400 text-sm mb-6">{t.changeEmailDesc}</p>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 mb-6 animate-in fade-in duration-500 delay-200">
                <p className="text-slate-300 text-sm">
                  <span className="font-medium">{language === "tr" ? "Mevcut E-posta:" : "Current Email:"}</span>{" "}
                  <span className="text-indigo-400 break-all">{userData.email}</span>
                </p>
              </div>

              <form onSubmit={handleChangeEmail} className="space-y-5 sm:space-y-6">
                <div className="relative animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={t.newEmailPlaceholder}
                    className="bg-slate-800/50 border-slate-700 pl-11 h-11 sm:h-12 text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 sm:h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        {t.changeEmail}
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 animate-in fade-in duration-500 delay-500">
                  <p className="text-blue-300 text-xs sm:text-sm">
                    {language === "tr"
                      ? "⚠️ E-posta değişikliğini onaylamak için yeni e-posta adresinize gönderilen bağlantıya tıklamanız gerekecek."
                      : "⚠️ You will need to confirm the email change by clicking the link sent to your new email address."}
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
