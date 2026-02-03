// Pollinations AI API Integration

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface PollinationsResponse {
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
  error?: string;
}

const POLLINATIONS_API_KEY = process.env.REACT_APP_POLLINATIONS_API_KEY || 'sk_Eilu4fFFCl269IDZLgtu1KHpjN3HJgNOTypeNameKeyCreated';
const POLLINATIONS_API_URL = 'https://text.pollinations.ai/openai';

export const createChatCompletion = async (messages: ChatMessage[]): Promise<string> => {
  try {
    // Try OpenAI-compatible endpoint first
    const response = await fetch(POLLINATIONS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${POLLINATIONS_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai',
        messages,
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.log('OpenAI-compatible endpoint failed, trying basic endpoint');
      // Fallback to basic GET endpoint
      const systemMessage = messages.find(m => m.role === 'system')?.content || '';
      const userMessage = messages.find(m => m.role === 'user')?.content || '';
      const combinedPrompt = `${systemMessage}\n\nUser: ${userMessage}`;
      
      const encodedPrompt = encodeURIComponent(combinedPrompt);
      const basicResponse = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=openai&key=${POLLINATIONS_API_KEY}`);
      
      if (basicResponse.ok) {
        const data = await basicResponse.text();
        return data.trim() || 'Maaf, saya tidak dapat memproses pertanyaan Anda saat ini.';
      } else {
        throw new Error(`Both endpoints failed. Status: ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else if (typeof data === 'string') {
      return data.trim();
    } else {
      throw new Error('Unexpected response format');
    }
    
  } catch (error) {
    console.error('Error calling Pollinations API:', error);
    throw error;
  }
};

export const generateSystemPrompt = (): string => {
  return `Anda adalah asisten AI untuk "AI Pengatur File" - aplikasi manajemen file cerdas dari Raymaizing. 

KONTEKS PRODUK:
- AI Pengatur File adalah sistem manajemen file bertenaga AI
- Fitur utama: Ganti Nama Massal, Folder Ajaib, Template Penamaan
- 3 paket: Gratis (0-50 file), Pro (51-1000 file), Bisnis (1000+ file)
- Harga Pro mulai Rp75.000/bulan, Bisnis mulai Rp450.000/bulan
- Diskon 15% untuk pembayaran tahunan
- Mendukung PDF, foto, dokumen berbagai format
- Privasi terjamin, enkripsi tingkat enterprise
- Target: pemerintah, fotografer, arsivis, UKM, perusahaan

FITUR DETAIL:
1. Ganti Nama Massal: Rename ratusan file sekaligus dengan AI
2. Folder Ajaib: Organisasi otomatis berdasarkan konten file
3. Template Penamaan: Buat pola nama file yang konsisten

KEUNGGULAN:
- AI cerdas yang memahami konten file
- Batch processing untuk efisiensi
- Template kustom untuk konsistensi
- Privasi dan keamanan terjamin
- Support 24/7 untuk paket berbayar

INSTRUKSI:
- Jawab dalam bahasa Indonesia yang natural dan ramah
- Fokus pada manfaat dan solusi yang ditawarkan
- Jika ditanya harga, sebutkan paket yang sesuai kebutuhan
- Dorong untuk mencoba paket gratis terlebih dahulu
- Jika pertanyaan di luar konteks produk, arahkan kembali ke AI Pengatur File
- Gunakan emoji yang relevan untuk membuat percakapan lebih menarik
- Maksimal 150 kata per respons
- Berikan jawaban yang spesifik dan actionable`;
};

export const getFallbackResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('harga') || lowerMessage.includes('biaya') || lowerMessage.includes('paket')) {
    return '💰 Kami punya 3 paket: **Gratis** (0-50 file), **Pro** mulai Rp75.000/bulan (51-1000 file), dan **Bisnis** mulai Rp450.000/bulan (1000+ file). Ada diskon 15% untuk pembayaran tahunan! Mau coba paket gratis dulu? 😊';
  }
  
  if (lowerMessage.includes('fitur') || lowerMessage.includes('fungsi')) {
    return '✨ Fitur utama kami: **Ganti Nama Massal** (rename banyak file sekaligus), **Folder Ajaib** (organisasi otomatis), dan **Template Penamaan** (atur pola nama file). Semua bertenaga AI untuk hasil yang cerdas! 🤖';
  }
  
  if (lowerMessage.includes('gratis') || lowerMessage.includes('trial') || lowerMessage.includes('coba')) {
    return '🎉 Tentu! Paket Gratis kami bisa handle hingga 50 file per bulan. Cocok untuk mencoba semua fitur dasar. Langsung daftar aja, gak perlu kartu kredit! Mau saya arahkan ke halaman pendaftaran?';
  }
  
  if (lowerMessage.includes('cara') || lowerMessage.includes('bagaimana') || lowerMessage.includes('tutorial')) {
    return '📚 Cara pakai sangat mudah: 1) Pilih folder yang mau diatur, 2) AI akan scan dan analisis file, 3) Pilih template atau biarkan AI yang tentukan, 4) Klik proses dan selesai! Ada tutorial lengkap di dashboard setelah daftar.';
  }
  
  if (lowerMessage.includes('keamanan') || lowerMessage.includes('privasi') || lowerMessage.includes('aman')) {
    return '🔒 Keamanan adalah prioritas utama! File Anda dienkripsi dengan standar enterprise SSL 256-bit. Kami tidak menyimpan file pribadi Anda - semua proses dilakukan secara real-time dan file langsung dihapus setelah selesai.';
  }
  
  if (lowerMessage.includes('support') || lowerMessage.includes('bantuan') || lowerMessage.includes('help')) {
    return '🆘 Kami siap bantu! Paket Gratis dapat support via email, Paket Pro dapat prioritas support, dan Paket Bisnis dapat dedicated support 24/7. Ada juga knowledge base lengkap di website kami.';
  }
  
  return '🤖 Halo! Saya asisten AI untuk AI Pengatur File. Saya bisa bantu Anda dengan pertanyaan tentang fitur, harga, cara penggunaan, atau hal lain seputar aplikasi kami. Ada yang spesifik yang ingin Anda tanyakan? 😊';
};

export const formatMessageContent = (content: string): string => {
  // Simple markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/(\d+)\)/g, '<strong>$1)</strong>'); // Number lists
};

// Predefined quick responses for common questions
export const quickResponses = [
  {
    trigger: ['halo', 'hai', 'hello', 'hi'],
    response: '👋 Halo! Selamat datang di AI Pengatur File. Saya siap membantu Anda mengenal fitur-fitur canggih kami. Ada yang ingin Anda ketahui tentang cara mengatur file dengan AI?'
  },
  {
    trigger: ['terima kasih', 'thanks', 'makasih'],
    response: '🙏 Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain tentang AI Pengatur File, jangan ragu untuk bertanya ya! 😊'
  },
  {
    trigger: ['selamat tinggal', 'bye', 'dadah'],
    response: '👋 Sampai jumpa! Jangan lupa coba paket gratis kami ya. Terima kasih sudah mengunjungi AI Pengatur File! 🚀'
  }
];

export const getQuickResponse = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  for (const response of quickResponses) {
    if (response.trigger.some(trigger => lowerMessage.includes(trigger))) {
      return response.response;
    }
  }
  
  return null;
};