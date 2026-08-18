import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const dir = 'C:/Users/mitch/dual-agent-harness/examples/field-guide/runs/r5/r5.3/p2-restructure-telegraphic-merge/';
const raw = readFileSync(dir + 'raw_proposal.json', 'utf8');
const obj = JSON.parse(raw);

function canon(v) {
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  return JSON.stringify(v);
}

const canonical = canon(obj);
writeFileSync(dir + 'proposal_canon.json', canonical, { encoding: 'utf8' });
const h = createHash('sha256').update(Buffer.from(canonical, 'utf8')).digest('hex');
console.log('bytes=' + Buffer.byteLength(canonical, 'utf8'));
console.log('sha256=' + h);
console.log('expected=f92057c8722531975ab86e41de253e1d9afb2c00563ea0aa21aa92c8cef31022');
console.log('match=' + (h === 'f92057c8722531975ab86e41de253e1d9afb2c00563ea0aa21aa92c8cef31022'));
