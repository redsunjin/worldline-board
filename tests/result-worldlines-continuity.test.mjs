import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app=fs.readFileSync("app.js","utf8");
const html=fs.readFileSync("index.html","utf8");
const css=fs.readFileSync("styles.css","utf8");
const architecture=fs.readFileSync("docs/architecture.md","utf8");

test("worldline fan remains conditional on trace-supplied worldlines",()=>{
  assert.match(app,/const worldlines=state\.scene\?\.worldlines\|\|\[\]/);
  assert.match(app,/const visible=complete&&worldlines\.length>0/);
  assert.match(app,/section\.hidden=!visible/);
});

test("result surface has a visual bridge into the worldline surface",()=>{
  const resultIndex=html.indexOf('id="result"');
  const bridgeIndex=html.indexOf('id="resultWorldlineBridge"');
  const worldlineIndex=html.indexOf('id="worldlines"');

  assert.ok(resultIndex>=0);
  assert.ok(bridgeIndex>resultIndex);
  assert.ok(worldlineIndex>bridgeIndex);
  assert.match(css,/\.result-card\.revealed \+ \.result-worldline-bridge\{opacity:1\}/);
});

test("worldline fan origin uses the supplied deviation when present",()=>{
  assert.match(app,/originLabel\.textContent=deviation\?\("FROM "\+sigmaLabel\(deviation\.value\)\):"FROM RESULT"/);
});

test("path and card reveal timing is presentation only",()=>{
  assert.match(css,/animation-delay:calc\(var\(--worldline-order,0\)\*70ms\)/);
  assert.match(css,/animation-delay:calc\(160ms \+ var\(--worldline-order,0\)\*70ms\)/);
  assert.match(architecture,/reveal order, color, thickness, and position do not rank worldlines or encode likelihood/);
});
