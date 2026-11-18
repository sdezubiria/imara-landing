# Imara Ciudad Campestre · landing

New version of the Imara landing (today a single image on Cargo, `5811632.cargo.site`), built to match the proposal *Cotización Landing Imara* (Etapa 1 structure + Etapa 2 form and analytics). The look follows the Cargo prototype: the landscape photo, Prata headlines in the logo green `#062D2A`, DM Sans body, flat surfaces and square corners. `AUDIT.md` lists what changed from the first build and why.

Preview: https://sdezubiria.github.io/imara-landing/ (redeploys on every push to `main`).

Plain HTML, CSS and JS. No build step.

```bash
python3 -m http.server 4100   # then open http://localhost:4100
```

## Sections

| Anchor | Section | Notes |
|---|---|---|
| `#inicio` | Hero | The Cargo text (headline, rule, "Naturaleza y ciudad en equilibrio.", Ibagué, Tolima) in white over the street render, marked "* Render ilustrativo". |
| `#proyecto` | El proyecto | 160 ha, mixed use, parque central, 15 minutes walking. No stat strip. |
| `#origen` | Origen | "IMARA nace del territorio": the meaning of Ima (Pijao word for Madre Tierra) and the four rings (Equilibrio, Calidad/Belleza, Fortalecer relaciones, Nueva centralidad), drawn as inline SVG. |
| `#vision` | Visión | "Naturaleza y ciudad en equilibrio": three paragraphs and the four pillars (Paisaje, Espacio público, Vida cotidiana, Conexiones) with the client's icons. |
| `#video` | Video | Full width, fills the screen under the header on desktop; 16:9 on phones and portrait screens. |
| `#ubicacion` | Ubicación | Interactive Leaflet map: street view (default) and satellite, markers for Imara and the Club Campestre, road labels. |
| `#proyectos` | Proyectos actuales | Ferrat Gran Reserva and Foresti, one row each with render, logo, short text and a link that preselects the interest in the form. |
| `#avance` | Cronograma | Placeholder steps, no status. |
| `#registro` | Registro | Aerial render on the left (on top on phones), lead form beside it on a plain white background. |

## Files

| File | What it is |
|---|---|
| `index.html` | The page. |
| `styles.css` | All styles. Tokens at the top: `--ink` (logo green), `--sky`, `--wash`, `--text`, `--muted`. No accent color. |
| `main.js` | Header and menu, scroll reveal, location map (loads Leaflet when the section gets close), video and CTA tracking, lead form. |
| `config.js` | **GA4 ID, Clarity ID and form endpoint.** Empty values switch each one off. |
| `analytics.js` | Loads GA4/Clarity from `config.js`; `imaraTrack(name, params)` sends events. |
| `privacidad.html` | Habeas Data policy (draft, client must complete and approve). |
| `apps-script/Code.gs` | Google Apps Script that receives the form and writes rows into a Google Sheet. |
| `llms.txt` | Plain-text summary of the project for language models (ChatGPT, Gemini, Perplexity). |
| `robots.txt`, `sitemap.xml` | Ready for imara.com.co: open to every crawler, sitemap with the two pages. On GitHub Pages they sit in a subfolder, so crawlers ignore them until the domain moves. |
| `AUDIT.md` | What read as AI-generated in the first build, and the fix for each item. |
| `assets/` | Images, logos and video. |

After changing `styles.css` or `main.js`, bump the `?v=` number on its link in `index.html` (and in `privacidad.html` for the CSS) so browsers drop the cached copy.

## Placeholders still to fill

Search the HTML for `pending`, `note` and `por confirmar`.

- **Video** `assets/video/imara-video.mp4` is render v13 at 720p. Replace the file with the final cut (keep it under ~50 MB; GitHub rejects files over 100 MB), regenerate `assets/img/video-poster.jpg` and delete the "Versión preliminar del video" note (`.video-note`) in `#video`. Note: the current cut ends with a "[Contacto: teléfono · web · redes]" placeholder card inside the video itself.
- **Cronograma** (`#avance`): the five steps and all dates are examples. Get the real ones from Imara.
- **Renders**: hero and registro use renders from imara.com.co, marked "* Render ilustrativo". Swap the files when the final renders arrive and keep the note if they stay illustrative.
- **Contact** in the footer: phone and email.
- **Habeas Data**: company name, NIT and contact in `privacidad.html`.

## Scroll reveal

Elements with `data-reveal` fade up as they enter the viewport (with a short stagger between siblings). `main.js` adds `.has-reveal` to `<html>` only when IntersectionObserver exists and the visitor has not asked for reduced motion, so without JS, or with reduced motion, everything shows at once.

## Map

- Library: Leaflet 1.9.4 from cdnjs (with SRI), loaded only when `#ubicacion` is about 600 px from the viewport.
- Tiles, no API key: Esri World Imagery (satellite) and Esri World Street Map (street view). Both are credited in the map's attribution line. Carto basemaps were tried first and now return an "API key required" watermark.
- Club Campestre de Ibagué: `4.3999, -75.16258`, geocoded with Nominatim (OpenStreetMap way 30927829, the golf course).
- Imara: one marker at `4.3962, -75.1552`, east of the golf course between Avenida Mirolindo, Calle 145 (the road OpenStreetMap names "Variante Norte de Ibagué") and the Variante. The map does not draw the project boundary. When Imara confirms one, add it as a polygon in `buildMap()` in `main.js`.
- On touch screens one finger scrolls the page and two fingers move the map, so the map does not trap the scroll. The mouse wheel does not zoom; use the + and − buttons.

## Form → Google Sheets

1. Create a Sheet, open Extensions → Apps Script, paste `apps-script/Code.gs`.
2. Deploy → New deployment → Web app, execute as *Me*, access *Anyone*.
3. Put the `/exec` URL in `FORM_ENDPOINT` in `config.js` and push.

Rows get: date, name, email, phone, interest, consent, page, referrer and UTM tags. Set `NOTIFY_EMAIL` in the script to get an email per lead. With `FORM_ENDPOINT` empty the form runs in demo mode: it validates, shows the thank-you message and sends nothing.

## Analytics

Per the quote, GA4, Clarity, the conversion event and the Looker Studio dashboard are switched on in the real site, after it moves to imara.com.co. The code is ready; until then the page runs with analytics off and the form in demo mode.


- `GA4_ID` → GA4 loads. Events: `generate_lead` (mark it as a key event/conversion in GA4), `form_start`, `cta_click`, `video_start`, `video_progress`, `map_layer`, `map_interact`.
- `CLARITY_ID` → Clarity loads and gets the same event names.

## Assets and sources

| Asset | Source |
|---|---|
| `assets/img/render-calle.jpg`, `render-calle-mobile.jpg` | Street render from the live site imara.com.co (Cargo file `Desktop---15.png`, https://freight.cargo.site/t/original/i/H3138088706648026641128866107636/Desktop---15.png), resized to 2400 px; the phone version is a portrait crop of the bike lane. |
| `assets/img/render-aereo.jpg` | Aerial render from the live site imara.com.co (Cargo file `m3.png`, https://freight.cargo.site/t/original/i/T3234042045776196390262566211828/m3.png), cropped above the "160ha" text block. |
| `assets/img/ferrat-gran-reserva.jpg` | Aerial render from the developer's project page: https://proyectamosyedificamos.com/proyecto/venta/26/ferrat-gran-reserva (original `https://proyectamosyedificamos.com/storage/pictures/Meeb9sEe13ATVkhLcXj8.jpg`), resized to 1600 px. |
| `assets/img/foresti.jpg` | House render from the developer's project page: https://proyectamosyedificamos.com/proyecto/venta/25/foresti-casas-campestres (original `https://proyectamosyedificamos.com/storage/pictures/tvtiWjp8ACc0JSSU2GOy.jpg`), cropped to remove the disclaimer line. The page credits the developer and says the images are illustrative. |
| `assets/img/video-poster.jpg` | Frame at 28.4 s of render v13 (drone shot with the IMARA logo) |
| `assets/icons/*.png` | The four Visión pillar icons, cut from the client's "Visión del proyecto" slide with a transparent background |
| `assets/video/imara-video.mp4` | Render v13, 720p (preliminary) |
| `assets/logo/*` | Imara logo SVGs and project logos (white PNGs, shown in green with a CSS mask) from `02_VideoTool/public` |
| `assets/img/og-image.jpg` | The current Cargo hero image |

Removed in the redesign (recoverable from git history): the nine `mapa-*.jpg` crops, `naturaleza.webp`, `collage.jpg`, `google-earth.jpg`, `hero-poster.jpg`, `assets/video/hero-drone.mp4`, and `hero.jpg` / `hero-mobile.jpg` (the Cargo landscape with its text removed, used until the renders replaced it).

## SEO and LLMO

- Title (56 characters) and description (160) name Imara, the Club Campestre and Ibagué. One H1 (with the project name and city for crawlers), one H2 per section, H3 for pillars, projects and steps.
- JSON-LD in `index.html`: WebSite, Organization, Place (address, coordinates, amenities, Ferrat Gran Reserva and Foresti) and WebPage. No contact point yet: add phone and email when Imara confirms them.
- Every fact on the page is in the HTML without JavaScript; the scroll animation only fades elements that are already there.
- Photos in WebP with JPG fallback, smaller versions for phones (`srcset`), lazy loading below the hero, Leaflet loaded only near the map.
- The full report is in Notion: "Informe SEO y LLMO · Imara Ciudad Campestre". Its summary follows the quote ("Cotización Landing Imara") item by item, with a short diagnosis of the current imara.com.co.

## Going live

The page carries `noindex` while it lives on GitHub Pages. When it moves to imara.com.co, remove the robots meta in `index.html` and `privacidad.html`, check the `canonical` and `og:url`, and point `og:image` to the final domain.
