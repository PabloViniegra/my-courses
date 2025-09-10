"use server";

import { revalidatePath } from "next/cache";
import { CreateProfessorData, ApiResponse } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function createProfessorAction(
  data: CreateProfessorData
): Promise<ApiResponse<{ id: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Usuario no autenticado",
      };
    }

    const { data: currentUser, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("supabaseId", user.id)
      .single();

    if (userError || !currentUser || currentUser.role !== "ADMIN") {
      return {
        success: false,
        error: "No tienes permisos para realizar esta acción",
      };
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", data.email)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: "Ya existe un usuario con este email",
      };
    }

    let createdUserId: string;
    let successMessage: string;

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log("Using service role to create professor with auth user");

      const supabaseServiceRole = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: authUser, error: authError } =
        await supabaseServiceRole.auth.admin.createUser({
          email: data.email,
          password: generateRandomPassword(),
          email_confirm: true,
          user_metadata: {
            full_name: data.name,
            name: data.name,
          },
        });

      if (authError || !authUser.user) {
        console.error("Error creating Supabase auth user:", authError);
        return {
          success: false,
          error: "Error al crear el usuario de autenticación",
        };
      }

      const { data: newUser, error: dbError } = await supabase
        .from("users")
        .insert({
          email: data.email,
          name: data.name,
          avatar: data.avatar || null,
          role: "TEACHER",
          supabaseId: authUser.user.id,
          emailVerified: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (dbError || !newUser) {
        console.error("Error creating user in database:", dbError);

        await supabaseServiceRole.auth.admin.deleteUser(authUser.user.id);

        return {
          success: false,
          error: "Error al crear el usuario en la base de datos",
        };
      }

      createdUserId = newUser.id;
      successMessage =
        "Profesor creado exitosamente con usuario de autenticación";

      try {
        const { error: inviteError } =
          await supabaseServiceRole.auth.admin.inviteUserByEmail(data.email, {
            redirectTo: `${
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
            }/auth/callback`,
          });

        if (inviteError) {
          console.warn("Error sending invitation email:", inviteError);
        } else {
          successMessage += " y email de invitación enviado";
        }
      } catch (inviteErr) {
        console.warn("Failed to send invitation email:", inviteErr);
      }
    } else {
      console.log(
        "Service role key not available, creating professor without auth user"
      );

      const { data: newUser, error: dbError } = await supabase
        .from("users")
        .insert({
          email: data.email,
          name: data.name,
          avatar: data.avatar || null,
          role: "TEACHER",
          supabaseId: null,
          emailVerified: null,
        })
        .select("id")
        .single();

      if (dbError || !newUser) {
        console.error("Error creating user in database:", dbError);
        return {
          success: false,
          error: "Error al crear el profesor en la base de datos",
        };
      }

      createdUserId = newUser.id;
      successMessage =
        "Profesor creado exitosamente. Deberá registrarse manualmente en el sistema";
    }

    revalidatePath("/private");
    revalidatePath("/admin");

    return {
      success: true,
      data: { id: createdUserId },
      message: successMessage,
    };
  } catch (error) {
    console.error("Unexpected error creating professor:", error);
    return {
      success: false,
      error: "Error inesperado al crear el profesor",
    };
  }
}

function generateRandomPassword(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}
