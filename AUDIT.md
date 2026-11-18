# Audit: why the first build reads as AI-generated

Internal design audit of the first build. The client-facing diagnosis of imara.com.co, mapped to the quote, is in the Notion report "Informe SEO y LLMO · Imara Ciudad Campestre".

Reference: the client's Cargo prototype (one landscape photo, Prata headline in logo green `#062D2A` on the sky, short rule, "Naturaleza y ciudad en equilibrio.", pin + "Ibagué, Tolima"). The first build drifted away from it into a generic real-estate template. One line per problem, each with the fix applied in this redesign.

## Owner's points

| # | Problem | Why it reads as slop | Fix |
|---|---|---|---|
| 1 | 4-number stat strip (160 / 3 / 11,00 / <15) | The default "big numbers in a row" block. Two of the four ("3 vías", "11,00 m²") mean nothing without context. | Removed. Scale is said once in a sentence: 160 hectáreas junto al Club Campestre. |
| 2 | m² comparison bar chart (Ibagué / Bogotá / Imara) | A chart nobody asked for, with an unconfirmed Bogotá source, in a page that sells land. | Removed with its footnote and the "Confirmar fuente" flag. |
| 3 | Video block with 14 px rounded corners and a large drop shadow | Floating "card" look from UI kits. The Cargo page is flat. | Video is full-width, square corners, no shadow, on the page background. |
| 4 | Yellow pills with dashed borders for placeholders ("Versión preliminar", dates, contact) | Looks like a debug overlay. Draws more attention than the content. | One quiet style: small muted text ("Fechas por confirmar"). No fills, no dashes. |
| 5 | "Más parques / Más naturaleza / Más andenes…" manifesto | Copy from the video script, repeated as a bullet list with green dots. | Section removed, with its illustration (`naturaleza.webp`). |
| 6 | Rust/orange buttons and form | Taken from one Cargo mobile button; foreign to the green and sky palette. | Rust removed. Buttons and form use the logo green on sky and white. |

## Other problems found

| # | Problem | Why it reads as slop | Fix |
|---|---|---|---|
| 7 | Uppercase letter-spaced eyebrow over every heading ("EL PROYECTO", "POR QUÉ IMARA", "REGISTRO") in green or yellow | Template signature. It repeats what the heading and the nav already say. | Removed. Headings stand alone, with the Cargo short rule where a section opens. |
| 8 | Count-up number animation | Stock "impressive stat" effect. | Removed with the stat strip. |
| 9 | Fade-up reveal on every block, with staggered delays | Content stays invisible until JS runs and the block scrolls in. A full-page screenshot of the old build shows empty sections. | Kept, done safely at the owner's request: one short fade-up, active only when JS runs and reduced motion is off, so content never depends on it. |
| 10 | Decorative concentric rings behind the form | Ornament with no meaning. | Removed. |
| 11 | Dark hero video with three gradient overlays and white text | The opposite of the Cargo hero (bright sky, dark green type). | Hero keeps the Cargo text and layout over a render of a street in Imara from imara.com.co. One shade on the left and under the header keeps the white type readable. |
| 12 | Pill buttons, ghost button with backdrop blur, animated scroll cue | Generic UI kit pieces. | Square buttons in ink green. No blur, no scroll cue. |
| 13 | Masterplan tabs: six yellow pill tabs over dark map crops | Heavy, dark and unreadable on mobile. Not part of the Cargo direction. | Section removed with its nine `mapa-*.jpg` crops. |
| 14 | Static, dark satellite image for location | Can't zoom or pan; road labels in yellow neon glow. | Interactive Leaflet map (satellite and street view) with markers for Imara and the Club Campestre. No boundary drawn until Imara confirms one. |
| 15 | Project cards: white boxes with borders, rounded corners and green chip tags; images were map crops | Card-grid template; the crops don't show the projects. | Two flat rows with real renders from the developer, the project logo on the image and one line of facts. |
| 16 | Timeline marks "Plan parcial" as done with a glowing dot | Claims a status nobody confirmed. The developer's own page says the project is subject to the plan parcial being adopted. | Neutral steps, no status, one note: fechas por confirmar. Stacks cleanly at 375 px. |
| 17 | Extra palette: leaf green, road yellow, rust, cream, paper, night | Six accent colors on a brand that has one. | Ink green, sky blues taken from the photo, white and a light sky tint. |
| 18 | Placeholder email `correo@imara.com.co` shown as if real | A fake address in a footer looks broken. | "Por confirmar" in muted text until the client sends the real one. |
| 19 | Two CTAs in the hero plus a different label in the nav ("Regístrate", "Ver el video", "Quiero información") | Three wordings for one action. | One label: "Contáctanos" in the header (as on Cargo mobile), "Quiero información" on the form button. |
| 20 | Registro copy "Más verde. Más amplia. Más conectada." | Same manifesto rhythm as item 5. | Cut. One plain sentence about what happens after sending the form. |
