import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css=fs.readFileSync("styles.css","utf8");

test("mobile board keeps the Sigma Drop stage compact",()=>{
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.stage,#board\{min-height:430px\}/);
});

test("mobile worldline cards use horizontal swipe instead of a tall stack",()=>{
  assert.match(css,/\.worldline-cards\{[^}]*grid-auto-flow:column[^}]*overflow-x:auto[^}]*scroll-snap-type:x proximity/);
});

test("mobile controls use a compact three-action grid",()=>{
  assert.match(css,/\.controls\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});
