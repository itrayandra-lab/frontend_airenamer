import { ArrowRight, Sparkles, Bot, FileText, Zap, Globe, Cpu, Workflow, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const products = [
  {
    id: "ai-file-organizer",
    name: "AI Pengatur File",
    description: "Sistem manajemen file cerdas dengan AI untuk mengorganisir dan mengganti nama file secara otomatis dengan akurasi tinggi",
    category: "File Management",
    type: "Platform",
    status: "current",
    icon: FileText,
    color: "bg-purple-100 text-purple-600",
    features: ["Penamaan Otomatis", "Organisasi Cerdas", "Batch Processing"],
  },
  {
    id: "ai-press-release",
    name: "AI Press Release",
    description: "Generator press release otomatis dengan AI untuk membuat siaran pers yang profesional dan menarik dalam berbagai format",
    category: "Content Creation",
    type: "Platform",
    status: "available",
    icon: Globe,
    color: "bg-blue-100 text-blue-600",
    features: ["SEO Optimized", "Multi-format Export"],
  },
  {
    id: "ai-content-bot",
    name: "AI Content Bot",
    description: "Bot cerdas untuk menghasilkan konten media sosial, artikel, dan copy marketing secara otomatis dengan brand voice konsisten",
    category: "Content Automation",
    type: "Bot",
    status: "available",
    icon: Bot,
    color: "bg-green-100 text-green-600",
    features: ["Multi-platform", "Brand Voice", "Scheduling"],
  },
  {
    id: "ai-workflow-automation",
    name: "AI Workflow Automation",
    description: "Platform otomasi proses bisnis dengan AI untuk meningkatkan efisiensi dan produktivitas tim hingga 300% lebih cepat",
    category: "Business Automation",
    type: "Automation",
    status: "available",
    icon: Workflow,
    color: "bg-orange-100 text-orange-600",
    features: ["Process Mining", "Smart Triggers", "Integration Hub"],
  },
  {
    id: "ai-data-analyzer",
    name: "AI Data Analyzer",
    description: "Platform analisis data cerdas dengan AI untuk mengubah data mentah menjadi insights yang actionable dan prediksi akurat",
    category: "Data Intelligence",
    type: "Platform",
    status: "coming-soon",
    icon: Cpu,
    color: "bg-indigo-100 text-indigo-600",
    features: ["Real-time Analytics", "Predictive Modeling", "Visual Reports"],
  },
  {
    id: "ai-smart-assistant",
    name: "AI Smart Assistant",
    description: "Asisten virtual cerdas dengan AI untuk membantu tugas administratif dan operasional harian dengan efisiensi maksimal",
    category: "Virtual Assistant",
    type: "Bot",
    status: "coming-soon",
    icon: Zap,
    color: "bg-pink-100 text-pink-600",
    features: ["Voice Commands", "Task Management", "Calendar Integration"],
  },
];

const ProductEcosystemSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // All products in carousel (including AI Pengatur File)
  const carouselProducts = products;
  const itemsPerSlide = isMobile ? 1 : 2;
  const totalSlides = Math.ceil(carouselProducts.length / itemsPerSlide);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  // Reset slide when mobile/desktop changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [isMobile]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };


  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30" id="products">
      <div className="container mx-auto px-4">
        {/* Section header - centered */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Raymaizing AI Smart Platform
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Ekosistem <span className="gradient-text">AI Lengkap</span> untuk Bisnis Anda
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6 text-base leading-relaxed">
            Jelajahi solusi AI komprehensif dari platform Raymaizing untuk mengoptimalkan seluruh workflow bisnis Anda.
          </p>
        </div>

        {/* Products Carousel */}
        <div 
          className="relative mb-6 md:mb-12"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out cursor-grab active:cursor-grabbing touch-pan-x"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              role="region"
              aria-label="Produk AI Raymaizing"
              aria-live="polite"
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid gap-3 md:gap-6 px-1 md:px-2 grid-cols-1 md:grid-cols-2">
                    {carouselProducts
                      .slice(slideIndex * itemsPerSlide, slideIndex * itemsPerSlide + itemsPerSlide)
                      .map((product) => (
                        <div key={product.id} className="file-card p-3 md:p-6 space-y-3 md:space-y-4 relative group hover:scale-105 transition-all duration-300">
                          {/* Status badge */}
                          <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10">
                            {product.status === 'current' && (
                              <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-medium">
                                Sedang Anda Gunakan
                              </span>
                            )}
                            {product.status === 'available' && (
                              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                                Tersedia
                              </span>
                            )}
                            {product.status === 'coming-soon' && (
                              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                                Segera Hadir
                              </span>
                            )}
                          </div>

                          {/* Product icon and info */}
                          <div className="space-y-3 md:space-y-4">
                            <div className="flex items-start gap-3 md:gap-4 pr-20 md:pr-24">
                              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${product.color}`}>
                                <product.icon className="w-5 h-5 md:w-6 md:h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm md:text-lg leading-tight">{product.name}</h3>
                                <p className="text-xs md:text-sm text-primary font-medium">{product.type}</p>
                              </div>
                            </div>

                            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                              {product.description}
                            </p>

                            {/* Features */}
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Fitur Utama:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {product.features.map((feature, featureIndex) => (
                                  <span key={featureIndex} className={`feature-badge ${product.color} text-xs px-2 py-1 rounded-md`}>
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Product preview */}
                            <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center border overflow-hidden">
                              <img 
                                src={`/images/products/${product.id}.png`}
                                alt={`${product.name} Interface Preview`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Try v2 version for ai-press-release
                                  if (product.id === 'ai-press-release' && !e.currentTarget.src.includes('-v2')) {
                                    e.currentTarget.src = `/images/products/${product.id}-v2.png`;
                                    return;
                                  }
                                  // Fallback to icon if image not found
                                  console.log(`Failed to load image for ${product.id}`);
                                  e.currentTarget.style.display = 'none';
                                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (nextElement) {
                                    nextElement.style.display = 'flex';
                                  }
                                }}
                              />
                              <div className="text-center space-y-1 md:space-y-2" style={{ display: 'none' }}>
                                <product.icon className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground/60 mx-auto" />
                                <p className="text-xs text-muted-foreground">Preview Interface</p>
                              </div>
                            </div>

                            {/* Action button */}
                            <Button 
                              variant={product.status === 'current' ? 'default' : product.status === 'available' ? 'default' : 'outline'} 
                              className="w-full gap-2 text-xs md:text-sm h-8 md:h-10"
                              disabled={product.status === 'coming-soon'}
                            >
                              {product.status === 'current' && (
                                <>
                                  <span>Sedang Digunakan</span>
                                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                                </>
                              )}
                              {product.status === 'available' && (
                                <>
                                  <span>Jelajahi Sekarang</span>
                                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                                </>
                              )}
                              {product.status === 'coming-soon' && (
                                <span>Segera Hadir</span>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 md:gap-2 mt-3 md:mt-6" role="tablist" aria-label="Navigasi slide produk">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-primary w-3 md:w-6' : 'bg-primary/30'
                }`}
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`Slide ${index + 1} dari ${totalSlides}`}
              />
            ))}
          </div>

          {/* Navigation Controls - moved from header */}
          <div className="flex flex-col items-center justify-center gap-4 mt-2 md:mt-4">
            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                disabled={totalSlides <= 1}
                aria-label="Produk sebelumnya"
              >
                <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                disabled={totalSlides <= 1}
                aria-label="Produk selanjutnya"
              >
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
            
            {/* Slide counter for mobile */}
            <div className="flex items-center justify-center gap-2 md:hidden">
              <span className="text-xs text-muted-foreground">
                {currentSlide + 1} dari {totalSlides}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-1 h-1 rounded-full ${
                      index === currentSlide ? 'bg-primary' : 'bg-primary/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile swipe instruction */}
          {isMobile && (
            <div className="text-center mt-2 md:mt-4">
              <p className="text-xs text-muted-foreground px-4">
                Geser ke kiri atau kanan untuk melihat produk lainnya
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductEcosystemSection;