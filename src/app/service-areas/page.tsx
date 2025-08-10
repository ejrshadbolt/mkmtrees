import SimpleHero from '@/components/sections/SimpleHero';
import ServiceAreasHero from '@/components/sections/ServiceAreasHero';
import ServiceAreasGrid from '@/components/sections/ServiceAreasGrid';
import ServiceAreasList from '@/components/sections/ServiceAreasList';
import ContactSection from '@/components/sections/ContactSection';

export default function ServiceAreasPage() {
  return (
    <main>
      <SimpleHero
        title="Canterbury Tree Service Areas"
        subtitle="Professional tree care, land clearing, and emergency services across all of Canterbury and surrounding districts."
        backgroundImage="https://placehold.co/1920x1080/2d5016/ffffff?text=Canterbury+Service+Areas+MKM+Trees"
        backgroundAlt="MKM Trees service coverage across Canterbury showing rural and urban tree work locations"
      />
      <ServiceAreasHero />
      <ServiceAreasGrid />
      <ServiceAreasList />
      <ContactSection />
    </main>
  );
}