import { Mountain, Wrench, Shield, Users, Clock, CheckCircle2 } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function StationWorkPage() {
  const features = [
    {
      icon: <Mountain className="w-8 h-8 text-black" />,
      title: "High Country Specialists",
      description: "Extensive experience working across Canterbury's challenging hill country and remote stations."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Heavy-Duty Custom Machinery",
      description: "Purpose-built equipment designed for rough terrain, steep land, and extreme access challenges."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Station-Safe Operations",
      description: "Understanding of stock movement, farm operations, and timing to minimize disruption."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Experienced Rural Operators",
      description: "Operators who understand station life, rural challenges, and the realities of working remote sites."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Efficient, Fast Work",
      description: "Quick project completion that respects seasonal farming needs and weather windows."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Complete Rural Solutions",
      description: "From track cutting to yard preparation, we handle all aspects of station earthworks."
    }
  ];

  const bulletPoints = [
    "Professional station and high country experience",
    "Access track cutting and maintenance",
    "Scrub-choked gully clearing and restoration",
    "Yard preparation and service route development",
    "Steep terrain and hillside earthworks",
    "Stock-safe operations and timing",
    "Heavy-duty machinery for extreme conditions",
    "Complete site cleanup and restoration",
    "Wind damage repair and access restoration",
    "Free consultation for large station projects"
  ];

  return (
    <ChildServicePage
      title="Station Work & Rural Earthworks in Canterbury"
      subtitle="Heavy-Duty Land Services for High Country & Remote Stations"
      description="MKM Trees is trusted across Canterbury for professional station work — from clearing scrub-choked gullies to cutting in access tracks, yards, and service routes on hard-to-reach blocks. Our gear is built for tough terrain, and our operators know how to move safely and efficiently through farmland, hillsides, and remote stations. Whether you're maintaining a working property or opening up new ground, we bring the tools, timing, and experience to get it done right."
      problemTitle="The Problem with Station Access"
      problemDescription="On Canterbury stations, access is everything — but it doesn't take much for land to get overgrown, boggy, or blocked. Without regular clearing or track maintenance, paddocks become unreachable, stock flow suffers, and vehicles can't get in or out. Most contractors aren't equipped for the realities of rural stations. General machinery gets stuck or breaks down, and the job often takes longer than it should."
      solutionTitle="Why MKM is Built for Station Work"
      solutionDescription="We're not just landscapers with a digger. MKM crews are experienced in station and hill country jobs where steep land, deep ruts, and scrub-covered terrain are the norm. We use heavy-duty, custom-built machinery to clear, cut, shift and prep your land with speed and care. Whether it's restoring wind-damaged access tracks, widening fencelines, or prepping yards for development, we get in, get it sorted, and leave the site tidy."
      heroImage="/stationwork.webp"
      heroImageAlt="Heavy-duty earthworks machinery working on Canterbury station property"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}