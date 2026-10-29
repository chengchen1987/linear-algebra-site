/* Shared deterministic SVG geometry for the browser and printable snapshots. */
(function(root){
'use strict';
const colors={first:'#22688b',second:'#b45520',target:'#733c80',grid:'#e0e6e9'};
const fmt=n=>Number(n.toFixed(2)).toString().replace('-', '−');
function state(lambda){
 if(!Number.isFinite(lambda)||lambda<0||lambda>2)throw new RangeError('lambda in [0,2]');
 return {lambda,row:[-1+2*lambda,2-lambda,3],a1:[2,-1+2*lambda],a2:[-1,2-lambda],b:[0,3]};
}
// Intersect ax+by=c with the fixed rectangular window; never divide by zero.
function lineEnds(a,b,c){
 const points=[];
 function add(x,y){if(x>=-3-1e-9&&x<=4+1e-9&&y>=-2-1e-9&&y<=5+1e-9&&!points.some(p=>Math.hypot(p[0]-x,p[1]-y)<1e-8))points.push([x,y]);}
 if(b!==0)for(const x of [-3,4])add(x,(c-a*x)/b);
 if(a!==0)for(const y of [-2,5])add((c-b*y)/a,y);
 return points.slice(0,2);
}
function panel(lambda,kind,prefix){
 const s=state(lambda),row=kind==='row',X=x=>46+(x+3)*40,Y=y=>36+(5-y)*40;
 const line=(p,q,stroke,width,dash='',extra='')=>`<line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${X(q[0])}" y2="${Y(q[1])}" stroke="${stroke}" stroke-width="${width}" ${dash?'stroke-dasharray="'+dash+'"':''} ${extra}/>`;
 const text=(x,y,t,extra='')=>`<text x="${x}" y="${y}" ${extra}>${t}</text>`;
 let out=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 370 402" role="img" aria-label="${row?'行图像：未知数 x、y；共同解 (1,2)':'列图像：分量 u、v；a₁+2a₂=b'}" data-lambda="${lambda}" data-kind="${kind}"><defs>`;
 for(const [id,c] of Object.entries(colors))out+=`<marker id="${prefix}-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3.7" markerHeight="3.7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${c}"/></marker>`;
 out+='</defs><rect width="370" height="402" fill="white"/><g font-family="DejaVu Sans, sans-serif" font-size="13" fill="#243746">';
 out+=text(18,21,row?'Row picture · x, y':'Column picture · u, v','font-size="16" font-weight="600"');
 for(let k=-3;k<=4;k++){out+=line([k,-2],[k,5],colors.grid,1);if(k!==0)out+=text(X(k)-4,Y(0)+17,k);}
 for(let k=-2;k<=5;k++){out+=line([-3,k],[4,k],colors.grid,1);if(k!==0)out+=text(X(0)-21,Y(k)+4,k);}
 out+=line([-3,0],[4.3,0],'#526676',1.3)+line([0,-2],[0,5.2],'#526676',1.3);
 out+=text(X(4)+14,Y(0)+5,row?'x':'u')+text(X(0)+8,Y(5)-6,row?'y':'v');
 if(row){
  const e1=lineEnds(2,-1,0),e2=lineEnds(...s.row);
  out+=line(...e1,colors.first,2.6)+line(...e2,colors.second,2.9,'7 5','data-role="moving-line"');
  out+=`<circle cx="${X(1)}" cy="${Y(2)}" r="4.4" fill="#172c38"/>`+text(X(1)+10,Y(2)+18,'(1, 2)','font-weight="600"');
  out+=`<line x1="20" y1="343" x2="48" y2="343" stroke="${colors.first}" stroke-width="2.6"/>`+text(57,348,'(1): 2x − y = 0');
  out+=`<line x1="20" y1="368" x2="48" y2="368" stroke="${colors.second}" stroke-width="2.9" stroke-dasharray="7 5"/>`+text(57,373,`New (2): (${fmt(s.row[0])})x + (${fmt(s.row[1])})y = 3`);
 }else{
  const arrow=(p,q,id,dash='',extra='')=>line(p,q,colors[id],dash?2.9:2.6,dash,`marker-end="url(#${prefix}-${id})" ${extra}`);
  out+=arrow([0,0],s.a1,'first','','data-role="a1"')+arrow([0,0],s.a2,'second','','data-role="a2"')+arrow([0,0],s.b,'target','','data-role="b"');
  out+=arrow(s.a1,s.b,'second','7 5','data-role="twice-a2"');
  out+=text(X(s.a1[0])+8,Y(s.a1[1])+4,'a₁',`fill="${colors.first}"`)+text(X(s.a2[0])-23,Y(s.a2[1])-9,'a₂',`fill="${colors.second}"`)+text(X(0)-17,Y(3)-12,'b',`fill="${colors.target}"`);
  out+=text(X(1)+13,Y((s.a1[1]+3)/2)-12,'2a₂',`fill="${colors.second}"`);
  out+=text(20,348,`a₁ = (2, ${fmt(s.a1[1])}), a₂ = (−1, ${fmt(s.a2[1])})`);
  out+=text(20,373,'a₁ + 2a₂ = b = (0, 3)','font-weight="600"');
 }
 return out+'</g></svg>';
}
const api={state,lineEnds,panel};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RowColumn=api;
})(typeof window!=='undefined'?window:globalThis);
