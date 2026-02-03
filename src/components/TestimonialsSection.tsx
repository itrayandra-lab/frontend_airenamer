import { Quote } from "lucide-react";
import { useState, useEffect } from "react";

// Helper function to map roles to avatar types
const getAvatarType = (role: string) => {
  if (role.includes("Arsip") || role.includes("Pemerintah") || role.includes("Kepala Bagian")) {
    return "government-worker";
  }
  if (role.includes("Fotograf") || role.includes("Wedding")) {
    return "photographer";
  }
  if (role.includes("IT") || role.includes("CTO") || role.includes("Tech")) {
    return "it-manager";
  }
  if (role.includes("Content") || role.includes("Creator") || role.includes("Digital")) {
    return "content-creator";
  }
  if (role.includes("Arsip") || role.includes("Spesialis") || role.includes("Peneliti")) {
    return "archivist";
  }
  // Default fallback
  return "government-worker";
};

const testimonials = [
  {
    quote: "Sebagai pengelola arsip digital pemerintahan, AI Pengatur File sangat membantu mengorganisir ribuan dokumen dengan standar penamaan yang konsisten dan mudah dicari.",
    name: "Budi Santoso",
    role: "Kepala Bagian Arsip Digital",
    industry: "Instansi Pemerintah",
  },
  {
    quote: "Mengelola foto dokumentasi acara dan kegiatan jadi jauh lebih mudah. AI bisa mengenali konten foto dan memberikan nama yang deskriptif secara otomatis.",
    name: "Sari Dewi",
    role: "Fotografer Profesional",
    industry: "Fotografi & Dokumentasi",
  },
  {
    quote: "Untuk pengelolaan dokumen digital dan arsip elektronik, sistem ini sangat membantu dalam menjaga standar penamaan sesuai regulasi kearsipan nasional.",
    name: "Dr. Ahmad Wijaya",
    role: "Spesialis Manajemen Arsip",
    industry: "Kearsipan & Dokumentasi",
  },
  {
    quote: "Implementasi AI Pengatur File di divisi IT kami berhasil mengurangi waktu pencarian dokumen hingga 80% dan meningkatkan produktivitas tim secara signifikan.",
    name: "Rina Pratiwi",
    role: "IT Manager",
    industry: "Teknologi Informasi",
  },
  {
    quote: "Sebagai content creator yang mengelola ribuan file media, aplikasi ini sangat membantu mengatur aset digital dengan penamaan yang terstruktur dan mudah diakses.",
    name: "Dimas Prasetyo",
    role: "Digital Content Manager",
    industry: "Media & Kreatif",
  },
  {
    quote: "Sistem penamaan otomatis ini revolusioner untuk workflow fotografi wedding kami. Tidak perlu lagi menghabiskan berjam-jam untuk mengorganisir foto klien.",
    name: "Maya Indira",
    role: "Wedding Photographer",
    industry: "Fotografi Wedding",
  },
  {
    quote: "Sebagai pengelola data penelitian, AI Pengatur File membantu mengkategorikan ribuan file penelitian dengan akurat dan sesuai standar akademik.",
    name: "Prof. Dr. Hendro Susilo",
    role: "Peneliti Senior",
    industry: "Penelitian & Akademik",
  },
  {
    quote: "Untuk startup teknologi seperti kami, efisiensi pengelolaan file sangat penting. Aplikasi ini menghemat waktu tim hingga 60% setiap harinya.",
    name: "Arief Rahman",
    role: "CTO",
    industry: "Startup Teknologi",
  },
  {
    quote: "Mengelola arsip digital rumah sakit dengan ribuan rekam medis jadi lebih terorganisir dan mudah diakses saat dibutuhkan untuk audit.",
    name: "Dr. Sinta Maharani",
    role: "Kepala Bagian IT Kesehatan",
    industry: "Kesehatan",
  },
  {
    quote: "Sebagai videographer yang menangani multiple project, AI ini sangat membantu mengorganisir raw footage dan final video dengan penamaan yang konsisten.",
    name: "Bayu Kristanto",
    role: "Videographer & Editor",
    industry: "Produksi Video",
  },
  {
    quote: "Implementasi di kantor hukum kami sangat membantu mengorganisir dokumen legal dan kontrak klien dengan sistem penamaan yang mudah dipahami semua tim.",
    name: "Dewi Kartika, S.H.",
    role: "Managing Partner",
    industry: "Hukum & Legal",
  },
  {
    quote: "Untuk agensi digital marketing, mengelola aset kreatif klien jadi jauh lebih efisien. AI bisa mengenali brand dan campaign secara otomatis.",
    name: "Rizky Firmansyah",
    role: "Creative Director",
    industry: "Digital Marketing",
  },
  {
    quote: "Sebagai konsultan yang bekerja dengan banyak klien, sistem ini membantu menjaga file project tetap terorganisir dan mudah diakses kapan saja.",
    name: "Indah Permatasari",
    role: "Senior Consultant",
    industry: "Konsultan Bisnis",
  },
  {
    quote: "Pengelolaan dokumen keuangan dan laporan audit jadi lebih sistematis. AI bisa mengenali jenis dokumen dan mengkategorikan secara otomatis.",
    name: "Agus Setiawan, CPA",
    role: "Finance Director",
    industry: "Keuangan & Akuntansi",
  },
  {
    quote: "Untuk e-commerce dengan ribuan product image, AI Pengatur File sangat membantu mengorganisir foto produk berdasarkan kategori dan SKU secara otomatis.",
    name: "Lisa Anggraini",
    role: "E-commerce Manager",
    industry: "E-commerce & Retail",
  },
];

const mainTestimonials = [
  {
    quote: "Revolusioner untuk pengelolaan arsip digital kami. Sistem penamaan otomatis sangat membantu dalam menjaga standar dokumentasi sesuai regulasi kearsipan.",
    name: "Indra Kusuma",
    role: "Kepala Divisi Sistem Informasi",
  },
  {
    quote: "Game changer untuk workflow kreatif kami. Tidak ada lagi kebingungan mencari file - semuanya terorganisir dengan sempurna dan mudah ditemukan.",
    name: "Putri Maharani",
    role: "Creative Operations Manager",
  },
  {
    quote: "Efisiensi luar biasa untuk pengelolaan dokumen digital. Tim kami menghemat 70% waktu yang biasanya dihabiskan untuk mencari dan mengorganisir file.",
    name: "Bambang Wijayanto",
    role: "Head of Digital Transformation",
  },
];

const TestimonialsSection = () => {
  const [currentMainTestimonial, setCurrentMainTestimonial] = useState(0);
  const [currentTestimonialSet, setCurrentTestimonialSet] = useState(0);

  // Auto-rotate main testimonial every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMainTestimonial((prev) => (prev + 1) % mainTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonial cards every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialSet((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentTestimonials = () => {
    const startIndex = currentTestimonialSet * 3;
    return testimonials.slice(startIndex, startIndex + 3);
  };

  return (
    <section className="py-20 bg-card overflow-hidden" id="testimonials">
      <div className="container mx-auto px-4">
        {/* Main testimonial with auto-rotation */}
        <div className="text-center mb-16">
          <Quote className="w-12 h-12 text-primary/20 mx-auto mb-6" />
          <div className="relative min-h-[200px] flex items-center justify-center">
            {mainTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentMainTestimonial 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-4'
                }`}
              >
                <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">
                  {testimonial.quote}
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <span className="text-lg font-semibold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dots indicator for main testimonial */}
          <div className="flex justify-center gap-2 mt-6">
            {mainTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMainTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMainTestimonial ? 'bg-primary w-6' : 'bg-primary/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Rotating testimonial cards */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonialSet * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, setIndex) => (
                <div key={setIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-3 gap-6 px-4">
                    {testimonials.slice(setIndex * 3, setIndex * 3 + 3).map((testimonial, index) => (
                      <div key={index} className="testimonial-card space-y-4 h-full">
                        <span className="feature-badge bg-primary/10 text-primary text-xs">
                          {testimonial.industry}
                        </span>
                        <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                            <img 
                              src={`/images/testimonials/${getAvatarType(testimonial.role)}.svg`}
                              alt={`${testimonial.name} avatar`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to initial if image not found
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <span className="text-sm font-semibold" style={{ display: 'none' }}>
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="flex justify-center mt-8">
            <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-4000 ease-linear"
                style={{ 
                  width: `${((currentTestimonialSet + 1) / Math.ceil(testimonials.length / 3)) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-8 px-6 py-4 bg-primary/5 rounded-2xl border border-primary/20">
            <div>
              <p className="text-2xl font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground">Testimoni Positif</p>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div>
              <p className="text-2xl font-bold text-primary">95%</p>
              <p className="text-sm text-muted-foreground">Tingkat Kepuasan</p>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div>
              <p className="text-2xl font-bold text-primary">80%</p>
              <p className="text-sm text-muted-foreground">Penghematan Waktu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
