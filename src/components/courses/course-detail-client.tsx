"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CourseHeader } from "./course-header";
import { CourseTabs } from "./course-tabs";
import { CourseSidebar } from "./course-sidebar";
import { CoursePublic, User as UserType } from "@/types";

interface CourseDetailClientProps {
  course: CoursePublic;
  currentUser: UserType | null;
}

export function CourseDetailClient({
  course,
  currentUser,
}: CourseDetailClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6 font-sans">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/courses"
              className="text-muted-foreground hover:text-foreground"
            >
              Cursos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {course.category && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/courses?category=${course.category.slug}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {course.category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">
              {course.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <CourseHeader course={course} currentUser={currentUser} />
          <CourseTabs course={course} />
        </div>
        <div className="space-y-6">
          <CourseSidebar course={course} />
        </div>
      </div>
    </div>
  );
}
