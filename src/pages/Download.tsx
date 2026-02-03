import { Button } from "@/components/ui/button";
import { Download, Monitor, Apple, Smartphone, Globe, CheckCircle2, Shield, Zap, Users } from "lucide-react";
import { useState } from "react";

const DownloadPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("windows");

  const platforms = [
    {
      id: "windows",
      name: "Windows",
      icon: Monitor,
      version: "v2.1.0",
      size: "45.2 MB",
      requirements: "Windows 10/11 (64-bit)",
      downloadUrl: "#", // Akan diisi dengan link download yang sebenarnya
      features: ["Instalasi mudah", "Auto-update", "Offline mode", "Integrasi Windows Explorer"]
    },
    {
      id: "mac",
      name: "macOS",
      icon: Apple,
      version: "v2.1.0",
      size: "52.8 MB",
      requirements: "macOS 10.15+ (Intel/Apple Silicon)",
      downloadUrl: "#",
      features: ["Native Apple Silicon", "Finder integration", "Spotlight search", "Touch Bar support"]
    },
    {
      id: "mobile",
      name: "Mobile App",
      icon: Smartphone,
      version: "v1.5.0",
      size: "28.4 MB",
      requirements: "Android 8.0+ / iOS 13.0+",
      downloadUrl: "#",
      features: ["Cloud sync", "Camera integration", "Offline processing", "Touch gestures"]
    },
    {
      id: "web",
      name: "Web App",
      icon: Globe,
      version: "Latest",
      size: "Browser-based",
      requirements: "Chrome, Firefox, Safari, Edge",
      downloadUrl: "#",
      features: ["No installation", "Cross-platform", "Real-time collaboration", "Cloud storage"]
    }
  ];

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-semibold">
              <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded">RAY</span>
              <span className="text-foreground ml-1">MAIZING | autofile</span>
            </span>
          </div>
          <Button variant="outline" onClick={() => window.history.back()}>
            Kembali
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            Unduh <span className="gradient-text">AI Pengatur File</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pilih platform yang sesuai dengan kebutuhan Anda. Semua versi mendukung fitur AI lengkap untuk mengatur file dengan cerdas.
          </p>
        </div>

        {/* Platform Selection */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`file-card p-6 text-left transition-all hover:scale-105 ${
                selectedPlatform === platform.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedPlatform === platform.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <platform.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">{platform.version}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{platform.size}</p>
            </button>
          ))}
        </div>

        {/* Download Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Download Info */}
          <div className="space-y-6">
            <div className="file-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  {selectedPlatformData && <selectedPlatformData.icon className="w-8 h-8 text-primary-foreground" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedPlatformData?.name}</h2>
                  <p className="text-muted-foreground">{selectedPlatformData?.requirements}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Versi:</span>
                  <span className="font-medium">{selectedPlatformData?.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ukuran:</span>
                  <span className="font-medium">{selectedPlatformData?.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sistem:</span>
                  <span className="font-medium">{selectedPlatformData?.requirements}</span>
                </div>
              </div>

              <Button 
                className="w-full h-14 text-lg font-semibold gradient-primary btn-primary-glow gap-3"
                onClick={() => {
                  // Placeholder - akan diisi dengan link download yang sebenarnya
                  alert(`Download ${selectedPlatformData?.name} akan dimulai setelah link download diinjeksi!`);
                }}
              >
                <Download className="w-5 h-5" />
                Unduh {selectedPlatformData?.name}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Gratis untuk penggunaan personal. Lisensi komersial tersedia.
              </p>
            </div>

            {/* Security & Trust */}
            <div className="file-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Keamanan & Kepercayaan
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Ditandatangani secara digital</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Bebas virus dan malware</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Tidak ada adware atau spyware</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Privasi data terjamin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Features */}
          <div className="space-y-6">
            <div className="file-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Fitur {selectedPlatformData?.name}
              </h3>
              <div className="space-y-3">
                {selectedPlatformData?.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="file-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Yang Baru di Versi Ini
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                  <div>
                    <p className="font-medium">AI Engine v3.0</p>
                    <p className="text-muted-foreground">Peningkatan akurasi penamaan hingga 95%</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                  <div>
                    <p className="font-medium">Batch Processing</p>
                    <p className="text-muted-foreground">Proses hingga 10,000 file sekaligus</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                  <div>
                    <p className="font-medium">Smart Templates</p>
                    <p className="text-muted-foreground">Template penamaan yang lebih cerdas</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                  <div>
                    <p className="font-medium">Performance Boost</p>
                    <p className="text-muted-foreground">Kecepatan pemrosesan 3x lebih cepat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Requirements */}
            <div className="file-card p-6">
              <h3 className="font-semibold mb-4">Persyaratan Sistem</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                {selectedPlatform === "windows" && (
                  <>
                    <p>• Windows 10 atau Windows 11 (64-bit)</p>
                    <p>• RAM: 4 GB minimum, 8 GB direkomendasikan</p>
                    <p>• Storage: 500 MB ruang kosong</p>
                    <p>• .NET Framework 4.8 atau lebih baru</p>
                  </>
                )}
                {selectedPlatform === "mac" && (
                  <>
                    <p>• macOS 10.15 (Catalina) atau lebih baru</p>
                    <p>• RAM: 4 GB minimum, 8 GB direkomendasikan</p>
                    <p>• Storage: 600 MB ruang kosong</p>
                    <p>• Compatible dengan Intel dan Apple Silicon</p>
                  </>
                )}
                {selectedPlatform === "mobile" && (
                  <>
                    <p>• Android 8.0+ atau iOS 13.0+</p>
                    <p>• RAM: 2 GB minimum</p>
                    <p>• Storage: 100 MB ruang kosong</p>
                    <p>• Koneksi internet untuk fitur cloud</p>
                  </>
                )}
                {selectedPlatform === "web" && (
                  <>
                    <p>• Browser modern (Chrome, Firefox, Safari, Edge)</p>
                    <p>• JavaScript enabled</p>
                    <p>• Koneksi internet stabil</p>
                    <p>• Resolusi minimum 1024x768</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Downloads */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-6">Platform Lainnya</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {platforms.filter(p => p.id !== selectedPlatform).map((platform) => (
              <Button
                key={platform.id}
                variant="outline"
                onClick={() => setSelectedPlatform(platform.id)}
                className="gap-2"
              >
                <platform.icon className="w-4 h-4" />
                {platform.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;