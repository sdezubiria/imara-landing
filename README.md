# Imara Ciudad Campestre · landing

New version of the Imara landing (today a single image on Cargo, `5811632.cargo.site`), built to match the proposal *Cotización Landing Imara* (Etapa 1 structure + Etapa 2 form and analytics).

Preview: https://sdezubiria.github.io/imara-landing/ (redeploys on every push to `main`).

Plain HTML, CSS and JS. No build step.

```bash
python3 -m http.server 4100   # then open http://localhost:4100
```

## Files

| File | What it is |
|---|---|
| `index.html` | The page. Sections: hero, El proyecto (cifras + comparativo m²), Video, Por qué Imara, Ubicación, Masterplan (tabs), Proyectos, Avance (timeline), Registro, footer. |
| `styles.css` | All styles. Brand tokens at the top (`--ink` logo green, `--rust` CTA, `--road` map yellow). |
| `main.js` | Menu, scroll reveals, counters, masterplan tabs, video and CTA tracking, lead form. |
| `config.js` | **GA4 ID, Clarity ID and form endpoint.** Empty values switch each one off. |
| `analytics.js` | Loads GA4/Clarity from `config.js`; `imaraTrack(name, params)` sends events. |
| `privacidad.html` | Habeas Data policy (draft, client must complete and approve). |
| `apps-script/Code.gs` | Google Apps Script that receives the form and writes rows into a Google Sheet. |
| `assets/` | Images, logos and videos. |

After changing `styles.css` or `main.js`, bump the `?v=` number on its link in `index.html` so browsers drop the cached copy.

## Placeholders still to fill

Search the HTML for `todo`, `placeholder` and `por confirmar`.

- **Video** `assets/video/imara-video.mp4` is render v13 at 720p from `../02_VideoTool/out/review/`. Replace the file with the final cut (keep it under ~50 MB; GitHub rejects files over 100 MB) and regenerate `assets/img/video-poster.jpg`. Remove the "Versión preliminar" tag in `#video`.
- **Timeline** (`#avance`): milestones and dates are examples. Get the real ones from Imara.
- **Contact** in the footer: phone and email.
- **Habeas Data**: company name, NIT and contact in `privacidad.html`.
- **Bogotá m² source** in the comparison chart.

## Form → Google Sheets

1. Create a Sheet, open Extensions → Apps Script, paste `apps-script/Code.gs`.
2. Deploy → New deployment → Web app, execute as *Me*, access *Anyone*.
3. Put the `/exec` URL in `FORM_ENDPOINT` in `config.js` and push.

Rows get: date, name, email, phone, interest, consent, page, referrer and UTM tags. Set `NOTIFY_EMAIL` in the script to get an email per lead.

## Analytics

- `GA4_ID` → GA4 loads. Events: `generate_lead` (mark it as a key event/conversion in GA4), `form_start`, `cta_click`, `video_start`, `video_progress`, `masterplan_tab`.
- `CLARITY_ID` → Clarity loads and gets the same event names.

## Assets and where they came from

| Asset | Source |
|---|---|
| `assets/video/hero-drone.mp4` | `02_VideoTool/public/video/drone-luisa-022.mp4`, 2–14 s, 1600 px, no audio |
| `assets/img/mapa-*.jpg`, `collage.jpg` | Frames of render v13, cropped above the subtitles |
| `assets/img/naturaleza.webp` | `02_VideoTool/public/collage/fondo.png` |
| `assets/logo/*` | Logo SVG and project logos from `02_VideoTool/public` |
| `assets/img/og-image.jpg` | The current Cargo hero image |

## Going live

The page carries `noindex` while it lives on GitHub Pages. When it moves to imara.com.co, remove the robots meta in `index.html`, check the `canonical` and `og:url`, and point `og:image` to the final domain.
