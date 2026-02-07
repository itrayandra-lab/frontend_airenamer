import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "/assets/img/hero.png";

const HeroSection = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="pt-24 pb-16 overflow-hidden" id="home">
      <div className="container mx-auto px-4">
        {/* Hero content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">AI Pengatur File</span>
              <span className="text-foreground"> - Sistem </span>
              <span className="gradient-text">Manajemen File</span>
              <span className="text-foreground"> Cerdas</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl">
              Secara otomatis memindai, mengganti nama, dan mengatur file Anda dengan kecerdasan bertenaga AI. Ubah folder berantakan menjadi koleksi yang teratur.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gradient-primary btn-primary-glow gap-2 h-14 px-6"
                onClick={scrollToPricing}
              >
                <span className="flex flex-col items-start">
                  <span className="font-semibold">Mulai Gratis</span>
                  <span className="text-xs opacity-80">Tanpa kartu kredit</span>
                </span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right content - Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative animate-float max-w-md mx-auto">
              <img 
                src={heroImage} 
                alt="AI File Organizer Preview" 
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 scale-75" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;