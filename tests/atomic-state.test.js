const fs = require('fs');
const assert = require('assert');
const php = fs.readFileSync('submit.php','utf8');

for (const action of ['submit','approve','reject','edit']) {
  const start = php.indexOf(`if ($action === '${action}')`);
  assert(start >= 0, `${action} action missing`);
  const end = php.indexOf('\nif ($action ===', start + 10);
  const block = php.slice(start, end < 0 ? php.length : end);
  assert(block.includes('withStateLock('), `${action} must use the shared exclusive state lock`);
}
assert(php.includes('publishAtomically('), 'publication must use the atomic transaction helper');
assert(php.includes('GF_TEST_FAIL_AFTER_PUBLISHED_WRITE'), 'publication failure regression hook missing');
assert(php.includes('state-transaction.json'), 'publication transaction journal missing');
assert(php.includes('phase') && php.includes('committed'), 'transaction journal phases missing');
console.log('PASS atomic JSON mutation audit');
