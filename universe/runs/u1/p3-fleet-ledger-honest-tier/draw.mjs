import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
const bytes = readFileSync('proposal_canon.json');
const seed = crypto.createHash('sha256').update(bytes).digest();
const seedHex = seed.toString('hex');
console.log('seedHex', seedHex);
// N facts
const N = 40;
let remaining = Array.from({length:N}, (_,i)=>i+1); // F1..F40
const draw = [];
for(let k=0;k<12;k++){
  const b = seed[k];
  const cnt = remaining.length;
  const idx = b % cnt;
  const picked = remaining[idx];
  draw.push({k, byte:b, byteHex:b.toString(16).padStart(2,'0'), remainingCount:cnt, idx, pickedFact:'F'+picked});
  remaining.splice(idx,1);
}
for(const d of draw) console.log(`k=${d.k} b${d.k}=0x${d.byteHex}(${d.byte}) mod ${d.remainingCount} = idx ${d.idx} -> ${d.pickedFact}`);
console.log('DRAW:', draw.map(d=>d.pickedFact).join(','));
