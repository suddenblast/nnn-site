# Northwestern News Network – Astro Site

This repository contains the **Astro-based frontend** for the Northwestern News Network (NNN) website. It is designed as a modern, fast, newsroom-style site that pulls content from **Strapi CMS** and renders it using Astro components.

The project prioritizes:
- Speed and SEO (Astro static + partial hydration)
- A clean, professional newsroom look
- Easy integration with Strapi for stories, staff, shows, and media
- Flexibility for future features (video, weather, special coverage)

---

## Tech Stack

- **Astro** – Static site framework
- **TypeScript** – Type safety
- **Strapi** – Headless CMS (runs separately)
- **Fetch / Axios** – API requests to Strapi
- **CSS / Astro components** – Styling and layout

---

## Project Structure

```
/
├── public/
│   └── assets/           # Logos, images, static files
│
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── StoryCard.astro
│   │   ├── HeroStory.astro
│   │   ├── WeatherCard.astro
│   │   └── ...
│   │
│   ├── layouts/          # Page layouts
│   │   └── BaseLayout.astro
│   │
│   ├── pages/            # Routes (file-based routing)
│   │   ├── index.astro   # Homepage
│   │   ├── stories/
│   │   │   └── [slug].astro  # Individual story pages
│   │   └── ...
│   │
│   ├── lib/
│   │   └── strapi.ts     # Strapi API helper
│   │
│   └── styles/           # Global styles (if applicable)
│
├── astro.config.mjs
├── package.json
└── README.md
```

---

## Requirements

Before running this project, you need:

- **Node.js** 18+
- **npm** or **pnpm**
- A running **Strapi backend** (local or hosted)

---

## Environment Variables

Create a `.env` file in the root of the project:

```
PUBLIC_STRAPI_URL=http://localhost:1337
```

If Strapi is hosted, replace the URL accordingly.

---

## Installation

Clone the repo and install dependencies:

```
npm install
```

---

## Running the Site

### Development

```
npm run dev
```

Astro will start a dev server (usually at `http://localhost:4321`).

### Production Build

```
npm run build
npm run preview
```

---

## Strapi Integration

All content is fetched from Strapi using the helper in:

```
src/lib/strapi.ts
```

Common patterns:

- **Stories list** (homepage, story grids)
- **Story by slug** (`/stories/[slug].astro`)
- **Populated relations** (staff, shows, images, video URLs)

Example query pattern:

- Sorting: `sort=publishedAt:desc`
- Filtering: `filters[slug][$eq]=example-slug`
- Population: `populate=staff,coverImage,show`

---

## Pages

### Homepage (`index.astro`)

- Hero story
- Latest stories grid
- Weather card (Evanston, IL)
- Designed to feel like a professional broadcast newsroom homepage

### Story Pages (`stories/[slug].astro`)

- Headline, dek, and publish date
- Video embed (if present)
- Article body
- Byline with staff role (e.g. `By Jonas Blum • Reporter`)
- Responsive layout for mobile and desktop

---

## Images & Media

- Images are served from Strapi media
- Supports thumbnails and cover images
- Video embeds supported via URL fields (YouTube, etc.)

---

## Styling & Responsiveness

- Fully responsive
- Horizontal logo on desktop, stacked logo on mobile
- Designed to scale cleanly across phones, tablets, and desktops

---

## Common Issues

### Stories returning 404
- Ensure the story is **published** in Strapi
- Confirm the `slug` field matches the URL

### Strapi 400 errors
- Double-check `populate` fields match Strapi model names
- Ensure required relations exist (e.g. `staff`, not `staffs`)

### CMS not loading
- Confirm `PUBLIC_STRAPI_URL` is set correctly
- Make sure Strapi is running

---

## Deployment Notes

- Astro can be deployed to **Netlify**, **Vercel**, or **Render**
- Strapi must be deployed separately
- Make sure environment variables are set in the hosting platform

---

## Future Improvements

- Search and filtering
- Section pages (News, Sports, Weather)
- Live video support
- Special coverage templates
- Admin preview mode

---

## Maintainers

Northwestern News Network

Built and maintained by the NNN digital team.

