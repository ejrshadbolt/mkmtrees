import { Wrench, Shield, Users, Clock, CheckCircle2, Award } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function HeavyDutyMulchingPage() {
  const features = [
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Purpose-Built Mulchers",
      description: "Heavy-duty equipment designed to handle the toughest vegetation, thick regrowth, and dense scrub."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Soil-Safe Processing",
      description: "Mulching method that preserves topsoil structure while breaking down vegetation into ground-level mulch."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Rough Terrain Specialists",
      description: "Equipment and operators experienced in challenging Canterbury terrain and limited-access sites."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Fast Land Recovery",
      description: "Efficient process that immediately opens up land for replanting, grazing, or development use."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "No Burning Required",
      description: "Clean, sustainable clearing method that eliminates fire risks and permit requirements."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "Soil Health Improvement",
      description: "Mulch layer suppresses weeds, retains moisture, and boosts ground health for future growth."
    }
  ];

  const bulletPoints = [
    "Heavy-duty mulching for extreme overgrowth",
    "Dense scrub and wild regrowth processing",
    "Invasive gorse and thick slash breakdown",
    "Steep slope and hillside mulching capability",
    "No soil compaction or surface damage",
    "Immediate land access and usability",
    "Natural mulch layer for weed suppression",
    "Fire hazard elimination and prevention",
    "Sustainable alternative to burning or bulldozing",
    "Complete site preparation for next steps"
  ];

  return (
    <ChildServicePage
      title="Heavy-Duty Mulching in Canterbury"
      subtitle="Clear Dense Growth Fast — Without Damaging the Land"
      description="At MKM Trees, we specialise in heavy-duty mulching for overgrown, rough, or hard-to-reach sites across Christchurch and rural Canterbury. Our gear is built to handle serious vegetation — from scrub and wild regrowth to invasive gorse and thick slash. We turn it into fine, ground-level mulch quickly and cleanly, with no burning or bulldozing needed. This is the fast, sustainable way to reclaim your land and prep it for what's next — without wrecking the topsoil."
      problemTitle="The Problem with Dense & Heavy Overgrowth"
      problemDescription="Sections of land left unmanaged for too long can become almost unusable. Thick regrowth, slash piles, or gnarly scrub slow down development, increase fire risk, and attract pests. Standard mowing or weed spraying won't touch it — and clearing it manually is expensive and unsafe. Heavy machines like bulldozers leave a mess, compact the soil, and often damage what you're trying to preserve."
      solutionTitle="Why MKM's Heavy-Duty Mulching System Works Best"
      solutionDescription="Our purpose-built mulchers chew through the toughest vegetation — no chainsaws, no excavators dragging roots, no burn piles. The material is shredded and mulched into the surface, suppressing weeds, protecting topsoil, and boosting ground moisture for future planting or grazing. We've used this method to prep paddocks, clean up firebreaks, and clear neglected blocks that haven't been touched in years."
      heroImage="/heavydutytilling.webp"
      heroImageAlt="Heavy-duty mulching equipment clearing dense overgrown vegetation"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}