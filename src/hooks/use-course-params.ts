"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { CourseFilters, CourseSortOptions, CourseLevel } from "@/types";

export interface CourseParams {
  search?: string;
  category?: string;
  subcategory?: string;
  level?: CourseLevel;
  priceMin?: number;
  priceMax?: number;
  featured?: boolean;
  sortField: CourseSortOptions['field'];
  sortDirection: CourseSortOptions['direction'];
  page: number;
}

export function useCourseParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Parse current params from URL
  const params: CourseParams = useMemo(() => {
    const search = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const subcategory = searchParams.get("subcategory") || undefined;
    const level = searchParams.get("level") as CourseLevel || undefined;
    const priceMin = searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined;
    const priceMax = searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined;
    const featured = searchParams.get("featured") === "true" || undefined;
    const sortField = (searchParams.get("sortField") as CourseSortOptions['field']) || "createdAt";
    const sortDirection = (searchParams.get("sortDirection") as CourseSortOptions['direction']) || "desc";
    const page = Number(searchParams.get("page")) || 1;

    return {
      search,
      category,
      subcategory,
      level,
      priceMin,
      priceMax,
      featured,
      sortField,
      sortDirection,
      page,
    };
  }, [searchParams]);

  // Get filters object
  const filters: CourseFilters = useMemo(() => {
    return {
      search: params.search,
      category: params.category,
      subcategory: params.subcategory,
      level: params.level,
      priceMin: params.priceMin,
      priceMax: params.priceMax,
      featured: params.featured,
    };
  }, [params]);

  // Get sort options
  const sortOptions: CourseSortOptions = useMemo(() => {
    return {
      field: params.sortField,
      direction: params.sortDirection,
    };
  }, [params.sortField, params.sortDirection]);

  // Update URL with new params
  const updateParams = useCallback(
    (newParams: Partial<CourseParams>) => {
      const current = new URLSearchParams(searchParams.toString());
      
      // Remove all existing course-related params
      current.delete("q");
      current.delete("category");
      current.delete("subcategory");
      current.delete("level");
      current.delete("priceMin");
      current.delete("priceMax");
      current.delete("featured");
      current.delete("sortField");
      current.delete("sortDirection");
      current.delete("page");

      // Merge with existing params
      const finalParams = { ...params, ...newParams };

      // Set new params only if they have values
      if (finalParams.search) current.set("q", finalParams.search);
      if (finalParams.category) current.set("category", finalParams.category);
      if (finalParams.subcategory) current.set("subcategory", finalParams.subcategory);
      if (finalParams.level) current.set("level", finalParams.level);
      if (finalParams.priceMin !== undefined && finalParams.priceMin > 0) {
        current.set("priceMin", finalParams.priceMin.toString());
      }
      if (finalParams.priceMax !== undefined && finalParams.priceMax > 0) {
        current.set("priceMax", finalParams.priceMax.toString());
      }
      if (finalParams.featured) current.set("featured", "true");
      if (finalParams.sortField !== "createdAt" || finalParams.sortDirection !== "desc") {
        current.set("sortField", finalParams.sortField);
        current.set("sortDirection", finalParams.sortDirection);
      }
      if (finalParams.page !== 1) current.set("page", finalParams.page.toString());

      const newUrl = `${pathname}?${current.toString()}`;
      router.push(newUrl, { scroll: false });
    },
    [searchParams, pathname, router, params]
  );

  // Helper functions
  const updateSearch = useCallback(
    (search: string) => {
      updateParams({ search: search || undefined, page: 1 });
    },
    [updateParams]
  );

  const updateFilters = useCallback(
    (newFilters: CourseFilters) => {
      updateParams({
        search: newFilters.search,
        category: newFilters.category,
        subcategory: newFilters.subcategory,
        level: newFilters.level,
        priceMin: newFilters.priceMin,
        priceMax: newFilters.priceMax,
        featured: newFilters.featured,
        page: 1, // Reset page when filters change
      });
    },
    [updateParams]
  );

  const updateSort = useCallback(
    (sortOptions: CourseSortOptions) => {
      updateParams({
        sortField: sortOptions.field,
        sortDirection: sortOptions.direction,
        page: 1, // Reset page when sorting changes
      });
    },
    [updateParams]
  );

  const updatePage = useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams]
  );

  const clearFilters = useCallback(() => {
    updateParams({
      search: undefined,
      category: undefined,
      subcategory: undefined,
      level: undefined,
      priceMin: undefined,
      priceMax: undefined,
      featured: undefined,
      page: 1,
    });
  }, [updateParams]);

  return {
    params,
    filters,
    sortOptions,
    updateSearch,
    updateFilters,
    updateSort,
    updatePage,
    clearFilters,
  };
}