// playwright-cli run-code --filename=scripts/mobile-note-regression.cjs
async page => {
 const results=[];
 for(const width of [320,360,390,430,720,844,1280]){
  await page.setViewportSize({width,height:width===844?390:844});await page.goto('http://127.0.0.1:4187/');await page.waitForFunction(()=>!document.querySelector('#play').disabled);await page.locator('#play').click();await page.waitForFunction(()=>document.querySelector('#phase').textContent==='RESULT');
  const g=await page.evaluate(()=>({noteTop:document.querySelector('.scale-note').getBoundingClientRect().top,labelBottom:Math.max(...[...document.querySelectorAll('.guide-label')].map(e=>e.getBoundingClientRect().bottom)),svgHeight:document.querySelector('#board').getBoundingClientRect().height,sigma:document.querySelector('#resultSigma').textContent}));
  if(g.noteTop<g.labelBottom || (width<=720&&g.svgHeight!==430))throw new Error(JSON.stringify({width,...g}));
  await page.locator('#result').scrollIntoViewIfNeeded();await page.screenshot({path:'output/playwright/fixed-'+width+'.png'});results.push({width,...g});
 }
 return results;
}
