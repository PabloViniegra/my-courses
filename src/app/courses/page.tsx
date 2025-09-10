import { Suspense } from "react";
import { BookOpen } from "lucide-react";
import { getCourses, getCategories } from "@/lib/courses";
import { CoursesClient } from "@/components/courses/courses-client";
import { CoursesPageSkeleton } from "@/components/skeletons/courses-page-skeleton";
import { CourseFilters, CourseSortOptions, CourseLevel } from "@/types";
import RSCNavbar from "@/components/server/rsc-navbar";

interface CoursesPageProps {
  searchParams: {
    q?: string;
    category?: string;
    subcategory?: string;
    level?: CourseLevel;
    priceMin?: string;
    priceMax?: string;
    featured?: string;
    sortField?: CourseSortOptions["field"];
    sortDirection?: CourseSortOptions["direction"];
    page?: string;
  };
}

async function CoursesData({
  searchParams,
}: {
  searchParams: CoursesPageProps["searchParams"];
}) {
  const filters: CourseFilters = {
    search: searchParams.q || undefined,
    category: searchParams.category || undefined,
    subcategory: searchParams.subcategory || undefined,
    level: searchParams.level || undefined,
    priceMin: searchParams.priceMin ? Number(searchParams.priceMin) : undefined,
    priceMax: searchParams.priceMax ? Number(searchParams.priceMax) : undefined,
    featured: searchParams.featured === "true" || undefined,
  };

  const sort: CourseSortOptions = {
    field: searchParams.sortField || "createdAt",
    direction: searchParams.sortDirection || "desc",
  };

  const page = Number(searchParams.page) || 1;

  // Fetch data in parallel
  const [coursesData, categories] = await Promise.all([
    getCourses({ filters, sort, page, limit: 12 }),
    getCategories(),
  ]);

  return <CoursesClient initialCourses={coursesData} categories={categories} />;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <RSCNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground font-sans tracking-tight leading-relaxed">
              Explora Cursos
            </h1>
          </div>
          <p className="text-muted-foreground font-serif text-md max-w-2xl">
            Descubre una amplia selección de cursos diseñados para impulsar tu
            carrera y expandir tus conocimientos.
          </p>
        </div>
        <Suspense fallback={<CoursesPageSkeleton />}>
          <CoursesData searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
