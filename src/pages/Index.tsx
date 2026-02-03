import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import ProductEcosystemSection from "@/components/ProductEcosystemSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import HireSection from "@/components/HireSection";
import Footer from "@/components/Footer";
import ChatbotSimple from "@/components/ChatbotSimple";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <ProductEcosystemSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <HireSection />
      </main>
      <Footer />
      <ChatbotSimple />
    </div>
  );
};

export default Index;