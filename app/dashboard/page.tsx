"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { translations, type Language } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, User, Lock, Mail, Loader2 } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { userData, loading, signOut } = useAuth()
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    setLanguage(navigator.language.startsWith("tr") ? "tr" : "en")
  }, [])

  useEffect(() => {
    if (!loading && !userData) {
      router.push("/auth/login")
    }
  }, [loading, userData, router])

  const t = translations[language]

  const handleSignOut = async () => {
    await signOut()
    toast.success(language === "tr" ? "Çıkış yapıldı" : "Signed out successfully")
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <Loader2 className="animate-spin text-indigo-400" size={40} />
      </div>
    )
  }

  if (!userData) return null

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{t.dashboard}</h1>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white w-full sm:w-auto"
            >
              <LogOut size={18} className="mr-2" />
              {t.signOut}
            </Button>
          </div>

          {/* Profile Card */}
          <div className="animate-in fade-in zoom-in-95 duration-500 delay-100">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 shadow-2xl p-6 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <img
                  src={userData.profilePicture! || "/placeholder.svg"}
                  alt={userData.displayName || "User"}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-500/30 object-cover shadow-lg animate-in zoom-in duration-500 delay-200"
                  onError={(e) => {
                    e.currentTarget.src = `https://api.dicebear.com/8.x/initials/png?seed=${userData.displayName}`
                  }}
                />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                    {t.welcome}, {userData.displayName}!
                  </h2>
                  <p className="text-slate-400 text-sm break-all animate-in fade-in slide-in-from-left-4 duration-500 delay-400">
                    {userData.email}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <Link href="/dashboard/edit-profile">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 shadow-xl p-5 sm:p-6 hover:border-indigo-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-indigo-600/20 flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors shrink-0">
                      <User className="text-indigo-400" size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{t.editProfile}</h3>
                      <p className="text-slate-400 text-xs sm:text-sm">
                        {language === "tr" ? "Profilinizi düzenleyin" : "Update your profile information"}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
              <Link href="/dashboard/change-password">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 shadow-xl p-5 sm:p-6 hover:border-indigo-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-emerald-600/20 flex items-center justify-center group-hover:bg-emerald-600/30 transition-colors shrink-0">
                      <Lock className="text-emerald-400" size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{t.changePassword}</h3>
                      <p className="text-slate-400 text-xs sm:text-sm">
                        {language === "tr" ? "Şifrenizi güncelleyin" : "Update your password"}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
              <Link href="/dashboard/change-email">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 shadow-xl p-5 sm:p-6 hover:border-indigo-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-600/20 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors shrink-0">
                      <Mail className="text-purple-400" size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{t.changeEmail}</h3>
                      <p className="text-slate-400 text-xs sm:text-sm">
                        {language === "tr" ? "E-posta adresinizi güncelleyin" : "Update your email address"}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
