import{buildBoardScene}from"/src/trace-layout.mjs";

const EXAMPLES={steady:"/examples/steady.json",review:"/examples/human-review.json"};
const COLORS={code:"#69a7ff",judgment:"#9c7cff",policy:"#f0b75f",review:"#ff8d6b",branch:"#65d6a6"};
const state={trace:null,scene:null,index:-1,timer:null};
const $=id=>document.getElementById(id);
const svg=$("board");

function el(name,attrs={}){
  const n=document.createElementNS("http://www.w3.org/2000/svg",name);
  for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));
  return n;
}

function fmt(step){
  const s=step?.summary||{};
  if(s.primitive==="noul"&&Number.isFinite(s.answer))return s.answer.toFixed(2);
  if(s.topLevel)return s.topLevel;
  if(s.answer!=null)return String(s.answer);
  if(s.scenarioId)return s.scenarioId;
  return"—";
}

function sigmaLabel(value){
  if(!Number.isFinite(value))return"—";
  return(value>=0?"+":"")+value.toFixed(2)+"σ";
}

function resultCopy(deviation){
  if(!deviation)return{title:"No deviation supplied",message:"This trace does not include a baseline deviation.",tone:"unknown"};
  const byBand={
    normal:["Within the usual range","This observation sits close to its supplied baseline.","normal"],
    elevated:["A little outside the usual range","This observation is somewhat away from its supplied baseline.","elevated"],
    high:["Well outside the usual range","This observation is clearly away from its supplied baseline.","high"],
    critical:["Far outside the usual range","This observation is far from its supplied baseline.","critical"],
    unknown:["Deviation available","The trace did not classify this deviation band.","unknown"]
  };
  const [title,message,tone]=byBand[deviation.band]||byBand.unknown;
  return{title,message,tone};
}

function probabilities(step){
  const root=$("probabilities");
  const p=step?.summary?.probabilities;
  if(!p){
    root.innerHTML='<p class="muted small">Shown only when a judgment step supplies them.</p>';
    return;
  }
  root.innerHTML=Object.entries(p)
    .sort((a,b)=>b[1]-a[1])
    .map(([k,v])=>'<div class="prob-row"><span>'+k+'</span><div class="track"><div class="fill" style="width:'+Math.round(v*100)+'%"></div></div><strong>'+Math.round(v*100)+'%</strong></div>')
    .join("");
}

function inspect(i){
  const p=state.scene?.semanticPegs[i];
  if(!p){
    $("pegTitle").textContent="No semantic peg selected";
    $("pegNote").textContent="Run the drop or select a colored peg.";
    ["kind","answer","confidence","route"].forEach(id=>$(id).textContent="—");
    probabilities(null);
    return;
  }
  $("pegTitle").textContent=p.label;
  $("pegNote").textContent=p.kindLabel+" · "+p.nodeId;
  $("kind").textContent=p.kind;
  $("answer").textContent=fmt(p);
  $("confidence").textContent=Number.isFinite(p.summary?.confidence)?p.summary.confidence.toFixed(2):"—";
  $("route").textContent=p.routeTo||"terminal";
  probabilities(p);
}

function isComplete(){
  return Boolean(state.scene&&state.index>=state.scene.semanticPegs.length-1);
}

function syncExperience(){
  if(!state.scene)return;
  const complete=isComplete();
  const dropping=Boolean(state.timer);
  const phase=state.index<0?"READY":dropping?"DROPPING":complete?"RESULT":"TRACE";
  $("phase").textContent=phase;

  const result=$("result");
  if(!complete){
    result.className="result-card pending";
    $("resultSigma").textContent="—";
    $("resultBand").textContent=state.index<0?"Ready for Sigma Drop":"Reading the supplied trace…";
    $("resultMessage").textContent="The result appears after the semantic trace reaches its final supplied state.";
    $("status").textContent=state.index<0?"ready":"in progress";
    $("terminal").textContent="—";
    return;
  }

  const d=state.scene.deviation;
  const copy=resultCopy(d);
  result.className="result-card "+copy.tone;
  $("resultSigma").textContent=d?sigmaLabel(d.value):"—";
  $("resultBand").textContent=copy.title;
  $("resultMessage").textContent=copy.message;
  $("status").textContent=state.trace.status;
  $("terminal").textContent=state.trace.terminalScenario||"human review";
}

function drawSigmaScale(s){
  if(s.deviationIndex<0)return;
  const peg=s.semanticPegs[s.deviationIndex];
  const top=Math.max(34,peg.y-56);
  const bottom=Math.min(s.height-42,peg.y+58);

  const tag=el("text",{x:44,y:top-12,class:"scale-title"});
  tag.textContent="DEVIATION SCALE";
  svg.append(tag);

  s.sigmaGuides.forEach(g=>{
    svg.append(el("line",{x1:g.x,x2:g.x,y1:top,y2:bottom,class:"guide"}));
    const t=el("text",{x:g.x,y:bottom+17,"text-anchor":"middle",class:"guide-label"});
    t.textContent=g.value===0?"μ":(g.value>0?"+":"")+g.value+"σ";
    svg.append(t);
  });
}

function render(){
  const s=state.scene;
  svg.setAttribute("viewBox","0 0 "+s.width+" "+s.height);
  svg.replaceChildren();

  drawSigmaScale(s);

  s.cosmeticPegs.forEach(p=>svg.append(el("circle",{cx:p.x,cy:p.y,r:2.3,class:"decor"})));

  if(s.path.length>1){
    const d=s.path.map((p,i)=>(i?"L ":"M ")+p.x+" "+p.y).join(" ");
    svg.append(el("path",{d,class:"path"}));
  }

  s.semanticPegs.forEach((p,i)=>{
    const active=i<=state.index;
    const halo=el("circle",{cx:p.x,cy:p.y,r:active?18:13,class:"halo",stroke:COLORS[p.kind]||"#fff"});
    halo.style.opacity=active?".22":".06";
    svg.append(halo);

    const dot=el("circle",{cx:p.x,cy:p.y,r:active?9:6,class:"semantic "+p.kind});
    dot.style.opacity=active?"1":".38";
    dot.style.cursor="pointer";
    dot.addEventListener("click",()=>{
      state.index=i;
      inspect(i);
      syncExperience();
      render();
    });
    svg.append(dot);

    const label=el("text",{x:p.x+14,y:p.y-11,class:"peg-label"});
    label.textContent=p.sequence+". "+p.kindLabel;
    label.style.opacity=active?"1":".32";
    svg.append(label);
  });

  if(state.index>=0){
    const p=s.semanticPegs[state.index];
    svg.append(el("circle",{cx:p.x,cy:p.y,r:7,class:"ball"}));
  }
}

function stop(){
  if(state.timer)clearInterval(state.timer);
  state.timer=null;
  $("play").textContent="▶ Sigma Drop";
  syncExperience();
}

function reset(){
  stop();
  state.index=-1;
  inspect(-1);
  syncExperience();
  render();
}

function step(){
  const max=state.scene.semanticPegs.length-1;
  if(state.index>=max)state.index=-1;
  state.index++;
  inspect(state.index);
  syncExperience();
  render();
  if(state.index>=max)stop();
}

function play(){
  reset();
  $("play").textContent="⏸ Pause";
  step();
  state.timer=setInterval(step,650);
  syncExperience();
}

async function load(key){
  stop();
  const r=await fetch(EXAMPLES[key]);
  state.trace=await r.json();
  state.scene=buildBoardScene(state.trace);
  state.index=-1;
  $("title").textContent=state.trace.title||state.trace.traceId;
  inspect(-1);
  syncExperience();
  render();
}

$("example").addEventListener("change",e=>load(e.target.value));
$("play").addEventListener("click",()=>state.timer?stop():play());
$("step").addEventListener("click",()=>{stop();step()});
$("reset").addEventListener("click",reset);

load("steady").catch(console.error);
