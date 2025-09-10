"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, FolderOpen, BookOpen } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/animate-ui/components/radix/hover-card";
import { getCoursesBySubcategoryClient, CourseBasic } from "@/lib/get-courses-by-subcategory-client";
import Link from "next/link";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  course_count: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  subcategories: Subcategory[];
}

interface CategoriesSliderClientProps {
  categories: Category[];
}

export function CategoriesSliderClient({
  categories,
}: CategoriesSliderClientProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [subcategoryCourses, setSubcategoryCourses] = useState<Record<string, CourseBasic[]>>({});
  const [loadingCourses, setLoadingCourses] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const loadSubcategoryCourses = async (subcategoryId: string) => {
    if (subcategoryCourses[subcategoryId] || loadingCourses[subcategoryId]) {
      return; // Already loaded or loading
    }

    setLoadingCourses(prev => ({ ...prev, [subcategoryId]: true }));
    
    try {
      const courses = await getCoursesBySubcategoryClient(subcategoryId, 4);
      setSubcategoryCourses(prev => ({ ...prev, [subcategoryId]: courses }));
    } catch (error) {
      console.error("Error loading subcategory courses:", error);
    } finally {
      setLoadingCourses(prev => ({ ...prev, [subcategoryId]: false }));
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-sans">
            Categorías
          </h2>
          <p className="text-muted-foreground font-serif tracking-tight">
            Explora nuestros cursos por categoría
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hidden pb-2"
        onScroll={checkScrollButtons}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <HoverCard key={category.id} openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Card className="flex-shrink-0 w-64 cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm font-sans">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {category.subcategories.length} subcategorías
                      </p>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 font-serif">
                      {category.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </HoverCardTrigger>

            <HoverCardContent className="w-80 p-4" align="start">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-base">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  )}
                </div>

                {category.subcategories.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">Subcategorías</h5>
                    <div className="grid gap-2">
                      {category.subcategories.map((subcategory) => (
                        <HoverCard key={subcategory.id} openDelay={200} closeDelay={100}>
                          <HoverCardTrigger asChild>
                            <div
                              className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
                              onMouseEnter={() => loadSubcategoryCourses(subcategory.id)}
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{subcategory.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {subcategory.course_count} cursos
                              </span>
                            </div>
                          </HoverCardTrigger>

                          <HoverCardContent className="w-96 p-4" side="right" align="start">
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-base font-sans">{subcategory.name}</h4>
                                <p className="text-sm text-muted-foreground font-serif">
                                  {subcategory.course_count} cursos disponibles
                                </p>
                              </div>

                              {loadingCourses[subcategory.id] ? (
                                <div className="space-y-3">
                                  {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                      <div className="flex gap-3">
                                        <div className="w-16 h-12 bg-muted rounded"></div>
                                        <div className="flex-1 space-y-2">
                                          <div className="h-4 bg-muted rounded w-3/4"></div>
                                          <div className="h-3 bg-muted rounded w-1/2"></div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : subcategoryCourses[subcategory.id]?.length > 0 ? (
                                <div className="space-y-3">
                                  {subcategoryCourses[subcategory.id].map((course) => (
                                    <Link
                                      key={course.id}
                                      href={`/courses/${course.slug}`}
                                      className="block"
                                    >
                                      <div className="flex gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
                                        <div className="relative w-16 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded overflow-hidden flex-shrink-0">
                                          {course.thumbnail ? (
                                            <Image
                                              src={course.thumbnail}
                                              alt={course.title}
                                              fill
                                              className="object-cover"
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                              <BookOpen className="h-4 w-4 text-primary" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-medium text-sm font-sans line-clamp-1">
                                            {course.title}
                                          </h5>
                                          <div className="flex items-center gap-2 mt-1">
                                            <Avatar className="h-4 w-4">
                                              <AvatarImage
                                                src={course.instructor.avatar || undefined}
                                                alt={course.instructor.name}
                                              />
                                              <AvatarFallback className="text-xs">
                                                {getInitials(course.instructor.name)}
                                              </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-muted-foreground font-serif truncate">
                                              {course.instructor.name}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between mt-1">
                                            <Badge variant="secondary" className="text-xs font-mono">
                                              {course.level}
                                            </Badge>
                                            <span className="text-sm font-semibold text-primary">
                                              {formatPrice(course.price)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                  {subcategoryCourses[subcategory.id].length === 4 && (
                                    <div className="text-center pt-2">
                                      <Link
                                        href={`/courses?subcategory=${subcategory.slug}`}
                                        className="text-xs text-primary hover:underline font-sans"
                                      >
                                        Ver todos los cursos →
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                  <p className="text-sm text-muted-foreground font-serif">
                                    No hay cursos disponibles
                                  </p>
                                </div>
                              )}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
