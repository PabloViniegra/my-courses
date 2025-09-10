import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function CoursesPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        {/* Sort Controls Skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-10 w-48" />
              </div>
              <Skeleton className="h-8 w-28" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        {/* Course Grid Skeleton */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-md">
                {/* Image Skeleton */}
                <Skeleton className="aspect-video w-full" />

                <CardContent className="p-4 space-y-3">
                  {/* Title Skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>

                  {/* Instructor Skeleton */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  {/* Stats Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex items-center justify-between border-t bg-muted/20">
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-20" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10" />
            ))}
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}