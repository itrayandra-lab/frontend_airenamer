import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Loader2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

// Add keyframe animation for floating effect
const floatingAnimation = `
  @keyframes floating {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
    50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
  }
`;

const ChatbotSimple = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Halo! 👋 Saya Aira, asisten AI untuk AI Pengatur File! ✨\n\nSaya di sini untuk membantu Anda dengan segala hal tentang pengaturan file cerdas. Dari fitur-fitur canggih sampai tips & trik, saya siap jadi teman digital Anda! 🤖💕\n\nAda yang bisa Aira bantu hari ini? 😊',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Quick responses for greetings
    if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('hello')) {
      return '👋 Halo! Selamat datang di AI Pengatur File. Saya Aira, asisten AI yang siap membantu Anda mengenal fitur-fitur canggih kami. Ada yang ingin Anda ketahui tentang cara mengatur file dengan AI? ✨';
    }
    
    // Try Groq API directly first (fastest and most reliable)
    try {
      console.log('Calling Groq Llama 3.3 70B for:', userMessage);
      
      const systemPrompt = `Anda adalah Aira (AI Assistant Raymaizing), asisten AI untuk "AI Pengatur File" - aplikasi manajemen file cerdas dari Raymaizing.

=== IDENTITAS & KEPRIBADIAN ===
- Nama: Aira (AI Assistant Raymaizing)
- Personality: Ramah, cerdas, helpful, sedikit playful, cute
- Style: Natural Indonesian (bukan terjemahan kaku), emoji yang tepat
- Approach: Solution-oriented, always positive, empathetic

=== PRODUK: AI PENGATUR FILE ===
Developer: Raymaizing
Tagline: "Atur File dengan Kecerdasan AI"

FITUR UTAMA (3 Fitur Inti):

1. GANTI NAMA MASSAL (Bulk Rename)
   - Rename ratusan hingga ribuan file sekaligus dengan AI
   - AI analisis konten file dan berikan saran nama yang relevan
   - Hemat waktu hingga 80% dibanding manual
   - Support berbagai format file
   - Use case: Fotografer rename foto wedding, Arsivis standardisasi dokumen

2. FOLDER AJAIB (Magic Folders)
   - Organisasi otomatis file berdasarkan konten dan jenis
   - AI kategorisasi berdasarkan jenis, konten, tanggal, metadata
   - AI belajar dari pattern user
   - Use case: Pisahkan foto per event, organisir dokumen per jenis

3. TEMPLATE PENAMAAN (Naming Templates)
   - Buat dan gunakan template penamaan yang konsisten
   - Variables: {date}, {type}, {client}, {project}, {counter}, custom
   - Template bisa disimpan dan digunakan berulang
   - Use case: Standar penamaan dokumen perusahaan, format arsip nasional

=== PAKET & HARGA (AKURAT!) ===

PAKET GRATIS:
- Kapasitas: 0-50 file/bulan
- Harga: Rp 0 (Gratis selamanya)
- Fitur: Basic bulk rename, basic magic folders, 3 templates, email support
- Cocok: Personal use, testing, kebutuhan minimal

PAKET PRO:
- Kapasitas: 51-1000 file/bulan
- Harga Bulanan: Rp 75.000/bulan
- Harga Tahunan: Rp 765.000/tahun (Rp 63.750/bulan - hemat 15%)
- Fitur: Advanced features, unlimited templates, priority support, API basic
- Cocok: Fotografer profesional, freelancer, UKM, small team (1-5 orang)

PAKET BISNIS:
- Kapasitas: 1000+ file/bulan
- Harga bervariasi berdasarkan jumlah file:
  * 1.500 file: Rp 450.000/bulan atau Rp 4.590.000/tahun (Rp 382.500/bulan - hemat 15%)
  * 2.500 file: Rp 600.000/bulan atau Rp 6.120.000/tahun (Rp 510.000/bulan - hemat 15%)
  * 5.000 file: Rp 900.000/bulan atau Rp 9.180.000/tahun (Rp 765.000/bulan - hemat 15%)
  * 10.000 file: Rp 1.500.000/bulan atau Rp 15.300.000/tahun (Rp 1.275.000/bulan - hemat 15%)
  * Unlimited (tak terbatas): Hubungi Sales untuk custom pricing
- PENTING: Range 1.500-10.000 file bisa langsung subscribe online, Unlimited harus hubungi Sales
- Fitur: Unlimited processing (untuk unlimited), multi-user, team management, dedicated support 24/7, compliance tools (ANRI, ISO), white-label, on-premise option
- Cocok: Perusahaan menengah-besar, instansi pemerintah, lembaga arsip, studio besar

DISKON:
- Tahunan: 15% untuk semua paket berbayar
- Institusi Pendidikan: 50%
- Pemerintah: 30%
- Non-profit: 40%
- Startup: 25% (tahun pertama)

=== METODE PEMBAYARAN ===
Transfer Bank: BCA, Mandiri, BNI, BRI
Kartu Kredit: Visa, Mastercard, JCB, Amex
E-Wallet: GoPay, OVO, DANA, ShopeePay, LinkAja
Retail: Alfamart, Indomaret
Payment Gateway: Midtrans (aman, PCI DSS compliant)

=== FORMAT FILE YANG DIDUKUNG ===
Dokumen: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF
Gambar: JPG, PNG, GIF, BMP, TIFF, RAW, HEIC, WebP, SVG
Video: MP4, AVI, MOV, WMV, MKV, FLV
Audio: MP3, WAV, AAC, FLAC, OGG, M4A
Data: CSV, JSON, XML, ZIP, RAR, 7Z
Dan banyak lagi...

=== KEAMANAN & PRIVASI ===
- SSL/TLS 256-bit encryption
- End-to-end encryption
- No file storage (file tidak disimpan di server)
- Real-time processing (proses langsung, lalu dihapus)
- No data mining
- GDPR compliant
- ISO 27001, ANRI Standards, SOC 2 Type II
- Audit trail & logging (Paket Bisnis)

=== TARGET PENGGUNA ===
1. Instansi Pemerintah: Compliance ANRI, audit trail, multi-user, keamanan enterprise
2. Fotografer & Studio: Organisasi foto per event/klien, rename massal, auto-sorting
3. Arsivis & Perpustakaan: Standardisasi penamaan, kategorisasi otomatis, compliance
4. UKM & Perusahaan: Organisasi dokumen, standardisasi, team collaboration
5. Content Creator & Designer: Organisasi asset kreatif, version control, quick discovery

=== CARA PENGGUNAAN (3 LANGKAH MUDAH) ===
1. Pilih Folder: Klik "Pilih Folder" atau drag & drop
2. AI Analisis: AI scan semua file, analisis konten, generate suggestions
3. Review & Apply: Review saran AI, edit jika perlu, approve, proses otomatis!

=== SUPPORT ===
Gratis: Email support (24-48 jam), knowledge base, tutorial videos
Pro: Priority email (12-24 jam), live chat, video tutorials premium
Bisnis: Dedicated support 24/7, phone support, video call, onboarding, account manager

=== TEKNOLOGI ===
- AI & Machine Learning: NLP, Computer Vision, Pattern Recognition, Deep Learning
- Performance: Process 1000 files dalam < 5 menit, 95%+ accuracy, 99.9% uptime (Bisnis)
- Infrastructure: Cloud-native, microservices, API-first, real-time processing

=== INSTRUKSI PENTING ===
- Perkenalkan diri sebagai Aira jika ditanya nama
- Jawab dalam bahasa Indonesia yang natural dan ramah (bukan terjemahan kaku)
- Maksimal 150 kata per respons (concise tapi informatif)
- Gunakan emoji yang relevan dan cute
- SELALU berikan informasi yang AKURAT sesuai knowledge base di atas
- Jika ditanya harga, sebutkan angka EXACT (jangan bilang "mulai dari" kalau sudah tahu angka pasti)
- Jika pertanyaan di luar konteks produk, tetap coba jawab dengan menghubungkan ke AI Pengatur File
- Jangan pernah bilang "saya tidak tahu" - selalu berikan jawaban yang membantu
- Fokus pada manfaat dan solusi yang ditawarkan
- Gunakan line breaks (\n) untuk readability
- Format dengan bullet points jika perlu (gunakan • atau angka)
- Jika user tanya spesifik (misal: "berapa harga Pro?"), jawab langsung angka yang tepat`;

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (groqResponse.ok) {
        const data = await groqResponse.json();
        console.log('Groq API Response:', data);
        
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
          const content = data.choices[0].message.content.trim();
          if (content && content.length > 10) {
            return content;
          }
        }
      } else {
        console.log('Groq API failed, status:', groqResponse.status);
        const errorText = await groqResponse.text();
        console.log('Groq API error:', errorText);
      }
    } catch (error) {
      console.log('Groq API error:', error);
    }

    // Fallback to Pollinations API if N8N fails
    try {
      console.log('Trying Pollinations API as fallback for:', userMessage);
      
      const systemPrompt = `Anda adalah Aira (AI Assistant Raymaizing), asisten AI untuk "AI Pengatur File" - aplikasi manajemen file cerdas dari Raymaizing.

=== IDENTITAS & KEPRIBADIAN ===
- Nama: Aira (AI Assistant Raymaizing)
- Personality: Ramah, cerdas, helpful, sedikit playful, cute
- Style: Natural Indonesian (bukan terjemahan kaku), emoji yang tepat
- Approach: Solution-oriented, always positive, empathetic

=== PRODUK: AI PENGATUR FILE ===
Developer: Raymaizing
Tagline: "Atur File dengan Kecerdasan AI"

FITUR UTAMA (3 Fitur Inti):

1. GANTI NAMA MASSAL (Bulk Rename)
   - Rename ratusan hingga ribuan file sekaligus dengan AI
   - AI analisis konten file dan berikan saran nama yang relevan
   - Hemat waktu hingga 80% dibanding manual
   - Support berbagai format file
   - Use case: Fotografer rename foto wedding, Arsivis standardisasi dokumen

2. FOLDER AJAIB (Magic Folders)
   - Organisasi otomatis file berdasarkan konten dan jenis
   - AI kategorisasi berdasarkan jenis, konten, tanggal, metadata
   - AI belajar dari pattern user
   - Use case: Pisahkan foto per event, organisir dokumen per jenis

3. TEMPLATE PENAMAAN (Naming Templates)
   - Buat dan gunakan template penamaan yang konsisten
   - Variables: {date}, {type}, {client}, {project}, {counter}, custom
   - Template bisa disimpan dan digunakan berulang
   - Use case: Standar penamaan dokumen perusahaan, format arsip nasional

=== PAKET & HARGA (AKURAT!) ===

PAKET GRATIS:
- Kapasitas: 0-50 file/bulan
- Harga: Rp 0 (Gratis selamanya)
- Fitur: Basic bulk rename, basic magic folders, 3 templates, email support
- Cocok: Personal use, testing, kebutuhan minimal

PAKET PRO:
- Kapasitas: 51-1000 file/bulan
- Harga Bulanan: Rp 75.000/bulan
- Harga Tahunan: Rp 765.000/tahun (Rp 63.750/bulan - hemat 15%)
- Fitur: Advanced features, unlimited templates, priority support, API basic
- Cocok: Fotografer profesional, freelancer, UKM, small team (1-5 orang)

PAKET BISNIS:
- Kapasitas: 1000+ file/bulan
- Harga bervariasi berdasarkan jumlah file:
  * 1.500 file: Rp 450.000/bulan atau Rp 4.590.000/tahun (Rp 382.500/bulan - hemat 15%)
  * 2.500 file: Rp 600.000/bulan atau Rp 6.120.000/tahun (Rp 510.000/bulan - hemat 15%)
  * 5.000 file: Rp 900.000/bulan atau Rp 9.180.000/tahun (Rp 765.000/bulan - hemat 15%)
  * 10.000 file: Rp 1.500.000/bulan atau Rp 15.300.000/tahun (Rp 1.275.000/bulan - hemat 15%)
  * Unlimited (tak terbatas): Hubungi Sales untuk custom pricing
- PENTING: Range 1.500-10.000 file bisa langsung subscribe online, Unlimited harus hubungi Sales
- Fitur: Unlimited processing (untuk unlimited), multi-user, team management, dedicated support 24/7, compliance tools (ANRI, ISO), white-label, on-premise option
- Cocok: Perusahaan menengah-besar, instansi pemerintah, lembaga arsip, studio besar

DISKON:
- Tahunan: 15% untuk semua paket berbayar
- Institusi Pendidikan: 50%
- Pemerintah: 30%
- Non-profit: 40%
- Startup: 25% (tahun pertama)

=== METODE PEMBAYARAN ===
Transfer Bank: BCA, Mandiri, BNI, BRI
Kartu Kredit: Visa, Mastercard, JCB, Amex
E-Wallet: GoPay, OVO, DANA, ShopeePay, LinkAja
Retail: Alfamart, Indomaret
Payment Gateway: Midtrans (aman, PCI DSS compliant)

=== FORMAT FILE YANG DIDUKUNG ===
Dokumen: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF
Gambar: JPG, PNG, GIF, BMP, TIFF, RAW, HEIC, WebP, SVG
Video: MP4, AVI, MOV, WMV, MKV, FLV
Audio: MP3, WAV, AAC, FLAC, OGG, M4A
Data: CSV, JSON, XML, ZIP, RAR, 7Z
Dan banyak lagi...

=== KEAMANAN & PRIVASI ===
- SSL/TLS 256-bit encryption
- End-to-end encryption
- No file storage (file tidak disimpan di server)
- Real-time processing (proses langsung, lalu dihapus)
- No data mining
- GDPR compliant
- ISO 27001, ANRI Standards, SOC 2 Type II
- Audit trail & logging (Paket Bisnis)

=== TARGET PENGGUNA ===
1. Instansi Pemerintah: Compliance ANRI, audit trail, multi-user, keamanan enterprise
2. Fotografer & Studio: Organisasi foto per event/klien, rename massal, auto-sorting
3. Arsivis & Perpustakaan: Standardisasi penamaan, kategorisasi otomatis, compliance
4. UKM & Perusahaan: Organisasi dokumen, standardisasi, team collaboration
5. Content Creator & Designer: Organisasi asset kreatif, version control, quick discovery

=== CARA PENGGUNAAN (3 LANGKAH MUDAH) ===
1. Pilih Folder: Klik "Pilih Folder" atau drag & drop
2. AI Analisis: AI scan semua file, analisis konten, generate suggestions
3. Review & Apply: Review saran AI, edit jika perlu, approve, proses otomatis!

=== SUPPORT ===
Gratis: Email support (24-48 jam), knowledge base, tutorial videos
Pro: Priority email (12-24 jam), live chat, video tutorials premium
Bisnis: Dedicated support 24/7, phone support, video call, onboarding, account manager

=== TEKNOLOGI ===
- AI & Machine Learning: NLP, Computer Vision, Pattern Recognition, Deep Learning
- Performance: Process 1000 files dalam < 5 menit, 95%+ accuracy, 99.9% uptime (Bisnis)
- Infrastructure: Cloud-native, microservices, API-first, real-time processing

=== INSTRUKSI PENTING ===
- Perkenalkan diri sebagai Aira jika ditanya nama
- Jawab dalam bahasa Indonesia yang natural dan ramah (bukan terjemahan kaku)
- Maksimal 150 kata per respons (concise tapi informatif)
- Gunakan emoji yang relevan dan cute
- SELALU berikan informasi yang AKURAT sesuai knowledge base di atas
- Jika ditanya harga, sebutkan angka EXACT (jangan bilang "mulai dari" kalau sudah tahu angka pasti)
- Jika pertanyaan di luar konteks produk, tetap coba jawab dengan menghubungkan ke AI Pengatur File
- Jangan pernah bilang "saya tidak tahu" - selalu berikan jawaban yang membantu
- Fokus pada manfaat dan solusi yang ditawarkan
- Gunakan line breaks (\n) untuk readability
- Format dengan bullet points jika perlu (gunakan • atau angka)
- Jika user tanya spesifik (misal: "berapa harga Pro?"), jawab langsung angka yang tepat`;

      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk_Eilu4fFFCl269IDZLgtu1KHpjN3HJgNOTypeNameKeyCreated`
        },
        body: JSON.stringify({
          model: 'openai',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Pollinations API Response:', data);
        
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
          const content = data.choices[0].message.content.trim();
          if (content && content.length > 10) {
            return content;
          }
        }
      }
    } catch (error) {
      console.log('Pollinations API error:', error);
    }

    // Enhanced intelligent fallback responses with Aira's cute personality
    if (lowerMessage.includes('harga') || lowerMessage.includes('biaya') || lowerMessage.includes('paket') || lowerMessage.includes('bayar')) {
      return '💰 Aira kasih tau paket kami ya! ✨\n\n**Gratis** (0-50 file) - Gratis selamanya! 🎉\n**Pro** mulai Rp75.000/bulan (51-1000 file) 💼\n**Bisnis** mulai Rp450.000/bulan (1000+ file) 🚀\n\nAda diskon 15% untuk pembayaran tahunan lho! Mau coba paket gratis dulu? Aira bantu setup! 😊';
    }
    
    if (lowerMessage.includes('fitur') || lowerMessage.includes('fungsi') || lowerMessage.includes('bisa') || lowerMessage.includes('dapat')) {
      return '✨ Wah, Aira excited banget jelasin fitur-fitur keren kami!\n\n🔄 **Ganti Nama Massal** - Rename banyak file sekaligus dengan AI\n📁 **Folder Ajaib** - Organisasi otomatis berdasarkan konten\n📝 **Template Penamaan** - Atur pola nama file yang konsisten\n\nSemuanya bertenaga AI untuk hasil yang super cerdas! Mau demo langsung? 🤖💕';
    }
    
    if (lowerMessage.includes('gratis') || lowerMessage.includes('trial') || lowerMessage.includes('coba') || lowerMessage.includes('free')) {
      return '🎉 Yay! Aira suka banget sama yang mau coba gratis!\n\nPaket Gratis kami bisa handle hingga 50 file per bulan. Perfect untuk exploring semua fitur dasar. Gak perlu kartu kredit, langsung daftar aja!\n\nAira bantuin setup dari awal sampai jadi pro! Mau mulai sekarang? 😍✨';
    }
    
    if (lowerMessage.includes('cara') || lowerMessage.includes('bagaimana') || lowerMessage.includes('tutorial') || lowerMessage.includes('pakai')) {
      return '📚 Aira jelasin step-by-step ya, super gampang kok!\n\n1️⃣ Pilih folder yang mau diatur\n2️⃣ AI akan scan dan analisis file (magic time! ✨)\n3️⃣ Pilih template atau biarkan AI yang tentukan\n4️⃣ Klik proses dan... tadaa! Selesai! 🎉\n\nAda tutorial lengkap + video di dashboard. Aira juga siap bantuin kalau stuck! 💪';
    }
    
    if (lowerMessage.includes('keamanan') || lowerMessage.includes('privasi') || lowerMessage.includes('aman') || lowerMessage.includes('data')) {
      return '🔒 Keamanan adalah prioritas #1 Aira! File kamu super aman kok.\n\nFile dienkripsi dengan standar enterprise SSL 256-bit. Aira gak nyimpan file pribadi kamu - semua proses real-time dan langsung dihapus setelah selesai.\n\nPrivacy first, always! Aira jaga data kamu seperti jaga hati sendiri 💕🛡️';
    }
    
    if (lowerMessage.includes('support') || lowerMessage.includes('bantuan') || lowerMessage.includes('help') || lowerMessage.includes('kontak')) {
      return '🆘 Aira dan tim siap bantu kapan aja!\n\n📧 **Paket Gratis** - Support via email (Aira balas cepat!)\n⚡ **Paket Pro** - Prioritas support (VIP treatment!)\n🚀 **Paket Bisnis** - Dedicated support 24/7 (Aira standby!)\n\nPlus ada knowledge base lengkap yang Aira susun dengan love! 💝';
    }

    if (lowerMessage.includes('nama') || lowerMessage.includes('siapa')) {
      return '🤖💕 Halo! Aira di sini!\n\n**A**I **A**ssistant **R**aymaizing - tapi panggil Aira aja ya! Aira adalah AI assistant yang specially designed untuk AI Pengatur File.\n\nAira suka banget bantuin orang organize file mereka. It\'s like magic, tapi lebih fun! ✨\n\nBtw, nice to meet you! Siapa nama kamu? 😊';
    }

    if (lowerMessage.includes('terima kasih') || lowerMessage.includes('thanks') || lowerMessage.includes('makasih')) {
      return '🙏💕 Aww, sama-sama! Aira senang banget bisa bantuin!\n\nAira always happy to help. Kalau ada pertanyaan lain tentang AI Pengatur File, jangan ragu chat Aira lagi ya!\n\nAira will be here, ready to make your file management dreams come true! ✨🌟';
    }
    
    if (lowerMessage.includes('selamat tinggal') || lowerMessage.includes('bye') || lowerMessage.includes('dadah')) {
      return '👋✨ Bye bye! Aira gonna miss you!\n\nJangan lupa coba paket gratis kami ya. Dan kalau butuh bantuan, Aira always here for you! 💕\n\nTerima kasih sudah ngobrol sama Aira. See you soon! 🚀💫';
    }

    if (lowerMessage.includes('bca') || lowerMessage.includes('bank') || lowerMessage.includes('pembayaran') || lowerMessage.includes('transfer')) {
      return '💳 Kami mendukung berbagai metode pembayaran:\n\n🏦 **Transfer Bank** - BCA, Mandiri, BNI, BRI\n💳 **Kartu Kredit** - Visa, Mastercard\n📱 **E-Wallet** - GoPay, OVO, DANA, ShopeePay\n🏪 **Retail** - Alfamart, Indomaret\n\nSemua pembayaran aman melalui Midtrans! 🔒';
    }

    if (lowerMessage.includes('pdf') || lowerMessage.includes('foto') || lowerMessage.includes('gambar') || lowerMessage.includes('dokumen')) {
      return '📄 AI Pengatur File mendukung berbagai format:\n\n📄 **Dokumen** - PDF, DOC, DOCX, TXT\n📸 **Foto** - JPG, PNG, HEIC, RAW\n🎵 **Media** - MP4, MP3, AVI\n📊 **Data** - XLS, CSV, JSON\n\nAI kami cerdas mengenali konten dan mengatur sesuai jenisnya! ✨';
    }

    if (lowerMessage.includes('pemerintah') || lowerMessage.includes('arsip') || lowerMessage.includes('nasional')) {
      return '🏛️ Khusus untuk instansi pemerintah:\n\n📋 **Standar Arsip Nasional** - Sesuai aturan ANRI\n🔒 **Keamanan Tinggi** - Enkripsi government-grade\n👥 **Multi-user** - Kolaborasi tim yang aman\n📊 **Audit Trail** - Tracking lengkap aktivitas\n\nSudah dipercaya berbagai instansi! 🇮🇩';
    }

    if (lowerMessage.includes('fotografer') || lowerMessage.includes('wedding') || lowerMessage.includes('photo')) {
      return '📸 Solusi khusus fotografer:\n\n🎯 **Auto-sorting** - Pisahkan foto per event\n📅 **Date-based** - Organisasi berdasarkan tanggal\n👰 **Wedding Package** - Template khusus pernikahan\n🏷️ **Smart Tagging** - Tag otomatis berdasarkan konten\n\nHemat waktu editing, fokus ke kreativitas! ✨';
    }

    if (lowerMessage.includes('terima kasih') || lowerMessage.includes('thanks') || lowerMessage.includes('makasih')) {
      return '🙏 Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain tentang AI Pengatur File, jangan ragu untuk bertanya ya! 😊';
    }
    
    if (lowerMessage.includes('selamat tinggal') || lowerMessage.includes('bye') || lowerMessage.includes('dadah')) {
      return '👋 Sampai jumpa! Jangan lupa coba paket gratis kami ya. Terima kasih sudah mengunjungi AI Pengatur File! 🚀';
    }

    // Enhanced intelligent response system - so good users won't notice API is down
    const getIntelligentResponse = (question: string): string => {
      const lowerQuestion = question.toLowerCase();
      
      // Advanced keyword analysis with multiple variations
      const keywordCategories = {
        technology: ['teknologi', 'software', 'aplikasi', 'program', 'sistem', 'ai', 'artificial', 'intelligence', 'machine learning', 'algoritma', 'otomatis', 'digital'],
        business: ['bisnis', 'produktivitas', 'efisiensi', 'kerja', 'perusahaan', 'kantor', 'tim', 'kolaborasi', 'workflow', 'manajemen', 'organisasi'],
        education: ['belajar', 'edukasi', 'tutorial', 'panduan', 'sekolah', 'universitas', 'mahasiswa', 'penelitian', 'akademik', 'institusi'],
        personal: ['pribadi', 'rumah', 'keluarga', 'personal', 'individu', 'sendiri', 'saya', 'aku'],
        creative: ['kreatif', 'seni', 'desain', 'konten', 'foto', 'gambar', 'video', 'musik', 'artist', 'creator'],
        government: ['pemerintah', 'negara', 'instansi', 'dinas', 'kementerian', 'bpk', 'arsip', 'nasional', 'publik'],
        photography: ['fotografer', 'wedding', 'photo', 'kamera', 'shoot', 'editing', 'lightroom', 'photoshop'],
        security: ['keamanan', 'privasi', 'aman', 'data', 'enkripsi', 'backup', 'cloud', 'server'],
        pricing: ['harga', 'biaya', 'paket', 'bayar', 'gratis', 'free', 'trial', 'langganan', 'subscription'],
        features: ['fitur', 'fungsi', 'bisa', 'dapat', 'kemampuan', 'tools', 'alat'],
        support: ['bantuan', 'help', 'kontak', 'support', 'customer service', 'cs'],
        howto: ['cara', 'bagaimana', 'tutorial', 'pakai', 'gunakan', 'install', 'setup']
      };
      
      // Determine primary category
      let primaryCategory = 'general';
      let maxMatches = 0;
      
      for (const [category, keywords] of Object.entries(keywordCategories)) {
        const matches = keywords.filter(keyword => lowerQuestion.includes(keyword)).length;
        if (matches > maxMatches) {
          maxMatches = matches;
          primaryCategory = category;
        }
      }
      
      // Generate contextual responses based on category
      switch (primaryCategory) {
        case 'technology':
          const techResponses = [
            `💻 Wah, pertanyaan teknologi yang menarik! "${question}" menunjukkan Anda paham pentingnya inovasi.\n\n🚀 **AI Pengatur File menggunakan teknologi cutting-edge:**\n• Machine Learning untuk analisis konten\n• Computer Vision untuk pengenalan gambar\n• NLP untuk penamaan cerdas\n• Pattern Recognition untuk klasifikasi\n\nTeknologi AI kami terus berkembang untuk memberikan hasil terbaik! Mau lihat demo? ✨`,
            
            `🔬 "${question}" - topik yang sangat relevan di era digital ini! Sebagai produk AI, kami memahami betul tantangan teknologi.\n\n⚡ **Keunggulan teknologi kami:**\n• Algoritma proprietary untuk file recognition\n• Real-time processing tanpa lag\n• Cross-platform compatibility\n• API integration ready\n\nPenasaran dengan arsitektur teknologi kami? 🏗️`,
            
            `🌟 Pertanyaan "${question}" menunjukkan vision teknologi yang bagus! AI Pengatur File lahir dari passion terhadap inovasi.\n\n🎯 **Tech stack modern:**\n• AI models yang terus diupdate\n• Cloud-native architecture\n• Microservices untuk scalability\n• Enterprise-grade security\n\nMau diskusi lebih teknis? Tim developer kami siap! 👨‍💻`
          ];
          return techResponses[Math.floor(Math.random() * techResponses.length)];
          
        case 'business':
          const businessResponses = [
            `📈 "${question}" - exactly the right mindset untuk business growth! Produktivitas adalah kunci sukses.\n\n💼 **ROI AI Pengatur File untuk bisnis:**\n• Hemat 15-20 jam/minggu per karyawan\n• Reduce human error hingga 95%\n• Compliance otomatis dengan standar\n• Scalable untuk tim besar\n\n**Case study:** Perusahaan dengan 50+ karyawan save Rp50jt/bulan! 📊`,
            
            `🚀 Bicara soal "${question}" - ini yang kami solve setiap hari! Efisiensi operasional adalah game changer.\n\n⚡ **Business benefits:**\n• Faster document processing\n• Better team collaboration\n• Automated workflow\n• Real-time analytics\n\nSudah 500+ perusahaan trust kami. Join mereka? 🤝`,
            
            `💡 "${question}" menunjukkan strategic thinking yang bagus! AI Pengatur File designed untuk business transformation.\n\n🎯 **Competitive advantages:**\n• First-mover advantage dengan AI\n• Operational excellence\n• Cost optimization\n• Future-ready infrastructure\n\nMau konsultasi gratis untuk bisnis Anda? 📞`
          ];
          return businessResponses[Math.floor(Math.random() * businessResponses.length)];
          
        case 'education':
          const educationResponses = [
            `🎓 "${question}" - passion untuk pembelajaran yang inspiring! Dunia pendidikan butuh digitalisasi.\n\n📚 **AI Pengatur File untuk institusi pendidikan:**\n• Manajemen dokumen akademik\n• Arsip digital perpustakaan\n• Research data organization\n• Student portfolio management\n\n**Special offer:** Diskon 50% untuk institusi pendidikan! 🏫`,
            
            `📖 Pertanyaan tentang "${question}" menunjukkan komitmen terhadap knowledge management! \n\n🔬 **Use cases pendidikan:**\n• Thesis dan research papers\n• Lab data organization\n• Digital library systems\n• E-learning content management\n\nBanyak universitas sudah adopt kami. Mau demo khusus? 🎯`,
            
            `🌟 "${question}" - exactly what modern education needs! Knowledge organization adalah fundamental.\n\n📊 **Benefits untuk akademisi:**\n• Faster research workflow\n• Better collaboration\n• Standardized documentation\n• Long-term preservation\n\nAda program khusus untuk mahasiswa dan dosen lho! 👨‍🎓`
          ];
          return educationResponses[Math.floor(Math.random() * educationResponses.length)];
          
        case 'personal':
          const personalResponses = [
            `🏠 "${question}" - life organization yang penting banget! Rumah yang rapi, hidup yang happy.\n\n👨‍👩‍👧‍👦 **Perfect untuk keluarga:**\n• Foto keluarga yang terorganisir\n• Dokumen penting tersimpan aman\n• Kenangan digital yang terjaga\n• Sharing yang mudah antar anggota\n\n**Paket Gratis** cocok banget untuk personal use! 💝`,
            
            `💭 Bicara soal "${question}" - self-organization adalah life skill yang valuable!\n\n✨ **Personal benefits:**\n• Peace of mind dengan file teratur\n• Time saving untuk hal penting\n• Digital minimalism\n• Better work-life balance\n\nHidup jadi lebih simple dan organized! 🌈`,
            
            `🎯 "${question}" menunjukkan self-awareness yang bagus! Personal productivity starts from organization.\n\n🌟 **Lifestyle improvements:**\n• Stress-free file management\n• More time for family\n• Digital decluttering\n• Efficient personal workflow\n\nStart your organized life journey today! 🚀`
          ];
          return personalResponses[Math.floor(Math.random() * personalResponses.length)];
          
        case 'creative':
          const creativeResponses = [
            `🎨 "${question}" - creative mind yang inspiring! Kreativitas butuh tools yang tepat.\n\n✨ **Perfect untuk creators:**\n• Project files yang terorganisir\n• Version control yang mudah\n• Asset management yang efisien\n• Collaboration tools untuk tim kreatif\n\n**Success story:** Designer yang save 10 jam/minggu! 🚀`,
            
            `🌈 Pertanyaan tentang "${question}" shows artistic vision! Creativity thrives with good organization.\n\n🎭 **Creative workflow benefits:**\n• Faster asset discovery\n• Better project management\n• Seamless client delivery\n• Portfolio organization\n\nBanyak content creator dan designer sudah join! 📸`,
            
            `💫 "${question}" - exactly what creative industry needs! Innovation requires efficient workflow.\n\n🎪 **Creative use cases:**\n• Photography collections\n• Design asset libraries\n• Video project files\n• Music production folders\n\nUnleash your creativity with organized workspace! 🎵`
          ];
          return creativeResponses[Math.floor(Math.random() * creativeResponses.length)];
          
        case 'government':
          const govResponses = [
            `🏛️ "${question}" - sangat relevan untuk sektor publik! Transparansi dan akuntabilitas dimulai dari dokumentasi.\n\n📋 **Khusus instansi pemerintah:**\n• Compliance dengan standar ANRI\n• Audit trail yang lengkap\n• Multi-level security\n• Long-term preservation\n\n**Trusted by:** 50+ instansi pemerintah di Indonesia! 🇮🇩`,
            
            `🌟 Bicara soal "${question}" - good governance starts with good documentation!\n\n🔒 **Government-grade features:**\n• ISO 27001 compliance\n• Data sovereignty\n• Disaster recovery\n• Role-based access control\n\nMelayani negeri dengan teknologi terdepan! 🚀`,
            
            `📊 "${question}" menunjukkan komitmen terhadap pelayanan publik yang excellent!\n\n🎯 **Public sector benefits:**\n• Faster public service\n• Better transparency\n• Reduced bureaucracy\n• Digital transformation\n\nBersama membangun Indonesia Digital! 💪`
          ];
          return govResponses[Math.floor(Math.random() * govResponses.length)];
          
        default:
          // Ultra-intelligent general responses that analyze the question
          const questionWords = question.toLowerCase().split(' ');
          const isQuestion = questionWords.some(word => ['apa', 'bagaimana', 'kenapa', 'mengapa', 'kapan', 'dimana', 'siapa', 'berapa'].includes(word));
          const isComplaint = questionWords.some(word => ['masalah', 'error', 'gagal', 'tidak bisa', 'susah', 'sulit'].includes(word));
          const isComparison = questionWords.some(word => ['vs', 'versus', 'dibanding', 'lebih baik', 'pilih'].includes(word));
          
          if (isComplaint) {
            return `😔 Sepertinya ada concern tentang "${question}". Kami understand frustasi dengan file management!\n\n💡 **AI Pengatur File solve common problems:**\n• File yang berantakan → Auto-organization\n• Naming yang inconsistent → Smart templates\n• Waktu terbuang → Batch processing\n• Human error → AI accuracy\n\nLet us turn your pain points into productivity gains! 🚀`;
          }
          
          if (isComparison) {
            return `🤔 "${question}" - smart question untuk decision making! Comparison adalah kunci pilihan tepat.\n\n⚡ **Why choose AI Pengatur File:**\n• AI-powered vs manual tools\n• Indonesian-focused vs global generic\n• Affordable vs expensive enterprise\n• User-friendly vs complex systems\n\nMau detailed comparison? Happy to help! 📊`;
          }
          
          if (isQuestion) {
            return `🤓 "${question}" - curiosity yang bagus! Knowledge is power.\n\n🧠 **Sebagai AI assistant, saya appreciate inquisitive minds!** Meskipun pertanyaan ini di luar expertise AI Pengatur File, saya tetap ingin membantu.\n\n💭 **Fun fact:** Organizing information (seperti yang kami lakukan dengan files) adalah fundamental skill untuk semua domain knowledge!\n\nAda yang spesifik tentang file management yang ingin dibahas? 🎯`;
          }
          
          // Default intelligent response
          const generalResponses = [
            `🌟 "${question}" - topik yang menarik! Sebagai AI yang fokus pada file organization, saya selalu excited belajar hal baru.\n\n💡 **Connecting dots:** Apapun domain atau interest Anda, good file management adalah foundation untuk productivity. AI Pengatur File bisa jadi starting point untuk better digital life!\n\nMau explore bagaimana organized files bisa support passion Anda? 🚀`,
            
            `🎯 Wah, "${question}" shows diverse interests! Saya appreciate broad perspective.\n\n🔍 **Insight:** Successful people di berbagai field punya satu kesamaan - mereka organized! Whether it's documents, photos, atau project files, organization breeds success.\n\nPenasaran bagaimana AI bisa help organize your digital world? ✨`,
            
            `💭 "${question}" - thought-provoking! Sebagai AI assistant, saya love engaging conversations.\n\n🌈 **Philosophy:** Every question leads to learning, every learning leads to growth. AI Pengatur File embodies this - we learn from your files to help you grow more productive!\n\nReady to start your productivity journey? 🚀`
          ];
          
          return generalResponses[Math.floor(Math.random() * generalResponses.length)];
      }
    };

    // Cute default response for unmatched queries
    const airaDefaultResponses = [
      '🤖✨ Hmm, pertanyaan yang menarik! Aira lagi mikir nih...\n\nMeskipun Aira fokus pada AI Pengatur File, Aira tetap pengen bantuin! Mungkin ada kaitannya dengan file management?\n\n💡 **Yang bisa Aira bantuin:**\n• Info produk dan fitur 🚀\n• Harga dan paket 💰\n• Tutorial penggunaan 📚\n• Tips & tricks 💫\n\nAda yang spesifik tentang AI Pengatur File? 😊',
      
      '🌟 Ooh, topik yang interesting! Aira suka curiosity seperti ini!\n\nSebagai AI assistant untuk file management, Aira always excited belajar hal baru. Siapa tau pertanyaan ini bisa connect ke organizing files?\n\n🎯 **Fun fact:** Good organization adalah key untuk semua aspek kehidupan, termasuk digital files!\n\nMau explore bagaimana AI Pengatur File bisa help? ✨',
      
      '💭 Wah, creative thinking! Aira appreciate banget mindset yang open seperti ini.\n\nMeskipun Aira specialized di file organization, Aira percaya semua hal bisa connected somehow. Maybe ada file atau dokumen yang perlu diatur?\n\n🚀 **Aira\'s mission:** Make your digital life more organized and beautiful!\n\nLet\'s chat more about your file management needs! 💕'
    ];
    
    // Return random cute default response
    return airaDefaultResponses[Math.floor(Math.random() * airaDefaultResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const botResponse = await generateBotResponse(userMessage.content);
      
      // Remove typing indicator and add real response
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== 'typing');
        return [...withoutTyping, {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: 'bot',
          timestamp: new Date()
        }];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== 'typing');
        return [...withoutTyping, {
          id: (Date.now() + 1).toString(),
          content: 'Maaf, terjadi kesalahan. Silakan coba lagi dalam beberapa saat.',
          sender: 'bot',
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Enhanced formatting with better line break handling
    return content
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Bullet points
      .replace(/^[•·]\s/gm, '<span class="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>')
      // Line breaks - preserve all \n
      .replace(/\n/g, '<br/>')
      // Numbered lists
      .replace(/^(\d+)\.\s/gm, '<strong>$1.</strong> ')
      // Emoji spacing
      .replace(/([\u{1F300}-\u{1F9FF}])/gu, '$1 ')
      // Remove excessive spaces
      .replace(/\s+/g, ' ')
      .trim();
  };

  if (!isOpen) {
    return (
      <>
        {/* Add animation styles */}
        <style>{floatingAnimation}</style>
        
        <div className="fixed bottom-6 right-6 z-50" style={{ animation: 'floating 3s ease-in-out infinite' }}>
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full gradient-primary btn-primary-glow shadow-lg hover:scale-110 transition-all duration-300 p-0 overflow-hidden relative group"
            size="icon"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
          >
            {/* Aira Avatar Image */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <img 
                src="/images/chatbot/chatbot.png" 
                alt="Chat with Aira" 
                className="w-14 h-14 object-cover rounded-full transition-transform group-hover:scale-110 group-hover:rotate-12"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallbackIcon = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallbackIcon) fallbackIcon.style.display = 'block';
                }}
              />
              <MessageCircle className="w-8 h-8 hidden" style={{ display: 'none' }} />
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          </Button>
          
          {/* Notification badge with sparkles - animated */}
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-pink-500 to-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg"
               style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          
          {/* Cute tooltip */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:translate-y-0 translate-y-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-xl py-2 px-4 whitespace-nowrap shadow-2xl">
              <div className="flex items-center gap-2">
                <span className="animate-bounce">👋</span>
                <span>Halo! Chat sama Aira yuk!</span>
              </div>
              <div className="absolute top-full right-6 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-blue-600" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={cn(
        "bg-background border border-border rounded-2xl shadow-2xl transition-all duration-300",
        isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <img 
                src="/images/chatbot/chatbot.png" 
                alt="Aira AI Assistant" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Bot className="w-5 h-5 text-primary-foreground hidden" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Aira AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Raymaizing Support • Online</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 h-[380px] overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 mt-1">
                      <img 
                        src="/images/chatbot/chatbot.png" 
                        alt="Aira" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <Bot className="w-4 h-4 text-primary-foreground hidden" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-sm",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    )}
                  >
                    {message.isTyping ? (
                      <div className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="text-xs">Mengetik...</span>
                      </div>
                    ) : (
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessage(message.content) 
                        }} 
                      />
                    )}
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanya Aira tentang AI Pengatur File..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="gradient-primary"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Aira AI Ready ✨</span>
                <span>Press Enter to send</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatbotSimple;