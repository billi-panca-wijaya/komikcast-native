# Komikcast

Platform baca komik/manhwa online modern, gratis tanpa iklan. Dibangun dengan React dan Vite.

## 🚀 Teknologi

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS
- **Backend**: Express.js + SQLite
- **SEO**: react-helmet-async

## ✨ Fitur

- 📖 Baca komik gratis tanpa iklan
- 🔍 Pencarian komik real-time
- 📱 Responsive design (mobile-friendly)
- 🌙 Dark mode
- 📊 Statistik pengunjung
- 🔔 Google Instant Indexing API
- 💾 Riwayat baca tersimpan lokal

## 📦 Instalasi

```sh
# Clone repository
git clone https://github.com/bilynatalia/komikcast.git
cd komikcast

# Install dependencies
npm install
```

## 🛠️ Development

```sh
# Menjalankan frontend development server
npm run dev

# Menjalankan backend server
npm run server

# Menjalankan keduanya bersamaan
npm run dev:all
```

## 🏗️ Build

```sh
# Build untuk production
npm run build

# Preview hasil build
npm run preview
```

## 📁 Struktur Project

```
komikcast/
├── src/                  # Frontend React
│   ├── components/       # Komponen UI
│   ├── Pages/           # Halaman
│   ├── contexts/        # React contexts
│   └── hooks/           # Custom hooks
├── server/              # Backend Express
│   ├── index.js         # API endpoints
│   ├── indexing.js      # Google Indexing API
│   └── db.js            # Database SQLite
└── public/              # Static assets
```

## 🔌 API Endpoints

### Statistics

- `POST /api/track` - Track page view
- `GET /api/stats/overview` - Get statistics overview
- `GET /api/stats/daily` - Get daily views
- `GET /api/stats/popular` - Get popular pages

### Google Indexing

- `POST /api/indexing/submit` - Submit URL for indexing
- `POST /api/indexing/batch` - Submit multiple URLs
- `POST /api/indexing/auto` - Auto-index new chapter

## ⚙️ Konfigurasi

Buat file `server/.env` dengan:

```env
PORT=8062
INDEXING_ADMIN_KEY=your-secret-key
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 👨‍💻 Credits

**Maintainer**: Penjaga Bumi

## 📄 License

All rights reserved © Komikcast
