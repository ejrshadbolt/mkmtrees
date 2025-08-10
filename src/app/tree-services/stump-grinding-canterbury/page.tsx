import { Wrench, CheckCircle2, Shield, Clock, Award, Users } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function StumpGrindingPage() {
  const features = [
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Powerful Grinding Equipment",
      description: "Professional stump grinders capable of handling stumps of any size, from small garden trees to massive pines."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Complete Below-Ground Removal",
      description: "We grind stumps deep below surface level so you can replant, build, or fence without future complications."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Safe, Professional Operation",
      description: "Fully insured team with proper safety protocols for operating heavy grinding machinery near structures."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Fast, Efficient Service",
      description: "Quick turnaround times with minimal disruption to your property or daily routine."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "Clean, Tidy Finish",
      description: "Complete cleanup included with all grindings removed or leveled as mulch, leaving your site ready to use."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Canterbury Wide Service",
      description: "From Christchurch backyards to rural Selwyn properties, we bring our equipment to you."
    }
  ];

  const bulletPoints = [
    "Professional stump grinding equipment for any size job",
    "Deep grinding below surface level for complete removal",
    "Suitable for tight access areas and confined spaces",
    "All debris cleanup and site preparation included",
    "Safe operation around utilities and structures",
    "Rural and urban properties serviced",
    "No root regrowth or pest attraction issues",
    "Immediate replanting or construction capability",
    "Environmentally friendly disposal methods",
    "Free quotes with transparent pricing"
  ];

  return (
    <ChildServicePage
      title="Stump Grinding Canterbury"
      subtitle="Tidy, Fast Tree Stump Removal Across Christchurch & Rural Blocks"
      description="Need a stump gone? MKM Trees offers reliable stump grinding across Canterbury — from backyards in Christchurch to paddocks in Selwyn. We use powerful grinders to remove stumps properly, so your land is left clean, safe, and ready to use."
      problemTitle="The Problem We Solve"
      problemDescription="Cutting a tree is only half the job. A stump left behind can be a hazard, attract pests, and even grow back. DIY solutions like burning or digging rarely work — and often make the problem worse. If it's in the way, it needs to be ground out properly."
      solutionTitle="Why Stump Grinding Matters"
      solutionDescription="We grind stumps deep below the surface so you can replant, build, or fence with no surprises later. From small garden stumps to massive pine bases on rural land, we handle it all — fast, tidy, and done right the first time."
      heroImage="https://placehold.co/1200x800/8b4513/ffffff?text=Stump+Grinding"
      heroImageAlt="Professional stump grinding equipment removing tree stump completely"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}