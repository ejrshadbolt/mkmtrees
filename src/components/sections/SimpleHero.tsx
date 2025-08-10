import Image from 'next/image';

interface SimpleHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  backgroundAlt: string;
}

export default function SimpleHero({
  title,
  subtitle,
  backgroundImage,
  backgroundAlt
}: SimpleHeroProps) {
  return (
    <section className="relative overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={backgroundAlt}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content - Full Width */}
      <div className="relative z-10 h-full flex items-end px-12 lg:px-24 pb-20">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white font-light leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Divider at bottom */}
      <div className="absolute bottom-12 left-12 right-12 lg:left-24 lg:right-24 z-20 h-0.5 bg-white opacity-50"></div>
    </section>
  );
}