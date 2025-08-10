import { Scissors, Shield, Wrench, Users, Clock, CheckCircle2 } from 'lucide-react';
import ChildServicePage from '@/components/page-types/ChildServicePage';

export default function GorseSlashMulchingPage() {
  const features = [
    {
      icon: <Scissors className="w-8 h-8 text-black" />,
      title: "Specialized Gorse Processing",
      description: "Equipment designed specifically for grinding gorse, broom, blackberry, and invasive scrub species."
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Fire Hazard Elimination",
      description: "Permanent removal of fire-prone vegetation that creates major risks during Canterbury's dry summers."
    },
    {
      icon: <Wrench className="w-8 h-8 text-black" />,
      title: "Forestry Slash Experts",
      description: "Professional processing of slash piles and forestry waste left after logging operations."
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Difficult Access Specialists",
      description: "Reach tight spaces, sloped areas, and forestry edges that bigger machines can't access safely."
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Prevents Regrowth",
      description: "Mechanical mulching that eliminates root systems and prevents gorse from spreading or returning."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-black" />,
      title: "Ready-to-Use Surface",
      description: "Clean, workable finish that's immediately ready for fencing, replanting, or grazing use."
    }
  ];

  const bulletPoints = [
    "Professional gorse and broom control",
    "Blackberry and invasive scrub removal",
    "Forestry slash pile processing",
    "Fire hazard reduction and prevention",
    "Mechanical root system elimination",
    "Steep hillside and remote area access",
    "No burning permits or cleanup required",
    "Natural mulch layer for soil protection",
    "Prevents regrowth and spread of invasive species",
    "Combined with land clearing and restoration"
  ];

  return (
    <ChildServicePage
      title="Gorse & Slash Mulching in Canterbury"
      subtitle="Fast, Clean Removal of Invasive Scrub & Forestry Waste"
      description="At MKM Trees, we offer specialised mulching services for gorse, broom, blackberry, and forestry slash across Christchurch, Selwyn, and wider Canterbury. Whether it's an overgrown hillside, a pine block edge, or fire-prone paddock scrub, our heavy-duty mulchers break it down and mulch it on-site — no burning, no bulldozers, no mess. This is the reliable way to reclaim overgrown land and reduce fire hazards while keeping the soil structure intact."
      problemTitle="The Problem We Solve"
      problemDescription="Gorse and slash don't just look bad — they choke native growth, damage fences, block access, and create a major fire risk during dry Canterbury summers. Slash piles left after forestry jobs quickly become overgrown and dangerous, while gorse spreads fast and is nearly impossible to remove by hand or mower. Burning can be risky and often requires permits. Digging it out damages the ground and brings new regrowth. You need a solution that clears it properly — and keeps it gone."
      solutionTitle="How MKM Clears Gorse & Slash the Right Way"
      solutionDescription="Our mechanical mulching equipment is purpose-built to grind gorse, broom, and slash into fine mulch that's left to break down naturally on-site. We reach tight and sloped areas that bigger machines can't access, while leaving a clean, workable surface that's ready for fencing, replanting, or grazing. Because we work across hill blocks, remote paddocks, and forestry edges, we know how to get in, clear it fast, and leave your land tidy and safe — all without the erosion or damage that comes with traditional clearing."
      heroImage="https://placehold.co/1200x800/8b4513/ffffff?text=Gorse+Slash+Mulching"
      heroImageAlt="Specialized mulching equipment processing gorse and forestry slash"
      features={features}
      bulletPoints={bulletPoints}
    />
  );
}