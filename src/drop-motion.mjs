function clamp(value,min,max){
  return Math.min(max,Math.max(min,value));
}

function lerp(a,b,t){
  return a+(b-a)*t;
}

export function seededRandom(seed=1){
  let value=(Number(seed)>>>0)||1;
  return ()=>{
    value+=0x6D2B79F5;
    let t=value;
    t=Math.imul(t^(t>>>15),t|1);
    t^=t+Math.imul(t^(t>>>7),t|61);
    return((t^(t>>>14))>>>0)/4294967296;
  };
}

function groupRows(pegs){
  const rows=new Map();
  for(const peg of pegs||[]){
    const key=Number.isInteger(peg.row)?peg.row:0;
    if(!rows.has(key))rows.set(key,[]);
    rows.get(key).push(peg);
  }
  return [...rows.entries()]
    .sort((a,b)=>a[0]-b[0])
    .map(([row,items])=>({
      row,
      items:items.slice().sort((a,b)=>a.x-b.x),
      y:items.reduce((sum,p)=>sum+p.y,0)/items.length
    }));
}

function nearestPeg(items,x){
  return items.reduce((best,peg)=>
    !best||Math.abs(peg.x-x)<Math.abs(best.x-x)?peg:best
  ,null);
}

function densify(anchors,samplesPerSegment){
  const points=[];
  for(let i=0;i<anchors.length-1;i++){
    const a=anchors[i];
    const b=anchors[i+1];
    const samples=Math.max(1,samplesPerSegment);
    for(let s=0;s<samples;s++){
      const raw=s/samples;
      const t=raw*raw*(3-2*raw);
      points.push({
        x:lerp(a.x,b.x,t),
        y:lerp(a.y,b.y,t)
      });
    }
  }
  points.push({...anchors.at(-1)});
  return points;
}

export function buildVisualDropPath(scene,{seed=1,samplesPerSegment=3}={}){
  if(!scene||!Number.isFinite(scene.width)||!Number.isFinite(scene.height)){
    throw new Error("scene width/height required");
  }

  const rng=seededRandom(seed);
  const rows=groupRows(scene.cosmeticPegs);
  const targetX=Number.isFinite(scene.deviationTargetX)
    ?scene.deviationTargetX
    :scene.width/2;

  const firstRowY=rows[0]?.y??Math.max(64,scene.height*.16);
  const startY=Math.max(24,firstRowY-Math.min(54,scene.height*.08));
  const landingY=Math.max(startY+40,scene.height-Math.min(54,scene.height*.09));
  const sideMargin=Math.max(24,Math.min(48,scene.width*.07));

  let currentX=scene.width/2;
  const anchors=[{x:currentX,y:startY}];

  for(const row of rows){
    if(row.y<=startY||row.y>=landingY)continue;

    const progress=clamp((row.y-startY)/(landingY-startY),0,1);
    const pull=progress*progress;
    const guide=lerp(scene.width/2,targetX,pull);
    const jitter=(rng()*2-1)*(1-progress)*Math.min(56,scene.width*.085);
    const desired=currentX*.35+(guide+jitter)*.65;
    const peg=nearestPeg(row.items,desired);
    const side=rng()<.5?-1:1;
    const passOffset=side*(5+rng()*8);
    const nextX=clamp((peg?.x??desired)+passOffset,sideMargin,scene.width-sideMargin);

    anchors.push({x:nextX,y:row.y+Math.min(9,scene.height*.015)});
    currentX=nextX;
  }

  anchors.push({x:targetX,y:landingY});

  return{
    seed:Number(seed)>>>0,
    targetX,
    landingY,
    anchors,
    points:densify(anchors,samplesPerSegment)
  };
}
