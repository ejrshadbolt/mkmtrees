import { Shield, Award, Clock, Wrench, Users, CheckCircle2 } from 'lucide-react';
import ParentServicePage from '@/components/page-types/ParentServicePage';

export default function EarthworksPage() {
  const subServices = [
    {
      title: "Station Work & Rural Earthworks",
      description: "Heavy-duty land services for high country and remote stations",
      href: "/earthworks/station-work-canterbury",
      image: "/stationwork.webp",
      imageAlt: "Heavy-duty earthworks machinery working on Canterbury station land"
    },
    {
      title: "Land Clearing",
      description: "Tidy, efficient clearing for paddocks, yards and overgrown sections",
      href: "/earthworks/land-clearing-canterbury",
      image: "/landclearing.webp",
      imageAlt: "Professional land clearing services removing overgrown vegetation"
    },
    {
      title: "Heavy-Duty Tilling",
      description: "Break up tough ground and get your land ready for what's next",
      href: "/earthworks/heavy-duty-tilling-canterbury",
      image: "/heavydutytilling.webp",
      imageAlt: "Heavy-duty tilling equipment preparing Canterbury farmland"
    }
  ];

  const features = [
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Specialized Heavy Equipment",
      description: "Purpose-built machinery designed for rural, rugged terrain and challenging Canterbury conditions."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Experienced Operators",
      description: "Skilled operators familiar with station work, difficult access, and high-demand rural projects."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Rural Canterbury Specialists",
      description: "Understanding of farmland needs, stock requirements, and rural property management."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Efficient Project Completion",
      description: "Fast, reliable service that works around farming schedules and weather conditions."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "Tough Terrain Ready",
      description: "Equipment and expertise for steep land, remote sites, and limited access areas."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Complete Site Preparation",
      description: "From clearing to finishing, we prepare land that's ready for fencing, planting, or development."
    }
  ];

  const bulletPoints = [
    "Heavy-duty machinery for challenging Canterbury terrain",
    "Station and high-country earthworks experience",
    "Land clearing for paddocks and development sites",
    "Compacted soil breaking and preparation",
    "Access track cutting and maintenance",
    "Drainage and water management solutions",
    "Complete site cleanup and finishing",
    "Respect for stock and farm operations"
  ];

  return (
    <ParentServicePage
      title="Earthworks Services in Christchurch & Canterbury"
      subtitle="Smart, Tidy Earthmoving for Rural Blocks, Stations & Lifestyle Properties"
      description="At MKM Trees, we provide reliable earthworks services across Christchurch and rural Canterbury. From clearing overgrown land to prepping tracks, yards, or tilling compacted ground, we've got the gear and the crew to handle it all — especially on tricky terrain. Our work is clean, efficient, and tailored for landowners who need practical outcomes: better access, safer paddocks, and usable ground you can build on, fence off, or grow from."
      problemTitle="The Problem We Solve"
      problemDescription="Many rural or semi-rural properties around Canterbury struggle with land that's overrun, uneven, or impossible to work with. Over time, weeds, scrub, and buried stumps take over. Soil gets hard-packed. Tracks wash out or become unusable. You're left with land that's more stress than value. DIY gear usually isn't up to the task. And many general earthmoving contractors aren't used to station-style jobs where access is rough and timing matters."
      solutionTitle="Why MKM's Earthworks Approach Works Better"
      solutionDescription="We specialise in land that's rural, rugged, or high-demand. Our team regularly handles station work, land clearing, and heavy-duty tilling for properties across Selwyn, Mid-Canterbury, and the Christchurch surrounds. We know how to work efficiently on uneven ground, remote sites, and where paddock access is limited. Our operators are experienced, our gear is specialised, and we leave every site tidied and ready for what's next — whether that's re-fencing, replanting, or development."
      heroImage="/earthworks.webp"
      heroImageAlt="Professional earthworks services across Canterbury rural properties"
      subServices={subServices}
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}