import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-muted/20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                                Q
                            </div>
                            <span className="font-bold text-xl">Quantum Perigee</span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm">
                            Empowering learners worldwide with cutting-edge courses and interactive learning experiences.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
                            <li><Link href="/instructors" className="hover:text-primary transition-colors">For Instructors</Link></li>
                            <li><Link href="/enterprise" className="hover:text-primary transition-colors">Enterprise</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <Link href="#" className="p-2 rounded-full bg-background/50 hover:bg-background hover:text-primary transition-all">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-background/50 hover:bg-background hover:text-primary transition-all">
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-background/50 hover:bg-background hover:text-primary transition-all">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Quantum Perigee. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                        <Link href="/terms" className="hover:text-foreground">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
