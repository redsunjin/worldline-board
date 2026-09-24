import fs from "node:fs";
import path from "node:path";
const roots=["src","examples","schema","app.js","vercel.json"],forbidden=["TYPESAFE_"+"API_KEY","api."+"typesafe.ai","Authorization"+":","Bearer"+" ","secrets"+".TYPESAFE"],files=[];
function walk(p){const s=fs.statSync(p);if(s.isDirectory())for(const n of fs.readdirSync(p))walk(path.join(p,n));else files.push(p);}
for(const r of roots)if(fs.existsSync(r))walk(r);
const hits=[];for(const f of files){const t=fs.readFileSync(f,"utf8");for(const token of forbidden)if(t.includes(token))hits.push({file:f,token});}
if(hits.length){console.error(JSON.stringify({ok:false,hits},null,2));process.exit(1);}console.log(JSON.stringify({ok:true,scanned:files.length},null,2));
