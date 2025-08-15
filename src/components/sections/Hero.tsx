import Image from 'next/image';
import Link from 'next/link';

interface HeroButton {
  text: string;
  href: string;
  variant: 'primary' | 'secondary';
}

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  backgroundAlt: string;
  buttons: HeroButton[];
}

export default function Hero({
  title,
  subtitle,
  backgroundImage,
  backgroundAlt,
  buttons
}: HeroProps) {
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

      {/* Content Grid - 70/30 split */}
      <div className="relative z-10 h-full grid grid-cols-10 px-12 lg:px-24">
        
        {/* Left Column - 70% (7/10) */}
        <div className="col-span-7 flex items-end pb-20">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)' }}>
              {title}
            </h1>
            <p className="text-lg md:text-xl text-white font-light leading-relaxed max-w-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Column - 30% (3/10) */}
        <div className="col-span-3 flex flex-col justify-end items-end pb-20">
          <div className="flex flex-wrap gap-3">
            {buttons.map((button, index) => (
              <Link
                key={index}
                href={button.href}
                className="px-5 py-2 font-semibold text-black hover:scale-105 hover:shadow-lg focus-visible-ring focus-ring-yellow whitespace-nowrap relative group"
                style={{ 
                  backgroundColor: '#F3ED17',
                  transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out'
                }}
              >
                <span className="relative">
                  {button.text}
                  <span 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Divider between content and bottom */}
      <div className="absolute bottom-12 left-12 right-12 lg:left-24 lg:right-24 z-20 h-0.5 bg-white opacity-50"></div>
    </section>
  );
}