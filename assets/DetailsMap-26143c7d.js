import{j as l,l as $t}from"./MapView-1ecc296d.js";import{af as zt,ag as At,v as Bt,h as K,e as z,q as Et,o as St,ai as _t}from"./index-de9ab0de.js";import{c as N}from"./DetailsMapContainer-678320e6.js";const Wt={id:"details-map"},U=0,w="#333447",V="#514efd",D="lightgrey",T="1.5px",A=1e3,Lt={__name:"DetailsMap",props:["sizes"],setup(Y){const s=Y,d=zt(),r=At();Bt(()=>{F(),L(),I(),console.log("detailsMapGraph",r.detailsMapGraph)});function F(){const t=l.select("#details-map");o.value=t.style("width").replace("px","")}const Z=$t(()=>{tt()},500);K(()=>d.width,()=>{Z()});function tt(){F(),L(),I()}function L(){l.select("#svg-details-chart").remove(),at(),rt()}function I(){ot(),ut()}const O=z(null),C=z(null),et=Et(()=>{const t=r.detailsMapGraph.children.length;let e=l.max(r.detailsMapGraph.children.map(n=>r.detailsMapGraph.type==="works"?n.data.children.length:n.children.length));e=e||2;const a=r.detailsMapGraph.type==="works"?k:v,u=r.detailsMapGraph.type==="works"?v:k;let i=null;return r.detailsMapGraph.type==="works"?i=t>=e?E+t*a:E+e*u:i=t>e?E+t*a:E+e*u,d.isMobile?E+a*r.detailsMapGraph.children.length+e*u:i}),o=z(null);function at(){O.value=l.select("#details-map").append("svg").attr("id","svg-details-chart").attr("viewBox",`0 0 ${o.value} ${et.value}`),C.value=O.value.append("g").attr("id","details-chart-container").attr("transform",`translate(${U}, ${U})`)}function rt(){nt(),st(),it()}const B=z(null),m=z(null),M=z(null),E=s.sizes.worksBandwidth*5,k=s.sizes.worksBandwidth*3,v=s.sizes.worksBandwidth*1.5,g=s.sizes.worksBandwidth*.5,x=s.sizes.worksBandwidth*.5*2,W=l.easeElasticOut.amplitude(1).period(.4);function lt(){if(d.isMobile){let t=r.detailsMapGraph.children.length;const e=r.detailsMapGraph.type==="works"?k:v,a=r.detailsMapGraph.type==="works"?t*e:t*e+v*1.5;return`translate(0, ${E+a})`}else return`translate(${o.value*.5}, ${E})`}function nt(){B.value=C.value.append("g").attr("transform","translate(0, 0)")}function st(){m.value=C.value.append("g").attr("transform",`translate(0, ${E})`)}function it(){M.value=C.value.append("g").attr("transform",lt())}function ot(){r.detailsMapGraph.type==="works"?dt():r.detailsMapGraph.type==="sdgs"?ct():pt()}function dt(){const t=B.value.append("g").attr("class","title-group").attr("transform",`translate(0,-${s.sizes.worksBandwidth*2})`);t.append("rect").attr("class","title-rect"),t.append("text").attr("class","title").text(r.detailsMapGraph.data.title),t.append("a").attr("xlink:href",r.detailsMapGraph.data.openAlexId).attr("target","_blank").append("rect").attr("class","title-rect-overlay").append("title").text(r.detailsMapGraph.data.title),t.selectAll(".title-rect,.title-rect-overlay").attr("width",o.value).attr("height",s.sizes.worksBandwidth),t.selectAll(".title-rect").attr("stroke",w).attr("fill",w),t.selectAll(".title-rect-overlay").attr("fill-opacity",0).attr("cursor","pointer"),t.selectAll(".title").attr("x",5).attr("y",s.sizes.worksBandwidth*.85).style("font-size",s.sizes.workTitle).attr("fill","white"),B.value.select(".title-group").transition().duration(A).ease(W).attr("transform","translate(0,0)"),B.value.append("g").attr("class","title-metadata").attr("transform",`translate(0, ${s.sizes.worksBandwidth*2})`).append("a").attr("xlink:href",r.detailsMapGraph.data.doi).attr("target","_blank").append("text").text(`${r.detailsMapGraph.data.year}${r.detailsMapGraph.data.source.name?`: ${r.detailsMapGraph.data.source.name}`:""} - ${r.detailsMapGraph.data.doi}`).style("font-size",`${s.sizes.field*.85}px`).attr("fill",w)}function ct(){const a=B.value.append("g").attr("class","title-group").attr("transform",`translate(0,-${s.sizes.worksBandwidth*4})`).append("a").attr("xlink:href",r.detailsMapGraph.data.url).attr("target","_blank").append("g").attr("transform",`translate(${s.sizes.worksBandwidth}, ${s.sizes.worksBandwidth})`);a.append("circle").attr("r",g).attr("stroke",w).attr("fill",w),a.append("text").text(`SDG ${r.detailsMapGraph.data.id}`).attr("x",x).attr("y",0).style("font-size",`${s.sizes.sdgId}px`).attr("dominant-baseline","text-after-edge").attr("text-anchor","start"),a.append("rect").attr("x",x).attr("y",0).attr("fill",r.detailsMapGraph.data.color).attr("opacity",.4).attr("width",r.detailsMapGraph.data.labelBbox.width).attr("height",r.detailsMapGraph.data.labelBbox.height),a.append("text").text(r.detailsMapGraph.data.name).attr("x",x).attr("y",0).attr("dominant-baseline","text-before-edge").style("font-size",s.sizes.sdgLabel).attr("text-anchor","start"),B.value.select(".title-group").transition().duration(A).ease(W).attr("transform","translate(0,0)")}function pt(){const a=B.value.append("g").attr("class","title-group").attr("transform",`translate(0,-${s.sizes.worksBandwidth*4})`).append("a").attr("xlink:href",r.detailsMapGraph.data.url).attr("target","_blank").append("g").attr("transform",`translate(${s.sizes.worksBandwidth}, ${s.sizes.worksBandwidth})`);a.append("circle").attr("r",g).attr("stroke",w).attr("fill",w),a.append("text").text(r.detailsMapGraph.data.name).attr("x",x).attr("y",0).style("font-size",`${s.sizes.field}px`).attr("dominant-baseline","middle").attr("text-anchor","start"),B.value.select(".title-group").transition().duration(A).ease(W).attr("transform","translate(0,0)")}function ut(){r.detailsMapGraph.type==="works"?ht(r.detailsMapGraph.children,ft,P):yt(r.detailsMapGraph.children,vt,Q)}function ht(t,e,a){m.value.selectAll(".first-group-line").data(t).join(u=>u.append("line").attr("class",(i,n)=>["first-group-line",`element-${n}`].join(" ")).attr("stroke",i=>i.data.children.length?D:null).attr("stroke-width",T).attr("x1",x*1.5).attr("y1",(i,n)=>n*k).attr("x2",()=>d.isMobile?o.value*.9:o.value*.4).attr("y2",(i,n)=>n*k)),e(t,wt,gt),a(R,q)}function ft(t,e,a){m.value.selectAll(".first-group-element").data(t).join(u=>u.append("g").attr("class",(i,n)=>["first-group-element",`element-${n}`].join(" ")).attr("transform",`translate(0, -${k*2})`).each(function(i,n){if(i.type==="sdg"){const p=r.homeMapGraph.sdgs.find($=>$.id===i.data.id),h=l.select(this).append("g").attr("class",["group-element",`element-${n}`].join(" ")).attr("data-index",n).attr("cursor","pointer");h.append("circle").attr("data-id",$=>$.id).attr("cx",g*1.1).attr("cy",0).attr("r",g).attr("stroke",w).attr("fill",w),h.append("text").attr("class","sdg-group-id").attr("x",x*1.5).attr("y",0).text($=>`SDG ${$.data.id}`).style("font-size",`${s.sizes.sdgId}px`).attr("dominant-baseline","text-after-edge").attr("text-anchor","start"),h.append("rect").attr("x",x*1.5).attr("y",0).attr("fill",$=>$.data.color).attr("opacity",.4).attr("width",p.labelBbox.width).attr("height",p.labelBbox.height),h.append("text").text($=>$.data.name).attr("x",x*1.5).attr("y",0).attr("dominant-baseline","text-before-edge").style("font-size",s.sizes.sdgLabel).attr("text-anchor","start")}else{const p=l.select(this).append("g").attr("class",["group-element",`element-${n}`].join(" ")).attr("data-index",n).attr("cursor","pointer");p.append("circle").attr("data-id",h=>h.id).attr("cx",g*1.1).attr("cy",0).attr("r",g).attr("stroke",w).attr("fill",w),p.append("text").attr("class","field-group-name").attr("x",x*1.5).attr("y",0).text(h=>h.data.name).style("font-size",`${s.sizes.field}px`).attr("dominant-baseline",()=>i.data.children.length?"text-after-edge":"middle").attr("text-anchor","start")}const c=l.select(this).append("g").attr("class",["group-element",`element-${n}`].join(" ")).attr("data-index",n).attr("transform",`translate(${d.isMobile?o.value*.9:o.value*.4},0)`).attr("cursor","pointer");i.data.children.length&&(c.append("circle").attr("r",g*1.4).attr("stroke",w).attr("fill",w),c.append("text").text(p=>p.data.children.length).attr("fill","white").style("font-size",`${s.sizes.field}px`).attr("dominant-baseline","middle").attr("text-anchor","middle"))})),m.value.selectAll(".first-group-element").transition().duration(A).ease(W).attr("transform",(u,i)=>`translate(0, ${i*k})`),e(),a()}function f(t){return t==="mouseover"?V:w}function S(t){return t==="mouseover"?V:D}function _(t){return t==="mouseover"?"2.5px":T}function j(t){return t==="mouseover"?"bold":"regular"}function wt(){m.value.selectAll(".group-element").on("mouseover mouseout",function(t){const e=l.select(this).attr("data-index");r.detailsMapGraph.children[e].data.children.length&&l.selectAll(`line.element-${e}`).attr("stroke",S(t.type)).attr("stroke-width",_(t.type)),l.selectAll(`.connection-line-${e}`).attr("stroke",S(t.type)).attr("stroke-width",_(t.type)),e===y.value&&l.selectAll(".shown-work-rect").attr("stroke",f(t.type)).attr("fill",f(t.type)),l.selectAll(`.element-${e} circle`).attr("stroke",f(t.type)).attr("fill",f(t.type)),l.selectAll(`.element-${e} .sdg-group-id`).attr("fill",f(t.type)).attr("font-weight",j(t.type)),l.selectAll(`.element-${e} .field-group-name`).attr("fill",f(t.type)).attr("font-weight",j(t.type))})}const y=z(null),b=z([]),G=z([]);K(()=>y.value,()=>{r.detailsMapGraph.type==="works"?P(R,q):Q(X,J)});function gt(){m.value.selectAll(".group-element").on("click",function(){const t=l.select(this).attr("data-index");if(r.detailsMapGraph.children[t].data.children.length?y.value=t:y.value=null,r.detailsMapGraph.children[t].data.children.length){const e=r.detailsMapGraph.children[t].data.children;b.value=e}else b.value=[]})}function mt(){m.value.selectAll(".group-element").on("click",function(){const t=l.select(this).attr("data-index");if(r.detailsMapGraph.children[t].children.length?y.value=t:y.value=null,r.detailsMapGraph.children[t].children.length){const e=r.detailsMapGraph.children[t].children;G.value=e}else G.value=[]})}function P(t,e){const a=M.value.selectAll(".shown-work").data(b.value,function(c){return c}),u=a.enter().append("g").attr("class","shown-work").attr("transform",`translate(0, -${v*2})`);u.append("rect").attr("class","shown-work-rect").attr("data-id",(c,p)=>p),u.append("text").attr("class","shown-work-title").text(c=>c.title),u.append("rect").attr("class","shown-work-overlay").data(b.value,function(c,p){return p}).each(function(){l.select(this).append("title").text(c=>c.title)});const i=u.merge(a);i.select(".shown-work-title").text(c=>c.title),i.select(".shown-work-overlay title").text(c=>c.title),a.exit().remove(),M.value.selectAll(".shown-work-rect,.shown-work-overlay").attr("width",()=>d.isMobile?o.value*.9:o.value*.5).attr("height",s.sizes.worksBandwidth),M.value.selectAll(".shown-work-rect").attr("stroke",w).attr("fill",w),M.value.selectAll(".shown-work-overlay").attr("class","shown-work-overlay").attr("data-id",(c,p)=>p).attr("fill-opacity",0).attr("cursor","pointer"),M.value.selectAll(".shown-work-title").attr("x",5).attr("y",s.sizes.worksBandwidth*.85).style("font-size",s.sizes.workTitle).attr("fill","white"),M.value.selectAll(".shown-work").transition().duration(A).ease(W).attr("transform",(c,p)=>`translate(0, ${v*p})`),t(),e(xt)}function kt(t){const e=d.isMobile?o.value*.9+g*1.5:o.value*.4+g*1.5,a=t*k,u=d.isMobile?o.value*.96:o.value*.4+g*4,i=d.isMobile?o.value*.96:o.value*.4+g*8,n=d.isMobile?r.detailsMapGraph.children.length*k+(b.value.length-1)*.5*v+s.sizes.worksBandwidth*.5:s.sizes.worksBandwidth*.5,c=d.isMobile?o.value*.92:o.value*.495,p=d.isMobile?r.detailsMapGraph.children.length*k+(b.value.length-1)*.5*v+s.sizes.worksBandwidth*.5:(b.value.length-1)*.5*v+s.sizes.worksBandwidth*.5;return[[{x:e,y:a},{x:u,y:a},{x:i,y:n},{x:c,y:p}]]}function H(t){return l.line().x(a=>a.x).y(a=>a.y).curve(l.curveCatmullRom.alpha(.5))(t)}function R(){const t=y.value?kt(y.value):[];l.selectAll(".connection-line").remove(),m.value.selectAll(".connection-line").data(t).join(e=>e.append("path").attr("class",["connection-line",`connection-line-${y.value}`].join(" ")).attr("d",a=>H(a)).attr("stroke","white").attr("fill","none").attr("stroke-width",T),e=>e,e=>e),m.value.selectAll(".connection-line").transition().duration(A*.3).attr("stroke",D)}function q(t){M.value.selectAll(".shown-work-overlay").on("mouseover mouseout",function(e){const a=y.value,u=l.select(this).attr("data-id");l.select(`.shown-work-rect[data-id='${u}']`).attr("stroke",f(e.type)).attr("fill",f(e.type)),l.selectAll(`line.element-${a}`).attr("stroke",S(e.type)).attr("stroke-width",_(e.type)),l.selectAll(`.connection-line-${a}`).attr("stroke",S(e.type)).attr("stroke-width",_(e.type)),l.selectAll(`.element-${a} circle`).attr("stroke",f(e.type)).attr("fill",f(e.type)),l.selectAll(`.element-${a} .sdg-group-id`).attr("fill",f(e.type)).attr("font-weight",j(e.type)),l.selectAll(`.element-${a} .field-group-name`).attr("fill",f(e.type)).attr("font-weight",j(e.type))}),t()}function xt(){M.value.selectAll(".shown-work-overlay").on("click",async function(){const t=l.select(this).attr("data-id"),e={type:"works",root:b.value[t],sizes:s.sizes},a=await N(e);r.setDetailsMapGraph(a),b.value=[],y.value=null,L(),I()})}function yt(t,e,a){e(t,Mt,mt),m.value.selectAll(".first-group-line").data(t).join(u=>u.append("line").attr("class",(i,n)=>["first-group-line",`element-${n}`].join(" ")).attr("stroke",i=>i.children.length?D:null).attr("stroke-width",T).attr("x1",d.isMobile?o.value*.75:o.value*.45).attr("y1",(i,n)=>n*v+s.sizes.worksBandwidth*.5).attr("x2",d.isMobile?o.value*.9-g*1.5*2:o.value*.5-g*1.5).attr("y2",(i,n)=>n*v+s.sizes.worksBandwidth*.5)),a(X,J)}function vt(t,e,a){m.value.selectAll(".first-group-element").data(t).join(u=>u.append("g").attr("class",(i,n)=>["first-group-element",`element-${n}`].join(" ")).attr("transform",`translate(0, -${v*2})`).each(function(i,n){const c=l.select(this).append("g").attr("class",["group-element",`element-${n}`].join(" ")).attr("data-index",n);c.append("rect").attr("class","first-group-work-rect").attr("data-id",n),c.append("text").attr("class","first-group-work-title").attr("data-id",h=>h.id).text(h=>h.title),c.append("rect").attr("class","first-group-work-overlay").each(function(){l.select(this).append("title").text(h=>h.title)});const p=l.select(this).append("g").attr("class",["group-element",`element-${n}`].join(" ")).attr("data-index",n).attr("transform",`translate(${d.isMobile?o.value*.9-g*1.5:o.value*.5},${s.sizes.worksBandwidth*.5})`).attr("cursor","pointer");i.children.length&&(p.append("circle").attr("class","first-group-work-circle").attr("r",g*1.4).attr("stroke",w).attr("fill",w),p.append("text").text(h=>h.children.length).attr("fill","white").style("font-size",`${s.sizes.field}px`).attr("dominant-baseline","middle").attr("text-anchor","middle"))})),m.value.selectAll(".first-group-work-rect,.first-group-work-overlay").attr("width",()=>d.isMobile?o.value*.75:o.value*.45).attr("height",s.sizes.worksBandwidth),m.value.selectAll(".first-group-work-rect").attr("stroke",w).attr("fill",w),m.value.selectAll(".first-group-work-overlay").attr("fill-opacity",0).attr("cursor","pointer"),m.value.selectAll(".first-group-work-title").attr("x",5).attr("y",s.sizes.worksBandwidth*.85).style("font-size",s.sizes.workTitle).attr("fill","white"),m.value.selectAll(".first-group-element").transition().duration(A).ease(W).attr("transform",(u,i)=>`translate(0, ${v*i})`),e(),a()}function Mt(){m.value.selectAll(".group-element").on("mouseover mouseout",function(t){const e=l.select(this).attr("data-index");r.detailsMapGraph.children[e].children.length&&l.selectAll(`line.element-${e}`).attr("stroke",S(t.type)).attr("stroke-width",_(t.type)),l.selectAll(`.connection-line-${e}`).attr("stroke",S(t.type)).attr("stroke-width",_(t.type)),e===y.value&&(l.selectAll(".shown-element-circle").attr("stroke",f(t.type)).attr("fill",f(t.type)),l.selectAll(".shown-sdg-group-id, .shown-field-group-name").attr("fill",f(t.type)).attr("font-weight",j(t.type))),l.selectAll(`.element-${e} .first-group-work-circle`).attr("stroke",f(t.type)).attr("fill",f(t.type)),l.selectAll(`.element-${e} .first-group-work-rect`).attr("stroke",f(t.type)).attr("fill",f(t.type))})}function Q(t,e){l.selectAll(".shown-element").remove(),M.value.selectAll(".shown-element").data(G.value,function(i){return i}).enter().append("g").attr("class","shown-element").attr("data-id",(i,n)=>n).attr("transform",`translate(${d.isMobile?o.value*.85:o.value*.15}, -${k*2})`).each(function(i,n){if(i.type==="sdg"){const c=r.homeMapGraph.sdgs.find(h=>h.id===i.data.id),p=l.select(this).append("g").attr("class",["group-element",`element-${n}`].join(" ")).attr("data-index",n).attr("cursor","pointer");p.append("circle").attr("class","shown-element-circle").attr("data-id",h=>h.id).attr("r",g).attr("stroke",w).attr("fill",w),p.append("text").attr("class","shown-sdg-group-id").text(h=>`SDG ${h.data.id}`).attr("x",()=>d.isMobile?-x:x).attr("y",0).style("font-size",`${s.sizes.sdgId}px`).attr("dominant-baseline","text-after-edge").attr("text-anchor",()=>d.isMobile?"end":"start"),p.append("rect").attr("x",d.isMobile?-(c.labelBbox.width+x):x).attr("y",0).attr("fill",h=>h.data.color).attr("opacity",.4).attr("width",c.labelBbox.width).attr("height",c.labelBbox.height),p.append("text").text(h=>h.data.name).attr("x",()=>d.isMobile?-x:x).attr("y",0).attr("dominant-baseline","text-before-edge").style("font-size",s.sizes.sdgLabel).attr("text-anchor",()=>d.isMobile?"end":"start")}else{const c=l.select(this).append("g").attr("class",["group-element",`element-${n}`].join(" ")).attr("data-index",n).attr("cursor","pointer");c.append("circle").attr("class","shown-element-circle").attr("data-id",p=>p.id).attr("r",g).attr("stroke",w).attr("fill",w),c.append("text").attr("class","shown-field-group-name").text(p=>p.data.name).attr("x",()=>d.isMobile?-x:x).attr("y",0).style("font-size",`${s.sizes.field}px`).attr("dominant-baseline","middle").attr("text-anchor",()=>d.isMobile?"end":"start")}}),M.value.selectAll(".shown-element").transition().duration(A).ease(W).attr("transform",(i,n)=>`translate(${d.isMobile?o.value*.9-g*1.5:o.value*.15}, ${k*n})`),t(),e(bt)}function Gt(t){const e=d.isMobile?o.value*.9:g*1.5,a=t*v+s.sizes.worksBandwidth*.5,u=d.isMobile?o.value*.95:o.value*.1,i=d.isMobile?o.value*.95:o.value*.1,n=d.isMobile?r.detailsMapGraph.children.length*v+G.value.length*.5*k+k*.25:(G.value.length-1)*.5*k,c=d.isMobile?o.value*.9:o.value*.14,p=d.isMobile?r.detailsMapGraph.children.length*v+G.value.length*.5*k+k*.25:(G.value.length-1)*.5*k;return[[{x:e,y:a},{x:u,y:a},{x:i,y:n},{x:c,y:p}]]}function X(){const t=y.value?Gt(y.value):[],e=d.isMobile?m.value:M.value;l.selectAll(".connection-line").remove(),e.selectAll(".connection-line").data(t).join(a=>a.append("path").attr("class",["connection-line",`connection-line-${y.value}`].join(" ")).attr("d",u=>H(u)).attr("stroke","white").attr("fill","none").attr("stroke-width",T),a=>a,a=>a),e.selectAll(".connection-line").transition().duration(A*.3).attr("stroke",D)}function J(t){M.value.selectAll(".shown-element").on("mouseover mouseout",function(e){const a=y.value;l.select(this).select(".shown-element-circle").attr("stroke",f(e.type)).attr("fill",f(e.type)),l.select(this).select(".shown-sdg-group-id, .shown-field-group-name").attr("fill",f(e.type)).attr("font-weight",j(e.type)),l.selectAll(`line.element-${a}`).attr("stroke",S(e.type)).attr("stroke-width",_(e.type)),l.selectAll(`.connection-line-${a}`).attr("stroke",S(e.type)).attr("stroke-width",_(e.type)),l.selectAll(`.element-${a} .first-group-work-circle`).attr("stroke",f(e.type)).attr("fill",f(e.type)),l.selectAll(`.element-${a} .first-group-work-rect`).attr("stroke",f(e.type)).attr("fill",f(e.type))}),t()}function bt(){M.value.selectAll(".shown-element").on("click",async function(){const t=l.select(this).attr("data-id");let e=G.value[t].data;if(G.value[t].type==="sdg"){const i=r.homeMapGraph.sdgs.find(n=>n.id===e.id);e.labelBbox=i.labelBbox}const a={type:`${G.value[t].type}s`,root:e,sizes:s.sizes},u=await N(a);r.setDetailsMapGraph(u),G.value=[],y.value=null,L(),I()})}return(t,e)=>(St(),_t("div",Wt))}};export{Lt as default};
