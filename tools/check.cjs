const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({headless:true,channel:'msedge'});
  const root=path.resolve(__dirname,'..');
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});
  const report=[];
  for (const viewport of [{width:1280,height:1000},{width:390,height:844}]) {
    const page=await browser.newPage({viewport});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(process.env.AR_TEST_URL || 'http://127.0.0.1:8766/');
    await page.waitForFunction(()=>document.querySelector('model-viewer').loaded,null,{timeout:30000});
    const state=await page.evaluate(()=>({loaded:document.querySelector('model-viewer').loaded,
      status:document.querySelector('#status').textContent,
      horizontalOverflow:document.documentElement.scrollWidth>innerWidth,
      dimensions:document.querySelector('model-viewer').getDimensions(),
      arScale:document.querySelector('model-viewer').arScale,
      buttonDisabled:document.querySelector('#start-ar').disabled}));
    await page.screenshot({path:path.join(root,'qa',viewport.width===390?'mobile.png':'desktop.png'),fullPage:true});
    report.push({viewport,...state,errors});
    if (!state.loaded || state.horizontalOverflow || errors.length || Math.abs(state.dimensions.y-1)>0.001) throw Error(JSON.stringify(report));
    await page.close();
  }
  const page=await browser.newPage();
  await page.route('**/ghost.glb',route=>route.abort());
  await page.goto(process.env.AR_TEST_URL || 'http://127.0.0.1:8766/');
  await page.waitForFunction(()=>!document.querySelector('#retry').hidden);
  report.push({scenario:'model-error',status:await page.locator('p#status').innerText(),retry:await page.locator('#retry').isVisible(),disabled:await page.locator('#start-ar').isDisabled()});
  await browser.close();
  fs.writeFileSync(path.join(root,'qa','browser-report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
