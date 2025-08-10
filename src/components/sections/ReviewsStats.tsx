'use client';

import { useEffect, useRef, useState } from 'react';
import { TreesIcon as Tree, Truck, Clock, Users } from 'lucide-react';

interface ReviewStat {
  icon: React.ComponentType<any>;
  number: number;
  suffix: string;
  title: string;
  description: string;
  isAnimated: boolean;
}

const reviewStats: ReviewStat[] = [
  {
    icon: Tree,
    number: 1000,
    suffix: '+',
    title: 'Trees Removed Across Canterbury',
    description: 'From tight urban sections to full rural field jobs — done safely, done right.',
    isAnimated: true
  },
  {
    icon: Truck,
    number: 300,
    suffix: '+',
    title: 'Land & Section Clears Completed',
    description: 'Paddocks, fence lines, lifestyle blocks, and hard-to-reach areas.',
    isAnimated: true
  },
  {
    icon: Clock,
    number: 24,
    suffix: '/7',
    title: 'Emergency Tree & Access Support',
    description: 'Storm damage, fallen trees, or blocked driveways — we\'re on-call when it matters.',
    isAnimated: false
  },
  {
    icon: Users,
    number: 500,
    suffix: '+',
    title: 'Canterbury Clients Backing Our Work',
    description: 'Homeowners, farmers, and rural property owners who trust MKM to get it done properly.',
    isAnimated: true
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
          
          const duration = 2000;
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
    <span ref={elementRef} className="text-4xl md:text-5xl font-bold text-gray-900">
      {count}{suffix}
    </span>
  );
}

export default function ReviewsStats() {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {reviewStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3ED17' }}>
                      <IconComponent className="w-8 h-8 text-black" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow">
                    <Counter 
                      target={stat.number} 
                      suffix={stat.suffix} 
                      isAnimated={stat.isAnimated}
                    />
                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">
                      {stat.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}