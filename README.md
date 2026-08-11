# Garage Finder — upload guide

Upload **every file in this folder** into the same folder on your server.
Paths are relative, so there is nothing to configure.


## Folder layout

```
garage-finder-site/
├── index.html          public entry
├── admin.html          review entry
├── submit.php          form endpoint
├── core.js             shared engine (window.GF)
├── README.md
│
├── data/               workshop + insurer data (edit these)
│   ├── data-agency.js
│   ├── data-nonagency.js
│   └── data-insurers.js
│
├── css/                all stylesheets
│   ├── shared.css
│   ├── admin.css
│   ├── styles.css
│   └── design-*.css
│
├── designs/            one JS file per visual theme
│   └── design-*.js
│
├── admin/
│   └── admin.js
│
└── docs/               setup notes, logo lists, legacy
```

## Architecture

```
core.js
│
├── data          (agency + non-agency + insurers → GF_DATA)
├── filtering     (GF.filter)
├── search        (GF.searchHay + shared suggest)
├── phone         (GF.parsePhones / phoneLines / firstTel / telHref)
├── maps          (GF.fullAddress / mapsHref)
├── copy          (GF.detailsText / copyDetails / wireCopy)
├── submission    (add form + submit.php)
├── esc           (GF.esc — every data value before innerHTML)
│
└── design renderer
      ├── Board / Job Card / Pocket / Night Desk / …
      └── each design owns only its shell HTML, CSS, and card markup
```

Designs are presenters. Shared behaviour lives once in `core.js` and is exposed
as `window.GF`. Do not re-implement phone, maps, filter or copy logic inside a
design file.


## What each file is

| File | What it is | Edit it? |
|---|---|---|
| `index.html` | The page itself — loads everything below | Rarely |
| `data/data-agency.js` | Agency (dealer) workshops | **Yes — often** |
| `data/data-nonagency.js` | Non-agency workshops + their insurer panels | **Yes — often** |
| `data/data-insurers.js` | Master list of insurers | Occasionally |
| `core.js` | Shared engine: builds the list, runs the design picker, sends submissions | Rarely |
| `shared.css` | The design picker and the add-workshop form | Rarely |
| `design-1-board.css` / `.js` … `design-10-neu.css` / `.js` | The ten designs — one pair of files each | When changing a look |
| `submit.php` | Receives visitor submissions | **Set your key once** |
| `admin.html` / `admin.js` / `admin.css` | Your private review page | No |
| `FILE-1-goes-in-DATA-folder.txt` | Rename to `.htaccess`, put inside `data/` | Once |
| `FILE-2-goes-in-HTDOCS-folder.txt` | Rename to `.htaccess`, put next to `index.html` | Once |
| `LOGO-FILENAMES*.txt` | Reference lists for logo filenames | No |

## Setup — do this once

1. Open `submit.php` and change `ADMIN_KEY` at the top to something only you
   know. That is the password for the review page.
2. Create a folder called `data` next to `index.html`, writable by the web
   server (`chmod 755`, or `775`/`777` on stricter hosts). `submit.php`
   creates it automatically if it is allowed to.
3. Rename `FILE-1-goes-in-DATA-folder.txt` to `.htaccess` and put it inside
   `data/`. Rename `FILE-2-goes-in-HTDOCS-folder.txt` to `.htaccess` and put
   it next to `index.html`.
4. Open `admin.html`, enter your key, and confirm it loads.

**No PHP on your host?** Delete `submit.php`, `admin.html`, `admin.js` and
`admin.css`, then open `core.js` and set `SUBMIT_ENDPOINT` to `''`. The
directory still works — the add button just disappears.

## The ten designs

Each design is a complete page of its own: its own header, its own filter
controls, its own card layout. Two files per design, and they share nothing,
so editing one cannot break another.

| # | id | Character |
|---|---|---|
| 1 | `board` | Industrial dispatch board, number-plate strip with counts |
| 2 | `jobcard` | Carbon-copy repair order on ruled ledger paper |
| 3 | `pocket` | Phone-app cards, chip filters, sticky filter dock |
| 4 | `nightdesk` | Dark console with a sticky filter rail |
| 5 | `signpost` | Road signage, green gantry header, sign panels |
| 6 | `index` | Printed directory, letter dividers, A–Z jump rail |
| 7 | `blocks` | Swiss colour blocks, black band toolbar |
| 8 | `splitdesk` | List on the left, full record on the right |
| 9 | `clay` | Claymorphism — puffy shapes, soft gradient |
| 10 | `neu` | Neumorphism — one surface, carved controls |

### Choosing the design visitors see first

Open `core.js` and change:

```js
var DEFAULT_DESIGN = 'board';
```

### Locking the site to one design

In `core.js`:

```js
var SHOW_PICKER = false;
```

The picker disappears and everyone sees `DEFAULT_DESIGN`.

### Removing a design entirely

Delete its two files, then remove its `<script>` line from `index.html` and
its id from the `ORDER` list near the top of `core.js`.

## Design entrance animations

Each design arrives in a way that suits what it is, rather than blinking in:

| Design | How it arrives |
|---|---|
| Board | Plates and rows flap over, like a split-flap departure board |
| Job Card | The sheet feeds up through a platen |
| Pocket | The screen pushes in from the right, like a phone app |
| Night Desk | A CRT warming up — a bright line that opens out |
| Signpost | The page sweeps past as if driving, then panels bolt down |
| Index | A page turning open from the left |
| Blocks | A colour wipe across, then tiles pop in |
| Split Desk | It just settles — deliberately the quietest of the ten |
| Clay | Squash and stretch, overshooting then springing back |
| Neu | Surfaces rise out of the panel from a blur |

All ten stylesheets are loaded when the page opens, sitting inactive until
chosen, so switching never has to wait for a download — that wait was what
produced the flash of unstyled page and stray shapes from the previous
design. Result cards stagger in behind the page itself. The animation lives in
`shared.css` under **DESIGN ENTRANCE ANIMATIONS**; each is a separate block
you can shorten, change or delete without touching the others. Anyone whose
device asks for reduced motion gets a plain fade instead.

## Calling a workshop

Tapping a phone number anywhere on the site opens a small sheet instead of
dialling straight away. Each number the workshop has is listed on its own
row with three buttons:

- **Call** — dials that number
- **WhatsApp** — opens a chat, shown only for UAE mobile numbers (05x /
  +9715x). Landlines show it greyed out, because WhatsApp cannot reach them.
- **Copy** — copies just that number

The sheet opens even when there is only one number, so a copy button is
always one tap away. 33 of the 103 workshops that have a phone number carry
more than one, and 55 have a WhatsApp-capable mobile.

## Type-ahead on the add form

**Insurer panels** and **Car makes** both suggest as you type. Pick from the
list and it is inserted with a comma, ready for the next one, so several
entries stay comma-separated. If what you typed is not on the list, the form
says so plainly rather than accepting a name that will never match a filter.
Insurer suggestions come from `data/data-insurers.js`; car makes are gathered from
the workshops already in your data files.

## Editing the workshop lists

Exactly as before — open `data/data-agency.js` or `data/data-nonagency.js` in a plain
text editor. Each workshop is one block:

```js
  {
    name:    "Gargash Enterprises — Mercedes-Benz (Dubai)",
    makes:   ["Mercedes-Benz", "Maybach"],
    emirate: "Dubai",
    address: "14 19th St, Al Quoz Industrial Area 3, Dubai",
    phone:   "",
    notes:   "Verify the nearest branch before dispatch."
  },
```

Four things break the page:

1. Every value goes inside `"double quotes"`.
2. Every line inside `{ }` ends with a comma — except the last.
3. Every closing `}` is followed by a comma.
4. Leave an unknown field as `""` rather than deleting the line.

If a data file has a typo, a red bar names the file. Press **F12 → Console**
for the line number.

## Insurer names must match exactly

A name in `insurers: [...]` in `data/data-nonagency.js` must match the `name:` in
`data/data-insurers.js` character for character, brackets included — for example
`"GIG Gulf (formerly AXA Gulf)"`. All 219 workshops currently match.

## How submissions work

A visitor taps **+ Add workshop** and sends it. Three things happen:

1. It appears in their own list straight away, marked *awaiting review*.
2. A copy is appended to `data/pending-submissions.json`.
3. Nothing in `data/data-agency.js` or `data/data-nonagency.js` changes. Only you edit
   those, from the review page.

Merging a submission in is unchanged: open `admin.html`, unlock with your
key, copy the formatted block, paste it into the right data file, then click
**Mark merged**.

### If you see a workshop listed twice

Each published workshop has a stable `id`. New submissions derive the same
kind of identifier from normalized **name + emirate + phone + address**.
Comparison normalizes case, whitespace, punctuation and phone formatting.
An exact normalized identity (or the same stable id) is treated as a
duplicate automatically.

A record with the same normalized name and emirate but different phone or
address is **not** discarded. It is retained and marked **possible duplicate —
review** in the admin page so the owner can decide whether it is the same
workshop. Fuzzy/prefix name matching is no longer used.

### One difference from the previous version

Visitors can **add** a workshop but no longer **edit** an existing one from
the public page. The add form is shared across all ten designs; per-design
edit controls were not rebuilt. Your review page still handles edit-type
submissions if any are already pending.

## Production security and publication workflow

- Set a strong `ADMIN_KEY` in `submit.php` before deployment; never commit the production key.
- Serve the application over HTTPS. HSTS is emitted only for HTTPS requests.
- The public directory consumes `submit.php?action=published`; `data/published-workshops.json` is the server-side published dataset.
- Visitor submissions remain pending until an administrator approves them. Only approved submissions can be published.
- `data/admin-audit-log.json` records administrator actions without credentials or admin keys.
- `data/pending-submissions.json` and `data/workshop-verification.json` are blocked from direct HTTP access by `.htaccess`.
