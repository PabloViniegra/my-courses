"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCourse(formData: FormData) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect("/login");
    }

    // Get user data from our users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("supabaseId", user.id)
      .single();

    if (userError || !userData) {
      throw new Error("User not found");
    }

    // Check if user has permission to create courses
    if (!["ADMIN", "TEACHER"].includes(userData.role)) {
      throw new Error("You don't have permission to create courses");
    }

    // Extract form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const shortDesc = formData.get("shortDesc") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const subcategoryId = (formData.get("subcategoryId") as string) || null;
    const level = formData.get("level") as string;
    const thumbnail = (formData.get("thumbnail") as string) || null;
    const shouldPublish = formData.get("publish") === "true";

    // Validate required fields
    if (!title || !description || !shortDesc || !categoryId || !level) {
      throw new Error("Missing required fields");
    }

    // Generate slug
    const baseSlug = generateSlug(title);
    
    // Check if slug exists and make it unique
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const { data: existingCourse } = await supabase
        .from("courses")
        .select("slug")
        .eq("slug", slug)
        .single();
      
      if (!existingCourse) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create the course with appropriate status
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert({
        title,
        slug,
        description,
        shortDesc,
        price,
        status: shouldPublish ? "PUBLISHED" : "DRAFT",
        featured: false,
        level,
        thumbnail,
        instructorId: userData.id,
        categoryId,
        subcategoryId,
      })
      .select()
      .single();

    if (courseError) {
      console.error("Course creation error:", courseError);
      throw new Error("Failed to create course");
    }

    // Log user activity
    const activityType = shouldPublish ? "COURSE_PUBLISHED" : "COURSE_CREATED";
    const activityDescription = shouldPublish 
      ? `Course published: ${title}` 
      : `Course created: ${title}`;
    
    await supabase.from("user_activities").insert({
      userId: userData.id,
      type: activityType,
      description: activityDescription,
      metadata: JSON.stringify({ courseId: course.id, courseSlug: slug, status: course.status }),
    });

    // Revalidate relevant paths
    revalidatePath("/private");
    revalidatePath("/courses");

    return {
      success: true,
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
      },
    };
  } catch (error) {
    console.error("Create course action error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create course",
    };
  }
}