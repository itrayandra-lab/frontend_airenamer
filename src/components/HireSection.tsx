import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Sparkles, Globe } from "lucide-react";

const HireSection = () => {
  return (
    <section className="py-20" id="contact">
      <div className="container mx-auto px-4">
        {/* Unified CTA Section */}
        <div className="glass-card p-8 md:p-12 text-center space-y-8">
          {/* Main Header */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Siap Memulai <span className="gradient-text">Transformasi Digital</span> Anda?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              Bergabunglah dengan ribuan pengguna yang telah merasakan kemudahan AI Pengatur File. 
              Pilih solusi yang tepat untuk kebutuhan Anda.
            </p>
          </div>

          {/* Action Options */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* Standard Solution */}
            <div className="file-card p-6 space-y-4 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Mulai Sekarang</h3>
                <p className="text-muted-foreground text-sm">
                  Jelajahi semua fitur AI Pengatur File dan ekosistem produk Raymaizing
                </p>
              </div>
              <div className="space-y-3">
                <Button className="w-full gradient-primary btn-primary-glow gap-2">
                  <Sparkles className="w-4 h-4" />
                  Jelajahi Semua Produk
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Globe className="w-4 h-4" />
                  Kunjungi Raymaizing.com
                </Button>
              </div>
            </div>

            {/* Custom Solution */}
            <div className="file-card p-6 space-y-4 border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Solusi Enterprise</h3>
                <p className="text-muted-foreground text-sm">
                  Butuh solusi kustom? Tim kami siap membangun workflow sesuai kebutuhan organisasi Anda
                </p>
              </div>
              <div className="space-y-3">
                <Button className="w-full gradient-primary btn-primary-glow gap-2">
                  <Mail className="w-4 h-4" />
                  Hubungi Tim Sales
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Konsultasi Gratis
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>6100+ pengguna aktif</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Support 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Gratis trial 14 hari</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HireSection;