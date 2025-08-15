import { Shield, Award, Wrench, Mountain, Users, CheckCircle2 } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function TallTreeToppingPage() {
  const features = [
    {
      icon: <Mountain className="w-8 h-8 text-black" />,
      title: "Extreme Height Specialists",
      description: "Specialized training and equipment for topping mature pines and extremely tall trees safely."
    },
    {
      icon: <Award className="w-8 h-8 text-black" />,
      title: "17-Metre Boom Reach",
      description: "Professional elevated equipment ideal for tall or hard-access jobs where climbing isn't practical."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "SiteWise Gold Certified",
      description: "Highest safety standards with proper rigging techniques to handle pressure-loaded tall trees."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Difficult Terrain Ready",
      description: "Equipment and methods designed for sloped, exposed, or limited-access Canterbury properties."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Canterbury High-Country Experience",
      description: "Years of experience across Canterbury's toughest jobs from hill country to exposed coastal sites."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Risk Assessment Experts",
      description: "Professional evaluation of tree stability, wind loading, and surrounding hazards before any work."
    }
  ];

  const bulletPoints = [
    "Specialized tall tree assessment and planning",
    "Professional rigging for pressure-loaded trees",
    "Safe removal of top-heavy or unstable sections",
    "Powerline clearance for extreme height trees",
    "Wind-resistant cutting techniques for exposed sites",
    "Controlled lowering to prevent property damage",
    "Emergency tall tree services available",
    "Complete cleanup with no leftover debris",
    "Full insurance coverage for high-risk work",
    "Free assessment with detailed safety breakdown"
  ];

  return (
    <ChildServicePage
      title="Tall Tree Topping in Christchurch & Canterbury"
      subtitle="Specialist Tree Work for High, Hard-to-Reach Jobs"
      description="At MKM Trees, we tackle tall tree topping projects across Christchurch, Selwyn, and rural Canterbury using specialised gear and experienced arborists. From mature pines towering over sheds to large trees along fence lines or access tracks, we safely reduce height without risking damage to your property or the tree's structure. Our 17-metre elevated boom saw is ideal for tall or hard-access jobs where climbing isn't practical — especially on sloped or exposed land."
      problemTitle="The Problem with Extreme Height Trees"
      problemDescription="Tall trees are often the most dangerous. Left unmanaged, they become top-heavy, unstable in Canterbury's strong winds, and more likely to snap or fall — putting buildings, fences, and people at risk. They can also grow into power lines or block sunlight over time. Most tree crews aren't equipped for extreme height or difficult terrain. Climbing tall trees without the right training or gear is unsafe and often leads to messy, uneven results."
      solutionTitle="How MKM Handles Tall Tree Work Safely"
      solutionDescription="Our crew is trained to assess, rig, and top tall trees using industry-safe methods that reduce risk and preserve tree health. We plan the job to avoid damage to surrounding areas and finish with a tidy site — no leftover limbs, ruts, or cleanup headaches. For rural or high-country jobs, we use gear designed for rough terrain and limited access. With SiteWise Gold certification, full insurance, and years of experience across Canterbury's toughest jobs, we get tall tree work done properly."
      heroImage="/talltreetopping.webp"
      heroImageAlt="Specialist tall tree topping work using elevated equipment in Canterbury"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}