# Garage Finder deployment

Upload the **contents of this folder** to the web root (for example `public_html/`).
Do not upload the outer `test-main` directory as a nested directory.

Required public entry points:
- `index.html`
- `core.js`
- `security.js`
- `submit.php`
- `data/data-insurers.js`
- `data/published-workshops.json`

The public page loads insurer metadata from `data/data-insurers.js` and workshop records from:
`submit.php?action=published`.

The public page does **not** load `data-agency.js` or `data-nonagency.js`.

Keep the `data/.htaccess` file in place. It protects server-side JSON state.
Use HTTPS in production and configure the server-side admin secret before using the admin API.
