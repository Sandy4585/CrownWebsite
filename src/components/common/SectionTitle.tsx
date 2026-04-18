import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionTitle({
  title,
  subtitle,
  className,
  align = "center",
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="font-heading text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <div
        className={cn(
          "mt-4 h-1 w-20 rounded-full gold-gradient",
          align === "center" && "mx-auto"
        )}
      />
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-text-secondary sm:text-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
