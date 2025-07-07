// Esta página no debería ser accesible directamente debido al middleware
// El middleware redirige automáticamente "/" a "/login"
export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 border-t-purple-500 dark:border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">
          Redirigiendo...
        </p>
      </div>
    </div>
  );
}
