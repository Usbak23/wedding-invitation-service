# Wedding Invitation Digital — Backend API

Sistem backend untuk undangan pernikahan digital berbasis web. Memungkinkan calon pengantin membuat undangan digital, mengelola tamu, mengumpulkan RSVP, dan melihat statistik undangan.

---

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Auth**: JWT (Passport.js)
- **Validation**: class-validator
- **Documentation**: Swagger UI (JSON-based)
- **Logging**: Winston + Daily Rotate File
- **Security**: Helmet, Rate Limiting (@nestjs/throttler), CORS
- **Container**: Docker + Docker Compose

---

## Arsitektur

```
Controller → Service → Repository → Model (Entity)
```

| Layer | Tanggung Jawab |
|---|---|
| Controller | Handle HTTP request/response |
| Service | Business logic |
| Repository | Data access (query database) |
| Model | TypeORM entity / database schema |

---

## Struktur Folder

```
src/
├── configs/          → konfigurasi app, database, jwt
├── controllers/      → HTTP handler per module
├── services/         → business logic per module
├── repositories/     → query database per module
├── models/           → TypeORM entities
├── routes/           → NestJS module definitions
├── middlewares/      → guard, pipe, filter, logger, strategy
├── validators/       → DTO (Data Transfer Object)
├── helpers/          → response helper, slug generator, decorator
├── interfaces/       → TypeScript interfaces
├── types/            → custom types
├── integrations/     → storage (multer config)
├── utils/            → pagination util
├── uploads/          → file upload storage
└── downloads/        → file download storage

documentation/
├── swagger.json              → base config development
├── swaggerStaging.json       → base config staging
├── swaggerProduction.json    → base config production
└── path/                     → swagger path per module
    ├── auth.json
    ├── invitation.json
    ├── guest.json
    ├── rsvp.json
    ├── gallery.json
    ├── analytics.json
    ├── public.json
    └── admin.json

logs/
├── all/              → semua log harian (YYYYMMDD.log)
└── error/            → error log harian (error-YYYYMMDD.log)
```

---

## Role Sistem

| Role | Akses |
|---|---|
| `user` | Membuat & mengelola undangan milik sendiri |
| `admin` | Akses penuh ke semua data & monitoring |
| `guest` | Akses publik via link undangan (tanpa auth) |

---

## Database Schema

```
users
├── id (uuid, PK)
├── name
├── email (unique, indexed)
├── password (bcrypt)
├── role (user | admin)
└── created_at, updated_at

invitations
├── id (uuid, PK)
├── user_id (FK → users, indexed)
├── slug (unique, indexed)
├── groom_name, bride_name
├── akad_date, akad_location
├── resepsi_date, resepsi_location
├── cover_photo, music_url
├── template
├── status (draft | published, indexed)
├── custom_message
└── created_at, updated_at

guests
├── id (uuid, PK)
├── invitation_id (FK → invitations, indexed)
├── name
├── code (unique, indexed)
├── phone
└── created_at

rsvps
├── id (uuid, PK)
├── guest_id (FK → guests, unique)
├── invitation_id (FK → invitations, indexed)
├── status (hadir | tidak | mungkin, indexed)
├── total_persons
├── message
└── created_at

galleries
├── id (uuid, PK)
├── invitation_id (FK → invitations)
├── photo_url
├── caption
├── order_index
└── created_at

analytics
├── id (uuid, PK)
├── invitation_id (FK → invitations, indexed)
├── event (view | rsvp_open | share, indexed)
├── ip_address
├── user_agent
└── created_at
```

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register user baru |
| POST | `/api/auth/login` | ❌ | Login, return JWT token |
| POST | `/api/auth/logout` | ✅ | Logout user |
| GET | `/api/auth/me` | ✅ | Data user yang sedang login |

### Invitations
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/api/invitations` | ✅ | List undangan milik user (paginated) |
| POST | `/api/invitations` | ✅ | Buat undangan baru |
| GET | `/api/invitations/:id` | ✅ | Detail undangan |
| PUT | `/api/invitations/:id` | ✅ | Update undangan |
| DELETE | `/api/invitations/:id` | ✅ | Hapus undangan |
| POST | `/api/invitations/:id/publish` | ✅ | Publish & generate slug unik |
| GET | `/api/invitations/:id/stats` | ✅ | Statistik RSVP |

### Guests
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/api/invitations/:id/guests` | ✅ | List tamu (paginated) |
| POST | `/api/invitations/:id/guests` | ✅ | Tambah tamu |
| POST | `/api/invitations/:id/guests/bulk` | ✅ | Tambah banyak tamu |
| PUT | `/api/invitations/:id/guests/:id` | ✅ | Update tamu |
| DELETE | `/api/invitations/:id/guests/:id` | ✅ | Hapus tamu |

### RSVP
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/api/rsvp` | ❌ | Submit RSVP dari tamu |
| GET | `/api/rsvp/invitation/:id` | ✅ | List RSVP per undangan (paginated) |

### Gallery
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/api/invitations/:id/gallery` | ✅ | List foto |
| POST | `/api/invitations/:id/gallery` | ✅ | Upload foto (multipart/form-data) |
| DELETE | `/api/invitations/:id/gallery/:id` | ✅ | Hapus foto |

### Analytics
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/api/analytics/track/:invitationId` | ❌ | Track event (view/rsvp_open/share) |
| GET | `/api/analytics/summary/:invitationId` | ✅ | Ringkasan analytics |

### Public
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/api/public/:slug` | ❌ | Halaman publik undangan |
| GET | `/api/public/:slug/guests/:code` | ❌ | Data tamu personal |

### Admin
| Method | Endpoint | Auth | Role |
|---|---|---|---|
| GET | `/api/admin/dashboard` | ✅ | admin |
| GET | `/api/admin/users` | ✅ | admin |
| DELETE | `/api/admin/users/:id` | ✅ | admin |
| GET | `/api/admin/invitations` | ✅ | admin |

---

## Pagination

Semua list endpoint mendukung query parameter:

```
?page=1&limit=10
```

Response format:
```json
{
  "success": true,
  "data": {
    "data": [...],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

## Response Format

### Success
```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid UUID: \"abc\"",
  "path": "/api/invitations/abc",
  "timestamp": "2026-04-13T09:00:00.000Z"
}
```

---

## Security

| Fitur | Keterangan |
|---|---|
| JWT Auth | Bearer token, expires 7d |
| Bcrypt | Password hashing salt 10 |
| Helmet | HTTP security headers |
| Rate Limiting | 60 req/menit global, 5 req/menit untuk login & register |
| CORS | Whitelist origin dari `ALLOWED_ORIGINS` env |
| Role Guard | Endpoint admin hanya bisa diakses role `admin` |
| UUID Validation | Semua `:id` param divalidasi sebelum ke database |
| Input Validation | `class-validator` whitelist + forbidNonWhitelisted |

---

## Environment Variables

Salin `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

| Variable | Keterangan | Default |
|---|---|---|
| `APP_PORT` | Port aplikasi | `3000` |
| `APP_ENV` | Environment (development/staging/production) | `development` |
| `SWAGGER_ENV` | Swagger base config (development/staging/production) | `development` |
| `DB_HOST` | Host PostgreSQL | `localhost` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_USERNAME` | Username PostgreSQL | `postgres` |
| `DB_PASSWORD` | Password PostgreSQL | - |
| `DB_NAME` | Nama database | `wedding_invitation` |
| `JWT_SECRET` | Secret key JWT | - |
| `JWT_EXPIRES_IN` | Expiry JWT | `7d` |
| `ALLOWED_ORIGINS` | CORS whitelist (comma separated) | `http://localhost:5173` |

### Behavior per Environment

| `APP_ENV` | `synchronize` | Keterangan |
|---|---|---|
| `development` | ✅ | Auto create/alter table |
| `staging` | ✅ | Auto create/alter table |
| `production` | ❌ | Harus jalankan migration manual |

---

## Setup & Menjalankan

### Tanpa Docker

```bash
# 1. Install dependencies
npm install

# 2. Copy env
cp .env.example .env

# 3. Jalankan (database akan auto-created jika belum ada)
npm run start:dev
```

### Dengan Docker

```bash
# Development (hot reload)
npm run docker:dev

# Production
npm run docker:prod

# Stop
npm run docker:down
```

---

## API Documentation (Swagger)

Setelah app running, buka:

```
http://localhost:3000/api/docs
```

Untuk autentikasi di Swagger:
1. Login via `POST /api/auth/login`
2. Copy `access_token` dari response
3. Klik tombol **Authorize** di Swagger UI
4. Masukkan: `Bearer <access_token>`

### Multi-environment Swagger

Set `SWAGGER_ENV` di `.env`:

| `SWAGGER_ENV` | Host |
|---|---|
| `development` | `localhost:3000` |
| `staging` | `staging.wedding-invitation.com` |
| `production` | `wedding-invitation.com` |

---

## Logging

Log tersimpan di folder `logs/`:

```
logs/
├── all/20260413.log          → semua request & info log
└── error/error-20260413.log  → error log saja
```

Format log:
```
2026-04-13 09:00:00 INFO [HTTP] GET /api/invitations 200 - 5ms - ::1
2026-04-13 09:00:01 ERROR [ExceptionFilter] POST /api/auth/login 401 - Invalid credentials
```

Log dirotasi otomatis setiap hari dan disimpan selama **30 hari**.

---

## File Upload

- Endpoint: `POST /api/invitations/:id/gallery`
- Format: `multipart/form-data`, field name: `photo`
- Tipe yang diizinkan: `.jpg`, `.jpeg`, `.png`, `.webp`
- Ukuran maksimal: **5MB**
- File tersimpan di: `src/uploads/`
- Akses via: `GET /uploads/<filename>`

---

## Scripts

```bash
npm run start:dev      # development dengan hot reload
npm run start:prod     # production (dari dist/)
npm run build          # build TypeScript ke dist/
npm run lint           # ESLint
npm run format         # Prettier
npm run docker:dev     # Docker development
npm run docker:prod    # Docker production
npm run docker:down    # Stop Docker
```
