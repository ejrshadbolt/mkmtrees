export interface SectionConfig {
  id: string;
  name: string;
  component: string;
  props?: Record<string, unknown>;
}

export interface TemplateConfig {
  hero: SectionConfig;
  services?: SectionConfig;
  features?: SectionConfig;
  about?: SectionConfig;
  testimonials?: SectionConfig;
  partners?: SectionConfig;
  newsPortfolio?: SectionConfig;
  contact?: SectionConfig;
  cta?: SectionConfig;
  footer?: SectionConfig;
}

export interface ContactPageTemplateConfig {
  hero: SectionConfig;
  contactForm: SectionConfig;
  contactMethods: SectionConfig;
  mapSection?: SectionConfig;
  footer?: SectionConfig;
}

export interface NewsPageTemplateConfig {
  hero: SectionConfig;
  newsGrid?: SectionConfig;
  contact?: SectionConfig;
  footer?: SectionConfig;
}

export interface PortfolioPageTemplateConfig {
  hero: SectionConfig;
  portfolioGrid?: SectionConfig;
  contact?: SectionConfig;
  footer?: SectionConfig;
}

export interface AboutPageTemplateConfig {
  hero: SectionConfig;
  twoColumn?: SectionConfig;
  team?: SectionConfig;
  clients?: SectionConfig;
  contact?: SectionConfig;
  footer?: SectionConfig;
}

export interface ReviewsPageTemplateConfig {
  hero: SectionConfig;
  testimonialHero?: SectionConfig;
  reviewsCards?: SectionConfig;
  reviewForm?: SectionConfig;
  contact?: SectionConfig;
  footer?: SectionConfig;
} 