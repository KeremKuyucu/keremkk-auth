"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { userData, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (userData) {
        router.push("/dashboard")
      } else {
        router.push("/auth/login")
      }
    }
  }, [loading, userData, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Loader2 className="animate-spin text-indigo-400" size={48} />
    </div>
  )
}
