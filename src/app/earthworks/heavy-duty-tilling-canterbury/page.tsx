import { Wrench, Shield, Users, Clock, CheckCircle2, Award } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function HeavyDutyTillingPage() {
  const features = [
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Powerful Deep Tilling",
      description: "Heavy-duty equipment designed for breaking through compacted soil, clay pans, and tough ground."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Soil Health Focused",
      description: "Tilling methods that improve drainage, break up compaction, and prepare soil for long-term use."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Canterbury Soil Specialists",
      description: "Understanding of local soil conditions from stony plains to wind-blown high country properties."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Efficient Ground Preparation",
      description: "Fast, thorough tilling that gets your land ready for planting, pasture, or development work."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Complete Vegetation Control",
      description: "Tilling process that uproots old vegetation, weeds, and prepares clean planting surfaces."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "Challenging Terrain Ready",
      description: "Equipment and expertise for lifestyle blocks, farms, and stations with difficult ground conditions."
    }
  ];

  const bulletPoints = [
    "Professional soil assessment and tilling planning",
    "Deep tilling for compacted and hard-packed ground",
    "Root system and vegetation breakdown",
    "Pasture preparation and seeding readiness",
    "Clay pan breaking and drainage improvement",
    "Fire prevention ground preparation",
    "Erosion control and soil stabilization",
    "Combined with land clearing services",
    "Suitable for lifestyle blocks to large stations",
    "Free consultation with soil improvement advice"
  ];

  return (
    <ChildServicePage
      title="Heavy-Duty Tilling in Canterbury"
      subtitle="Break Up Tough Ground & Get Your Land Ready for What's Next"
      description="MKM Trees offers professional heavy-duty tilling across Christchurch, Selwyn, and rural Canterbury. Whether you're reclaiming paddocks, prepping ground for pasture, or regenerating compacted soil, our team delivers powerful, deep tilling that turns problem ground into workable land — fast. We regularly till for lifestyle blocks, farms, and stations that need more than just a standard rotary hoe."
      problemTitle="The Problem We Solve"
      problemDescription="Canterbury soil gets compacted fast — especially on lifestyle blocks that were once farmed or left fallow. Over time, roots, weeds, clay pans, and gorse slash make the top layer almost impossible to work with. Planting struggles, drainage worsens, and machinery can't break through. Standard tillers or hired equipment often aren't powerful enough to make a real difference. You end up frustrated, with half-done prep and wasted time."
      solutionTitle="How MKM Handles Tilling Properly"
      solutionDescription="Our tilling gear is designed for hard work — deep, powerful passes that break up compacted ground, uproot old vegetation, and prepare the soil for real use. Whether you're planting pasture, reworking paddocks, or fire-prepping scrubby blocks, we till in a way that sets you up to succeed long term. We understand the unique challenges of Canterbury land — from stony plains to wind-blown high country. That means we know when to till, how deep to go, and how to match the job with your next step — whether that's fencing, planting, or erosion control."
      heroImage="/heavydutytilling.webp"
      heroImageAlt="Heavy-duty tilling equipment breaking up compacted Canterbury soil"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}