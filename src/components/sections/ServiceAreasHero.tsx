export default function ServiceAreasHero() {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Photo */}
            <div className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://placehold.co/600x450/2d5016/ffffff?text=Canterbury+Tree+Services+Coverage+Map"
                  alt="Canterbury tree services coverage showing rural properties and urban areas where MKM Trees operates"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="order-1 lg:order-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Areas We Service – Tree & Land Work Across Canterbury
              </h1>
              <div className="w-16 h-1 mb-8" style={{ backgroundColor: '#F3ED17' }}></div>
              
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-8 leading-relaxed">
                Trusted Tree Services Across Christchurch, Selwyn, Ashburton, Banks Peninsula & Rural Canterbury
              </h2>
              
              <div className="text-lg text-gray-600 leading-relaxed space-y-4">
                <p>
                  MKM Trees provides professional arborist and land maintenance services across the wider Canterbury region. From Christchurch's suburbs to the back blocks of Banks Peninsula and Selwyn's high country farms, we deliver safe, certified work with the right gear for any terrain.
                </p>
                <p className="font-medium">
                  If you're looking for local expertise in tree care, emergency cleanups, or land clearing, we're already working near you.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}