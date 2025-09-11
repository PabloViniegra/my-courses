import { createClient } from "@/utils/supabase/server";
import { CoursePublic } from "@/types";
import { mapSupabaseCourseToPublic } from "@/utils/mappers";

export async function getPopularCourses(
  limit: number = 8
): Promise<CoursePublic[]> {
  try {
    const supabase = await createClient();

    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select(
        `
        id,
        title,
        slug,
        description,
        shortDesc,
        thumbnail,
        price,
        status,
        featured,
        level,
        duration,
        createdAt,
        publishedAt,
        instructorId,
        categoryId,
        subcategoryId
      `
      )
      .eq("status", "PUBLISHED")
      .order("createdAt", { ascending: false });

    if (coursesError) {
      console.error("Error fetching courses:", coursesError);
      return [];
    }

    if (!courses || courses.length === 0) {
      return [];
    }

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const [enrollments, , instructor, category, subcategory] =
          await Promise.all([
            supabase
              .from("enrollments")
              .select("*", { count: "exact", head: true })
              .eq("courseId", course.id),
            supabase
              .from("lessons")
              .select("*", { count: "exact", head: true })
              .eq("courseId", course.id),
            supabase
              .from("users")
              .select("id, name, avatar, role, createdAt")
              .eq("id", course.instructorId)
              .single(),
            course.categoryId
              ? supabase
                  .from("categories")
                  .select("id, name, slug, description, image")
                  .eq("id", course.categoryId)
                  .single()
              : null,
            course.subcategoryId
              ? supabase
                  .from("subcategories")
                  .select("id, name, slug")
                  .eq("id", course.subcategoryId)
                  .single()
              : null,
          ]);

        return mapSupabaseCourseToPublic(
          course,
          instructor.data || undefined,
          category?.data || undefined,
          subcategory?.data || undefined,
          { count: enrollments.count || 0 }
        );
      })
    );

    const popularCourses = coursesWithStats
      .sort(
        (a, b) => (b._count?.enrollments || 0) - (a._count?.enrollments || 0)
      )
      .slice(0, limit);

    return popularCourses;
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    return [];
  }
}
