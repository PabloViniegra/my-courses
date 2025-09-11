export interface CreateCourseFormData {
  title: string;
  shortDesc: string;
  description: string;
  price: number;
  categoryId: string;
  subcategoryId?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail?: string;
}