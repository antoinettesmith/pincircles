# PinCircles

A full-stack, interest-based collaborative image-sharing platform that combines visual discovery with structured community discussion. Users join "Circles" (interest communities), share image Pins, engage in threaded discussions, and surface trending content via engagement-weighted ranking.

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Server-side rendering
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** JWT, bcrypt, role-based (admin, member)
- **Images:** Cloudinary (with placeholder fallback)

## Features
The platform models how engagement signals influence feed ranking, personalization, and community health in content-driven systems.

### Core MVP
- **Authentication:** Register, login, protected routes, session persistence
- **Circles:** Create, join/leave, view all and joined circles, restrict posting to members
- **Pins:** Upload image + title + description, associate with Circle, feed with sorting
- **Engagement:** Upvote (one per user), threaded comments, profanity filter
- **Ranking:** New, Top (votes), Most Commented, Trending formula

### Feature 1: Circle Recommendation Engine
- Suggests Circles based on categories joined, pins engaged with, overlapping membership
- `GET /api/circles/recommendations` with explanation field

### Feature 2: Engagement Analytics Dashboard
- Creator-facing analytics dashboard with membership growth, active user tracking, engagement ratios, and content performance insights.
- Top performing pins, 7-day trend charts, Circle health score
- `GET /api/circles/:id/analytics`

## System Design Considerations
- Indexed foreign keys to prevent N+1 queries
- Engagement aggregation handled in service layer
- Pagination to prevent large feed queries
- Unique constraint on (userId, pinId) for votes
- Trending score computed dynamically to avoid stale rankings
- Role-based access control for Circle analytics
- Cloudinary abstraction layer for future storage migration

## Product Metrics Modeled
PinCircles simulates engagement loops commonly optimized in community-driven platforms.
Key metrics:
- Circle join rate
- Weekly active members
- Engagement rate per Circle
- Comment-to-post ratio
- Trending velocity score
- Recommendation click-through rate

These metrics illustrate how engagement systems influence retention and personalization quality.

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- (Optional) Cloudinary account for image uploads

### Installation

1. **Clone and install dependencies**
   ```bash
   cd "Pinterest PinCircles"
   npm install
   ```

2. **Configure environment** (required for build and runtime)
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Strong random string for JWT signing
   - Cloudinary credentials (optional)

3. **Initialize database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials (after seed)
- **Email:** alice@example.com, bob@example.com, carol@example.com
- **Password:** password123

## API Reference

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user (protected)

### Circles
- `GET /api/circles` - List (query: categoryId, search, page, limit)
- `POST /api/circles` - Create (protected)
- `GET /api/circles/[param]` - Get by slug or id
- `GET /api/circles/joined` - User's circles (protected)
- `GET /api/circles/recommendations` - Personalized suggestions (protected)
- `POST /api/circles/[param]/join` - Join (protected)
- `POST /api/circles/[param]/leave` - Leave (protected)
- `GET /api/circles/[param]/analytics` - Owner analytics (protected)

### Pins
- `GET /api/pins` - Feed (query: circleId, sort, page, limit)
- `POST /api/pins` - Create (protected, must be member)
- `GET /api/pins/[id]` - Get with comments
- `POST /api/pins/[id]/vote` - Upvote (protected)
- `DELETE /api/pins/[id]/vote` - Remove vote (protected)
- `GET /api/pins/[id]/comments` - List comments
- `POST /api/pins/[id]/comments` - Add comment (protected)
 
### Upload
- `POST /api/upload` - Image upload (protected)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── circles/           # Circle pages
│   ├── pins/              # Pin pages
│   ├── feed/              # Feed page
│   └── ...
├── components/            # React components
├── lib/                   # Utilities (auth, prisma, cloudinary)
└── services/              # Business logic layer
prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Seed script
```

## Trending Formula

```
trendingScore = (votes * 2 + comments * 1.5) / (hours_since_post + 2)
```

## License

MIT
