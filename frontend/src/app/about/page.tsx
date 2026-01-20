import Link from "next/link";
import { BookOpen, Users, Award, Zap, Shield, TrendingUp } from "lucide-react";


export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />

                <div className="container px-4 relative z-10 mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        About <span className="text-gradient">Quantum Perigee</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        We&apos;re building the future of online education with cutting-edge technology
                        and a community-first approach.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-muted/30">
                <div className="container px-4 mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Mission</h2>
                        <p className="text-lg text-muted-foreground text-center mb-12">
                            To democratize access to world-class education while maintaining the highest
                            standards of quality through our invite-based community model.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="glass-card p-8 rounded-2xl">
                                <h3 className="text-xl font-bold mb-3">For Learners</h3>
                                <p className="text-muted-foreground">
                                    Access premium courses from industry experts, track your progress with
                                    advanced analytics, and earn recognized certificates upon completion.
                                </p>
                            </div>
                            <div className="glass-card p-8 rounded-2xl">
                                <h3 className="text-xl font-bold mb-3">For Instructors</h3>
                                <p className="text-muted-foreground">
                                    Share your expertise with a curated audience, manage courses with
                                    powerful tools, and build a community of engaged learners.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container px-4 mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                        What Makes Us Different
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Invite-Only Community</h3>
                            <p className="text-muted-foreground">
                                Our exclusive invitation system ensures a high-quality learning environment
                                with engaged and motivated participants.
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary mb-6">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
                            <p className="text-muted-foreground">
                                Advanced analytics and detailed progress tracking help you visualize your
                                learning journey and stay motivated.
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-6">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Modern Technology</h3>
                            <p className="text-muted-foreground">
                                Built with the latest web technologies for a fast, responsive, and
                                delightful learning experience.
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Quality Content</h3>
                            <p className="text-muted-foreground">
                                All courses are carefully curated and taught by experienced instructors
                                who are experts in their fields.
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary mb-6">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community Driven</h3>
                            <p className="text-muted-foreground">
                                Connect with fellow learners, share insights, and grow together in a
                                supportive community environment.
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-6">
                                <Award className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Recognized Certificates</h3>
                            <p className="text-muted-foreground">
                                Earn certificates upon course completion that showcase your new skills
                                and knowledge to employers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-muted/30">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Start Learning?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join our community of learners and instructors today. Get started with our
                        premium courses and take your skills to the next level.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/courses"
                            className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:opacity-90 transition-all shadow-[0_0_20px_-5px_var(--primary)] hover:shadow-[0_0_25px_-5px_var(--primary)]"
                        >
                            Browse Courses
                        </Link>
                        <Link
                            href="/auth/register"
                            className="px-8 py-4 rounded-xl glass border border-white/10 hover:bg-white/5 transition-all text-lg font-medium"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
