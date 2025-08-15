import { Shield, Clock, Phone, Wrench, Users, CheckCircle2 } from 'lucide-react';
import ParentServicePage from '@/components/page-types/ParentServicePage';

export default function EmergencyCalloutsPage() {
  const subServices = [
    {
      title: "Emergency Tree Services",
      description: "Fast, safe removal of storm-damaged or dangerous trees",
      href: "/emergency-callouts/tree-services-canterbury",
      image: "/emergencytreeservices.webp",
      imageAlt: "Emergency tree removal services responding to storm damage"
    },
    {
      title: "Emergency Earthworks",
      description: "Fast response for slips, blocked access and urgent site work",
      href: "/emergency-callouts/earthworks-canterbury",
      image: "/emergencyearthworks.webp",
      imageAlt: "Emergency earthworks responding to land slips and access issues"
    }
  ];

  const features = [
    {
      icon: <Phone className="w-8 h-8 text-black" />,
      title: "24/7 Emergency Response",
      description: "Round-the-clock availability for urgent tree and earthworks emergencies across Canterbury."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Fast Response Times",
      description: "Rapid deployment of crews and equipment to restore safety and access as quickly as possible."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Emergency-Trained Crews",
      description: "Specialized training for working safely under emergency conditions and high-pressure situations."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Fast-Deploy Equipment",
      description: "Elevated saws, winches, chippers, and heavy-duty machinery ready for immediate deployment."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Rural Emergency Specialists",
      description: "Experience responding to emergencies on farms, stations, and remote Canterbury properties."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Complete Emergency Solutions",
      description: "From immediate safety work to full cleanup and restoration, we handle the entire emergency response."
    }
  ];

  const bulletPoints = [
    "24/7 emergency response across Canterbury",
    "Storm damage tree and earthworks recovery",
    "Blocked access clearing and restoration",
    "Fallen tree removal from buildings and roads",
    "Slip clearing and emergency drainage",
    "Power line clearance and safety work",
    "Insurance-compliant emergency documentation",
    "Complete site safety and cleanup"
  ];

  return (
    <ParentServicePage
      title="Emergency Callouts – Tree & Earthwork Response in Canterbury"
      subtitle="Fast, Safe Help When Storms, Slips or Emergencies Hit Your Property"
      description="When weather hits hard or damage strikes without warning, MKM Trees is ready. We provide 24/7 emergency callout services across Christchurch, Selwyn, and rural Canterbury — specialising in storm-damaged trees, blocked access, fallen branches, land slips, and urgent clearing work. Our crew moves fast and works safely, using specialised gear to restore safety and access to homes, farms, and stations under pressure."
      problemTitle="The Problem We Solve"
      problemDescription="Severe weather in Canterbury isn't rare — high winds, heavy rain, and unexpected slips can turn your land into a hazard zone. Fallen trees can crush fences, block driveways, or sit dangerously across roads. Paddocks become inaccessible. Slips and bogs trap vehicles. Waiting days for help isn't an option — and untrained removal can make it worse. Most general contractors aren't set up to respond fast. They lack the right tools, insurance, or experience to work safely under emergency conditions, especially on high-risk rural terrain."
      solutionTitle="Why MKM is the Go-To Crew for Emergency Jobs"
      solutionDescription="At MKM, we've built our operation around readiness. Our team includes certified arborists and experienced operators with fast-deploy gear — including elevated saws, winches, chippers, and heavy-duty machinery. We're used to working in tough conditions and tight windows, and we leave every site safe, tidy, and ready to use again. Whether it's a tree through a shed, a washed-out track on a station, or storm damage after dark — we'll turn up, sort it, and get things moving again."
      heroImage="/emergencycallouts.webp"
      heroImageAlt="Emergency tree and earthworks response services in Canterbury"
      subServices={subServices}
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}