export default function EmergencyCalloutsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Emergency Callouts</h1>
      <p className="text-gray-600 mb-6">Parent service page content coming soon...</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Emergency Tree Services</h3>
          <p className="text-gray-600">24/7 emergency tree services...</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Emergency Earthworks</h3>
          <p className="text-gray-600">Emergency earthworks response...</p>
        </div>
      </div>
    </main>
  );
}