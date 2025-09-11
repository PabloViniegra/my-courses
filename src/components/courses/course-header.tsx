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
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CourseActionsMenu } from "./course-actions-menu";
import { CoursePublic, User as UserType } from "@/types";
import { formatDuration, formatDate } from "@/utils/mappers";

interface CourseHeaderProps {
  course: CoursePublic;
  currentUser: UserType | null;
}

export function CourseHeader({ course, currentUser }: CourseHeaderProps) {
  return (
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
          {course._count?.enrollments && course._count.enrollments > 0 && (
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
            <span className="text-lg font-medium">Vista previa del curso</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <Button size="lg" className="bg-white/90 text-primary hover:bg-white">
            <PlayCircle className="h-6 w-6 mr-2" />
            Ver vista previa
          </Button>
        </div>
      </div>
    </div>
  );
}