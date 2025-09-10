"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function publishCourse(courseId: string) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "You must be logged in to publish a course",
      };
    }

    // Get user data from our users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("supabaseId", user.id)
      .single();

    if (userError || !userData) {
      return {
        success: false,
        error: "User profile not found",
      };
    }

    // Get course data to verify ownership and current status
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*, instructor:users!courses_instructorId_fkey(*)")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      return {
        success: false,
        error: "Course not found",
      };
    }

    // Check if user can publish this course (must be ADMIN or course instructor)
    if (userData.role !== "ADMIN" && userData.id !== course.instructorId) {
      return {
        success: false,
        error: "You don't have permission to publish this course",
      };
    }

    // Check if course is already published
    if (course.status === "PUBLISHED") {
      return {
        success: false,
        error: "Course is already published",
      };
    }

    // Update course status to PUBLISHED
    const { error: updateError } = await supabase
      .from("courses")
      .update({
        status: "PUBLISHED",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", courseId);

    if (updateError) {
      console.error("Course publish error:", updateError);
      return {
        success: false,
        error: "Failed to publish course",
      };
    }

    // Log user activity
    await supabase.from("user_activities").insert({
      userId: userData.id,
      type: "COURSE_PUBLISHED",
      description: `Course published: ${course.title}`,
      metadata: JSON.stringify({ 
        courseId: course.id, 
        courseSlug: course.slug,
        previousStatus: "DRAFT",
        newStatus: "PUBLISHED"
      }),
    });

    // Revalidate relevant paths
    revalidatePath("/courses");
    revalidatePath(`/courses/${course.slug}`);
    revalidatePath("/private");

    return {
      success: true,
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        status: "PUBLISHED",
      },
    };
  } catch (error) {
    console.error("Publish course action error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish course",
    };
  }
}