import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app=fs.readFileSync("app.js","utf8");
const html=fs.readFileSync("index.html","utf8");

test("main canvas does not animate along semantic pegs",()=>{
  assert.doesNotMatch(app,/s\.semanticPegs\.forEach/);
  assert.doesNotMatch(app,/s\.path\.length/);
  assert.match(app,/buildVisualDropPath/);
  assert.match(app,/currentMotionPoint\(\)/);
});

test("advanced step still inspects semantic events without driving completion",()=>{
  assert.match(app,/const max=state\.scene\.semanticPegs\.length-1/);
  assert.match(app,/inspect\(state\.index\)/);
  assert.match(app,/return Boolean\(state\.scene&&state\.dropComplete\)/);
});

test("public canvas explains that motion is decorative",()=>{
  assert.match(html,/Visual drop · decorative route/);
  assert.match(html,/route does not encode workflow or probability/);
  assert.match(html,/Visual motion ≠ semantic trace/);
});
