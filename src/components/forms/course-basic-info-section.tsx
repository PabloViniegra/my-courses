import { UseFormReturn } from "react-hook-form";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateCourseFormData } from "@/types/forms";

interface CourseBasicInfoSectionProps {
  form: UseFormReturn<CreateCourseFormData>;
}

export function CourseBasicInfoSection({ form }: CourseBasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-sans">
          <BookOpen className="h-5 w-5" />
          Basic Information
        </CardTitle>
        <p className="text-sm text-muted-foreground font-serif">
          Essential details about your course that students will see first.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Complete React Development Course"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A clear, descriptive title that explains what students will
                learn
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief overview of what students will learn in this course..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief summary shown in course cards and search results (max 200
                characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of your course content, learning objectives, prerequisites, and what makes it unique..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detailed course description shown on the course page (max 2000
                characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}