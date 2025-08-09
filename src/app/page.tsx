export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Template Ready</h1>
        <p className="text-gray-600">Admin CMS is ready. Build your custom pages from scratch.</p>
        <p className="text-sm text-gray-500 mt-2">
          Access admin at <a href="/admin" className="text-blue-600 hover:underline">/admin</a>
        </p>
      </div>
    </main>
  );
}