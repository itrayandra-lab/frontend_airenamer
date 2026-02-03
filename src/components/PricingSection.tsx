import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

const customTiers = [
  // Paket Gratis (0-50 files)
  { files: 0, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  { files: 25, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  { files: 50, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  
  // Paket Pro (51-1000 files)
  { files: 100, price: 75000, packageName: "Paket Pro", packageType: "pro" },
  { files: 250, price: 120000, packageName: "Paket Pro", packageType: "pro" },
  { files: 500, price: 180000, packageName: "Paket Pro", packageType: "pro" },
  { files: 750, price: 240000, packageName: "Paket Pro", packageType: "pro" },
  { files: 1000, price: 300000, packageName: "Paket Pro", packageType: "pro" },
  
  // Paket Bisnis (1000+ files)
  { files: 1500, price: 450000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 2500, price: 600000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 5000, price: 900000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 10000, price: 1500000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: "Unlimited", price: 2000000, packageName: "Paket Bisnis", packageType: "bisnis" },
];

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [sliderValue, setSliderValue] = useState([3]); // Start at 100 files (Pro package)

  const currentTier = customTiers[sliderValue[0]];
  
  // Calculate annual price with 15% discount
  const calculateAnnualPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    const yearlyPrice = monthlyPrice * 12;
    const discountedYearlyPrice = Math.round(yearlyPrice * 0.85); // 15% discount
    return Math.round(discountedYearlyPrice / 12); // Return monthly equivalent of annual plan
  };
  
  const displayPrice = isAnnual ? calculateAnnualPrice(currentTier.price) : currentTier.price;
  const totalAnnualPrice = isAnnual ? displayPrice * 12 : currentTier.price * 12;
  
  // Get package color based on type
  const getPackageColor = (packageType: string) => {
    switch (packageType) {
      case "gratis":
        return "text-green-600 bg-green-100";
      case "pro":
        return "text-purple-600 bg-purple-100";
      case "bisnis":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <section className="py-20 bg-card" id="pricing">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Harga Sederhana
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Pilih Paket <span className="gradient-text">Sesuai Kebutuhan</span> Anda
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Mulai gratis, Geser untuk memilih layanan yang sesuai</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-muted">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                !isAnnual ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Bulanan
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                isAnnual ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Tahunan
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">-15%</span>
            </button>
          </div>
        </div>

        {/* Left-Right Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left: Pricing Slider */}
          <div className="file-card p-6 space-y-6 h-fit">
            {/* Package Tiers Display */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">Gratis</span>
                <span className="text-purple-600 font-medium">Pro ⭐</span>
                <span className="text-blue-600 font-medium">Bisnis</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0-50 file</span>
                <span>51-1000 file</span>
                <span>1000+ file</span>
              </div>
            </div>

            {/* Slider */}
            <div className="relative">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={customTiers.length - 1}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Price Display */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold transition-all duration-300">
                    {typeof currentTier.files === 'number' ? currentTier.files.toLocaleString() : currentTier.files}
                  </p>
                  <p className="text-muted-foreground">
                    {typeof currentTier.files === 'number' ? 'file per bulan' : 'file tak terbatas'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-2">
                    {isAnnual && currentTier.price > 0 && (
                      <span className="text-lg text-muted-foreground line-through">
                        Rp{currentTier.price.toLocaleString()}
                      </span>
                    )}
                    <p className="text-4xl font-bold text-primary transition-all duration-300">
                      {currentTier.price === 0 ? 'Gratis' : `Rp${displayPrice.toLocaleString()}`}
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    {currentTier.price === 0 ? '/bulan' : isAnnual ? '/bulan' : '/bulan'}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              className={cn(
                "w-full h-14 text-lg font-semibold transition-all duration-300",
                currentTier.packageType === 'pro' ? "gradient-primary btn-primary-glow" : "",
                currentTier.packageType === 'gratis' ? "bg-green-600 hover:bg-green-700" : "",
                currentTier.packageType === 'bisnis' ? "bg-blue-600 hover:bg-blue-700" : ""
              )}
              onClick={() => {
                const params = new URLSearchParams({
                  tier: sliderValue[0].toString(),
                  annual: isAnnual.toString()
                });
                window.location.href = `/subscribe?${params.toString()}`;
              }}
            >
              {currentTier.price === 0 ? 'Mulai Gratis Sekarang' : 
               currentTier.files === 'Unlimited' ? 'Hubungi Sales' :
               currentTier.packageType === 'bisnis' ? 'Dapatkan Paket Bisnis' : 
               `Dapatkan ${currentTier.packageName}`}
            </Button>

            {/* Additional Info untuk menyeimbangkan tinggi */}
            <div className="space-y-3 pt-2">
              <div className="text-center">
                <div className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-medium ${getPackageColor(currentTier.packageType)}`}>
                  {currentTier.packageType === 'gratis' && '🎉 Sempurna untuk mencoba'}
                  {currentTier.packageType === 'pro' && '⚡ Paling Populer'}
                  {currentTier.packageType === 'bisnis' && '🚀 Untuk Enterprise'}
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Setup instan</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Support 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Package Features */}
          <div className="space-y-6 h-fit">
            <div className="file-card p-6 space-y-4 h-fit">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  currentTier.packageType === 'gratis' ? "bg-green-100 text-green-600" : "",
                  currentTier.packageType === 'pro' ? "bg-purple-100 text-purple-600" : "",
                  currentTier.packageType === 'bisnis' ? "bg-blue-100 text-blue-600" : ""
                )}>
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {currentTier.packageType === 'gratis' && '🎉 Sempurna untuk mencoba layanan kami'}
                    {currentTier.packageType === 'pro' && '⚡ Ideal untuk individu dan UKM'}
                    {currentTier.packageType === 'bisnis' && '🚀 Untuk tim dan perusahaan besar'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentTier.packageType === 'gratis' && 'Mulai dengan fitur dasar yang powerful'}
                    {currentTier.packageType === 'pro' && 'Fitur lengkap untuk produktivitas maksimal'}
                    {currentTier.packageType === 'bisnis' && 'Solusi enterprise dengan fitur lengkap'}
                  </p>
                </div>
              </div>
            </div>

            <div className="file-card p-6 min-h-[320px] flex flex-col">
              <h4 className="font-semibold mb-3">Fitur yang termasuk:</h4>
              
              {/* Savings info for annual plans */}
              {isAnnual && currentTier.price > 0 && (
                <div className="mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium text-center">
                    💰 Hemat Rp{((currentTier.price * 12) - totalAnnualPrice).toLocaleString()}/tahun
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-2 flex-1">
                {currentTier.packageType === 'gratis' && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span>Penamaan AI dasar</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span>Pemrosesan satu folder</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span>Dukungan email</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span>Template dasar</span>
                    </div>
                  </>
                )}
                {currentTier.packageType === 'pro' && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-xs">✓</span>
                      </div>
                      <span>Penamaan AI lanjutan</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-xs">✓</span>
                      </div>
                      <span>Pemrosesan batch</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-xs">✓</span>
                      </div>
                      <span>Aturan penamaan kustom</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-xs">✓</span>
                      </div>
                      <span>Dukungan prioritas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-xs">✓</span>
                      </div>
                      <span>Magic Folders</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-xs">✓</span>
                      </div>
                      <span>Template premium</span>
                    </div>
                  </>
                )}
                {currentTier.packageType === 'bisnis' && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                      <span>Semua fitur Pro</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                      <span>Kolaborasi tim</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                      <span>Akses API</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                      <span>Integrasi kustom</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                      <span>Dukungan khusus</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                      <span>SLA 99.9%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;