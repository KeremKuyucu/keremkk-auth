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
import { ArrowLeft, User, ImageIcon, Loader2, Save } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"

export default function EditProfilePage() {
  const router = useRouter()
  const { userData, loading } = useAuth()
  const [language, setLanguage] = useState<Language>("en")
  const [displayName, setDisplayName] = useState("")
  const [profileUrl, setProfileUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setLanguage(navigator.language.startsWith("tr") ? "tr" : "en")
  }, [])

  useEffect(() => {
    if (!loading && !userData) {
      router.push("/auth/login")
    }
    if (userData) {
      setDisplayName(userData.displayName || "")
      setProfileUrl(userData.profilePicture || "")
    }
  }, [loading, userData, router])

  const t = translations[language]

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let finalAvatarUrl = profileUrl
      const isDefaultAvatar = profileUrl.includes("api.dicebear.com/8.x/initials") || !profileUrl

      if (isDefaultAvatar) {
        finalAvatarUrl = `https://api.dicebear.com/8.x/initials/png?seed=${displayName || userData?.uid}`
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: displayName,
          avatar_url: finalAvatarUrl,
        },
      })
      if (authError) throw authError

      toast.success(t.profileUpdated)
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
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">{t.editProfile}</h2>

              <form onSubmit={handleUpdateProfile} className="space-y-5 sm:space-y-6">
                <div className="flex justify-center mb-6">
                  <img
                    src={profileUrl || `https://api.dicebear.com/8.x/initials/png?seed=${displayName}`}
                    alt={displayName}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-indigo-500/30 object-cover shadow-lg animate-in zoom-in duration-500 delay-200"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.dicebear.com/8.x/initials/png?seed=${displayName}`
                    }}
                  />
                </div>

                <div className="relative animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t.displayName}
                    className="bg-slate-800/50 border-slate-700 pl-11 h-11 sm:h-12 text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="relative animate-in fade-in slide-in-from-left-4 duration-500 delay-400">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <Input
                    type="url"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder={t.profileUrl}
                    className="bg-slate-800/50 border-slate-700 pl-11 h-11 sm:h-12 text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                  />
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 sm:h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Save size={20} />
                        {t.saveChanges}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
