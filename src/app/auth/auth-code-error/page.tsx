"use client";

import { useRouter } from "next/navigation";
import { XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthCodeErrorPage() {
  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="bg-background text-foreground w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold font-sans tracking-tight">
            Authentication error
          </CardTitle>
          <CardDescription className="text-md font-serif tracking-tight">
            There was a problem with your authentication code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              The authentication code may have expired or is invalid. Please try signing up or logging in again.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              variant="default"
              className="w-full font-mono text-xs"
              onClick={() => router.push('/auth/signup')}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try signing up again
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs"
              onClick={() => router.push('/login')}
            >
              Back to login
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}