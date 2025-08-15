import { Shield, Award, Wrench, Users, CheckCircle2, Clock } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function TreeToppingPage() {
  const features = [
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "17-Metre Boom Saw",
      description: "Professional elevated equipment that reaches tall trees safely without compromising on precision."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Safe, Controlled Methods",
      description: "Proper assessment and cutting techniques that balance safety with tree health and stability."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Canterbury Conditions Expert",
      description: "Understanding of local wind patterns, tree species, and seasonal challenges unique to our region."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Rural & Lifestyle Specialists",
      description: "Experience across lifestyle blocks, rural stations, and suburban properties throughout Canterbury."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Council Compliant Work",
      description: "All topping work meets local regulations and safety standards for long-term peace of mind."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Efficient, Tidy Service",
      description: "Quick turnaround with complete cleanup, leaving your property neat and ready to enjoy."
    }
  ];

  const bulletPoints = [
    "Professional tree assessment before any cutting",
    "Height reduction that maintains tree stability",
    "Powerline clearance and safety compliance",
    "Shelterbelt management and maintenance",
    "View enhancement without tree damage",
    "Wind-resistant pruning techniques",
    "Complete site cleanup and waste disposal",
    "Free quotes with detailed work explanation",
    "Fully insured with SiteWise Gold certification",
    "Emergency tree topping services available"
  ];

  return (
    <ChildServicePage
      title="Tree Topping in Christchurch & Canterbury"
      subtitle="Safe Height Control for Trees That Have Grown Too Tall"
      description="At MKM Trees, we provide professional tree topping services across Christchurch, Selwyn, and wider Canterbury. Whether it's a pine overshadowing your property or a shelterbelt growing into the powerlines, our qualified crew can reduce the height safely — using the right gear, training, and tree care knowledge. We regularly top trees on lifestyle blocks, rural stations, and exposed properties where strong wind and fast-growing vegetation are a problem."
      problemTitle="The Problem We Solve"
      problemDescription="When trees grow too tall, they quickly become a safety risk. They can block sunlight, crowd buildings, interfere with power lines, and are more likely to fall or split in Canterbury's high winds. The issue comes when people attempt topping without the right skills. DIY jobs or cheap operators often leave trees with unstable regrowth, exposed wounds, or even cause long-term health decline. In some cases, they create new hazards or fall foul of local council rules."
      solutionTitle="How MKM Trees Gets It Right"
      solutionDescription="We don't just cut trees — we assess them properly and top them in a way that balances safety with health. Our team uses an elevated 17-metre boom saw and controlled methods to reduce height cleanly, without butchering the tree or leaving a mess behind. You'll get a safer, neater result that complies with local regulations and protects your property long-term. We work efficiently across lifestyle blocks, suburban homes, and rural stations — always with care and respect for your land."
      heroImage="/treetopping.webp"
      heroImageAlt="Professional tree topping service with elevated boom saw in Canterbury"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}