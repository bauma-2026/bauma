// Reproducible export: node export.cjs   (run from this folder, or anywhere: paths are resolved from __dirname)
// Another template: node export.cjs <input.html> <output.png>. Without arguments it exports the SL candidate as before; with an
// output, the previews and the check file are written next to it, prefixed with its name (e.g. <name>-preview-600x315.png).
// Uses the project's existing playwright-core (Chromium) and sharp; nothing is installed, no server is needed (file://).
const path=require('path');const fs=require('fs');
const root=path.resolve(__dirname,'../../..');
const {chromium}=require(path.join(root,'node_modules/playwright-core'));
const sharp=require(path.join(root,'node_modules/sharp'));
const input=process.argv[2]?path.resolve(process.argv[2]):path.join(__dirname,'og-main-candidate.html');
const out=process.argv[3]?path.resolve(process.argv[3]):path.join(__dirname,'bauma-og-main-candidate.png');
const side=(name)=>path.join(path.dirname(out),process.argv[3]?path.basename(out,'.png')+'-'+name:name);
const html='file://'+input;
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1200,height:630},deviceScaleFactor:1});const p=await c.newPage();
 await p.goto(html,{waitUntil:'load'});
 await p.evaluate(async()=>{const t=document.querySelector('h1').innerText,em=document.querySelector('h1 em').textContent;await document.fonts.ready;await Promise.all([document.fonts.load('112px "DM Serif Display"',t+' č š ž'),document.fonts.load('italic 112px "DM Serif Display"',em)])});
 const check=await p.evaluate(()=>({normal:document.fonts.check('112px "DM Serif Display"',document.querySelector('h1').innerText+' č š ž'),italic:document.fonts.check('italic 112px "DM Serif Display"',document.querySelector('h1 em').textContent),faces:[...document.fonts].filter(f=>f.family.includes('DM Serif')).map(f=>f.style+':'+f.status),
   logoLoaded:(()=>{const i=document.querySelector('.mark');return i.complete&&i.naturalWidth>0})(),h1:document.querySelector('h1').innerText,
   lines:[...document.querySelectorAll('h1 .line')].map(l=>{const r=document.createRange();r.selectNodeContents(l);const q=r.getBoundingClientRect();return {t:l.textContent,left:Math.round(q.left),right:Math.round(q.right),top:Math.round(q.top),bottom:Math.round(q.bottom)}}),
   mark:(()=>{const q=document.querySelector('.mark').getBoundingClientRect();return {left:Math.round(q.left),top:Math.round(q.top),right:Math.round(q.right),bottom:Math.round(q.bottom)}})(),
   overflow:{x:document.documentElement.scrollWidth>1200,y:document.documentElement.scrollHeight>630}}));
 if(!check.normal||!check.italic||check.faces.some(f=>!/loaded/.test(f))&&false)throw new Error('fonts not loaded: '+JSON.stringify(check));
 await p.screenshot({path:out,clip:{x:0,y:0,width:1200,height:630}});await b.close();
 const m=await sharp(out).metadata();
 for(const [w,h] of [[600,315],[300,158]])await sharp(out).resize(w,h,{kernel:'lanczos3'}).toFile(side(`preview-${w}x${h}.png`));
 fs.writeFileSync(side('export-check.json'),JSON.stringify({png:{width:m.width,height:m.height,format:m.format},...check},null,1));
 console.log(JSON.stringify({png:`${m.width}x${m.height}`,...check},null,1));
})();
