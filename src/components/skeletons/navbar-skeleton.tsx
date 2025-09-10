import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Skeleton className="h-8 w-8 rounded-md md:hidden" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="hidden md:flex md:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-md" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </header>
  );
}
