"use client";

import { CourseSearch } from "./course-search";
import { CourseFiltersComponent } from "./course-filters";
import { CourseSort } from "./course-sort";
import { CourseGrid } from "./course-grid";
import { CoursePagination } from "./course-pagination";
import { useCourseParams } from "@/hooks/use-course-params";
import { CoursePublic, PaginatedResponse } from "@/types";
import { GraduationCap } from "lucide-react";

interface CoursesClientProps {
  initialCourses: PaginatedResponse<CoursePublic>;
  categories: Array<{
    id: string;
    name: string;
    subcategories: Array<{ id: string; name: string }>;
  }>;
}

export function CoursesClient({
  initialCourses,
  categories,
}: CoursesClientProps) {
  const {
    params,
    filters,
    sortOptions,
    updateSearch,
    updateFilters,
    updateSort,
    updatePage,
    clearFilters,
  } = useCourseParams();

  const coursesData = initialCourses;

  return (
    <div className="space-y-8">
      <div className="bg-muted/30 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3 font-sans tracking-tight">
            Buscar cursos
          </h2>
          <CourseSearch
            value={params.search || ""}
            onChange={updateSearch}
            placeholder="Buscar cursos por título, descripción o instructor..."
          />
        </div>
        <div>
          <CourseFiltersComponent
            filters={filters}
            categories={categories}
            onChange={updateFilters}
            onClear={clearFilters}
          />
        </div>
      </div>
      <div className="space-y-6">
        <div className="border-b pb-4">
          <CourseSort
            sortOptions={sortOptions}
            onChange={updateSort}
            totalResults={coursesData.pagination.total}
          />
        </div>
        <div>
          {coursesData.data.length > 0 ? (
            <CourseGrid
              courses={coursesData.data}
              loading={false}
              error={null}
            />
          ) : (
            <div className="text-center py-16">
              <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {Object.values(filters).some((f) => f !== undefined)
                  ? "No se encontraron cursos"
                  : "¡Próximamente más cursos!"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {Object.values(filters).some((f) => f !== undefined)
                  ? "Intenta ajustar los filtros de búsqueda o cambiar los criterios."
                  : "Estamos trabajando en traerte los mejores cursos. Mientras tanto, puedes explorar nuestras categorías."}
              </p>
            </div>
          )}
        </div>
        {coursesData.pagination.pages > 1 && (
          <div className="flex justify-center pt-8 border-t">
            <CoursePagination
              currentPage={coursesData.pagination.page}
              totalPages={coursesData.pagination.pages}
              totalResults={coursesData.pagination.total}
              pageSize={coursesData.pagination.limit}
              onPageChange={updatePage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
