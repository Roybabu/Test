/* Centralized HTML escaping boundary. Never bypass this for untrusted data. */
(function (root) {
  'use strict';
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[c];
    });
  }
  root.GF_SECURITY = Object.freeze({escapeHTML: escapeHTML});
})(window);
