import t from"@peter.naydenov/notice";var e={_normalizeWithPlugins:function(t,e){return function(t){const n=e.shortcuts;Object.keys(n).forEach((e=>{Object.entries(n[e]).forEach((([o,r])=>{const i=t(o);i!==o&&(delete n[e][o],n[e][i]=r)}))}))}},_readShortcutWithPlugins:function(t,e){return function(n){const{inAPI:o}=t,r=n.split(":")[0],i=o._systemAction(r,"none");let s=n;return-1!==i&&(s=e.plugins[i].shortcutName(n)),s}},_systemAction:function(t,e){return function(t,n,o=null){return e.plugins.findIndex((e=>e.getPrefix()===t&&(e[n]&&e[n](o),!0)))}},changeContext:function(t,e){const{shortcuts:n,currentContext:o}=e,{ev:r}=t;return function(t=!1){const i=o.name;if(!t)return r.reset(),void(o.name=null);i!==t&&(n[t]?(n[i]&&r.reset(),o.name=t,e.plugins.forEach((e=>e.contextChange(t))),Object.entries(n[t]).forEach((([t,e])=>{e.forEach((e=>r.on(t,e)))})),r.on("*",((...t)=>{e.exposeShortcut&&e.exposeShortcut(...t)}))):r.emit("@shortcuts-error",`Context '${t}' does not exist`))}},listShortcuts:function(t,e){const n=e.shortcuts;return function(t=null){if(null!=t){let e=n[t];return null==e?null:Object.entries(e).map((([t,e])=>t))}return Object.keys(n).map((t=>{let e={};return e.context=t,e.shortcuts=Object.entries(n[t]).map((([t,e])=>t)),e}))}},load:function(t,e){const{shortcuts:n,plugins:o}=e,{API:{changeContext:r,getContext:i}}=t;return function(t){const e=i(),s=o.map((t=>t.getPrefix().toUpperCase()));let c=!1;Object.entries(t).forEach((([t,r])=>{t===e&&(c=!0),n[t]={},Object.entries(r).forEach((([e,r])=>{let i=e,c=e.toUpperCase().trim(),u=s.map(((t,e)=>c.startsWith(t)?e:null)).filter((t=>null!==t));if(u.length){let t=u[0];i=o[t].shortcutName(e)}r instanceof Function&&(r=[r]),n[t][i]=r}))})),c&&(r(),r(e))}},unload:function(t,e){const{currentContext:n,shortcuts:o}=e,{ev:r}=t;return function(t){n.name!==t?o[t]?delete o[t]:r.emit("shortcuts-error",`Context '${t}' does not exist`):r.emit("shortcuts-error",`Context '${t}' can't be removed during is current active context. Change the context first`)}}};function n(t){const e=t.toUpperCase(),n=/KEY\s*\:/i.test(e),o=e.indexOf(":");if(!n)return t;return`KEY:${e.slice(o+1).split(",").map((t=>t.trim())).map((t=>t.split("+").map((t=>t.trim())).sort().join("+"))).join(",")}`}function o(t,e){let{shiftKey:n,altKey:o,ctrlKey:r}=t,i=t.code.replace("Key","").replace("Digit",""),s=[];return r&&s.push("CTRL"),n&&s.push("SHIFT"),o&&s.push("ALT"),e.hasOwnProperty(i)?s.push(e[i].toUpperCase()):["ControlLeft","ControlRight","ShiftLeft","ShiftRight","AltLeft","AltRight","Meta"].includes(i)||s.push(i.toUpperCase()),s.sort()}function r(t,e){let n=0;const{regex:o}=t,{listenOptions:r,currentContext:{name:i},shortcuts:s}=e;return null==i?0:(Object.entries(s[i]).forEach((([t,e])=>{if(!o.test(t))return;n++;let i=t.slice(4).split(",").length;r.maxSequence<i&&(r.maxSequence=i)})),n)}function i(){return{ArrowLeft:"LEFT",ArrowUp:"UP",ArrowRight:"RIGHT",ArrowDown:"DOWN",Enter:"ENTER",NumpadEnter:"ENTER",Escape:"ESC",Backspace:"BACKSPACE",Space:"SPACE",Tab:"TAB",Backquote:"`",BracketLeft:"[",BracketRight:"]",Equal:"=",Slash:"/",Backslash:"\\",IntlBackslash:"`",F1:"F1",F2:"F2",F3:"F3",F4:"F4",F5:"F5",F6:"F6",F7:"F7",F8:"F8",F9:"F9",F10:"F10",F11:"F11",F12:"F12"}}function s(t,e,s={}){let{currentContext:c,shortcuts:u,exposeShortcut:l}=e,{inAPI:a}=t,m={ev:t.ev,_specialChars:i,_readKeyEvent:o,mainDependencies:t,regex:/KEY\s*\:/i},p={currentContext:c,shortcuts:u,active:!1,listenOptions:{keyWait:s.keyWait?s.keyWait:480,maxSequence:1,keyIgnore:null},streamKeys:!(!s.streamKeys||"function"!=typeof s.streamKeys)&&s.streamKeys,exposeShortcut:l};a._normalizeWithPlugins(n);let h=function(t,e){const{ev:n,_specialChars:o,_readKeyEvent:r,mainDependencies:i}=t,{currentContext:s,streamKeys:c,listenOptions:u}=e,{keyWait:l}=u;let a=[],m=null,p=!0,h=!1;const f=()=>p=!1,d=()=>p=!0,g=()=>h=!0,x=()=>!1===p;function y(){let t=a.map((t=>[t.join("+")]));const e={wait:f,end:d,ignore:g,isWaiting:x,note:s.note,context:s.name,dependencies:i.extra,type:"key"};if(!p){let o=t.at(-1);n.emit(o,e),h&&(t=t.slice(0,-1),h=!1)}if(p){const o=`KEY:${t.join(",")}`;n.emit(o,e),a=[],m=null}}function C(e){if(clearTimeout(m),o.hasOwnProperty(e.code))return a.push(r(e,o)),c&&c({key:e.key,context:s.name,note:s.note,dependencies:t.extra}),u.keyIgnore?(clearTimeout(u.keyIgnore),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l))):p&&a.length===u.maxSequence?(y(),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l))):void(p?m=setTimeout(y,l):y())}function k(e){if(!o.hasOwnProperty(e.code)){if(clearTimeout(m),c&&c({key:e.key,context:s.name,note:s.note,dependencies:t.extra}),u.keyIgnore)return clearTimeout(u.keyIgnore),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l));if(a.push(r(e,o)),p&&a.length===u.maxSequence)return y(),void(u.keyIgnore=setTimeout((()=>u.keyIgnore=null),l));p?m=setTimeout(y,l):y()}}return{start:function(){e.active||(document.addEventListener("keydown",C),document.addEventListener("keypress",k),e.active=!0)},stop:function(){e.active&&(document.removeEventListener("keydown",C),document.removeEventListener("keypress",k),e.active=!1)}}}(m,p),f=r(m,p);f>0&&h.start();let d={getPrefix:()=>"key",shortcutName:t=>n(t),contextChange:t=>{f=r(m,p),f<1&&h.stop(),f>0&&h.start()},mute:()=>h.stop(),unmute:()=>h.start(),destroy:()=>{h.stop(),p=null,d=null}};return Object.freeze(d),d}function c(t,e,n){const{listenOptions:{clickTarget:o}}=e;let r=n;return r===document||r===document.body?null:r.dataset[o]||"A"===r.nodeName?r:c(t,e,r.parentNode)}function u(t){const e=t.toUpperCase(),n=/CLICK\s*\:/i.test(e),o=["LEFT","MIDDLE","RIGHT"],r=["ALT","SHIFT","CTRL"];let i=null,s=[],c=0,u=e.indexOf(":");return n?(e.slice(u+1).trim().split("-").map((t=>t.trim())).forEach((t=>{o.includes(t)?i=t:r.includes(t)?s.push(t):isNaN(t)||(c=t)})),`CLICK:${i}-${c}${s.length>0?"-":""}${s.sort().join("-")}`):t}function l(t,e){let{shiftKey:n,altKey:o,ctrlKey:r,key:i,button:s}=t,c=`CLICK:${["LEFT","MIDDLE","RIGHT"][s]}-${e}`,u=[];return r&&u.push("CTRL"),n&&u.push("SHIFT"),o&&u.push("ALT"),u.length>0?`${c}${u.length>0?"-":""}${u.sort().join("-")}`:`${c}`}function a(t,e){let n=0;const{regex:o}=t,{listenOptions:r,currentContext:{name:i},shortcuts:s}=e;return null==i?0:(Object.entries(s[i]).forEach((([t,e])=>{if(!o.test(t))return;n++;let[,i]=t.slice(6).split("-");r.maxClicks<i&&(r.maxClicks=i)})),n)}function m(t,e,n){let{currentContext:o,shortcuts:r}=e,{inAPI:i}=t,s={ev:t.ev,_findTarget:c,_readClickEvent:l,mainDependencies:t,regex:/CLICK\s*\:/i},m={currentContext:o,shortcuts:r,listenOptions:{mouseWait:n.mouseWait?n.mouseWait:320,maxClicks:1,clickTarget:n.clickTarget?n.clickTarget:"click"}};i._normalizeWithPlugins(u);let p=function(t,e){const{ev:n,_findTarget:o,_readClickEvent:r,mainDependencies:i}=t,{listenOptions:s,currentContext:c}=e,{mouseWait:u}=s;let l=null,a=null,m=null,p=null,h=0;function f(){const t=r(a,h),e={target:l,targetProps:l?l.getBoundingClientRect():null,x:a.clientX,y:a.clientY,context:c.name,note:c.note,event:a,dependencies:i.extra,type:"click"};n.emit(t,e),m=null,p=null,l=null,a=null,h=0}function d(n){let r=s.maxClicks;return clearTimeout(m),p?(clearTimeout(p),void(p=setTimeout((()=>p=null),u))):(l=o(t,e,n.target),l&&l.dataset.hasOwnProperty("quickClick")&&(r=1),l&&"A"===l.tagName&&(r=1),a=n,h++,h>=r?(f(),void(r>1&&(p=setTimeout((()=>p=null),u)))):void(m=setTimeout(f,u)))}function g(n){let r=s.maxClicks;return clearTimeout(m),p?(clearTimeout(p),void(p=setTimeout((()=>p=null),u))):(l=o(t,e,n.target),l&&l.dataset.hasOwnProperty("quickClick")&&(r=1),l&&"A"===l.tagName&&(r=1),a=n,h++,h>=r?(f(),void(r>1&&(p=setTimeout((()=>p=null),u)))):void(m=setTimeout(f,u)))}return{start:function(){e.active||(window.addEventListener("contextmenu",g),document.addEventListener("click",d),e.active=!0)},stop:function(){e.active&&(window.removeEventListener("contextmenu",g),document.removeEventListener("click",d),e.active=!1)}}}(s,m),h=a(s,m);h>0&&p.start();let f={getPrefix:()=>"click",shortcutName:t=>u(t),contextChange:()=>{h=a(s,m),h<1&&p.stop(),h>0&&p.start()},mute:()=>p.stop(),unmute:()=>p.start(),destroy:()=>{p.stop(),m=null,f=null}};return Object.freeze(f),f}function p(n={}){const o=t(),r={},i={},s={currentContext:{name:null,note:null},shortcuts:{},plugins:[],exposeShortcut:!(!n.onShortcut||"function"!=typeof n.onShortcut)&&n.onShortcut},c={ev:o,inAPI:r,API:i,extra:{}};return i.enablePlugin=(t,e={})=>{const n=t.name;if(-1===r._systemAction(n,"none")){let n;n=t(c,s,e),s.plugins.push(n)}},i.disablePlugin=t=>{const e=r._systemAction(t,"destroy");-1!==e&&(s.plugins=s.plugins.filter(((t,n)=>n!==e)))},i.mutePlugin=t=>r._systemAction(t,"mute"),i.unmutePlugin=t=>r._systemAction(t,"unmute"),i.getContext=()=>s.currentContext.name,i.getNote=()=>s.currentContext.note,i.setNote=(t=null)=>{"string"!=typeof t&&null!=t||(s.currentContext.note=t)},i.pause=(t="*")=>{let e=r._readShortcutWithPlugins(t);o.stop(e)},i.resume=(t="*")=>{const e=r._readShortcutWithPlugins(t);o.start(e)},i.emit=(t,...e)=>o.emit(r._readShortcutWithPlugins(t),...e),i.listContexts=()=>Object.keys(s.shortcuts),i.setDependencies=t=>c.extra={...c.extra,...t},i.getDependencies=()=>c.extra,Object.entries(e).forEach((([t,e])=>{t.startsWith("_")?r[t]=e(c,s):i[t]=e(c,s)})),i}export{m as pluginClick,s as pluginKey,p as shortcuts};
