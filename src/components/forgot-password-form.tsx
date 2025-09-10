"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/app/login/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await requestPasswordReset(values.email);

      if (!result.success) {
        toast.error(result.error || "Failed to send reset email");
        return;
      }

      router.push(
        `/auth/forgot-password/sent?email=${encodeURIComponent(values.email)}`
      );
    } catch (error) {
      console.error("Password reset error", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  });

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
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/login")}
              className="p-1 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold font-sans tracking-tight">
            Reset your password
          </CardTitle>
          <CardDescription className="text-md font-serif tracking-tight">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-15">
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
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

              <div className="flex flex-col gap-3 justify-center items-center">
                <Button
                  type="submit"
                  className="w-full font-mono"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Mail className="w-4 h-4 mr-2 animate-pulse" />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send reset link
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
