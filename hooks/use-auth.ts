"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

export type UserData = {
  uid: string
  displayName: string | null
  email: string | null
  profilePicture: string | null
  accessToken?: string | null
  refreshToken?: string | null
}

export function useAuth() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const processUser = useCallback((user: User, accessToken?: string, refreshToken?: string) => {
    const metadata = user.user_metadata || {}
    const userDataObj: UserData = {
      uid: user.id,
      displayName: metadata.full_name || user.email?.split("@")[0] || "User",
      email: user.email || null,
      profilePicture:
        metadata.avatar_url || `https://api.dicebear.com/8.x/initials/png?seed=${metadata.full_name || user.email}`,
      accessToken,
      refreshToken,
    }
    setUserData(userDataObj)
  }, [])

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        processUser(session.user, session.access_token, session.refresh_token)
      }
      setLoading(false)
    }
    checkSession()

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        processUser(session.user, session.access_token, session.refresh_token)
      } else if (event === "SIGNED_OUT") {
        setUserData(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [processUser])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUserData(null)
  }

  return { userData, loading, signOut }
}
