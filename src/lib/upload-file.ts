import { createClient } from "@/utils/supabase/server";
import {
  createClient as createSupabaseClient,
  SupabaseClient,
} from "@supabase/supabase-js";

export async function uploadAvatarWithAuth(
  file: File,
  userId: string,
  supabaseClient: SupabaseClient
): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabaseClient.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading avatar:", error);
      if (error.message.includes("Bucket not found")) {
        throw new Error(
          'Avatar storage not configured. Please create the "avatars" bucket in your Supabase project Storage section.'
        );
      }
      throw new Error(`Failed to upload avatar: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabaseClient.storage.from("avatars").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Avatar upload error:", error);
    return null;
  }
}

export async function uploadAvatarServiceRole(
  file: File,
  userId: string
): Promise<string | null> {
  try {
    console.log("uploadAvatarServiceRole: Starting upload for userId:", userId);
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing environment variables in upload function");
      throw new Error("Missing Supabase configuration");
    }

    const supabaseServiceRole = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    console.log("uploadAvatarServiceRole: Supabase client created");
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    console.log("uploadAvatarServiceRole: File details:", {
      originalName: file.name,
      extension: fileExt,
      generatedFileName: fileName,
      fileSize: file.size,
      fileType: file.type
    });

    console.log("uploadAvatarServiceRole: Attempting upload to avatars bucket...");

    const { data, error } = await supabaseServiceRole.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    console.log("uploadAvatarServiceRole: Upload response:", { data, error });

    if (error) {
      console.error("Error uploading avatar with service role:", error);
      if (error.message.includes("Bucket not found")) {
        throw new Error(
          'Avatar storage not configured. Please create the "avatars" bucket in your Supabase project Storage section.'
        );
      }
      if (error.message.includes("The resource already exists")) {
        console.log("File already exists, trying with upsert...");
        const { data: upsertData, error: upsertError } = await supabaseServiceRole.storage
          .from("avatars")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });
        
        if (upsertError) {
          console.error("Upsert also failed:", upsertError);
          throw new Error(`Failed to upload avatar: ${upsertError.message}`);
        }
        console.log("Upsert successful:", upsertData);
      } else {
        throw new Error(`Failed to upload avatar: ${error.message}`);
      }
    }

    console.log("uploadAvatarServiceRole: Getting public URL for path:", filePath);

    const {
      data: { publicUrl },
    } = supabaseServiceRole.storage.from("avatars").getPublicUrl(filePath);

    console.log("uploadAvatarServiceRole: Generated public URL:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error("Avatar upload error (service role):", error);
    return null;
  }
}

export async function uploadAvatar(
  file: File,
  userId: string
): Promise<string | null> {
  try {
    const supabase = await createClient();

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading avatar:", error);
      if (error.message.includes("Bucket not found")) {
        throw new Error(
          'Avatar storage not configured. Please create the "avatars" bucket in your Supabase project Storage section.'
        );
      }
      throw new Error(`Failed to upload avatar: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Avatar upload error:", error);
    return null;
  }
}

export async function deleteAvatar(filePath: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.storage.from("avatars").remove([filePath]);

    if (error) {
      console.error("Error deleting avatar:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Avatar deletion error:", error);
    return false;
  }
}
