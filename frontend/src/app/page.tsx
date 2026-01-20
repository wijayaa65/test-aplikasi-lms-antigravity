import Link from "next/link";
import { ArrowRight, BookOpen, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />

        <div className="container px-4 relative z-10 mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            New Courses Available
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Master the Future of <br />
            <span className="text-gradient">Digital Learning</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Access premium courses, track your progress with advanced analytics,
            and earn certificates. Join a community of lifelong learners.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/courses"
              className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:opacity-90 transition-all shadow-[0_0_20px_-5px_var(--primary)] hover:shadow-[0_0_25px_-5px_var(--primary)] flex items-center"
            >
              Browse Courses <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl glass border border-white/10 hover:bg-white/5 transition-all text-lg font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Learn Fast</h3>
              <p className="text-muted-foreground">
                Optimized video streaming and interactive quizzes help you learn concepts faster.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Invite Only</h3>
              <p className="text-muted-foreground">
                Exclusive access through our invitation system ensuring high-quality community.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-6">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Track Progress</h3>
              <p className="text-muted-foreground">
                Detailed analytics and charts to visualize your learning journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
