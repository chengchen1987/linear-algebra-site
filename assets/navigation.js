/* Reading controls are independent of Quarto's internal part/group navigation.
   Core markup remains readable if this enhancement or preference storage fails. */
(() => {
  const side = document.getElementById('quarto-sidebar');
  const main = document.querySelector('main');
  if (!side || !main || side.dataset.navigationBound) return;
  side.dataset.navigationBound = 'true';
  const margin = document.getElementById('quarto-margin-sidebar');
  const toc = document.getElementById('TOC');
  const hasToc = !!toc?.querySelector('a');
  const media = matchMedia('(min-width: 992px)');
  const key = 'linear-algebra-reading-v1';
  let state = {left:true, right:true, focus:false, before:{left:true,right:true}};
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && ['left','right','focus'].every(k => typeof saved[k] === 'boolean')) {
      state = {...state,...saved};
      if (!state.before || ['left','right'].some(k => typeof state.before[k] !== 'boolean')) state.before = {left:true,right:true};
    }
  } catch (_) { /* A private/blocked store must not disable controls. */ }
  let mobile = {left:false,right:false};
  let mobileBefore = state.beforeMobile && ['left','right'].every(k=>typeof state.beforeMobile[k]==='boolean') ? {...state.beforeMobile} : {...mobile};
  const bar = document.createElement('nav');
  bar.className = 'reading-controls'; bar.setAttribute('aria-label','阅读布局 / Reading Layout');
  const make = (id, zh, en, target, existing) => {
    const b = existing || document.createElement('button');
    b.removeAttribute('data-bs-toggle'); b.removeAttribute('data-bs-target'); b.removeAttribute('onclick');
    b.className = 'reader-toggle'+(id==='reading-left'?' quarto-btn-toggle':'');
    b.id = id; b.type = 'button';
    b.innerHTML = `<span>${zh}<span class="reader-action"></span></span><span class="reader-en" lang="en">${en}</span>`;
    if(target) b.setAttribute('aria-controls',target);
    bar.append(b); return b;
  };
  const left = make('reading-left','课程目录','Course Contents','quarto-sidebar',document.querySelector('button.quarto-btn-toggle'));
  const right = hasToc ? make('reading-right','本页目录','On This Page','quarto-margin-sidebar') : null;
  const focus = make('reading-focus','专注阅读','Focus Reading');
  document.body.prepend(bar);
  document.body.classList.add('reading-ready');
  const save = () => {try {localStorage.setItem(key,JSON.stringify(state));} catch (_) {}};
  const locate = () => {
    const current = side.querySelector('[aria-current="page"]');
    if (!current || !side.clientHeight) return;
    const a=current.getBoundingClientRect(), b=side.getBoundingClientRect();
    if (a.top<b.top || a.bottom>b.bottom) side.scrollTop += a.top-b.top-(side.querySelector('.current-chapter>.sidebar-item-container')?.offsetHeight||80)-24;
  };
  const visible = k => !state.focus && (media.matches ? state[k] : mobile[k]);
  function apply(preserve=false) {
    // Keep a nearby paragraph/heading at the same viewport height across reflow.
    const y = bar.getBoundingClientRect().bottom;
    const anchor = preserve ? [...main.querySelectorAll('h1,h2,h3,p,summary,tr')].find(e => {const r=e.getBoundingClientRect(); return r.height && r.bottom>y && r.top<innerHeight;}) : null;
    const oldTop = anchor?.getBoundingClientRect().top;
    const l=visible('left'), r=hasToc && visible('right');
    for (const [node,button,shown,label] of [[side,left,l,'课程目录 / Course Contents'],[margin,right,r,'本页目录 / On This Page']]) {
      if (!node) continue;
      if (!shown && node.contains(document.activeElement)) (button||focus).focus({preventScroll:true});
      node.inert = !shown; node.setAttribute('aria-hidden',String(!shown));
      if (button) {
        button.setAttribute('aria-expanded',String(shown));
        button.setAttribute('aria-label',`${shown?'收起 / Hide':'展开 / Show'} ${label}`);
        button.querySelector('.reader-action').textContent=shown?' · 收起':' · 展开';
      }
    }
    document.body.classList.toggle('reading-left-open',l);
    document.body.classList.toggle('reading-right-open',r);
    document.body.classList.toggle('reading-focus',state.focus);
    focus.setAttribute('aria-pressed',String(state.focus));
    focus.setAttribute('aria-label',state.focus?'退出专注阅读 / Exit Focus Reading':'进入专注阅读 / Enter Focus Reading');
    focus.querySelector('.reader-action').textContent=state.focus?' · 退出':' · 进入';
    document.documentElement.style.setProperty('--reading-bar-height',`${bar.offsetHeight}px`);
    requestAnimationFrame(() => {
      if (anchor) window.scrollBy({top:anchor.getBoundingClientRect().top-oldTop,behavior:'instant'});
    });
  }
  function toggle(k) {
    if (state.focus) {state.focus=false; Object.assign(state,state.before); mobile={...mobileBefore}; if(media.matches) state[k]=true; else mobile[k]=true;}
    else if (media.matches) state[k]=!state[k]; else {mobile[k]=!mobile[k]; if(mobile[k]) mobile[k==='left'?'right':'left']=false;}
    apply(true);save();if(k==='left'&&visible('left'))locate();
  }
  left.addEventListener('click',()=>toggle('left'));
  right?.addEventListener('click',()=>toggle('right'));
  focus.addEventListener('click',()=>{
    if (state.focus) {state.focus=false;Object.assign(state,state.before);mobile={...mobileBefore};}
    else {state.before={left:state.left,right:state.right};mobileBefore={...mobile};state.beforeMobile={...mobile};state.focus=true;}
    apply(true);save();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&!media.matches&&(mobile.left||mobile.right)) {
      const b=mobile.left?left:right;mobile={left:false,right:false};apply();b?.focus({preventScroll:true});
    }
  });
  toc?.addEventListener('click',e=>{if(!media.matches&&e.target.closest('a')){mobile.right=false;apply();right?.focus({preventScroll:true});}});
  media.addEventListener('change',()=>{mobile={left:false,right:false};apply(true);});
  new ResizeObserver(()=>document.documentElement.style.setProperty('--reading-bar-height',`${bar.offsetHeight}px`)).observe(bar);
  apply(); if(media.matches&&visible('left'))locate();
})();
