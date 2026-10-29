/* Shared deterministic geometry for static SVGs and the optional t control. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ChapterOne=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const blue='#176b91',orange='#bd5b18',green='#28734d',red='#ad2840',ink='#273c4b';
 const xp=[1,1,0],h=[-2,1,1],A=[[1,1,1],[2,3,1]],C=[[1,0],[0,1],[1,1]];
 const add=(a,b)=>a.map((v,i)=>v+b[i]),scale=(c,a)=>a.map(v=>c*v),mv=(M,v)=>M.map(row=>row.reduce((s,x,i)=>s+x*v[i],0));
 const project=(v,o=[220,210],s=1)=>[o[0]+s*(34*v[0]-22*v[1]),o[1]+s*(8*v[0]+27*v[1]-45*v[2])];
 const f=n=>Number(n.toFixed(2));
 const pt=p=>p.map(f).join(',');
 const line=(a,b,color=ink,extra='')=>`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${color}" ${extra.includes('stroke-width')?'':'stroke-width="2"'} ${extra}/>`;
 const label=(p,s,color=ink,extra='')=>`<text x="${p[0]}" y="${p[1]}" fill="${color}" ${extra}>${s}</text>`;
 const dot=(p,color,r=5,extra='')=>`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${color}" ${extra}/>`;
 function shell(title,desc,body){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 410" role="img" aria-label="${title}"><title>${title}</title><desc>${desc}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs><rect width="1000" height="410" fill="#fff"/><g font-family="DejaVu Sans, sans-serif" font-size="17">${body}</g></svg>`;}
 function axes3(o,s,names){let out='';for(let j=0;j<3;j++){const v=[0,0,0];v[j]=1.7;const end=project(v,o,s);out+=line(o,end,'#87959f','marker-end="url(#arrow)"')+label(add(end,[j===1?-20:7,j===2?-7:12]),names[j],'#62707b');}return out;}
 function state(t){return {t,h:scale(t,h),x:add(xp,scale(t,h)),zero:mv(A,scale(t,h)),b:mv(A,add(xp,scale(t,h)))};}
 function solutionSvg(t=.5,matrixLabel='A'){
  const symbol=matrixLabel==='B'?'B':'A',st=state(t),o=[345,255],p=v=>project(v,o,1.7);
  const p0=p(st.h),p1=p(st.x),isZero=Math.abs(t)<1e-12;
  const arrow=(a,b,color,role,extra='')=>line(a,b,color,`data-role="${role}" stroke-width="4" marker-end="url(#solution-arrow)" ${extra}`);
  let out=label([25,33],'输入 R³：解的点集 / Input solution sets')+
    label([25,61],'固定原点 O；二维投影 / Fixed origin; 2D projection',ink,'font-size="16"');
  out+='<rect x="700" y="12" width="285" height="450" rx="8" fill="#f4f7f9" stroke="#d6e0e6"/>';
  out+=label([718,40],'输出 R² / Output',ink,'font-size="20"');
  // Coordinate axes stay fixed for every parameter value.
  for(let j=0;j<3;j++){
   const v=[0,0,0];v[j]=2;
   const end=p(v);out+=line(o,end,'#9aa8b1','marker-end="url(#solution-arrow)"');
   out+=label(add(end,[j===1?-25:5,j===2?-9:19]),['x₁','x₂','x₃'][j],'#62707b','font-size="16"');
  }
  for(const [base,color,role] of [[[0,0,0],blue,'homogeneous-set'],[xp,orange,'nonhomogeneous-set']]){
   out+=line(p(add(base,scale(-1.6,h))),p(add(base,scale(1.6,h))),color,`data-role="${role}" stroke-width="2" opacity=".65"`);
  }
  out+=label([70,124],'S₀ = {t u : t ∈ R}',blue)+label([82,447],'Sᵦ = {xₚ + t u : t ∈ R}',orange);
  // A position vector always starts at O; the zero vector has no direction.
  if(!isZero)out+=arrow(o,p0,blue,'homogeneous-vector');
  out+=arrow(o,p1,orange,'solution-vector');
  if(!isZero)out+=line(p0,p1,'#66737b','data-role="displacement" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#solution-arrow)"');
  if(!isZero)out+=label([(p0[0]+p1[0])/2+16,(p0[1]+p1[1])/2],'＋xₚ','#4f5c65','font-size="17"');
  out+=dot(p0,blue,6,'data-role="homogeneous-point"')+dot(p1,orange,6,'data-role="solution-point"');
  out+=dot(o,ink,3,'data-role="origin"');
  out+=label([o[0]-20,o[1]+22],'O',ink,'font-size="18"');
  if(isZero){
   out+=label([o[0]-135,o[1]-23],'t u = 0（零向量）',blue,'font-size="17"');
   out+=label([p1[0]+16,p1[1]+24],'x(t) = xₚ',orange,'font-size="17"');
  }else{
   out+=label(add(p0,t>0?[-80,-17]:[12,-12]),'t u',blue,'font-size="18"');
   out+=label(add(p1,t>0?[-130,27]:[-58,30]),'x(t) = xₚ + t u',orange,'font-size="17"');
  }
  // A separate output panel; map arrows denote correspondence, not displacement.
  out+=label([720,85],`${symbol}: S₀ ↦ {0}`,blue,'font-size="18"')+
       label([720,115],`${symbol}: Sᵦ ↦ {b}`,orange,'font-size="18"');
  const oo=[757,395],bb=[817,245];
  out+=line(oo,[944,395],'#9aa8b1','marker-end="url(#solution-arrow)"')+
       line(oo,[757,175],'#9aa8b1','marker-end="url(#solution-arrow)"');
  out+=label([948,416],'y₁')+label([741,165],'y₂');
  out+=arrow(oo,bb,orange,'output-vector')+dot(oo,blue,5)+dot(bb,orange,6);
  out+=label([737,421],'0',blue)+label([827,244],'b = (2, 5)',orange,'font-size="17"');
  out+=label([720,450],`${symbol}(t u) = 0;  ${symbol} x(t) = b`,ink,'font-size="17"');
  out+=label([25,486],`t = ${f(t)};  u = (−2, 1, 1);  xₚ = (1, 1, 0)`,ink,'font-size="18"');
  out+=dot([38,522],blue,5)+label([58,528],'点 / Point：一个解的坐标',ink,'font-size="17"');
  out+=arrow([515,521],[555,521],orange,'legend-vector')+label([570,528],'实箭头 / Position vector：从 O 出发',ink,'font-size="17"');
  out+=line([25,558],[65,558],blue,'stroke-width="2" opacity=".65"')+label([78,565],'蓝：齐次解的点集；橙：非齐次解的点集',ink,'font-size="17"');
  out+=line([515,558],[555,558],'#66737b','stroke-dasharray="6 5" marker-end="url(#solution-arrow)"')+label([570,565],'虚箭头：加上 xₚ 的位移 / Displacement',ink,'font-size="17"');
  out+=label([25,601],'线段仅代表无限直线的一部分；不可从投影读出长度或夹角。',ink,'font-size="17"');
  out+=label([25,630],'↦ 表示跨空间的映射 / Map between spaces；不是位置箭头或位移。',ink,'font-size="17"');
  const title='解的点集、位置向量与位移 / Solution points, position vectors and displacement';
  const desc=`固定输入R3原点O。蓝线是齐次解点集，橙线是非齐次解点集。当前参数${f(t)}；蓝点tu=(${st.h.map(f)})，橙点x=(${st.x.map(f)})。位置箭头从O指向当前点；${isZero?'齐次向量为零，仅显示原点，不画零箭头；位移与橙色位置箭头重合，省去灰虚箭头。':''}灰虚箭头从tu到x表示加上xp的位移，不是解向量箭头。${symbol} maps every orange point to b=(2,5), and every blue point to zero in separate output R2. Lines are infinite, shown in projection; lengths and angles cannot be inferred.`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" role="img" aria-label="${title}" data-parameter="${t}"><title>${title}</title><desc>${desc}</desc><defs><marker id="solution-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs><rect width="1000" height="650" fill="white"/><g font-family="DejaVu Sans, Droid Sans Fallback, sans-serif" font-size="21">${out}</g></svg>`;
 }
 function planeSvg(){const o=[480,298],s=1.35;const p=v=>project(v,o,s);let out=label([25,34],'C [s, t]ᵀ = [s, t, s+t]ᵀ');
  const corners=[[-1,-1,-2],[3,-1,2],[3,3,6],[-1,3,2]];
  out+=`<polygon points="${corners.map(v=>pt(p(v))).join(' ')}" fill="#e6f1f4" stroke="#96b7c6" stroke-width="1.5"/>`;
  for(let i=0;i<=2;i++)out+=line(p([i,-1,i-1]),p([i,3,i+3]),'#c5d9e0')+line(p([-1,i,i-1]),p([3,i,i+3]),'#c5d9e0');
  out+=axes3(o,s,['u','v','w']);
  out+=line(o,p([1,0,1]),blue,'stroke-width="3" marker-end="url(#arrow)"')+line(o,p([0,1,1]),orange,'stroke-width="3" marker-end="url(#arrow)"');
  out+=label(add(p([1,0,1]),[12,5]),'c₁ = (1, 0, 1)',blue)+label(add(p([0,1,1]),[-177,12]),'c₂ = (0, 1, 1)',orange);
  const yes=p([1,2,3]),no=p([1,2,4]);
  out+=line(yes,no,red,'stroke-dasharray="5 4"')+dot(yes,green,6)+dot(no,'white',6,`stroke="${red}" stroke-width="2.5"`);
  out+=label(add(yes,[16,8]),'(1, 2, 3): reachable',green)+label(add(no,[16,-5]),'(1, 2, 4): outside',red);
  out+=label([25,403],'Range: w = u + v.  Infinite plane shown as a patch.');
  return shell('Reachable plane for C','The columns c1 and c2 span w=u+v in output R3. Target (1,2,3) is on the plane; (1,2,4) is outside it. Oblique projection, not a claim about projected distances.',out).replace('0 0 1000 410','0 0 1000 430').replace('height="410"','height="430"');
 }
 return {A,C,xp,h,project,state,solutionSvg,planeSvg};
});
