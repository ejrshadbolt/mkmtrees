import { Shield, Mountain, Sparkles, Clock, Award } from 'lucide-react';

interface ValueItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

const values: ValueItem[] = [
  {
    icon: Award,
    title: "Trusted Across Canterbury",
    description: "We've earned our rep the right way — by doing the job properly, all over the region."
  },
  {
    icon: Mountain,
    title: "Built for Hard Access",
    description: "Steep, tight, or remote — we've got the gear and experience to get in and sort it."
  },
  {
    icon: Sparkles,
    title: "Tidy Finish, Every Time",
    description: "No shortcuts, no mess — your site is left clean and ready to go."
  },
  {
    icon: Clock,
    title: "On Call When It Counts",
    description: "Emergency tree and earthworks response, 24/7 across Canterbury."
  },
  {
    icon: Shield,
    title: "Safety Comes Standard",
    description: "Gold SiteWise certified and fully insured — we work smart and safe on every job."
  }
];

interface ValuesSectionProps {
  title?: string;
}

export default function ValuesSection({ 
  title = "What We Stand For" 
}: ValuesSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="w-full px-6 lg:px-12">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          <div className="w-16 h-1 mx-auto" style={{ backgroundColor: '#F3ED17' }}></div>
        </div>

        {/* Values Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white p-8 shadow-sm border-l-4 border-gray-200 hover:border-yellow-400 hover:scale-105 transition-all duration-200 text-center group"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200" style={{ backgroundColor: '#F3ED17' }}>
                      <IconComponent className="w-8 h-8 text-black" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
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