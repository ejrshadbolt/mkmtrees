export default function TreeServicesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tree Services</h1>
      <p className="text-gray-600 mb-6">Parent service page content coming soon...</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Qualified Arborists</h3>
          <p className="text-gray-600">Expert arborist services...</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Stump Grinding</h3>
          <p className="text-gray-600">Professional stump removal...</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Tree Reductions</h3>
          <p className="text-gray-600">Tree reduction services...</p>
        </div>
      </div>
    </main>
  );
}