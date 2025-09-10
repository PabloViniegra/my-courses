"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Upload, X } from "lucide-react";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { signup } from "@/app/login/actions";
import { createClient } from "@/utils/supabase/client";
import { GoogleIcon } from "@/components/icons/google-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(30, { message: "Password must be less than 30 characters" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }
  );

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(100, { message: "Name must be less than 100 characters" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    avatar: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [files, setFiles] = useState<File[] | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    },
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  useEffect(() => {
    if (password || confirmPassword) {
      form.trigger(["password", "confirmPassword"]);
    }
  }, [password, confirmPassword, form]);

  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  const compressImage = (
    file: File,
    maxWidth = 400,
    quality = 0.8
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      let avatarBase64 = "";

      if (files && files.length > 0) {
        const file = files[0];

        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image must be smaller than 5MB");
          return;
        }

        avatarBase64 = await compressImage(file);
      }

      await signup({
        name: values.name,
        email: values.email,
        password: values.password,
        avatar: avatarBase64,
      });
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.includes("NEXT_REDIRECT")
      ) {
        return;
      }

      console.error("Form submission error", error);
      toast.error("Failed to create account. Please try again.");
    }
  });

  async function handleGoogleLogin() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${
          process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
        }/auth/callback?next=/&signup=true`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) {
      console.error("Error logging in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      <Card className="bg-background text-foreground">
        <CardHeader className="mx-15">
          <CardTitle className="text-2xl font-bold font-sans tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription className="text-md font-serif tracking-tight">
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-15">
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label
                  htmlFor="name"
                  className="text-xs font-serif tracking-tight"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="text-xs font-serif tracking-tight"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label
                  htmlFor="email"
                  className="text-xs font-serif tracking-tight"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="text-xs font-serif tracking-tight"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label
                  htmlFor="password"
                  className="text-xs font-serif tracking-tight"
                >
                  Password
                </Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  className="text-xs font-serif tracking-tight"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-serif tracking-tight"
                >
                  Confirm Password
                </Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="text-xs font-serif tracking-tight"
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label className="text-xs font-serif tracking-tight">
                  Profile Picture
                </Label>
                <FileUpload
                  maxFiles={1}
                  maxSize={5 * 1024 * 1024}
                  className="w-full"
                  value={files || []}
                  onValueChange={setFiles}
                  onFileReject={onFileReject}
                >
                  <FileUploadDropzone>
                    <div className="flex flex-col items-center gap-1 text-center p-4 border-2 border-dashed rounded-md">
                      <div className="flex items-center justify-center rounded-full border p-2.5">
                        <Upload className="size-5 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-sm">
                        Drag & drop your photo here
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Or click to browse (max 1 file, up to 5MB)
                      </p>
                    </div>
                    <FileUploadTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full font-mono text-xs"
                        type="button"
                      >
                        Choose File
                      </Button>
                    </FileUploadTrigger>
                  </FileUploadDropzone>
                  <FileUploadList className="mt-2">
                    {files?.map((file, index) => (
                      <FileUploadItem
                        key={index}
                        value={file}
                        className="p-2 border rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <FileUploadItemPreview className="size-8" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <FileUploadItemDelete asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6"
                              type="button"
                            >
                              <X className="size-3" />
                            </Button>
                          </FileUploadItemDelete>
                        </div>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
              </div>

              <div className="flex flex-col gap-3 justify-center items-center">
                <Button
                  type="submit"
                  className="w-1/2 font-mono"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Creating Account..."
                    : "Sign Up"}
                </Button>
                <Button
                  variant="outline"
                  className="w-1/2 font-mono gap-x-2"
                  type="button"
                  onClick={handleGoogleLogin}
                >
                  <GoogleIcon className="w-5 h-5" />
                  Sign in with Google
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-xs font-serif tracking-tight my-5">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
