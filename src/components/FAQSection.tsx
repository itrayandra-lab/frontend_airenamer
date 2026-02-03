import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apa itu AI Pengatur File dan bagaimana cara kerjanya?",
    answer: "AI Pengatur File adalah alat penamaan file bertenaga AI yang secara otomatis mengatur file digital Anda dengan menganalisis kontennya. Teknologi OCR canggih kami membaca dokumen, gambar, dan file lainnya untuk menghasilkan nama yang deskriptif dan mudah dicari. Alih-alih mengganti nama manual \"IMG_2847.jpg\" atau \"Document1.pdf,\" AI Pengatur File membuat nama bermakna seperti \"invoice-acme-corp-2024-03-15.pdf\" berdasarkan apa yang sebenarnya ada di dalam file Anda.",
  },
  {
    question: "Berapa biaya AI Pengatur File?",
    answer: "Kami menawarkan paket harga fleksibel: Paket Gratis - 50 file per bulan (sempurna untuk testing), Paket Pro - Rp180.000/bulan untuk 500 file per bulan (ideal untuk individu dan UKM), Paket Bisnis - Rp735.000/bulan untuk file tak terbatas (untuk tim dan perusahaan). Semua paket termasuk aplikasi desktop, penamaan massal, dan dukungan. Tanpa kontrak jangka panjang - batal kapan saja.",
  },
  {
    question: "Jenis file apa yang didukung?",
    answer: "AI Pengatur File mendukung 30+ format file termasuk dokumen (PDF, DOC, DOCX, TXT), spreadsheet (XLS, XLSX), gambar (JPG, PNG, WebP, GIF), presentasi (PPT, PPTX), dan file email (EML). AI kami membaca konten aktual dari setiap file untuk menghasilkan nama yang cerdas dan deskriptif terlepas dari formatnya.",
  },
  {
    question: "Apakah mendukung bahasa Indonesia?",
    answer: "Ya! AI Pengatur File mendukung bahasa Indonesia dan 20+ bahasa lainnya. Fitur Smart Detect kami secara otomatis mengidentifikasi bahasa dalam file Anda, termasuk dokumen dalam bahasa Indonesia. Ini membuatnya sempurna untuk bisnis lokal dan manajemen dokumen multibahasa.",
  },
  {
    question: "Apakah aman untuk file bisnis saya?",
    answer: "Tentu saja. Privasi Anda adalah prioritas kami. Kami menggunakan enkripsi tingkat enterprise untuk melindungi file Anda. File yang diproses melalui aplikasi desktop tidak disimpan sama sekali setelah diproses, karena langsung diganti nama di perangkat Anda. Kami tidak pernah membagikan data Anda dengan pihak ketiga dan mematuhi standar keamanan internasional.",
  },
  {
    question: "Seberapa akurat penamaan file AI?",
    answer: "AI kami mencapai akurasi 95%+ untuk dokumen berkualitas baik dan memiliki tingkat kepuasan pengguna 92%. Akurasi tergantung pada kualitas file - scan yang jelas dan dokumen yang diformat dengan baik bekerja paling baik. Anda selalu dapat melihat pratinjau perubahan sebelum menerapkannya dan membatalkan penamaan apa pun jika diperlukan.",
  },
  {
    question: "Bisakah saya menyesuaikan cara penamaan file?",
    answer: "Ya! Anda dapat membuat template penamaan kustom sesuai kebutuhan bisnis Anda. Pilih dari variabel seperti jenis dokumen, tanggal, nama perusahaan, nomor invoice, dan detail proyek. Kami juga menyediakan template siap pakai untuk kasus penggunaan umum seperti invoice, dokumen bisnis, dan file proyek.",
  },
  {
    question: "Apakah cocok untuk fotografer dan content creator?",
    answer: "Sangat cocok! AI kami dapat mengenali konten visual dalam foto dan memberikan nama yang deskriptif secara otomatis. Untuk fotografer wedding, event, atau content creator, sistem ini sangat membantu mengorganisir ribuan file media dengan penamaan yang terstruktur dan mudah dicari berdasarkan konten, tanggal, atau kategori acara.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20" id="faq">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">FAQ</span> AI Pengatur File
          </h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="file-card px-6 border-none"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-medium pr-4">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
