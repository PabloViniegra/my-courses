// ===== ENUMS =====
export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";
export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type ActivityType =
  | "LOGIN"
  | "COURSE_CREATED"
  | "COURSE_UPDATED"
  | "COURSE_ENROLLED"
  | "PROFILE_UPDATED";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

// ===== BASE ENTITIES =====

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  supabaseId: string | null;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  course_count: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  subcategories: Subcategory[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  thumbnail: string | null;
  price: number;
  status: CourseStatus;
  featured: boolean;
  level: string | null;
  duration: number | null; // Duration in minutes
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  instructorId: string;
  categoryId: string | null;
  subcategoryId: string | null;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number | null; // Duration in seconds
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // 0-100
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  metadata: string | null; // JSON string
  createdAt: Date;
}

// ===== EXTENDED TYPES WITH RELATIONS =====

export interface UserWithRelations extends User {
  courses?: Course[];
  enrollments?: EnrollmentWithCourse[];
  activities?: UserActivity[];
}

export interface SubcategoryWithRelations extends Subcategory {
  category?: Category;
  courses?: Course[];
  _count?: {
    courses: number;
  };
}

export interface CourseWithRelations extends Course {
  instructor?: UserPublic;
  category?: Category;
  subcategory?: Subcategory;
  lessons?: Lesson[];
  enrollments?: Enrollment[];
  _count?: {
    lessons: number;
    enrollments: number;
  };
}

export interface LessonWithRelations extends Lesson {
  course?: Course;
}

export interface EnrollmentWithRelations extends Enrollment {
  user?: UserPublic;
  course?: CoursePublic;
}

// ===== PUBLIC/SAFE TYPES (para APIs y frontend) =====

export interface UserPublic {
  id: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface CoursePublic {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  thumbnail: string | null;
  price: number;
  status: CourseStatus;
  featured: boolean;
  level: string | null;
  duration: number | null;
  createdAt: Date;
  publishedAt: Date | null;
  instructor: UserPublic;
  category: Category | null;
  subcategory: Subcategory | null;
  lessons?: Lesson[];
  _count?: {
    lessons: number;
    enrollments: number;
  };
}

export interface EnrollmentWithCourse extends Enrollment {
  course: CoursePublic;
}

// ===== FORM TYPES =====

export interface CreateCourseData {
  title: string;
  description: string;
  shortDesc: string;
  price: number;
  categoryId: string;
  subcategoryId?: string;
  level: CourseLevel;
  thumbnail?: string;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  status?: CourseStatus;
  featured?: boolean;
  publishedAt?: Date | null;
}

export interface CreateLessonData {
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isPublished?: boolean;
  courseId: string;
}

export interface UpdateLessonData
  extends Partial<Omit<CreateLessonData, "courseId">> {
  id?: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CreateSubcategoryData {
  name: string;
  slug: string;
  categoryId: string;
}

export interface UpdateUserData {
  name?: string;
  avatar?: string;
  role?: UserRole;
}

// ===== SEARCH AND FILTER TYPES =====

export interface CourseFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  level?: CourseLevel;
  priceMin?: number;
  priceMax?: number;
  featured?: boolean;
  status?: CourseStatus;
}

export interface CourseSortOptions {
  field: "createdAt" | "price" | "title" | "enrollments";
  direction: "asc" | "desc";
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CoursesResponse {
  courses: CoursePublic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ===== AUTH TYPES =====

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  emailVerified: Date | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

// ===== COMPONENT PROPS TYPES =====

export interface CourseCardProps {
  course: CoursePublic;
  showInstructor?: boolean;
  showCategory?: boolean;
  className?: string;
}

export interface UserAvatarProps {
  user: UserPublic | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface LessonListProps {
  lessons: Lesson[];
  courseId: string;
  canEdit?: boolean;
  onLessonUpdate?: (lesson: Lesson) => void;
}

// ===== UTILITY TYPES =====

export type CreateInput<T> = Omit<T, "id" | "createdAt" | "updatedAt">;
export type UpdateInput<T> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;

// Para extraer tipos específicos de las relaciones
export type CourseInstructor = NonNullable<CourseWithRelations["instructor"]>;
export type CourseCategory = NonNullable<CourseWithRelations["category"]>;
export type CourseSubcategory = NonNullable<CourseWithRelations["subcategory"]>;

// ===== CONSTANTS =====

export const USER_ROLES: Record<UserRole, string> = {
  ADMIN: "Administrador",
  TEACHER: "Profesor",
  STUDENT: "Estudiante",
} as const;

export const COURSE_STATUSES: Record<CourseStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
} as const;

export const COURSE_LEVELS: Record<CourseLevel, string> = {
  Beginner: "Principiante",
  Intermediate: "Intermedio",
  Advanced: "Avanzado",
} as const;

export const ACTIVITY_TYPES: Record<ActivityType, string> = {
  LOGIN: "Inicio de sesión",
  COURSE_CREATED: "Curso creado",
  COURSE_UPDATED: "Curso actualizado",
  COURSE_ENROLLED: "Inscripción a curso",
  PROFILE_UPDATED: "Perfil actualizado",
} as const;

export const SORT_OPTIONS: Array<{
  field: CourseSortOptions['field'];
  label: string;
  directions: Array<{
    direction: CourseSortOptions['direction'];
    label: string;
  }>;
}> = [
  {
    field: 'createdAt',
    label: 'Fecha de creación',
    directions: [
      { direction: 'desc', label: 'Más recientes' },
      { direction: 'asc', label: 'Más antiguos' }
    ]
  },
  {
    field: 'title',
    label: 'Título',
    directions: [
      { direction: 'asc', label: 'A-Z' },
      { direction: 'desc', label: 'Z-A' }
    ]
  },
  {
    field: 'price',
    label: 'Precio',
    directions: [
      { direction: 'asc', label: 'Menor precio' },
      { direction: 'desc', label: 'Mayor precio' }
    ]
  },
  {
    field: 'enrollments',
    label: 'Popularidad',
    directions: [
      { direction: 'desc', label: 'Más populares' },
      { direction: 'asc', label: 'Menos populares' }
    ]
  }
] as const;

// ===== TYPE GUARDS =====

export function isUserRole(value: string): value is UserRole {
  return ["ADMIN", "TEACHER", "STUDENT"].includes(value);
}

export function isCourseStatus(value: string): value is CourseStatus {
  return ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(value);
}

export function isCourseLevel(value: string): value is CourseLevel {
  return ["Beginner", "Intermediate", "Advanced"].includes(value);
}

export function isActivityType(value: string): value is ActivityType {
  return [
    "LOGIN",
    "COURSE_CREATED",
    "COURSE_UPDATED",
    "COURSE_ENROLLED",
    "PROFILE_UPDATED",
  ].includes(value);
}

// ===== HELPER FUNCTIONS TYPES =====

export type FormatDuration = (minutes: number) => string;
export type FormatPrice = (price: number) => string;
export type FormatDate = (date: Date) => string;
export type GenerateSlug = (text: string) => string;

// ===== ERROR TYPES =====

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ValidationError[];
}

// ===== SUPABASE AUTH TYPES =====

export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
  };
  email_confirmed_at?: string;
}

// ===== METADATA TYPES =====

export interface CourseMetadata {
  totalLessons: number;
  totalDuration: number; // in minutes
  averageRating?: number;
  totalReviews?: number;
  lastUpdated: Date;
}

export interface UserActivityMetadata {
  courseId?: string;
  lessonId?: string;
  previousValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
}
