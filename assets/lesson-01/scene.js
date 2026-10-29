/* Shared geometry for static SVGs and the interactive view. No dependencies. */
(function (root) {
  'use strict';
  const planes = [
    {id:'P₁', label:'式（3）', a:[2,-1,1], b:0, color:'#176b91', eq:'2x − y + z = 0'},
    {id:'P₂', label:'式（4）', a:[-1,2,1], b:3, color:'#ad4f1d', eq:'−x + 2y + z = 3'},
    {id:'P₃', label:'式（5）', a:[0,0,1], b:0, color:'#8053a4', eq:'z = 0'},
    {id:'P₃', label:'式（6）', a:[1,1,2], b:3, color:'#8053a4', eq:'x + y + 2z = 3'},
    {id:'P₃', label:'式（7）', a:[1,1,2], b:4, color:'#8053a4', eq:'x + y + 2z = 4'}
  ];
  const stages = [
    {active:[], solution:'space', zh:'全部空间 ℝ³', en:'All of ℝ³', explanation:'没有方程时，没有约束（constraint）；每个点都是解（solution）。 / With no equations, every point is a solution.'},
    {active:[0], solution:'plane', zh:'一个平面', en:'One plane', explanation:'解集（solution set）是式（3）的整个平面（plane），不是一个点。 / The solution set is the whole plane for equation (3).'},
    {active:[0,1], solution:'line', zh:'一条直线 L', en:'One line L', explanation:'共同解集（solution set）是 L：(x,y,z)=(1−t,2−t,t)，t 为任意实数。 / The common solution set is L for every real t.'},
    {active:[0,1,2], solution:'point', zh:'唯一点 Q = (1,2,0)', en:'Unique point Q', explanation:'z=t=0，只保留 Q。灰色虚线 L 仅是前两平面的交线（intersection line）。 / Only Q solves all three equations; dashed L is a reference for the first two planes.'},
    {active:[0,1,3], solution:'line', zh:'仍是直线 L', en:'The same line L', explanation:'第三式是前两式之和，整条 L 满足它。 / The third equation is the sum of the first two, so every point of L remains a solution.'},
    {active:[0,1,4], solution:'empty', zh:'空集 ∅：无共同解', en:'Empty: no common solution', explanation:'前两式要求 x+y+2z=3，与第三式冲突。灰色虚线 L 不包含共同解（common solution）。 / The first two equations require 3, not 4; dashed L contains no solution of all three.'}
  ];
  const bounds=[[-2,4],[-1,5],[-2,4]], center=[1,2,1];
  const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
  const sub=(a,b)=>a.map((x,i)=>x-b[i]);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  function patch(p) {
    const vertices=Array.from({length:8},(_,i)=>bounds.map((b,j)=>b[(i>>j)&1]));
    const pts=[];
    vertices.forEach((v,i)=>{
      for(let j=0;j<3;j++) if(!(i&(1<<j))) {
        const w=vertices[i|(1<<j)], d=sub(w,v), den=dot(p.a,d);
        if(Math.abs(den)<1e-10) continue;
        const t=(p.b-dot(p.a,v))/den;
        if(t>=-1e-10&&t<=1+1e-10) {
          const q=v.map((x,k)=>x+t*d[k]);
          if(!pts.some(r=>Math.hypot(...sub(q,r))<1e-8)) pts.push(q);
        }
      }
    });
    const c=pts.reduce((a,v)=>a.map((x,j)=>x+v[j]/pts.length),[0,0,0]);
    const u=sub(pts[0],c), v=cross(p.a,u);
    return pts.sort((a,b)=>Math.atan2(dot(sub(a,c),v)/Math.hypot(...v),dot(sub(a,c),u)/Math.hypot(...u))-Math.atan2(dot(sub(b,c),v)/Math.hypot(...v),dot(sub(b,c),u)/Math.hypot(...u)));
  }
  const defaults={yaw:0.66,pitch:0.48};
  function render(stage, yaw=defaults.yaw, pitch=defaults.pitch) {
    const state=stages[stage];
    const project=q=>{
      const [x,y,z]=sub(q,center), d=Math.sin(yaw)*x+Math.cos(yaw)*y;
      return [240+30*(Math.cos(yaw)*x-Math.sin(yaw)*y),160+30*(Math.sin(pitch)*d-Math.cos(pitch)*z),Math.cos(pitch)*d+Math.sin(pitch)*z];
    };
    const xy=q=>project(q).slice(0,2).map(x=>x.toFixed(2)).join(',');
    const line=(a,b,attr)=>`<line x1="${project(a)[0]}" y1="${project(a)[1]}" x2="${project(b)[0]}" y2="${project(b)[1]}" ${attr}/>`;
    let s='<rect width="480" height="350" fill="#fbfcfd"/>';
    // Translucent clipped infinite planes, depth-sorted at their centroids.
    const patches=state.active.map(i=>({i,vs:patch(planes[i])}));
    patches.sort((a,b)=>a.vs.reduce((s,q)=>s+project(q)[2]/a.vs.length,0)-b.vs.reduce((s,q)=>s+project(q)[2]/b.vs.length,0));
    patches.forEach(({i,vs})=>{s+=`<polygon data-plane="${i}" points="${vs.map(xy).join(' ')}" fill="${planes[i].color}" fill-opacity="0.18" stroke="${planes[i].color}" stroke-width="1.7"/>`;});
    [[4,0,0],[0,5,0],[0,0,4]].forEach((end,i)=>{
      s+=line([0,0,0],end,'stroke="#65717c" stroke-width="1.4"');
      const q=project(end); s+=`<text x="${q[0]+5}" y="${q[1]-5}" class="axis">${'xyz'[i]}</text>`;
    });
    if(stage>=2) {
      const solution=state.solution==='line';
      s+=line([3,4,-2],[-2,-1,3],`data-role="${solution?'solution-line':'reference-line'}" stroke="${solution?'#172a3a':'#5c6770'}" stroke-width="${solution?4:2.5}" ${solution?'':'stroke-dasharray="8 7"'}`);
      const q=project([-1,0,2]); s+=`<text x="${q[0]+10}" y="${q[1]-6}" class="label">L</text>`;
    }
    if(state.solution==='point') {
      const q=project([1,2,0]);
      s+=`<circle data-role="solution-point" cx="${q[0]}" cy="${q[1]}" r="6" fill="#111" stroke="white" stroke-width="2"/><text x="${q[0]+12}" y="${q[1]+22}" class="label">Q</text>`;
    }
    // Fixed legend positions remain readable throughout rotation.
    state.active.forEach((i,k)=>{s+=`<text x="${18+k*145}" y="328" class="label" fill="${planes[i].color}">${planes[i].label}</text><line x1="${105+k*145}" y1="322" x2="${135+k*145}" y2="322" stroke="${planes[i].color}" stroke-width="4"/>`;});
    return s;
  }
  const style='text{font:19px "DejaVu Sans",sans-serif;fill:#263746}.label{font-weight:bold;paint-order:stroke;stroke:#fbfcfd;stroke-width:3px;stroke-linejoin:round}.axis{font-style:italic}';
  const api={planes,stages,bounds,patch,render,defaults,style};
  if(typeof module!=='undefined') module.exports=api; else root.RowScene=api;
})(typeof window!=='undefined'?window:globalThis);
