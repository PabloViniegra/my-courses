import { Suspense } from "react";
import { Metadata } from "next";
import { HeroSection } from "@/components/about/hero-section";
import { MissionSection } from "@/components/about/mission-section";
import { TeamSection } from "@/components/about/team-section";
import { ContactSection } from "@/components/about/contact-section";
import { Skeleton } from "@/components/ui/skeleton";
import RSCNavbar from "@/components/server/rsc-navbar";
import { NavbarSkeleton } from "@/components/skeletons/navbar-skeleton";

export const metadata: Metadata = {
  title: "Acerca de Nosotros | Plataforma Educativa",
  description:
    "Conoce nuestra misión de democratizar la educación de calidad. Descubre nuestro equipo, valores y cómo estamos transformando la forma de aprender y enseñar en línea.",
};

// Loading components
function HeroSkeleton() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<NavbarSkeleton />}>
        <RSCNavbar />
      </Suspense>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <MissionSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TeamSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ContactSection />
      </Suspense>
    </main>
  );
}
