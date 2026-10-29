/* Add a visible hint only where a displayed equation actually overflows. */
(function(){
 const update=()=>{
  const hosts=new Map();
  for(const math of document.querySelectorAll('math[display="block"]')){
   const host=math.closest('p');
   if(!host)continue;
   const wide=math.clientWidth>0&&math.scrollWidth>math.clientWidth+2;
   hosts.set(host,(hosts.get(host)||false)||wide);
   if(wide){math.setAttribute('tabindex','0');math.setAttribute('aria-label','可左右滚动的公式');}
   else{math.removeAttribute('tabindex');math.removeAttribute('aria-label');}
  }
  for(const [host,wide] of hosts)host.classList.toggle('math-overflow',wide);
 };
 let scheduled=false;
 const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;update();});}};
 document.addEventListener('toggle',schedule,true);
 window.addEventListener('resize',schedule);
 document.fonts.ready.then(schedule);
 schedule();
})();
