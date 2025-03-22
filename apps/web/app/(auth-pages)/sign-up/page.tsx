"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Password validation
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  useEffect(() => {
    if (password) {
      setPasswordError(validatePassword(password));
    } else {
      setPasswordError("");
    }
  }, [password]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate password before submission
    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }
    
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        alert("Account created! Please sign in.");
        router.push("/sign-in"); // Redirect to sign-in after signup
      } else {
        alert("Error creating account");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md border-black/10 shadow-sm">
        <CardHeader className="space-y-1 pb-6">
          <h1 className="font-heading text-3xl font-medium tracking-tight">
            Sign Up
          </h1>
          <CardDescription>
            Enter your email and password to create an account
          </CardDescription>
        </CardHeader>

        <Separator className="mb-6" />

        <CardContent>
          {error && (
            <Alert
              variant="destructive"
              className="mb-6 rounded-none border-red-500/50 bg-red-50 text-red-900"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black ${
                  passwordError ? "border-red-500" : ""
                }`}
              />
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                Password must contain at least 8 characters, including uppercase, lowercase, 
                numbers, and special characters.
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !!passwordError}
              className="w-full rounded-none bg-black text-white hover:bg-black/90"
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center border-t border-black/10 p-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium underline underline-offset-4 hover:text-black"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
