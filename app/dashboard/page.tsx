"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { translations, type Language } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LogOut, User, Lock, Loader2 } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white">{t.dashboard}</h1>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white"
            >
              <LogOut size={18} className="mr-2" />
              {t.signOut}
            </Button>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 shadow-2xl p-8 mb-6">
              <div className="flex items-center gap-6">
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  src={userData.profilePicture!}
                  alt={userData.displayName || "User"}
                  className="w-24 h-24 rounded-full border-4 border-indigo-500/30 object-cover shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = `https://api.dicebear.com/8.x/initials/png?seed=${userData.displayName}`
                  }}
                />
                <div className="flex-1">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-white mb-1"
                  >
                    {t.welcome}, {userData.displayName}!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-400"
                  >
                    {userData.email}
                  </motion.p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Link href="/dashboard/edit-profile">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 shadow-xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-600/20 flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors">
                      <User className="text-indigo-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{t.editProfile}</h3>
                      <p className="text-slate-400 text-sm">
                        {language === "tr" ? "Profilinizi düzenleyin" : "Update your profile information"}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Link href="/dashboard/change-password">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 shadow-xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-600/20 flex items-center justify-center group-hover:bg-emerald-600/30 transition-colors">
                      <Lock className="text-emerald-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{t.changePassword}</h3>
                      <p className="text-slate-400 text-sm">
                        {language === "tr" ? "Şifrenizi güncelleyin" : "Update your password"}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
