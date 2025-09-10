"use client";

import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { User2, Upload, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
} from "@/components/ui/file-upload";
import { CreateProfessorData } from "@/types";
import { createProfessorAction } from "@/lib/actions/create-professor";

const professorSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido"),
  avatar: z.string().optional(),
});

type ProfessorFormData = z.infer<typeof professorSchema>;

function AddProfessorFormContent({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(
    null
  );

  const form = useForm<ProfessorFormData>({
    resolver: zodResolver(professorSchema),
    defaultValues: {
      name: "",
      email: "",
      avatar: "",
    },
  });

  const handleAvatarUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Upload response error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });

        let errorMessage = "Error uploading avatar";
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.error || errorMessage;
        } catch {
          errorMessage = errorData || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      if (!responseData.url) {
        throw new Error("No URL returned from upload");
      }

      setUploadedAvatarUrl(responseData.url);
      form.setValue("avatar", responseData.url);
    } catch (error) {
      console.error("Avatar upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al subir el avatar";
      toast.error(errorMessage);
    }
  };

  const onSubmit = async (data: ProfessorFormData) => {
    try {
      setIsSubmitting(true);

      const professorData: CreateProfessorData = {
        name: data.name,
        email: data.email,
        avatar: uploadedAvatarUrl || undefined,
      };

      const result = await createProfessorAction(professorData);

      if (result.success) {
        toast.success("Profesor creado exitosamente");
        form.reset();
        setAvatarFiles([]);
        setUploadedAvatarUrl(null);
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Error al crear el profesor");
      }
    } catch (error) {
      console.error("Error creating professor:", error);
      toast.error("Error inesperado al crear el profesor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-serif text-sm font-medium">
                  Nombre Completo
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el nombre completo del profesor"
                    className="font-sans"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="font-serif text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-serif text-sm font-medium">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="profesor@example.com"
                    className="font-sans"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="font-serif text-xs" />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="font-serif text-sm font-medium">
              Avatar (Opcional)
            </FormLabel>
            <FileUpload
              value={avatarFiles}
              onValueChange={setAvatarFiles}
              onAccept={handleAvatarUpload}
              accept="image/*"
              maxFiles={1}
              maxSize={5 * 1024 * 1024} // 5MB
              className="w-full"
            >
              <FileUploadDropzone className="min-h-[120px]">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Upload className="h-8 w-8" />
                  <div className="text-center">
                    <p className="font-serif text-sm">
                      Arrastra una imagen aquí o haz clic para seleccionar
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">
                      PNG, JPG hasta 5MB
                    </p>
                  </div>
                  <FileUploadTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-serif text-xs"
                    >
                      Seleccionar Archivo
                    </Button>
                  </FileUploadTrigger>
                </div>
              </FileUploadDropzone>
              <FileUploadList className="mt-4">
                <FileUploadItem value={avatarFiles[0]}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              </FileUploadList>
            </FileUpload>
          </FormItem>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="font-serif text-sm"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="font-serif text-sm"
          >
            {isSubmitting ? "Creando..." : "Crear Profesor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function AddProfessorFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <div className="h-10 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          <div className="h-[120px] bg-muted animate-pulse rounded border-2 border-dashed" />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <div className="h-10 w-20 bg-muted animate-pulse rounded" />
        <div className="h-10 w-28 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}

interface AddProfessorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddProfessorModal({
  open,
  onOpenChange,
  onSuccess = () => {},
}: AddProfessorModalProps) {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-sans text-lg font-semibold">
            <User2 className="h-5 w-5" />
            Añadir Profesor
          </DialogTitle>
          <DialogDescription className="font-serif text-sm text-muted-foreground">
            Crea un nuevo usuario con rol de profesor en el sistema.
          </DialogDescription>
        </DialogHeader>

        <Suspense fallback={<AddProfessorFormSkeleton />}>
          <AddProfessorFormContent
            onClose={handleClose}
            onSuccess={onSuccess}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
