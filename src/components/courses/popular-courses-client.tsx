"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Users,
  BookOpen,
  Star,
  TrendingUp,
  Eye,
  Play,
} from "lucide-react";
import { CoursePublic } from "@/types";
import Image from "next/image";

interface PopularCoursesClientProps {
  courses: CoursePublic[];
}

export function PopularCoursesClient({ courses }: PopularCoursesClientProps) {
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

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold text-foreground font-sans">
            Cursos Populares
          </h2>
        </div>
        <p className="text-muted-foreground font-serif tracking-tight">
          Los cursos más demandados por nuestros estudiantes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <Card
            key={course.id}
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-md"
          >
            <div className="relative">
              <div className="absolute top-3 left-3 z-10">
                <Badge
                  variant={index < 3 ? "default" : "secondary"}
                  className={`font-bold text-xs ${
                    index === 0
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : index === 1
                      ? "bg-gray-400 hover:bg-gray-500"
                      : index === 2
                      ? "bg-amber-600 hover:bg-amber-700"
                      : ""
                  }`}
                >
                  #{index + 1}
                </Badge>
              </div>

              <div className="relative aspect-video w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-primary/60">
                    <Play className="h-12 w-12 mb-2" />
                    <span className="text-sm font-medium">Vista previa</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>

              {course.category && (
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="outline"
                    className="bg-background/90 backdrop-blur-sm"
                  >
                    {course.category.name}
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-base font-sans line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                {course.shortDesc && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1 font-serif">
                    {course.shortDesc}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={course.instructor.avatar || undefined} />
                  <AvatarFallback className="text-xs">
                    {course.instructor.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground font-mono truncate">
                  {course.instructor.name || "Instructor"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  {course._count?.lessons && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{course._count.lessons}</span>
                    </div>
                  )}
                  {course.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                  )}
                </div>
                {course.level && (
                  <Badge variant="outline" className="text-xs py-0">
                    {course.level}
                  </Badge>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between border-t bg-muted/20">
              <div className="flex flex-col">
                <span className="font-bold text-lg text-primary">
                  {formatPrice(course.price)}
                </span>
                {course._count?.enrollments &&
                  course._count.enrollments > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{course._count.enrollments} estudiantes</span>
                    </div>
                  )}
              </div>

              <div className="flex items-center gap-1">
                {course.featured && (
                  <Badge
                    variant="default"
                    className="text-xs bg-amber-500 hover:bg-amber-600"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Destacado
                  </Badge>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-serif">
            No hay cursos populares disponibles en este momento
          </p>
        </div>
      )}
    </div>
  );
}
