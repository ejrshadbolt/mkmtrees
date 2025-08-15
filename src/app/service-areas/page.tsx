import SimpleHero from '@/components/sections/SimpleHero';
import ServiceAreasCore from '@/components/sections/ServiceAreasCore';
import ContactSection from '@/components/sections/ContactSection';

export default function ServiceAreasPage() {
  return (
    <main>
      <SimpleHero
        title="Canterbury Tree Service Areas"
        subtitle="Professional tree care, land clearing, and emergency services across all of Canterbury and surrounding districts."
        backgroundImage="/serviceareas.webp"
        backgroundAlt="MKM Trees service coverage across Canterbury showing rural and urban tree work locations"
        buttons={[
          { text: 'Contact Us', href: '/contact', variant: 'primary' }
        ]}
      />
      <ServiceAreasCore />
      <ContactSection />
    </main>
  );
}