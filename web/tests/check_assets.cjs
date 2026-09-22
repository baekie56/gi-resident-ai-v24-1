const fs=require('fs'),path=require('path'),assert=require('assert');
const R=path.resolve(__dirname,'..');
const files=fs.readdirSync(R).filter(f=>/\.(js|html|css)$/.test(f));
let n=0,missing=[];
for(const f of files)for(const m of fs.readFileSync(path.join(R,f),'utf8').matchAll(/['"`](assets\/[^'"`<>\r\n]+?\.(?:png|jpe?g|webp|svg))/g)){
  if(m[1].includes('${'))continue;n++;if(!fs.existsSync(path.join(R,m[1])))missing.push([f,m[1]]);
}
assert.deepEqual(missing,[],'Missing literal image references');
const html=fs.readFileSync(path.join(R,'index.html'),'utf8');
for(const m of html.matchAll(/(?:src|href)="([^"?]+)(?:\?[^" ]*)?"/g))if(!/^(https?:|#|data:)/.test(m[1]))assert.ok(fs.existsSync(path.join(R,m[1])),m[1]);
const bank=JSON.parse(fs.readFileSync(path.join(R,'docs/patient_bank.json')));assert.equal(bank.length,32);
console.log(`PASS: ${n} literal image references, HTML dependencies and 32 patient records`);
