import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getCategories } from "@/lib/courses";
import { CreateCourseForm } from "@/components/courses/create-course-form";
import { CreateCourseSkeleton } from "@/components/skeletons/create-course-skeleton";
import RSCNavbar from "@/components/server/rsc-navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

async function CreateCourseData() {
  // Get authenticated user
  const supabase = await createClient();
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
    redirect("/login");
  }

  // Check if user has permission to create courses
  if (!["ADMIN", "TEACHER"].includes(userData.role)) {
    redirect("/private");
  }

  // Get categories for the form
  const categories = await getCategories();

  return <CreateCourseForm categories={categories} />;
}

export default async function CreateCoursePage() {
  return (
    <div className="min-h-screen bg-background">
      <RSCNavbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6 font-sans">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/private"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium">
                Create Course
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/private"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-sans flex items-center gap-3">
              <Plus className="h-8 w-8 text-primary" />
              Create New Course
            </h1>
            <p className="text-muted-foreground font-serif text-lg">
              Share your knowledge and create an engaging learning experience for students.
            </p>
          </div>
        </div>

        {/* Form */}
        <Suspense fallback={<CreateCourseSkeleton />}>
          <CreateCourseData />
        </Suspense>
      </div>
    </div>
  );
}