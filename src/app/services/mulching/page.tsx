export default function MulchingPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mulching</h1>
      <p className="text-gray-600 mb-6">Parent service page content coming soon...</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Heavy-Duty Mulching</h3>
          <p className="text-gray-600">Heavy-duty mulching services...</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Gorse & Slash Mulching</h3>
          <p className="text-gray-600">Specialized gorse and slash mulching...</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Paddock Mulching</h3>
          <p className="text-gray-600">Paddock mulching services...</p>
        </div>
      </div>
    </main>
  );
}