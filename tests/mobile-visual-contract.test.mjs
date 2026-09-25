import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css=fs.readFileSync("styles.css","utf8");
const app=fs.readFileSync("app.js","utf8");

test("mobile board keeps an explicit 430px Sigma Drop stage",()=>{
  assert.match(
    css,
    /@media\(max-width:720px\)[\s\S]*\.stage\{height:430px;min-height:430px\}[\s\S]*#board\{height:430px;min-height:0\}/
  );
});

test("mobile worldline cards use horizontal swipe instead of a tall stack",()=>{
  assert.match(
    css,
    /\.worldline-cards\{[^}]*grid-auto-flow:column[^}]*overflow-x:auto[^}]*scroll-snap-type:x proximity/
  );
});

test("mobile advanced controls use a compact two-action grid",()=>{
  assert.match(
    css,
    /\.controls\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/
  );
});

test("mobile scene geometry uses the rendered board width with a 430px height",()=>{
  assert.match(app,/return\{width:Math\.max\(320,measuredWidth\),height:430\}/);
  assert.match(app,/buildBoardScene\(state\.trace,sceneOptions\(\)\)/);
});
