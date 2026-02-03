import { Button } from "@/components/ui/button";
import { ArrowRight, FolderSearch, Sparkles, Play, Square, CheckCircle2 } from "lucide-react";
import FileCard from "./FileCard";

const HeroSection = () => {
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
              <Button size="lg" className="gradient-primary btn-primary-glow gap-2 h-14 px-6">
                <span className="flex flex-col items-start">
                  <span className="font-semibold">Mulai Gratis</span>
                  <span className="text-xs opacity-80">Tanpa kartu kredit</span>
                </span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right content - App Preview */}
          <div className="relative hidden lg:block">
            {/* App UI Preview */}
            <div className="glass-card p-6 space-y-6 max-w-md mx-auto">
              {/* Folder Path */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FolderSearch className="w-4 h-4 text-primary" />
                  Lokasi Folder
                </div>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm border border-primary/30">
                  C:\Users\Documents\Files
                </div>
                <Button className="w-full gradient-primary">Telusuri</Button>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Kontrol
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2 border-primary/30 hover:bg-primary/10">
                    <FolderSearch className="w-4 h-4" />
                    Pindai File
                  </Button>
                  <Button className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4" />
                    Mulai Mengatur
                  </Button>
                  <Button variant="destructive" className="w-full justify-start gap-2">
                    <Square className="w-4 h-4" />
                    Berhenti
                  </Button>
                </div>
              </div>

              {/* Features Toggle */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Fitur
                </div>
                <div className="space-y-2">
                  {["Monitor Sistem", "Daftar File", "Log Real-time"].map((feature) => (
                    <div key={feature} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="text-sm">{feature}</span>
                      <div className="w-10 h-5 bg-primary rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-background rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating file cards */}
            <div className="absolute -right-4 top-8 opacity-80">
              <FileCard
                type="pdf"
                oldName="scan001.pdf"
                newName="Invoice_2024.pdf"
                status="done"
              />
            </div>
            <div className="absolute -left-4 bottom-8 opacity-80">
              <FileCard
                type="doc"
                oldName="draft.docx"
                newName="Report_Q4.docx"
                status="done"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;