# Sravani Nijampatnam - Portfolio (GitHub Pages)

Static site: no build step, no dependencies.

## Deploy
1. Create a GitHub repo (e.g. `portfolio`) and upload everything in this folder (keep the `assets/` folder and `.nojekyll`).
2. Repo > Settings > Pages > Build and deployment > Deploy from a branch > `main` / `(root)` > Save.
3. After about a minute the site is live at `https://<your-username>.github.io/<repo>/`.
   (Name the repo `<your-username>.github.io` to get `https://<your-username>.github.io/`.)

## Optional edits
- LinkedIn / GitHub buttons: open `script.js`, fill the two links in `var SOCIAL = {...}`. Empty ones are hidden.
- Accent colour: change `--accent` and `--pt-accent` at the top of `style.css`.
- Resume: replace `assets/resume.pdf` with a newer PDF (keep the name).
- Link preview image: after deploying, add inside `<head>`:
  `<meta property="og:image" content="https://<your-username>.github.io/<repo>/assets/sravani-square.jpg">`
