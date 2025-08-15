const serviceAreasList = [
  "Christchurch", "Halswell", "Riccarton", "Marshland", "Sumner", 
  "Selwyn District", "Rolleston", "Lincoln", "Leeston", "Darfield",
  "Ashburton", "Methven", "Rakaia", "Banks Peninsula", "Lyttelton",
  "Akaroa", "Duvauchelle", "Waimate", "Geraldine", "Rural Canterbury",
  "Canterbury High Country Stations"
];

export default function ServiceAreasList() {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Full List of MKM Trees Service Areas
            </h2>
            <div className="w-16 h-1 mx-auto mb-6" style={{ backgroundColor: '#F3ED17' }}></div>
            <p className="text-gray-600 italic">Optimised for local search snippets</p>
          </div>

          {/* Areas List */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {serviceAreasList.map((area, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-4 text-center border-l-4 border-gray-200 hover:border-yellow-400 transition-colors duration-200 group"
              >
                <span className="text-gray-900 font-medium group-hover:font-semibold transition-all duration-200">
                  {area}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 p-8 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Don&apos;t See Your Area Listed?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              We service the wider Canterbury region and are always expanding our coverage. 
              Give us a call to discuss your tree service needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:021 040 8099"
                className="inline-flex items-center px-8 py-3 font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 group rounded-sm"
                style={{ backgroundColor: '#F3ED17' }}
              >
                Call: 021 040 8099
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-3 font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-sm"
              >
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}