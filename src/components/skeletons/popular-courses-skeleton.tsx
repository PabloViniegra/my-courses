import { Skeleton } from "@/components/ui/skeleton";

export function PopularCoursesSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <Skeleton className="h-8 w-72 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col space-y-4 border rounded-lg p-4"
          >
            {/* Thumbnail */}
            <Skeleton className="aspect-video w-full rounded-md" />
            
            {/* Course info */}
            <div className="space-y-3">
              <div>
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              {/* Instructor */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
              
              {/* Price and enrollment */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}