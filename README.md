# Görev Yönetim Uygulaması

React ve Node.js teknolojileri kullanılarak geliştirilmiştir. SQLite veritabanı kullanılmaktadır. Docker compose ile geliştirme ve production ortamında çalıştırılabilir.

🌐 **Canlı Demo:** [https://task.erdal.net.tr](https://task.erdal.net.tr)

**Demo Kullanıcıları:**

- **Admin:**
  - TCKN: 12345678901
  - Password: admin123

- **Kullanıcı:**
  - TCKN: 98765432109
  - Password: user123

**Görev Yönetimi**
  - Görev oluşturma, düzenleme ve silme
  - Görev durumu takibi (Tamamlandı/Devam Ediyor)
  - Görevleri kullanıcılara atama
  - Detaylı görev açıklamaları

- **Kullanıcı Sistemi**
  - TC Kimlik No ile güvenli giriş
  - Rol tabanlı yetkilendirme (Admin/Kullanıcı)
  - Kişiselleştirilmiş görev görünümü

- **Kullanıcı Arayüzü**
  - Responsive tasarım
  - Modern ve kullanıcı dostu arayüz
  - TailwindCSS ile tasarım
  - Kolay navigasyon

## 💻 Teknoloji Altyapısı

### Frontend
- React
- TypeScript
- TailwindCSS
- React Router
- Axios
- React Query

### Backend
- Node.js
- Express
- SQLite
- JWT Authentication

## 👥 Kullanıcı Rolleri

### Normal Kullanıcı
- Kendi görevlerini görüntüleme
- Kendi görevlerini düzenleme
- Görev durumunu güncelleme
- Kendi görevlerini silme

### Admin
- Tüm görevleri görüntüleme
- Tüm görevleri düzenleme
- Kullanıcı yönetimi
- Sistem genelinde tam yetki

## 🛠️ Kurulum

1. Repoyu klonlayın
```bash
git clone https://github.com/coderdal/task-management
```

Docker compose ile de çalıştırılabilir.

```bash
docker compose up
```

2. Backend kurulumu
```bash
cd backend
npm install
npm run dev
```

3. Frontend kurulumu
```bash
cd frontend
npm install
npm run dev
```

## 📝 Notlar

- Uygulama yerel veritabanı kullanmaktadır
- Geliştirme ortamında backend servisi 5066 portunda çalışmaktadır
- Frontend geliştirme sunucusu 3066 portunda çalışmaktadır

