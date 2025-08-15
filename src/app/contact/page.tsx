import SimpleHero from '@/components/sections/SimpleHero';
import ContactHero from '@/components/sections/ContactHero';
import ContactMethods from '@/components/sections/ContactMethods';
import ContactMap from '@/components/sections/ContactMap';

export default function ContactPage() {
  return (
    <main>
      <SimpleHero
        title="Contact MKM Trees"
        subtitle="Get in touch with Canterbury's trusted tree service experts for professional quotes and emergency support."
        backgroundImage="/contactussection.webp"
        backgroundAlt="MKM Trees team ready to help with tree services and land clearing across Canterbury"
      />
      <ContactHero />
      <ContactMethods />
      <ContactMap />
    </main>
  );
}