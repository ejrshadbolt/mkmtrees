import { Phone, Shield, Clock, Wrench, Users, CheckCircle2 } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function EmergencyTreeServicesPage() {
  const features = [
    {
      icon: <Phone className="w-8 h-8 text-black" />,
      title: "24/7 Emergency Response",
      description: "Available around the clock for urgent tree emergencies across Canterbury region."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Certified Emergency Arborists",
      description: "Qualified arborists trained specifically for high-risk emergency tree removal and stabilization."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Rapid Response Time",
      description: "Fast deployment to secure sites and remove dangerous trees before they cause further damage."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Emergency Equipment Ready",
      description: "Elevated saws, winches, heavy-duty gear available for immediate deployment to any emergency."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Pressure-Loaded Tree Experts",
      description: "Specialized training for safely removing split, leaning, or pressure-loaded trees after storms."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Complete Emergency Care",
      description: "From initial safety assessment to final cleanup, we handle every aspect of tree emergencies."
    }
  ];

  const bulletPoints = [
    "24/7 emergency tree removal and response",
    "Storm-damaged tree assessment and stabilization",
    "Fallen tree removal from buildings and driveways",
    "Dangerous leaning or split tree emergency work",
    "Powerline clearance and electrical safety",
    "Emergency access restoration after tree falls",
    "Pressure-loaded branch removal techniques",
    "Complete site safety and hazard elimination",
    "Insurance documentation and reporting",
    "Follow-up tree health assessment and care"
  ];

  return (
    <ChildServicePage
      title="Emergency Tree Services in Canterbury"
      subtitle="Fast, Safe Removal of Storm-Damaged or Dangerous Trees"
      description="When trees come down or pose an immediate risk, MKM Trees responds fast. We offer certified emergency tree services across Christchurch, Selwyn, and wider Canterbury — including safe removals, blocked access clearing, and urgent make-safe work after storms or accidents. We're available 24/7 to handle fallen trees, split trunks, cracked limbs, and trees dangerously close to structures or powerlines."
      problemTitle="The Problem We Solve"
      problemDescription="Storms in Canterbury can knock down large trees in seconds — crushing sheds, blocking driveways, or tearing through fences. Sometimes it's not the tree that falls, but one that leans dangerously or shows cracks after high winds. These aren't jobs to wait on, and they're not safe to DIY. Untrained operators often make the damage worse. Cutting pressure-loaded limbs without the right method can send branches flying, collapse trees the wrong way, or trigger further damage to nearby structures."
      solutionTitle="How MKM Handles Tree Emergencies Properly"
      solutionDescription="Our team of qualified arborists and emergency responders have the training and tools to work fast — and safely. We assess the situation on arrival, secure the site, and remove or stabilise dangerous trees using elevated saws, winches, and heavy-duty gear. We don't just hack the tree down. We work with care to avoid further damage, preserve what's still safe, and restore access as quickly as possible. Whether it's a tree split by wind, a branch through the roof, or a pine leaning toward your driveway — we've seen it, and we know how to fix it."
      heroImage="/emergencytreeservices.webp"
      heroImageAlt="Emergency tree removal crew responding to storm damage in Canterbury"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}