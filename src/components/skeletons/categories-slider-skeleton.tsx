import { Skeleton } from "@/components/ui/skeleton";

export function CategoriesSliderSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-48 p-4 border rounded-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}