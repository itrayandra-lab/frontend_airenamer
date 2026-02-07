import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, LogIn, ArrowRight, Menu, X } from "lucide-react";
import logoImage from "/assets/img/logo_autofile.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDownload = () => {
    // Navigate to download page
    window.location.href = '/download';
  };

  const handleLogin = () => {
    // Navigate to login page
    window.location.href = '/login';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img 
            src={logoImage} 
            alt="Raymaizing Logo" 
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={handleDownload} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Download className="w-4 h-4" />
            Unduh
          </button>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Fitur
          </a>
          <a href="#products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Produk
          </a>
          <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Testimoni
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Harga
          </a>
          <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Kontak
          </a>
          <button onClick={handleLogin} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogIn className="w-4 h-4" />
            Masuk
          </button>
          <Button className="gradient-primary btn-primary-glow gap-2" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
            <ArrowRight className="w-4 h-4" />
            Mulai Sekarang
          </Button>
        </nav>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <button 
              onClick={() => { handleDownload(); closeMobileMenu(); }} 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              <Download className="w-4 h-4" />
              Unduh
            </button>
            <a 
              href="#features" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Fitur
            </a>
            <a 
              href="#products" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Produk
            </a>
            <a 
              href="#testimonials" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Testimoni
            </a>
            <a 
              href="#pricing" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Harga
            </a>
            <a 
              href="#contact" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Kontak
            </a>
            <button 
              onClick={() => { handleLogin(); closeMobileMenu(); }} 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              <LogIn className="w-4 h-4" />
              Masuk
            </button>
            <Button 
              className="gradient-primary btn-primary-glow gap-2 w-full" 
              onClick={() => { 
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); 
                closeMobileMenu(); 
              }}
            >
              <ArrowRight className="w-4 h-4" />
              Mulai Sekarang
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;