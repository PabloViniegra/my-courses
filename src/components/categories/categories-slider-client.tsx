"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, FolderOpen, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/animate-ui/components/radix/hover-card";

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
                        <div
                          key={subcategory.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{subcategory.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {subcategory.course_count} cursos
                          </span>
                        </div>
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
