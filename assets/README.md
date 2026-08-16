# Assets folder

## Logo
`logo-full.png` / `logo-full-sm.png` – the full lockup (circular braid mark +
"INTERWOVEN" wordmark + "WOVEN TOGETHER THROUGH STEAM" motto), used in every
page's nav and footer. `logo-mark.png` is a tighter crop of just the circular
braid, kept in case a square/icon-only mark is useful later (e.g. a favicon).

These were cropped from a screenshot, not the original source file – legible,
but soft at small sizes and not a true vector. When the real logo file
(SVG/AI/high-res PNG) is available, save it over these same filenames and
every page updates automatically. Per brand guidelines: never stretch,
distort, rotate, or recolor it.

## Headshots – currently placeholders
Three headshots referenced in the brief were shared as Google Drive "view"
links, which serve a JS-rendered viewer page rather than the raw image file,
so they couldn't be fetched automatically:

- Mia Nixon (podcast, referenced in `index.html`)
- Dhatri Daggubati (executive board, referenced in `data/board.js` via `about.html`)
- Hamsika Devineni (executive board, same)

Sanam Srikewal and Vedasri Pacharla's headshots are marked "coming later" in
the brief itself, so they use the same placeholder pattern intentionally.

**To add a real headshot:** export the image from Google Drive, save it in
`assets/images/` (e.g. `assets/images/mia-nixon.jpg`), then either add an
`<img>` inside the relevant `.photo` / `.board-photo` element or set it as a
`background-image` – both already have the gradient + label placeholder as a
fallback so nothing breaks in the meantime.

## Photography (donate page, etc.)
Same placeholder pattern – bracketed captions like `[Photo: chapter workshop
in progress]` mark exactly where a real photo can be dropped in later.
