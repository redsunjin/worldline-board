import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root=process.cwd(),port=Number(process.env.PORT||4173);
const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8"};
http.createServer((req,res)=>{const raw=decodeURIComponent((req.url||"/").split("?")[0]);const rel=raw==="/"?"index.html":raw.replace(/^\//,"");const file=path.resolve(root,rel);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end("Forbidden");return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(err.code==="ENOENT"?404:500);res.end(err.code==="ENOENT"?"Not found":"Server error");return;}res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});res.end(data);});}).listen(port,"127.0.0.1",()=>console.log("Worldline Board: http://127.0.0.1:"+port));
