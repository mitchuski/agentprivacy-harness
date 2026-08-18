import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const dir = 'C:/Users/mitch/dual-agent-harness/examples/field-guide/runs/r5/r5.2/p1-cut-filler-line-edit/';
const raw = readFileSync(dir + 'proposal_raw.json', 'utf8');
const obj = JSON.parse(raw);

function canon(v) {
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (v && typeof v === 'object') {
    const keys = Object.keys(v).sort();
    return '{' + keys.map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  return JSON.stringify(v);
}

const canonStr = canon(obj);
writeFileSync(dir + 'proposal_canon.json', canonStr, { encoding: 'utf8' }); // no trailing newline
const h = createHash('sha256').update(Buffer.from(canonStr, 'utf8')).digest('hex');
console.log('sha256:', h);
console.log('expected:', 'e6ba7664ee1a5c8b7a46b296d5c656711e78d8b5545b08a49a527deb3c003016');
console.log('match:', h === 'e6ba7664ee1a5c8b7a46b296d5c656711e78d8b5545b08a49a527deb3c003016');
