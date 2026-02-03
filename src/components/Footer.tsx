import { Lock, CreditCard } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-semibold">
              <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded">AI</span>
              <span className="text-foreground ml-1">Pengatur File</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Fitur</a>
            <a href="#benefits" className="hover:text-foreground transition-colors">Manfaat</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Harga</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimoni</a>
            <a href="#products" className="hover:text-foreground transition-colors">Produk</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Kontak</a>
            <a href="#privacy" className="hover:text-foreground transition-colors">Privasi</a>
            <a href="#terms" className="hover:text-foreground transition-colors">Syarat</a>
          </div>

          {/* Security badges */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="w-4 h-4" />
              SSL Aman
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              Stripe
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 AI Pengatur File. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;