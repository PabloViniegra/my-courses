"use client";

import { CourseCard } from "./course-card";
import { CoursePublic } from "@/types";
import { Loader2, Search } from "lucide-react";

interface CourseGridProps {
  courses: CoursePublic[];
  loading?: boolean;
  error?: string | null;
}

export function CourseGrid({ courses, loading, error }: CourseGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando cursos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error al cargar cursos</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron cursos</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros de búsqueda o cambiar los criterios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
      {courses.map((course) => (
        <div key={course.id} className="h-full">
          <CourseCard
            course={course}
            showInstructor={true}
            showCategory={true}
          />
        </div>
      ))}
    </div>
  );
}