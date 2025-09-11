import { Clock, Users, PlayCircle, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoursePublic } from "@/types";
import { COURSE_INCLUDES_FEATURES } from "@/consts";
import { formatDuration, formatPrice } from "@/utils/mappers";

interface CourseSidebarProps {
  course: CoursePublic;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  return (
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
                  <span className="text-muted-foreground">Estudiantes:</span>
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
          {COURSE_INCLUDES_FEATURES.map((feature, index) => {
            const IconComponent = feature.icon === "PlayCircle" ? PlayCircle :
              feature.icon === "BookOpen" ? BookOpen :
              feature.icon === "Clock" ? Clock : Users;
            
            return (
              <div key={index} className="flex items-center gap-3 text-sm">
                <IconComponent className="h-4 w-4 text-primary" />
                <span>{feature.label}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}