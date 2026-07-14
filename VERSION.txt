# LESA Başlangıç Paketi v1

Bu paket, CEM Su Sayaçları için geliştirilen LESA platformunun ilk çalışan web uygulaması iskeletidir.

## Hazır gelenler
- Türkçe açılış sayfası
- Giriş ekranı taslağı
- Operasyon dashboard'u
- Supabase tarayıcı ve sunucu bağlantı dosyaları
- Ürün, ihale, müşteri, teklif, sipariş, fatura, teminat, servis ve görev tablolarını kuran SQL
- Vercel için ortam değişkeni şablonu

## Kurulum özeti
1. Bu klasörün içindeki dosyaları GitHub `aliozgenc61/LESA` deposuna yükleyin.
2. Supabase → SQL Editor bölümünde `supabase/schema.sql` dosyasını çalıştırın.
3. Supabase → Project Settings → API bölümündeki `anon` anahtarını kopyalayın.
4. Vercel projesinde Environment Variables bölümüne `.env.example` içindeki değişkenleri ekleyin.
5. Vercel'de GitHub deposunu Import ederek Deploy düğmesine basın.

Ayrıntılı, ekrandan ekrana Türkçe anlatım için `KURULUM_REHBERI_TR.md` dosyasını açın.
