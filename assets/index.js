import{b as e,S as t,i as o,s as r,R as n,c as s,a,m as l,n as m,t as d,d as i,e as c}from"./vendor.js";let u;!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(o){const r=new URL(e,location),n=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((o,s)=>{const a=new URL(e,r);if(self[t].moduleMap[a])return o(self[t].moduleMap[a]);const l=new Blob([`import * as m from '${a}';`,`${t}.moduleMap['${a}']=m;`],{type:"text/javascript"}),m=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(l),onerror(){s(new Error(`Failed to import: ${e}`)),n(m)},onload(){o(self[t].moduleMap[a]),n(m)}});document.head.appendChild(m)})),self[t].moduleMap={}}}("/felte-form-demo/assets/");const p={},f=function(e,t){if(!t)return e();if(void 0===u){const e=document.createElement("link").relList;u=e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}return Promise.all(t.map((e=>{if(e in p)return;p[e]=!0;const t=e.endsWith(".css"),o=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${o}`))return;const r=document.createElement("link");return r.rel=t?"stylesheet":u,t||(r.as="script",r.crossOrigin=""),r.href=e,document.head.appendChild(r),t?new Promise(((e,t)=>{r.addEventListener("load",e),r.addEventListener("error",t)})):void 0}))).then((()=>e()))},_={root:!0,children:[{isPage:!0,path:"/felte-form-demo",id:"_felteFormDemo",component:()=>f((()=>__import__("./felte-form-demo.js")),["/felte-form-demo/assets/felte-form-demo.js","/felte-form-demo/assets/felte-form-demo.css","/felte-form-demo/assets/vendor.js"]).then((e=>e.default))}],isLayout:!0,path:"/",id:"__folder",component:()=>f((()=>__import__("./_folder.js")),["/felte-form-demo/assets/_folder.js","/felte-form-demo/assets/vendor.js"]).then((e=>e.default))},{tree:h,routes:$}=e(_);function E(e){let t,o;return t=new n({props:{routes:$}}),{c(){s(t.$$.fragment)},l(e){a(t.$$.fragment,e)},m(e,r){l(t,e,r),o=!0},p:m,i(e){o||(d(t.$$.fragment,e),o=!0)},o(e){i(t.$$.fragment,e),o=!1},d(e){c(t,e)}}}function L(e){return console.log({BASE_URL:"/felte-form-demo/",MODE:"production",DEV:!1,PROD:!0}),[]}new class extends t{constructor(e){super(),o(this,e,L,E,r,{})}}({target:document.body});
