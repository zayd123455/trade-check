# How this tool is built

- Plain HTML, CSS and JavaScript only. No frameworks, no libraries, no build
  step, no npm, nothing loaded from a CDN, no server, no outside API.
- If a request needs a server, a database, logins or an outside API, stop and
  tell me, then add it to the Later list in PRD.md.
- Files: `index.html`, `css/styles.css`, `js/app.js`. Styles follow DESIGN.md.
  If you need a color, font or size that is not in it, stop and tell me.
- All data lives in two places in `js/app.js`: the `trades` array and the
  `rules` object. Every change goes through a function that updates them,
  saves, and calls `render()`. Never change the page without changing the data.
- No `alert()`, `confirm()` or `prompt()`. Messages appear on the page.
- One feature per request, and tell me which lines you changed.
