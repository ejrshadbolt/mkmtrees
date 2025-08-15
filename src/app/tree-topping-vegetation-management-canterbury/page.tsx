import { Shield, Award, Clock, Wrench, Users, CheckCircle2 } from 'lucide-react';
import ParentServicePage from '@/components/page-types/ParentServicePage';

export default function TreeToppingVegetationManagementPage() {
  const subServices = [
    {
      title: "Tree Topping",
      description: "Safe height control for trees that have grown too tall",
      href: "/tree-topping/tree-topping-canterbury",
      image: "/treetopping.webp",
      imageAlt: "Professional tree topping service using elevated boom saw"
    },
    {
      title: "Tall Tree Topping",
      description: "Specialist tree work for high, hard-to-reach jobs",
      href: "/tree-topping/tall-tree-topping-canterbury",
      image: "/talltreetopping.webp",
      imageAlt: "Tall tree topping with specialized equipment and safety gear"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Safety First Approach",
      description: "SiteWise Gold certified team with proper training for high-risk vegetation management work."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "17-Metre Boom Saw",
      description: "Professional elevated equipment for reaching tall trees safely without compromising quality."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Canterbury Specialists",
      description: "We understand local growing conditions, wind patterns, and seasonal vegetation challenges."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Land-Safe Techniques",
      description: "Proper topping methods that preserve tree health and prevent unstable regrowth."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Rural & Urban Experience",
      description: "From lifestyle blocks to exposed stations, we handle all types of Canterbury properties."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Compliance & Cleanup",
      description: "Work meets council regulations with complete site cleanup and waste disposal included."
    }
  ];

  const bulletPoints = [
    "Professional tree topping that maintains tree health",
    "Vegetation management for overgrown shelterbelts",
    "Powerline clearance and safety work",
    "View restoration and light improvement",
    "Wind-resistant pruning techniques",
    "Fire hazard reduction and prevention",
    "Complete site cleanup and waste removal",
    "Council regulation compliance assistance"
  ];

  return (
    <ParentServicePage
      title="Tree Topping & Vegetation Management in Canterbury"
      subtitle="Tame Overgrowth, Let In Light, and Protect What Matters"
      description="At MKM Trees, we provide professional tree topping and vegetation control across Christchurch and the wider Canterbury region. From overgrown shelterbelts and towering gums to invasive scrub creeping across fencelines, our crew has the skills, gear, and experience to bring your land back under control — safely and properly. We regularly service lifestyle blocks in Selwyn, hill sites in Banks Peninsula, and rural properties where growth gets out of hand fast."
      problemTitle="The Problem We Solve"
      problemDescription="Left unchecked, tall trees and thick vegetation can become more than just a visual issue. They block sunlight, crowd buildings, grow into powerlines, and create fire hazards. Overgrowth can also reduce airflow, damage fencing, limit access, and attract pests. Topping or clearing without the right tools or training often leads to unstable regrowth, damage to the land, or worse — injury. And in Canterbury's exposed climate, poor tree work can quickly become a safety risk."
      solutionTitle="Why Professional Topping & Vegetation Control Matters"
      solutionDescription="At MKM, we do more than just 'cut it down.' Our qualified crew uses elevated boom saws, climbing gear, and land-safe techniques to reduce tree height, open up paddocks, and clear heavy growth without making a mess or harming the tree's health. Whether it's a shelterbelt that's outgrown its purpose or a pine pushing too close to a shed, we've got it covered. We tailor our approach to the job — from light topping for view clearance to serious vegetation clearing on rough access blocks. Everything is done to a high standard, with tidy finishes and respect for your property. We also understand regional rules and compliance requirements, so you won't get caught out with council issues or unsafe work."
      heroImage="/treetoppingandvegetationmanagemnet.webp"
      heroImageAlt="Professional tree topping and vegetation management in Canterbury"
      subServices={subServices}
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}