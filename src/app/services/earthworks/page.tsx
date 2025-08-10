export default function EarthworksPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Earthworks</h1>
      <p className="text-gray-600 mb-6">Parent service page content coming soon...</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Station Work</h3>
          <p className="text-gray-600">Station earthworks services...</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Land Clearing</h3>
          <p className="text-gray-600">Professional land clearing...</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Heavy-Duty Tilling</h3>
          <p className="text-gray-600">Heavy-duty tilling services...</p>
        </div>
      </div>
    </main>
  );
}