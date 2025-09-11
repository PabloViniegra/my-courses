import { useState } from "react";
import {
  BookOpen,
  User,
  Calendar,
  CheckCircle,
  PlayCircle,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoursePublic } from "@/types";
import { formatDuration, formatDate } from "@/utils/mappers";

interface CourseTabsProps {
  course: CoursePublic;
}

export function CourseTabs({ course }: CourseTabsProps) {
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
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
                              ? formatDuration(Math.ceil(lesson.duration / 60))
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
  );
}