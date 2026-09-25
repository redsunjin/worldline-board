import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const html=fs.readFileSync("index.html","utf8");
const app=fs.readFileSync("app.js","utf8");
const css=fs.readFileSync("styles.css","utf8");

test("READY entry exposes one primary Sigma Drop action before advanced controls",()=>{
  const readyIndex=html.indexOf('class="ready-panel"');
  const playIndex=html.indexOf('id="play"');
  const advancedIndex=html.indexOf('class="advanced-controls"');
  assert.ok(readyIndex>=0);
  assert.ok(playIndex>readyIndex);
  assert.ok(advancedIndex>playIndex);
  assert.match(html,/id="play" class="primary start-cta">▶ Start Sigma Drop<\/button>/);
});

test("example, step, and reset remain available under Advanced controls",()=>{
  const start=html.indexOf('<details class="advanced-controls">');
  const end=html.indexOf('</details>',start);
  const advanced=html.slice(start,end);
  assert.match(advanced,/id="example"/);
  assert.match(advanced,/id="step"/);
  assert.match(advanced,/id="reset"/);
});

test("READY copy describes the human-facing flow",()=>{
  assert.match(html,/How far from the usual range\?/);
  assert.match(html,/Drop<\/span><i>→<\/i><span>Read σ<\/span><i>→<\/i><span>See worlds/);
  assert.match(app,/Ready when you are/);
  assert.match(app,/Start the drop to see the supplied deviation and any open worldlines\./);
});

test("mobile keeps the primary CTA full width and advanced controls secondary",()=>{
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.start-cta\{width:100%;min-width:0;min-height:48px\}/);
  assert.match(css,/\.advanced-controls\{[^}]*background:rgba\(17,28,42,.5\)/);
});
