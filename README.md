# Interwoven – Website

A complete, frontend-only static website for Interwoven (501(c)(3) nonprofit).
No backend, database, or build step – open `index.html` directly, or deploy
the whole folder as-is to GitHub Pages, Netlify, Vercel, etc.

## Pages

- `index.html` – Home (hero, impact counters, Our Threads, podcast, testimonials, newsletter popup)
- `about.html` – Story, Mission, Vision, Executive Board, six Thread detail sections
- `chapters.html` – Interactive map (Leaflet + OpenStreetMap, no API key) + chapter directory
- `calendar.html` – Live embedded Google Calendar with Month/Week/List toggle
- `get-involved.html` – Editorial opportunity list (start a chapter, join the board, speak, podcast guest, sponsor)
- `donate.html` – Emotional/human donate page, links to the real HCB donation page
- `contact.html` – Contact form (mailto fallback, no backend) + FAQ

## Real data already wired in

Pulled directly from the sources in the brief, not invented:

- **Chapters** (`data/chapters.js`) – all 8 chapters from the live "Interwoven
  Chapters" Google Sheet, with public city coordinates added for the map.
  Re-sync by hand if the sheet changes.
- **Calendar** (`calendar.html` / `js/calendar.js`) – the real calendar ID,
  decoded from the `cid=` param in the calendar link, embedded live.
- **Executive Board** (`data/board.js`) – real names, roles, emails, phone
  numbers from the brief.
- **Social links** – real handles pulled from the "Socials" Google Doc
  (@interwoven0 on Instagram/Facebook, @interwoven6 on TikTok,
  @Interwoven-steam on YouTube).
- **All external form/donation links** (Start a Chapter, Speaker, Podcast
  Guest, Donate) point to the real URLs from the brief.

## Known gaps – things that need a real file, not a live fetch

1. **Logo** (`assets/logo-full.png`, `assets/logo-mark.png`) – cropped from a
   screenshot, not the original vector/source file. Legible but soft at small
   sizes. Swap in the real source file when available; same filenames will
   just work.
2. **Headshots** (Mia Nixon for the podcast, Dhatri, Hamsika for the board) –
   these were shared as Google Drive "view" links, which serve a JS-rendered
   page rather than the raw image, so they couldn't be pulled in automatically.
   Clearly labeled placeholders are in their place. Export the real files from
   Drive and drop them in `assets/images/`, then point the relevant `<img>` /
   background at them (see inline comments in `index.html` and `about.html`).
3. **Sanam and Vedasri's headshots** – brief says "coming later"; same
   placeholder pattern applies once available.

## External services this site depends on (need real internet access – they
were blocked in the sandbox this was built in, but will work once deployed)

- **Google Fonts** (Poppins) – loaded via `<link>` in every page's `<head>`.
- **Leaflet + OpenStreetMap** (`chapters.html`) – loaded via CDN
  (`unpkg.com/leaflet`). If the CDN is ever unreachable, the page falls back
  to a clear "Map couldn't load" message rather than a broken map – the
  chapter directory below it always works regardless.
- **Google Calendar embed** (`calendar.html`) – a plain iframe, no key needed.

## Calendar filters – current limitation

The type/chapter filter chips on `calendar.html` are wired up in the UI but
don't yet filter the embedded calendar's contents – Google's free embed
iframe can't be filtered from the outside. Once Interwoven sets up a Google
Calendar API key, swap the iframe for a real fetch against the Calendar API
in `js/calendar.js` (there's a comment marking exactly where) to get true
client-side filtering.

## Editing content

- `data/threads.js` – Our Threads (home cards + About page detail sections, includes both short and long copy per thread)
- `data/testimonials.js` – testimonial carousel
- `data/board.js` – executive board cards
- `data/chapters.js` – chapter map + directory

Each file is a plain, commented JavaScript array – edit and refresh, no build
step.

## Brand

Colors are sampled directly from the real Interwoven logo (not the "dusty
rose / soft plum" palette suggested in one draft of the brief, which didn't
match the actual logo): Cream `#FAF6EA`, Coral `#F17053`, Amber `#E6AC46`,
Teal `#397F7F`, plus a near-black warm ink `#221C24` for text. All defined
once in `css/styles.css` under `:root`.

## The thread system

- `.thread-canvas` – decorative SVG background paths (hero, Our Threads, impact counters)
- `.glow-layer` – a cursor-reactive highlight on the Our Threads background thread (`js/main.js`'s `initThreadGlow`)
- `.btn svg.trace` – the pill-outline that draws in on button hover
- `.page-sweep` – the three-band thread-sweep transition between pages (respects `prefers-reduced-motion`)

## Deployment

Static site – no build step. Push the whole folder to a GitHub repo and
enable GitHub Pages (Settings → Pages → deploy from branch), or drag-and-drop
into Netlify/Vercel.
