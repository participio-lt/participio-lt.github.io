# participio.lt

Website of Participio, in English (main version) and Lithuanian (under `/lt/`).

The site has three pages in the menu:

- **How-to guides** - our own guides and guides by others that we link to, tagged with the six steps of a participatory project (fund, plan, recruit, run, make sense, act and evaluate).
- **News** - events of interest, our own events, funding calls and conference overviews.
- **About us** - what Participio is, track record, what we bring to a consortium, our work, experts.

## Adding and changing content (for editors)

Content is edited in the browser with [Pages CMS](https://app.pagescms.org). No code is needed.

1. Open https://app.pagescms.org and sign in with your GitHub account. You need to be added to this repository first.
2. Choose this repository. The menu on the left lists what can be edited.
3. **To add a post**, open "Įrašai / Posts" and press "Add an entry".
   - Pick the date and the section: How-to guides, News, or Our work.
   - Write the title, a summary of one or two sentences, and the text in English. Add Lithuanian if there is a translation. A post without a Lithuanian title shows only on the English site.
   - Upload a picture. If the picture is not ours, fill in the picture credit.
   - For an event organised by someone else, fill in "organised by". For our own event, tick "Our own event".
   - For a guide, tick the steps it belongs to.
   - Tick "Draft" to save a post without publishing it.
4. Press "Save". The site rebuilds by itself and the change is live in about two minutes.

Other things in the menu:

- **Guides by others** - the linked toolkits on the How-to guides page.
- **Funding calls** - the table shown inside the monthly funding calls post. Calls whose deadline has passed drop out at the next rebuild.
- **Our work, What we bring, Experts, Figures, Logo line** - the parts of the About page and the logo strip.

Rules we keep on this site: no invented facts or numbers, events by others are always marked as such, and a picture that is not ours always has a credit.

## How it works

- Content lives in `content/` as JSON files. Posts are in `content/insights/`, one file per post.
- Pages are built from `src/` with [Eleventy](https://www.11ty.dev). Fixed interface texts in both languages are in `src/_data/i18n.json`. Stylesheets are in `static/`, uploaded pictures in `assets/uploads/`.
- The editor is configured in `.pages.yml`.
- Every change on `main` is built and published by GitHub Actions (`.github/workflows/deploy.yml`) to GitHub Pages.
- Posts marked as draft show in the local preview only. Text written as `[GAP: ...]` in a content file is left out of the page.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:8091.
