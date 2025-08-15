import { Wrench, Phone, Clock, Shield, Users, CheckCircle2 } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function EmergencyEarthworksPage() {
  const features = [
    {
      icon: <Phone className="w-8 h-8 text-black" />,
      title: "Rapid Response Ready",
      description: "Heavy machinery and crew available for immediate deployment to emergency earthwork situations."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Emergency Equipment Fleet",
      description: "Diggers, loaders, and heavy-duty tillers ready to roll for slip clearing and access restoration."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Fast Site Assessment",
      description: "Quick evaluation of damage and the safest, most efficient solution for emergency earthwork needs."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "High-Risk Site Specialists",
      description: "Experience working safely on unstable ground, steep slopes, and hazardous emergency conditions."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Rural Emergency Experience",
      description: "Understanding of farm operations and the urgency of restoring access for stock and equipment."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Complete Site Restoration",
      description: "From debris clearing to proper drainage and stabilization for long-term solutions."
    }
  ];

  const bulletPoints = [
    "24/7 emergency earthworks response",
    "Slip clearing and debris removal",
    "Blocked access track restoration",
    "Emergency drainage and water management",
    "Washout repair and culvert clearing",
    "Paddock access restoration for stock safety",
    "Hillside stabilization and erosion control",
    "Heavy machinery deployment to remote sites",
    "Complete site safety and cleanup",
    "Insurance documentation and damage assessment"
  ];

  return (
    <ChildServicePage
      title="Emergency Earthworks in Canterbury"
      subtitle="Fast Response for Slips, Blocked Access & Urgent Site Work"
      description="When the land shifts or floods hit, MKM Trees provides rapid-response earthworks across Christchurch, Selwyn, and greater Canterbury. From access track repairs and slip clearing to urgent drainage and fencing prep, we've got the machines and crew to act fast — and get your property safe and usable again. Our emergency work spans farms, lifestyle blocks, and remote sites where downtime costs time, money, or stock safety."
      problemTitle="The Problem We Solve"
      problemDescription="After heavy rain or sudden damage, land can shift overnight. Tracks become bogged or blocked. Fencelines collapse. Driveways wash out. Slips pile up debris and make key areas completely inaccessible. Whether it's stormwater build-up, broken culverts, or a hillside that's let go — you need more than a shovel and good luck. Delays make it worse. Paddocks become dangerous for stock. Contractors can't access the job. And DIY efforts can end up causing more erosion or damage than they fix."
      solutionTitle="How MKM Delivers Emergency Earthmoving Right"
      solutionDescription="Our crew is ready to roll with the gear that gets it done — fast. We assess the situation, identify the safest solution, and bring in the right machinery: diggers, loaders, or heavy-duty tillers, depending on terrain. From culvert clearing to debris removal and full-scale re-grading, we stabilise the site and restore access properly. Because we're already working across Canterbury's farms and stations, we know how to operate on steep ground, soft paddocks, and high-risk zones. We're not just fast — we're smart, safe, and practical."
      heroImage="/emergencyearthworks.webp"
      heroImageAlt="Emergency earthworks machinery responding to land slips and access issues"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}