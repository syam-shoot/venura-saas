<p align="center">
  <img src="public/venura-logo.svg" alt="Venura Logo" width="240">
</p>

<p align="center">
  <strong>Multi-Tenant SaaS Platform untuk Booking Lapangan Olahraga</strong><br>
  <em>Daftarkan venue, kelola jadwal & tarif, terima booking online — dalam 5 menit.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-13-red?style=flat-square" alt="Laravel">
  <img src="https://img.shields.io/badge/React-19-blue?style=flat-square" alt="React">
  <img src="https://img.shields.io/badge/Inertia.js-2-purple?style=flat-square" alt="Inertia">
  <img src="https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square" alt="Tailwind">
  <img src="https://img.shields.io/badge/MySQL-9-orange?style=flat-square" alt="MySQL">
  <img src="https://img.shields.io/badge/Multi--Tenant-SaaS-10b981?style=flat-square" alt="SaaS">
</p>

---

## 🏗️ Arsitektur

**Shared Database Multi-Tenancy** — semua venue dalam 1 database, diisolasi dengan `tenant_id`. Setiap venue owner mendapat:
- Halaman admin sendiri: `venura.app/{slug}/admin`
- Halaman booking publik: `venura.app/{slug}`
- FIDS Monitor real-time: `venura.app/{slug}/monitor`

---

## ✨ Fitur

### 🌐 Platform (SaaS)
- Landing page marketing dengan pricing
- Halaman Explore — customer cari venue berdasarkan kota
- Multi-tenant isolation (data venue terisolasi)
- Super Admin dashboard (kelola semua venue)
- Subscription plan: Free / Starter / Pro / Enterprise

### 🏟️ Venue Owner (Tenant Admin)
- Onboarding wizard (nama, alamat, kota, telepon)
- Dashboard statistik (booking, lapangan, pending)
- Kelola Lapangan — CRUD dengan kategori olahraga
- Atur Tarif Per Jam — weekday/weekend, auto-generate dari jam buka/tutup
- Kelola Booking — terima/tolak/batalkan, verifikasi pembayaran
- Kelola Pelanggan — lihat customer yang pernah booking
- FIDS Monitor — tampilan TV lobby real-time
- Jam buka/tutup berbeda weekday vs weekend
- Support overnight hours (misal billiard 10:00-02:00)

### 👤 Customer
- Register + verifikasi email
- Explore venue (search, filter kota)
- Booking dengan pilih durasi (1-3 jam)
- Harga dinamis per slot jam (weekday/weekend)
- 5 metode pembayaran: Transfer Bank, E-Wallet, QRIS, Cash, DP
- Riwayat booking + konfirmasi pembayaran
- Slot otomatis disabled jika sudah lewat jam

### 📺 FIDS Monitor
- Tampilan jadwal real-time gaya papan informasi bandara
- Auto-update setiap 10 detik
- Status: Pending → Menunggu → Bersiap (10 menit sebelum) → Bermain → Selesai
- Nama penyewa di-mask untuk privasi

### 🔐 Security
- Role-based access: super_admin, tenant_admin, customer
- Tenant isolation middleware
- Rate limiting pada API & booking
- CSRF protection
- Email verification (Resend)
- Max 5 pending booking per user

### 🌗 UI/UX
- Dark mode / Light mode
- Responsive (mobile hamburger menu)
- Toast notifications
- Font Inter
- shadcn/ui components

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8+

### Installation

```bash
git clone https://github.com/syam-shoot/venura-saas.git
cd venura-saas

composer install
npm install

cp .env.example .env
php artisan key:generate

# Setup database
mysql -u root -e "CREATE DATABASE venura_saas"
php artisan migrate --seed

php artisan storage:link
npm run build
php artisan serve
```

---

## 🔑 Demo Login

| Role | Email | Password | Akses |
|------|-------|----------|-------|
| Super Admin | super@venura.app | password | `/super-admin` |
| Venue Owner | budi@greenfutsal.com | password | `/green-futsal/admin` |
| Venue Owner | rina@rajawalibadminton.com | password | `/rajawali-badminton/admin` |
| Customer | customer@demo.com | password | `/explore` → pilih venue |

---

## 📂 Struktur URL

```
/                          Landing page (marketing)
/login                     Login
/register                  Register
/explore                   Cari venue (customer)
/onboarding                Setup venue baru (owner)
/super-admin               Super admin dashboard

/{slug}                    Public venue — booking page
/{slug}/monitor            FIDS Monitor (TV lobby)
/{slug}/admin              Tenant admin dashboard
/{slug}/admin/bookings     Kelola booking
/{slug}/admin/courts       Kelola lapangan
/{slug}/admin/tarif        Atur tarif per jam
/{slug}/admin/users        Kelola pelanggan
```

---

## 🏷️ Kategori Lapangan

Bulu Tangkis • Futsal • Mini Soccer • Padel • Tenis Lapangan • Bola Basket • Bola Voli • Billiard

---

## 💰 Model Bisnis (Pricing)

| Plan | Harga/bulan | Fitur |
|------|-------------|-------|
| Free | Rp 0 | 1 lapangan, 50 booking/bulan |
| Starter | Rp 99.000 | 5 lapangan, unlimited booking |
| Pro | Rp 299.000 | Unlimited + custom branding |
| Enterprise | Rp 999.000 | White-label + API + priority support |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 13 |
| Frontend | React 19 + TypeScript |
| Routing | Inertia.js 2 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | MySQL 9 (shared multi-tenant) |
| Email | Resend |
| Icons | Lucide React |
| Build | Vite 6 |

---

## 📋 Roadmap

- [x] Multi-tenant architecture
- [x] Venue onboarding + city identification
- [x] Dynamic pricing (weekday/weekend per hour)
- [x] FIDS real-time monitor
- [x] Customer explore page
- [x] Weekend/weekday separate hours
- [x] Overnight hours support
- [ ] Venue profile (deskripsi, aturan, fasilitas, foto)
- [ ] Payment gateway integration (Midtrans/Xendit)
- [ ] Auto-billing subscription
- [ ] Custom domain per venue
- [ ] Mobile app (PWA)
- [ ] Export laporan PDF/Excel
- [ ] Notifikasi email booking

---

## 📄 License

MIT License — free to use and modify.

---

<p align="center">
  <strong>Venura</strong> — Venue & Arena Booking Platform<br>
  <em>Built with ❤️ for Indonesian sports community</em>
</p>
