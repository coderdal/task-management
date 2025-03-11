# Rakamon Görev Takip Sistemi - Backend

## Gereksinimler

- Node.js (v14 veya daha yüksek)
- npm (v6 veya daha yüksek)

## Kurulum

1. Repository'yi indirin
2. Backend dizinine gidin
3. Paketleri yükleyin:

```bash
npm install
```

4. `backend` dizininde `.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```
PORT=5000
JWT_SECRET=jwt_gizli_anahtar
NODE_ENV=development
```

## Veritabanı

Veritabanı olarak SQLite kullanılmaktadır. Sunucu başlatıldığında veritabanı dosyası otomatik olarak oluşturulur.

Veritabanına mock veri eklemek için:

```bash
npm run seed
```

Örnek kullanıcılar:
- admin (tc: 12345678901, password: admin123)
- normal kullanıcı (tc: 98765432109, password: user123)

## Çalıştırma

```bash
npm run dev
```
