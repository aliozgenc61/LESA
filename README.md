# LESA v3 – Türkçe Kurulum Rehberi

## A. GitHub dosya yapısını doğru yükleme

1. `LESA_Baslangic_Paketi_v3.zip` dosyasını indir.
2. ZIP'e sağ tıkla ve **Tümünü Ayıkla / Klasöre Çıkar** seçeneğini kullan.
3. Çıkan klasörü aç. İçeride şu klasörleri görmelisin:
   - `app`
   - `components`
   - `lib`
   - `public`
   - `supabase`
4. GitHub'da `aliozgenc61/LESA` deposunu aç.
5. **Add file → Upload files** seç.
6. Yukarıdaki klasörleri ve ana dosyaları birlikte sürükle.
7. Yükleme ekranında yolların `app/page.tsx`, `components/KpiCard.tsx`, `supabase/schema.sql` şeklinde göründüğünü kontrol et.
8. **Commit changes** düğmesine bas.

> GitHub ana sayfasında bütün dosyalar tek listede görünüyorsa klasör yapısı bozulmuştur. Devam etme.

## B. Supabase SQL kurulumu

1. GitHub ana klasöründe `SUPABASE_SCHEMA.sql` dosyasını aç.
2. İlk satırın `-- LESA Çekirdek Veritabanı v1` olduğundan emin ol.
3. **Raw** düğmesine bas ve içeriğin tamamını kopyala.
4. Supabase → **SQL Editor → New query** bölümüne gir.
5. Boş sorgu alanına SQL'i yapıştır.
6. **Run** düğmesine bas.
7. Başarı mesajından sonra Supabase → **Table Editor** bölümünde tabloları kontrol et.

## C. Supabase kullanıcı oluşturma

1. Supabase → **Authentication → Users** bölümüne gir.
2. **Add user** seç.
3. E-posta ve geçici şifre belirle.
4. Kullanıcı e-posta adresini güvenli bir yerde sakla.

## D. Vercel bağlantısı

1. Vercel → **Add New → Project** seç.
2. GitHub'dan `aliozgenc61/LESA` deposunu içe aktar.
3. Environment Variables alanına şunları ekle:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy** düğmesine bas.

## Güvenlik

- Database şifresini GitHub'a yükleme.
- `service_role` anahtarını tarayıcı tarafına veya buraya gönderme.
- OpenAI API anahtarını GitHub'a yazma.
