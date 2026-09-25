import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {buildBoardScene,semanticX,sigmaX} from "../src/trace-layout.mjs";

const steady=JSON.parse(fs.readFileSync("examples/steady.json","utf8"));
const review=JSON.parse(fs.readFileSync("examples/human-review.json","utf8"));

function deviationTrace(value){
  return {
    schemaVersion:"worldline-board-trace-v0",
    traceId:"sigma-test",
    status:"branch",
    terminalScenario:"done",
    steps:[
      {
        sequence:1,
        nodeId:"baseline",
        kind:"code",
        label:"Baseline & deviation",
        state:"resolved",
        routeTo:"done",
        summary:{deviation:{value,band:"normal"}}
      },
      {
        sequence:2,
        nodeId:"done",
        kind:"branch",
        label:"Done",
        state:"terminal",
        routeTo:null,
        summary:{scenarioId:"done"}
      }
    ]
  };
}

test("semantic count equals trace steps",()=>{
  const s=buildBoardScene(steady);
  assert.equal(s.semanticPegs.length,steady.steps.length);
  assert.ok(s.cosmeticPegs.length>s.semanticPegs.length);
});

test("review example ends paused",()=>{
  const s=buildBoardScene(review);
  assert.equal(s.status,"review_required");
  assert.equal(s.semanticPegs.at(-1).kind,"review");
  assert.equal(s.semanticPegs.at(-1).state,"paused");
});

test("noul values move monotonically",()=>{
  assert.ok(
    semanticX({kind:"judgment",summary:{primitive:"noul",answer:.1}})<
    semanticX({kind:"judgment",summary:{primitive:"noul",answer:.9}})
  );
});

test("steady example exposes normal deviation",()=>{
  assert.equal(buildBoardScene(steady).deviation.band,"normal");
});

test("sigma guides and deviation peg use the same scale",()=>{
  for(const value of [-2,-1,0,1,2]){
    const scene=buildBoardScene(deviationTrace(value));
    const guide=scene.sigmaGuides.find(g=>g.value===value);
    assert.equal(scene.semanticPegs[0].x,guide.x);
  }
});

test("sigma scale is centered on mu and symmetric",()=>{
  const mu=sigmaX(0);
  assert.equal(mu-sigmaX(-1),sigmaX(1)-mu);
  assert.equal(mu-sigmaX(-2),sigmaX(2)-mu);
});


test("non-code deviation steps also align to the sigma scale",()=>{
  const trace=deviationTrace(0);
  trace.steps[0]={
    sequence:1,
    nodeId:"judgment-deviation",
    kind:"judgment",
    label:"Judgment with deviation",
    state:"resolved",
    routeTo:"done",
    summary:{
      primitive:"choice",
      answer:"stable",
      deviation:{value:2,band:"high"}
    }
  };
  const scene=buildBoardScene(trace);
  const guide=scene.sigmaGuides.find(g=>g.value===2);
  assert.equal(scene.semanticPegs[0].x,guide.x);
});
