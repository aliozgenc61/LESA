# LESA Kurulum Rehberi — Türkçe ve Adım Adım

## A. GitHub'a yükleme
1. Bilgisayarınızda ZIP dosyasını açın.
2. Açılan `LESA_Baslangic_Paketi_v1` klasörünün içine girin.
3. Tarayıcıdan `https://github.com/aliozgenc61/LESA` adresini açın.
4. **Add file** → **Upload files** seçin.
5. Klasörün kendisini değil, klasör içindeki bütün dosya ve klasörleri yükleme alanına sürükleyin.
6. Alt bölümde açıklama kutusuna `LESA başlangıç paketi v1` yazın.
7. **Commit changes** düğmesine basın.

## B. Supabase veritabanını kurma
1. Supabase projenizi açın.
2. Sol menüden **SQL Editor** seçin.
3. **New query** düğmesine basın.
4. Bilgisayarınızdaki `supabase/schema.sql` dosyasını Not Defteri ile açın.
5. İçeriğin tamamını kopyalayıp SQL Editor alanına yapıştırın.
6. Sağ alttaki **Run** düğmesine basın.
7. `Success` mesajı görünmelidir.

## C. Supabase anahtarını bulma
1. Supabase sol alt bölümden **Project Settings** seçin.
2. **API Keys** veya **API** bölümünü açın.
3. `anon` / `publishable` anahtarını kopyalayın.
4. `service_role` anahtarını sohbet ekranına veya GitHub'a kesinlikle yazmayın.

## D. Vercel'e bağlama
1. Vercel hesabınızı açın.
2. **Add New…** → **Project** seçin.
3. GitHub listesinde `aliozgenc61/LESA` deposunu bulun.
4. **Import** düğmesine basın.
5. Framework otomatik olarak **Next.js** görünmelidir.
6. **Environment Variables** alanına şunları ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://bxoowibxzenqjfrjqtec.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase'ten kopyaladığınız anon/publishable anahtar
7. **Deploy** düğmesine basın.
8. Birkaç dakika sonra Vercel size canlı site adresi verecektir.

## Güvenlik
Aşağıdaki bilgileri GitHub'a veya sohbet ekranına yüklemeyin:
- Supabase service_role anahtarı
- Veritabanı şifresi
- OpenAI API anahtarı
- Vercel tokeni
