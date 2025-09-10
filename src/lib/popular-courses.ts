import { createClient } from "@/utils/supabase/server";
import { CoursePublic } from "@/types";

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
        const [enrollments, lessons, instructor, category, subcategory] =
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

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          shortDesc: course.shortDesc,
          thumbnail: course.thumbnail,
          price: parseFloat(course.price?.toString() || "0"),
          status: course.status,
          featured: course.featured,
          level: course.level,
          duration: course.duration,
          createdAt: new Date(course.createdAt),
          publishedAt: course.publishedAt ? new Date(course.publishedAt) : null,
          instructor: instructor.data
            ? {
                id: instructor.data.id,
                name: instructor.data.name,
                avatar: instructor.data.avatar,
                role: instructor.data.role,
                createdAt: new Date(instructor.data.createdAt),
              }
            : {
                id: "",
                name: "Instructor desconocido",
                avatar: null,
                role: "TEACHER" as const,
                createdAt: new Date(),
              },
          category: category?.data
            ? {
                id: category.data.id,
                name: category.data.name,
                slug: category.data.slug,
                description: category.data.description,
                image: category.data.image,
                subcategories: [],
              }
            : null,
          subcategory: subcategory?.data
            ? {
                id: subcategory.data.id,
                name: subcategory.data.name,
                slug: subcategory.data.slug,
                course_count: 0,
              }
            : null,
          _count: {
            lessons: lessons.count || 0,
            enrollments: enrollments.count || 0,
          },
        } as CoursePublic;
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
