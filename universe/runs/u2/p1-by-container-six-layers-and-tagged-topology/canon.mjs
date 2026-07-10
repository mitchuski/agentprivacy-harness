import { readFileSync, writeFileSync } from 'node:fs';
function canon(v) {
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  return JSON.stringify(v);
}
const dir = 'C:/Users/mitch/dual-agent-harness/universe/runs/u2/p1-by-container-six-layers-and-tagged-topology/';
const obj = JSON.parse(readFileSync(dir + 'proposal_raw.json', 'utf8'));
const out = canon(obj);
writeFileSync(dir + 'proposal_canon.json', out, { encoding: 'utf8' });
process.stdout.write('bytes=' + Buffer.byteLength(out, 'utf8') + '\n');
