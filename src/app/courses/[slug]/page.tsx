import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses";
import { CourseDetailClient } from "@/components/courses/course-detail-client";
import { CourseDetailSkeleton } from "@/components/skeletons/course-detail-skeleton";
import RSCNavbar from "@/components/server/rsc-navbar";

interface CourseDetailPageProps {
  params: {
    slug: string;
  };
}

async function CourseDetailData({ slug }: { slug: string }) {
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CourseDetailClient course={course} />;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <RSCNavbar />
      <Suspense fallback={<CourseDetailSkeleton />}>
        <CourseDetailData slug={params.slug} />
      </Suspense>
    </div>
  );
}