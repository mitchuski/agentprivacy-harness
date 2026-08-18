import { readFileSync, writeFileSync } from 'node:fs';

const dir = 'C:/Users/mitch/dual-agent-harness/examples/field-guide/runs/r2/r2.2/p2-restructure-merge-terse-prose/';
const obj = JSON.parse(readFileSync(dir + 'proposal_raw.json', 'utf8'));

function canon(v) {
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  return JSON.stringify(v);
}

const out = canon(obj);
writeFileSync(dir + 'proposal_canon.json', out, { encoding: 'utf8' });
process.stdout.write('bytes=' + Buffer.byteLength(out, 'utf8') + '\n');
