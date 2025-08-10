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

        {/* Team Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                {/* Image Container */}
                <div className="relative overflow-hidden mb-6 mx-auto w-80 h-80 bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>

                {/* Member Info */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-lg font-semibold" style={{ color: '#F3ED17' }}>
                    {member.role}
                  </p>
                  {member.experience && (
                    <p className="text-gray-600 font-medium">
                      {member.experience}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}