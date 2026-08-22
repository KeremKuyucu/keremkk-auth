import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // If 'next' is an absolute URL (for mobile deep links), redirect directly
      if (next.startsWith("http://") || next.startsWith("https://") || next.startsWith("myapp://")) {
        return NextResponse.redirect(next)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth code exchange failed — redirect to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`)
}
