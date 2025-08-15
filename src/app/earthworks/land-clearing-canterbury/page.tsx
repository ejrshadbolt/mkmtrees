import { Scissors, Shield, Wrench, Users, Clock, CheckCircle2 } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function LandClearingPage() {
  const features = [
    {
      icon: <Scissors className="w-8 h-8 text-black" />,
      title: "Complete Vegetation Removal",
      description: "Professional clearing of wild growth, brush, tree waste, and old stumps from any size property."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Soil Protection Methods",
      description: "Clearing techniques that preserve topsoil quality and prepare land for future use."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Specialized Clearing Equipment",
      description: "Purpose-built machinery for efficient removal of root systems, tangled vegetation, and debris."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Canterbury Terrain Experts",
      description: "Experience across flat lifestyle sections to challenging high-country station properties."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Fast, Efficient Process",
      description: "Quick land assessment and clearing that gets your property ready for immediate use."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Complete Site Services",
      description: "Combined clearing, earthworks, and stump grinding for total land preparation."
    }
  ];

  const bulletPoints = [
    "Professional assessment of overgrown properties",
    "Gorse, broom, and invasive scrub removal",
    "Old stump and root system extraction",
    "Fence line clearing and maintenance access",
    "Paddock reclamation for grazing or development",
    "Brush and tree waste removal",
    "Site preparation for fencing or building",
    "Combined earthworks and tilling services",
    "Complete debris cleanup and disposal",
    "Free quotes with detailed clearing plans"
  ];

  return (
    <ChildServicePage
      title="Land Clearing in Canterbury"
      subtitle="Tidy, Efficient Clearing for Paddocks, Yards & Overgrown Sections"
      description="At MKM Trees, we provide expert land clearing across Christchurch, Selwyn, and wider Canterbury. Whether you're reclaiming a paddock, clearing fence lines, or prepping a site for development, our team has the gear and experience to clear your land fast — without the stress or mess. We regularly help lifestyle block owners, farmers, and rural contractors get their land usable again by removing wild growth, brush, tree waste, and old stumps."
      problemTitle="The Problem with Overgrown Land"
      problemDescription="When land is left to overgrow, it doesn't take long before it becomes unusable. Gorse, broom, and wild scrub take hold. Old stumps and roots make it impossible to fence or graze. Machinery access becomes risky, and jobs like planting, building, or yard prep get delayed — or blow out in cost. DIY solutions often fall short with root systems and tangled vegetation."
      solutionTitle="How MKM Clears Land the Right Way"
      solutionDescription="We do more than just flatten scrub. Our clearing process is built for tough Canterbury ground — from flat lifestyle sections to high-country stations. We assess your site and choose the right mix of mulching, grinding, and removal to open up land quickly while protecting the soil for what's next. Because we also offer earthworks, stump grinding, and tilling, we can finish the job properly — ready for fencing, planting, or development."
      heroImage="/landclearing.webp"
      heroImageAlt="Professional land clearing services removing overgrown vegetation in Canterbury"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}