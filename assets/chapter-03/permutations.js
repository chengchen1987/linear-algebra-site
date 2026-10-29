/* No runtime dependencies; the static table remains visible in every state. */
(()=>{
 const data=JSON.parse(document.getElementById('permutation-data').textContent);
 const choice=document.getElementById('permutation-choice'),feedback=document.getElementById('permutation-feedback');
 function update(){
  const r=data.rows[Number(choice.value)];
  for(const cell of document.querySelectorAll('.selection-matrix td')){
   const selected=r.p[Number(cell.dataset.row)-1]===Number(cell.dataset.col);
   cell.classList.toggle('selected',selected);
   cell.setAttribute('aria-label',`位置(${cell.dataset.row},${cell.dataset.col})，${cell.firstChild.textContent}${selected?'，选中':''}`);
  }
  const pairs=r.pairs.length?r.pairs.map(p=>`(${p.join(',')})`).join('、'):'无';
  feedback.textContent=`排列 (${r.p.join(',')})；选中位置 ${r.p.map((c,i)=>`(${i+1},${c})`).join('、')}；逆序对 ${pairs}；N=${r.pairs.length}；符号 ${r.sign===1?'+1':'−1'}；乘积 ${r.values.map(x=>`(${x})`).join('×')}=${r.product}；带符号项 ${r.sign===1?'+':'−'}${r.term}=${r.signed}；六项总和 ${data.sum}。`;
 }
 choice.disabled=false;choice.addEventListener('change',update);update();
})();
