import { Layers, Wand2, FileCode, Shield, Lock, Trash2, User, Briefcase, Code, Beaker, Palette, GraduationCap, FolderSearch, Sparkles, CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const features = [
  {
    icon: Layers,
    title: "Ganti Nama Massal",
    description: "Gunakan Template Penamaan untuk mengatur konfigurasi nama untuk semua file sekaligus",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Wand2,
    title: "Folder Ajaib",
    description: "Buat folder ajaib untuk mengatur file secara otomatis di latar belakang",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: FileCode,
    title: "Template Penamaan Anda",
    description: "Gunakan Template Penamaan untuk mengatur konfigurasi nama file sesuai keinginan",
    color: "bg-green-100 text-green-600",
  },
];

const steps = [
  {
    number: "01",
    icon: FolderSearch,
    title: "Pilih Folder",
    description: "Telusuri dan pilih direktori yang berisi file yang ingin Anda atur",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Pindai & Analisis",
    description: "AI membaca isi file dan memahami konteks untuk memberikan nama yang cerdas",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Atur Otomatis",
    description: "File diganti nama dan diurutkan secara otomatis berdasarkan rekomendasi AI",
  },
];

const FeaturesSection = () => {
  const { ref: howItWorksRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-20" id="features">
      <div className="container mx-auto px-4">
        {/* Combined section header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Buat pengaturan file jadi <span className="gradient-text">mudah</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cara bertenaga AI untuk mengganti nama PDF, foto & dokumen
          </p>
        </div>
        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-8

        ">
          {features.map((feature, index) => (
            <div key={index} className="file-card p-6 space-y-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              
              {/* Feature illustration */}
              <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                <img 
                  src={`/images/features/${feature.title.toLowerCase().replace(/\s+/g, '-').replace('ganti-nama-massal', 'bulk-rename').replace('folder-ajaib', 'smart-folders').replace('template-penamaan-anda', 'naming-templates')}.jpeg`}
                  alt={`${feature.title} illustration`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image not found
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                  <span className="text-muted-foreground text-sm">Pratinjau Fitur</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Steps grid - without header */}
        <div ref={howItWorksRef} className="mb-20">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`relative group scroll-fade-in scroll-fade-in-delay-${index + 1} ${isVisible ? 'visible' : ''}`}
              >
                {/* Connector line - only on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-1 rounded-full connector-line z-0" />
                )}
                
                <div className="file-card p-6 lg:p-8 space-y-4 relative z-10 h-full">
                  {/* Step number */}
                  <div className="flex items-center justify-between">
                    <span className="text-4xl lg:text-5xl font-bold text-primary/20 font-mono">
                      {step.number}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Privacy section */}
        <div className="file-card p-8 md:p-12 relative overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 opacity-10">
            <img 
              src="/images/privacy/privacy-background.png"
              alt="Privacy protection illustration"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // Hide image if not found
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          {/* Background pattern (fallback) */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 flex -space-x-2">
              {[
                { bg: "bg-blue-500", icon: User },
                { bg: "bg-purple-500", icon: Code },
                { bg: "bg-green-500", icon: Beaker },
                { bg: "bg-orange-500", icon: Palette },
                { bg: "bg-pink-500", icon: GraduationCap }
              ].map((item, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
              ))}
            </div>
            <div className="absolute bottom-4 left-4 flex -space-x-2">
              {[
                { bg: "bg-indigo-500", icon: Briefcase },
                { bg: "bg-teal-500", icon: User },
                { bg: "bg-rose-500", icon: Code }
              ].map((item, i) => (
                <div key={i} className={`w-6 h-6 rounded-full ${item.bg} flex items-center justify-center`}>
                  <item.icon className="w-3 h-3 text-white" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-6">
              <div className="feature-badge bg-green-100 text-green-700">
                <Shield className="w-4 h-4" />
                Pernyataan Privasi Data
              </div>
              <h3 className="text-2xl font-bold">Kami sangat menjaga privasi Anda</h3>
              <p className="text-muted-foreground">
                Privasi Anda adalah prioritas kami. Kami menggunakan enkripsi tingkat enterprise untuk melindungi file Anda. 
                Saat menggunakan versi web, file yang diunggah hanya disimpan sementara hingga 24 jam 
                untuk memungkinkan Anda mengunduh versi yang sudah diganti namanya. File yang diproses melalui aplikasi desktop 
                tidak disimpan sama sekali setelah diproses, karena langsung diganti nama di perangkat Anda.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Privasi Anda Penting</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Enkripsi tingkat enterprise</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </div>
                  <span>File otomatis terhapus</span>
                </div>
              </div>
            </div>
            
            {/* User avatars */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  { bg: "bg-gradient-to-br from-blue-400 to-blue-600", icon: User },
                  { bg: "bg-gradient-to-br from-purple-400 to-purple-600", icon: Code },
                  { bg: "bg-gradient-to-br from-green-400 to-green-600", icon: Beaker },
                  { bg: "bg-gradient-to-br from-orange-400 to-orange-600", icon: Palette },
                  { bg: "bg-gradient-to-br from-pink-400 to-pink-600", icon: GraduationCap }
                ].map((avatar, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full ${avatar.bg} border-2 border-background flex items-center justify-center shadow-lg`}
                  >
                    <avatar.icon className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
              <p className="text-lg font-semibold">Lebih dari 6100+ pengguna yang puas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
