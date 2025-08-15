import { Shield, Award, Clock, Wrench, Users, CheckCircle2 } from 'lucide-react';
import ParentServicePage from '@/components/page-types/ParentServicePage';

export default function MulchingPage() {
  const subServices = [
    {
      title: "Heavy-Duty Mulching",
      description: "Clear dense growth fast without damaging the land",
      href: "/mulching/heavy-duty-canterbury",
      image: "/heavydutytilling.webp",
      imageAlt: "Heavy-duty mulching equipment clearing dense vegetation in Canterbury"
    },
    {
      title: "Gorse & Slash Mulching",
      description: "Fast, clean removal of invasive scrub and forestry waste",
      href: "/mulching/gorse-slash-canterbury",
      image: "/gorseandslashmulching.webp",
      imageAlt: "Specialized mulching of gorse and forestry slash waste"
    },
    {
      title: "Paddock Mulching",
      description: "Get overgrown grass, scrub and stubble under control fast",
      href: "/mulching/paddock-canterbury",
      image: "/paddockmulching.webp",
      imageAlt: "Professional paddock mulching services for Canterbury farms"
    }
  ];

  const features = [
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Heavy-Duty Mulching Equipment",
      description: "Purpose-built mulchers that handle the toughest vegetation, scrub, and forestry waste efficiently."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Sustainable Land Management",
      description: "Environmentally responsible mulching that improves soil health and reduces fire hazards."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Difficult Terrain Specialists",
      description: "Equipment and expertise for steep slopes, dense regrowth, and hard-to-reach Canterbury blocks."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Fast, Clean Results",
      description: "Efficient mulching process that leaves your land immediately ready for next steps."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "No Burning or Bulldozing",
      description: "Clean mulching method that preserves topsoil structure and eliminates fire risks."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Complete Land Preparation",
      description: "Mulching service that leaves land ready for replanting, grazing, or development work."
    }
  ];

  const bulletPoints = [
    "Heavy-duty mulching for overgrown properties",
    "Gorse, broom, and invasive scrub control",
    "Forestry slash and debris processing",
    "Fire hazard reduction and prevention",
    "Paddock clearing and restoration",
    "Steep slope and difficult access mulching",
    "Soil health improvement through natural mulch",
    "No burning permits or cleanup required"
  ];

  return (
    <ParentServicePage
      title="Mulching Services in Canterbury"
      subtitle="Fast, Clean Land Prep with Heavy-Duty Mulching Gear"
      description="At MKM Trees, we provide professional mulching services across Christchurch, Selwyn, and rural Canterbury. Whether you're reclaiming an overgrown section, breaking down slash piles, or clearing paddocks for pasture, our powerful gear turns scrub, gorse, and debris into fine mulch — fast, safe, and with minimal disruption to your land. We handle jobs others can't — steep slopes, dense regrowth, and hard-to-reach blocks are no problem for our crew."
      problemTitle="The Problem We Solve"
      problemDescription="Overgrown vegetation and scrub waste time, reduce land use, and increase fire risk. Gorse, broom, and slash piles are common across Canterbury properties, but they're tough to shift without the right machinery. Left too long, they invite pests, choke regrowth, and make land harder to manage. Standard clearing methods like burning or bulldozing often leave a mess, compact the soil, or require permits. They're slow, risky, and not sustainable."
      solutionTitle="Why MKM's Mulching Approach Works Better"
      solutionDescription="Our heavy-duty mulchers grind vegetation directly into the soil surface — breaking down growth, removing root systems, and leaving a clean, walkable finish. Mulching improves soil health, boosts drainage, and gives you immediate access to reclaim land or replant without follow-up work. Because we work across lifestyle blocks, hill country farms, and forestry edges, we know how to match the right mulching method to your site. Whether it's gorse on a hillside, slash in a pine block, or kikuyu taking over a paddock, we sort it quickly and properly — without tearing up your land."
      heroImage="/mulching.webp"
      heroImageAlt="Professional mulching services clearing overgrown land in Canterbury"
      subServices={subServices}
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}