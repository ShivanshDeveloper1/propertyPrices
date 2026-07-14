export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        
        {/* The "Simple Round Thing" (Spinner) */}
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>

        {/* Subtle Text */}
        <p className="mt-4 text-sm font-medium text-gray-500 tracking-wide animate-pulse">
          Fetching Details...
        </p>

        {/* Soft Background Glow (Optional - adds "depth" without weight) */}
        <div className="absolute -z-10 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-50"></div>
      </div>
    </div>
  );
}