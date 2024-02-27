import e from"@peter.naydenov/notice";var t={_findTarget:function(e,t){const{listenOptions:{clickTarget:n}}=t;return function e(t){const o=t;return o===document||o===document.body?null:o.dataset[n]||"A"===o.nodeName?o:e(o.parentNode)}},_listen:function(e,t){return function(){const{ev:n,inAPI:{_findTarget:o,_specialChars:r,_readKeyEvent:i,_readMouseEvent:s}}=e,{exposeShortcut:u,currentContext:c,streamKeys:a,listenOptions:l}=t,{mouseWait:m,keyWait:d,clickTarget:h,listenFor:p}=l;let g=[],f=null,x=null,y=null,k=null,C=null,T=!0,E=!1,F=0;const I=()=>T=!1,v=()=>T=!0,S=()=>E=!0,O=()=>!1===T;function A(){let t=g.map((e=>[e.join("+")]));if(!T){let e=t.at(-1);n.emit(e,{wait:I,end:v,ignore:S,isWaiting:O,note:c.note,context:c.name}),E&&(t=t.slice(0,-1),E=!1)}const o={wait:I,end:v,ignore:S,isWaiting:O,note:c.note,context:c.name,dependencies:e.extra};T&&(n.emit(t.join(","),o),u&&u({shortcut:t.join(","),context:c.name,note:c.note,dependencies:e.extra}),g=[],y=null)}function b(){const t=s(x,F),o={target:f,targetProps:f?f.getBoundingClientRect():null,x:x.clientX,y:x.clientY,context:c.name,note:c.note,event:x,dependencies:e.extra};n.emit(t.join("+"),o),u&&u({shortcut:t.join("+"),context:c.name,note:c.note,dependencies:e.extra}),k=null,C=null,f=null,x=null,F=0}p.includes("mouse")&&(window.addEventListener("contextmenu",(e=>{let t=l.maxClicks;return clearTimeout(k),C?(clearTimeout(C),void(C=setTimeout((()=>C=null),m))):(f=o(e.target),f&&f.dataset.hasOwnProperty("quickClick")&&(t=1),f&&"A"===f.tagName&&(t=1),x=e,F++,F>=t?(b(),void(t>1&&(C=setTimeout((()=>C=null),m)))):void(k=setTimeout(b,m)))})),document.addEventListener("click",(e=>{let t=l.maxClicks;return clearTimeout(k),C?(clearTimeout(C),void(C=setTimeout((()=>C=null),m))):(f=o(e.target),f&&f.dataset.hasOwnProperty("quickClick")&&(t=1),f&&"A"===f.tagName&&(t=1),x=e,F++,F>=t?(b(),void(t>1&&(C=setTimeout((()=>C=null),m)))):void(k=setTimeout(b,m)))}))),p.includes("keyboard")&&(document.addEventListener("keydown",(t=>{if(clearTimeout(y),r.hasOwnProperty(t.code))return g.push(i(t,r)),a&&a({key:t.key,context:c.name,note:c.note,dependencies:e.extra}),l.keyIgnore?(clearTimeout(l.keyIgnore),void(l.keyIgnore=setTimeout((()=>l.keyIgnore=null),d))):T&&g.length===l.maxSequence?(A(),void(l.keyIgnore=setTimeout((()=>l.keyIgnore=null),d))):void(T?y=setTimeout(A,d):A())})),document.addEventListener("keypress",(t=>{if(!r.hasOwnProperty(t.code)){if(clearTimeout(y),a&&a({key:t.key,context:c.name,note:c.note,dependencies:e.extra}),l.keyIgnore)return clearTimeout(l.keyIgnore),void(l.keyIgnore=setTimeout((()=>l.keyIgnore=null),d));if(g.push(i(t,r)),T&&g.length===l.maxSequence)return A(),void(l.keyIgnore=setTimeout((()=>l.keyIgnore=null),d));T?y=setTimeout(A,d):A()}})))}},_readKeyEvent:function(){return function(e,t){let{shiftKey:n,altKey:o,ctrlKey:r}=e,i=e.code.replace("Key","").replace("Digit",""),s=[];return r&&s.push("CTRL"),n&&s.push("SHIFT"),o&&s.push("ALT"),t.hasOwnProperty(i)?s.push(t[i].toUpperCase()):["ControlLeft","ControlRight","ShiftLeft","ShiftRight","AltLeft","AltRight","Meta"].includes(i)||s.push(i.toUpperCase()),s.sort()}},_readMouseEvent:function(){return function(e,t){let{shiftKey:n,altKey:o,ctrlKey:r,key:i,button:s}=e,u=`MOUSE-CLICK-${["LEFT","MIDDLE","RIGHT"][s]}-${t}`,c=[];return c.push(u),r&&c.push("CTRL"),n&&c.push("SHIFT"),o&&c.push("ALT"),c.sort()}},_readShortcut:function(){return function(e){return e.split(",").map((e=>e.trim())).map((e=>e.split("+").map((e=>e.toUpperCase())).sort().join("+"))).join(",")}},_specialChars:function(){return{ArrowLeft:"LEFT",ArrowUp:"UP",ArrowRight:"RIGHT",ArrowDown:"DOWN",Enter:"ENTER",NumpadEnter:"ENTER",Escape:"ESC",Backspace:"BACKSPACE",Space:"SPACE",Tab:"TAB",Backquote:"`",BracketLeft:"[",BracketRight:"]",Equal:"=",Slash:"/",Backslash:"\\",IntlBackslash:"`",F1:"F1",F2:"F2",F3:"F3",F4:"F4",F5:"F5",F6:"F6",F7:"F7",F8:"F8",F9:"F9",F10:"F10",F11:"F11",F12:"F12"}},changeContext:function(e,t){const{shortcuts:n,listenOptions:o,currentContext:r}=t,{ev:i}=e;return function(e=!1){const t=r.name;if(o.maxSequence=1,o.maxClicks=1,o.keyIgnore>=0&&(clearTimeout(o.keyIgnore),o.keyIgnore=null),!e)return i.reset(),void(r.name=null);t!==e&&(n[e]?(n[t]&&i.reset(),Object.entries(n[e]).forEach((([e,t])=>{if(e.includes("MOUSE-CLICK-")){let[,,,t]=e.split("-"),n=parseInt(t);o.maxClicks<n&&(o.maxClicks=n)}else{let t=e.split(",").length;o.maxSequence<t&&(o.maxSequence=t)}t.forEach((t=>i.on(e,t)))})),r.name=e,i.emit("@context-change",n[t])):i.emit("shortcuts-error",`Context '${e}' does not exist`))}},listShortcuts:function(e,t){const n=t.shortcuts;return function(e=null){if(null!=e){let t=n[e];return null==t?null:Object.entries(t).map((([e,t])=>e))}return Object.keys(n).map((e=>{let t={};return t.context=e,t.shortcuts=Object.entries(n[e]).map((([e,t])=>e)),t}))}},load:function(e,t){const{shortcuts:n,plugins:o}=t,{API:{changeContext:r,getContext:i}}=e;return function(e){const t=i(),s=o.map((e=>e.getPrefix()));let u=!1;Object.entries(e).forEach((([e,r])=>{e===t&&(u=!0),n[e]={},Object.entries(r).forEach((([t,r])=>{let i=t,u=s.map(((e,t)=>i.startsWith(e)?t:null)).filter((e=>null!==e));if(u.length){let e=u[0];i=o[e].shortcutName(t)}r instanceof Function&&(r=[r]),n[e][i]=r}))})),u&&(r(),r(t))}},unload:function(e,t){const{currentContext:n,shortcuts:o}=t,{ev:r}=e;return function(e){n.name!==e?o[e]?delete o[e]:r.emit("shortcuts-error",`Context '${e}' does not exist`):r.emit("shortcuts-error",`Context '${e}' can't be removed during is current active context. Change the context first`)}}};function n(n={}){const o=e(),r={},i={},s={currentContext:{name:null,note:null},shortcuts:{},listenOptions:{mouseWait:n.mouseWait?n.mouseWait:320,maxClicks:1,keyWait:n.keyWait?n.keyWait:480,maxSequence:1,clickTarget:n.clickTarget?n.clickTarget:"click",keyIgnore:null},plugins:[],exposeShortcut:!(!n.onShortcut||"function"!=typeof n.onShortcut)&&n.onShortcut,streamKeys:!(!n.streamKeys||"function"!=typeof n.streamKeys)&&n.streamKeys},u={ev:o,inAPI:r,API:i,extra:{}};function c(e,t,n=null){return s.plugins.findIndex((o=>o.getPrefix()===e&&(o[t]&&o[t](n),!0)))}return o.on("@context-change",(e=>{o.reset(),s.plugins.map((t=>t.contextChange(e)))})),i.enable=(e,t)=>{if(-1===c(e.name,"none")){let n;n=t?e(u,s,t):e(u,s),s.plugins.push(n)}},i.disable=e=>{const t=c(e,"destroy");-1!==t&&(s.plugins=s.plugins.filter(((e,n)=>n!==t)))},i.mute=e=>c(e,"mute"),i.unmute=e=>c(e,"unmute"),i.getContext=()=>s.currentContext.name,i.getNote=()=>s.currentContext.note,i.setNote=(e=null)=>{"string"!=typeof e&&null!=e||(s.currentContext.note=e)},i.pause=(e="*")=>{const t=r._readShortcut(e);o.stop(t)},i.resume=(e="*")=>{const t=r._readShortcut(e);o.start(t)},i.emit=(e,...t)=>o.emit(r._readShortcut(e),u.extra,...t),i.listContexts=()=>Object.keys(shortcuts),i.listShortcuts=e=>{if(console.log("HAM"),e&&shortcuts[e])return Object.keys(shortcuts[e]);const t=[];return Object.entries(shortcuts).forEach((([e,n])=>{Object.keys(n).forEach((n=>t.push(`${e} -> ${n}`)))})),t},i.setDependencies=e=>u.extra={...u.extra,...e},i.getDependencies=()=>u.extra,Object.entries(t).forEach((([e,t])=>{e.startsWith("_")?r[e]=t(u,s):i[e]=t(u,s)})),i}n.getDefaults=()=>({mouseWait:320,keyWait:480,clickTarget:"click",onShortcut:!1,streamKeys:!1});export{n as default};
