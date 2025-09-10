"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "@/app/login/actions";
import { createClient } from "@/utils/supabase/client";
import { GoogleIcon } from "@/components/icons/google-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);

      const result = await login(formData);

      if (!result.success) {
        toast.error(result.error || "Invalid credentials. Please try again.");
        return;
      }

      toast.success("Welcome back!");
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.includes("NEXT_REDIRECT")
      ) {
        toast.success("Welcome back!");
        return;
      }

      console.error("Login error", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  });

  async function handleGoogleLogin() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${
          process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
        }/auth/callback?next=/`,
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
            Login to your account
          </CardTitle>
          <CardDescription className="text-md font-serif tracking-tight">
            Enter your credentials to access your account
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

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="text-xs font-serif tracking-tight"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => router.push("/auth/forgot-password")}
                    className="ml-auto inline-block text-xs font-serif tracking-tight underline-offset-4 hover:underline hover:text-primary"
                  >
                    Forgot your password?
                  </button>
                </div>
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

              <div className="flex flex-col gap-3 justify-center items-center">
                <Button
                  type="submit"
                  className="w-1/2 font-mono"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <Button
                  variant="outline"
                  className="w-1/2 font-mono gap-x-2"
                  type="button"
                  onClick={handleGoogleLogin}
                >
                  <GoogleIcon className="w-5 h-5" />
                  Login with Google
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-xs font-serif tracking-tight my-5">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/signup")}
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
