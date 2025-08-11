import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  experience?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Mark McDonald",
    role: "Owner & Lead Arborist",
    image: "https://placehold.co/400x400/4a5568/ffffff?text=Mark+McDonald",
    experience: "15+ Years Experience"
  },
  {
    name: "Kyle Anderson",
    role: "Senior Tree Specialist",
    image: "https://placehold.co/400x400/4a5568/ffffff?text=Kyle+Anderson",
    experience: "8+ Years Experience"
  },
  {
    name: "Mike Thompson",
    role: "Earthworks Operator",
    image: "https://placehold.co/400x400/4a5568/ffffff?text=Mike+Thompson",
    experience: "12+ Years Experience"
  }
];

interface TeamSectionProps {
  title?: string;
  subtitle?: string;
}

export default function TeamSection({ 
  title = "Meet The Team",
  subtitle = "We're a tight-knit team of experienced arborists, operators and locals who take pride in doing a job right."
}: TeamSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-6 lg:px-12">
        {/* Title and Subtitle */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <div className="w-16 h-1 mx-auto mb-8" style={{ backgroundColor: '#F3ED17' }}></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Team Cards Container - Larger width */}
        <div className="w-4/5 mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden bg-gray-50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {/* Team Member Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Subtle overlay for better text readability */}
                  <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-5 transition-all duration-300"></div>
                </div>

                {/* Member Info Card Content */}
                <div className="p-8 space-y-4 text-left">
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                    {member.name}
                  </h3>
                  
                  <p className="text-lg text-gray-700 font-semibold">
                    {member.role}
                  </p>
                  
                  {member.experience && (
                    <p className="text-gray-600 text-sm font-medium">
                      {member.experience}
                    </p>
                  )}
                  
                  {/* Yellow accent bar at bottom */}
                  <div className="pt-3">
                    <div className="w-12 h-1" style={{ backgroundColor: '#F3ED17' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}