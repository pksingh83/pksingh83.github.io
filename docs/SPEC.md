# Prashant Kumar: personal resume site. Spec v0.2

Status: built (v0.3). Tests pass locally. Not yet committed or deployed.

## 1. Goal and audience

A recruiter or hiring manager should be able to judge Prashant in about 30 seconds, then contact him or download the resume with one click.

- Purpose: job hunting (he is currently employed, so the site never signals a job hunt).
- Target roles: Engineering Manager, Architect, Technical Manager. Mumbai plus remote.
- Primary calls to action: **Get in touch** (email) and **Download resume** (PDF).

## 2. Decisions log

| # | Decision | Source |
|---|---|---|
| D1 | Single scrolling page, no blog, no CMS, no case-study pages, no contact form | You |
| D2 | Headline: "Senior Technical Manager · Full-Stack .NET Architect" (from the latest CV) | You |
| D3 | Public contact: email, LinkedIn, "Mumbai, India". No phone, no DOB, no pincode | Assumed from "continue" |
| D4 | Three anonymized project cards: employers named, clients generic | Assumed |
| D5 | No "open to opportunities" badge | Assumed |
| D6 | Theme A: Catppuccin Mocha (dark default), Latte as light mode, Monaspace Neon for headings | You |
| D7 | Developer touches: `$ whoami` hero line, ⌘K section jump, theme toggle. No fake terminal | Assumed |
| D8 | Small photo in About. **Supplied later**; layout uses a monogram placeholder until then | You |
| D9 | Hosting: **GitHub Pages** (Cloudflare account not available right now) | You |
| D10 | Repo `pksingh83/pksingh83.github.io` (public) gives the root URL `https://pksingh83.github.io`. Local folder `~/Code/prashant-kumar-site` | Assumed, forced by D9 |
| D11 | Resume PDF generated from `resume.yaml` at build time, no phone number | Assumed |
| D12 | GitHub profile not linked (only four thin public repos) | Assumed |
| D13 | Analytics: none at launch. Revisit later (cookieless tool, no banner) | Assumed, forced by D9 |
| D14 | Copy in first person, outcome-first bullets, no invented metrics | Assumed |
| D15 | Custom domain later (about $10–15 a year), attached without a rebuild | You |

Items marked "Assumed" came from "we can continue" after my recommendations. Veto any of them and the spec changes.

## 3. Scope

### In
Hero, About, Experience, Skills, Projects, Education and certification, Contact, footer. PDF resume download. Light and dark themes.

### Out
Blog, CMS, per-project pages, contact form, multi-language, comments, cookie banner, ad or tracking scripts.

## 4. Information architecture

One page, in this order:

1. **Hero**: eyebrow `$ whoami`, name, H1 headline, one-line pitch, two buttons.
2. **About**: 3–4 sentence bio, photo (monogram until supplied), location, domains worked in.
3. **Experience**: NextGen Invent (Apr 2025 to present), NDS InfoServ (Aug 2006 to Sep 2024). The 2005–06 PCS Technology role appears in the PDF only.
4. **Skills**: grouped list (see CONTENT.md).
5. **Projects**: three cards: DocLabel, ProviderEdge, Autonomous Medical Coding.
6. **Education and certification**: MBA (e-Commerce) 2005, Microsoft Certified: Azure Developer Associate (Oct 2025).
7. **Contact**: email button, LinkedIn link, resume download.

Sticky top bar: `pk` mark, anchor links (About, Experience, Skills, Projects, Contact), ⌘K button, theme toggle.

## 5. Wireframes

### Desktop (1280px)

```
+----------------------------------------------------------------------+
| pk    About  Experience  Skills  Projects  Contact    [⌘K]  [◐ theme] |
+----------------------------------------------------------------------+
|                                                                      |
|                    $ whoami → Prashant Kumar                         |
|                                                                      |
|               Senior Technical Manager &                             |
|               Full-Stack .NET Architect                              |
|                                                                      |
|     I lead engineering teams and build .NET and Azure systems,       |
|     from pharma label platforms to AI-driven medical coding.         |
|                                                                      |
|              [ Get in touch ]   [ Download resume ]                  |
|                                                                      |
+----------------------------------------------------------------------+
| ABOUT                                                                |
|  [photo]   Bio paragraph (max 65ch)             Mumbai, India        |
|            Domains: healthcare · pharma · mortgage · payables        |
+----------------------------------------------------------------------+
| EXPERIENCE                                                           |
|  Apr 2025 – now   Senior Technical Manager · NextGen Invent          |
|                   • bullet  • bullet  • bullet                       |
|  Aug 2006 – 2024  Senior Programmer · NDS InfoServ                   |
|                   • bullet  • bullet  • bullet                       |
+----------------------------------------------------------------------+
| SKILLS      [Languages & frameworks] [Architecture] [Cloud] [Data]   |
|             [DevOps] [AI & automation] [Methodologies]               |
+----------------------------------------------------------------------+
| PROJECTS    [ DocLabel ]  [ ProviderEdge ]  [ Autonomous Coding ]    |
|             problem · role · stack · result  (3 equal cards)         |
+----------------------------------------------------------------------+
| EDUCATION & CERTIFICATION                                            |
+----------------------------------------------------------------------+
| CONTACT   email · LinkedIn · resume.pdf                              |
+----------------------------------------------------------------------+
```

### Mobile (360px)

Single column. Top bar collapses to `pk`, ⌘K icon, theme toggle; section links move into the palette dialog. Project cards stack. Experience dates sit above the role line. Buttons go full width.

## 6. Visual design (theme A)

### Colors (Catppuccin)

| Token | Mocha (dark, default) | Latte (light) |
|---|---|---|
| `--bg` | `#1e1e2e` | `#eff1f5` |
| `--bg-alt` (cards, bars) | `#181825` | `#e6e9ef` |
| `--border` | `#313244` | `#ccd0da` |
| `--text` | `#cdd6f4` | `#4c4f69` |
| `--text-muted` | `#a6adc8` | `#5c5f77` (darker than Catppuccin's `#6c6f85`, for AA contrast) |
| `--accent` (buttons, links) | `#cba6f7` | `#8839ef` |
| `--accent-2` (tags, highlights) | `#89b4fa` | `#1a56d6` (darker than Catppuccin's `#1e66f5`, for AA contrast) |
| `--on-accent` | `#1e1e2e` | `#eff1f5` |

Contrast must be verified by the axe check in both themes. Latte `--text-muted` is the likeliest to fall under AA, and will be darkened if it does.

### Typography

- Headings, eyebrow, nav, tags: Monaspace Neon (SIL OFL), self-hosted from the `@fontsource/monaspace-neon` package. Only the Latin 500 weight is shipped (one 44 KB woff2, plus a woff fallback file), `font-display: swap`.
- Body: system sans stack (`ui-sans-serif, system-ui`), 16–18px, line-height 1.7, max line length 65ch.
- H1: `clamp(2rem, 5vw, 3.5rem)`.

### Effects and motion

- Soft radial glow behind the hero (accent at about 12–15% alpha), static, no animation.
- Optional one-time typed `$ whoami` line. It is skipped under `prefers-reduced-motion` and never blocks content.
- Smooth anchor scroll only when reduced motion is not requested.
- Not copied from tuios: logo, mascot, wording, layout code. Only the general palette and typographic feel.

### Components

Nav bar, button (primary and secondary), pill tag, timeline entry, project card, section heading, command palette dialog, theme toggle, footer.

## 7. Behavior

- Theme: system, dark or light. The choice is saved in `localStorage` inside try/catch, and the page renders correctly without it. The theme is set in an inline head script to avoid a flash.
- ⌘K or Ctrl+K opens a `<dialog>`-based section jump list with keyboard navigation. Nav links always work without JavaScript.
- External links use `rel="noopener noreferrer"`. The email link is a `mailto:` with the address assembled so it is not trivially scrapeable.

## 8. Technical design

- **Framework:** Astro with TypeScript, static output, minimal client JS.
- **Styling:** Tailwind CSS with the tokens above as CSS variables.
- **Content:** `src/data/resume.yaml` is the single source of truth for the page and the PDF.
- **PDF:** at build time, Playwright (Chromium) renders a print-only `/print` route to `Prashant-Kumar-Resume.pdf`. Text PDF, ATS-friendly, light, phone omitted, includes the PCS role.
- **Hosting and deploy:** GitHub Pages, deployed by a GitHub Actions workflow on push to `main`. Repo `pksingh83/pksingh83.github.io` (public, because GitHub Pages on the free plan needs a public repo).
- **SEO:** title, meta description, canonical, Open Graph and Twitter card image, `Person` JSON-LD, `sitemap.xml`, `robots.txt`.
- **Layout:**

```
prashant-kumar-site/
  docs/                 SPEC.md, CONTENT.md
  src/data/resume.yaml  all content
  src/lib/resume.ts     schema, privacy guard, publicView / printView
  src/pages/            index.astro, print.astro (PDF source, removed from dist)
  src/components/*.astro
  src/styles/global.css tokens (light-dark), Tailwind theme, shared classes
  public/               favicon.svg, og.png, robots.txt, sitemap.xml
                        headshot.jpg (supplied later)
  scripts/              build-pdf.mjs, build-og.mjs
  tests/                Vitest: content, page, PDF
  e2e/                  Playwright: behavior, quality (axe, colors, overflow)
  .github/workflows/deploy.yml
```
The Monaspace Neon files come from `node_modules` at build time and are emitted into `dist/_astro/`, so there is no `public/fonts` folder.

Local tooling already present: Node 26, Bun 1.3, npm 11, `gh` logged in as `pksingh83`.

## 9. Non-functional requirements and acceptance criteria

The site is done when all of these pass:

- [ ] Lighthouse 95+ on Performance, Accessibility, Best Practices and SEO (mobile profile).
- [ ] Zero serious or critical axe violations. AA contrast in Mocha and Latte.
- [ ] Works from 360px to 1920px wide, no horizontal scroll, fully keyboard-navigable with visible focus.
- [ ] Under 50 KB of JavaScript, fonts self-hosted and subset.
- [ ] Resume PDF downloads, has selectable text, no phone number, and matches `resume.yaml`.
- [ ] Open Graph preview and `Person` JSON-LD present and valid.
- [ ] Renders correctly in Chrome, Safari and Firefox, with JavaScript disabled (content and nav still work).
- [ ] No console errors and no third-party requests (all assets self-hosted).
- [ ] Prints cleanly (print stylesheet) on A4.

## 9a. Changes made while building (v0.3)

- The email link is a plain `mailto:` in the HTML. Assembling it in JavaScript would break the no-JavaScript requirement.
- Latte `--accent-2` is `#1a56d6` instead of Catppuccin's `#1e66f5`, because the original failed AA contrast on the light cards.
- The theme button cycles dark, light, then auto (follows the system).
- Astro 7's `preview` command runs as a background daemon, so the test server is `sirv-cli`.
- The PDF and the share image are rendered with the installed Google Chrome (`channel: 'chrome'`), so no extra browser download is needed. GitHub Actions installs Chrome with `npx playwright install chrome`.

### Added after the first review (v0.3.1)

- Monaspace Neon is now actually self-hosted (it was named in the font stack but not loaded).
- The light and dark palettes are defined once with CSS `light-dark()`. The theme attribute only sets `color-scheme`.
- No inline `style` attributes remain. Colors come from Tailwind theme tokens (`text-muted`, `bg-alt`, `border-line` and so on) and a few shared classes (`.btn`, `.btn-primary`, `.tool-btn`, `.chip`, `.card`). Base rules sit in `@layer base` so component and utility classes win over them.
- The phone check is one exported function, `looksLikePhoneNumber`, used by the build guard and by the tests. It now also catches `(022) 1234-5678`.
- Playwright always builds fresh (`reuseExistingServer: false`), so it can't test a stale `dist`.
- Hero glow is 14% alpha (spec: 12–15%).

### Known differences from this spec and CONTENT.md

- Section headings show a `~/` prefix (for example `~/contact`). This is a small terminal touch beyond decision D7.
- Education is listed certification first, then the MBA.
- The contact section has no "Let's talk" heading or location line. The intro sentence is hard-coded in `Contact.astro`.
- Project stacks say "Angular" and "MedBERT" (not "Angular 8 and 16" or "locally trained MedBERT"). The meta title uses "&".
- The ⌘K list supports typing and Enter, but not arrow keys.

### Known gaps (not fixed yet)

- Below 640px the section links live only in the ⌘K list, which needs JavaScript. The no-JavaScript test runs at desktop width only.
- The site itself has no `@media print` rules. Only the PDF has A4 styling.
- Not automated yet: Lighthouse in CI, JavaScript size, Safari and Firefox, console errors, and visible focus. Lighthouse was run by hand and scored 100 in all four categories on the mobile profile.
- `sitemap.xml`, `robots.txt` and `og.png` are static files with the site URL written in. Change them if the URL changes (for example with a custom domain).

## 10. Open items and inputs still needed

| Item | Status |
|---|---|
| Headshot | You, later. Monogram placeholder until then |
| LinkedIn URL | Used as `linkedin.com/in/prashantk83` (from your older resume, not on the new CV). Say so if it changed |
| Review CONTENT.md | Approved in chat ("this looks good"). Copy now lives in `src/data/resume.yaml` |
| Azure certification verification link | Optional: add if you have the Microsoft Learn share link |
| Custom domain | Later |
| Analytics | Later, once a hosting or tooling option is available |

## 11. Risks

- A public repo exposes `resume.yaml`. Everything in it is intended to be public, so the phone number and DOB must never be committed.
- Naming the current employer and project domains is an employer-confidentiality call. Review the DocLabel card with that in mind.
- GitHub Pages serves from the repo name `pksingh83.github.io`. A different repo name would put the site under a sub-path.
