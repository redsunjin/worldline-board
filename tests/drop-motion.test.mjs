import assert from "node:assert/strict";
import test from "node:test";
import {buildVisualDropPath} from "../src/drop-motion.mjs";
import {buildBoardScene} from "../src/trace-layout.mjs";

function traceWithDeviation(value){
  return{
    schemaVersion:"worldline-board-trace-v0",
    traceId:"drop-motion-test",
    status:"branch",
    terminalScenario:"maintain",
    steps:[
      {
        sequence:1,
        nodeId:"baseline",
        kind:"code",
        label:"Baseline",
        state:"resolved",
        routeTo:"maintain",
        summary:{deviation:{value,band:"normal"}}
      },
      {
        sequence:2,
        nodeId:"maintain",
        kind:"branch",
        label:"Maintain",
        state:"terminal",
        routeTo:null,
        summary:{scenarioId:"maintain"}
      }
    ]
  };
}

test("same seed reproduces the same decorative motion",()=>{
  const scene=buildBoardScene(traceWithDeviation(1.25));
  assert.deepEqual(
    buildVisualDropPath(scene,{seed:42}),
    buildVisualDropPath(scene,{seed:42})
  );
});

test("different seeds vary the route but keep the same landing target",()=>{
  const scene=buildBoardScene(traceWithDeviation(1.25));
  const a=buildVisualDropPath(scene,{seed:11});
  const b=buildVisualDropPath(scene,{seed:99});

  assert.notDeepEqual(a.points.slice(0,-1),b.points.slice(0,-1));
  assert.equal(a.points.at(-1).x,scene.deviationTargetX);
  assert.equal(b.points.at(-1).x,scene.deviationTargetX);
  assert.equal(a.points.at(-1).x,b.points.at(-1).x);
});

test("landing target stays aligned with sigma geometry on mobile dimensions",()=>{
  const scene=buildBoardScene(traceWithDeviation(-2),{width:390,height:430});
  const path=buildVisualDropPath(scene,{seed:7});
  const guide=scene.sigmaGuides.find(g=>g.value===-2);

  assert.equal(scene.deviationTargetX,guide.x);
  assert.equal(path.targetX,guide.x);
  assert.equal(path.points.at(-1).x,guide.x);
});

test("visual motion never mutates the scene or semantic trace layout",()=>{
  const scene=buildBoardScene(traceWithDeviation(.5));
  const before=structuredClone(scene);
  buildVisualDropPath(scene,{seed:123});
  assert.deepEqual(scene,before);
});

test("missing deviation falls to the visual center without inventing one",()=>{
  const trace=traceWithDeviation(0);
  delete trace.steps[0].summary.deviation;
  const scene=buildBoardScene(trace);
  const path=buildVisualDropPath(scene,{seed:5});

  assert.equal(scene.deviation,null);
  assert.equal(scene.deviationTargetX,null);
  assert.equal(path.points.at(-1).x,scene.width/2);
});
