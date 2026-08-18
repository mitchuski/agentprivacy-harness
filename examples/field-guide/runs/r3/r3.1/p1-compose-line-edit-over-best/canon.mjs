import fs from 'fs';
const raw = fs.readFileSync(process.argv[2],'utf8');
const obj = JSON.parse(raw);
function canon(v){
  if(Array.isArray(v)) return '['+v.map(canon).join(',')+']';
  if(v && typeof v==='object'){
    return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canon(v[k])).join(',')+'}';
  }
  return JSON.stringify(v);
}
fs.writeFileSync(process.argv[3], canon(obj));
console.log('canonical bytes written:', fs.statSync(process.argv[3]).size);
