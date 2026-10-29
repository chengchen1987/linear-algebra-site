/* Shared HTML widget; fixed origin, current position vectors, and an auxiliary displacement. */
(function(){for(const host of document.querySelectorAll('.solution-explorer')){
 const input=host.querySelector('input'),picture=host.querySelector('.solution-picture'),output=host.querySelector('output');
 const matrixLabel=host.closest('[data-matrix-label]')?.dataset.matrixLabel;
 if(!['A','B'].includes(matrixLabel))throw new Error('Solution explorer requires an explicit matrix label A or B');
 function update(){
  const t=Number(input.value),s=ChapterOne.state(t),coords=v=>v.map(x=>Number(x.toFixed(2))).join(', ');
  picture.innerHTML=ChapterOne.solutionSvg(t,matrixLabel);
  output.textContent=`t = ${t.toFixed(2)}；蓝点 t u=(${coords(s.h)})；橙点 x(t)=(${coords(s.x)})。${t===0?'齐次向量为零：只显示原点，不画零箭头；橙点与特解重合；此时位移与橙色位置箭头重合，省去灰虚箭头。':'两支位置箭头都从固定原点 O 出发。'}位移始终等于 xₚ，非零参数时用灰色虚箭头辅助表示。${matrixLabel}(t u)=0，${matrixLabel}x(t)=(2, 5)；输出属于另一个空间 R²。`;
  host.dataset.t=String(t);host.dataset.matrixLabel=matrixLabel;
 }
 input.addEventListener('input',update);
 for(const button of host.querySelectorAll('button'))button.addEventListener('click',()=>{input.value=button.dataset.t;update();});
 update();
}})();
