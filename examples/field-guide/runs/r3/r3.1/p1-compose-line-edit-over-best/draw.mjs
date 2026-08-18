const hex="a82546e38eb34973b46d27c5fe4ff6e2b95eea8cc6d1b97faaa4b9a7164c1aa9";
const bytes=[];for(let i=0;i<hex.length;i+=2)bytes.push(parseInt(hex.slice(i,i+2),16));
let remaining=[];for(let f=1;f<=32;f++)remaining.push('F'+f);
const draws=[];
for(let k=0;k<8;k++){
  const b=bytes[k];const n=remaining.length;const idx=b%n;const pick=remaining[idx];
  draws.push({k,byte:b,remainingCount:n,idx,pick});
  remaining.splice(idx,1);
}
for(const d of draws)console.log(`k=${d.k} b${d.k}=${d.byte} rem=${d.remainingCount} idx=${d.byte}%${d.remainingCount}=${d.idx} -> ${d.pick}`);
console.log('DRAWN:',draws.map(d=>d.pick).join(', '));
console.log('distinct:',new Set(draws.map(d=>d.pick)).size===8);
