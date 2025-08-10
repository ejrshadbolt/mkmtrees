import { Shield, Scissors, CheckCircle2, Award, Users, Clock } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function TreeReductionsPage() {
  const features = [
    {
      icon: <Scissors className="w-8 h-8 text-black" />,
      title: "Strategic Pruning Techniques",
      description: "Professional canopy reduction that preserves tree structure while achieving height and spread goals."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Tree Health Focused",
      description: "Methods that maintain tree stability and health, preventing weak regrowth and long-term problems."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Council Regulation Compliant",
      description: "All work meets Christchurch City Council and Canterbury district regulations for tree modification."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "Species-Specific Knowledge",
      description: "Understanding of how different Canterbury tree species respond to reduction techniques."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Climbing & Boom Saw Options",
      description: "Professional climbing techniques or 17-metre boom saw access for trees of any height."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Long-Term Results",
      description: "Proper reduction techniques that provide lasting solutions without creating new hazards."
    }
  ];

  const bulletPoints = [
    "Professional canopy assessment and reduction planning",
    "Height reduction without compromising tree stability",
    "Clearance work for powerlines and structures",
    "View enhancement while preserving tree health",
    "Strategic branch removal for balanced growth",
    "Shelterbelt management and maintenance",
    "Wind resistance improvement through proper pruning",
    "Complete debris cleanup and disposal",
    "Fully insured work with safety certification",
    "Free consultation and detailed quotes"
  ];

  return (
    <ChildServicePage
      title="Tree Reductions in Canterbury"
      subtitle="Shaping Trees Safely Without Compromising Their Health"
      description="At MKM Trees, we provide expert tree reductions across Christchurch and rural Canterbury. Whether it's an overgrown gum, a shelterbelt blocking the sun, or a tree too close to powerlines, we reduce height and spread safely — without damaging the tree or your property. We regularly work on lifestyle blocks in Selwyn, suburban homes in Christchurch, and wind-prone sites in Banks Peninsula."
      problemTitle="The Problem We Solve"
      problemDescription="Topping a tree might seem like the easy fix — but it often causes more harm than good. Topped trees become unstable, encourage weak regrowth, and can quickly turn into a bigger hazard. Worse still, incorrect cutting may breach council rules or void insurance cover."
      solutionTitle="Why Tree Reductions Are the Better Way"
      solutionDescription="Tree reductions involve strategic pruning — not hacking. Our qualified arborists reshape the canopy while preserving the tree's health, structure, and stability. We know how each species responds and use the right techniques to balance clearance, safety, and long-term health. Whether we're climbing or using our elevated boom saw, we get the job done clean, safe, and to code. We're fully insured, Gold SiteWise certified, and familiar with Christchurch City Council and wider Canterbury district regulations — so your job is done right the first time, without legal headaches."
      heroImage="https://placehold.co/1200x800/228b22/ffffff?text=Tree+Reductions"
      heroImageAlt="Professional tree reduction work maintaining tree health and structure"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}