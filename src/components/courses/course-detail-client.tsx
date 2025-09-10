"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Clock,
  Users,
  BookOpen,
  Star,
  Play,
  Tag,
  Calendar,
  User,
  CheckCircle,
  PlayCircle,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseActionsMenu } from "./course-actions-menu";
import { CoursePublic, User as UserType } from "@/types";

interface CourseDetailClientProps {
  course: CoursePublic;
  currentUser: UserType | null;
}

export function CourseDetailClient({
  course,
  currentUser,
}: CourseDetailClientProps) {
  const [selectedTab, setSelectedTab] = useState("overview");

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
    }
    return `${mins}m`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

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
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {course.category && (
                  <Badge variant="outline" className="text-primary font-mono">
                    <Tag className="h-3 w-3 mr-1" />
                    {course.category.name}
                  </Badge>
                )}
                {course.featured && (
                  <Badge className="bg-amber-500 hover:bg-amber-600 font-mono">
                    <Star className="h-3 w-3 mr-1" />
                    Destacado
                  </Badge>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground font-sans tracking-tight leading-tight flex-1">
                  {course.title}
                </h1>

                {/* Course Actions Menu - Only visible to ADMIN or course instructor */}
                <CourseActionsMenu course={course} currentUser={currentUser} />
              </div>

              {course.shortDesc && (
                <p className="text-lg text-muted-foreground font-serif leading-relaxed">
                  {course.shortDesc}
                </p>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.instructor.avatar || undefined} />
                    <AvatarFallback>
                      {course.instructor.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground font-sans">
                      {course.instructor.name || "Instructor"}
                    </p>
                    <p className="text-sm text-muted-foreground font-sans">
                      Instructor
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-serif">
                {course._count?.lessons && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course._count.lessons} lecciones</span>
                  </div>
                )}
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                )}
                {course._count?.enrollments &&
                  course._count.enrollments > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{course._count.enrollments} estudiantes</span>
                    </div>
                  )}
                {course.level && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{course.level}</span>
                  </div>
                )}
                {course.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Publicado {formatDate(course.publishedAt)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-primary/60">
                  <Play className="h-16 w-16 mb-4" />
                  <span className="text-lg font-medium">
                    Vista previa del curso
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-white/90 text-primary hover:bg-white"
                >
                  <PlayCircle className="h-6 w-6 mr-2" />
                  Ver vista previa
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3 font-sans tracking-tight leading-relaxed">
              <TabsTrigger value="overview">Descripción</TabsTrigger>
              <TabsTrigger value="curriculum">Contenido</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {course.description && (
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <div className="text-foreground font-serif leading-relaxed whitespace-pre-wrap">
                    {course.description}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="curriculum" className="space-y-4 mt-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground font-sans">
                  Contenido del curso
                </h3>
                <p className="text-muted-foreground">
                  {course._count?.lessons || 0} lecciones •{" "}
                  {course.duration
                    ? formatDuration(course.duration)
                    : "Duración por determinar"}
                </p>
                <div className="space-y-2">
                  {course.lessons && course.lessons.length > 0 ? (
                    course.lessons.map((lesson) => (
                      <Card key={lesson.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                                {lesson.isPublished ? (
                                  <CheckCircle className="h-4 w-4 text-primary" />
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  Lección {lesson.order}: {lesson.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {lesson.videoUrl ? "Video" : "Contenido"} •{" "}
                                  {lesson.duration
                                    ? formatDuration(
                                        Math.ceil(lesson.duration / 60)
                                      )
                                    : "Duración por determinar"}
                                </p>
                                {lesson.description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {lesson.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <PlayCircle className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="p-8 text-center">
                        <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          Este curso aún no tiene lecciones publicadas.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="instructor" className="space-y-6 mt-6">
              <div className="flex gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={course.instructor.avatar || undefined} />
                  <AvatarFallback className="text-lg">
                    {course.instructor.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {course.instructor.name || "Instructor"}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        {course.instructor.role === "TEACHER"
                          ? "Instructor"
                          : course.instructor.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Miembro desde {formatDate(course.instructor.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-4 font-sans tracking-tight leading-relaxed">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(course.price)}
                </div>
                {course.price > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Acceso completo de por vida
                  </p>
                )}
              </div>

              <div className="space-y-3 text-sm">
                {course._count?.lessons && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lecciones:</span>
                    <span className="font-medium">{course._count.lessons}</span>
                  </div>
                )}
                {course.duration && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración:</span>
                    <span className="font-medium">
                      {formatDuration(course.duration)}
                    </span>
                  </div>
                )}
                {course.level && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nivel:</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                )}
                {course._count?.enrollments &&
                  course._count.enrollments > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Estudiantes:
                      </span>
                      <span className="font-medium">
                        {course._count.enrollments}
                      </span>
                    </div>
                  )}
              </div>

              <div className="pt-4 border-t space-y-3">
                <Button className="w-full" size="lg">
                  {course.price === 0 ? "Inscribirse gratis" : "Comprar curso"}
                </Button>
                <Button variant="outline" className="w-full">
                  Agregar a lista de deseos
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground font-mono">
                  Garantía de devolución de 30 días
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif">
                Este curso incluye:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-serif">
              <div className="flex items-center gap-3 text-sm">
                <PlayCircle className="h-4 w-4 text-primary" />
                <span>Videos en alta definición</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Material descargable</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>Acceso de por vida</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span>Acceso en móvil y TV</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
