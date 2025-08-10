'use client';

import { useEffect, useRef, useState } from 'react';
import { TreesIcon as Tree, Truck, MapPin, Clock } from 'lucide-react';

interface StatItem {
  icon: React.ComponentType<any>;
  number: number;
  suffix: string;
  label: string;
  isAnimated: boolean;
}

const stats: StatItem[] = [
  {
    icon: Tree,
    number: 1000,
    suffix: '+',
    label: 'Trees Removed Safely',
    isAnimated: true
  },
  {
    icon: Truck,
    number: 300,
    suffix: '+',
    label: 'Land Clearing & Earthmoving Jobs',
    isAnimated: true
  },
  {
    icon: MapPin,
    number: 20,
    suffix: '+',
    label: 'Canterbury Areas Serviced',
    isAnimated: true
  },
  {
    icon: Clock,
    number: 24,
    suffix: '/7',
    label: 'Emergency Callouts Available',
    isAnimated: false
  }
];

function Counter({ target, suffix, isAnimated }: { target: number; suffix: string; isAnimated: boolean }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isAnimated) {
      setCount(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted && !hasCompleted) {
          setHasStarted(true);
          
          const duration = 2000; // 2 seconds
          const steps = 50;
          const increment = target / steps;
          const stepDuration = duration / steps;

          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              setHasCompleted(true);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, stepDuration);

          // Disconnect observer once animation starts to prevent re-triggering
          observer.disconnect();

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current && !hasCompleted) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target, hasStarted, hasCompleted, isAnimated]);

  return (
    <span ref={elementRef} className="text-4xl md:text-5xl font-bold text-white">
      {count}{suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section style={{ backgroundColor: '#050608' }} className="py-16">
      <div className="w-full px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                      <IconComponent className="w-8 h-8 text-black" />
                    </div>
                  </div>
                  <Counter 
                    target={stat.number} 
                    suffix={stat.suffix} 
                    isAnimated={stat.isAnimated}
                  />
                  <p className="text-gray-300 text-lg mt-2 font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}