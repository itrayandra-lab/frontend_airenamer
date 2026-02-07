# Design Update - Web Renamer Style

## Perubahan yang Diterapkan

Desain dan layout dari **web_renamer** telah diterapkan ke **reactjs** dengan fokus pada:

### 1. Skema Warna
- **Dark Mode sebagai Default**: Menggunakan background gelap (#0a0a0f to #1a1a2e)
- **Primary Color**: Blue (hsl(217 91% 60%)) - rgb(59, 130, 246)
- **Accent Color**: Lighter blue (hsl(217 91% 68%)) - rgb(96, 165, 250)
- **Glass Morphism**: Cards dengan efek `rgba(255, 255, 255, 0.04)` dan backdrop blur

### 2. Typography
- **Font Primary**: 'GT Walsheim Pro', 'DM Sans'
- **Font Mono**: 'JetBrains Mono'
- Font yang sama dengan web_renamer untuk konsistensi visual

### 3. Logo & Branding
- **Navbar Logo**: Menggunakan logo image `logo_autofile.png` (sama seperti web_renamer)
- **Logo Location**: `/public/assets/img/logo_autofile.png`
- Mengganti teks "RAYMAIZING | autofile" dengan logo image

### 4. Theme Management
- **Default Theme**: Dark mode untuk semua halaman
- **Dashboard Exception**: Light mode khusus untuk halaman Dashboard
- **Auto Switch**: Otomatis kembali ke dark mode saat keluar dari Dashboard

### 4. Efek Visual

#### Background Effects
- Gradient background: `linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)`
- Radial glow effect di tengah halaman dengan warna biru

#### Card Styles
- **Glass Cards**: Background transparan dengan blur effect
- **Hover Effects**: Transform translateY dan glow biru
- **Border**: Subtle white overlay `rgba(255, 255, 255, 0.1)`

#### Button Styles
- **Primary Glow**: Shadow dengan warna biru `rgba(59, 130, 246, 0.39)`
- **Hover State**: Enhanced glow effect

### 5. Component Classes

#### Tersedia untuk digunakan:
- `.gradient-text` - Text dengan gradient biru
- `.gradient-primary` - Background gradient biru
- `.file-card` - Card dengan glass morphism effect
- `.btn-primary-glow` - Button dengan glow effect
- `.upload-zone` - Upload area dengan dashed border
- `.pricing-card` - Pricing card dengan glass effect
- `.testimonial-card` - Testimonial card dengan glass effect
- `.glass-card` - Generic glass morphism card

### 6. Fungsi yang Dipertahankan

✅ **Semua fungsi reactjs tetap utuh**, termasuk:
- Routing dan navigasi
- Authentication flow
- Payment integration
- Dashboard functionality
- Form handling
- API integration

## File yang Dimodifikasi

1. **reactjs/src/index.css**
   - Update color variables
   - Tambah background effects
   - Update component styles dengan glass morphism

2. **reactjs/tailwind.config.ts**
   - Update font family ke GT Walsheim Pro dan DM Sans

3. **reactjs/src/App.tsx**
   - Tambah ThemeProvider dengan dark mode default

4. **reactjs/src/components/Header.tsx**
   - Ganti teks logo dengan logo image
   - Import logo dari `/assets/img/logo_autofile.png`

5. **reactjs/src/pages/Login.tsx**
   - Ganti teks "RAYMAIZING" dengan logo image
   - Import logo dari `/assets/img/logo_autofile.png`
   - Logo clickable mengarah ke homepage

6. **reactjs/src/pages/ForgotPassword.tsx**
   - Ganti teks "RAYMAIZING" dengan logo image
   - Import logo dari `/assets/img/logo_autofile.png`
   - Logo clickable mengarah ke homepage

7. **reactjs/src/pages/ResetPassword.tsx**
   - Ganti teks "RAYMAIZING" dengan logo image
   - Import logo dari `/assets/img/logo_autofile.png`
   - Logo clickable mengarah ke homepage

8. **reactjs/src/components/HeroSection.tsx**
   - Ganti UI preview (glass card dengan controls) dengan hero image
   - Tambah floating animation (`animate-float`)
   - Tambah glow effect di belakang image
   - Import hero image dari `/assets/img/hero.png`
   - Ukuran image dibatasi dengan `max-w-md` (448px)

9. **reactjs/src/pages/Dashboard.tsx**
   - Import `useTheme` dari next-themes
   - Tambah `useEffect` untuk force light mode saat di Dashboard
   - Auto cleanup: kembali ke dark mode saat keluar dari Dashboard

10. **reactjs/public/assets/img/**
   - Copy logo_autofile.png dari web_renamer
   - Copy logo.png dari web_renamer
   - hero.png (sudah disiapkan sebelumnya)

## Cara Menggunakan

Aplikasi sekarang menggunakan dark mode secara default dengan desain yang sama seperti web_renamer. Semua komponen akan otomatis menggunakan:
- Warna biru sebagai primary color
- Glass morphism effect pada cards
- Background gelap dengan glow effect
- Font GT Walsheim Pro / DM Sans
- Logo image di navbar (bukan teks)

**Pengecualian:**
- **Dashboard** menggunakan **light mode** untuk kemudahan membaca data dan informasi
- Otomatis kembali ke dark mode saat keluar dari Dashboard

## Testing

Untuk melihat perubahan:
```bash
cd reactjs
npm run dev
```

Buka browser dan lihat perubahan visual pada semua halaman, terutama navbar dengan logo baru.
