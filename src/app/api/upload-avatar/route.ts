import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { uploadAvatarServiceRole } from "@/lib/upload-file";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting avatar upload process...");

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Error de autenticación: " + authError.message },
        { status: 401 }
      );
    }

    if (!user) {
      console.log("No user found in session");
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    console.log("User authenticated:", user.id);

    const { data: currentUser, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("supabaseId", user.id)
      .single();

    if (userError) {
      console.error("Error fetching user role:", userError);
      return NextResponse.json(
        {
          error: "Error al verificar permisos de usuario: " + userError.message,
        },
        { status: 500 }
      );
    }

    if (!currentUser) {
      console.log("User not found in database for supabaseId:", user.id);
      return NextResponse.json(
        { error: "Usuario no encontrado en la base de datos" },
        { status: 404 }
      );
    }

    if (currentUser.role !== "ADMIN") {
      console.log("User role is not ADMIN:", currentUser.role);
      return NextResponse.json(
        { error: "No tienes permisos para subir avatares" },
        { status: 403 }
      );
    }

    console.log("User has ADMIN role, proceeding with upload");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file provided in form data");
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!file.type.startsWith("image/")) {
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "El archivo debe ser una imagen" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log("File too large:", file.size);
      return NextResponse.json(
        { error: "El archivo no debe superar los 5MB" },
        { status: 400 }
      );
    }

    const tempId = `temp-${Date.now()}`;
    console.log("Uploading file with tempId:", tempId);

    let url: string | null = null;

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log("Using service role for upload");
      url = await uploadAvatarServiceRole(file, tempId);
    } else {
      console.log("Service role key not found, using authenticated client");
      const fileExt = file.name.split(".").pop();
      const fileName = `${tempId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error with authenticated client:", uploadError);
        if (uploadError.message.includes("Bucket not found")) {
          return NextResponse.json(
            {
              error:
                'Storage not configured. Please create the "avatars" bucket in your Supabase project.',
            },
            { status: 500 }
          );
        }
        return NextResponse.json(
          { error: "Error al subir archivo: " + uploadError.message },
          { status: 500 }
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      url = publicUrl;
    }

    console.log("Upload result:", url);

    if (!url) {
      console.error("Upload function returned null");
      return NextResponse.json(
        { error: "Error al subir el archivo al storage" },
        { status: 500 }
      );
    }

    console.log("Upload successful, returning URL:", url);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Avatar upload API error:", error);
    return NextResponse.json(
      {
        error:
          "Error interno del servidor: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
