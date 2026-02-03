import { 
  FolderOpen, Clock, Search, Sparkles, Target, Zap
} from "lucide-react";

const benefits = [
  {
    icon: FolderOpen,
    title: "Organisasi Folder Cerdas",
    description: "Pilih folder mana saja dan biarkan AI secara otomatis mengatur file berdasarkan konten dan jenisnya.",
  },
  {
    icon: Sparkles,
    title: "Penamaan Bertenaga AI",
    description: "AI kami membaca konten file untuk menghasilkan nama yang bermakna dan deskriptif secara otomatis.",
  },
  {
    icon: Clock,
    title: "Pemrosesan Real-time",
    description: "Saksikan file dipindai dan diganti nama secara real-time dengan update progres langsung.",
  },
  {
    icon: Search,
    title: "Temukan File Instan",
    description: "Dengan nama file yang tepat, pencarian menjadi mudah di semua dokumen Anda.",
  },
  {
    icon: Target,
    title: "Aturan yang Dapat Disesuaikan",
    description: "Tetapkan pola penamaan dan aturan organisasi Anda sendiri sesuai alur kerja.",
  },
  {
    icon: Zap,
    title: "Pemrosesan Batch",
    description: "Proses ratusan file sekaligus dengan sistem pengaturan batch yang efisien.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20" id="benefits">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Mengapa Pilih <span className="gradient-text">AI Pengatur File</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ubah sistem file berantakan Anda menjadi koleksi yang teratur dan mudah dicari
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, index) => (
            <div key={index} className="file-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-lg">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;