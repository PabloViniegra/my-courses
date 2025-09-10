"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Lock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { updatePassword } from "@/app/login/actions";
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
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  useEffect(() => {
    if (password || confirmPassword) {
      form.trigger(["password", "confirmPassword"]);
    }
  }, [password, confirmPassword, form]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setIsValidSession(true);
        } else {
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
          );
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error) {
              setIsValidSession(true);
              // Clean up URL
              window.history.replaceState(null, "", window.location.pathname);
            } else {
              setIsValidSession(false);
            }
          } else {
            setIsValidSession(false);
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        setIsValidSession(false);
      }
    };

    checkSession();
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await updatePassword(values.password);

      if (!result.success) {
        toast.error(result.error || "Failed to update password");
        return;
      }

      toast.success("Password updated successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Password update error", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  });

  if (isValidSession === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-muted-foreground">
          Verifying reset link...
        </p>
      </div>
    );
  }

  if (isValidSession === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen max-w-4xl mx-auto px-4">
        <Card className="bg-background text-foreground w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold font-sans tracking-tight">
              Invalid reset link
            </CardTitle>
            <CardDescription className="text-md font-serif tracking-tight">
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please request a new password reset link to continue.
            </p>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => router.push("/auth/forgot-password")}
                className="w-full font-mono"
              >
                Request new reset link
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                className="text-xs"
              >
                Back to login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
            Create new password
          </CardTitle>
          <CardDescription className="text-md font-serif tracking-tight">
            Enter a strong password for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-15">
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label
                  htmlFor="password"
                  className="text-xs font-serif tracking-tight"
                >
                  New Password
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
                  Confirm New Password
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

              <div className="flex flex-col gap-3 justify-center items-center">
                <Button
                  type="submit"
                  className="w-full font-mono"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Update password
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs font-serif tracking-tight">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="underline underline-offset-4 hover:text-primary"
              >
                Back to login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
