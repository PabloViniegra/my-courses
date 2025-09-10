import { NextRequest, NextResponse } from "next/server";
import { getCourses } from "@/lib/courses";
import { CourseFilters, CourseSortOptions, CourseLevel } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters
    const filters: CourseFilters = {
      search: searchParams.get("q") || undefined,
      category: searchParams.get("category") || undefined,
      subcategory: searchParams.get("subcategory") || undefined,
      level: (searchParams.get("level") as CourseLevel) || undefined,
      priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
      priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
      featured: searchParams.get("featured") === "true" || undefined,
    };

    // Parse sort options
    const sort: CourseSortOptions = {
      field: (searchParams.get("sortField") as CourseSortOptions['field']) || "createdAt",
      direction: (searchParams.get("sortDirection") as CourseSortOptions['direction']) || "desc",
    };

    // Parse pagination
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;

    // Fetch courses
    const result = await getCourses({
      filters,
      sort,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener los cursos",
      },
      { status: 500 }
    );
  }
}