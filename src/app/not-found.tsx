import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md mx-auto">
        <span className="font-mono text-xs uppercase tracking-widest text-gold-dark font-medium block mb-3">
          404 &bull; Page Not Found
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest mb-4">
          Lost in Reflection
        </h1>
        <p className="text-charcoal-muted text-sm sm:text-base font-light leading-relaxed mb-8">
          The page you are looking for does not exist or has been moved. Let us guide you back home.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-forest text-ivory text-xs uppercase tracking-wider font-medium hover:bg-forest-light transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
