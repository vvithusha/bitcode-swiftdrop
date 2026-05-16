# SwiftDrop

High-concurrency flash sale platform with Redis-backed atomic stock handling, Socket.IO live stock updates, and Nginx load balancing.

## Architecture
- Frontend: React + Vite
- API: Express (2 instances)
- Data: PostgreSQL (Prisma)
- Concurrency control: Redis Lua atomic decrement + rate limiting
- Traffic: Nginx reverse proxy + upstream balancing

## Prerequisites
- Docker + Docker Compose
- Node.js 18+ (only needed for local non-Docker runs)

## Environment Variables

### Root `.env` (if used outside compose)
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`
- `BCRYPT_SALT_ROUNDS`
- `CORS_ORIGIN`
- `VITE_API_URL`
- `VITE_SOCKET_URL`

### Frontend `.env`
- `VITE_API_URL` (default: `http://localhost/api`)
- `VITE_SOCKET_URL` (default: `http://localhost`)

## Run With Docker (Recommended)

```bash
docker-compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Nginx: `http://localhost`
- API via Nginx: `http://localhost/api`

## Database Migration + Seed

Run after containers are up:

```bash
docker exec swiftdrop-backend npx prisma migrate deploy
docker exec swiftdrop-backend node seed.js
```

Seed creates:
- 1 Admin account
- Sample locked/live events with items

Admin login:
- Email: `admin@swiftdrop.com`
- Password: `Admin@123`

## Local Run Without Docker (Optional)

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
node seed.js
npm run dev
```
 
### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Key Functional Coverage
- Auth: register/login/logout/change password
- Role-based admin authorization
- Admin event CRUD/status control and user deactivation
- Customer event browsing with countdown
- Atomic purchase reserve/confirm/cancel flow
- Duplicate purchase prevention per user-event-item
- Real-time stock updates
- Auto event transition to `SOLD_OUT` when all item stock is exhausted
- Order history and profile update

## Submission Evidence Files
- Architecture diagram: `architecture-diagram.png`
- Edge cases: `docs/edge-cases.md`
- Load/stress evidence template: `docs/load-test-evidence.md`

## Troubleshooting
- If API returns auth errors after logout/login, clear site cookies and login again.
- If Prisma connection fails, verify PostgreSQL container is healthy and `DATABASE_URL` matches compose values.
- If live stock does not update, verify Redis container is running and Socket.IO endpoint is reachable via Nginx.
