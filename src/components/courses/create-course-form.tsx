"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { createCourse } from "@/app/private/create-course/actions";
import { Category } from "@/types";
import { CreateCourseFormData } from "@/types/forms";
import { FORM_VALIDATION } from "@/consts";
import { CourseBasicInfoSection } from "@/components/forms/course-basic-info-section";
import { CourseDetailsSection } from "@/components/forms/course-details-section";
import { CoursePreviewSection } from "@/components/forms/course-preview-section";

const createCourseSchema = z.object({
  title: z
    .string()
    .min(FORM_VALIDATION.COURSE_TITLE.MIN_LENGTH, `Title must be at least ${FORM_VALIDATION.COURSE_TITLE.MIN_LENGTH} characters`)
    .max(FORM_VALIDATION.COURSE_TITLE.MAX_LENGTH),
  shortDesc: z
    .string()
    .min(FORM_VALIDATION.COURSE_SHORT_DESC.MIN_LENGTH, `Short description must be at least ${FORM_VALIDATION.COURSE_SHORT_DESC.MIN_LENGTH} characters`)
    .max(FORM_VALIDATION.COURSE_SHORT_DESC.MAX_LENGTH),
  description: z
    .string()
    .min(FORM_VALIDATION.COURSE_DESCRIPTION.MIN_LENGTH, `Description must be at least ${FORM_VALIDATION.COURSE_DESCRIPTION.MIN_LENGTH} characters`)
    .max(FORM_VALIDATION.COURSE_DESCRIPTION.MAX_LENGTH),
  price: z.number().min(0, "Price cannot be negative"),
  categoryId: z.string().min(1, "Please select a category"),
  subcategoryId: z.string().optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  thumbnail: z.string().optional(),
});

interface CreateCourseFormProps {
  categories: Category[];
}

export function CreateCourseForm({ categories }: CreateCourseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [publishAfterSave, setPublishAfterSave] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([]);
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string | null>(null);

  const form = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      shortDesc: "",
      description: "",
      price: 0,
      categoryId: "",
      subcategoryId: "",
      level: "Beginner",
      thumbnail: "",
    },
  });

  const watchedFields = form.watch();

  const handleThumbnailUpload = async (files: File[]) => {
    if (files.length === 0) {
      setThumbnailFiles([]);
      setUploadedThumbnailUrl(null);
      form.setValue("thumbnail", "");
      return;
    }

    const file = files[0];
    setThumbnailFiles([file]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-course-thumbnail", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorResult.error || "Failed to upload thumbnail");
      }

      const result = await response.json();
      if (result.url) {
        setUploadedThumbnailUrl(result.url);
        form.setValue("thumbnail", result.url);
      } else {
        throw new Error("No se recibió URL del archivo subido");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setThumbnailFiles([]);
      setUploadedThumbnailUrl(null);
      // Opcional: mostrar error al usuario de forma más amigable
      // Por ejemplo, usando un estado de error en el componente
    }
  };

  const onSubmit = (data: CreateCourseFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            formData.append(key, value.toString());
          }
        });

        formData.append("publish", publishAfterSave.toString());

        const result = await createCourse(formData);

        if (result.success) {
          const statusText = publishAfterSave
            ? "published"
            : "created as draft";
          toast.success(`Course ${statusText} successfully!`);
          router.push(`/courses/${result.course?.slug}`);
        } else {
          toast.error(result.error || "Failed to create course");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        console.error("Form submission error:", error);
      }
    });
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CourseBasicInfoSection form={form} />
            <CourseDetailsSection
              form={form}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              thumbnailFiles={thumbnailFiles}
              onThumbnailUpload={handleThumbnailUpload}
            />
          </div>

          <div className="space-y-6">
            <CoursePreviewSection
              form={form}
              categories={categories}
              isPending={isPending}
              publishAfterSave={publishAfterSave}
              watchedFields={watchedFields}
              uploadedThumbnailUrl={uploadedThumbnailUrl}
              onSaveDraft={() => setPublishAfterSave(false)}
              onSaveAndPublish={() => setPublishAfterSave(true)}
              onCancel={() => router.back()}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
