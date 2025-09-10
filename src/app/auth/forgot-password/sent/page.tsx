"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function PasswordResetSentContent() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    setEmail(emailParam);
  }, [searchParams]);

  return (
    <section className="flex flex-col items-center justify-center h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="bg-background text-foreground w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold font-sans tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription className="text-md font-serif tracking-tight">
            We&apos;ve sent a password reset link to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium font-serif">
                Reset email sent
              </span>
            </div>
            {email && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium text-center">{email}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground font-serif">
              Please check your email and click the reset link to create a new password.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg font-sans">
            <h3 className="font-semibold text-sm mb-2">Next steps:</h3>
            <ol className="text-xs space-y-1 text-muted-foreground">
              <li>1. Check your inbox (and spam folder)</li>
              <li>2. Click the password reset link in the email</li>
              <li>3. Create your new password</li>
              <li>4. Sign in with your new credentials</li>
            </ol>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              variant="default"
              className="w-full font-mono text-xs"
              onClick={() => router.push('/login')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs"
              onClick={() => router.push('/auth/forgot-password')}
            >
              Resend reset email
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default function PasswordResetSentPage() {
  return (
    <Suspense fallback={
      <section className="flex flex-col items-center justify-center h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </section>
    }>
      <PasswordResetSentContent />
    </Suspense>
  );
}