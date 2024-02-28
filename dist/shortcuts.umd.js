!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).shortcuts={})}(this,(function(e){"use strict";var t={_normalizeWithPlugins:function(e,t){return function(e){const n=t.shortcuts;Object.keys(n).forEach((t=>{Object.entries(n[t]).forEach((([o,r])=>{const i=e(o);i!==o&&(delete n[t][o],n[t][i]=r)}))}))}},changeContext:function(e,t){const{shortcuts:n,listenOptions:o,currentContext:r}=t,{ev:i}=e;return function(e=!1){const s=r.name;if(o.maxSequence=1,o.maxClicks=1,o.keyIgnore>=0&&(clearTimeout(o.keyIgnore),o.keyIgnore=null),!e)return i.reset(),void(r.name=null);s!==e&&(n[e]?(n[s]&&i.reset(),Object.entries(n[e]).forEach((([e,t])=>{if(e.includes("MOUSE-CLICK-")){let[,,,t]=e.split("-"),n=parseInt(t);o.maxClicks<n&&(o.maxClicks=n)}else{let t=e.split(",").length;o.maxSequence<t&&(o.maxSequence=t)}t.forEach((t=>i.on(e,t)))})),r.name=e,i.emit("@context-change",n[s]),i.on("*",((e,...n)=>{console.log("EEE"),t.exposeShortcut&&t.exposeShortcut(e,...n)}))):i.emit("shortcuts-error",`Context '${e}' does not exist`))}},listShortcuts:function(e,t){const n=t.shortcuts;return function(e=null){if(null!=e){let t=n[e];return null==t?null:Object.entries(t).map((([e,t])=>e))}return Object.keys(n).map((e=>{let t={};return t.context=e,t.shortcuts=Object.entries(n[e]).map((([e,t])=>e)),t}))}},load:function(e,t){const{shortcuts:n,plugins:o}=t,{API:{changeContext:r,getContext:i}}=e;return function(e){const t=i(),s=o.map((e=>e.getPrefix()));let c=!1;Object.entries(e).forEach((([e,r])=>{e===t&&(c=!0),n[e]={},Object.entries(r).forEach((([t,r])=>{let i=t,c=s.map(((e,t)=>i.startsWith(e)?t:null)).filter((e=>null!==e));if(c.length){let e=c[0];i=o[e].shortcutName(t)}r instanceof Function&&(r=[r]),n[e][i]=r}))})),c&&(r(),r(t))}},unload:function(e,t){const{currentContext:n,shortcuts:o}=t,{ev:r}=e;return function(e){n.name!==e?o[e]?delete o[e]:r.emit("shortcuts-error",`Context '${e}' does not exist`):r.emit("shortcuts-error",`Context '${e}' can't be removed during is current active context. Change the context first`)}}};function n(e){const t=e.toUpperCase();if(!t.includes("KEY:"))return e;return`KEY:${t.slice(4).split(",").map((e=>e.trim())).map((e=>e.split("+").map((e=>e.trim())).sort().join("+"))).join(",")}`}function o(e,t){let{shiftKey:n,altKey:o,ctrlKey:r}=e,i=e.code.replace("Key","").replace("Digit",""),s=[];return r&&s.push("CTRL"),n&&s.push("SHIFT"),o&&s.push("ALT"),t.hasOwnProperty(i)?s.push(t[i].toUpperCase()):["ControlLeft","ControlRight","ShiftLeft","ShiftRight","AltLeft","AltRight","Meta"].includes(i)||s.push(i.toUpperCase()),s.sort()}function r(e,t){let n=0;const{ev:o}=e,{listenOptions:r,currentContext:{name:i},shortcuts:s}=t;return null==i?0:(Object.entries(s[i]).forEach((([e,t])=>{if(!e.includes("KEY:"))return;n++;let i=e.slice(4).split(",").length;r.maxSequence<i&&(r.maxSequence=i),t.forEach((t=>o.on(e,t)))})),n)}function i(){return{ArrowLeft:"LEFT",ArrowUp:"UP",ArrowRight:"RIGHT",ArrowDown:"DOWN",Enter:"ENTER",NumpadEnter:"ENTER",Escape:"ESC",Backspace:"BACKSPACE",Space:"SPACE",Tab:"TAB",Backquote:"`",BracketLeft:"[",BracketRight:"]",Equal:"=",Slash:"/",Backslash:"\\",IntlBackslash:"`",F1:"F1",F2:"F2",F3:"F3",F4:"F4",F5:"F5",F6:"F6",F7:"F7",F8:"F8",F9:"F9",F10:"F10",F11:"F11",F12:"F12"}}function s(e,t,n){const{listenOptions:{clickTarget:o}}=t;let r=n;return r===document||r===document.body?null:r.dataset[o]||"A"===r.nodeName?r:s(e,t,r.parentNode)}function c(e){const t=e.toUpperCase(),n=t.includes("CLICK:"),o=["LEFT","MIDDLE","RIGHT"],r=["ALT","SHIFT","CTRL"];let i=null,s=[],c=0;return n?(t.slice(6).split("-").forEach((e=>{o.includes(e)?i=e:r.includes(e)?s.push(e):isNaN(e)||(c=e)})),`CLICK:${i}-${c}${s.length>0?"-":""}${s.sort().join("-")}`):e}function u(e,t){let{shiftKey:n,altKey:o,ctrlKey:r,key:i,button:s}=e,c=`CLICK:${["LEFT","MIDDLE","RIGHT"][s]}-${t}`,u=[];return r&&u.push("CTRL"),n&&u.push("SHIFT"),o&&u.push("ALT"),u.length>0?`${c}${u.length>0?"-":""}${u.sort().join("-")}`:`${c}`}function l(e,t){let n=0;const{ev:o}=e,{listenOptions:r,currentContext:{name:i},shortcuts:s}=t;return null==i?0:(Object.entries(s[i]).forEach((([e,t])=>{if(!e.includes("CLICK:"))return;n++;let[,i]=e.slice(6).split("-");r.maxClicks<i&&(r.maxClicks=i),t.forEach((t=>o.on(e,t)))})),n)}function a(e={}){const n=new function(){let e={"*":[]},t={},n=[],o=!1,r="";return{on:function(t,n){e[t]||(e[t]=[]),e[t].push(n)},once:function(e,n){"*"!==e&&(t[e]||(t[e]=[]),t[e].push(n))},off:function(n,o){if(o)return e[n]&&(e[n]=e[n].filter((e=>e!==o))),t[n]&&(t[n]=t[n].filter((e=>e!==o))),e[n]&&0===e[n].length&&delete e[n],void(t[n]&&0===t[n].length&&delete e[n]);t[n]&&delete t[n],e[n]&&delete e[n]},reset:function(){e={"*":[]},t={},n=[]},emit:function(){const[i,...s]=arguments;function c(t){"*"!==t&&(n.includes(t)||(e[t].forEach((e=>e(...s))),e["*"].forEach((e=>e(i,...s)))))}if(o&&(console.log(`${r} Event "${i}" was triggered.`),s.length>0&&(console.log("Arguments:"),console.log(...s),console.log("^----"))),"*"!==i){if(t[i]){if(n.includes(i))return;t[i].forEach((e=>e(...s))),delete t[i]}e[i]&&c(i)}else Object.keys(e).forEach((e=>c(e)))},stop:function(o){if("*"!==o)n.push(o);else{const o=Object.keys(e),r=Object.keys(t);n=[...r,...o]}},start:function(e){n="*"!==e?n.filter((t=>e!=t)):[]},debug:function(e,t){o=!!e,t&&"string"==typeof t&&(r=t)}}},o={},r={},i={currentContext:{name:null,note:null},shortcuts:{},listenOptions:{mouseWait:e.mouseWait?e.mouseWait:320,maxClicks:1,keyWait:e.keyWait?e.keyWait:480,maxSequence:1,clickTarget:e.clickTarget?e.clickTarget:"click",keyIgnore:null},plugins:[],exposeShortcut:!(!e.onShortcut||"function"!=typeof e.onShortcut)&&e.onShortcut,streamKeys:!(!e.streamKeys||"function"!=typeof e.streamKeys)&&e.streamKeys},s={ev:n,inAPI:o,API:r,extra:{}};function c(e,t,n=null){return i.plugins.findIndex((o=>o.getPrefix()===e&&(o[t]&&o[t](n),!0)))}return n.on("@context-change",(e=>i.plugins.map((t=>t.contextChange(e))))),r.enable=(e,t={})=>{if(-1===c(e.name,"none")){let n;n=e(s,i,t),i.plugins.push(n)}},r.disable=e=>{const t=c(e,"destroy");-1!==t&&(i.plugins=i.plugins.filter(((e,n)=>n!==t)))},r.mute=e=>c(e,"mute"),r.unmute=e=>c(e,"unmute"),r.getContext=()=>i.currentContext.name,r.getNote=()=>i.currentContext.note,r.setNote=(e=null)=>{"string"!=typeof e&&null!=e||(i.currentContext.note=e)},r.pause=(e="*")=>{const t=o._readShortcut(e);n.stop(t)},r.resume=(e="*")=>{const t=o._readShortcut(e);n.start(t)},r.emit=(e,...t)=>n.emit(o._readShortcut(e),s.extra,...t),r.listContexts=()=>Object.keys(i.shortcuts),r.setDependencies=e=>s.extra={...s.extra,...e},r.getDependencies=()=>s.extra,Object.entries(t).forEach((([e,t])=>{e.startsWith("_")?o[e]=t(s,i):r[e]=t(s,i)})),r}a.getDefaults=()=>({mouseWait:320,keyWait:480,clickTarget:"click",onShortcut:!1,streamKeys:!1}),e.pluginClick=function(e,t,n){const{currentContext:o,shortcuts:r}=t,{inAPI:i}=e,a={ev:e.ev,_findTarget:s,_readClickEvent:u},m={currentContext:o,shortcuts:r,listenOptions:{mouseWait:n.mouseWait?n.mouseWait:320,maxClicks:1,clickTarget:n.clickTarget?n.clickTarget:"click"}};i._normalizeWithPlugins(c);let f=function(e,t){const{ev:n,_findTarget:o,_readClickEvent:r}=e,{listenOptions:i,currentContext:s}=t,{mouseWait:c}=i;let u=null,l=null,a=null,m=null,f=0;function h(){const t=r(l,f),o={target:u,targetProps:u?u.getBoundingClientRect():null,x:l.clientX,y:l.clientY,context:s.name,note:s.note,event:l,dependencies:e.extra,type:"click"};n.emit(t,o),a=null,m=null,u=null,l=null,f=0}function p(n){let r=i.maxClicks;return clearTimeout(a),m?(clearTimeout(m),void(m=setTimeout((()=>m=null),c))):(u=o(e,t,n.target),u&&u.dataset.hasOwnProperty("quickClick")&&(r=1),u&&"A"===u.tagName&&(r=1),l=n,f++,f>=r?(h(),void(r>1&&(m=setTimeout((()=>m=null),c)))):void(a=setTimeout(h,c)))}function d(n){let r=i.maxClicks;return clearTimeout(a),m?(clearTimeout(m),void(m=setTimeout((()=>m=null),c))):(u=o(e,t,n.target),u&&u.dataset.hasOwnProperty("quickClick")&&(r=1),u&&"A"===u.tagName&&(r=1),l=n,f++,f>=r?(h(),void(r>1&&(m=setTimeout((()=>m=null),c)))):void(a=setTimeout(h,c)))}return{start:function(){t.active||(window.addEventListener("contextmenu",d),document.addEventListener("click",p),t.active=!0)},stop:function(){t.active&&(window.removeEventListener("contextmenu",d),document.removeEventListener("click",p),t.active=!1)}}}(a,m),h=l(e,m);h>0&&f.start();const p={getPrefix:()=>"click",shortcutName:e=>c(e),contextChange:()=>{h=l(a,m),h<1&&f.stop(),h>0&&f.start()},mute:()=>f.stop(),unmute:()=>f.start(),destroy:()=>{f.stop(),m=null,p=null}};return Object.freeze(p),p},e.pluginKey=function(e,t,s={}){const{currentContext:c,shortcuts:u}=t,{inAPI:l}=e,a={ev:e.ev,_specialChars:i,_readKeyEvent:o},m={currentContext:c,shortcuts:u,active:!1,listenOptions:{keyWait:s.keyWait?s.keyWait:480,maxSequence:1,keyIgnore:null},streamKeys:!(!s.streamKeys||"function"!=typeof s.streamKeys)&&s.streamKeys,exposeShortcut:exposeShortcut};l._normalizeWithPlugins(n);let f=function(e,t){const{ev:n,_specialChars:o,_readKeyEvent:r}=e,{currentContext:i,streamKeys:s,listenOptions:c}=t,{keyWait:u}=c;let l=[],a=null,m=!0,f=!1;const h=()=>m=!1,p=()=>m=!0,d=()=>f=!0,g=()=>!1===m;function y(){let t=l.map((e=>[e.join("+")]));if(!m){let e=t.at(-1);n.emit(e,{wait:h,end:p,ignore:d,isWaiting:g,note:i.note,context:i.name}),f&&(t=t.slice(0,-1),f=!1)}const o={wait:h,end:p,ignore:d,isWaiting:g,note:i.note,context:i.name,dependencies:e.extra};if(m){const e=`KEY:${t.join(",")}`;n.emit(e,o),l=[],a=null}}function x(t){if(clearTimeout(a),o.hasOwnProperty(t.code))return l.push(r(t,o)),s&&s({key:t.key,context:i.name,note:i.note,dependencies:e.extra}),c.keyIgnore?(clearTimeout(c.keyIgnore),void(c.keyIgnore=setTimeout((()=>c.keyIgnore=null),u))):m&&l.length===c.maxSequence?(y(),void(c.keyIgnore=setTimeout((()=>c.keyIgnore=null),u))):void(m?a=setTimeout(y,u):y())}function k(t){if(!o.hasOwnProperty(t.code)){if(clearTimeout(a),s&&s({key:t.key,context:i.name,note:i.note,dependencies:e.extra}),c.keyIgnore)return clearTimeout(c.keyIgnore),void(c.keyIgnore=setTimeout((()=>c.keyIgnore=null),u));if(l.push(r(t,o)),m&&l.length===c.maxSequence)return y(),void(c.keyIgnore=setTimeout((()=>c.keyIgnore=null),u));m?a=setTimeout(y,u):y()}}return{start:function(){t.active||(console.log("listen"),document.addEventListener("keydown",x),document.addEventListener("keypress",k),t.active=!0)},stop:function(){t.active&&(document.removeEventListener("keydown",x),document.removeEventListener("keypress",k),t.active=!1)}}}(a,m),h=r(e,m);h>0&&f.start();const p={getPrefix:()=>"key",shortcutName:e=>n(e),contextChange:e=>{h=r(a,m),h<1&&f.stop(),h>0&&f.start()},mute:()=>f.stop(),unmute:()=>f.start(),destroy:()=>{f.stop(),m=null,p=null}};return Object.freeze(p),p},e.shortcuts=a}));
