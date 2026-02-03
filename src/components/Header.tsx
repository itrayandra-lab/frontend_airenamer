import { Button } from "@/components/ui/button";
import { Download, LogIn, ArrowRight } from "lucide-react";

const Header = () => {
  const handleDownload = () => {
    // Navigate to download page
    window.location.href = '/download';
  };

  const handleLogin = () => {
    // Navigate to login page
    window.location.href = '/login';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-semibold">
            <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded">RAY</span>
            <span className="text-foreground ml-1">MAIZING | autofile</span>
          </span>
        </div>

        {/* Navigation */}
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
        <Button variant="ghost" size="icon" className="md:hidden">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;