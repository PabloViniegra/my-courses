import { Suspense } from "react";
import { PopularCoursesClient } from "./popular-courses-client";
import { PopularCoursesSkeleton } from "@/components/skeletons/popular-courses-skeleton";
import { getPopularCourses } from "@/lib/popular-courses";

async function PopularCoursesData() {
  const courses = await getPopularCourses(8);

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground font-serif">
          No hay cursos populares disponibles
        </p>
      </div>
    );
  }

  return <PopularCoursesClient courses={courses} />;
}

export function PopularCourses() {
  return (
    <section className="py-12">
      <Suspense fallback={<PopularCoursesSkeleton />}>
        <PopularCoursesData />
      </Suspense>
    </section>
  );
}