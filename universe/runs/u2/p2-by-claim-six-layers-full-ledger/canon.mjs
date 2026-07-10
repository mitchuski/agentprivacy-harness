import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const dir = 'C:/Users/mitch/dual-agent-harness/universe/runs/u2/p2-by-claim-six-layers-full-ledger';
const obj = JSON.parse(readFileSync(dir + '/proposal_raw.json', 'utf8'));

// canonical: recursively sorted keys, no whitespace
function canon(v) {
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  return JSON.stringify(v);
}

const bytes = canon(obj);
writeFileSync(dir + '/proposal_canon.json', bytes, { encoding: 'utf8' });
const digest = createHash('sha256').update(readFileSync(dir + '/proposal_canon.json')).digest('hex');
console.log('canon bytes length:', Buffer.byteLength(bytes, 'utf8'));
console.log('top-level keys sorted:', Object.keys(obj).sort().join(','));
console.log('sha256:', digest);
