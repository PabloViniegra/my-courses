import { CoursePublic, CourseLevel, COURSE_LEVELS, CourseStatus, UserRole } from "@/types";

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
  }
  return `${mins}m`;
};

export const formatPrice = (price: number, currency: "USD" | "EUR" = "EUR"): string => {
  if (price === 0) return currency === "USD" ? "Free" : "Gratis";
  
  const locale = currency === "USD" ? "en-US" : "es-ES";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(price);
};

export const formatDate = (date: Date, locale: "en-US" | "es-ES" = "es-ES"): string => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

interface SupabaseCourse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  thumbnail: string | null;
  price: number | string;
  status: CourseStatus;
  featured: boolean;
  level: string | null;
  duration: number | null;
  createdAt: string;
  publishedAt: string | null;
  instructorId: string;
  categoryId: string | null;
  subcategoryId: string | null;
}

interface SupabaseInstructor {
  id: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  createdAt: string;
}

interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface SupabaseSubcategory {
  id: string;
  name: string;
  slug: string;
}

interface SupabaseLesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number | null;
  order: number;
  isPublished: boolean;
}

export const mapSupabaseCourseToPublic = (
  course: SupabaseCourse,
  instructor?: SupabaseInstructor,
  category?: SupabaseCategory,
  subcategory?: SupabaseSubcategory,
  enrollments?: { count: number },
  lessons?: SupabaseLesson[]
): CoursePublic => {
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
    instructor: instructor
      ? {
          id: instructor.id,
          name: instructor.name,
          avatar: instructor.avatar,
          role: instructor.role,
          createdAt: new Date(instructor.createdAt),
        }
      : {
          id: "",
          name: "Instructor desconocido",
          avatar: null,
          role: "TEACHER" as const,
          createdAt: new Date(),
        },
    category: category
      ? {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          subcategories: [],
        }
      : null,
    subcategory: subcategory
      ? {
          id: subcategory.id,
          name: subcategory.name,
          slug: subcategory.slug,
          course_count: 0,
        }
      : null,
    lessons:
      lessons?.map((lesson) => ({
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
      lessons: lessons?.length || 0,
      enrollments: enrollments?.count || 0,
    },
  };
};

export const mapFormDataToObject = (formData: FormData): Record<string, string> => {
  const result: Record<string, string> = {};
  
  for (const [key, value] of formData.entries()) {
    if (value !== undefined && value !== "") {
      result[key] = value.toString();
    }
  }
  
  return result;
};

export const getCourseLevelLabel = (level: CourseLevel | string): string => {
  return COURSE_LEVELS[level as CourseLevel] || level;
};

export const mapCategoriesToSelectOptions = (
  categories: Array<{
    id: string;
    name: string;
    subcategories: Array<{ id: string; name: string }>;
  }>
) => {
  return categories.map(category => ({
    value: category.id,
    label: category.name,
    subcategories: category.subcategories.map(sub => ({
      value: sub.id,
      label: sub.name,
    })),
  }));
};