const BRANCH_X={maintain:.24,experiment:.5,transition:.76,human_review:.5};
const SCORE_X={low:.27,medium:.43,high:.61,critical:.78};
const SIGMA_VALUES=[-2,-1,0,1,2];

export function clamp(v,min,max){return Math.min(max,Math.max(min,v));}

function hash01(value){
  let h=2166136261;
  for(const ch of String(value??"")){
    h^=ch.charCodeAt(0);
    h=Math.imul(h,16777619);
  }
  return (h>>>0)/4294967295;
}

export function semanticX(step,prev=.5){
  if(!step)return prev;
  const s=step.summary||{};
  if(step.kind==="code"&&s.deviation&&Number.isFinite(s.deviation.value))return prev;
  if(step.kind==="judgment"){
    if(s.primitive==="noul"&&Number.isFinite(s.answer))return clamp(.18+clamp(s.answer,0,1)*.64,.18,.82);
    if(s.primitive==="score"&&s.topLevel)return SCORE_X[s.topLevel]??(.2+hash01(s.topLevel)*.6);
    if(s.primitive==="choice"&&s.answer!=null)return .2+hash01(s.answer)*.6;
  }
  if(step.kind==="policy")return BRANCH_X[step.routeTo]??prev;
  if(step.kind==="review")return .5;
  if(step.kind==="branch")return BRANCH_X[s.scenarioId]??BRANCH_X[step.nodeId]??prev;
  return prev;
}

export function sigmaX(value,{width=760,marginX=58}={}){
  const usableWidth=width-marginX*2;
  const sigmaStep=Math.min(92,usableWidth/6.5);
  return width/2+clamp(value,-2.5,2.5)*sigmaStep;
}

export function buildCosmeticPegs(rows=12){
  const out=[];
  for(let row=0;row<rows;row++){
    const count=row+3;
    const y=.08+row*(.68/Math.max(1,rows-1));
    const span=.18+row*(.62/Math.max(1,rows-1));
    for(let i=0;i<count;i++){
      const t=count===1?.5:i/(count-1);
      out.push({id:"decor-"+row+"-"+i,semantic:false,x:.5-span/2+t*span,y,row});
    }
  }
  return out;
}

export function buildBoardScene(trace,{width=760,height=760,rows=12}={}){
  if(!trace||!Array.isArray(trace.steps)||!trace.steps.length)throw new Error("trace.steps required");

  const marginX=58;
  const marginTop=82;
  const marginBottom=82;
  const usableWidth=width-marginX*2;
  const usableHeight=height-marginTop-marginBottom;

  let prev=.5;
  const semanticPegs=trace.steps.map((step,index)=>{
    const deviationValue=step.summary?.deviation?.value;
    const hasDeviation=step.kind==="code"&&Number.isFinite(deviationValue);
    const baseXNorm=semanticX(step,prev);
    const x=hasDeviation?sigmaX(deviationValue,{width,marginX}):marginX+baseXNorm*usableWidth;
    const xNorm=(x-marginX)/usableWidth;
    prev=xNorm;
    const yNorm=trace.steps.length===1?.5:index/(trace.steps.length-1);
    return {
      ...step,
      semantic:true,
      kindLabel:step.kind.toUpperCase(),
      xNorm,
      yNorm,
      x,
      y:marginTop+yNorm*usableHeight
    };
  });

  const cosmeticPegs=buildCosmeticPegs(rows).map(p=>({
    ...p,
    x:marginX+p.x*usableWidth,
    y:marginTop+p.y*usableHeight
  }));

  const deviationIndex=trace.steps.findIndex(s=>s.summary?.deviation&&Number.isFinite(s.summary.deviation.value));
  const deviation=deviationIndex>=0?trace.steps[deviationIndex].summary.deviation:null;
  const sigmaGuides=SIGMA_VALUES.map(value=>({value,x:sigmaX(value,{width,marginX})}));

  return {
    width,
    height,
    semanticPegs,
    cosmeticPegs,
    path:semanticPegs.map(p=>({x:p.x,y:p.y,nodeId:p.nodeId})),
    deviation,
    deviationIndex,
    sigmaGuides,
    status:trace.status,
    terminalScenario:trace.terminalScenario??null
  };
}
