"use strict";var e=require("@peter.naydenov/notice");var t={_normalizeWithPlugins:function(e,t){return function(e){const n=t.shortcuts;Object.keys(n).forEach((t=>{Object.entries(n[t]).forEach((([o,r])=>{const i=e(o);i!==o&&(delete n[t][o],n[t][i]=r)}))}))}},_readShortcutWithPlugins:function(e,t){return function(n){const{inAPI:o}=e,r=n.split(":")[0],i=o._systemAction(r,"none");let s=n;return-1!==i&&(s=t.plugins[i].shortcutName(n)),s}},_systemAction:function(e,t){return function(e,n,o=null){return t.plugins.findIndex((t=>t.getPrefix()===e&&(t[n]&&t[n](o),!0)))}},changeContext:function(e,t){const{shortcuts:n,currentContext:o}=t,{ev:r}=e;return function(e=!1){const i=o.name;if(!e)return r.reset(),void(o.name=null);i!==e&&(n[e]?(n[i]&&r.reset(),o.name=e,t.plugins.forEach((t=>t.contextChange(e))),Object.entries(n[e]).forEach((([e,t])=>{t.forEach((t=>r.on(e,t)))})),r.on("*",((...e)=>{t.exposeShortcut&&t.exposeShortcut(...e)}))):r.emit("@shortcuts-error",`Context '${e}' does not exist`))}},listShortcuts:function(e,t){const n=t.shortcuts;return function(e=null){if(null!=e){let t=n[e];return null==t?null:Object.entries(t).map((([e,t])=>e))}return Object.keys(n).map((e=>{let t={};return t.context=e,t.shortcuts=Object.entries(n[e]).map((([e,t])=>e)),t}))}},load:function(e,t){const{shortcuts:n,plugins:o}=t,{API:{changeContext:r,getContext:i}}=e;return function(e){const t=i(),s=o.map((e=>e.getPrefix().toUpperCase()));let u=!1;Object.entries(e).forEach((([e,r])=>{e===t&&(u=!0),n[e]={},Object.entries(r).forEach((([t,r])=>{let i=t,u=t.toUpperCase().trim(),c=s.map(((e,t)=>u.startsWith(e)?t:null)).filter((e=>null!==e));if(c.length){let e=c[0];i=o[e].shortcutName(t)}r instanceof Function&&(r=[r]),n[e][i]=r}))})),u&&(r(),r(t))}},unload:function(e,t){const{currentContext:n,shortcuts:o}=t,{ev:r}=e;return function(e){n.name!==e?o[e]?delete o[e]:r.emit("shortcuts-error",`Context '${e}' does not exist`):r.emit("shortcuts-error",`Context '${e}' can't be removed during is current active context. Change the context first`)}}};function n(e){const t=e.toUpperCase(),n=/KEY\s*\:/i.test(t),o=t.indexOf(":");if(!n)return e;return`KEY:${t.slice(o+1).split(",").map((e=>e.trim())).map((e=>e.split("+").map((e=>e.trim())).sort().join("+"))).join(",")}`}function o(e,t){let{shiftKey:n,altKey:o,ctrlKey:r}=e,i=e.code.replace("Key","").replace("Digit",""),s=[];return r&&s.push("CTRL"),n&&s.push("SHIFT"),o&&s.push("ALT"),t.hasOwnProperty(i)?s.push(t[i].toUpperCase()):["ControlLeft","ControlRight","ShiftLeft","ShiftRight","AltLeft","AltRight","Meta"].includes(i)||s.push(i.toUpperCase()),s.sort()}function r(e,t){let n=0;const{regex:o}=e,{listenOptions:r,currentContext:{name:i},shortcuts:s}=t;return null==i?0:(Object.entries(s[i]).forEach((([e,t])=>{if(!o.test(e))return;n++;let i=e.slice(4).split(",").length;r.maxSequence<i&&(r.maxSequence=i)})),n)}function i(){return{ArrowLeft:"LEFT",ArrowUp:"UP",ArrowRight:"RIGHT",ArrowDown:"DOWN",Enter:"ENTER",NumpadEnter:"ENTER",Escape:"ESC",Backspace:"BACKSPACE",Space:"SPACE",Tab:"TAB",Backquote:"`",BracketLeft:"[",BracketRight:"]",Equal:"=",Slash:"/",Backslash:"\\",IntlBackslash:"`",F1:"F1",F2:"F2",F3:"F3",F4:"F4",F5:"F5",F6:"F6",F7:"F7",F8:"F8",F9:"F9",F10:"F10",F11:"F11",F12:"F12"}}function s(e,t,n){const{listenOptions:{clickTarget:o}}=t;let r=n;return r===document||r===document.body?null:r.dataset[o]||"A"===r.nodeName?r:s(e,t,r.parentNode)}function u(e){const t=e.toUpperCase(),n=/CLICK\s*\:/i.test(t),o=["LEFT","MIDDLE","RIGHT"],r=["ALT","SHIFT","CTRL"];let i=null,s=[],u=0,c=t.indexOf(":");return n?(t.slice(c+1).trim().split("-").map((e=>e.trim())).forEach((e=>{o.includes(e)?i=e:r.includes(e)?s.push(e):isNaN(e)||(u=e)})),`CLICK:${i}-${u}${s.length>0?"-":""}${s.sort().join("-")}`):e}function c(e,t){let{shiftKey:n,altKey:o,ctrlKey:r,key:i,button:s}=e,u=`CLICK:${["LEFT","MIDDLE","RIGHT"][s]}-${t}`,c=[];return r&&c.push("CTRL"),n&&c.push("SHIFT"),o&&c.push("ALT"),c.length>0?`${u}${c.length>0?"-":""}${c.sort().join("-")}`:`${u}`}function l(e,t){let n=0;const{regex:o}=e,{listenOptions:r,currentContext:{name:i},shortcuts:s}=t;return null==i?0:(Object.entries(s[i]).forEach((([e,t])=>{if(!o.test(e))return;n++;let[,i]=e.slice(6).split("-");r.maxClicks<i&&(r.maxClicks=i)})),n)}exports.pluginClick=function(e,t,n){let{currentContext:o,shortcuts:r}=t,{inAPI:i}=e,a={ev:e.ev,_findTarget:s,_readClickEvent:c,mainDependencies:e,regex:/CLICK\s*\:/i},m={currentContext:o,shortcuts:r,listenOptions:{mouseWait:n.mouseWait?n.mouseWait:320,maxClicks:1,clickTarget:n.clickTarget?n.clickTarget:"click"}};i._normalizeWithPlugins(u);let p=function(e,t){const{ev:n,_findTarget:o,_readClickEvent:r,mainDependencies:i}=e,{listenOptions:s,currentContext:u}=t,{mouseWait:c}=s;let l=null,a=null,m=null,p=null,h=0;function f(){const e=r(a,h),t={target:l,targetProps:l?l.getBoundingClientRect():null,x:a.clientX,y:a.clientY,context:u.name,note:u.note,event:a,dependencies:i.extra,type:"click"};n.emit(e,t),m=null,p=null,l=null,a=null,h=0}function d(n){let r=s.maxClicks;return clearTimeout(m),p?(clearTimeout(p),void(p=setTimeout((()=>p=null),c))):(l=o(e,t,n.target),l&&l.dataset.hasOwnProperty("quickClick")&&(r=1),l&&"A"===l.tagName&&(r=1),a=n,h++,h>=r?(f(),void(r>1&&(p=setTimeout((()=>p=null),c)))):void(m=setTimeout(f,c)))}function g(n){let r=s.maxClicks;return clearTimeout(m),p?(clearTimeout(p),void(p=setTimeout((()=>p=null),c))):(l=o(e,t,n.target),l&&l.dataset.hasOwnProperty("quickClick")&&(r=1),l&&"A"===l.tagName&&(r=1),a=n,h++,h>=r?(f(),void(r>1&&(p=setTimeout((()=>p=null),c)))):void(m=setTimeout(f,c)))}return{start:function(){t.active||(window.addEventListener("contextmenu",g),document.addEventListener("click",d),t.active=!0)},stop:function(){t.active&&(window.removeEventListener("contextmenu",g),document.removeEventListener("click",d),t.active=!1)}}}(a,m),h=l(a,m);h>0&&p.start();let f={getPrefix:()=>"click",shortcutName:e=>u(e),contextChange:()=>{h=l(a,m),h<1&&p.stop(),h>0&&p.start()},mute:()=>p.stop(),unmute:()=>p.start(),destroy:()=>{p.stop(),m=null,f=null}};return Object.freeze(f),f},exports.pluginKey=function(e,t,s={}){let{currentContext:u,shortcuts:c,exposeShortcut:l}=t,{inAPI:a}=e,m={ev:e.ev,_specialChars:i,_readKeyEvent:o,mainDependencies:e,regex:/KEY\s*\:/i},p={currentContext:u,shortcuts:c,active:!1,listenOptions:{keyWait:s.keyWait?s.keyWait:480,maxSequence:1,keyIgnore:null},streamKeys:!(!s.streamKeys||"function"!=typeof s.streamKeys)&&s.streamKeys,exposeShortcut:l};a._normalizeWithPlugins(n);let h=function(e,t){const{ev:n,_specialChars:o,_readKeyEvent:r,mainDependencies:i}=e,{currentContext:s,streamKeys:u,listenOptions:c}=t,{keyWait:l}=c;let a=[],m=null,p=!0,h=!1;const f=()=>p=!1,d=()=>p=!0,g=()=>h=!0,x=()=>!1===p;function y(){let e=a.map((e=>[e.join("+")]));const t={wait:f,end:d,ignore:g,isWaiting:x,note:s.note,context:s.name,dependencies:i.extra,type:"key"};if(!p){let o=e.at(-1);n.emit(o,t),h&&(e=e.slice(0,-1),h=!1)}if(p){const o=`KEY:${e.join(",")}`;n.emit(o,t),a=[],m=null}}function C(t){if(clearTimeout(m),o.hasOwnProperty(t.code))return a.push(r(t,o)),u&&u({key:t.key,context:s.name,note:s.note,dependencies:e.extra}),c.keyIgnore?(clearTimeout(c.keyIgnore),void(c.keyIgnore=setTimeout((()=>c.keyIgnore=null),l))):p&&a.length===c.maxSequence?(y(),void(c.keyIgnore=setTimeout((()=>c.keyIgnore=null),l))):void(p?m=setTimeout(y,l):y())}function k(t){if(!o.hasOwnProperty(t.code)){if(clearTimeout(m),u&&u({key:t.key,context:s.name,note:s.note,dependencies:e.extra}),c.keyIgnore)return clearTimeout(c.keyIgnore),void(c.keyIgnore=setTimeout((()=>c.keyIgnore=null),l));if(a.push(r(t,o)),p&&a.length===c.maxSequence)return y(),void(c.keyIgnore=setTimeout((()=>c.keyIgnore=null),l));p?m=setTimeout(y,l):y()}}return{start:function(){t.active||(document.addEventListener("keydown",C),document.addEventListener("keypress",k),t.active=!0)},stop:function(){t.active&&(document.removeEventListener("keydown",C),document.removeEventListener("keypress",k),t.active=!1)}}}(m,p),f=r(m,p);f>0&&h.start();let d={getPrefix:()=>"key",shortcutName:e=>n(e),contextChange:e=>{f=r(m,p),f<1&&h.stop(),f>0&&h.start()},mute:()=>h.stop(),unmute:()=>h.start(),destroy:()=>{h.stop(),p=null,d=null}};return Object.freeze(d),d},exports.shortcuts=function(n={}){const o=e(),r={},i={},s={currentContext:{name:null,note:null},shortcuts:{},plugins:[],exposeShortcut:!(!n.onShortcut||"function"!=typeof n.onShortcut)&&n.onShortcut},u={ev:o,inAPI:r,API:i,extra:{}};return i.enablePlugin=(e,t={})=>{const n=e.name;if(-1===r._systemAction(n,"none")){let n;n=e(u,s,t),s.plugins.push(n)}},i.disablePlugin=e=>{const t=r._systemAction(e,"destroy");-1!==t&&(s.plugins=s.plugins.filter(((e,n)=>n!==t)))},i.mutePlugin=e=>r._systemAction(e,"mute"),i.unmutePlugin=e=>r._systemAction(e,"unmute"),i.getContext=()=>s.currentContext.name,i.getNote=()=>s.currentContext.note,i.setNote=(e=null)=>{"string"!=typeof e&&null!=e||(s.currentContext.note=e)},i.pause=(e="*")=>{let t=r._readShortcutWithPlugins(e);o.stop(t)},i.resume=(e="*")=>{const t=r._readShortcutWithPlugins(e);o.start(t)},i.emit=(e,...t)=>o.emit(r._readShortcutWithPlugins(e),...t),i.listContexts=()=>Object.keys(s.shortcuts),i.setDependencies=e=>u.extra={...u.extra,...e},i.getDependencies=()=>u.extra,Object.entries(t).forEach((([e,t])=>{e.startsWith("_")?r[e]=t(u,s):i[e]=t(u,s)})),i};
