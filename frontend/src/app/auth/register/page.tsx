"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Github, Mail, Lock, User, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [role, setRole] = useState<'student' | 'instructor'>('student');
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await register(email, password, fullName, role);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container relative h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-secondary/20 backdrop-blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/80" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-2 font-bold">Q</div>
                    Quantum Perigee
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Join thousands of learners and instructors in the most advanced learning ecosystem.&rdquo;
                        </p>
                        <footer className="text-sm">Community Lead</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email below to create your account
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => setRole('student')}
                                className={cn(
                                    "cursor-pointer rounded-lg border p-4 hover:border-primary transition-all relative overflow-hidden",
                                    role === 'student' ? "border-primary bg-primary/5" : "border-input"
                                )}
                            >
                                {role === 'student' && <div className="absolute top-2 right-2 text-primary"><Check className="h-4 w-4" /></div>}
                                <div className="font-semibold mb-1">Student</div>
                                <div className="text-xs text-muted-foreground">I want to learn skills</div>
                            </div>
                            <div
                                onClick={() => setRole('instructor')}
                                className={cn(
                                    "cursor-pointer rounded-lg border p-4 hover:border-primary transition-all relative overflow-hidden",
                                    role === 'instructor' ? "border-primary bg-primary/5" : "border-input"
                                )}
                            >
                                {role === 'instructor' && <div className="absolute top-2 right-2 text-primary"><Check className="h-4 w-4" /></div>}
                                <div className="font-semibold mb-1">Instructor</div>
                                <div className="text-xs text-muted-foreground">I want to teach others</div>
                            </div>
                        </div>

                        <form onSubmit={onSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <input
                                            id="name"
                                            placeholder="John Doe"
                                            type="text"
                                            autoCapitalize="words"
                                            autoComplete="name"
                                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={isLoading}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <input
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={isLoading}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none text-muted-foreground" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <input
                                            id="password"
                                            placeholder="••••••••"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="new-password"
                                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={isLoading}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button disabled={isLoading} type="submit" className="w-full">
                                    {isLoading && (
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    )}
                                    Create account
                                </Button>
                            </div>
                        </form>

                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By clicking continue, you agree to our{" "}
                            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                                Privacy Policy
                            </Link>
                            .
                        </p>

                        <p className="px-8 text-center text-sm text-muted-foreground">
                            <Link href="/auth/login" className="hover:text-brand underline underline-offset-4">
                                Already have an account? Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
