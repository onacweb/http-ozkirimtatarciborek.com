# ONAÇ WEB — Premium V1 düzenlemeleri

- React içinde gerçek URL geçmişi eklendi: /hizmetler, /hakkimizda, /iletisim, /giris, /kayit, /panel, /admin.
- Render sırasında setState ile yönlendirme kaldırıldı; geri/ileri tarayıcı tuşları destekleniyor.
- Sayfa bazlı document.title eklendi.
- Ana sayfa hero mesajı daha dönüşüm odaklı hale getirildi.
- Doğrulanmayan müşteri/proje/rating sayaçları kaldırıldı.
- Sahte marka logoları yerine hizmet/uzmanlık marquee metinleri kullanıldı.
- “Sınırsız revizyon” ifadeleri planlı/kontrollü revizyon diline çevrildi.
- Hakkımızda sayfasındaki doğrulanmayan zaman çizelgesi, rakamlar ve sahte ekip profilleri kaldırılarak çalışma modeli/uzmanlık alanlarıyla değiştirildi.
- İletişim formu artık kullanıcıya yanlış “mesaj alındı” bilgisi vermiyor; info@onacweb.com adresine hazır e-posta açıyor.
- Placeholder telefon/adres alanları kaldırıldı; e-posta, WhatsApp ve online çalışma modeli öne çıkarıldı.
- Footer 2026 olarak güncellendi ve boş sosyal medya linkleri kaldırıldı.

## Not
Bu çalışma ortamındaki npm paket aynasında `yocto-queue@0.1.0` bulunamadığı için `npm ci` tamamlanamadı. Bu nedenle final Vite build testi bu ortamda çalıştırılamadı. Proje bilgisayarda `npm install` ve ardından `npm run build` ile kontrol edilmelidir.
