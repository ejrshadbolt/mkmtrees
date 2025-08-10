import { Shield, Award, Clock, Wrench, Users, CheckCircle2 } from 'lucide-react';
import ParentServicePage from '@/components/page-types/ParentServicePage';

export default function TreeServicesPage() {
  const subServices = [
    {
      title: "Qualified Arborists",
      description: "Certified tree experts you can rely on for safe, compliant work",
      href: "/tree-services/qualified-arborists-canterbury",
      image: "https://placehold.co/800x600/2d5016/ffffff?text=Qualified+Arborists",
      imageAlt: "Qualified arborists working safely on tree removal"
    },
    {
      title: "Stump Grinding",
      description: "Complete stump removal with professional grinding equipment",
      href: "/tree-services/stump-grinding-canterbury",
      image: "https://placehold.co/800x600/8b4513/ffffff?text=Stump+Grinding",
      imageAlt: "Professional stump grinding equipment in action"
    },
    {
      title: "Tree Reductions",
      description: "Safe height and canopy reduction without compromising tree health",
      href: "/tree-services/tree-reductions-canterbury",
      image: "https://placehold.co/800x600/228b22/ffffff?text=Tree+Reductions",
      imageAlt: "Tree reduction work being performed safely"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Fully Qualified & Certified",
      description: "SiteWise Gold certified arborists with proper training and insurance coverage for every job."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "Professional Equipment",
      description: "17-metre elevated boom saws, climbing gear, and specialized machinery for any tree challenge."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Fast, Reliable Service",
      description: "We understand Canterbury weather and work efficiently to get your job done right, first time."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Complete Tree Care",
      description: "From precision pruning to complete removals, we handle every aspect of professional tree care."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Local Canterbury Experts",
      description: "We know Canterbury's unique conditions, tree species, and council regulations inside out."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Tidy, Professional Finish",
      description: "Every job includes complete cleanup and disposal, leaving your property spotless."
    }
  ];

  const bulletPoints = [
    "Free, no-obligation quotes for all tree work",
    "Full insurance coverage and SiteWise Gold certification",
    "Professional cleanup and waste disposal included",
    "Expert assessment of tree health and safety risks",
    "Compliance with all Canterbury council regulations",
    "Emergency callout services available 24/7",
    "Specialized equipment for difficult access jobs",
    "Environmentally responsible disposal methods"
  ];

  return (
    <ParentServicePage
      title="Professional Tree Services in Canterbury"
      subtitle="Qualified Arborists, Stump Grinding & Tree Reductions — Done Right"
      description="At MKM Trees, we provide expert tree services across Christchurch and the wider Canterbury region — from hazard removals to precision pruning. Whether you're clearing a lifestyle block, managing shelterbelts, or removing a risky tree near your home or building site, we've got the gear and crew to get it sorted safely."
      problemTitle="The Problem We Solve"
      problemDescription="Trees that are overgrown, storm-damaged, or poorly maintained can be a real hazard. They might block sunlight, damage foundations, or become dangerous in Canterbury's high winds. Even worse, amateur tree work often makes the problem worse, leaving trees unstable or creating regrowth issues."
      solutionTitle="Why Professional Tree Care Matters"
      solutionDescription="Our qualified arborists understand local Canterbury tree species and diseases, how to prune or reduce safely without harming the tree, what gear is needed for tight-access or tall tree jobs, and NZ regulations around tree height, boundary clearance & protected zones. We help homeowners tidy up trees or open up views, lifestyle block owners with shelterbelts or old tree lines, and farmers and developers clear land for future use."
      heroImage="https://placehold.co/1200x800/2d5016/ffffff?text=Professional+Tree+Services"
      heroImageAlt="Professional tree services team working in Canterbury"
      subServices={subServices}
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}