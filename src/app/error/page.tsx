"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ErrorPageContent() {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const message = searchParams.get('message');
    setError(message || "An unexpected error occurred");
  }, [searchParams]);

  return (
    <section className="flex flex-col items-center justify-center h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="bg-background text-foreground w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold font-sans tracking-tight">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-md font-serif tracking-tight">
            We encountered an error processing your request
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <Button
              variant="default"
              className="w-full font-mono text-xs"
              onClick={() => window.history.back()}
            >
              Go back
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs"
              onClick={() => router.push('/login')}
            >
              Back to login
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => router.push('/')}
            >
              Home page
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <section className="flex flex-col items-center justify-center h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </section>
    }>
      <ErrorPageContent />
    </Suspense>
  );
}