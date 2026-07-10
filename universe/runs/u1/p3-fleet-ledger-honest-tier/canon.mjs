import { readFileSync, writeFileSync } from 'node:fs';
const raw = readFileSync('proposal_raw.json','utf8');
const obj = JSON.parse(raw);
function canon(x){
  if(Array.isArray(x)) return '['+x.map(canon).join(',')+']';
  if(x && typeof x==='object'){
    const ks=Object.keys(x).sort();
    return '{'+ks.map(k=>JSON.stringify(k)+':'+canon(x[k])).join(',')+'}';
  }
  return JSON.stringify(x);
}
const out = canon(obj);
writeFileSync('proposal_canon.json', out, {encoding:'utf8'});
console.log('keys:', Object.keys(obj).sort().join(','));
console.log('bytes:', Buffer.byteLength(out,'utf8'));
