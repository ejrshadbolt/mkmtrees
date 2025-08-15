import { Scissors, Shield, Wrench, Users, Clock, CheckCircle2 } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function PaddockMulchingPage() {
  const features = [
    {
      icon: <Scissors className="w-8 h-8 text-black" />,
      title: "Complete Paddock Restoration",
      description: "Professional clearing of overgrown grass, scrub regrowth, and stubble for immediate paddock use."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Soil Health Improvement",
      description: "Mulching process that retains moisture, suppresses weeds, and improves overall paddock health."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Specialized Paddock Equipment",
      description: "Mulching machinery designed for efficient clearing of grassland vegetation and stubble."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Livestock & Equine Specialists",
      description: "Understanding of grazing requirements and paddock management for stock and horse properties."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Fast Turnaround Service",
      description: "Quick paddock clearing that gets your land ready for stock or replanting with minimal downtime."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Ready for Immediate Use",
      description: "Clean, level finish that's immediately suitable for grazing, replanting, or further development."
    }
  ];

  const bulletPoints = [
    "Professional overgrown paddock restoration",
    "Long grass and kikuyu mulching",
    "Gorse regrowth and scrub control",
    "Old stubble and crop residue processing",
    "Fire prevention and hazard reduction",
    "Pest attraction elimination",
    "Weed suppression through natural mulching",
    "Improved soil moisture retention",
    "Stock-safe and equine-friendly results",
    "Combined with tilling and reseeding services"
  ];

  return (
    <ChildServicePage
      title="Paddock Mulching in Canterbury"
      subtitle="Get Overgrown Grass, Scrub & Stubble Under Control — Fast"
      description="At MKM Trees, we provide efficient paddock mulching services across Christchurch, Selwyn, and rural Canterbury. Whether you've got overgrown grass, regrowth scrub, or leftover stubble after a harvest, we use powerful gear to clear and mulch the surface clean — no burning, no bulldozing, and no soil damage. Perfect for lifestyle blocks, small farms, or leased paddocks needing a reset."
      problemTitle="The Problem We Solve"
      problemDescription="Paddocks left unmanaged quickly become unusable. Long grass, gorse regrowth, and old stubble attract pests, increase fire risk, and make the land harder to use. Traditional mowing doesn't cut it — literally — and chemical spraying creates more clean-up long term. Trying to turn it over by hand or hiring the wrong gear can be a waste of time and money. And leaving it too long leads to compacted soil, erosion, or poor regrowth."
      solutionTitle="How MKM Makes Paddocks Productive Again"
      solutionDescription="Our team brings in specialised mulching equipment that clears vegetation and breaks it down directly into the top layer of soil. This creates a mulch layer that retains moisture, suppresses weeds, and improves paddock health — ready for stock, replanting, or future tilling. From equine grazing blocks in West Melton to large rural properties in Selwyn, we deliver clean, consistent results with minimal disturbance. Because we work across Canterbury's diverse terrain, we know how to do the job right — safely, quickly, and with a tidy finish."
      heroImage="/paddockmulching.webp"
      heroImageAlt="Professional paddock mulching services for Canterbury farms and lifestyle blocks"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}