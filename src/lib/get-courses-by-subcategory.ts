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

    return courses as CourseBasic[];
  } catch (error) {
    console.error("Error in getCoursesBySubcategory:", error);
    return [];
  }
}