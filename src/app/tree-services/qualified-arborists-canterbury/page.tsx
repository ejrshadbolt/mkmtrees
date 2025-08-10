import { Shield, Award, CheckCircle2, Users, Wrench, Clock } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function QualifiedArboristsPage() {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "SiteWise Gold Certified",
      description: "Our team holds the highest safety certifications, ensuring every job is completed to industry standards."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "Qualified Tree Experts",
      description: "Certified arborists with extensive training in tree biology, disease identification, and safe removal techniques."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Council Compliant Work",
      description: "We understand Canterbury council regulations and ensure all work meets local compliance requirements."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Local Canterbury Knowledge",
      description: "Deep understanding of local tree species, weather patterns, and regional growing conditions."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Professional Equipment",
      description: "Latest arborist tools and safety equipment for efficient, safe tree care in any situation."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Reliable Service",
      description: "Professional, punctual service with clear communication throughout every project."
    }
  ];

  const bulletPoints = [
    "Certified arborist assessment and recommendations",
    "Full insurance coverage for all tree work",
    "Hazard identification and risk mitigation",
    "Tree health evaluation and disease diagnosis",
    "Proper pruning techniques for long-term tree health",
    "Safe removal of dangerous or damaged trees",
    "Council permit assistance and compliance",
    "Complete site cleanup and waste disposal",
    "Emergency tree services available 24/7",
    "Free quotes with detailed work breakdown"
  ];

  return (
    <ChildServicePage
      title="Qualified Arborists in Canterbury"
      subtitle="Certified Tree Experts You Can Rely On"
      description="At MKM Trees, we bring qualified, insured arborists to jobs across Christchurch and rural Canterbury. Whether you need a one-off removal or help managing a large property, we get the job done safely and properly — with the right training, gear, and respect for your land."
      problemTitle="The Problem We Solve"
      problemDescription="When tree work's done wrong, it shows — broken branches, sick trees, damaged property, or worse. DIY or cheap operators often leave trees unsafe or non-compliant with local council rules. One mistake can cost thousands — or risk someone's safety."
      solutionTitle="Why Qualified Arborists Matter"
      solutionDescription="Our arborists understand how to assess tree health, avoid long-term damage, and follow local regulations. We're SiteWise Gold Certified and trained to handle everything from tricky removals near powerlines to careful reductions on lifestyle blocks. If you want expert care, done safely and cleanly, MKM's your crew."
      heroImage="https://placehold.co/1200x800/2d5016/ffffff?text=Qualified+Arborists"
      heroImageAlt="Qualified arborist safely working on tree removal with professional equipment"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}