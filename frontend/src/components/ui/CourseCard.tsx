import Image from "next/image";
import Link from "next/link";
import { User, DollarSign } from "lucide-react";
import { Course } from "@/lib/api";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { id, title, thumbnail_url, price, description, instructor_id } =
    course;

  // Formatting price
  const formattedPrice =
    price === 0 || price === undefined
      ? "Free"
      : `$${typeof price === "number" ? price.toFixed(2) : price}`;

  return (
    <Link href={`/courses/${id}`} className="group">
      <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 h-full flex flex-col">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={thumbnail_url || "/placeholder-course.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              {/* Placeholder for instructor name or use ID if meaningful (it's not usually) */}
              {/* We could fetch user name but for listing it might be N+1. Just showing 'Expert Instructor' or hiding it. */}
              {/* <User className="h-3 w-3 mr-1" /> */}
              {/* <span>Instructor</span> */}
            </div>

            <span className="font-bold text-lg text-primary">
              {formattedPrice}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
