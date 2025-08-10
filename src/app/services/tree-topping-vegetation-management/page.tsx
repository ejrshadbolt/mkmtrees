import { Trees, Scissors, Mountain, Shield, Award } from 'lucide-react';
import ParentServicePage from '@/components/page-types/ParentServicePage';

export default function TreeToppingVegetationManagementPage() {
  const subServices = [
    {
      title: "Tree Topping in Christchurch & Canterbury",
      description: "Safe height control for trees that have grown too tall with our professional topping services.",
      href: "/services/tree-topping",
      image: "https://placehold.co/600x400/2d5016/ffffff?text=Tree+Topping+Canterbury",
      imageAlt: "Professional tree topping services in Canterbury showing safe height reduction"
    },
    {
      title: "Tall Tree Topping",
      description: "Specialist tree work for high, hard-to-reach jobs using our 17-metre elevated boom saw.",
      href: "/services/tall-tree-topping",
      image: "https://placehold.co/600x400/4a5568/ffffff?text=Tall+Tree+Specialists",
      imageAlt: "Tall tree topping specialists with 17m boom saw equipment"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Qualified & Insured",
      description: "SiteWise Gold certified arborists with full insurance coverage for your peace of mind."
    },
    {
      icon: <Trees className="w-8 h-8 text-black" />,
      title: "17m Boom Saw",
      description: "Specialized equipment for tall and hard-to-reach tree work across Canterbury terrain."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "Local Canterbury Expertise",
      description: "Years of experience working with Canterbury's unique tree species, weather, and council requirements."
    }
  ];

  const bulletPoints = [
    "Free site assessment and written quotes",
    "SiteWise Gold certified safety standards",
    "Fully insured with public liability cover",
    "Professional tree health evaluation",
    "Council compliant height reductions",
    "Complete site cleanup and waste removal",
    "Specialized equipment for all terrain",
    "Emergency callout services available",
    "Local Canterbury team with rural experience",
    "Sustainable wood chip and mulch disposal",
    "Follow-up care advice included",
    "Competitive pricing with no hidden costs"
  ];

  return (
    <ParentServicePage
      title="Tree Topping & Vegetation Management in Canterbury"
      subtitle="Tame Overgrowth, Let In Light, and Protect What Matters"
      description="At MKM Trees, we provide professional tree topping and vegetation control across Christchurch and the wider Canterbury region. From overgrown shelterbelts and towering gums to invasive scrub creeping across fencelines, our crew has the skills, gear, and experience to bring your land back under control — safely and properly. We regularly service lifestyle blocks in Selwyn, hill sites in Banks Peninsula, and rural properties where growth gets out of hand fast."
      problemTitle="The Problem We Solve"
      problemDescription="Left unchecked, tall trees and thick vegetation can become more than just a visual issue. They block sunlight, crowd buildings, grow into powerlines, and create fire hazards. Overgrowth can also reduce airflow, damage fencing, limit access, and attract pests.\n\nTopping or clearing without the right tools or training often leads to unstable regrowth, damage to the land, or worse — injury. And in Canterbury's exposed climate, poor tree work can quickly become a safety risk."
      solutionTitle="Why Professional Topping & Vegetation Control Matters"
      solutionDescription="At MKM, we do more than just 'cut it down.' Our qualified crew uses elevated boom saws, climbing gear, and land-safe techniques to reduce tree height, open up paddocks, and clear heavy growth without making a mess or harming the tree's health. Whether it's a shelterbelt that's outgrown its purpose or a pine pushing too close to a shed, we've got it covered.\n\nWe tailor our approach to the job — from light topping for view clearance to serious vegetation clearing on rough access blocks. Everything is done to a high standard, with tidy finishes and respect for your property. We also understand regional rules and compliance requirements, so you won't get caught out with council issues or unsafe work."
      heroImage="https://placehold.co/1920x1080/2d5016/ffffff?text=Tree+Topping+Vegetation+Management+Canterbury"
      heroImageAlt="Professional tree topping and vegetation management services across Canterbury showing before and after results"
      subServices={subServices}
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}