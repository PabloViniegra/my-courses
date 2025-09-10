import { createClient } from "@/utils/supabase/server";

export interface CourseBasic {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  price: number;
  thumbnail: string | null;
  level: string;
  status: string;
  instructor: {
    name: string;
    avatar: string | null;
  };
}

export async function getCoursesBySubcategory(subcategoryId: string, limit: number = 5): Promise<CourseBasic[]> {
  try {
    const supabase = await createClient();
    
    const { data: courses, error } = await supabase
      .from("courses")
      .select(`
        id,
        title,
        slug,
        shortDesc,
        price,
        thumbnail,
        level,
        status,
        instructor:users!courses_instructorId_fkey(
          name,
          avatar
        )
      `)
      .eq("subcategoryId", subcategoryId)
      .eq("status", "PUBLISHED") // Only show published courses
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching courses by subcategory:", error);
      return [];
    }

    // Transform the data to match CourseBasic interface
    const transformedCourses: CourseBasic[] = courses?.map(course => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      shortDesc: course.shortDesc,
      price: course.price,
      thumbnail: course.thumbnail,
      level: course.level,
      status: course.status,
      instructor: Array.isArray(course.instructor) ? course.instructor[0] : course.instructor
    })) || [];

    return transformedCourses;
  } catch (error) {
    console.error("Error in getCoursesBySubcategory:", error);
    return [];
  }
}