import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const customTiers = [
  { files: 0, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  { files: 25, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  { files: 50, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  { files: 100, price: 75000, packageName: "Paket Pro", packageType: "pro" },
  { files: 250, price: 120000, packageName: "Paket Pro", packageType: "pro" },
  { files: 500, price: 180000, packageName: "Paket Pro", packageType: "pro" },
  { files: 750, price: 240000, packageName: "Paket Pro", packageType: "pro" },
  { files: 1000, price: 300000, packageName: "Paket Pro", packageType: "pro" },
  { files: 1500, price: 450000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 2500, price: 600000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 5000, price: 900000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 10000, price: 1500000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: "Unlimited", price: 2000000, packageName: "Paket Bisnis", packageType: "bisnis" },
];

const SubscribeSimplePage = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedTier, setSelectedTier] = useState(3);

  // Get tier from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tier = urlParams.get('tier');
    const annual = urlParams.get('annual');
    
    console.log('URL Params:', { tier, annual });
    
    if (tier) {
      const tierIndex = parseInt(tier);
      if (tierIndex >= 0 && tierIndex < customTiers.length) {
        setSelectedTier(tierIndex);
      }
    }
    
    if (annual !== null) {
      setIsAnnual(annual === 'true');
    }
  }, []);

  const currentTier = customTiers[selectedTier];
  
  const calculateAnnualPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    const yearlyPrice = monthlyPrice * 12;
    const discountedYearlyPrice = Math.round(yearlyPrice * 0.85);
    return Math.round(discountedYearlyPrice / 12);
  };
  
  const displayPrice = isAnnual ? calculateAnnualPrice(currentTier.price) : currentTier.price;
  const totalPrice = isAnnual ? displayPrice * 12 : displayPrice;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-semibold">
                <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded">RAY</span>
                <span className="text-foreground ml-1">MAIZING | autofile</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Berlangganan <span className="gradient-text">{currentTier.packageName}</span>
            </h1>
            <p className="text-muted-foreground">
              URL Parameters: {window.location.search}
            </p>
          </div>

          {/* Package Info */}
          <div className="file-card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Package Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Package:</span>
                <span className="font-semibold">{currentTier.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span>Files:</span>
                <span>{typeof currentTier.files === 'number' ? currentTier.files.toLocaleString() : currentTier.files}</span>
              </div>
              <div className="flex justify-between">
                <span>Billing:</span>
                <span>{isAnnual ? 'Annual' : 'Monthly'}</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-bold text-primary">
                  Rp{(isAnnual ? totalPrice : displayPrice).toLocaleString()}
                  {isAnnual ? '/year' : '/month'}
                </span>
              </div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="file-card p-6 mb-6">
            <h3 className="font-semibold mb-4">Billing Cycle</h3>
            <div className="flex gap-4">
              <Button
                variant={!isAnnual ? "default" : "outline"}
                onClick={() => setIsAnnual(false)}
              >
                Monthly
              </Button>
              <Button
                variant={isAnnual ? "default" : "outline"}
                onClick={() => setIsAnnual(true)}
              >
                Annual (-15%)
              </Button>
            </div>
          </div>

          {/* CTA */}
          <Button 
            className="w-full h-14 text-lg font-semibold gradient-primary btn-primary-glow"
            onClick={() => alert(`Subscribe to ${currentTier.packageName} - ${isAnnual ? 'Annual' : 'Monthly'}`)}
          >
            Subscribe Now - Rp{(isAnnual ? totalPrice : displayPrice).toLocaleString()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscribeSimplePage;