import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="text-center">
        <h1 className="font-heading text-8xl font-bold gold-gradient-text">
          404
        </h1>
        <h2 className="mt-4 font-heading text-2xl font-bold text-text">
          Page Not Found
        </h2>
        <p className="mt-2 text-text-secondary">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg gold-gradient px-6 py-3 font-semibold text-bg"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
