import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function POST(request: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  try {
    const body = await request.json()
    const { idToken, accessToken } = body

    if (!idToken) {
      return NextResponse.json(
        { error: "idToken is required" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Create a fresh Supabase client for this request
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
      access_token: accessToken,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          expires_at: data.session?.expires_at,
        },
        user: {
          id: data.user?.id,
          email: data.user?.email,
          full_name: data.user?.user_metadata?.full_name,
          avatar_url: data.user?.user_metadata?.avatar_url,
        },
      },
      { status: 200, headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}
