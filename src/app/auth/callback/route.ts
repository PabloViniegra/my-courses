import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { updateUserVerification, getUserBySupabaseId, createUser } from "@/lib/create-user";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const isSignup = searchParams.get("signup") === "true";
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      try {
        // Check if user exists in our database
        const existingUser = await getUserBySupabaseId(data.user.id);
        
        if (!existingUser && isSignup) {
          // Create new user for OAuth signup
          await createUser({
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email!.split('@')[0],
            avatar: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
            supabaseId: data.user.id,
          });
        } else if (existingUser) {
          // Update existing user verification status
          await updateUserVerification(data.user.id);
        }
      } catch (userError) {
        console.error("Failed to handle OAuth user:", userError);
        // Continue anyway, as the auth succeeded
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
