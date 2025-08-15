import SimpleHero from '@/components/sections/SimpleHero';
import ReviewsStats from '@/components/sections/ReviewsStats';
import GoogleReviews from '@/components/sections/GoogleReviews';
import PortfolioPreview from '@/components/sections/PortfolioPreview';
import ServiceAreasPreview from '@/components/sections/ServiceAreasPreview';
import ContactSection from '@/components/sections/ContactSection';

export default function ReviewsPage() {
  return (
    <main>
      <SimpleHero
        title="Why Canterbury Locals Choose MKM Trees"
        subtitle="Trusted across Canterbury for expert tree work, land services, and fast emergency callouts."
        backgroundImage="/review.webp"
        backgroundAlt="Satisfied MKM Trees customers with completed tree service projects across Canterbury"
        buttons={[
          { text: 'Contact Us', href: '/contact', variant: 'primary' }
        ]}
      />
      
      <ReviewsStats />
      
      <GoogleReviews />
      
      <PortfolioPreview />
      
      <ServiceAreasPreview />
      
      <ContactSection />
    </main>
  );
}