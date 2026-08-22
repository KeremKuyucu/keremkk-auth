"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        const code = searchParams.get("code")
        const next = searchParams.get("next") || "/dashboard"
        const error = searchParams.get("error") || searchParams.get("error_description")

        if (error) {
          throw new Error(error)
        }

        // 1. If PKCE authorization code is present in query parameters
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) throw exchangeError
          if (isMounted) router.replace(next)
          return
        }

        // 2. Check if a session already exists (e.g. Supabase parsed hash automatically)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (session) {
          if (isMounted) router.replace(next)
          return
        }

        // 3. Listen to auth state change in case hash is being processed asynchronously
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
          if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && newSession) {
            subscription.unsubscribe()
            if (isMounted) router.replace(next)
          }
        })

        // 4. Fallback timeout if no auth event fires within 4 seconds
        const timeout = setTimeout(() => {
          subscription.unsubscribe()
          if (isMounted) {
            router.replace("/dashboard")
          }
        }, 3500)

        return () => {
          clearTimeout(timeout)
          subscription.unsubscribe()
        }
      } catch (err: any) {
        console.error("Auth callback error:", err)
        if (isMounted) {
          setErrorMsg(err.message || "Giriş başarısız oldu")
          setTimeout(() => {
            router.replace("/auth/login")
          }, 2000)
        }
      }
    }

    handleCallback()

    return () => {
      isMounted = false
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-4">
      {errorMsg ? (
        <div className="text-center space-y-3 animate-in fade-in duration-300">
          <p className="text-rose-400 font-medium text-lg">{errorMsg}</p>
          <p className="text-slate-400 text-sm">Giriş sayfasına yönlendiriliyorsunuz...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-500">
          <Loader2 className="animate-spin text-indigo-400" size={44} />
          <p className="text-slate-200 text-base font-medium">Giriş yapılıyor, lütfen bekleyin...</p>
        </div>
      )}
    </div>
  )
}
