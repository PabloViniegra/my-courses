import { Suspense } from "react";
import { CategoriesSliderClient } from "./categories-slider-client";
import { CategoriesSliderSkeleton } from "@/components/skeletons/categories-slider-skeleton";
import { getCategoriesForSlider } from "@/lib/categories-slider";

async function CategoriesSliderData() {
  const categories = await getCategoriesForSlider();

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground font-serif">
          No hay categorías disponibles
        </p>
      </div>
    );
  }

  return <CategoriesSliderClient categories={categories} />;
}

export function CategoriesSlider() {
  return (
    <section className="py-8">
      <Suspense fallback={<CategoriesSliderSkeleton />}>
        <CategoriesSliderData />
      </Suspense>
    </section>
  );
}
