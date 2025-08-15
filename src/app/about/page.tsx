import SimpleHero from '@/components/sections/SimpleHero';
import StatsCounter from '@/components/sections/StatsCounter';
import About from '@/components/sections/About';
import TeamSection from '@/components/sections/TeamSection';
import ValuesSection from '@/components/sections/ValuesSection';
import ContactSection from '@/components/sections/ContactSection';

export default function AboutPage() {
  return (
    <main>
      <SimpleHero
        title="Canterbury's Trusted Team for Tree Work & Earthmoving"
        subtitle="Locally owned, expertly equipped, and known for getting it done right."
        backgroundImage="/aboutus.webp"
        backgroundAlt="MKM Trees team working on tree removal and land clearing in Canterbury"
        buttons={[
          { text: 'Contact Us', href: '/contact', variant: 'primary' }
        ]}
      />
      
      <StatsCounter />
      
      <About
        title="A Bit More About MKM Trees"
        content="MKM Trees is a locally owned and operated business proudly serving Christchurch and the wider Canterbury region. We specialise in tree topping, vegetation management, land clearing, earthworks, and selective emergency callouts — all delivered by a reliable local crew who know the land.

With qualified arborists, experienced operators, and a brand-new fleet of specialised gear, we're built for everything from tight suburban jobs to full-scale clearing on lifestyle blocks and farms. We regularly work on remote and rugged properties where access, safety, and fast turnaround matter most.

Our close-knit team is known for being hardworking, honest, and easy to deal with. Every job is completed to a high standard — with care, efficiency, and respect for your property.

We're also proud to hold Gold SiteWise certification, backing our commitment to top-tier health and safety on every site.

If you're after a team with real experience, serious gear, and a reputation for quality, MKM Trees is ready when you are."
        image="/earthworks.webp"
        imageAlt="MKM Trees specialized equipment and machinery for tree services and earthworks"
      />
      
      <TeamSection />
      
      <ValuesSection />
      
      <ContactSection />
    </main>
  );
}