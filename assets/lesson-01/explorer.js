'use strict';
const scene=document.querySelector('#scene'), preset=document.querySelector('#preset');
let stage=1, yaw=RowScene.defaults.yaw, pitch=RowScene.defaults.pitch, drag=null;
function draw() {
  scene.innerHTML=`<style>${RowScene.style}</style>`+RowScene.render(stage,yaw,pitch);
  scene.dataset.stage=stage; scene.dataset.yaw=yaw; scene.dataset.pitch=pitch;
  scene.setAttribute('aria-label',`${RowScene.stages[stage].zh} / ${RowScene.stages[stage].en}; 方向键旋转 / Arrow keys rotate`);
}
function setStage(value) {
  stage=Number(value); preset.value=String(stage);
  const s=RowScene.stages[stage];
  document.querySelector('#equations').innerHTML='<strong>当前约束（active constraints）</strong><br>'+ (s.active.length?s.active.map(i=>`${RowScene.planes[i].label}: ${RowScene.planes[i].eq}`).join('<br>'):'无 / None');
  document.querySelector('#result').innerHTML=`<strong>全部方程的解集（solution set）</strong><br>${s.zh} / ${s.en}<p>${s.explanation}</p>`;
  draw();
}
function rotate(dx,dy) {yaw+=dx; pitch=Math.max(-1.2,Math.min(1.2,pitch+dy));draw();}
preset.addEventListener('change',()=>setStage(preset.value));
document.querySelector('#reset').addEventListener('click',()=>{yaw=RowScene.defaults.yaw;pitch=RowScene.defaults.pitch;draw();});
document.querySelector('#clear').addEventListener('click',()=>setStage(0));
for(const [id,dx,dy] of [['left',-.18,0],['right',.18,0],['up',0,.14],['down',0,-.14]]) document.querySelector('#'+id).addEventListener('click',()=>rotate(dx,dy));
scene.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];scene.setPointerCapture(e.pointerId);scene.focus();});
scene.addEventListener('pointermove',e=>{if(drag){rotate((e.clientX-drag[0])*.008,(e.clientY-drag[1])*.008);drag=[e.clientX,e.clientY];}});
for(const event of ['pointerup','pointercancel','lostpointercapture']) scene.addEventListener(event,()=>{drag=null;});
scene.addEventListener('keydown',e=>{const d={ArrowLeft:[-.18,0],ArrowRight:[.18,0],ArrowUp:[0,.14],ArrowDown:[0,-.14]}[e.key];if(d){e.preventDefault();rotate(...d);}});
setStage(1);
// Inform the parent of wrapping changes after presets, font loads and resizing.
function reportHeight(){
  if(window.parent!==window)window.parent.postMessage({type:'row-picture-size',height:Math.ceil(document.querySelector('main').getBoundingClientRect().height)},'*');
}
new ResizeObserver(reportHeight).observe(document.querySelector('main'));
window.addEventListener('message',event=>{if(event.source===window.parent&&event.data?.type==='row-picture-request-size')reportHeight();});
document.fonts.ready.then(reportHeight);
