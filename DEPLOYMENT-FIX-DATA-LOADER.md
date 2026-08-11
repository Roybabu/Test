# Data loader fix

The public page no longer loads `data-agency.js` or `data-nonagency.js` directly.
It loads `core-v4.js`, which gets the published workshop dataset from:

`submit.php?action=published`

`data/data-insurers.js` remains a small local lookup dataset used by the form.

The versioned loader filenames (`core-v4.js` and `security-v4.js`) and the no-cache
headers on `index.html` prevent an old cached `core.js` from continuing to run.

After deployment, hard refresh the browser and confirm the Network tab contains:
- `core-v4.js`
- `security-v4.js`
- `submit.php?action=published`

It should NOT request:
- `data-agency.js`
- `data-nonagency.js`
