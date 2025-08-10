import { Trees, Shield, Award } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function TreeToppingPage() {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "SiteWise Gold Certified",
      description: "Our qualified arborists follow strict safety protocols and are fully insured for your peace of mind."
    },
    {
      icon: <Trees className="w-8 h-8 text-black" />,
      title: "17m Boom Saw Equipped",
      description: "Professional equipment designed for tall tree work and hard-to-reach locations across Canterbury terrain."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "Council Compliant",
      description: "We understand local regulations and ensure all work meets Christchurch City Council requirements."
    }
  ];

  const bulletPoints = [
    "Professional tree health assessment",
    "Safe controlled height reduction",
    "17-metre boom saw for tall trees",
    "Climbing expertise for complex jobs",
    "Council regulation compliance",
    "Complete site cleanup included",
    "Sustainable wood waste disposal",
    "Free written quotes provided",
    "SiteWise Gold safety standards",
    "Full public liability insurance",
    "Emergency callout services available",
    "Local Canterbury team knowledge"
  ];

  return (
    <ChildServicePage
      title="Tree Topping in Christchurch & Canterbury"
      subtitle="Safe Height Control for Trees That Have Grown Too Tall"
      description="At MKM Trees, we provide professional tree topping services across Christchurch, Selwyn, and wider Canterbury. Whether it's a pine overshadowing your property or a shelterbelt growing into the powerlines, our qualified crew can reduce the height safely — using the right gear, training, and tree care knowledge. We regularly top trees on lifestyle blocks, rural stations, and exposed properties where strong wind and fast-growing vegetation are a problem."
      problemTitle="The Problem We Solve"
      problemDescription="When trees grow too tall, they quickly become a safety risk. They can block sunlight, crowd buildings, interfere with power lines, and are more likely to fall or split in Canterbury's high winds.\n\nThe issue comes when people attempt topping without the right skills. DIY jobs or cheap operators often leave trees with unstable regrowth, exposed wounds, or even cause long-term health decline. In some cases, they create new hazards or fall foul of local council rules."
      solutionTitle="How MKM Trees Gets It Right"
      solutionDescription="We don't just cut trees — we assess them properly and top them in a way that balances safety with health. Our team uses an elevated 17-metre boom saw and controlled methods to reduce height cleanly, without butchering the tree or leaving a mess behind.\n\nYou'll get a safer, neater result that complies with local regulations and protects your property long-term. We work efficiently across lifestyle blocks, suburban homes, and rural stations — always with care and respect for your land."
      heroImage="https://placehold.co/1920x1080/2d5016/ffffff?text=Canterbury+Tree+Topping+Services"
      heroImageAlt="Professional tree topping services in Canterbury showing safe height reduction techniques"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}