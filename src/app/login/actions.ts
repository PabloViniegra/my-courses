"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

interface LoginResult {
  success: boolean;
  error?: string;
}

export async function login(formData: FormData): Promise<LoginResult> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return error instead of redirecting
    return {
      success: false,
      error: error.message
    };
  }

  // Success - revalidate and redirect
  revalidatePath("/", "layout");
  redirect("/");
}

interface PasswordResetResult {
  success: boolean;
  error?: string;
}

export async function requestPasswordReset(email: string): Promise<PasswordResetResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      success: false,
      error: "Failed to send reset email"
    };
  }
}

export async function updatePassword(newPassword: string): Promise<PasswordResetResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Password update error:", error);
    return {
      success: false,
      error: "Failed to update password"
    };
  }
}

export async function signup({
  name,
  email,
  password,
  avatar,
}: {
  name: string;
  email: string;
  password: string;
  avatar: string;
}) {
  const supabase = await createClient();
  
  let avatarUrl: string | null = null;
  let supabaseUser: { id: string } | null = null;
  let avatarFilePath: string | null = null;

  try {
    // Step 1: Create Supabase auth user first
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
      },
    });

    if (signUpError) {
      throw new Error(`Signup failed: ${signUpError.message}`);
    }

    if (!data.user) {
      throw new Error("No user data returned from signup");
    }

    supabaseUser = data.user;

    // Step 2: Upload avatar with service role (bypass RLS)
    if (avatar && avatar.startsWith('data:')) {
      // Convert base64 to File
      const response = await fetch(avatar);
      const blob = await response.blob();
      const file = new File([blob], 'avatar.jpg', { type: blob.type });
      
      // Upload to Supabase storage (policy allows anon uploads)
      const { uploadAvatar } = await import("@/lib/upload-file");
      avatarUrl = await uploadAvatar(file, data.user.id);
      
      if (!avatarUrl) {
        throw new Error("Failed to upload avatar");
      }
      
      avatarFilePath = `${data.user.id}-${Date.now()}.jpg`;
    }

    // Step 3: Create user in our database
    const { createUser } = await import("@/lib/create-user");
    const user = await createUser({
      email: data.user.email!,
      name,
      avatar: avatarUrl,
      supabaseId: data.user.id,
    });

    if (!user) {
      throw new Error("Failed to create user record");
    }

    // Success - redirect to verification page
    revalidatePath("/", "layout");
    redirect("/auth/verify-email");

  } catch (error) {
    // Check if this is a Next.js redirect (expected behavior)
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
      throw error; // Re-throw redirect to let it work normally
    }
    
    console.error("Signup error:", error);

    // Rollback operations
    try {
      // Delete uploaded avatar if it exists
      if (avatarUrl && avatarFilePath) {
        const { deleteAvatar } = await import("@/lib/upload-file");
        await deleteAvatar(avatarFilePath);
      }

      // Delete Supabase auth user if it was created
      if (supabaseUser) {
        await supabase.auth.admin.deleteUser(supabaseUser.id);
      }
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError);
    }

    // Redirect to error page with message
    redirect(`/error?message=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error occurred")}`);
  }
}
