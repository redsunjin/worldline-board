import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {buildBoardScene} from '../src/trace-layout.mjs';
import {buildVisualDropPath} from '../src/drop-motion.mjs';
const steady=JSON.parse(fs.readFileSync(new URL('../examples/steady.json',import.meta.url)));
const review=JSON.parse(fs.readFileSync(new URL('../examples/human-review.json',import.meta.url)));
function harness(){
  const nodes=new Map(),pending=[],timers=new Map();let id=0;
  const node=()=>({textContent:'',innerHTML:'',disabled:false,hidden:false,value:'steady',children:[],style:{setProperty(){}},classList:{toggle(){}},setAttribute(){},append(...v){this.children.push(...v)},replaceChildren(){this.children=[]},addEventListener(){},getBoundingClientRect(){return{width:760}}});
  const document={getElementById(key){if(!nodes.has(key))nodes.set(key,node());return nodes.get(key)},createElement:node,createElementNS:node};
  const context={document,buildBoardScene,buildVisualDropPath,window:{matchMedia(){return{matches:false}},addEventListener(){}},console:{error(){}},fetch:()=>new Promise((resolve,reject)=>pending.push({resolve,reject})),setInterval(fn){timers.set(++id,fn);return id},clearInterval(i){timers.delete(i)},requestAnimationFrame(){},cancelAnimationFrame(){}};
  const source=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8').replace(/^import.*;\n/gm,'').replace('load("steady").catch(console.error);','');
  vm.runInNewContext(source+'\nglobalThis.api={load,play,step,reset,advanceMotion,state};',context);
  const reply=(index,trace)=>pending[index].resolve({ok:true,json:async()=>structuredClone(trace)});
  return{...context.api,nodes,pending,timers,reply};
}
test('pending initial load and switch block Start/Step/Reset and discard old motion',async()=>{
  const h=harness();let p=h.load('steady');h.play();h.step();h.reset();assert.equal(h.timers.size,0);assert.equal(h.nodes.get('play').disabled,true);h.reply(0,steady);await p;
  h.play();assert.equal(h.timers.size,1);p=h.load('review');assert.equal(h.timers.size,0);assert.equal(h.state.motion,null);assert.equal(h.state.dropComplete,false);
  h.play();h.step();h.reset();assert.equal(h.timers.size,0);h.reply(1,review);await p;assert.equal(h.state.trace.traceId,review.traceId);assert.equal(h.nodes.get('phase').textContent,'READY');assert.equal(h.nodes.get('play').disabled,false);h.play();assert.equal(h.timers.size,1);
});
test('latest example wins when requests resolve out of order',async()=>{
  const h=harness();const a=h.load('steady'),b=h.load('review');h.reply(1,review);await b;h.play();const timer=h.state.timer;h.reply(0,steady);await a;
  assert.equal(h.state.trace.traceId,review.traceId);assert.equal(h.state.timer,timer);assert.equal(h.timers.size,1);assert.equal(h.nodes.get('play').textContent,'⏸ Pause');
});
test('stale failure cannot unlock current pending load',async()=>{
  const h=harness();const a=h.load('steady'),b=h.load('review');h.pending[0].reject(new Error('old failure'));await a;assert.equal(h.state.loading,true);assert.equal(h.nodes.get('play').disabled,true);h.reply(1,review);await b;assert.equal(h.state.loading,false);
});
test('current failed switch restores prior selection and allows recovery',async()=>{
  const h=harness();let p=h.load('steady');h.reply(0,steady);await p;p=h.load('review');h.pending[1].resolve({ok:false,status:503});await p;
  assert.equal(h.state.trace.traceId,steady.traceId);assert.equal(h.nodes.get('example').value,'steady');assert.equal(h.state.loading,false);assert.equal(h.timers.size,0);h.play();assert.equal(h.timers.size,1);
});
test('pause/resume after a switch retains one timer and supplied result',async()=>{
  const h=harness();const p=h.load('review');h.reply(0,review);await p;h.play();const index=h.state.motionIndex;h.play();assert.equal(h.timers.size,0);assert.equal(h.state.motionIndex,index);h.play();assert.equal(h.timers.size,1);
  while(!h.state.dropComplete)h.advanceMotion();assert.equal(h.timers.size,0);assert.equal(h.nodes.get('resultSigma').textContent,'+2.15σ');assert.equal(h.state.trace.terminalScenario,null);assert.deepEqual(JSON.parse(JSON.stringify(h.state.trace)),review);
});
