!function(e,o){"object"==typeof exports&&"object"==typeof module?module.exports=o():"function"==typeof define&&define.amd?define([],o):"object"==typeof exports?exports["video/player/show-cover"]=o():e["video/player/show-cover"]=o()}(globalThis,(()=>(()=>{var e,o,t={154:(e,o,t)=>{var n=t(355)((function(e){return e[1]}));n.push([e.id,'.bpx-player-video-wrap::after,\n.bilibili-player-video::after {\n  position: absolute;\n  content: "";\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: none;\n  background: black var(--cover-url) center no-repeat;\n  background-size: contain;\n  pointer-events: none;\n  z-index: 10;\n}\n\n.bpx-player-container.bpx-state-paused .bpx-player-video-wrap::after {\n  display: block;\n}\n\n.bilibili-player-area.video-state-pause .bilibili-player-video::after {\n  display: block;\n}',""]),e.exports=n},355:e=>{"use strict";
// eslint-disable-next-line func-names
e.exports=function(e){var o=[];return o.toString=function(){return this.map((function(o){var t=e(o);return o[2]?"@media ".concat(o[2]," {").concat(t,"}"):t})).join("")},
// eslint-disable-next-line func-names
o.i=function(e,t,n){"string"==typeof e&&(
// eslint-disable-next-line no-param-reassign
e=[[null,e,""]]);var r={};if(n)for(var i=0;i<this.length;i++){
// eslint-disable-next-line prefer-destructuring
var a=this[i][0];null!=a&&(r[a]=!0)}for(var s=0;s<e.length;s++){var c=[].concat(e[s]);n&&r[c[0]]||(t&&(c[2]?c[2]="".concat(t," and ").concat(c[2]):c[2]=t),o.push(c))}},o}},330:(e,o,t)=>{var n=t(154);n&&n.__esModule&&(n=n.default),e.exports="string"==typeof n?n:n.toString()},77:e=>{"use strict";e.exports=coreApis.componentApis.video.videoInfo}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var i=n[e]={id:e,exports:{}};return t[e](i,i.exports,r),i.exports}o=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,r.t=function(t,n){if(1&n&&(t=this(t)),8&n)return t;if("object"==typeof t&&t){if(4&n&&t.__esModule)return t;if(16&n&&"function"==typeof t.then)return t}var i=Object.create(null);r.r(i);var a={};e=e||[null,o({}),o([]),o(o)];for(var s=2&n&&t;"object"==typeof s&&!~e.indexOf(s);s=o(s))Object.getOwnPropertyNames(s).forEach((e=>a[e]=()=>t[e]));return a.default=()=>t,r.d(i,a),i},r.d=(e,o)=>{for(var t in o)r.o(o,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:o[t]})},r.o=(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};return(()=>{"use strict";r.d(i,{component:()=>a});const e=coreApis.componentApis.define,o=coreApis.observer,t=coreApis.utils,n=coreApis.utils.urls,a=(0,e.defineComponentMetadata)({name:"showCoverBeforePlay",displayName:"播放前显示封面",urlInclude:n.playerUrls,entry:async()=>{let e;(0,o.videoChange)((()=>{console.debug("isBpxPlayer");const e=dq(".bpx-player-video-wrap video");e?(0,t.createHook)(e,"play",(()=>(document.documentElement.style.removeProperty("--cover-url"),!0))):console.warn("bpx player not found")}));(0,o.videoChange)((async o=>{let{aid:t}=o;if(!t)return void console.warn("[播放前显示封面] 未找到av号");if(t===e)return;e=t;const{VideoInfo:n}=await Promise.resolve().then(r.t.bind(r,77,23)),i=new n(t);await i.fetchInfo(),document.documentElement.style.setProperty("--cover-url",`url('${i.coverUrl}')`)}))},instantStyles:[{name:"showCoverBeforePlay",style:()=>Promise.resolve().then(r.t.bind(r,330,23))}],description:{"zh-CN":"在视频开始播放前, 在播放器中显示封面."},tags:[componentsTags.video],commitHash:"e40d295073681d4e4bbc10a335e91f665ab09783",coreVersion:"2.7.2"})})(),i=i.component})()));