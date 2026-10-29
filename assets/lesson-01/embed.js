// Size the same-origin lesson frame to its content so controls/legends stay visible.
(() => {
  const frame=document.querySelector('.row-explorer');
  if(!frame)return;
  window.addEventListener('message',event=>{
    if(event.source!==frame.contentWindow || event.origin!==location.origin)return;
    if(event.data?.type==='row-picture-size' && Number.isFinite(event.data.height))
      frame.style.height=Math.max(500,Math.min(2500,event.data.height+4))+'px';
  });
  const request=()=>frame.contentWindow.postMessage({type:'row-picture-request-size'},location.origin==='null'?'*':location.origin);
  frame.addEventListener('load',request);request();
})();
