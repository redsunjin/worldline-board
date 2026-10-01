import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app=fs.readFileSync("app.js","utf8");
const css=fs.readFileSync("styles.css","utf8");

test("sigma scale is positioned from the visual landing line",()=>{
  assert.match(app,/function landingYForScene\(s\)/);
  assert.match(app,/const landingY=landingYForScene\(s\)/);
  assert.doesNotMatch(app,/const peg=s\.semanticPegs\[s\.deviationIndex\]/);
});

test("completed drop renders a trace-supplied deviation label at landing",()=>{
  assert.match(app,/function drawLandingResult\(s\)/);
  assert.match(app,/if\(!state\.dropComplete\|\|!state\.motion\)return/);
  assert.match(app,/sigmaLabel\(deviation\.value\)\+" · "\+String\(deviation\.band/);
  assert.match(app,/drawLandingResult\(s\)/);
});

test("result reveal has focused landing and card transitions",()=>{
  assert.match(css,/\.landing-halo\{/);
  assert.match(css,/\.landing-label\{/);
  assert.match(css,/\.result-card\.revealed\{animation:result-reveal/);
});
