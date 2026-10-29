'use strict';
for(const el of document.querySelectorAll('.row-column-sync')){
 const slider=el.querySelector('input'),output=el.querySelector('output');
 const update=()=>{
  const l=Number(slider.value);
  output.value='λ = '+l.toFixed(2);
  el.querySelector('[data-panel="row"]').innerHTML=RowColumn.panel(l,'row','live-row');
  el.querySelector('[data-panel="column"]').innerHTML=RowColumn.panel(l,'column','live-column');
  const s=RowColumn.state(l);
  el.querySelector('.sync-status').textContent=`λ = ${l.toFixed(2)}：第二式 (${s.row[0].toFixed(2)})x + (${s.row[1].toFixed(2)})y = 3；共同解仍为 (1,2)。列系数仍为 1、2。`;
 };
 slider.addEventListener('input',update);
 for(const button of el.querySelectorAll('button'))button.addEventListener('click',()=>{slider.value=button.dataset.lambda;update();});
 update();
}
