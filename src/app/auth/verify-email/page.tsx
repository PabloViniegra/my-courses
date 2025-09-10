"use client";

import { useRouter } from "next/navigation";
import { Mail, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyEmailPage() {
  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="bg-background text-foreground w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold font-sans tracking-tight">
            Verify your email
          </CardTitle>
          <CardDescription className="text-md font-serif tracking-tight">
            We&apos;ve sent a verification link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium font-serif">
                Account created successfully
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-serif">
              Please check your email and click the verification link to
              activate your account.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg font-sans">
            <h3 className="font-semibold text-sm mb-2">Next steps:</h3>
            <ol className="text-xs space-y-1 text-muted-foreground">
              <li>1. Check your inbox (and spam folder)</li>
              <li>2. Click the verification link in the email</li>
              <li>3. You&apos;ll be redirected back to the app</li>
            </ol>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full font-mono text-xs"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh page
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => router.push("/login")}
            >
              Back to login
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
