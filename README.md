# PinCircles

PinCircles is a product concept for visual communities: a place where people save inspiration like Pinterest, but also debate, explain, and build taste together like Reddit.

This project was built as a portfolio piece for a Pinterest Software Engineering apprenticeship application. The goal was not just to ship another gallery app, but to explore what happens when visual discovery and community conversation are treated as one product system.

## Product Thesis

Pinterest is exceptional at inspiration. Reddit is exceptional at discussion. PinCircles explores the space in between:

- visual posts still need context
- saves are more useful when people explain why something is worth keeping
- communities form faster when shared taste has a place to talk

In PinCircles, users discover images through a feed, join niche circles, open individual pins, and participate in threaded conversations around style, spaces, food, careers, and identity-driven interests.

## What Makes The Concept Interesting

- **Visual-first communities:** each circle is built around a specific taste lane, not just a generic category.
- **Discussion attached to inspiration:** comments are part of the product, not an afterthought.
- **Community discovery as a product loop:** people find a post, enter a circle, then stay for the conversation.
- **Product realism over toy screens:** the demo focuses on believable content density, circle identity, and social patterns.

## Demo Highlights

- Curated feed with real local image assets and topic-matched copy
- Circle discovery page with distinct community identities
- Circle detail pages with long-form threaded discussion
- Pin detail pages with comments, voting, and conversation
- Multiple sort lenses: `New`, `Top`, `Commented`, `Trending`
- Local demo content layer for stable presentation without fragile seed/image dependencies

## Tech Stack

- **Frontend:** Next.js App Router, React, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT-based auth
- **Images:** local demo assets plus app image abstractions

## Engineering Focus

This project intentionally balances product thinking and implementation detail.

- **Layered architecture:** UI, demo content, services, and data access are separated cleanly.
- **Threaded interaction patterns:** both pins and circles support nested replies and realistic conversation structure.
- **Stable presentation data:** a curated demo content layer powers the apprenticeship-facing experience so the app remains coherent even without depending on external image APIs.
- **Extensible ranking model:** feed states model recency, popularity, and discussion density.
- **Analytics hooks:** the codebase includes creator/circle analytics paths to show thinking beyond the MVP feed.

## Why I Built It This Way

I wanted the project to show more than CRUD ability. PinCircles is meant to demonstrate:

- product sense
- frontend craft
- data modeling for social systems
- full-stack implementation skills
- the ability to shape a concept around a real company’s strengths

The project direction became: “What would a Pinterest-adjacent experience look like if conversation were first-class?”

## Current Product Areas

### Feed

The feed is designed to feel editorial and social at the same time. It mixes lifestyle, home, food, travel, careers, and design content while keeping each card visually specific and discussion-ready.

### Circles

Circles act like sub-communities with their own tone, identity, and thread culture. The current demo includes communities like:

- UI Design
- Style Edit
- Cozy Homes
- Travel Photos
- Foodie
- Shows To Watch
- Job Hunting 2026
- Social Media Marketing Careers
- Budgeting
- Mood Boarding
- Remote Careers
- Investing

### Pin Details

Opening a pin is meant to feel like opening a save-worthy post that already has context around it: votes, comments, authorship, and related community participation.

## Running The Project

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL for the full data-backed app flows

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
```

Configure the values you need in `.env`, including:

- `DATABASE_URL`
- `JWT_SECRET`
- image/cloud storage credentials if you want full upload flows

### Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### Start Development

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Demo Notes

The reviewer-facing version of the app is intentionally curated. Feed pins, circle covers, and long-form conversations are driven by local demo content so the project reads like a cohesive product rather than a random seed dump.

That means the current experience is optimized to communicate:

- product direction
- UI quality
- community mechanics
- content relevance

## API Surface

The codebase also includes routes for a fuller production-style app model:

- auth
- circles
- pins
- comments
- voting
- circle recommendations
- circle analytics

## Future Directions

If I kept pushing PinCircles, the next areas I would explore are:

- stronger creator tools and circle moderation
- better recommendation quality from engagement signals
- richer pin-to-pin discovery
- “why people saved this” explanations
- better onboarding into circles based on taste and intent

## License

MIT
