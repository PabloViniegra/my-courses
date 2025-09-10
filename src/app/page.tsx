import RSCNavbar from "@/components/server/rsc-navbar";
import { NavbarSkeleton } from "@/components/skeletons/navbar-skeleton";
import { CategoriesSlider } from "@/components/categories/categories-slider";
import { PopularCourses } from "@/components/courses/popular-courses";
import { Suspense } from "react";

export default async function Home() {
  return (
    <main>
      <Suspense fallback={<NavbarSkeleton />}>
        <RSCNavbar />
      </Suspense>
      
      <div className="container mx-auto px-4 md:px-6">
        <CategoriesSlider />
        <PopularCourses />
      </div>
    </main>
  );
}
