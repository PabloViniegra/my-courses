import { User } from "@/types";
import { createClient } from "@/utils/supabase/server";

interface CreateUserData {
  email: string;
  name: string;
  avatar: string | null;
  supabaseId: string;
}

export async function createUser(
  userData: CreateUserData
): Promise<User | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          supabaseId: userData.supabaseId,
          role: "STUDENT" as const,
          emailVerified: null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw new Error(`Failed to create user: ${error.message}`);
    }

    console.log("User created successfully:", data);
    return data as User;
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
}

export async function getUserBySupabaseId(
  supabaseId: string
): Promise<User | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("supabaseId", supabaseId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching user:", error);
      throw error;
    }

    return data as User;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

export async function updateUserVerification(
  supabaseId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .update({ emailVerified: new Date().toISOString() })
      .eq("supabaseId", supabaseId);

    if (error) {
      console.error("Error updating user verification:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Update verification error:", error);
    return false;
  }
}
