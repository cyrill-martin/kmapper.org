import{b0 as W,D as G,I,$ as z,a0 as D,i as x,a1 as V,b1 as H,am as T,ak as A,al as F,E as p,b2 as U,G as J,Q as P,R as y,b3 as K,S as j,aJ as Q,a2 as X,b4 as Y,h as q,aM as Z,aL as ee,av as te,e as ne,o as B,j as se,k as L,w as N,l as d,c as E,m as _,F as ie}from"./index-b050904d.js";import{N as ae}from"./Pagination-7c8aaf7c.js";const re={gapSmall:"4px 8px",gapMedium:"8px 12px",gapLarge:"12px 16px"},oe=()=>re,le={name:"Space",self:oe},ce=le;let k;const pe=()=>{if(!W)return!0;if(k===void 0){const e=document.createElement("div");e.style.display="flex",e.style.flexDirection="column",e.style.rowGap="1px",e.appendChild(document.createElement("div")),e.appendChild(document.createElement("div")),document.body.appendChild(e);const t=e.scrollHeight===1;return document.body.removeChild(e),k=t}return k},de=Object.assign(Object.assign({},z.props),{align:String,justify:{type:String,default:"start"},inline:Boolean,vertical:Boolean,reverse:Boolean,size:{type:[String,Number,Array],default:"medium"},wrapItem:{type:Boolean,default:!0},itemClass:String,itemStyle:[String,Object],wrap:{type:Boolean,default:!0},internalUseGap:{type:Boolean,default:void 0}}),M=G({name:"Space",props:de,setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:s}=I(e),i=z("Space","-space",void 0,ce,e,t),a=D("Space",s,t);return{useGap:pe(),rtlEnabled:a,mergedClsPrefix:t,margin:x(()=>{const{size:n}=e;if(Array.isArray(n))return{horizontal:n[0],vertical:n[1]};if(typeof n=="number")return{horizontal:n,vertical:n};const{self:{[V("gap",n)]:l}}=i.value,{row:r,col:o}=H(l);return{horizontal:T(o),vertical:T(r)}})}},render(){const{vertical:e,reverse:t,align:s,inline:i,justify:a,itemClass:n,itemStyle:l,margin:r,wrap:o,mergedClsPrefix:c,rtlEnabled:u,useGap:m,wrapItem:C,internalUseGap:w}=this,g=A(F(this),!1);if(!g.length)return null;const R=`${r.horizontal}px`,b=`${r.horizontal/2}px`,O=`${r.vertical}px`,h=`${r.vertical/2}px`,v=g.length-1,S=a.startsWith("space-");return p("div",{role:"none",class:[`${c}-space`,u&&`${c}-space--rtl`],style:{display:i?"inline-flex":"flex",flexDirection:(()=>e&&!t?"column":e&&t?"column-reverse":!e&&t?"row-reverse":"row")(),justifyContent:["start","end"].includes(a)?"flex-"+a:a,flexWrap:!o||e?"nowrap":"wrap",marginTop:m||e?"":`-${h}`,marginBottom:m||e?"":`-${h}`,alignItems:s,gap:m?`${r.vertical}px ${r.horizontal}px`:""}},!C&&(m||w)?g:g.map(($,f)=>$.type===U?$:p("div",{role:"none",class:n,style:[l,{maxWidth:"100%"},m?"":e?{marginBottom:f!==v?O:""}:u?{marginLeft:S?a==="space-between"&&f===v?"":b:f!==v?R:"",marginRight:S?a==="space-between"&&f===0?"":b:"",paddingTop:h,paddingBottom:h}:{marginRight:S?a==="space-between"&&f===v?"":b:f!==v?R:"",marginLeft:S?a==="space-between"&&f===0?"":b:"",paddingTop:h,paddingBottom:h}]},$)))}}),ue=e=>{const{opacityDisabled:t,heightTiny:s,heightSmall:i,heightMedium:a,heightLarge:n,heightHuge:l,primaryColor:r,fontSize:o}=e;return{fontSize:o,textColor:r,sizeTiny:s,sizeSmall:i,sizeMedium:a,sizeLarge:n,sizeHuge:l,color:r,opacitySpinning:t}},me={name:"Spin",common:J,self:ue},fe=me,ge=P([P("@keyframes spin-rotate",`
 from {
 transform: rotate(0);
 }
 to {
 transform: rotate(360deg);
 }
 `),y("spin-container",`
 position: relative;
 `,[y("spin-body",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[K()])]),y("spin-body",`
 display: inline-flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 `),y("spin",`
 display: inline-flex;
 height: var(--n-size);
 width: var(--n-size);
 font-size: var(--n-size);
 color: var(--n-color);
 `,[j("rotate",`
 animation: spin-rotate 2s linear infinite;
 `)]),y("spin-description",`
 display: inline-block;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 margin-top: 8px;
 `),y("spin-content",`
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 pointer-events: all;
 `,[j("spinning",`
 user-select: none;
 -webkit-user-select: none;
 pointer-events: none;
 opacity: var(--n-opacity-spinning);
 `)])]),he={small:20,medium:18,large:16},ye=Object.assign(Object.assign({},z.props),{contentClass:String,contentStyle:[Object,String],description:String,stroke:String,size:{type:[String,Number],default:"medium"},show:{type:Boolean,default:!0},strokeWidth:Number,rotate:{type:Boolean,default:!0},spinning:{type:Boolean,validator:()=>!0,default:void 0},delay:Number}),ve=G({name:"Spin",props:ye,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:s}=I(e),i=z("Spin","-spin",ge,fe,e,t),a=x(()=>{const{size:o}=e,{common:{cubicBezierEaseInOut:c},self:u}=i.value,{opacitySpinning:m,color:C,textColor:w}=u,g=typeof o=="number"?Q(o):u[V("size",o)];return{"--n-bezier":c,"--n-opacity-spinning":m,"--n-size":g,"--n-color":C,"--n-text-color":w}}),n=s?X("spin",x(()=>{const{size:o}=e;return typeof o=="number"?String(o):o[0]}),a,e):void 0,l=Y(e,["spinning","show"]),r=q(!1);return Z(o=>{let c;if(l.value){const{delay:u}=e;if(u){c=window.setTimeout(()=>{r.value=!0},u),o(()=>{clearTimeout(c)});return}}r.value=l.value}),{mergedClsPrefix:t,active:r,mergedStrokeWidth:x(()=>{const{strokeWidth:o}=e;if(o!==void 0)return o;const{size:c}=e;return he[typeof c=="number"?"medium":c]}),cssVars:s?void 0:a,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender}},render(){var e,t;const{$slots:s,mergedClsPrefix:i,description:a}=this,n=s.icon&&this.rotate,l=(a||s.description)&&p("div",{class:`${i}-spin-description`},a||((e=s.description)===null||e===void 0?void 0:e.call(s))),r=s.icon?p("div",{class:[`${i}-spin-body`,this.themeClass]},p("div",{class:[`${i}-spin`,n&&`${i}-spin--rotate`],style:s.default?"":this.cssVars},s.icon()),l):p("div",{class:[`${i}-spin-body`,this.themeClass]},p(ee,{clsPrefix:i,style:s.default?"":this.cssVars,stroke:this.stroke,"stroke-width":this.mergedStrokeWidth,class:`${i}-spin`}),l);return(t=this.onRender)===null||t===void 0||t.call(this),s.default?p("div",{class:[`${i}-spin-container`,this.themeClass],style:this.cssVars},p("div",{class:[`${i}-spin-content`,this.active&&`${i}-spin-content--spinning`,this.contentClass],style:this.contentStyle},s),p(te,{name:"fade-in-transition"},{default:()=>this.active?r:null})):r}}),xe={__name:"ThePaginator",setup(e){const t=ne();function s(i){t.setPage(i,t.searchAndMapContent)}return(i,a)=>(B(),se(ie,null,[L(d(M),{justify:"center"},{default:N(()=>[d(t).isLoading?(B(),E(d(ve),{key:0,size:"5"})):_("",!0)]),_:1}),L(d(M),{justify:"center"},{default:N(()=>[d(t).searchResults?(B(),E(d(ae),{key:0,page:d(t).paginatorPage,"onUpdate:page":[a[0]||(a[0]=n=>d(t).paginatorPage=n),s],"page-count":d(t).resultsCount,size:"small"},null,8,["page","page-count"])):_("",!0)]),_:1})],64))}};export{xe as default};
