import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses";
import { CourseDetailClient } from "@/components/courses/course-detail-client";
import { CourseDetailSkeleton } from "@/components/skeletons/course-detail-skeleton";
import { createClient } from "@/utils/supabase/server";

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

  // Get current user for permission checks
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  let currentUser = null;
  if (authUser) {
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("supabaseId", authUser.id)
      .single();
    
    currentUser = userData;
  }

  return <CourseDetailClient course={course} currentUser={currentUser} />;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<CourseDetailSkeleton />}>
        <CourseDetailData slug={params.slug} />
      </Suspense>
    </div>
  );
}