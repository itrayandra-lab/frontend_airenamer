# Chatbot Testing Guide - Aira AI Assistant

## 🧪 How to Test the Improved Chatbot

### 1. Access the Chatbot
- Open browser: http://localhost:8080
- Look for the floating blue chatbot button (bottom right)
- Click the cute Aira avatar to open chat

### 2. Test Scenarios

#### ✅ Test 1: Pricing Accuracy
**Ask:** "Berapa harga paket Pro?"
**Expected:** Should answer with exact price:
- Bulanan: Rp 75.000/bulan
- Tahunan: Rp 765.000/tahun (Rp 63.750/bulan - hemat 15%)

**Ask:** "Berapa harga paket Bisnis per tahun?"
**Expected:** Should answer: Rp 4.590.000/tahun (Rp 382.500/bulan - hemat 15%)

**Ask:** "Ada diskon apa aja?"
**Expected:** Should mention:
- Tahunan: 15%
- Institusi Pendidikan: 50%
- Pemerintah: 30%
- Non-profit: 40%
- Startup: 25%

#### ✅ Test 2: Feature Knowledge
**Ask:** "Apa itu Folder Ajaib?"
**Expected:** Should explain:
- Organisasi otomatis file berdasarkan konten dan jenis
- AI kategorisasi berdasarkan jenis, konten, tanggal, metadata
- Use cases: Pisahkan foto per event, organisir dokumen per jenis

**Ask:** "Bagaimana cara kerja Ganti Nama Massal?"
**Expected:** Should explain:
- Rename ratusan hingga ribuan file sekaligus
- AI analisis konten file
- Hemat waktu hingga 80%
- Use cases for photographers and archivists

**Ask:** "Fitur apa saja yang tersedia?"
**Expected:** Should list 3 main features:
1. Ganti Nama Massal (Bulk Rename)
2. Folder Ajaib (Magic Folders)
3. Template Penamaan (Naming Templates)

#### ✅ Test 3: Technical Details
**Ask:** "Format file apa saja yang didukung?"
**Expected:** Should mention:
- Dokumen: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
- Gambar: JPG, PNG, GIF, BMP, TIFF, RAW, HEIC, WebP, SVG
- Video: MP4, AVI, MOV, WMV, MKV, FLV
- Audio: MP3, WAV, AAC, FLAC, OGG, M4A
- Data: CSV, JSON, XML, ZIP, RAR, 7Z

**Ask:** "Bagaimana keamanan data saya?"
**Expected:** Should mention:
- SSL/TLS 256-bit encryption
- End-to-end encryption
- No file storage (tidak disimpan di server)
- Real-time processing
- GDPR compliant
- ISO 27001, ANRI Standards, SOC 2 Type II

**Ask:** "Apakah support PDF dan foto?"
**Expected:** Should confirm yes and list specific formats

#### ✅ Test 4: Target Users
**Ask:** "Cocok untuk fotografer?"
**Expected:** Should explain:
- Organisasi foto per event/klien
- Rename massal dengan nama klien
- Auto-sorting by date/event
- Paket Pro untuk individual, Bisnis untuk studio

**Ask:** "Bisa untuk instansi pemerintah?"
**Expected:** Should mention:
- Compliance ANRI
- Audit trail lengkap
- Multi-user dengan role management
- Keamanan enterprise
- Paket Bisnis dengan compliance tools

**Ask:** "Ada compliance ANRI?"
**Expected:** Should confirm yes and explain:
- Standar Arsip Nasional Republik Indonesia
- Available in Paket Bisnis
- Custom training untuk standar ANRI

#### ✅ Test 5: Payment Methods
**Ask:** "Metode pembayaran apa saja?"
**Expected:** Should list:
- Transfer Bank: BCA, Mandiri, BNI, BRI
- Kartu Kredit: Visa, Mastercard, JCB, Amex
- E-Wallet: GoPay, OVO, DANA, ShopeePay, LinkAja
- Retail: Alfamart, Indomaret
- Payment Gateway: Midtrans

**Ask:** "Bisa bayar pakai GoPay?"
**Expected:** Should confirm yes, GoPay is supported

**Ask:** "Apakah pembayaran aman?"
**Expected:** Should mention:
- Midtrans payment gateway
- PCI DSS compliant
- SSL encryption

#### ✅ Test 6: Usage & Support
**Ask:** "Bagaimana cara menggunakan?"
**Expected:** Should explain 3 steps:
1. Pilih Folder (klik atau drag & drop)
2. AI Analisis (scan, analisis, generate suggestions)
3. Review & Apply (review, edit, approve, proses otomatis)

**Ask:** "Ada support apa saja?"
**Expected:** Should explain by package:
- Gratis: Email support (24-48 jam), knowledge base, tutorial videos
- Pro: Priority email (12-24 jam), live chat, video tutorials premium
- Bisnis: Dedicated support 24/7, phone support, video call, onboarding

#### ✅ Test 7: Personality & Language
**Ask:** "Siapa nama kamu?"
**Expected:** Should introduce as Aira (AI Assistant Raymaizing)

**Ask:** "Halo!"
**Expected:** Should respond in friendly, natural Indonesian with emojis

**Ask:** "Terima kasih!"
**Expected:** Should respond warmly and offer more help

#### ✅ Test 8: Off-Topic Questions
**Ask:** "Apa itu AI?"
**Expected:** Should answer but connect back to AI Pengatur File

**Ask:** "Cuaca hari ini?"
**Expected:** Should acknowledge question but redirect to product features

### 3. Check Message Formatting

**Look for:**
- ✅ Line breaks display correctly (not \n visible)
- ✅ Bullet points render properly (• or numbers)
- ✅ Bold text works (**text** → **text**)
- ✅ Emojis have proper spacing
- ✅ Messages are readable and well-formatted

### 4. Check Response Quality

**Verify:**
- ✅ Responses are in natural Indonesian (not stiff translations)
- ✅ Answers are accurate (match knowledge base)
- ✅ Responses are concise (not too long)
- ✅ Personality is cute and friendly
- ✅ Emojis are used appropriately
- ✅ No "I don't know" responses
- ✅ Always helpful and solution-oriented

### 5. Check API Performance

**Monitor console (F12):**
- ✅ Groq API calls succeed (primary)
- ✅ Fallback to Pollinations if Groq fails
- ✅ Smart fallback responses if both APIs fail
- ✅ No errors in console
- ✅ Response time is reasonable (< 5 seconds)

### 6. Edge Cases

**Test:**
- ✅ Very long questions
- ✅ Questions with typos
- ✅ Multiple questions at once
- ✅ Questions in English
- ✅ Empty messages (should be disabled)
- ✅ Special characters

### 7. UI/UX Check

**Verify:**
- ✅ Chatbot button floats and animates
- ✅ Blue glow effect works
- ✅ Tooltip shows on hover
- ✅ Aira avatar displays correctly
- ✅ Chat window opens/closes smoothly
- ✅ Minimize/maximize works
- ✅ Scroll works properly
- ✅ Input field is responsive
- ✅ Send button works
- ✅ Loading indicator shows during API calls
- ✅ Typing indicator displays

## 📊 Success Criteria

The chatbot is working correctly if:
1. ✅ All pricing information is accurate
2. ✅ Feature descriptions are complete and correct
3. ✅ Technical details match knowledge base
4. ✅ Target user recommendations are appropriate
5. ✅ Payment methods are listed correctly
6. ✅ Message formatting is clean and readable
7. ✅ Responses are in natural Indonesian
8. ✅ Personality is cute and friendly
9. ✅ API calls work (Groq or Pollinations)
10. ✅ Fallback responses are intelligent

## 🐛 If Issues Found

**Common Issues & Solutions:**

1. **API not responding:**
   - Check Groq API key is valid
   - Check internet connection
   - Fallback should kick in automatically

2. **Inaccurate responses:**
   - Check system prompt in ChatbotSimple.tsx
   - Verify knowledge base is complete
   - May need to adjust prompt wording

3. **Formatting issues:**
   - Check formatMessage() function
   - Verify HTML rendering works
   - Check CSS styles

4. **Personality issues:**
   - Adjust system prompt personality section
   - Add more examples in prompt
   - Fine-tune temperature parameter

## 📝 Report Template

After testing, report:

```
✅ PASSED / ❌ FAILED

Test 1 - Pricing Accuracy: [PASS/FAIL]
Test 2 - Feature Knowledge: [PASS/FAIL]
Test 3 - Technical Details: [PASS/FAIL]
Test 4 - Target Users: [PASS/FAIL]
Test 5 - Payment Methods: [PASS/FAIL]
Test 6 - Usage & Support: [PASS/FAIL]
Test 7 - Personality: [PASS/FAIL]
Test 8 - Off-Topic: [PASS/FAIL]

Message Formatting: [PASS/FAIL]
Response Quality: [PASS/FAIL]
API Performance: [PASS/FAIL]
UI/UX: [PASS/FAIL]

Issues Found:
- [List any issues]

Suggestions:
- [List improvements]
```

## 🎯 Ready to Test!

Open http://localhost:8080 and start chatting with Aira! 🤖💕
