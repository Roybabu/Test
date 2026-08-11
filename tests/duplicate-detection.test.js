const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

function normalizeText(s) {
  return String(s || '').normalize('NFKC').toLowerCase()
    .replace(/\s+/g, ' ').trim()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ');
}
function normalizePhone(s) {
  let digits = String(s || '').replace(/\D/g, '').replace(/^00/, ''); if (digits.startsWith('971')) return '971' + (digits[3] === '0' ? digits.slice(4) : digits.slice(3)); if (digits.startsWith('0')) return '971' + digits.slice(1); return digits;
}
function identityKey(w) {
  return [normalizeText(w.name), normalizeText(w.emirate), normalizePhone(w.phone), normalizeText(w.address)].join('|');
}
function stableId(w) {
  const input = identityKey(w);
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return 'ws_' + ('00000000' + hash.toString(16)).slice(-8);
}
function exact(a, b) {
  if (a.id && b.id) return a.id === b.id;
  return identityKey(a) === identityKey(b);
}
function uncertain(a, b) {
  return normalizeText(a.name) === normalizeText(b.name) &&
    normalizeText(a.emirate) === normalizeText(b.emirate) && !exact(a, b);
}

const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(require('path').join(__dirname, '../data/data-agency.js'), 'utf8') + '\nthis.agency = agencyWorkshops;', context);
vm.runInContext(fs.readFileSync(require('path').join(__dirname, '../data/data-nonagency.js'), 'utf8') + '\nthis.nonagency = nonAgencyWorkshops;', context);
const published = context.agency.concat(context.nonagency);

assert.strictEqual(published.length, 219);
assert.strictEqual(new Set(published.map(w => w.id)).size, published.length, 'published ids must be unique');
assert(published.every(w => /^ws_[a-f0-9]{8}$/.test(w.id)), 'every published workshop needs a stable id');

const canonical = {
  name: 'Aarya Auto / Aarya Garage', emirate: 'Abu Dhabi',
  phone: '(+971) 050 386 1850', address: 'Musaffah M-40, Abu Dhabi'
};
const formatted = {
  name: '  AARYA AUTO / AARYA GARAGE  ', emirate: 'abu   dhabi',
  phone: '+971 50-386-1850', address: 'Musaffah M-40, Abu Dhabi'
};
assert.strictEqual(identityKey(canonical), identityKey(formatted), 'identity fields normalize before comparison');
assert.strictEqual(stableId(canonical), stableId(formatted), 'normalized records get the same stable id');
assert(exact(canonical, formatted), 'exact normalized identity is an automatic duplicate');

const prefixOnly = {...canonical, name: 'Aarya Auto'};
assert(!exact(canonical, prefixOnly), 'prefix matches are no longer automatic duplicates');
assert(!uncertain(canonical, prefixOnly), 'different normalized names are not silently flagged as duplicates');

const uncertainRecord = {...canonical, address: 'Musaffah M-41, Abu Dhabi'};
assert(!exact(canonical, uncertainRecord), 'different address is not an automatic duplicate');
assert(uncertain(canonical, uncertainRecord), 'same normalized name/emirate with changed contact data is flagged for review');

const stablePublished = {...canonical, id: stableId(canonical)};
const stableEdit = {...stablePublished, address: 'Corrected address'};
assert(exact(stablePublished, stableEdit), 'stable id remains authoritative when details are corrected');

console.log('duplicate detection tests passed');
