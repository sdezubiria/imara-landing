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
| `#inicio` | Hero | The Cargo page as HTML: headline, rule, "Naturaleza y ciudad en equilibrio.", Ibagué, Tolima. Desktop keeps the Cargo 1440 × 1024 frame. |
| `#proyecto` | El proyecto | 160 ha, mixed use, parque central, 15 minutes walking. No stat strip. |
| `#video` | Video | Preliminary cut, flat 16:9 frame. |
| `#ubicacion` | Ubicación | Interactive Leaflet map: satellite (default) and street view, Club Campestre marker, approximate project outline, road labels. |
| `#proyectos` | Proyectos actuales | Ferrat Gran Reserva and Foresti, one row each with render, logo, short text and a link that preselects the interest in the form. |
| `#avance` | Cronograma | Placeholder steps, no status. |
| `#registro` | Registro | Lead form on the sky, landscape at the bottom. |

## Files

| File | What it is |
|---|---|
| `index.html` | The page. |
| `styles.css` | All styles. Tokens at the top: `--ink` (logo green), `--sky`, `--wash`, `--text`, `--muted`. No accent color. |
| `main.js` | Header and menu, location map (loads Leaflet when the section gets close), video and CTA tracking, lead form. |
| `config.js` | **GA4 ID, Clarity ID and form endpoint.** Empty values switch each one off. |
| `analytics.js` | Loads GA4/Clarity from `config.js`; `imaraTrack(name, params)` sends events. |
| `privacidad.html` | Habeas Data policy (draft, client must complete and approve). |
| `apps-script/Code.gs` | Google Apps Script that receives the form and writes rows into a Google Sheet. |
| `AUDIT.md` | What read as AI-generated in the first build, and the fix for each item. |
| `assets/` | Images, logos and video. |

After changing `styles.css` or `main.js`, bump the `?v=` number on its link in `index.html` (and in `privacidad.html` for the CSS) so browsers drop the cached copy.

## Placeholders still to fill

Search the HTML for `pending`, `note` and `por confirmar`.

- **Video** `assets/video/imara-video.mp4` is render v13 at 720p. Replace the file with the final cut (keep it under ~50 MB; GitHub rejects files over 100 MB), regenerate `assets/img/video-poster.jpg` and delete the "Versión preliminar" note under the video.
- **Cronograma** (`#avance`): the five steps and all dates are examples. Get the real ones from Imara.
- **Contact** in the footer: phone and email.
- **Habeas Data**: company name, NIT and contact in `privacidad.html`.
- **Project outline on the map**: see "Map" below.

## Map

- Library: Leaflet 1.9.4 from cdnjs (with SRI), loaded only when `#ubicacion` is about 600 px from the viewport.
- Tiles, no API key: Esri World Imagery (satellite) and Esri World Street Map (street view). Both are credited in the map's attribution line. Carto basemaps were tried first and now return an "API key required" watermark.
- Club Campestre de Ibagué: `4.3999, -75.16258`, geocoded with Nominatim (OpenStreetMap way 30927829, the golf course).
- Imara outline: about 156 ha, drawn by hand east of the golf course, south of Avenida Mirolindo and west of Calle 145 (the road OpenStreetMap names "Variante Norte de Ibagué"), following the perimeter in the client's location map from the video. It is labelled "área aproximada". Replace `MAP.area` in `main.js` with the surveyed polygon when Imara sends it.
- On touch screens one finger scrolls the page and two fingers move the map, so the map does not trap the scroll. The mouse wheel does not zoom; use the + and − buttons.

## Form → Google Sheets

1. Create a Sheet, open Extensions → Apps Script, paste `apps-script/Code.gs`.
2. Deploy → New deployment → Web app, execute as *Me*, access *Anyone*.
3. Put the `/exec` URL in `FORM_ENDPOINT` in `config.js` and push.

Rows get: date, name, email, phone, interest, consent, page, referrer and UTM tags. Set `NOTIFY_EMAIL` in the script to get an email per lead. With `FORM_ENDPOINT` empty the form runs in demo mode: it validates, shows the thank-you message and sends nothing.

## Analytics

- `GA4_ID` → GA4 loads. Events: `generate_lead` (mark it as a key event/conversion in GA4), `form_start`, `cta_click`, `video_start`, `video_progress`, `map_layer`, `map_interact`.
- `CLARITY_ID` → Clarity loads and gets the same event names.

## Assets and sources

| Asset | Source |
|---|---|
| `assets/img/hero.jpg`, `hero-mobile.jpg` | The two Cargo prototype images ([desktop](https://freight.cargo.site/t/original/i/J3137540318851830857371121012980/Desktop---1.png), [mobile](https://freight.cargo.site/t/original/i/I3136547585312538497915410895092/iPhone-16---17-Pro---1.png)) with the baked-in text removed so the page sets it as real text. |
| `assets/img/ferrat-gran-reserva.jpg` | Aerial render from the developer's project page: https://proyectamosyedificamos.com/proyecto/venta/26/ferrat-gran-reserva (original `https://proyectamosyedificamos.com/storage/pictures/Meeb9sEe13ATVkhLcXj8.jpg`), resized to 1600 px. |
| `assets/img/foresti.jpg` | House render from the developer's project page: https://proyectamosyedificamos.com/proyecto/venta/25/foresti-casas-campestres (original `https://proyectamosyedificamos.com/storage/pictures/tvtiWjp8ACc0JSSU2GOy.jpg`), cropped to remove the disclaimer line. The page credits the developer and says the images are illustrative. |
| `assets/img/video-poster.jpg` | Frame of render v13 |
| `assets/video/imara-video.mp4` | Render v13, 720p (preliminary) |
| `assets/logo/*` | Imara logo SVGs and project logos (white PNGs, shown in green with a CSS mask) from `02_VideoTool/public` |
| `assets/img/og-image.jpg` | The current Cargo hero image |

Removed in the redesign (recoverable from git history): the nine `mapa-*.jpg` crops, `naturaleza.webp`, `collage.jpg`, `google-earth.jpg`, `hero-poster.jpg` and `assets/video/hero-drone.mp4`.

## Going live

The page carries `noindex` while it lives on GitHub Pages. When it moves to imara.com.co, remove the robots meta in `index.html` and `privacidad.html`, check the `canonical` and `og:url`, and point `og:image` to the final domain.
