import { createClient } from "@/utils/supabase/server";
import {
  CoursePublic,
  CourseFilters,
  CourseSortOptions,
  PaginatedResponse,
} from "@/types";

export interface GetCoursesParams {
  filters?: CourseFilters;
  sort?: CourseSortOptions;
  page?: number;
  limit?: number;
}

export async function getCourses({
  filters = {},
  sort = { field: "createdAt", direction: "desc" },
  page = 1,
  limit = 12,
}: GetCoursesParams): Promise<PaginatedResponse<CoursePublic>> {
  try {
    const supabase = await createClient();

    let query = supabase
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
      .eq("status", "PUBLISHED");

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,shortDesc.ilike.%${filters.search}%`
      );
    }

    if (filters.category) {
      query = query.eq("categoryId", filters.category);
    }
    if (filters.subcategory) {
      query = query.eq("subcategoryId", filters.subcategory);
    }

    if (filters.level) {
      query = query.eq("level", filters.level);
    }

    if (filters.priceMin !== undefined) {
      query = query.gte("price", filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
      query = query.lte("price", filters.priceMax);
    }

    if (filters.featured) {
      query = query.eq("featured", true);
    }

    const countQuery = supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("status", "PUBLISHED");

    if (filters.search) {
      countQuery.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,shortDesc.ilike.%${filters.search}%`
      );
    }
    if (filters.category) {
      countQuery.eq("categoryId", filters.category);
    }
    if (filters.subcategory) {
      countQuery.eq("subcategoryId", filters.subcategory);
    }
    if (filters.level) {
      countQuery.eq("level", filters.level);
    }
    if (filters.priceMin !== undefined) {
      countQuery.gte("price", filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
      countQuery.lte("price", filters.priceMax);
    }
    if (filters.featured) {
      countQuery.eq("featured", true);
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      console.error("Error fetching count:", countError);
    }

    const total = totalCount || 0;

    let orderColumn = sort.field;
    if (sort.field === "enrollments") {
      orderColumn = "createdAt";
    }

    query = query.order(orderColumn, { ascending: sort.direction === "asc" });

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: courses, error: coursesError } = await query;

    if (coursesError) {
      console.error("Error fetching courses:", coursesError);
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      };
    }

    if (!courses || courses.length === 0) {
      const totalPages = Math.ceil(total / limit);
      return {
        data: [],
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
        },
      };
    }

    const coursesWithRelations = await Promise.all(
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

    if (sort.field === "enrollments") {
      coursesWithRelations.sort((a, b) => {
        const aEnrollments = a._count?.enrollments || 0;
        const bEnrollments = b._count?.enrollments || 0;
        return sort.direction === "asc"
          ? aEnrollments - bEnrollments
          : bEnrollments - aEnrollments;
      });
    }

    const totalPages = Math.ceil(total / limit);

    return {
      data: coursesWithRelations,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0,
      },
    };
  }
}

export async function getCourseBySlug(
  slug: string
): Promise<CoursePublic | null> {
  try {
    const supabase = await createClient();

    const { data: course, error: courseError } = await supabase
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
      .eq("slug", slug)
      .single();

    if (courseError || !course) {
      console.error("Error fetching course by slug:", courseError);
      return null;
    }

    const [enrollments, lessons, instructor, category, subcategory] =
      await Promise.all([
        supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("courseId", course.id),
        supabase
          .from("lessons")
          .select(
            "id, title, description, videoUrl, duration, order, isPublished"
          )
          .eq("courseId", course.id)
          .eq("isPublished", true)
          .order("order"),
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
      lessons:
        lessons.data?.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          order: lesson.order,
          isPublished: lesson.isPublished,
          createdAt: new Date(),
          updatedAt: new Date(),
          courseId: course.id,
        })) || [],
      _count: {
        lessons: lessons.data?.length || 0,
        enrollments: enrollments.count || 0,
      },
    } as CoursePublic;
  } catch (error) {
    console.error("Error fetching course by slug:", error);
    return null;
  }
}

export async function getCategories(): Promise<
  Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    subcategories: Array<{
      id: string;
      name: string;
      slug: string;
      course_count: number;
    }>;
  }>
> {
  try {
    const supabase = await createClient();

    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select(
        `
        id,
        name,
        slug,
        description,
        image,
        subcategories:subcategories(id, name, slug)
      `
      )
      .order("name");

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      return [];
    }

    return (
      categories?.map((category) => ({
        ...category,
        subcategories:
          category.subcategories?.map(
            (sub: { id: string; name: string; slug: string }) => ({
              ...sub,
              course_count: 0,
            })
          ) || [],
      })) || []
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
