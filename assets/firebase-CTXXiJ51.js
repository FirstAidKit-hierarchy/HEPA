const Ad=()=>{};var Ba={};/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const gu=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Rd=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[t++];e[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[t++],a=n[t++],u=n[t++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|u&63)-65536;e[r++]=String.fromCharCode(55296+(h>>10)),e[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return e.join("")},_u={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,u=a?n[s+1]:0,h=s+2<n.length,d=h?n[s+2]:0,p=o>>2,y=(o&3)<<4|u>>4;let R=(u&15)<<2|d>>6,C=d&63;h||(C=64,a||(R=64)),r.push(t[p],t[y],t[R],t[C])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(gu(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Rd(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=t[n.charAt(s++)],u=s<n.length?t[n.charAt(s)]:0;++s;const d=s<n.length?t[n.charAt(s)]:64;++s;const y=s<n.length?t[n.charAt(s)]:64;if(++s,o==null||u==null||d==null||y==null)throw new Sd;const R=o<<2|u>>4;if(r.push(R),d!==64){const C=u<<4&240|d>>2;if(r.push(C),y!==64){const N=d<<6&192|y;r.push(N)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Sd extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Pd=function(n){const e=gu(n);return _u.encodeByteArray(e,!0)},Yr=function(n){return Pd(n).replace(/\./g,"")},yu=function(n){try{return _u.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function Cd(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const bd=()=>Cd().__FIREBASE_DEFAULTS__,Vd=()=>{if(typeof process>"u"||typeof Ba>"u")return;const n=Ba.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},kd=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&yu(n[1]);return e&&JSON.parse(e)},ps=()=>{try{return Ad()||bd()||Vd()||kd()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Eu=n=>{var e,t;return(t=(e=ps())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},Nd=n=>{const e=Eu(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Iu=()=>{var n;return(n=ps())==null?void 0:n.config},Tu=n=>{var e;return(e=ps())==null?void 0:e[`_${n}`]};/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Dd{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 *   
 *    2021      
 *
 *   
 *
 *     
 *
   
 */function Od(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}},...n};return[Yr(JSON.stringify(t)),Yr(JSON.stringify(a)),""].join(".")}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function Ie(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ld(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ie())}function Md(){var e;const n=(e=ps())==null?void 0:e.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function xd(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Fd(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Ud(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Bd(){const n=Ie();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function qd(){return!Md()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function jd(){try{return typeof indexedDB=="object"}catch{return!1}}function $d(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var o;e(((o=s.error)==null?void 0:o.message)||"")}}catch(t){e(t)}})}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const zd="FirebaseError";class Ze extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=zd,Object.setPrototypeOf(this,Ze.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,cr.prototype.create)}}class cr{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,o=this.errors[e],a=o?Hd(o,r):"Error",u=`${this.serviceName}: ${a} (${s}).`;return new Ze(s,u,r)}}function Hd(n,e){return n.replace(Wd,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const Wd=/\{\$([^}]+)}/g;function Gd(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function xt(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const o=n[s],a=e[s];if(qa(o)&&qa(a)){if(!xt(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function qa(n){return n!==null&&typeof n=="object"}/**
 *   
 *    2017   
 *
 *   
 *
 *     
 *
   
 */function ur(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function qn(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,o]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(o)}}),e}function jn(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Kd(n,e){const t=new Qd(n,e);return t.subscribe.bind(t)}class Qd{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Yd(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=si),s.error===void 0&&(s.error=si),s.complete===void 0&&(s.complete=si);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Yd(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function si(){}/**
 *   
 *    2021   
 *
 *   
 *
 *     
 *
   
 */function te(n){return n&&n._delegate?n._delegate:n}/**
 *   
 *    2025   
 *
 *   
 *
 *     
 *
   
 */function lr(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function wu(n){return(await fetch(n,{credentials:"include"})).ok}class Ft{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 *   
 *    2019      
 *
 *   
 *
 *     
 *
   
 */const Dt="[DEFAULT]";/**
 *   
 *    2019   
 *
 *   
 *
 *     
 *
   
 */class Jd{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Dd;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Zd(e))try{this.getOrInitializeService({instanceIdentifier:Dt})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(e=Dt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Dt){return this.instances.has(e)}getOptions(e=Dt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[o,a]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(o);r===u&&a.resolve(s)}return s}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&e(o,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Xd(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Dt){return this.component?this.component.multipleInstances?e:Dt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Xd(n){return n===Dt?void 0:n}function Zd(n){return n.instantiationMode==="EAGER"}/**
 *   
 *    2019   
 *
 *   
 *
 *     
 *
   
 */class ef{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Jd(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */var q;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(q||(q={}));const tf={debug:q.DEBUG,verbose:q.VERBOSE,info:q.INFO,warn:q.WARN,error:q.ERROR,silent:q.SILENT},nf=q.INFO,rf={[q.DEBUG]:"log",[q.VERBOSE]:"log",[q.INFO]:"info",[q.WARN]:"warn",[q.ERROR]:"error"},sf=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=rf[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ji{constructor(e){this.name=e,this._logLevel=nf,this._logHandler=sf,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in q))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?tf[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,q.DEBUG,...e),this._logHandler(this,q.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,q.VERBOSE,...e),this._logHandler(this,q.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,q.INFO,...e),this._logHandler(this,q.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,q.WARN,...e),this._logHandler(this,q.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,q.ERROR,...e),this._logHandler(this,q.ERROR,...e)}}const of=(n,e)=>e.some(t=>n instanceof t);let ja,$a;function af(){return ja||(ja=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function cf(){return $a||($a=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const vu=new WeakMap,gi=new WeakMap,Au=new WeakMap,ii=new WeakMap,$i=new WeakMap;function uf(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{t(dt(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&vu.set(t,n)}).catch(()=>{}),$i.set(e,n),e}function lf(n){if(gi.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});gi.set(n,e)}let _i={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return gi.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Au.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return dt(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function hf(n){_i=n(_i)}function df(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(oi(this),e,...t);return Au.set(r,e.sort?e.sort():[e]),dt(r)}:cf().includes(n)?function(...e){return n.apply(oi(this),e),dt(vu.get(this))}:function(...e){return dt(n.apply(oi(this),e))}}function ff(n){return typeof n=="function"?df(n):(n instanceof IDBTransaction&&lf(n),of(n,af())?new Proxy(n,_i):n)}function dt(n){if(n instanceof IDBRequest)return uf(n);if(ii.has(n))return ii.get(n);const e=ff(n);return e!==n&&(ii.set(n,e),$i.set(e,n)),e}const oi=n=>$i.get(n);function pf(n,e,{blocked:t,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(n,e),u=dt(a);return r&&a.addEventListener("upgradeneeded",h=>{r(dt(a.result),h.oldVersion,h.newVersion,dt(a.transaction),h)}),t&&a.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),u.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),u}const mf=["get","getKey","getAll","getAllKeys","count"],gf=["put","add","delete","clear"],ai=new Map;function za(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(ai.get(e))return ai.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=gf.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||mf.includes(t)))return;const o=async function(a,...u){const h=this.transaction(a,s?"readwrite":"readonly");let d=h.store;return r&&(d=d.index(u.shift())),(await Promise.all([d[t](...u),s&&h.done]))[0]};return ai.set(e,o),o}hf(n=>({...n,get:(e,t,r)=>za(e,t)||n.get(e,t,r),has:(e,t)=>!!za(e,t)||n.has(e,t)}));/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class _f{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(yf(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function yf(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const yi="@firebase/app",Ha="0.14.11";/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */const Qe=new ji("@firebase/app"),Ef="@firebase/app-compat",If="@firebase/analytics-compat",Tf="@firebase/analytics",wf="@firebase/app-check-compat",vf="@firebase/app-check",Af="@firebase/auth",Rf="@firebase/auth-compat",Sf="@firebase/database",Pf="@firebase/data-connect",Cf="@firebase/database-compat",bf="@firebase/functions",Vf="@firebase/functions-compat",kf="@firebase/installations",Nf="@firebase/installations-compat",Df="@firebase/messaging",Of="@firebase/messaging-compat",Lf="@firebase/performance",Mf="@firebase/performance-compat",xf="@firebase/remote-config",Ff="@firebase/remote-config-compat",Uf="@firebase/storage",Bf="@firebase/storage-compat",qf="@firebase/firestore",jf="@firebase/ai",$f="@firebase/firestore-compat",zf="firebase",Hf="12.12.0";/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */const Ei="[DEFAULT]",Wf={[yi]:"fire-core",[Ef]:"fire-core-compat",[Tf]:"fire-analytics",[If]:"fire-analytics-compat",[vf]:"fire-app-check",[wf]:"fire-app-check-compat",[Af]:"fire-auth",[Rf]:"fire-auth-compat",[Sf]:"fire-rtdb",[Pf]:"fire-data-connect",[Cf]:"fire-rtdb-compat",[bf]:"fire-fn",[Vf]:"fire-fn-compat",[kf]:"fire-iid",[Nf]:"fire-iid-compat",[Df]:"fire-fcm",[Of]:"fire-fcm-compat",[Lf]:"fire-perf",[Mf]:"fire-perf-compat",[xf]:"fire-rc",[Ff]:"fire-rc-compat",[Uf]:"fire-gcs",[Bf]:"fire-gcs-compat",[qf]:"fire-fst",[$f]:"fire-fst-compat",[jf]:"fire-vertex","fire-js":"fire-js",[zf]:"fire-js-all"};/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */const Xn=new Map,Gf=new Map,Ii=new Map;function Wa(n,e){try{n.container.addComponent(e)}catch(t){Qe.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function un(n){const e=n.name;if(Ii.has(e))return Qe.debug(`There were multiple attempts to register component ${e}.`),!1;Ii.set(e,n);for(const t of Xn.values())Wa(t,n);for(const t of Gf.values())Wa(t,n);return!0}function zi(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Ce(n){return n==null?!1:n.settings!==void 0}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */const Kf={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ft=new cr("app","Firebase",Kf);/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class Qf{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Ft("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ft.create("app-deleted",{appName:this._name})}}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */const _n=Hf;function Yf(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:Ei,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw ft.create("bad-app-name",{appName:String(s)});if(t||(t=Iu()),!t)throw ft.create("no-options");const o=Xn.get(s);if(o){if(xt(t,o.options)&&xt(r,o.config))return o;throw ft.create("duplicate-app",{appName:s})}const a=new ef(s);for(const h of Ii.values())a.addComponent(h);const u=new Qf(t,r,a);return Xn.set(s,u),u}function Ru(n=Ei){const e=Xn.get(n);if(!e&&n===Ei&&Iu())return Yf();if(!e)throw ft.create("no-app",{appName:n});return e}function ME(){return Array.from(Xn.values())}function pt(n,e,t){let r=Wf[n]??n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const a=[`Unable to register library "${r}" with version "${e}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Qe.warn(a.join(" "));return}un(new Ft(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 *   
 *    2021 Google   
 *
 *   
 *
 *     
 *
   
 */const Jf="firebase-heartbeat-database",Xf=1,Zn="firebase-heartbeat-store";let ci=null;function Su(){return ci||(ci=pf(Jf,Xf,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Zn)}catch(t){console.warn(t)}}}}).catch(n=>{throw ft.create("idb-open",{originalErrorMessage:n.message})})),ci}async function Zf(n){try{const t=(await Su()).transaction(Zn),r=await t.objectStore(Zn).get(Pu(n));return await t.done,r}catch(e){if(e instanceof Ze)Qe.warn(e.message);else{const t=ft.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Qe.warn(t.message)}}}async function Ga(n,e){try{const r=(await Su()).transaction(Zn,"readwrite");await r.objectStore(Zn).put(e,Pu(n)),await r.done}catch(t){if(t instanceof Ze)Qe.warn(t.message);else{const r=ft.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Qe.warn(r.message)}}}function Pu(n){return`${n.name}!${n.options.appId}`}/**
 *   
 *    2021 Google   
 *
 *   
 *
 *     
 *
   
 */const ep=1024,tp=30;class np{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new sp(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=Ka();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats.length>tp){const a=ip(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Qe.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Ka(),{heartbeatsToSend:r,unsentEntries:s}=rp(this._heartbeatsCache.heartbeats),o=Yr(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return Qe.warn(t),""}}}function Ka(){return new Date().toISOString().substring(0,10)}function rp(n,e=ep){const t=[];let r=n.slice();for(const s of n){const o=t.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),Qa(t)>e){o.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Qa(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class sp{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return jd()?$d().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Zf(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Ga(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Ga(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Qa(n){return Yr(JSON.stringify({version:2,heartbeats:n})).length}function ip(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */function op(n){un(new Ft("platform-logger",e=>new _f(e),"PRIVATE")),un(new Ft("heartbeat",e=>new np(e),"PRIVATE")),pt(yi,Ha,n),pt(yi,Ha,"esm2020"),pt("fire-js","")}op("");var ap="firebase",cp="12.12.0";/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */pt(ap,cp,"app");function Cu(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const up=Cu,bu=new cr("auth","Firebase",Cu());/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Jr=new ji("@firebase/auth");function lp(n,...e){Jr.logLevel<=q.WARN&&Jr.warn(`Auth (${_n}): ${n}`,...e)}function Br(n,...e){Jr.logLevel<=q.ERROR&&Jr.error(`Auth (${_n}): ${n}`,...e)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function Se(n,...e){throw Wi(n,...e)}function De(n,...e){return Wi(n,...e)}function Hi(n,e,t){const r={...up(),[e]:t};return new cr("auth","Firebase",r).create(e,{appName:n.name})}function mt(n){return Hi(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function hp(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Se(n,"argument-error"),Hi(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Wi(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return bu.create(n,...e)}function M(n,e,...t){if(!n)throw Wi(e,...t)}function Ge(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Br(e),new Error(e)}function Ye(n,e){n||Ge(e)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function Ti(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function dp(){return Ya()==="http:"||Ya()==="https:"}function Ya(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function fp(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(dp()||Fd()||"connection"in navigator)?navigator.onLine:!0}function pp(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class hr{constructor(e,t){this.shortDelay=e,this.longDelay=t,Ye(t>e,"Short delay should be less than long delay!"),this.isMobile=Ld()||Ud()}get(){return fp()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function Gi(n,e){Ye(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Vu{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ge("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ge("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ge("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const mp={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const gp=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],_p=new hr(3e4,6e4);function Rt(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function We(n,e,t,r,s={}){return ku(n,s,async()=>{let o={},a={};r&&(e==="GET"?a=r:o={body:JSON.stringify(r)});const u=ur({key:n.config.apiKey,...a}).slice(1),h=await n._getAdditionalHeaders();h["Content-Type"]="application/json",n.languageCode&&(h["X-Firebase-Locale"]=n.languageCode);const d={method:e,headers:h,...o};return xd()||(d.referrerPolicy="no-referrer"),n.emulatorConfig&&lr(n.emulatorConfig.host)&&(d.credentials="include"),Vu.fetch()(await Nu(n,n.config.apiHost,t,u),d)})}async function ku(n,e,t){n._canInitEmulator=!1;const r={...mp,...e};try{const s=new Ep(n),o=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await o.json();if("needConfirmation"in a)throw Or(n,"account-exists-with-different-credential",a);if(o.ok&&!("errorMessage"in a))return a;{const u=o.ok?a.errorMessage:a.error.message,[h,d]=u.split(" : ");if(h==="FEDERATED_USER_ID_ALREADY_LINKED")throw Or(n,"credential-already-in-use",a);if(h==="EMAIL_EXISTS")throw Or(n,"email-already-in-use",a);if(h==="USER_DISABLED")throw Or(n,"user-disabled",a);const p=r[h]||h.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Hi(n,p,d);Se(n,p)}}catch(s){if(s instanceof Ze)throw s;Se(n,"network-request-failed",{message:String(s)})}}async function ms(n,e,t,r,s={}){const o=await We(n,e,t,r,s);return"mfaPendingCredential"in o&&Se(n,"multi-factor-auth-required",{_serverResponse:o}),o}async function Nu(n,e,t,r){const s=`${e}${t}?${r}`,o=n,a=o.config.emulator?Gi(n.config,s):`${n.config.apiScheme}://${s}`;return gp.includes(t)&&(await o._persistenceManagerAvailable,o._getPersistenceType()==="COOKIE")?o._getPersistence()._getFinalTarget(a).toString():a}function yp(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Ep{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(De(this.auth,"network-request-failed")),_p.get())})}}function Or(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=De(n,e,r);return s.customData._tokenResponse=t,s}function Ja(n){return n!==void 0&&n.enterprise!==void 0}class Ip{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return yp(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Tp(n,e){return We(n,"GET","/v2/recaptchaConfig",Rt(n,e))}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function wp(n,e){return We(n,"POST","/v1/accounts:delete",e)}async function Xr(n,e){return We(n,"POST","/v1/accounts:lookup",e)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function Gn(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function vp(n,e=!1){const t=te(n),r=await t.getIdToken(e),s=Ki(r);M(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const o=typeof s.firebase=="object"?s.firebase:void 0,a=o==null?void 0:o.sign_in_provider;return{claims:s,token:r,authTime:Gn(ui(s.auth_time)),issuedAtTime:Gn(ui(s.iat)),expirationTime:Gn(ui(s.exp)),signInProvider:a||null,signInSecondFactor:(o==null?void 0:o.sign_in_second_factor)||null}}function ui(n){return Number(n)*1e3}function Ki(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Br("JWT malformed, contained fewer than 3 sections"),null;try{const s=yu(t);return s?JSON.parse(s):(Br("Failed to decode base64 JWT payload"),null)}catch(s){return Br("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function Xa(n){const e=Ki(n);return M(e,"internal-error"),M(typeof e.exp<"u","internal-error"),M(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function ln(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof Ze&&Ap(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Ap({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Rp{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class wi{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Gn(this.lastLoginAt),this.creationTime=Gn(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */async function Zr(n){var y;const e=n.auth,t=await n.getIdToken(),r=await ln(n,Xr(e,{idToken:t}));M(r==null?void 0:r.users.length,e,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const o=(y=s.providerUserInfo)!=null&&y.length?Du(s.providerUserInfo):[],a=Pp(n.providerData,o),u=n.isAnonymous,h=!(n.email&&s.passwordHash)&&!(a!=null&&a.length),d=u?h:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new wi(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(n,p)}async function Sp(n){const e=te(n);await Zr(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Pp(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Du(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function Cp(n,e){const t=await ku(n,{},async()=>{const r=ur({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:o}=n.config,a=await Nu(n,s,"/v1/token",`key=${o}`),u=await n._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";const h={method:"POST",headers:u,body:r};return n.emulatorConfig&&lr(n.emulatorConfig.host)&&(h.credentials="include"),Vu.fetch()(a,h)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function bp(n,e){return We(n,"POST","/v2/accounts:revokeToken",Rt(n,e))}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class nn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){M(e.idToken,"internal-error"),M(typeof e.idToken<"u","internal-error"),M(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Xa(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){M(e.length!==0,"internal-error");const t=Xa(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(M(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:o}=await Cp(e,t);this.updateTokensAndExpiration(r,s,Number(o))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:o}=t,a=new nn;return r&&(M(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(M(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),o&&(M(typeof o=="number","internal-error",{appName:e}),a.expirationTime=o),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new nn,this.toJSON())}_performRefresh(){return Ge("not implemented")}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function ot(n,e){M(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class ke{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new Rp(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new wi(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await ln(this,this.stsTokenManager.getToken(this.auth,e));return M(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return vp(this,e)}reload(){return Sp(this)}_assign(e){this!==e&&(M(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new ke({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){M(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Zr(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ce(this.auth.app))return Promise.reject(mt(this.auth));const e=await this.getIdToken();return await ln(this,wp(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,s=t.email??void 0,o=t.phoneNumber??void 0,a=t.photoURL??void 0,u=t.tenantId??void 0,h=t._redirectEventId??void 0,d=t.createdAt??void 0,p=t.lastLoginAt??void 0,{uid:y,emailVerified:R,isAnonymous:C,providerData:N,stsTokenManager:L}=t;M(y&&L,e,"internal-error");const D=nn.fromJSON(this.name,L);M(typeof y=="string",e,"internal-error"),ot(r,e.name),ot(s,e.name),M(typeof R=="boolean",e,"internal-error"),M(typeof C=="boolean",e,"internal-error"),ot(o,e.name),ot(a,e.name),ot(u,e.name),ot(h,e.name),ot(d,e.name),ot(p,e.name);const H=new ke({uid:y,auth:e,email:s,emailVerified:R,displayName:r,isAnonymous:C,photoURL:a,phoneNumber:o,tenantId:u,stsTokenManager:D,createdAt:d,lastLoginAt:p});return N&&Array.isArray(N)&&(H.providerData=N.map(G=>({...G}))),h&&(H._redirectEventId=h),H}static async _fromIdTokenResponse(e,t,r=!1){const s=new nn;s.updateFromServerResponse(t);const o=new ke({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Zr(o),o}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];M(s.localId!==void 0,"internal-error");const o=s.providerUserInfo!==void 0?Du(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(o!=null&&o.length),u=new nn;u.updateFromIdToken(r);const h=new ke({uid:s.localId,auth:e,stsTokenManager:u,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new wi(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(o!=null&&o.length)};return Object.assign(h,d),h}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Za=new Map;function Ke(n){Ye(n instanceof Function,"Expected a class definition");let e=Za.get(n);return e?(Ye(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Za.set(n,e),e)}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class Ou{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Ou.type="NONE";const ec=Ou;/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */function qr(n,e,t){return`firebase:${n}:${e}:${t}`}class rn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:o}=this.auth;this.fullUserKey=qr(this.userKey,s.apiKey,o),this.fullPersistenceKey=qr("persistence",s.apiKey,o),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Xr(this.auth,{idToken:e}).catch(()=>{});return t?ke._fromGetAccountInfoResponse(this.auth,t,e):null}return ke._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new rn(Ke(ec),e,r);const s=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let o=s[0]||Ke(ec);const a=qr(r,e.config.apiKey,e.name);let u=null;for(const d of t)try{const p=await d._get(a);if(p){let y;if(typeof p=="string"){const R=await Xr(e,{idToken:p}).catch(()=>{});if(!R)break;y=await ke._fromGetAccountInfoResponse(e,R,p)}else y=ke._fromJSON(e,p);d!==o&&(u=y),o=d;break}}catch{}const h=s.filter(d=>d._shouldAllowMigration);return!o._shouldAllowMigration||!h.length?new rn(o,e,r):(o=h[0],u&&await o._set(a,u.toJSON()),await Promise.all(t.map(async d=>{if(d!==o)try{await d._remove(a)}catch{}})),new rn(o,e,r))}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function tc(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Fu(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Lu(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Bu(e))return"Blackberry";if(qu(e))return"Webos";if(Mu(e))return"Safari";if((e.includes("chrome/")||xu(e))&&!e.includes("edge/"))return"Chrome";if(Uu(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Lu(n=Ie()){return/firefox\//i.test(n)}function Mu(n=Ie()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function xu(n=Ie()){return/crios\//i.test(n)}function Fu(n=Ie()){return/iemobile/i.test(n)}function Uu(n=Ie()){return/android/i.test(n)}function Bu(n=Ie()){return/blackberry/i.test(n)}function qu(n=Ie()){return/webos/i.test(n)}function Qi(n=Ie()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Vp(n=Ie()){var e;return Qi(n)&&!!((e=window.navigator)!=null&&e.standalone)}function kp(){return Bd()&&document.documentMode===10}function ju(n=Ie()){return Qi(n)||Uu(n)||qu(n)||Bu(n)||/windows phone/i.test(n)||Fu(n)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function $u(n,e=[]){let t;switch(n){case"Browser":t=tc(Ie());break;case"Worker":t=`${tc(Ie())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${_n}/${r}`}/**
 *   
   *
 *   
 *
 *     
 *
   
 */class Np{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=o=>new Promise((a,u)=>{try{const h=e(o);a(h)}catch(h){u(h)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function Dp(n,e={}){return We(n,"GET","/v2/passwordPolicy",Rt(n,e))}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Op=6;class Lp{constructor(e){var r;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Op,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,o){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=o))}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Mp{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new nc(this),this.idTokenSubscription=new nc(this),this.beforeStateQueue=new Np(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=bu,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(o=>this._resolvePersistenceManagerAvailable=o)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Ke(t)),this._initializationPromise=this.queue(async()=>{var r,s,o;if(!this._deleted&&(this.persistenceManager=await rn.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((o=this.currentUser)==null?void 0:o.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Xr(this,{idToken:e}),r=await ke._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var o;if(Ce(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(u,u))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(o=this.redirectUser)==null?void 0:o._redirectEventId,u=r==null?void 0:r._redirectEventId,h=await this.tryRedirectSignIn(e);(!a||a===u)&&(h!=null&&h.user)&&(r=h.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return M(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Zr(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=pp()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ce(this.app))return Promise.reject(mt(this));const t=e?te(e):null;return t&&M(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&M(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ce(this.app)?Promise.reject(mt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ce(this.app)?Promise.reject(mt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ke(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Dp(this),t=new Lp(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new cr("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await bp(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Ke(e)||this._popupRedirectResolver;M(t,this,"argument-error"),this.redirectPersistenceManager=await rn.create(this,[Ke(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const o=typeof t=="function"?t:t.next.bind(t);let a=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(M(u,this,"internal-error"),u.then(()=>{a||o(this.currentUser)}),typeof t=="function"){const h=e.addObserver(t,r,s);return()=>{a=!0,h()}}else{const h=e.addObserver(t);return()=>{a=!0,h()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return M(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=$u(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var t;if(Ce(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&lp(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function St(n){return te(n)}class nc{constructor(e){this.auth=e,this.observer=null,this.addObserver=Kd(t=>this.observer=t)}get next(){return M(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */let gs={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function xp(n){gs=n}function zu(n){return gs.loadJS(n)}function Fp(){return gs.recaptchaEnterpriseScript}function Up(){return gs.gapiScript}function Bp(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class qp{constructor(){this.enterprise=new jp}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class jp{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const $p="recaptcha-enterprise",Hu="NO_RECAPTCHA";class zp{constructor(e){this.type=$p,this.auth=St(e)}async verify(e="verify",t=!1){async function r(o){if(!t){if(o.tenantId==null&&o._agentRecaptchaConfig!=null)return o._agentRecaptchaConfig.siteKey;if(o.tenantId!=null&&o._tenantRecaptchaConfigs[o.tenantId]!==void 0)return o._tenantRecaptchaConfigs[o.tenantId].siteKey}return new Promise(async(a,u)=>{Tp(o,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(h=>{if(h.recaptchaKey===void 0)u(new Error("recaptcha Enterprise site key undefined"));else{const d=new Ip(h);return o.tenantId==null?o._agentRecaptchaConfig=d:o._tenantRecaptchaConfigs[o.tenantId]=d,a(d.siteKey)}}).catch(h=>{u(h)})})}function s(o,a,u){const h=window.grecaptcha;Ja(h)?h.enterprise.ready(()=>{h.enterprise.execute(o,{action:e}).then(d=>{a(d)}).catch(()=>{a(Hu)})}):u(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new qp().execute("siteKey",{action:"verify"}):new Promise((o,a)=>{r(this.auth).then(u=>{if(!t&&Ja(window.grecaptcha))s(u,o,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let h=Fp();h.length!==0&&(h+=u),zu(h).then(()=>{s(u,o,a)}).catch(d=>{a(d)})}}).catch(u=>{a(u)})})}}async function rc(n,e,t,r=!1,s=!1){const o=new zp(n);let a;if(s)a=Hu;else try{a=await o.verify(t)}catch{a=await o.verify(t,!0)}const u={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in u){const h=u.phoneEnrollmentInfo.phoneNumber,d=u.phoneEnrollmentInfo.recaptchaToken;Object.assign(u,{phoneEnrollmentInfo:{phoneNumber:h,recaptchaToken:d,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in u){const h=u.phoneSignInInfo.recaptchaToken;Object.assign(u,{phoneSignInInfo:{recaptchaToken:h,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return u}return r?Object.assign(u,{captchaResp:a}):Object.assign(u,{captchaResponse:a}),Object.assign(u,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(u,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),u}async function sc(n,e,t,r,s){var o;if((o=n._getRecaptchaConfig())!=null&&o.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await rc(n,e,t,t==="getOobCode");return r(n,a)}else return r(n,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const u=await rc(n,e,t,t==="getOobCode");return r(n,u)}else return Promise.reject(a)})}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function Hp(n,e){const t=zi(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),o=t.getOptions();if(xt(o,e??{}))return s;Se(s,"already-initialized")}return t.initialize({options:e})}function Wp(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Ke);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Gp(n,e,t){const r=St(n);M(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!!(t!=null&&t.disableWarnings),o=Wu(e),{host:a,port:u}=Kp(e),h=u===null?"":`:${u}`,d={url:`${o}//${a}${h}/`},p=Object.freeze({host:a,port:u,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){M(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),M(xt(d,r.config.emulator)&&xt(p,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=d,r.emulatorConfig=p,r.settings.appVerificationDisabledForTesting=!0,lr(a)?wu(`${o}//${a}${h}`):Qp()}function Wu(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Kp(n){const e=Wu(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const o=s[1];return{host:o,port:ic(r.substr(o.length+1))}}else{const[o,a]=r.split(":");return{host:o,port:ic(a)}}}function ic(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Qp(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Yi{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ge("not implemented")}_getIdTokenResponse(e){return Ge("not implemented")}_linkToIdToken(e,t){return Ge("not implemented")}_getReauthenticationResolver(e){return Ge("not implemented")}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function Gu(n,e){return We(n,"POST","/v1/accounts:resetPassword",Rt(n,e))}async function Yp(n,e){return We(n,"POST","/v1/accounts:update",e)}async function Jp(n,e){return We(n,"POST","/v1/accounts:signUp",e)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function Xp(n,e){return ms(n,"POST","/v1/accounts:signInWithPassword",Rt(n,e))}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function Zp(n,e){return ms(n,"POST","/v1/accounts:signInWithEmailLink",Rt(n,e))}async function em(n,e){return ms(n,"POST","/v1/accounts:signInWithEmailLink",Rt(n,e))}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class er extends Yi{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new er(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new er(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return sc(e,t,"signInWithPassword",Xp);case"emailLink":return Zp(e,{email:this._email,oobCode:this._password});default:Se(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return sc(e,r,"signUpPassword",Jp);case"emailLink":return em(e,{idToken:t,email:this._email,oobCode:this._password});default:Se(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function sn(n,e){return ms(n,"POST","/v1/accounts:signInWithIdp",Rt(n,e))}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const tm="http://localhost";class Ut extends Yi{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ut(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Se("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...o}=t;if(!r||!s)return null;const a=new Ut(r,s);return a.idToken=o.idToken||void 0,a.accessToken=o.accessToken||void 0,a.secret=o.secret,a.nonce=o.nonce,a.pendingToken=o.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return sn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,sn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,sn(e,t)}buildRequest(){const e={requestUri:tm,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=ur(t)}return e}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function nm(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function rm(n){const e=qn(jn(n)).link,t=e?qn(jn(e)).deep_link_id:null,r=qn(jn(n)).deep_link_id;return(r?qn(jn(r)).link:null)||r||t||e||n}class Ji{constructor(e){const t=qn(jn(e)),r=t.apiKey??null,s=t.oobCode??null,o=nm(t.mode??null);M(r&&s&&o,"argument-error"),this.apiKey=r,this.operation=o,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=rm(e);try{return new Ji(t)}catch{return null}}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class yn{constructor(){this.providerId=yn.PROVIDER_ID}static credential(e,t){return er._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=Ji.parseLink(t);return M(r,"argument-error"),er._fromEmailAndCode(e,r.code,r.tenantId)}}yn.PROVIDER_ID="password";yn.EMAIL_PASSWORD_SIGN_IN_METHOD="password";yn.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Xi{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class dr extends Xi{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class at extends dr{constructor(){super("facebook.com")}static credential(e){return Ut._fromParams({providerId:at.PROVIDER_ID,signInMethod:at.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return at.credentialFromTaggedObject(e)}static credentialFromError(e){return at.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return at.credential(e.oauthAccessToken)}catch{return null}}}at.FACEBOOK_SIGN_IN_METHOD="facebook.com";at.PROVIDER_ID="facebook.com";/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class ct extends dr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ut._fromParams({providerId:ct.PROVIDER_ID,signInMethod:ct.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return ct.credentialFromTaggedObject(e)}static credentialFromError(e){return ct.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return ct.credential(t,r)}catch{return null}}}ct.GOOGLE_SIGN_IN_METHOD="google.com";ct.PROVIDER_ID="google.com";/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class ut extends dr{constructor(){super("github.com")}static credential(e){return Ut._fromParams({providerId:ut.PROVIDER_ID,signInMethod:ut.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ut.credentialFromTaggedObject(e)}static credentialFromError(e){return ut.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ut.credential(e.oauthAccessToken)}catch{return null}}}ut.GITHUB_SIGN_IN_METHOD="github.com";ut.PROVIDER_ID="github.com";/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class lt extends dr{constructor(){super("twitter.com")}static credential(e,t){return Ut._fromParams({providerId:lt.PROVIDER_ID,signInMethod:lt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return lt.credentialFromTaggedObject(e)}static credentialFromError(e){return lt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return lt.credential(t,r)}catch{return null}}}lt.TWITTER_SIGN_IN_METHOD="twitter.com";lt.PROVIDER_ID="twitter.com";/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class hn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const o=await ke._fromIdTokenResponse(e,r,s),a=oc(r);return new hn({user:o,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=oc(r);return new hn({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function oc(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class es extends Ze{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,es.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new es(e,t,r,s)}}function Ku(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?es._fromErrorAndOperation(n,o,e,r):o})}async function sm(n,e,t=!1){const r=await ln(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return hn._forOperation(n,"link",r)}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */async function Qu(n,e,t=!1){const{auth:r}=n;if(Ce(r.app))return Promise.reject(mt(r));const s="reauthenticate";try{const o=await ln(n,Ku(r,s,e,n),t);M(o.idToken,r,"internal-error");const a=Ki(o.idToken);M(a,r,"internal-error");const{sub:u}=a;return M(n.uid===u,r,"user-mismatch"),hn._forOperation(n,s,o)}catch(o){throw(o==null?void 0:o.code)==="auth/user-not-found"&&Se(r,"user-mismatch"),o}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function Yu(n,e,t=!1){if(Ce(n.app))return Promise.reject(mt(n));const r="signIn",s=await Ku(n,r,e),o=await hn._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(o.user),o}async function im(n,e){return Yu(St(n),e)}async function xE(n,e){return Qu(te(n),e)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Zi{constructor(e,t){this.factorId=e,this.uid=t.mfaEnrollmentId,this.enrollmentTime=new Date(t.enrolledAt).toUTCString(),this.displayName=t.displayName}static _fromServerResponse(e,t){return"phoneInfo"in t?eo._fromServerResponse(e,t):"totpInfo"in t?to._fromServerResponse(e,t):Se(e,"internal-error")}}class eo extends Zi{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,t){return new eo(t)}}class to extends Zi{constructor(e){super("totp",e)}static _fromServerResponse(e,t){return new to(t)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function Ju(n){const e=St(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function FE(n,e,t){await Gu(te(n),{oobCode:e,newPassword:t}).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Ju(n),r})}async function om(n,e){const t=te(n),r=await Gu(t,{oobCode:e}),s=r.requestType;switch(M(s,t,"internal-error"),s){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":M(r.newEmail,t,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":M(r.mfaInfo,t,"internal-error");default:M(r.email,t,"internal-error")}let o=null;return r.mfaInfo&&(o=Zi._fromServerResponse(St(t),r.mfaInfo)),{data:{email:(r.requestType==="VERIFY_AND_CHANGE_EMAIL"?r.newEmail:r.email)||null,previousEmail:(r.requestType==="VERIFY_AND_CHANGE_EMAIL"?r.email:r.newEmail)||null,multiFactorInfo:o},operation:s}}async function UE(n,e){const{data:t}=await om(te(n),e);return t.email}function BE(n,e,t){return Ce(n.app)?Promise.reject(mt(n)):im(te(n),yn.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Ju(n),r})}function qE(n,e){return am(te(n),null,e)}async function am(n,e,t){const{auth:r}=n,o={idToken:await n.getIdToken(),returnSecureToken:!0};t&&(o.password=t);const a=await ln(n,Yp(r,o));await n._updateTokensIfNecessary(a,!0)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function jE(n,e){return te(n).setPersistence(e)}function cm(n,e,t,r){return te(n).onIdTokenChanged(e,t,r)}function um(n,e,t){return te(n).beforeAuthStateChanged(e,t)}function $E(n,e,t,r){return te(n).onAuthStateChanged(e,t,r)}function zE(n){return te(n).signOut()}const ts="__sak";/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class Xu{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(ts,"1"),this.storage.removeItem(ts),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const lm=1e3,hm=10;class Zu extends Xu{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ju(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,u,h)=>{this.notifyListeners(a,h)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},o=this.storage.getItem(r);kp()&&o!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,hm):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},lm)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Zu.type="LOCAL";const dm=Zu;/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class el extends Xu{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}el.type="SESSION";const tl=el;/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */function fm(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class _s{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new _s(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:o}=t.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const u=Array.from(a).map(async d=>d(t.origin,o)),h=await fm(u);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:h})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}_s.receivers=[];/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function no(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class pm{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let o,a;return new Promise((u,h)=>{const d=no("",20);s.port1.start();const p=setTimeout(()=>{h(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(y){const R=y;if(R.data.eventId===d)switch(R.data.status){case"ack":clearTimeout(p),o=setTimeout(()=>{h(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),u(R.data.response);break;default:clearTimeout(p),clearTimeout(o),h(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function Be(){return window}function mm(n){Be().location.href=n}/**
 *   
 *      .
 *
 *   
 *
 *     
 *
   
 */function nl(){return typeof Be().WorkerGlobalScope<"u"&&typeof Be().importScripts=="function"}async function gm(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function _m(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function ym(){return nl()?self:null}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */const rl="firebaseLocalStorageDb",Em=1,ns="firebaseLocalStorage",sl="fbase_key";class fr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function ys(n,e){return n.transaction([ns],e?"readwrite":"readonly").objectStore(ns)}function Im(){const n=indexedDB.deleteDatabase(rl);return new fr(n).toPromise()}function vi(){const n=indexedDB.open(rl,Em);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(ns,{keyPath:sl})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(ns)?e(r):(r.close(),await Im(),e(await vi()))})})}async function ac(n,e,t){const r=ys(n,!0).put({[sl]:e,value:t});return new fr(r).toPromise()}async function Tm(n,e){const t=ys(n,!1).get(e),r=await new fr(t).toPromise();return r===void 0?null:r.value}function cc(n,e){const t=ys(n,!0).delete(e);return new fr(t).toPromise()}const wm=800,vm=3;class il{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await vi(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>vm)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return nl()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=_s._getInstance(ym()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,r;if(this.activeServiceWorker=await gm(),!this.activeServiceWorker)return;this.sender=new pm(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||_m()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await vi();return await ac(e,ts,"1"),await cc(e,ts),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>ac(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Tm(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>cc(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const o=ys(s,!1).getAll();return new fr(o).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:o}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(o)&&(this.notifyListeners(s,o),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),wm)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}il.type="LOCAL";const Am=il;new hr(3e4,6e4);/**
 *   
 *    2021 Google   
 *
 *   
 *
 *     
 *
   
 */function ol(n,e){return e?Ke(e):(M(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class ro extends Yi{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return sn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return sn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return sn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Rm(n){return Yu(n.auth,new ro(n),n.bypassAuthState)}function Sm(n){const{auth:e,user:t}=n;return M(t,e,"internal-error"),Qu(t,new ro(n),n.bypassAuthState)}async function Pm(n){const{auth:e,user:t}=n;return M(t,e,"internal-error"),sm(t,new ro(n),n.bypassAuthState)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class al{constructor(e,t,r,s,o=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:o,error:a,type:u}=e;if(a){this.reject(a);return}const h={auth:this.auth,requestUri:t,sessionId:r,tenantId:o||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(h))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Rm;case"linkViaPopup":case"linkViaRedirect":return Pm;case"reauthViaPopup":case"reauthViaRedirect":return Sm;default:Se(this.auth,"internal-error")}}resolve(e){Ye(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ye(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Cm=new hr(2e3,1e4);async function HE(n,e,t){if(Ce(n.app))return Promise.reject(De(n,"operation-not-supported-in-this-environment"));const r=St(n);hp(n,e,Xi);const s=ol(r,t);return new Ot(r,"signInViaPopup",e,s).executeNotNull()}class Ot extends al{constructor(e,t,r,s,o){super(e,t,s,o),this.provider=r,this.authWindow=null,this.pollId=null,Ot.currentPopupAction&&Ot.currentPopupAction.cancel(),Ot.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return M(e,this.auth,"internal-error"),e}async onExecution(){Ye(this.filter.length===1,"Popup operations only handle one event");const e=no();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(De(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(De(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ot.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if((r=(t=this.authWindow)==null?void 0:t.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(De(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Cm.get())};e()}}Ot.currentPopupAction=null;/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const bm="pendingRedirect",jr=new Map;class Vm extends al{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=jr.get(this.auth._key());if(!e){try{const r=await km(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}jr.set(this.auth._key(),e)}return this.bypassAuthState||jr.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function km(n,e){const t=Om(e),r=Dm(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function Nm(n,e){jr.set(n._key(),e)}function Dm(n){return Ke(n._redirectPersistence)}function Om(n){return qr(bm,n.config.apiKey,n.name)}async function Lm(n,e,t=!1){if(Ce(n.app))return Promise.reject(mt(n));const r=St(n),s=ol(r,e),a=await new Vm(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Mm=10*60*1e3;class xm{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Fm(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!cl(e)){const s=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";t.onError(De(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Mm&&this.cachedEventUids.clear(),this.cachedEventUids.has(uc(e))}saveEventToCache(e){this.cachedEventUids.add(uc(e)),this.lastProcessedEventTime=Date.now()}}function uc(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function cl({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Fm(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return cl(n);default:return!1}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function Um(n,e={}){return We(n,"GET","/v1/projects",e)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Bm=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,qm=/^https?/;async function jm(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Um(n);for(const t of e)try{if($m(t))return}catch{}Se(n,"unauthorized-domain")}function $m(n){const e=Ti(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!qm.test(t))return!1;if(Bm.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 *   
 *      .
 *
 *   
 *
 *     
 *
   
 */const zm=new hr(3e4,6e4);function lc(){const n=Be().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Hm(n){return new Promise((e,t)=>{var s,o,a;function r(){lc(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{lc(),t(De(n,"network-request-failed"))},timeout:zm.get()})}if((o=(s=Be().gapi)==null?void 0:s.iframes)!=null&&o.Iframe)e(gapi.iframes.getContext());else if((a=Be().gapi)!=null&&a.load)r();else{const u=Bp("iframefcb");return Be()[u]=()=>{gapi.load?r():t(De(n,"network-request-failed"))},zu(`${Up()}?onload=${u}`).catch(h=>t(h))}}).catch(e=>{throw $r=null,e})}let $r=null;function Wm(n){return $r=$r||Hm(n),$r}/**
 *   
 *      .
 *
 *   
 *
 *     
 *
   
 */const Gm=new hr(5e3,15e3),Km="__/auth/iframe",Qm="emulator/auth/iframe",Ym={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Jm=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Xm(n){const e=n.config;M(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Gi(e,Qm):`https://${n.config.authDomain}/${Km}`,r={apiKey:e.apiKey,appName:n.name,v:_n},s=Jm.get(n.config.apiHost);s&&(r.eid=s);const o=n._getFrameworks();return o.length&&(r.fw=o.join(",")),`${t}?${ur(r).slice(1)}`}async function Zm(n){const e=await Wm(n),t=Be().gapi;return M(t,n,"internal-error"),e.open({where:document.body,url:Xm(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Ym,dontclear:!0},r=>new Promise(async(s,o)=>{await r.restyle({setHideOnLeave:!1});const a=De(n,"network-request-failed"),u=Be().setTimeout(()=>{o(a)},Gm.get());function h(){Be().clearTimeout(u),s(r)}r.ping(h).then(h,()=>{o(a)})}))}/**
 *   
 *      .
 *
 *   
 *
 *     
 *
   
 */const eg={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},tg=500,ng=600,rg="_blank",sg="http://localhost";class hc{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function ig(n,e,t,r=tg,s=ng){const o=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let u="";const h={...eg,width:r.toString(),height:s.toString(),top:o,left:a},d=Ie().toLowerCase();t&&(u=xu(d)?rg:t),Lu(d)&&(e=e||sg,h.scrollbars="yes");const p=Object.entries(h).reduce((R,[C,N])=>`${R}${C}=${N},`,"");if(Vp(d)&&u!=="_self")return og(e||"",u),new hc(null);const y=window.open(e||"",u,p);M(y,n,"popup-blocked");try{y.focus()}catch{}return new hc(y)}function og(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 *   
 *    2021 Google   
 *
 *   
 *
 *     
 *
   
 */const ag="__/auth/handler",cg="emulator/auth/handler",ug=encodeURIComponent("fac");async function dc(n,e,t,r,s,o){M(n.config.authDomain,n,"auth-domain-config-required"),M(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:_n,eventId:s};if(e instanceof Xi){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Gd(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[p,y]of Object.entries({}))a[p]=y}if(e instanceof dr){const p=e.getScopes().filter(y=>y!=="");p.length>0&&(a.scopes=p.join(","))}n.tenantId&&(a.tid=n.tenantId);const u=a;for(const p of Object.keys(u))u[p]===void 0&&delete u[p];const h=await n._getAppCheckToken(),d=h?`#${ug}=${encodeURIComponent(h)}`:"";return`${lg(n)}?${ur(u).slice(1)}${d}`}function lg({config:n}){return n.emulator?Gi(n,cg):`https://${n.authDomain}/${ag}`}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const li="webStorageSupport";class hg{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=tl,this._completeRedirectFn=Lm,this._overrideRedirectResult=Nm}async _openPopup(e,t,r,s){var a;Ye((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const o=await dc(e,t,r,Ti(),s);return ig(e,o,no())}async _openRedirect(e,t,r,s){await this._originValidation(e);const o=await dc(e,t,r,Ti(),s);return mm(o),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:o}=this.eventManagers[t];return s?Promise.resolve(s):(Ye(o,"If manager is not set, promise should be"),o)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Zm(e),r=new xm(e);return t.register("authEvent",s=>(M(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(li,{type:li},s=>{var a;const o=(a=s==null?void 0:s[0])==null?void 0:a[li];o!==void 0&&t(!!o),Se(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=jm(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return ju()||Mu()||Qi()}}const dg=hg;var fc="@firebase/auth",pc="1.13.0";/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class fg{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){M(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function pg(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function mg(n){un(new Ft("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:a,authDomain:u}=r.options;M(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const h={apiKey:a,authDomain:u,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:$u(n)},d=new Mp(r,s,o,h);return Wp(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),un(new Ft("auth-internal",e=>{const t=St(e.getProvider("auth").getImmediate());return(r=>new fg(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),pt(fc,pc,pg(n)),pt(fc,pc,"esm2020")}/**
 *   
 *    2021 Google   
 *
 *   
 *
 *     
 *
   
 */const gg=5*60,_g=Tu("authIdTokenMaxAge")||gg;let mc=null;const yg=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>_g)return;const s=t==null?void 0:t.token;mc!==s&&(mc=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function WE(n=Ru()){const e=zi(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Hp(n,{popupRedirectResolver:dg,persistence:[Am,dm,tl]}),r=Tu("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(r,location.origin);if(location.origin===o.origin){const a=yg(o.toString());um(t,a,()=>a(t.currentUser)),cm(t,u=>a(u))}}const s=Eu("auth");return s&&Gp(t,`http://${s}`),t}function Eg(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}xp({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const o=De("internal-error");o.customData=s,t(o)},r.type="text/javascript",r.charset="UTF-8",Eg().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});mg("Browser");var gc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/**   
 
SPDX-License-Identifier: Apache-2.0
*/var gt,ul;(function(){var n;/**   

  
 SPDX-License-Identifier: Apache-2.0
*/function e(I,m){function _(){}_.prototype=m.prototype,I.F=m.prototype,I.prototype=new _,I.prototype.constructor=I,I.D=function(T,E,v){for(var g=Array(arguments.length-2),ve=2;ve<arguments.length;ve++)g[ve-2]=arguments[ve];return m.prototype[E].apply(T,g)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(I,m,_){_||(_=0);const T=Array(16);if(typeof m=="string")for(var E=0;E<16;++E)T[E]=m.charCodeAt(_++)|m.charCodeAt(_++)<<8|m.charCodeAt(_++)<<16|m.charCodeAt(_++)<<24;else for(E=0;E<16;++E)T[E]=m[_++]|m[_++]<<8|m[_++]<<16|m[_++]<<24;m=I.g[0],_=I.g[1],E=I.g[2];let v=I.g[3],g;g=m+(v^_&(E^v))+T[0]+3614090360&4294967295,m=_+(g<<7&4294967295|g>>>25),g=v+(E^m&(_^E))+T[1]+3905402710&4294967295,v=m+(g<<12&4294967295|g>>>20),g=E+(_^v&(m^_))+T[2]+606105819&4294967295,E=v+(g<<17&4294967295|g>>>15),g=_+(m^E&(v^m))+T[3]+3250441966&4294967295,_=E+(g<<22&4294967295|g>>>10),g=m+(v^_&(E^v))+T[4]+4118548399&4294967295,m=_+(g<<7&4294967295|g>>>25),g=v+(E^m&(_^E))+T[5]+1200080426&4294967295,v=m+(g<<12&4294967295|g>>>20),g=E+(_^v&(m^_))+T[6]+2821735955&4294967295,E=v+(g<<17&4294967295|g>>>15),g=_+(m^E&(v^m))+T[7]+4249261313&4294967295,_=E+(g<<22&4294967295|g>>>10),g=m+(v^_&(E^v))+T[8]+1770035416&4294967295,m=_+(g<<7&4294967295|g>>>25),g=v+(E^m&(_^E))+T[9]+2336552879&4294967295,v=m+(g<<12&4294967295|g>>>20),g=E+(_^v&(m^_))+T[10]+4294925233&4294967295,E=v+(g<<17&4294967295|g>>>15),g=_+(m^E&(v^m))+T[11]+2304563134&4294967295,_=E+(g<<22&4294967295|g>>>10),g=m+(v^_&(E^v))+T[12]+1804603682&4294967295,m=_+(g<<7&4294967295|g>>>25),g=v+(E^m&(_^E))+T[13]+4254626195&4294967295,v=m+(g<<12&4294967295|g>>>20),g=E+(_^v&(m^_))+T[14]+2792965006&4294967295,E=v+(g<<17&4294967295|g>>>15),g=_+(m^E&(v^m))+T[15]+1236535329&4294967295,_=E+(g<<22&4294967295|g>>>10),g=m+(E^v&(_^E))+T[1]+4129170786&4294967295,m=_+(g<<5&4294967295|g>>>27),g=v+(_^E&(m^_))+T[6]+3225465664&4294967295,v=m+(g<<9&4294967295|g>>>23),g=E+(m^_&(v^m))+T[11]+643717713&4294967295,E=v+(g<<14&4294967295|g>>>18),g=_+(v^m&(E^v))+T[0]+3921069994&4294967295,_=E+(g<<20&4294967295|g>>>12),g=m+(E^v&(_^E))+T[5]+3593408605&4294967295,m=_+(g<<5&4294967295|g>>>27),g=v+(_^E&(m^_))+T[10]+38016083&4294967295,v=m+(g<<9&4294967295|g>>>23),g=E+(m^_&(v^m))+T[15]+3634488961&4294967295,E=v+(g<<14&4294967295|g>>>18),g=_+(v^m&(E^v))+T[4]+3889429448&4294967295,_=E+(g<<20&4294967295|g>>>12),g=m+(E^v&(_^E))+T[9]+568446438&4294967295,m=_+(g<<5&4294967295|g>>>27),g=v+(_^E&(m^_))+T[14]+3275163606&4294967295,v=m+(g<<9&4294967295|g>>>23),g=E+(m^_&(v^m))+T[3]+4107603335&4294967295,E=v+(g<<14&4294967295|g>>>18),g=_+(v^m&(E^v))+T[8]+1163531501&4294967295,_=E+(g<<20&4294967295|g>>>12),g=m+(E^v&(_^E))+T[13]+2850285829&4294967295,m=_+(g<<5&4294967295|g>>>27),g=v+(_^E&(m^_))+T[2]+4243563512&4294967295,v=m+(g<<9&4294967295|g>>>23),g=E+(m^_&(v^m))+T[7]+1735328473&4294967295,E=v+(g<<14&4294967295|g>>>18),g=_+(v^m&(E^v))+T[12]+2368359562&4294967295,_=E+(g<<20&4294967295|g>>>12),g=m+(_^E^v)+T[5]+4294588738&4294967295,m=_+(g<<4&4294967295|g>>>28),g=v+(m^_^E)+T[8]+2272392833&4294967295,v=m+(g<<11&4294967295|g>>>21),g=E+(v^m^_)+T[11]+1839030562&4294967295,E=v+(g<<16&4294967295|g>>>16),g=_+(E^v^m)+T[14]+4259657740&4294967295,_=E+(g<<23&4294967295|g>>>9),g=m+(_^E^v)+T[1]+2763975236&4294967295,m=_+(g<<4&4294967295|g>>>28),g=v+(m^_^E)+T[4]+1272893353&4294967295,v=m+(g<<11&4294967295|g>>>21),g=E+(v^m^_)+T[7]+4139469664&4294967295,E=v+(g<<16&4294967295|g>>>16),g=_+(E^v^m)+T[10]+3200236656&4294967295,_=E+(g<<23&4294967295|g>>>9),g=m+(_^E^v)+T[13]+681279174&4294967295,m=_+(g<<4&4294967295|g>>>28),g=v+(m^_^E)+T[0]+3936430074&4294967295,v=m+(g<<11&4294967295|g>>>21),g=E+(v^m^_)+T[3]+3572445317&4294967295,E=v+(g<<16&4294967295|g>>>16),g=_+(E^v^m)+T[6]+76029189&4294967295,_=E+(g<<23&4294967295|g>>>9),g=m+(_^E^v)+T[9]+3654602809&4294967295,m=_+(g<<4&4294967295|g>>>28),g=v+(m^_^E)+T[12]+3873151461&4294967295,v=m+(g<<11&4294967295|g>>>21),g=E+(v^m^_)+T[15]+530742520&4294967295,E=v+(g<<16&4294967295|g>>>16),g=_+(E^v^m)+T[2]+3299628645&4294967295,_=E+(g<<23&4294967295|g>>>9),g=m+(E^(_|~v))+T[0]+4096336452&4294967295,m=_+(g<<6&4294967295|g>>>26),g=v+(_^(m|~E))+T[7]+1126891415&4294967295,v=m+(g<<10&4294967295|g>>>22),g=E+(m^(v|~_))+T[14]+2878612391&4294967295,E=v+(g<<15&4294967295|g>>>17),g=_+(v^(E|~m))+T[5]+4237533241&4294967295,_=E+(g<<21&4294967295|g>>>11),g=m+(E^(_|~v))+T[12]+1700485571&4294967295,m=_+(g<<6&4294967295|g>>>26),g=v+(_^(m|~E))+T[3]+2399980690&4294967295,v=m+(g<<10&4294967295|g>>>22),g=E+(m^(v|~_))+T[10]+4293915773&4294967295,E=v+(g<<15&4294967295|g>>>17),g=_+(v^(E|~m))+T[1]+2240044497&4294967295,_=E+(g<<21&4294967295|g>>>11),g=m+(E^(_|~v))+T[8]+1873313359&4294967295,m=_+(g<<6&4294967295|g>>>26),g=v+(_^(m|~E))+T[15]+4264355552&4294967295,v=m+(g<<10&4294967295|g>>>22),g=E+(m^(v|~_))+T[6]+2734768916&4294967295,E=v+(g<<15&4294967295|g>>>17),g=_+(v^(E|~m))+T[13]+1309151649&4294967295,_=E+(g<<21&4294967295|g>>>11),g=m+(E^(_|~v))+T[4]+4149444226&4294967295,m=_+(g<<6&4294967295|g>>>26),g=v+(_^(m|~E))+T[11]+3174756917&4294967295,v=m+(g<<10&4294967295|g>>>22),g=E+(m^(v|~_))+T[2]+718787259&4294967295,E=v+(g<<15&4294967295|g>>>17),g=_+(v^(E|~m))+T[9]+3951481745&4294967295,I.g[0]=I.g[0]+m&4294967295,I.g[1]=I.g[1]+(E+(g<<21&4294967295|g>>>11))&4294967295,I.g[2]=I.g[2]+E&4294967295,I.g[3]=I.g[3]+v&4294967295}r.prototype.v=function(I,m){m===void 0&&(m=I.length);const _=m-this.blockSize,T=this.C;let E=this.h,v=0;for(;v<m;){if(E==0)for(;v<=_;)s(this,I,v),v+=this.blockSize;if(typeof I=="string"){for(;v<m;)if(T[E++]=I.charCodeAt(v++),E==this.blockSize){s(this,T),E=0;break}}else for(;v<m;)if(T[E++]=I[v++],E==this.blockSize){s(this,T),E=0;break}}this.h=E,this.o+=m},r.prototype.A=function(){var I=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);I[0]=128;for(var m=1;m<I.length-8;++m)I[m]=0;m=this.o*8;for(var _=I.length-8;_<I.length;++_)I[_]=m&255,m/=256;for(this.v(I),I=Array(16),m=0,_=0;_<4;++_)for(let T=0;T<32;T+=8)I[m++]=this.g[_]>>>T&255;return I};function o(I,m){var _=u;return Object.prototype.hasOwnProperty.call(_,I)?_[I]:_[I]=m(I)}function a(I,m){this.h=m;const _=[];let T=!0;for(let E=I.length-1;E>=0;E--){const v=I[E]|0;T&&v==m||(_[E]=v,T=!1)}this.g=_}var u={};function h(I){return-128<=I&&I<128?o(I,function(m){return new a([m|0],m<0?-1:0)}):new a([I|0],I<0?-1:0)}function d(I){if(isNaN(I)||!isFinite(I))return y;if(I<0)return D(d(-I));const m=[];let _=1;for(let T=0;I>=_;T++)m[T]=I/_|0,_*=4294967296;return new a(m,0)}function p(I,m){if(I.length==0)throw Error("number format error: empty string");if(m=m||10,m<2||36<m)throw Error("radix out of range: "+m);if(I.charAt(0)=="-")return D(p(I.substring(1),m));if(I.indexOf("-")>=0)throw Error('number format error: interior "-" character');const _=d(Math.pow(m,8));let T=y;for(let v=0;v<I.length;v+=8){var E=Math.min(8,I.length-v);const g=parseInt(I.substring(v,v+E),m);E<8?(E=d(Math.pow(m,E)),T=T.j(E).add(d(g))):(T=T.j(_),T=T.add(d(g)))}return T}var y=h(0),R=h(1),C=h(16777216);n=a.prototype,n.m=function(){if(L(this))return-D(this).m();let I=0,m=1;for(let _=0;_<this.g.length;_++){const T=this.i(_);I+=(T>=0?T:4294967296+T)*m,m*=4294967296}return I},n.toString=function(I){if(I=I||10,I<2||36<I)throw Error("radix out of range: "+I);if(N(this))return"0";if(L(this))return"-"+D(this).toString(I);const m=d(Math.pow(I,6));var _=this;let T="";for(;;){const E=Pe(_,m).g;_=H(_,E.j(m));let v=((_.g.length>0?_.g[0]:_.h)>>>0).toString(I);if(_=E,N(_))return v+T;for(;v.length<6;)v="0"+v;T=v+T}},n.i=function(I){return I<0?0:I<this.g.length?this.g[I]:this.h};function N(I){if(I.h!=0)return!1;for(let m=0;m<I.g.length;m++)if(I.g[m]!=0)return!1;return!0}function L(I){return I.h==-1}n.l=function(I){return I=H(this,I),L(I)?-1:N(I)?0:1};function D(I){const m=I.g.length,_=[];for(let T=0;T<m;T++)_[T]=~I.g[T];return new a(_,~I.h).add(R)}n.abs=function(){return L(this)?D(this):this},n.add=function(I){const m=Math.max(this.g.length,I.g.length),_=[];let T=0;for(let E=0;E<=m;E++){let v=T+(this.i(E)&65535)+(I.i(E)&65535),g=(v>>>16)+(this.i(E)>>>16)+(I.i(E)>>>16);T=g>>>16,v&=65535,g&=65535,_[E]=g<<16|v}return new a(_,_[_.length-1]&-2147483648?-1:0)};function H(I,m){return I.add(D(m))}n.j=function(I){if(N(this)||N(I))return y;if(L(this))return L(I)?D(this).j(D(I)):D(D(this).j(I));if(L(I))return D(this.j(D(I)));if(this.l(C)<0&&I.l(C)<0)return d(this.m()*I.m());const m=this.g.length+I.g.length,_=[];for(var T=0;T<2*m;T++)_[T]=0;for(T=0;T<this.g.length;T++)for(let E=0;E<I.g.length;E++){const v=this.i(T)>>>16,g=this.i(T)&65535,ve=I.i(E)>>>16,Pt=I.i(E)&65535;_[2*T+2*E]+=g*Pt,G(_,2*T+2*E),_[2*T+2*E+1]+=v*Pt,G(_,2*T+2*E+1),_[2*T+2*E+1]+=g*ve,G(_,2*T+2*E+1),_[2*T+2*E+2]+=v*ve,G(_,2*T+2*E+2)}for(I=0;I<m;I++)_[I]=_[2*I+1]<<16|_[2*I];for(I=m;I<2*m;I++)_[I]=0;return new a(_,0)};function G(I,m){for(;(I[m]&65535)!=I[m];)I[m+1]+=I[m]>>>16,I[m]&=65535,m++}function Z(I,m){this.g=I,this.h=m}function Pe(I,m){if(N(m))throw Error("division by zero");if(N(I))return new Z(y,y);if(L(I))return m=Pe(D(I),m),new Z(D(m.g),D(m.h));if(L(m))return m=Pe(I,D(m)),new Z(D(m.g),m.h);if(I.g.length>30){if(L(I)||L(m))throw Error("slowDivide_ only works with positive integers.");for(var _=R,T=m;T.l(I)<=0;)_=pe(_),T=pe(T);var E=me(_,1),v=me(T,1);for(T=me(T,2),_=me(_,2);!N(T);){var g=v.add(T);g.l(I)<=0&&(E=E.add(_),v=g),T=me(T,1),_=me(_,1)}return m=H(I,E.j(m)),new Z(E,m)}for(E=y;I.l(m)>=0;){for(_=Math.max(1,Math.floor(I.m()/m.m())),T=Math.ceil(Math.log(_)/Math.LN2),T=T<=48?1:Math.pow(2,T-48),v=d(_),g=v.j(m);L(g)||g.l(I)>0;)_-=T,v=d(_),g=v.j(m);N(v)&&(v=R),E=E.add(v),I=H(I,g)}return new Z(E,I)}n.B=function(I){return Pe(this,I).h},n.and=function(I){const m=Math.max(this.g.length,I.g.length),_=[];for(let T=0;T<m;T++)_[T]=this.i(T)&I.i(T);return new a(_,this.h&I.h)},n.or=function(I){const m=Math.max(this.g.length,I.g.length),_=[];for(let T=0;T<m;T++)_[T]=this.i(T)|I.i(T);return new a(_,this.h|I.h)},n.xor=function(I){const m=Math.max(this.g.length,I.g.length),_=[];for(let T=0;T<m;T++)_[T]=this.i(T)^I.i(T);return new a(_,this.h^I.h)};function pe(I){const m=I.g.length+1,_=[];for(let T=0;T<m;T++)_[T]=I.i(T)<<1|I.i(T-1)>>>31;return new a(_,I.h)}function me(I,m){const _=m>>5;m%=32;const T=I.g.length-_,E=[];for(let v=0;v<T;v++)E[v]=m>0?I.i(v+_)>>>m|I.i(v+_+1)<<32-m:I.i(v+_);return new a(E,I.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,ul=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=p,gt=a}).apply(typeof gc<"u"?gc:typeof self<"u"?self:typeof window<"u"?window:{});var Lr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/**   
 
SPDX-License-Identifier: Apache-2.0
*/var ll,$n,hl,zr,Ai,dl,fl,pl;(function(){var n,e=Object.defineProperty;function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof Lr=="object"&&Lr];for(var c=0;c<i.length;++c){var l=i[c];if(l&&l.Math==Math)return l}throw Error("Cannot find global object")}var r=t(this);function s(i,c){if(c)e:{var l=r;i=i.split(".");for(var f=0;f<i.length-1;f++){var w=i[f];if(!(w in l))break e;l=l[w]}i=i[i.length-1],f=l[i],c=c(f),c!=f&&c!=null&&e(l,i,{configurable:!0,writable:!0,value:c})}}s("Symbol.dispose",function(i){return i||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(i){return i||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(i){return i||function(c){var l=[],f;for(f in c)Object.prototype.hasOwnProperty.call(c,f)&&l.push([f,c[f]]);return l}});/**   

  
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function u(i){var c=typeof i;return c=="object"&&i!=null||c=="function"}function h(i,c,l){return i.call.apply(i.bind,arguments)}function d(i,c,l){return d=h,d.apply(null,arguments)}function p(i,c){var l=Array.prototype.slice.call(arguments,1);return function(){var f=l.slice();return f.push.apply(f,arguments),i.apply(this,f)}}function y(i,c){function l(){}l.prototype=c.prototype,i.Z=c.prototype,i.prototype=new l,i.prototype.constructor=i,i.Ob=function(f,w,A){for(var b=Array(arguments.length-2),B=2;B<arguments.length;B++)b[B-2]=arguments[B];return c.prototype[w].apply(f,b)}}var R=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?i=>i&&AsyncContext.Snapshot.wrap(i):i=>i;function C(i){const c=i.length;if(c>0){const l=Array(c);for(let f=0;f<c;f++)l[f]=i[f];return l}return[]}function N(i,c){for(let f=1;f<arguments.length;f++){const w=arguments[f];var l=typeof w;if(l=l!="object"?l:w?Array.isArray(w)?"array":l:"null",l=="array"||l=="object"&&typeof w.length=="number"){l=i.length||0;const A=w.length||0;i.length=l+A;for(let b=0;b<A;b++)i[l+b]=w[b]}else i.push(w)}}class L{constructor(c,l){this.i=c,this.j=l,this.h=0,this.g=null}get(){let c;return this.h>0?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function D(i){a.setTimeout(()=>{throw i},0)}function H(){var i=I;let c=null;return i.g&&(c=i.g,i.g=i.g.next,i.g||(i.h=null),c.next=null),c}class G{constructor(){this.h=this.g=null}add(c,l){const f=Z.get();f.set(c,l),this.h?this.h.next=f:this.g=f,this.h=f}}var Z=new L(()=>new Pe,i=>i.reset());class Pe{constructor(){this.next=this.g=this.h=null}set(c,l){this.h=c,this.g=l,this.next=null}reset(){this.next=this.g=this.h=null}}let pe,me=!1,I=new G,m=()=>{const i=Promise.resolve(void 0);pe=()=>{i.then(_)}};function _(){for(var i;i=H();){try{i.h.call(i.g)}catch(l){D(l)}var c=Z;c.j(i),c.h<100&&(c.h++,i.next=c.g,c.g=i)}me=!1}function T(){this.u=this.u,this.C=this.C}T.prototype.u=!1,T.prototype.dispose=function(){this.u||(this.u=!0,this.N())},T.prototype[Symbol.dispose]=function(){this.dispose()},T.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function E(i,c){this.type=i,this.g=this.target=c,this.defaultPrevented=!1}E.prototype.h=function(){this.defaultPrevented=!0};var v=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var i=!1,c=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const l=()=>{};a.addEventListener("test",l,c),a.removeEventListener("test",l,c)}catch{}return i}();function g(i){return/^[\s\xa0]*$/.test(i)}function ve(i,c){E.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i&&this.init(i,c)}y(ve,E),ve.prototype.init=function(i,c){const l=this.type=i.type,f=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;this.target=i.target||i.srcElement,this.g=c,c=i.relatedTarget,c||(l=="mouseover"?c=i.fromElement:l=="mouseout"&&(c=i.toElement)),this.relatedTarget=c,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=i.pointerType,this.state=i.state,this.i=i,i.defaultPrevented&&ve.Z.h.call(this)},ve.prototype.h=function(){ve.Z.h.call(this);const i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var Pt="closure_listenable_"+(Math.random()*1e6|0),Wh=0;function Gh(i,c,l,f,w){this.listener=i,this.proxy=null,this.src=c,this.type=l,this.capture=!!f,this.ha=w,this.key=++Wh,this.da=this.fa=!1}function Er(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Ir(i,c,l){for(const f in i)c.call(l,i[f],f,i)}function Kh(i,c){for(const l in i)c.call(void 0,i[l],l,i)}function Uo(i){const c={};for(const l in i)c[l]=i[l];return c}const Bo="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function qo(i,c){let l,f;for(let w=1;w<arguments.length;w++){f=arguments[w];for(l in f)i[l]=f[l];for(let A=0;A<Bo.length;A++)l=Bo[A],Object.prototype.hasOwnProperty.call(f,l)&&(i[l]=f[l])}}function Tr(i){this.src=i,this.g={},this.h=0}Tr.prototype.add=function(i,c,l,f,w){const A=i.toString();i=this.g[A],i||(i=this.g[A]=[],this.h++);const b=Ls(i,c,f,w);return b>-1?(c=i[b],l||(c.fa=!1)):(c=new Gh(c,this.src,A,!!f,w),c.fa=l,i.push(c)),c};function Os(i,c){const l=c.type;if(l in i.g){var f=i.g[l],w=Array.prototype.indexOf.call(f,c,void 0),A;(A=w>=0)&&Array.prototype.splice.call(f,w,1),A&&(Er(c),i.g[l].length==0&&(delete i.g[l],i.h--))}}function Ls(i,c,l,f){for(let w=0;w<i.length;++w){const A=i[w];if(!A.da&&A.listener==c&&A.capture==!!l&&A.ha==f)return w}return-1}var Ms="closure_lm_"+(Math.random()*1e6|0),xs={};function jo(i,c,l,f,w){if(Array.isArray(c)){for(let A=0;A<c.length;A++)jo(i,c[A],l,f,w);return null}return l=Ho(l),i&&i[Pt]?i.J(c,l,u(f)?!!f.capture:!!f,w):Qh(i,c,l,!1,f,w)}function Qh(i,c,l,f,w,A){if(!c)throw Error("Invalid event type");const b=u(w)?!!w.capture:!!w;let B=Us(i);if(B||(i[Ms]=B=new Tr(i)),l=B.add(c,l,f,b,A),l.proxy)return l;if(f=Yh(),l.proxy=f,f.src=i,f.listener=l,i.addEventListener)v||(w=b),w===void 0&&(w=!1),i.addEventListener(c.toString(),f,w);else if(i.attachEvent)i.attachEvent(zo(c.toString()),f);else if(i.addListener&&i.removeListener)i.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return l}function Yh(){function i(l){return c.call(i.src,i.listener,l)}const c=Jh;return i}function $o(i,c,l,f,w){if(Array.isArray(c))for(var A=0;A<c.length;A++)$o(i,c[A],l,f,w);else f=u(f)?!!f.capture:!!f,l=Ho(l),i&&i[Pt]?(i=i.i,A=String(c).toString(),A in i.g&&(c=i.g[A],l=Ls(c,l,f,w),l>-1&&(Er(c[l]),Array.prototype.splice.call(c,l,1),c.length==0&&(delete i.g[A],i.h--)))):i&&(i=Us(i))&&(c=i.g[c.toString()],i=-1,c&&(i=Ls(c,l,f,w)),(l=i>-1?c[i]:null)&&Fs(l))}function Fs(i){if(typeof i!="number"&&i&&!i.da){var c=i.src;if(c&&c[Pt])Os(c.i,i);else{var l=i.type,f=i.proxy;c.removeEventListener?c.removeEventListener(l,f,i.capture):c.detachEvent?c.detachEvent(zo(l),f):c.addListener&&c.removeListener&&c.removeListener(f),(l=Us(c))?(Os(l,i),l.h==0&&(l.src=null,c[Ms]=null)):Er(i)}}}function zo(i){return i in xs?xs[i]:xs[i]="on"+i}function Jh(i,c){if(i.da)i=!0;else{c=new ve(c,this);const l=i.listener,f=i.ha||i.src;i.fa&&Fs(i),i=l.call(f,c)}return i}function Us(i){return i=i[Ms],i instanceof Tr?i:null}var Bs="__closure_events_fn_"+(Math.random()*1e9>>>0);function Ho(i){return typeof i=="function"?i:(i[Bs]||(i[Bs]=function(c){return i.handleEvent(c)}),i[Bs])}function ge(){T.call(this),this.i=new Tr(this),this.M=this,this.G=null}y(ge,T),ge.prototype[Pt]=!0,ge.prototype.removeEventListener=function(i,c,l,f){$o(this,i,c,l,f)};function Te(i,c){var l,f=i.G;if(f)for(l=[];f;f=f.G)l.push(f);if(i=i.M,f=c.type||c,typeof c=="string")c=new E(c,i);else if(c instanceof E)c.target=c.target||i;else{var w=c;c=new E(f,i),qo(c,w)}w=!0;let A,b;if(l)for(b=l.length-1;b>=0;b--)A=c.g=l[b],w=wr(A,f,!0,c)&&w;if(A=c.g=i,w=wr(A,f,!0,c)&&w,w=wr(A,f,!1,c)&&w,l)for(b=0;b<l.length;b++)A=c.g=l[b],w=wr(A,f,!1,c)&&w}ge.prototype.N=function(){if(ge.Z.N.call(this),this.i){var i=this.i;for(const c in i.g){const l=i.g[c];for(let f=0;f<l.length;f++)Er(l[f]);delete i.g[c],i.h--}}this.G=null},ge.prototype.J=function(i,c,l,f){return this.i.add(String(i),c,!1,l,f)},ge.prototype.K=function(i,c,l,f){return this.i.add(String(i),c,!0,l,f)};function wr(i,c,l,f){if(c=i.i.g[String(c)],!c)return!0;c=c.concat();let w=!0;for(let A=0;A<c.length;++A){const b=c[A];if(b&&!b.da&&b.capture==l){const B=b.listener,ae=b.ha||b.src;b.fa&&Os(i.i,b),w=B.call(ae,f)!==!1&&w}}return w&&!f.defaultPrevented}function Xh(i,c){if(typeof i!="function")if(i&&typeof i.handleEvent=="function")i=d(i.handleEvent,i);else throw Error("Invalid listener argument");return Number(c)>2147483647?-1:a.setTimeout(i,c||0)}function Wo(i){i.g=Xh(()=>{i.g=null,i.i&&(i.i=!1,Wo(i))},i.l);const c=i.h;i.h=null,i.m.apply(null,c)}class Zh extends T{constructor(c,l){super(),this.m=c,this.l=l,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:Wo(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function An(i){T.call(this),this.h=i,this.g={}}y(An,T);var Go=[];function Ko(i){Ir(i.g,function(c,l){this.g.hasOwnProperty(l)&&Fs(c)},i),i.g={}}An.prototype.N=function(){An.Z.N.call(this),Ko(this)},An.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var qs=a.JSON.stringify,ed=a.JSON.parse,td=class{stringify(i){return a.JSON.stringify(i,void 0)}parse(i){return a.JSON.parse(i,void 0)}};function Qo(){}function Yo(){}var Rn={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function js(){E.call(this,"d")}y(js,E);function $s(){E.call(this,"c")}y($s,E);var Ct={},Jo=null;function vr(){return Jo=Jo||new ge}Ct.Ia="serverreachability";function Xo(i){E.call(this,Ct.Ia,i)}y(Xo,E);function Sn(i){const c=vr();Te(c,new Xo(c))}Ct.STAT_EVENT="statevent";function Zo(i,c){E.call(this,Ct.STAT_EVENT,i),this.stat=c}y(Zo,E);function we(i){const c=vr();Te(c,new Zo(c,i))}Ct.Ja="timingevent";function ea(i,c){E.call(this,Ct.Ja,i),this.size=c}y(ea,E);function Pn(i,c){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){i()},c)}function Cn(){this.g=!0}Cn.prototype.ua=function(){this.g=!1};function nd(i,c,l,f,w,A){i.info(function(){if(i.g)if(A){var b="",B=A.split("&");for(let K=0;K<B.length;K++){var ae=B[K].split("=");if(ae.length>1){const ue=ae[0];ae=ae[1];const Fe=ue.split("_");b=Fe.length>=2&&Fe[1]=="type"?b+(ue+"="+ae+"&"):b+(ue+"=redacted&")}}}else b=null;else b=A;return"XMLHTTP REQ ("+f+") [attempt "+w+"]: "+c+`
`+l+`
`+b})}function rd(i,c,l,f,w,A,b){i.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+w+"]: "+c+`
`+l+`
`+A+" "+b})}function Qt(i,c,l,f){i.info(function(){return"XMLHTTP TEXT ("+c+"): "+id(i,l)+(f?" "+f:"")})}function sd(i,c){i.info(function(){return"TIMEOUT: "+c})}Cn.prototype.info=function(){};function id(i,c){if(!i.g)return c;if(!c)return null;try{const A=JSON.parse(c);if(A){for(i=0;i<A.length;i++)if(Array.isArray(A[i])){var l=A[i];if(!(l.length<2)){var f=l[1];if(Array.isArray(f)&&!(f.length<1)){var w=f[0];if(w!="noop"&&w!="stop"&&w!="close")for(let b=1;b<f.length;b++)f[b]=""}}}}return qs(A)}catch{return c}}var Ar={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},ta={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},na;function zs(){}y(zs,Qo),zs.prototype.g=function(){return new XMLHttpRequest},na=new zs;function bn(i){return encodeURIComponent(String(i))}function od(i){var c=1;i=i.split(":");const l=[];for(;c>0&&i.length;)l.push(i.shift()),c--;return i.length&&l.push(i.join(":")),l}function et(i,c,l,f){this.j=i,this.i=c,this.l=l,this.S=f||1,this.V=new An(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new ra}function ra(){this.i=null,this.g="",this.h=!1}var sa={},Hs={};function Ws(i,c,l){i.M=1,i.A=Sr(xe(c)),i.u=l,i.R=!0,ia(i,null)}function ia(i,c){i.F=Date.now(),Rr(i),i.B=xe(i.A);var l=i.B,f=i.S;Array.isArray(f)||(f=[String(f)]),ya(l.i,"t",f),i.C=0,l=i.j.L,i.h=new ra,i.g=Ma(i.j,l?c:null,!i.u),i.P>0&&(i.O=new Zh(d(i.Y,i,i.g),i.P)),c=i.V,l=i.g,f=i.ba;var w="readystatechange";Array.isArray(w)||(w&&(Go[0]=w.toString()),w=Go);for(let A=0;A<w.length;A++){const b=jo(l,w[A],f||c.handleEvent,!1,c.h||c);if(!b)break;c.g[b.key]=b}c=i.J?Uo(i.J):{},i.u?(i.v||(i.v="POST"),c["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.B,i.v,i.u,c)):(i.v="GET",i.g.ea(i.B,i.v,null,c)),Sn(),nd(i.i,i.v,i.B,i.l,i.S,i.u)}et.prototype.ba=function(i){i=i.target;const c=this.O;c&&rt(i)==3?c.j():this.Y(i)},et.prototype.Y=function(i){try{if(i==this.g)e:{const B=rt(this.g),ae=this.g.ya(),K=this.g.ca();if(!(B<3)&&(B!=3||this.g&&(this.h.h||this.g.la()||Ra(this.g)))){this.K||B!=4||ae==7||(ae==8||K<=0?Sn(3):Sn(2)),Gs(this);var c=this.g.ca();this.X=c;var l=ad(this);if(this.o=c==200,rd(this.i,this.v,this.B,this.l,this.S,B,c),this.o){if(this.U&&!this.L){t:{if(this.g){var f,w=this.g;if((f=w.g?w.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!g(f)){var A=f;break t}}A=null}if(i=A)Qt(this.i,this.l,i,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Ks(this,i);else{this.o=!1,this.m=3,we(12),bt(this),Vn(this);break e}}if(this.R){i=!0;let ue;for(;!this.K&&this.C<l.length;)if(ue=cd(this,l),ue==Hs){B==4&&(this.m=4,we(14),i=!1),Qt(this.i,this.l,null,"[Incomplete Response]");break}else if(ue==sa){this.m=4,we(15),Qt(this.i,this.l,l,"[Invalid Chunk]"),i=!1;break}else Qt(this.i,this.l,ue,null),Ks(this,ue);if(oa(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),B!=4||l.length!=0||this.h.h||(this.m=1,we(16),i=!1),this.o=this.o&&i,!i)Qt(this.i,this.l,l,"[Invalid Chunked Response]"),bt(this),Vn(this);else if(l.length>0&&!this.W){this.W=!0;var b=this.j;b.g==this&&b.aa&&!b.P&&(b.j.info("Great, no buffering proxy detected. Bytes received: "+l.length),ni(b),b.P=!0,we(11))}}else Qt(this.i,this.l,l,null),Ks(this,l);B==4&&bt(this),this.o&&!this.K&&(B==4?Na(this.j,this):(this.o=!1,Rr(this)))}else wd(this.g),c==400&&l.indexOf("Unknown SID")>0?(this.m=3,we(12)):(this.m=0,we(13)),bt(this),Vn(this)}}}catch{}finally{}};function ad(i){if(!oa(i))return i.g.la();const c=Ra(i.g);if(c==="")return"";let l="";const f=c.length,w=rt(i.g)==4;if(!i.h.i){if(typeof TextDecoder>"u")return bt(i),Vn(i),"";i.h.i=new a.TextDecoder}for(let A=0;A<f;A++)i.h.h=!0,l+=i.h.i.decode(c[A],{stream:!(w&&A==f-1)});return c.length=0,i.h.g+=l,i.C=0,i.h.g}function oa(i){return i.g?i.v=="GET"&&i.M!=2&&i.j.Aa:!1}function cd(i,c){var l=i.C,f=c.indexOf(`
`,l);return f==-1?Hs:(l=Number(c.substring(l,f)),isNaN(l)?sa:(f+=1,f+l>c.length?Hs:(c=c.slice(f,f+l),i.C=f+l,c)))}et.prototype.cancel=function(){this.K=!0,bt(this)};function Rr(i){i.T=Date.now()+i.H,aa(i,i.H)}function aa(i,c){if(i.D!=null)throw Error("WatchDog timer not null");i.D=Pn(d(i.aa,i),c)}function Gs(i){i.D&&(a.clearTimeout(i.D),i.D=null)}et.prototype.aa=function(){this.D=null;const i=Date.now();i-this.T>=0?(sd(this.i,this.B),this.M!=2&&(Sn(),we(17)),bt(this),this.m=2,Vn(this)):aa(this,this.T-i)};function Vn(i){i.j.I==0||i.K||Na(i.j,i)}function bt(i){Gs(i);var c=i.O;c&&typeof c.dispose=="function"&&c.dispose(),i.O=null,Ko(i.V),i.g&&(c=i.g,i.g=null,c.abort(),c.dispose())}function Ks(i,c){try{var l=i.j;if(l.I!=0&&(l.g==i||Qs(l.h,i))){if(!i.L&&Qs(l.h,i)&&l.I==3){try{var f=l.Ba.g.parse(c)}catch{f=null}if(Array.isArray(f)&&f.length==3){var w=f;if(w[0]==0){e:if(!l.v){if(l.g)if(l.g.F+3e3<i.F)kr(l),br(l);else break e;ti(l),we(18)}}else l.xa=w[1],0<l.xa-l.K&&w[2]<37500&&l.F&&l.A==0&&!l.C&&(l.C=Pn(d(l.Va,l),6e3));la(l.h)<=1&&l.ta&&(l.ta=void 0)}else kt(l,11)}else if((i.L||l.g==i)&&kr(l),!g(c))for(w=l.Ba.g.parse(c),c=0;c<w.length;c++){let K=w[c];const ue=K[0];if(!(ue<=l.K))if(l.K=ue,K=K[1],l.I==2)if(K[0]=="c"){l.M=K[1],l.ba=K[2];const Fe=K[3];Fe!=null&&(l.ka=Fe,l.j.info("VER="+l.ka));const Nt=K[4];Nt!=null&&(l.za=Nt,l.j.info("SVER="+l.za));const st=K[5];st!=null&&typeof st=="number"&&st>0&&(f=1.5*st,l.O=f,l.j.info("backChannelRequestTimeoutMs_="+f)),f=l;const it=i.g;if(it){const Dr=it.g?it.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Dr){var A=f.h;A.g||Dr.indexOf("spdy")==-1&&Dr.indexOf("quic")==-1&&Dr.indexOf("h2")==-1||(A.j=A.l,A.g=new Set,A.h&&(Ys(A,A.h),A.h=null))}if(f.G){const ri=it.g?it.g.getResponseHeader("X-HTTP-Session-Id"):null;ri&&(f.wa=ri,Y(f.J,f.G,ri))}}l.I=3,l.l&&l.l.ra(),l.aa&&(l.T=Date.now()-i.F,l.j.info("Handshake RTT: "+l.T+"ms")),f=l;var b=i;if(f.na=La(f,f.L?f.ba:null,f.W),b.L){ha(f.h,b);var B=b,ae=f.O;ae&&(B.H=ae),B.D&&(Gs(B),Rr(B)),f.g=b}else Va(f);l.i.length>0&&Vr(l)}else K[0]!="stop"&&K[0]!="close"||kt(l,7);else l.I==3&&(K[0]=="stop"||K[0]=="close"?K[0]=="stop"?kt(l,7):ei(l):K[0]!="noop"&&l.l&&l.l.qa(K),l.A=0)}}Sn(4)}catch{}}var ud=class{constructor(i,c){this.g=i,this.map=c}};function ca(i){this.l=i||10,a.PerformanceNavigationTiming?(i=a.performance.getEntriesByType("navigation"),i=i.length>0&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function ua(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function la(i){return i.h?1:i.g?i.g.size:0}function Qs(i,c){return i.h?i.h==c:i.g?i.g.has(c):!1}function Ys(i,c){i.g?i.g.add(c):i.h=c}function ha(i,c){i.h&&i.h==c?i.h=null:i.g&&i.g.has(c)&&i.g.delete(c)}ca.prototype.cancel=function(){if(this.i=da(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function da(i){if(i.h!=null)return i.i.concat(i.h.G);if(i.g!=null&&i.g.size!==0){let c=i.i;for(const l of i.g.values())c=c.concat(l.G);return c}return C(i.i)}var fa=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ld(i,c){if(i){i=i.split("&");for(let l=0;l<i.length;l++){const f=i[l].indexOf("=");let w,A=null;f>=0?(w=i[l].substring(0,f),A=i[l].substring(f+1)):w=i[l],c(w,A?decodeURIComponent(A.replace(/\+/g," ")):"")}}}function tt(i){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let c;i instanceof tt?(this.l=i.l,kn(this,i.j),this.o=i.o,this.g=i.g,Nn(this,i.u),this.h=i.h,Js(this,Ea(i.i)),this.m=i.m):i&&(c=String(i).match(fa))?(this.l=!1,kn(this,c[1]||"",!0),this.o=Dn(c[2]||""),this.g=Dn(c[3]||"",!0),Nn(this,c[4]),this.h=Dn(c[5]||"",!0),Js(this,c[6]||"",!0),this.m=Dn(c[7]||"")):(this.l=!1,this.i=new Ln(null,this.l))}tt.prototype.toString=function(){const i=[];var c=this.j;c&&i.push(On(c,pa,!0),":");var l=this.g;return(l||c=="file")&&(i.push("//"),(c=this.o)&&i.push(On(c,pa,!0),"@"),i.push(bn(l).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l=this.u,l!=null&&i.push(":",String(l))),(l=this.h)&&(this.g&&l.charAt(0)!="/"&&i.push("/"),i.push(On(l,l.charAt(0)=="/"?fd:dd,!0))),(l=this.i.toString())&&i.push("?",l),(l=this.m)&&i.push("#",On(l,md)),i.join("")},tt.prototype.resolve=function(i){const c=xe(this);let l=!!i.j;l?kn(c,i.j):l=!!i.o,l?c.o=i.o:l=!!i.g,l?c.g=i.g:l=i.u!=null;var f=i.h;if(l)Nn(c,i.u);else if(l=!!i.h){if(f.charAt(0)!="/")if(this.g&&!this.h)f="/"+f;else{var w=c.h.lastIndexOf("/");w!=-1&&(f=c.h.slice(0,w+1)+f)}if(w=f,w==".."||w==".")f="";else if(w.indexOf("./")!=-1||w.indexOf("/.")!=-1){f=w.lastIndexOf("/",0)==0,w=w.split("/");const A=[];for(let b=0;b<w.length;){const B=w[b++];B=="."?f&&b==w.length&&A.push(""):B==".."?((A.length>1||A.length==1&&A[0]!="")&&A.pop(),f&&b==w.length&&A.push("")):(A.push(B),f=!0)}f=A.join("/")}else f=w}return l?c.h=f:l=i.i.toString()!=="",l?Js(c,Ea(i.i)):l=!!i.m,l&&(c.m=i.m),c};function xe(i){return new tt(i)}function kn(i,c,l){i.j=l?Dn(c,!0):c,i.j&&(i.j=i.j.replace(/:$/,""))}function Nn(i,c){if(c){if(c=Number(c),isNaN(c)||c<0)throw Error("Bad port number "+c);i.u=c}else i.u=null}function Js(i,c,l){c instanceof Ln?(i.i=c,gd(i.i,i.l)):(l||(c=On(c,pd)),i.i=new Ln(c,i.l))}function Y(i,c,l){i.i.set(c,l)}function Sr(i){return Y(i,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),i}function Dn(i,c){return i?c?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function On(i,c,l){return typeof i=="string"?(i=encodeURI(i).replace(c,hd),l&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function hd(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var pa=/[#\/\?@]/g,dd=/[#\?:]/g,fd=/[#\?]/g,pd=/[#\?@]/g,md=/#/g;function Ln(i,c){this.h=this.g=null,this.i=i||null,this.j=!!c}function Vt(i){i.g||(i.g=new Map,i.h=0,i.i&&ld(i.i,function(c,l){i.add(decodeURIComponent(c.replace(/\+/g," ")),l)}))}n=Ln.prototype,n.add=function(i,c){Vt(this),this.i=null,i=Yt(this,i);let l=this.g.get(i);return l||this.g.set(i,l=[]),l.push(c),this.h+=1,this};function ma(i,c){Vt(i),c=Yt(i,c),i.g.has(c)&&(i.i=null,i.h-=i.g.get(c).length,i.g.delete(c))}function ga(i,c){return Vt(i),c=Yt(i,c),i.g.has(c)}n.forEach=function(i,c){Vt(this),this.g.forEach(function(l,f){l.forEach(function(w){i.call(c,w,f,this)},this)},this)};function _a(i,c){Vt(i);let l=[];if(typeof c=="string")ga(i,c)&&(l=l.concat(i.g.get(Yt(i,c))));else for(i=Array.from(i.g.values()),c=0;c<i.length;c++)l=l.concat(i[c]);return l}n.set=function(i,c){return Vt(this),this.i=null,i=Yt(this,i),ga(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[c]),this.h+=1,this},n.get=function(i,c){return i?(i=_a(this,i),i.length>0?String(i[0]):c):c};function ya(i,c,l){ma(i,c),l.length>0&&(i.i=null,i.g.set(Yt(i,c),C(l)),i.h+=l.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],c=Array.from(this.g.keys());for(let f=0;f<c.length;f++){var l=c[f];const w=bn(l);l=_a(this,l);for(let A=0;A<l.length;A++){let b=w;l[A]!==""&&(b+="="+bn(l[A])),i.push(b)}}return this.i=i.join("&")};function Ea(i){const c=new Ln;return c.i=i.i,i.g&&(c.g=new Map(i.g),c.h=i.h),c}function Yt(i,c){return c=String(c),i.j&&(c=c.toLowerCase()),c}function gd(i,c){c&&!i.j&&(Vt(i),i.i=null,i.g.forEach(function(l,f){const w=f.toLowerCase();f!=w&&(ma(this,f),ya(this,w,l))},i)),i.j=c}function _d(i,c){const l=new Cn;if(a.Image){const f=new Image;f.onload=p(nt,l,"TestLoadImage: loaded",!0,c,f),f.onerror=p(nt,l,"TestLoadImage: error",!1,c,f),f.onabort=p(nt,l,"TestLoadImage: abort",!1,c,f),f.ontimeout=p(nt,l,"TestLoadImage: timeout",!1,c,f),a.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=i}else c(!1)}function yd(i,c){const l=new Cn,f=new AbortController,w=setTimeout(()=>{f.abort(),nt(l,"TestPingServer: timeout",!1,c)},1e4);fetch(i,{signal:f.signal}).then(A=>{clearTimeout(w),A.ok?nt(l,"TestPingServer: ok",!0,c):nt(l,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(w),nt(l,"TestPingServer: error",!1,c)})}function nt(i,c,l,f,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),f(l)}catch{}}function Ed(){this.g=new td}function Xs(i){this.i=i.Sb||null,this.h=i.ab||!1}y(Xs,Qo),Xs.prototype.g=function(){return new Pr(this.i,this.h)};function Pr(i,c){ge.call(this),this.H=i,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}y(Pr,ge),n=Pr.prototype,n.open=function(i,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=i,this.D=c,this.readyState=1,xn(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const c={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};i&&(c.body=i),(this.H||a).fetch(new Request(this.D,c)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Mn(this)),this.readyState=0},n.Pa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,xn(this)),this.g&&(this.readyState=3,xn(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Ia(this)}else i.text().then(this.Oa.bind(this),this.ga.bind(this))};function Ia(i){i.j.read().then(i.Ma.bind(i)).catch(i.ga.bind(i))}n.Ma=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var c=i.value?i.value:new Uint8Array(0);(c=this.B.decode(c,{stream:!i.done}))&&(this.response=this.responseText+=c)}i.done?Mn(this):xn(this),this.readyState==3&&Ia(this)}},n.Oa=function(i){this.g&&(this.response=this.responseText=i,Mn(this))},n.Na=function(i){this.g&&(this.response=i,Mn(this))},n.ga=function(){this.g&&Mn(this)};function Mn(i){i.readyState=4,i.l=null,i.j=null,i.B=null,xn(i)}n.setRequestHeader=function(i,c){this.A.append(i,c)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],c=this.h.entries();for(var l=c.next();!l.done;)l=l.value,i.push(l[0]+": "+l[1]),l=c.next();return i.join(`\r
`)};function xn(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(Pr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Ta(i){let c="";return Ir(i,function(l,f){c+=f,c+=":",c+=l,c+=`\r
`}),c}function Zs(i,c,l){e:{for(f in l){var f=!1;break e}f=!0}f||(l=Ta(l),typeof i=="string"?l!=null&&bn(l):Y(i,c,l))}function ee(i){ge.call(this),this.headers=new Map,this.L=i||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}y(ee,ge);var Id=/^https?$/i,Td=["POST","PUT"];n=ee.prototype,n.Fa=function(i){this.H=i},n.ea=function(i,c,l,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);c=c?c.toUpperCase():"GET",this.D=i,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():na.g(),this.g.onreadystatechange=R(d(this.Ca,this));try{this.B=!0,this.g.open(c,String(i),!0),this.B=!1}catch(A){wa(this,A);return}if(i=l||"",l=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var w in f)l.set(w,f[w]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const A of f.keys())l.set(A,f.get(A));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(l.keys()).find(A=>A.toLowerCase()=="content-type"),w=a.FormData&&i instanceof a.FormData,!(Array.prototype.indexOf.call(Td,c,void 0)>=0)||f||w||l.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[A,b]of l)this.g.setRequestHeader(A,b);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(i),this.v=!1}catch(A){wa(this,A)}};function wa(i,c){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=c,i.o=5,va(i),Cr(i)}function va(i){i.A||(i.A=!0,Te(i,"complete"),Te(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=i||7,Te(this,"complete"),Te(this,"abort"),Cr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Cr(this,!0)),ee.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Aa(this):this.Xa())},n.Xa=function(){Aa(this)};function Aa(i){if(i.h&&typeof o<"u"){if(i.v&&rt(i)==4)setTimeout(i.Ca.bind(i),0);else if(Te(i,"readystatechange"),rt(i)==4){i.h=!1;try{const A=i.ca();e:switch(A){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var l;if(!(l=c)){var f;if(f=A===0){let b=String(i.D).match(fa)[1]||null;!b&&a.self&&a.self.location&&(b=a.self.location.protocol.slice(0,-1)),f=!Id.test(b?b.toLowerCase():"")}l=f}if(l)Te(i,"complete"),Te(i,"success");else{i.o=6;try{var w=rt(i)>2?i.g.statusText:""}catch{w=""}i.l=w+" ["+i.ca()+"]",va(i)}}finally{Cr(i)}}}}function Cr(i,c){if(i.g){i.m&&(clearTimeout(i.m),i.m=null);const l=i.g;i.g=null,c||Te(i,"ready");try{l.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function rt(i){return i.g?i.g.readyState:0}n.ca=function(){try{return rt(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(i){if(this.g){var c=this.g.responseText;return i&&c.indexOf(i)==0&&(c=c.substring(i.length)),ed(c)}};function Ra(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.F){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function wd(i){const c={};i=(i.g&&rt(i)>=2&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<i.length;f++){if(g(i[f]))continue;var l=od(i[f]);const w=l[0];if(l=l[1],typeof l!="string")continue;l=l.trim();const A=c[w]||[];c[w]=A,A.push(l)}Kh(c,function(f){return f.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Fn(i,c,l){return l&&l.internalChannelParams&&l.internalChannelParams[i]||c}function Sa(i){this.za=0,this.i=[],this.j=new Cn,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Fn("failFast",!1,i),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Fn("baseRetryDelayMs",5e3,i),this.Za=Fn("retryDelaySeedMs",1e4,i),this.Ta=Fn("forwardChannelMaxRetries",2,i),this.va=Fn("forwardChannelRequestTimeoutMs",2e4,i),this.ma=i&&i.xmlHttpFactory||void 0,this.Ua=i&&i.Rb||void 0,this.Aa=i&&i.useFetchStreams||!1,this.O=void 0,this.L=i&&i.supportsCrossDomainXhr||!1,this.M="",this.h=new ca(i&&i.concurrentRequestLimit),this.Ba=new Ed,this.S=i&&i.fastHandshake||!1,this.R=i&&i.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=i&&i.Pb||!1,i&&i.ua&&this.j.ua(),i&&i.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&i&&i.detectBufferingProxy||!1,this.ia=void 0,i&&i.longPollingTimeout&&i.longPollingTimeout>0&&(this.ia=i.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=Sa.prototype,n.ka=8,n.I=1,n.connect=function(i,c,l,f){we(0),this.W=i,this.H=c||{},l&&f!==void 0&&(this.H.OSID=l,this.H.OAID=f),this.F=this.X,this.J=La(this,null,this.W),Vr(this)};function ei(i){if(Pa(i),i.I==3){var c=i.V++,l=xe(i.J);if(Y(l,"SID",i.M),Y(l,"RID",c),Y(l,"TYPE","terminate"),Un(i,l),c=new et(i,i.j,c),c.M=2,c.A=Sr(xe(l)),l=!1,a.navigator&&a.navigator.sendBeacon)try{l=a.navigator.sendBeacon(c.A.toString(),"")}catch{}!l&&a.Image&&(new Image().src=c.A,l=!0),l||(c.g=Ma(c.j,null),c.g.ea(c.A)),c.F=Date.now(),Rr(c)}Oa(i)}function br(i){i.g&&(ni(i),i.g.cancel(),i.g=null)}function Pa(i){br(i),i.v&&(a.clearTimeout(i.v),i.v=null),kr(i),i.h.cancel(),i.m&&(typeof i.m=="number"&&a.clearTimeout(i.m),i.m=null)}function Vr(i){if(!ua(i.h)&&!i.m){i.m=!0;var c=i.Ea;pe||m(),me||(pe(),me=!0),I.add(c,i),i.D=0}}function vd(i,c){return la(i.h)>=i.h.j-(i.m?1:0)?!1:i.m?(i.i=c.G.concat(i.i),!0):i.I==1||i.I==2||i.D>=(i.Sa?0:i.Ta)?!1:(i.m=Pn(d(i.Ea,i,c),Da(i,i.D)),i.D++,!0)}n.Ea=function(i){if(this.m)if(this.m=null,this.I==1){if(!i){this.V=Math.floor(Math.random()*1e5),i=this.V++;const w=new et(this,this.j,i);let A=this.o;if(this.U&&(A?(A=Uo(A),qo(A,this.U)):A=this.U),this.u!==null||this.R||(w.J=A,A=null),this.S)e:{for(var c=0,l=0;l<this.i.length;l++){t:{var f=this.i[l];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(c+=f,c>4096){c=l;break e}if(c===4096||l===this.i.length-1){c=l+1;break e}}c=1e3}else c=1e3;c=ba(this,w,c),l=xe(this.J),Y(l,"RID",i),Y(l,"CVER",22),this.G&&Y(l,"X-HTTP-Session-Id",this.G),Un(this,l),A&&(this.R?c="headers="+bn(Ta(A))+"&"+c:this.u&&Zs(l,this.u,A)),Ys(this.h,w),this.Ra&&Y(l,"TYPE","init"),this.S?(Y(l,"$req",c),Y(l,"SID","null"),w.U=!0,Ws(w,l,null)):Ws(w,l,c),this.I=2}}else this.I==3&&(i?Ca(this,i):this.i.length==0||ua(this.h)||Ca(this))};function Ca(i,c){var l;c?l=c.l:l=i.V++;const f=xe(i.J);Y(f,"SID",i.M),Y(f,"RID",l),Y(f,"AID",i.K),Un(i,f),i.u&&i.o&&Zs(f,i.u,i.o),l=new et(i,i.j,l,i.D+1),i.u===null&&(l.J=i.o),c&&(i.i=c.G.concat(i.i)),c=ba(i,l,1e3),l.H=Math.round(i.va*.5)+Math.round(i.va*.5*Math.random()),Ys(i.h,l),Ws(l,f,c)}function Un(i,c){i.H&&Ir(i.H,function(l,f){Y(c,f,l)}),i.l&&Ir({},function(l,f){Y(c,f,l)})}function ba(i,c,l){l=Math.min(i.i.length,l);const f=i.l?d(i.l.Ka,i.l,i):null;e:{var w=i.i;let B=-1;for(;;){const ae=["count="+l];B==-1?l>0?(B=w[0].g,ae.push("ofs="+B)):B=0:ae.push("ofs="+B);let K=!0;for(let ue=0;ue<l;ue++){var A=w[ue].g;const Fe=w[ue].map;if(A-=B,A<0)B=Math.max(0,w[ue].g-100),K=!1;else try{A="req"+A+"_"||"";try{var b=Fe instanceof Map?Fe:Object.entries(Fe);for(const[Nt,st]of b){let it=st;u(st)&&(it=qs(st)),ae.push(A+Nt+"="+encodeURIComponent(it))}}catch(Nt){throw ae.push(A+"type="+encodeURIComponent("_badmap")),Nt}}catch{f&&f(Fe)}}if(K){b=ae.join("&");break e}}b=void 0}return i=i.i.splice(0,l),c.G=i,b}function Va(i){if(!i.g&&!i.v){i.Y=1;var c=i.Da;pe||m(),me||(pe(),me=!0),I.add(c,i),i.A=0}}function ti(i){return i.g||i.v||i.A>=3?!1:(i.Y++,i.v=Pn(d(i.Da,i),Da(i,i.A)),i.A++,!0)}n.Da=function(){if(this.v=null,ka(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var i=4*this.T;this.j.info("BP detection timer enabled: "+i),this.B=Pn(d(this.Wa,this),i)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,we(10),br(this),ka(this))};function ni(i){i.B!=null&&(a.clearTimeout(i.B),i.B=null)}function ka(i){i.g=new et(i,i.j,"rpc",i.Y),i.u===null&&(i.g.J=i.o),i.g.P=0;var c=xe(i.na);Y(c,"RID","rpc"),Y(c,"SID",i.M),Y(c,"AID",i.K),Y(c,"CI",i.F?"0":"1"),!i.F&&i.ia&&Y(c,"TO",i.ia),Y(c,"TYPE","xmlhttp"),Un(i,c),i.u&&i.o&&Zs(c,i.u,i.o),i.O&&(i.g.H=i.O);var l=i.g;i=i.ba,l.M=1,l.A=Sr(xe(c)),l.u=null,l.R=!0,ia(l,i)}n.Va=function(){this.C!=null&&(this.C=null,br(this),ti(this),we(19))};function kr(i){i.C!=null&&(a.clearTimeout(i.C),i.C=null)}function Na(i,c){var l=null;if(i.g==c){kr(i),ni(i),i.g=null;var f=2}else if(Qs(i.h,c))l=c.G,ha(i.h,c),f=1;else return;if(i.I!=0){if(c.o)if(f==1){l=c.u?c.u.length:0,c=Date.now()-c.F;var w=i.D;f=vr(),Te(f,new ea(f,l)),Vr(i)}else Va(i);else if(w=c.m,w==3||w==0&&c.X>0||!(f==1&&vd(i,c)||f==2&&ti(i)))switch(l&&l.length>0&&(c=i.h,c.i=c.i.concat(l)),w){case 1:kt(i,5);break;case 4:kt(i,10);break;case 3:kt(i,6);break;default:kt(i,2)}}}function Da(i,c){let l=i.Qa+Math.floor(Math.random()*i.Za);return i.isActive()||(l*=2),l*c}function kt(i,c){if(i.j.info("Error code "+c),c==2){var l=d(i.bb,i),f=i.Ua;const w=!f;f=new tt(f||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||kn(f,"https"),Sr(f),w?_d(f.toString(),l):yd(f.toString(),l)}else we(2);i.I=0,i.l&&i.l.pa(c),Oa(i),Pa(i)}n.bb=function(i){i?(this.j.info("Successfully pinged google.com"),we(2)):(this.j.info("Failed to ping google.com"),we(1))};function Oa(i){if(i.I=0,i.ja=[],i.l){const c=da(i.h);(c.length!=0||i.i.length!=0)&&(N(i.ja,c),N(i.ja,i.i),i.h.i.length=0,C(i.i),i.i.length=0),i.l.oa()}}function La(i,c,l){var f=l instanceof tt?xe(l):new tt(l);if(f.g!="")c&&(f.g=c+"."+f.g),Nn(f,f.u);else{var w=a.location;f=w.protocol,c=c?c+"."+w.hostname:w.hostname,w=+w.port;const A=new tt(null);f&&kn(A,f),c&&(A.g=c),w&&Nn(A,w),l&&(A.h=l),f=A}return l=i.G,c=i.wa,l&&c&&Y(f,l,c),Y(f,"VER",i.ka),Un(i,f),f}function Ma(i,c,l){if(c&&!i.L)throw Error("Can't create secondary domain capable XhrIo object.");return c=i.Aa&&!i.ma?new ee(new Xs({ab:l})):new ee(i.ma),c.Fa(i.L),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function xa(){}n=xa.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function Nr(){}Nr.prototype.g=function(i,c){return new Re(i,c)};function Re(i,c){ge.call(this),this.g=new Sa(c),this.l=i,this.h=c&&c.messageUrlParams||null,i=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(i?i["X-WebChannel-Content-Type"]=c.messageContentType:i={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.sa&&(i?i["X-WebChannel-Client-Profile"]=c.sa:i={"X-WebChannel-Client-Profile":c.sa}),this.g.U=i,(i=c&&c.Qb)&&!g(i)&&(this.g.u=i),this.A=c&&c.supportsCrossDomainXhr||!1,this.v=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!g(c)&&(this.g.G=c,i=this.h,i!==null&&c in i&&(i=this.h,c in i&&delete i[c])),this.j=new Jt(this)}y(Re,ge),Re.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Re.prototype.close=function(){ei(this.g)},Re.prototype.o=function(i){var c=this.g;if(typeof i=="string"){var l={};l.__data__=i,i=l}else this.v&&(l={},l.__data__=qs(i),i=l);c.i.push(new ud(c.Ya++,i)),c.I==3&&Vr(c)},Re.prototype.N=function(){this.g.l=null,delete this.j,ei(this.g),delete this.g,Re.Z.N.call(this)};function Fa(i){js.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var c=i.__sm__;if(c){e:{for(const l in c){i=l;break e}i=void 0}(this.i=i)&&(i=this.i,c=c!==null&&i in c?c[i]:void 0),this.data=c}else this.data=i}y(Fa,js);function Ua(){$s.call(this),this.status=1}y(Ua,$s);function Jt(i){this.g=i}y(Jt,xa),Jt.prototype.ra=function(){Te(this.g,"a")},Jt.prototype.qa=function(i){Te(this.g,new Fa(i))},Jt.prototype.pa=function(i){Te(this.g,new Ua)},Jt.prototype.oa=function(){Te(this.g,"b")},Nr.prototype.createWebChannel=Nr.prototype.g,Re.prototype.send=Re.prototype.o,Re.prototype.open=Re.prototype.m,Re.prototype.close=Re.prototype.close,pl=function(){return new Nr},fl=function(){return vr()},dl=Ct,Ai={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Ar.NO_ERROR=0,Ar.TIMEOUT=8,Ar.HTTP_ERROR=6,zr=Ar,ta.COMPLETE="complete",hl=ta,Yo.EventType=Rn,Rn.OPEN="a",Rn.CLOSE="b",Rn.ERROR="c",Rn.MESSAGE="d",ge.prototype.listen=ge.prototype.J,$n=Yo,ee.prototype.listenOnce=ee.prototype.K,ee.prototype.getLastError=ee.prototype.Ha,ee.prototype.getLastErrorCode=ee.prototype.ya,ee.prototype.getStatus=ee.prototype.ca,ee.prototype.getResponseJson=ee.prototype.La,ee.prototype.getResponseText=ee.prototype.la,ee.prototype.send=ee.prototype.ea,ee.prototype.setWithCredentials=ee.prototype.Fa,ll=ee}).apply(typeof Lr<"u"?Lr:typeof self<"u"?self:typeof window<"u"?window:{});/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class ye{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ye.UNAUTHENTICATED=new ye(null),ye.GOOGLE_CREDENTIALS=new ye("google-credentials-uid"),ye.FIRST_PARTY=new ye("first-party-uid"),ye.MOCK_USER=new ye("mock-user");/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */let En="12.12.0";function Ig(n){En=n}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 *//**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Bt=new ji("@firebase/firestore");function Xt(){return Bt.logLevel}function k(n,...e){if(Bt.logLevel<=q.DEBUG){const t=e.map(so);Bt.debug(`Firestore (${En}): ${n}`,...t)}}function Je(n,...e){if(Bt.logLevel<=q.ERROR){const t=e.map(so);Bt.error(`Firestore (${En}): ${n}`,...t)}}function qt(n,...e){if(Bt.logLevel<=q.WARN){const t=e.map(so);Bt.warn(`Firestore (${En}): ${n}`,...t)}}function so(n){if(typeof n=="string")return n;try{return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function x(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,ml(n,r,t)}function ml(n,e,t){let r=`FIRESTORE (${En}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw Je(r),new Error(r)}function W(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||ml(e,s,r)}function U(n,e){return n}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class V extends Ze{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class _t{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class gl{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Tg{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(ye.UNAUTHENTICATED))}shutdown(){}}class wg{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class vg{constructor(e){this.t=e,this.currentUser=ye.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){W(this.o===void 0,42304);let r=this.i;const s=h=>this.i!==r?(r=this.i,t(h)):Promise.resolve();let o=new _t;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new _t,e.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const h=o;e.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},u=h=>{k("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(h=>u(h)),setTimeout(()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?u(h):(k("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new _t)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(k("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(W(typeof r.accessToken=="string",31837,{l:r}),new gl(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return W(e===null||typeof e=="string",2055,{h:e}),new ye(e)}}class Ag{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=ye.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class Rg{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new Ag(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(ye.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class _c{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Sg{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ce(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){W(this.o===void 0,3512);const r=o=>{o.error!=null&&k("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.m;return this.m=o.token,k("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable(()=>r(o))};const s=o=>{k("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?s(o):k("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new _c(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(W(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new _c(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function Pg(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class io{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=Pg(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<t&&(r+=e.charAt(s[o]%62))}return r}}function j(n,e){return n<e?-1:n>e?1:0}function Ri(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),o=e.charAt(r);if(s!==o)return hi(s)===hi(o)?j(s,o):hi(s)?1:-1}return j(n.length,e.length)}const Cg=55296,bg=57343;function hi(n){const e=n.charCodeAt(0);return e>=Cg&&e<=bg}function dn(n,e,t){return n.length===e.length&&n.every((r,s)=>t(r,e[s]))}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const yc="__name__";class Ue{constructor(e,t,r){t===void 0?t=0:t>e.length&&x(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&x(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Ue.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ue?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const o=Ue.compareSegments(e.get(s),t.get(s));if(o!==0)return o}return j(e.length,t.length)}static compareSegments(e,t){const r=Ue.isNumericId(e),s=Ue.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?Ue.extractNumericId(e).compare(Ue.extractNumericId(t)):Ri(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return gt.fromString(e.substring(4,e.length-2))}}class Q extends Ue{construct(e,t,r){return new Q(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new V(S.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new Q(t)}static emptyPath(){return new Q([])}}const Vg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class de extends Ue{construct(e,t,r){return new de(e,t,r)}static isValidIdentifier(e){return Vg.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),de.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===yc}static keyField(){return new de([yc])}static fromServerFormat(e){const t=[];let r="",s=0;const o=()=>{if(r.length===0)throw new V(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const u=e[s];if(u==="\\"){if(s+1===e.length)throw new V(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const h=e[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new V(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=h,s+=2}else u==="`"?(a=!a,s++):u!=="."||a?(r+=u,s++):(o(),s++)}if(o(),a)throw new V(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new de(t)}static emptyPath(){return new de([])}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class O{constructor(e){this.path=e}static fromPath(e){return new O(Q.fromString(e))}static fromName(e){return new O(Q.fromString(e).popFirst(5))}static empty(){return new O(Q.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Q.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Q.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new O(new Q(e.slice()))}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function _l(n,e,t){if(!t)throw new V(S.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function kg(n,e,t,r){if(e===!0&&r===!0)throw new V(S.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Ec(n){if(!O.isDocumentKey(n))throw new V(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Ic(n){if(O.isDocumentKey(n))throw new V(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function yl(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Es(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":x(12329,{type:typeof n})}function qe(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new V(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Es(n);throw new V(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 *   
 *     
 *
 *   
 *
 *     
 *
   
 */function oe(n,e){const t={typeString:n};return e&&(t.value=e),t}function pr(n,e){if(!yl(n))throw new V(S.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,o="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(o!==void 0&&a!==o.value){t=`Expected '${r}' field to equal '${o.value}'`;break}}if(t)throw new V(S.INVALID_ARGUMENT,t);return!0}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Tc=-62135596800,wc=1e6;class J{static now(){return J.fromMillis(Date.now())}static fromDate(e){return J.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*wc);return new J(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new V(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new V(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Tc)throw new V(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new V(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/wc}_compareTo(e){return this.seconds===e.seconds?j(this.nanoseconds,e.nanoseconds):j(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:J._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(pr(e,J._jsonSchema))return new J(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Tc;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}J._jsonSchemaVersion="firestore/timestamp/1.0",J._jsonSchema={type:oe("string",J._jsonSchemaVersion),seconds:oe("number"),nanoseconds:oe("number")};/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class F{static fromTimestamp(e){return new F(e)}static min(){return new F(new J(0,0))}static max(){return new F(new J(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 *   
 *    2021 Google   
 *
 *   
 *
 *     
 *
   
 */const tr=-1;function Ng(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=F.fromTimestamp(r===1e9?new J(t+1,0):new J(t,r));return new Et(s,O.empty(),e)}function Dg(n){return new Et(n.readTime,n.key,tr)}class Et{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new Et(F.min(),O.empty(),tr)}static max(){return new Et(F.max(),O.empty(),tr)}}function Og(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=O.comparator(n.documentKey,e.documentKey),t!==0?t:j(n.largestBatchId,e.largestBatchId))}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Lg="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Mg{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */async function In(n){if(n.code!==S.FAILED_PRECONDITION||n.message!==Lg)throw n;k("LocalStore","Unexpectedly lost primary lease")}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&x(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(t,o).next(r,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):P.reject(t)}static resolve(e){return new P((t,r)=>{t(e)})}static reject(e){return new P((t,r)=>{r(e)})}static waitFor(e){return new P((t,r)=>{let s=0,o=0,a=!1;e.forEach(u=>{++s,u.next(()=>{++o,a&&o===s&&t()},h=>r(h))}),a=!0,o===s&&t()})}static or(e){let t=P.resolve(!1);for(const r of e)t=t.next(s=>s?P.resolve(s):r());return t}static forEach(e,t){const r=[];return e.forEach((s,o)=>{r.push(t.call(this,s,o))}),this.waitFor(r)}static mapArray(e,t){return new P((r,s)=>{const o=e.length,a=new Array(o);let u=0;for(let h=0;h<o;h++){const d=h;t(e[d]).next(p=>{a[d]=p,++u,u===o&&r(a)},p=>s(p))}})}static doWhile(e,t){return new P((r,s)=>{const o=()=>{e()===!0?t().next(()=>{o()},s):r()};o()})}}function xg(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Tn(n){return n.name==="IndexedDbTransactionError"}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Is{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>t.writeSequenceNumber(r))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Is.ce=-1;/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const oo=-1;function Ts(n){return n==null}function rs(n){return n===0&&1/n==-1/0}function Fg(n){return typeof n=="number"&&Number.isInteger(n)&&!rs(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const El="";function Ug(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=vc(e)),e=Bg(n.get(t),e);return vc(e)}function Bg(n,e){let t=e;const r=n.length;for(let s=0;s<r;s++){const o=n.charAt(s);switch(o){case"\0":t+="";break;case El:t+="";break;default:t+=o}}return t}function vc(n){return n+El+""}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function Ac(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function zt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Il(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class X{constructor(e,t){this.comparator=e,this.root=t||he.EMPTY}insert(e,t){return new X(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,he.BLACK,null,null))}remove(e){return new X(this.comparator,this.root.remove(e,this.comparator).copy(null,null,he.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Mr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Mr(this.root,e,this.comparator,!1)}getReverseIterator(){return new Mr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Mr(this.root,e,this.comparator,!0)}}class Mr{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?r(e.key,t):1,t&&s&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class he{constructor(e,t,r,s,o){this.key=e,this.value=t,this.color=r??he.RED,this.left=s??he.EMPTY,this.right=o??he.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,o){return new he(e??this.key,t??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const o=r(e,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(e,t,r),null):o===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return he.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return he.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,he.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,he.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw x(43730,{key:this.key,value:this.value});if(this.right.isRed())throw x(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw x(27949);return e+(this.isRed()?0:1)}}he.EMPTY=null,he.RED=!0,he.BLACK=!1;he.EMPTY=new class{constructor(){this.size=0}get key(){throw x(57766)}get value(){throw x(16141)}get color(){throw x(16727)}get left(){throw x(29726)}get right(){throw x(36894)}copy(e,t,r,s,o){return this}insert(e,t,r){return new he(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class ce{constructor(e){this.comparator=e,this.data=new X(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Rc(this.data.getIterator())}getIteratorFrom(e){return new Rc(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof ce)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new ce(this.comparator);return t.data=e,t}}class Rc{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Ne{constructor(e){this.fields=e,e.sort(de.comparator)}static empty(){return new Ne([])}unionWith(e){let t=new ce(de.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new Ne(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return dn(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Tl extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class fe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Tl("Invalid base64 string: "+o):o}}(e);return new fe(t)}static fromUint8Array(e){const t=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(e);return new fe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return j(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}fe.EMPTY_BYTE_STRING=new fe("");const qg=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function It(n){if(W(!!n,39018),typeof n=="string"){let e=0;const t=qg.exec(n);if(W(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ne(n.seconds),nanos:ne(n.nanos)}}function ne(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Tt(n){return typeof n=="string"?fe.fromBase64String(n):fe.fromUint8Array(n)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const wl="server_timestamp",vl="__type__",Al="__previous_value__",Rl="__local_write_time__";function ao(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[vl])==null?void 0:r.stringValue)===wl}function ws(n){const e=n.mapValue.fields[Al];return ao(e)?ws(e):e}function nr(n){const e=It(n.mapValue.fields[Rl].timestampValue);return new J(e.seconds,e.nanos)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class jg{constructor(e,t,r,s,o,a,u,h,d,p,y){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=h,this.useFetchStreams=d,this.isUsingEmulator=p,this.apiKey=y}}const ss="(default)";class rr{constructor(e,t){this.projectId=e,this.database=t||ss}static empty(){return new rr("","")}get isDefaultDatabase(){return this.database===ss}isEqual(e){return e instanceof rr&&e.projectId===this.projectId&&e.database===this.database}}function $g(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new V(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new rr(n.options.projectId,e)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Sl="__type__",Pl="__max__",xr={mapValue:{fields:{__type__:{stringValue:Pl}}}},Cl="__vector__",is="value";function wt(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?ao(n)?4:Hg(n)?9007199254740991:zg(n)?10:11:x(28295,{value:n})}function He(n,e){if(n===e)return!0;const t=wt(n);if(t!==wt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return nr(n).isEqual(nr(e));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=It(s.timestampValue),u=It(o.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,o){return Tt(s.bytesValue).isEqual(Tt(o.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,o){return ne(s.geoPointValue.latitude)===ne(o.geoPointValue.latitude)&&ne(s.geoPointValue.longitude)===ne(o.geoPointValue.longitude)}(n,e);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return ne(s.integerValue)===ne(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=ne(s.doubleValue),u=ne(o.doubleValue);return a===u?rs(a)===rs(u):isNaN(a)&&isNaN(u)}return!1}(n,e);case 9:return dn(n.arrayValue.values||[],e.arrayValue.values||[],He);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},u=o.mapValue.fields||{};if(Ac(a)!==Ac(u))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(u[h]===void 0||!He(a[h],u[h])))return!1;return!0}(n,e);default:return x(52216,{left:n})}}function sr(n,e){return(n.values||[]).find(t=>He(t,e))!==void 0}function fn(n,e){if(n===e)return 0;const t=wt(n),r=wt(e);if(t!==r)return j(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return j(n.booleanValue,e.booleanValue);case 2:return function(o,a){const u=ne(o.integerValue||o.doubleValue),h=ne(a.integerValue||a.doubleValue);return u<h?-1:u>h?1:u===h?0:isNaN(u)?isNaN(h)?0:-1:1}(n,e);case 3:return Sc(n.timestampValue,e.timestampValue);case 4:return Sc(nr(n),nr(e));case 5:return Ri(n.stringValue,e.stringValue);case 6:return function(o,a){const u=Tt(o),h=Tt(a);return u.compareTo(h)}(n.bytesValue,e.bytesValue);case 7:return function(o,a){const u=o.split("/"),h=a.split("/");for(let d=0;d<u.length&&d<h.length;d++){const p=j(u[d],h[d]);if(p!==0)return p}return j(u.length,h.length)}(n.referenceValue,e.referenceValue);case 8:return function(o,a){const u=j(ne(o.latitude),ne(a.latitude));return u!==0?u:j(ne(o.longitude),ne(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Pc(n.arrayValue,e.arrayValue);case 10:return function(o,a){var R,C,N,L;const u=o.fields||{},h=a.fields||{},d=(R=u[is])==null?void 0:R.arrayValue,p=(C=h[is])==null?void 0:C.arrayValue,y=j(((N=d==null?void 0:d.values)==null?void 0:N.length)||0,((L=p==null?void 0:p.values)==null?void 0:L.length)||0);return y!==0?y:Pc(d,p)}(n.mapValue,e.mapValue);case 11:return function(o,a){if(o===xr.mapValue&&a===xr.mapValue)return 0;if(o===xr.mapValue)return 1;if(a===xr.mapValue)return-1;const u=o.fields||{},h=Object.keys(u),d=a.fields||{},p=Object.keys(d);h.sort(),p.sort();for(let y=0;y<h.length&&y<p.length;++y){const R=Ri(h[y],p[y]);if(R!==0)return R;const C=fn(u[h[y]],d[p[y]]);if(C!==0)return C}return j(h.length,p.length)}(n.mapValue,e.mapValue);default:throw x(23264,{he:t})}}function Sc(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return j(n,e);const t=It(n),r=It(e),s=j(t.seconds,r.seconds);return s!==0?s:j(t.nanos,r.nanos)}function Pc(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const o=fn(t[s],r[s]);if(o)return o}return j(t.length,r.length)}function pn(n){return Si(n)}function Si(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=It(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return Tt(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return O.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",s=!0;for(const o of t.values||[])s?s=!1:r+=",",r+=Si(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${Si(t.fields[a])}`;return s+"}"}(n.mapValue):x(61005,{value:n})}function Hr(n){switch(wt(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=ws(n);return e?16+Hr(e):16;case 5:return 2*n.stringValue.length;case 6:return Tt(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((s,o)=>s+Hr(o),0)}(n.arrayValue);case 10:case 11:return function(r){let s=0;return zt(r.fields,(o,a)=>{s+=o.length+Hr(a)}),s}(n.mapValue);default:throw x(13486,{value:n})}}function Cc(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Pi(n){return!!n&&"integerValue"in n}function co(n){return!!n&&"arrayValue"in n}function bc(n){return!!n&&"nullValue"in n}function Vc(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Wr(n){return!!n&&"mapValue"in n}function zg(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[Sl])==null?void 0:r.stringValue)===Cl}function Kn(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return zt(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Kn(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Kn(n.arrayValue.values[t]);return e}return{...n}}function Hg(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===Pl}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class be{constructor(e){this.value=e}static empty(){return new be({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Wr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Kn(t)}setAll(e){let t=de.emptyPath(),r={},s=[];e.forEach((a,u)=>{if(!t.isImmediateParentOf(u)){const h=this.getFieldsMap(t);this.applyChanges(h,r,s),r={},s=[],t=u.popLast()}a?r[u.lastSegment()]=Kn(a):s.push(u.lastSegment())});const o=this.getFieldsMap(t);this.applyChanges(o,r,s)}delete(e){const t=this.field(e.popLast());Wr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return He(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];Wr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){zt(t,(s,o)=>e[s]=o);for(const s of r)delete e[s]}clone(){return new be(Kn(this.value))}}function bl(n){const e=[];return zt(n.fields,(t,r)=>{const s=new de([t]);if(Wr(r)){const o=bl(r.mapValue).fields;if(o.length===0)e.push(s);else for(const a of o)e.push(s.child(a))}else e.push(s)}),new Ne(e)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Ee{constructor(e,t,r,s,o,a,u){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=u}static newInvalidDocument(e){return new Ee(e,0,F.min(),F.min(),F.min(),be.empty(),0)}static newFoundDocument(e,t,r,s){return new Ee(e,1,t,F.min(),r,s,0)}static newNoDocument(e,t){return new Ee(e,2,t,F.min(),F.min(),be.empty(),0)}static newUnknownDocument(e,t){return new Ee(e,3,t,F.min(),F.min(),be.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(F.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=be.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=be.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=F.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ee&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ee(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 *   
   *
 *   
 *
 *     
 *
   
 */class os{constructor(e,t){this.position=e,this.inclusive=t}}function kc(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const o=e[s],a=n.position[s];if(o.field.isKeyField()?r=O.comparator(O.fromName(a.referenceValue),t.key):r=fn(a,t.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function Nc(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!He(n.position[t],e.position[t]))return!1;return!0}/**
 *   
   *
 *   
 *
 *     
 *
   
 */class ir{constructor(e,t="asc"){this.field=e,this.dir=t}}function Wg(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 *   
   *
 *   
 *
 *     
 *
   
 */class Vl{}class ie extends Vl{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Kg(e,t,r):t==="array-contains"?new Jg(e,r):t==="in"?new Xg(e,r):t==="not-in"?new Zg(e,r):t==="array-contains-any"?new e_(e,r):new ie(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new Qg(e,r):new Yg(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(fn(t,this.value)):t!==null&&wt(this.value)===wt(t)&&this.matchesComparison(fn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return x(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Me extends Vl{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new Me(e,t)}matches(e){return kl(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function kl(n){return n.op==="and"}function Nl(n){return Gg(n)&&kl(n)}function Gg(n){for(const e of n.filters)if(e instanceof Me)return!1;return!0}function Ci(n){if(n instanceof ie)return n.field.canonicalString()+n.op.toString()+pn(n.value);if(Nl(n))return n.filters.map(e=>Ci(e)).join(",");{const e=n.filters.map(t=>Ci(t)).join(",");return`${n.op}(${e})`}}function Dl(n,e){return n instanceof ie?function(r,s){return s instanceof ie&&r.op===s.op&&r.field.isEqual(s.field)&&He(r.value,s.value)}(n,e):n instanceof Me?function(r,s){return s instanceof Me&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,a,u)=>o&&Dl(a,s.filters[u]),!0):!1}(n,e):void x(19439)}function Ol(n){return n instanceof ie?function(t){return`${t.field.canonicalString()} ${t.op} ${pn(t.value)}`}(n):n instanceof Me?function(t){return t.op.toString()+" {"+t.getFilters().map(Ol).join(" ,")+"}"}(n):"Filter"}class Kg extends ie{constructor(e,t,r){super(e,t,r),this.key=O.fromName(r.referenceValue)}matches(e){const t=O.comparator(e.key,this.key);return this.matchesComparison(t)}}class Qg extends ie{constructor(e,t){super(e,"in",t),this.keys=Ll("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Yg extends ie{constructor(e,t){super(e,"not-in",t),this.keys=Ll("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Ll(n,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map(r=>O.fromName(r.referenceValue))}class Jg extends ie{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return co(t)&&sr(t.arrayValue,this.value)}}class Xg extends ie{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&sr(this.value.arrayValue,t)}}class Zg extends ie{constructor(e,t){super(e,"not-in",t)}matches(e){if(sr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!sr(this.value.arrayValue,t)}}class e_ extends ie{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!co(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>sr(this.value.arrayValue,r))}}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class t_{constructor(e,t=null,r=[],s=[],o=null,a=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=u,this.Te=null}}function Dc(n,e=null,t=[],r=[],s=null,o=null,a=null){return new t_(n,e,t,r,s,o,a)}function uo(n){const e=U(n);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>Ci(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),Ts(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>pn(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>pn(r)).join(",")),e.Te=t}return e.Te}function lo(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!Wg(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Dl(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Nc(n.startAt,e.startAt)&&Nc(n.endAt,e.endAt)}function bi(n){return O.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class wn{constructor(e,t=null,r=[],s=[],o=null,a="F",u=null,h=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=u,this.endAt=h,this.Ee=null,this.Ie=null,this.Re=null,this.startAt,this.endAt}}function n_(n,e,t,r,s,o,a,u){return new wn(n,e,t,r,s,o,a,u)}function vs(n){return new wn(n)}function Oc(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function r_(n){return O.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function Ml(n){return n.collectionGroup!==null}function Qn(n){const e=U(n);if(e.Ee===null){e.Ee=[];const t=new Set;for(const o of e.explicitOrderBy)e.Ee.push(o),t.add(o.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new ce(de.comparator);return a.filters.forEach(h=>{h.getFlattenedFilters().forEach(d=>{d.isInequality()&&(u=u.add(d.field))})}),u})(e).forEach(o=>{t.has(o.canonicalString())||o.isKeyField()||e.Ee.push(new ir(o,r))}),t.has(de.keyField().canonicalString())||e.Ee.push(new ir(de.keyField(),r))}return e.Ee}function je(n){const e=U(n);return e.Ie||(e.Ie=s_(e,Qn(n))),e.Ie}function s_(n,e){if(n.limitType==="F")return Dc(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new ir(s.field,o)});const t=n.endAt?new os(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new os(n.startAt.position,n.startAt.inclusive):null;return Dc(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Vi(n,e){const t=n.filters.concat([e]);return new wn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function i_(n,e){const t=n.explicitOrderBy.concat([e]);return new wn(n.path,n.collectionGroup,t,n.filters.slice(),n.limit,n.limitType,n.startAt,n.endAt)}function ki(n,e,t){return new wn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function As(n,e){return lo(je(n),je(e))&&n.limitType===e.limitType}function xl(n){return`${uo(je(n))}|lt:${n.limitType}`}function Zt(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(s=>Ol(s)).join(", ")}]`),Ts(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(s=>pn(s)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(s=>pn(s)).join(",")),`Target(${r})`}(je(n))}; limitType=${n.limitType})`}function Rs(n,e){return e.isFoundDocument()&&function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):O.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(n,e)&&function(r,s){for(const o of Qn(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(n,e)&&function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0}(n,e)&&function(r,s){return!(r.startAt&&!function(a,u,h){const d=kc(a,u,h);return a.inclusive?d<=0:d<0}(r.startAt,Qn(r),s)||r.endAt&&!function(a,u,h){const d=kc(a,u,h);return a.inclusive?d>=0:d>0}(r.endAt,Qn(r),s))}(n,e)}function o_(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Fl(n){return(e,t)=>{let r=!1;for(const s of Qn(n)){const o=a_(s,e,t);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function a_(n,e,t){const r=n.field.isKeyField()?O.comparator(e.key,t.key):function(o,a,u){const h=a.data.field(o),d=u.data.field(o);return h!==null&&d!==null?fn(h,d):x(42886)}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return x(19790,{direction:n.dir})}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Ht{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return void(s[o]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){zt(this.inner,(t,r)=>{for(const[s,o]of r)e(s,o)})}isEmpty(){return Il(this.inner)}size(){return this.innerSize}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const c_=new X(O.comparator);function Xe(){return c_}const Ul=new X(O.comparator);function zn(...n){let e=Ul;for(const t of n)e=e.insert(t.key,t);return e}function Bl(n){let e=Ul;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function Lt(){return Yn()}function ql(){return Yn()}function Yn(){return new Ht(n=>n.toString(),(n,e)=>n.isEqual(e))}const u_=new X(O.comparator),l_=new ce(O.comparator);function $(...n){let e=l_;for(const t of n)e=e.add(t);return e}const h_=new ce(j);function d_(){return h_}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function ho(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:rs(e)?"-0":e}}function jl(n){return{integerValue:""+n}}function f_(n,e){return Fg(e)?jl(e):ho(n,e)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Ss{constructor(){this._=void 0}}function p_(n,e,t){return n instanceof as?function(s,o){const a={fields:{[vl]:{stringValue:wl},[Rl]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&ao(o)&&(o=ws(o)),o&&(a.fields[Al]=o),{mapValue:a}}(t,e):n instanceof or?zl(n,e):n instanceof ar?Hl(n,e):function(s,o){const a=$l(s,o),u=Lc(a)+Lc(s.Ae);return Pi(a)&&Pi(s.Ae)?jl(u):ho(s.serializer,u)}(n,e)}function m_(n,e,t){return n instanceof or?zl(n,e):n instanceof ar?Hl(n,e):t}function $l(n,e){return n instanceof cs?function(r){return Pi(r)||function(o){return!!o&&"doubleValue"in o}(r)}(e)?e:{integerValue:0}:null}class as extends Ss{}class or extends Ss{constructor(e){super(),this.elements=e}}function zl(n,e){const t=Wl(e);for(const r of n.elements)t.some(s=>He(s,r))||t.push(r);return{arrayValue:{values:t}}}class ar extends Ss{constructor(e){super(),this.elements=e}}function Hl(n,e){let t=Wl(e);for(const r of n.elements)t=t.filter(s=>!He(s,r));return{arrayValue:{values:t}}}class cs extends Ss{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function Lc(n){return ne(n.integerValue||n.doubleValue)}function Wl(n){return co(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function g_(n,e){return n.field.isEqual(e.field)&&function(r,s){return r instanceof or&&s instanceof or||r instanceof ar&&s instanceof ar?dn(r.elements,s.elements,He):r instanceof cs&&s instanceof cs?He(r.Ae,s.Ae):r instanceof as&&s instanceof as}(n.transform,e.transform)}class __{constructor(e,t){this.version=e,this.transformResults=t}}class Oe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Oe}static exists(e){return new Oe(void 0,e)}static updateTime(e){return new Oe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Gr(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Ps{}function Gl(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new fo(n.key,Oe.none()):new mr(n.key,n.data,Oe.none());{const t=n.data,r=be.empty();let s=new ce(de.comparator);for(let o of e.fields)if(!s.has(o)){let a=t.field(o);a===null&&o.length>1&&(o=o.popLast(),a=t.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new Wt(n.key,r,new Ne(s.toArray()),Oe.none())}}function y_(n,e,t){n instanceof mr?function(s,o,a){const u=s.value.clone(),h=xc(s.fieldTransforms,o,a.transformResults);u.setAll(h),o.convertToFoundDocument(a.version,u).setHasCommittedMutations()}(n,e,t):n instanceof Wt?function(s,o,a){if(!Gr(s.precondition,o))return void o.convertToUnknownDocument(a.version);const u=xc(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(Kl(s)),h.setAll(u),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()}(n,e,t):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function Jn(n,e,t,r){return n instanceof mr?function(o,a,u,h){if(!Gr(o.precondition,a))return u;const d=o.value.clone(),p=Fc(o.fieldTransforms,h,a);return d.setAll(p),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,r):n instanceof Wt?function(o,a,u,h){if(!Gr(o.precondition,a))return u;const d=Fc(o.fieldTransforms,h,a),p=a.data;return p.setAll(Kl(o)),p.setAll(d),a.convertToFoundDocument(a.version,p).setHasLocalMutations(),u===null?null:u.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(y=>y.field))}(n,e,t,r):function(o,a,u){return Gr(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u}(n,e,t)}function E_(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),o=$l(r.transform,s||null);o!=null&&(t===null&&(t=be.empty()),t.set(r.field,o))}return t||null}function Mc(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&dn(r,s,(o,a)=>g_(o,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class mr extends Ps{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Wt extends Ps{constructor(e,t,r,s,o=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function Kl(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function xc(n,e,t){const r=new Map;W(n.length===t.length,32656,{Ve:t.length,de:n.length});for(let s=0;s<t.length;s++){const o=n[s],a=o.transform,u=e.data.field(o.field);r.set(o.field,m_(a,u,t[s]))}return r}function Fc(n,e,t){const r=new Map;for(const s of n){const o=s.transform,a=t.data.field(s.field);r.set(s.field,p_(o,a,e))}return r}class fo extends Ps{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class I_ extends Ps{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class T_{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(e.key)&&y_(o,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Jn(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Jn(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=ql();return this.mutations.forEach(s=>{const o=e.get(s.key),a=o.overlayedDocument;let u=this.applyToLocalView(a,o.mutatedFields);u=t.has(s.key)?null:u;const h=Gl(a,u);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(F.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),$())}isEqual(e){return this.batchId===e.batchId&&dn(this.mutations,e.mutations,(t,r)=>Mc(t,r))&&dn(this.baseMutations,e.baseMutations,(t,r)=>Mc(t,r))}}class po{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){W(e.mutations.length===r.length,58842,{me:e.mutations.length,fe:r.length});let s=function(){return u_}();const o=e.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new po(e,t,r,s)}}/**
 *   
   *
 *   
 *
 *     
 *
   
 */class w_{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class v_{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */var se,z;function A_(n){switch(n){case S.OK:return x(64938);case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0;default:return x(15467,{code:n})}}function Ql(n){if(n===void 0)return Je("GRPC error has no .code"),S.UNKNOWN;switch(n){case se.OK:return S.OK;case se.CANCELLED:return S.CANCELLED;case se.UNKNOWN:return S.UNKNOWN;case se.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case se.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case se.INTERNAL:return S.INTERNAL;case se.UNAVAILABLE:return S.UNAVAILABLE;case se.UNAUTHENTICATED:return S.UNAUTHENTICATED;case se.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case se.NOT_FOUND:return S.NOT_FOUND;case se.ALREADY_EXISTS:return S.ALREADY_EXISTS;case se.PERMISSION_DENIED:return S.PERMISSION_DENIED;case se.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case se.ABORTED:return S.ABORTED;case se.OUT_OF_RANGE:return S.OUT_OF_RANGE;case se.UNIMPLEMENTED:return S.UNIMPLEMENTED;case se.DATA_LOSS:return S.DATA_LOSS;default:return x(39323,{code:n})}}(z=se||(se={}))[z.OK=0]="OK",z[z.CANCELLED=1]="CANCELLED",z[z.UNKNOWN=2]="UNKNOWN",z[z.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",z[z.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",z[z.NOT_FOUND=5]="NOT_FOUND",z[z.ALREADY_EXISTS=6]="ALREADY_EXISTS",z[z.PERMISSION_DENIED=7]="PERMISSION_DENIED",z[z.UNAUTHENTICATED=16]="UNAUTHENTICATED",z[z.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",z[z.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",z[z.ABORTED=10]="ABORTED",z[z.OUT_OF_RANGE=11]="OUT_OF_RANGE",z[z.UNIMPLEMENTED=12]="UNIMPLEMENTED",z[z.INTERNAL=13]="INTERNAL",z[z.UNAVAILABLE=14]="UNAVAILABLE",z[z.DATA_LOSS=15]="DATA_LOSS";/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function R_(){return new TextEncoder}/**
 *   
   *
 *   
 *
 *     
 *
   
 */const S_=new gt([4294967295,4294967295],0);function Uc(n){const e=R_().encode(n),t=new ul;return t.update(e),new Uint8Array(t.digest())}function Bc(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),o=e.getUint32(12,!0);return[new gt([t,r],0),new gt([s,o],0)]}class mo{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Hn(`Invalid padding: ${t}`);if(r<0)throw new Hn(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Hn(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Hn(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=gt.fromNumber(this.ge)}ye(e,t,r){let s=e.add(t.multiply(gt.fromNumber(r)));return s.compare(S_)===1&&(s=new gt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=Uc(e),[r,s]=Bc(t);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);if(!this.we(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,o=new Uint8Array(Math.ceil(e/8)),a=new mo(o,s,t);return r.forEach(u=>a.insert(u)),a}insert(e){if(this.ge===0)return;const t=Uc(e),[r,s]=Bc(t);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);this.Se(a)}}Se(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Hn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Cs{constructor(e,t,r,s,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,gr.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Cs(F.min(),s,new X(j),Xe(),$())}}class gr{constructor(e,t,r,s,o){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new gr(r,t,$(),$(),$())}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Kr{constructor(e,t,r,s){this.be=e,this.removedTargetIds=t,this.key=r,this.De=s}}class Yl{constructor(e,t){this.targetId=e,this.Ce=t}}class Jl{constructor(e,t,r=fe.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class qc{constructor(){this.ve=0,this.Fe=jc(),this.Me=fe.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=$(),t=$(),r=$();return this.Fe.forEach((s,o)=>{switch(o){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:x(38017,{changeType:o})}}),new gr(this.Me,this.xe,e,t,r)}qe(){this.Oe=!1,this.Fe=jc()}Ke(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,W(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class P_{constructor(e){this.Ge=e,this.ze=new Map,this.je=Xe(),this.Je=Fr(),this.He=Fr(),this.Ze=new X(j)}Xe(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,t=>{const r=this.nt(t);switch(e.state){case 0:this.rt(t)&&r.Le(e.resumeToken);break;case 1:r.We(),r.Ne||r.qe(),r.Le(e.resumeToken);break;case 2:r.We(),r.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(r.Qe(),r.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),r.Le(e.resumeToken));break;default:x(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach((r,s)=>{this.rt(s)&&t(s)})}st(e){const t=e.targetId,r=e.Ce.count,s=this.ot(t);if(s){const o=s.target;if(bi(o))if(r===0){const a=new O(o.path);this.et(t,a,Ee.newNoDocument(a,F.min()))}else W(r===1,20013,{expectedCount:r});else{const a=this._t(t);if(a!==r){const u=this.ut(e),h=u?this.ct(u,e,a):1;if(h!==0){this.it(t);const d=h===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,d)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:o=0}=t;let a,u;try{a=Tt(r).toUint8Array()}catch(h){if(h instanceof Tl)return qt("Decoding the base64 bloom filter in existence filter failed ("+h.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw h}try{u=new mo(a,s,o)}catch(h){return qt(h instanceof Hn?"BloomFilter error: ":"Applying bloom filter failed: ",h),null}return u.ge===0?null:u}ct(e,t,r){return t.Ce.count===r-this.Pt(e,t.targetId)?0:2}Pt(e,t){const r=this.Ge.getRemoteKeysForTarget(t);let s=0;return r.forEach(o=>{const a=this.Ge.ht(),u=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;e.mightContain(u)||(this.et(t,o,null),s++)}),s}Tt(e){const t=new Map;this.ze.forEach((o,a)=>{const u=this.ot(a);if(u){if(o.current&&bi(u.target)){const h=new O(u.target.path);this.Et(h).has(a)||this.It(a,h)||this.et(a,h,Ee.newNoDocument(h,e))}o.Be&&(t.set(a,o.ke()),o.qe())}});let r=$();this.He.forEach((o,a)=>{let u=!0;a.forEachWhile(h=>{const d=this.ot(h);return!d||d.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)}),u&&(r=r.add(o))}),this.je.forEach((o,a)=>a.setReadTime(e));const s=new Cs(e,t,this.Ze,this.je,r);return this.je=Xe(),this.Je=Fr(),this.He=Fr(),this.Ze=new X(j),s}Ye(e,t){if(!this.rt(e))return;const r=this.It(e,t.key)?2:0;this.nt(e).Ke(t.key,r),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.Et(t.key).add(e)),this.He=this.He.insert(t.key,this.Rt(t.key).add(e))}et(e,t,r){if(!this.rt(e))return;const s=this.nt(e);this.It(e,t)?s.Ke(t,1):s.Ue(t),this.He=this.He.insert(t,this.Rt(t).delete(e)),this.He=this.He.insert(t,this.Rt(t).add(e)),r&&(this.je=this.je.insert(t,r))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let t=this.ze.get(e);return t||(t=new qc,this.ze.set(e,t)),t}Rt(e){let t=this.He.get(e);return t||(t=new ce(j),this.He=this.He.insert(e,t)),t}Et(e){let t=this.Je.get(e);return t||(t=new ce(j),this.Je=this.Je.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||k("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new qc),this.Ge.getRemoteKeysForTarget(e).forEach(t=>{this.et(e,t,null)})}It(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Fr(){return new X(O.comparator)}function jc(){return new X(O.comparator)}const C_={asc:"ASCENDING",desc:"DESCENDING"},b_={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},V_={and:"AND",or:"OR"};class k_{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Ni(n,e){return n.useProto3Json||Ts(e)?e:{value:e}}function us(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Xl(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function N_(n,e){return us(n,e.toTimestamp())}function $e(n){return W(!!n,49232),F.fromTimestamp(function(t){const r=It(t);return new J(r.seconds,r.nanos)}(n))}function go(n,e){return Di(n,e).canonicalString()}function Di(n,e){const t=function(s){return new Q(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function Zl(n){const e=Q.fromString(n);return W(sh(e),10190,{key:e.toString()}),e}function Oi(n,e){return go(n.databaseId,e.path)}function di(n,e){const t=Zl(e);if(t.get(1)!==n.databaseId.projectId)throw new V(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new V(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new O(th(t))}function eh(n,e){return go(n.databaseId,e)}function D_(n){const e=Zl(n);return e.length===4?Q.emptyPath():th(e)}function Li(n){return new Q(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function th(n){return W(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function $c(n,e,t){return{name:Oi(n,e),fields:t.value.mapValue.fields}}function O_(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:x(39313,{state:d})}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],o=function(d,p){return d.useProto3Json?(W(p===void 0||typeof p=="string",58123),fe.fromBase64String(p||"")):(W(p===void 0||p instanceof Buffer||p instanceof Uint8Array,16193),fe.fromUint8Array(p||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,u=a&&function(d){const p=d.code===void 0?S.UNKNOWN:Ql(d.code);return new V(p,d.message||"")}(a);t=new Jl(r,s,o,u||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=di(n,r.document.name),o=$e(r.document.updateTime),a=r.document.createTime?$e(r.document.createTime):F.min(),u=new be({mapValue:{fields:r.document.fields}}),h=Ee.newFoundDocument(s,o,a,u),d=r.targetIds||[],p=r.removedTargetIds||[];t=new Kr(d,p,h.key,h)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=di(n,r.document),o=r.readTime?$e(r.readTime):F.min(),a=Ee.newNoDocument(s,o),u=r.removedTargetIds||[];t=new Kr([],u,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=di(n,r.document),o=r.removedTargetIds||[];t=new Kr([],o,s,null)}else{if(!("filter"in e))return x(11601,{Vt:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:o}=r,a=new v_(s,o),u=r.targetId;t=new Yl(u,a)}}return t}function L_(n,e){let t;if(e instanceof mr)t={update:$c(n,e.key,e.value)};else if(e instanceof fo)t={delete:Oi(n,e.key)};else if(e instanceof Wt)t={update:$c(n,e.key,e.data),updateMask:z_(e.fieldMask)};else{if(!(e instanceof I_))return x(16599,{dt:e.type});t={verify:Oi(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(o,a){const u=a.transform;if(u instanceof as)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof or)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof ar)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof cs)return{fieldPath:a.field.canonicalString(),increment:u.Ae};throw x(20930,{transform:a.transform})}(0,r))),e.precondition.isNone||(t.currentDocument=function(s,o){return o.updateTime!==void 0?{updateTime:N_(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:x(27497)}(n,e.precondition)),t}function M_(n,e){return n&&n.length>0?(W(e!==void 0,14353),n.map(t=>function(s,o){let a=s.updateTime?$e(s.updateTime):$e(o);return a.isEqual(F.min())&&(a=$e(o)),new __(a,s.transformResults||[])}(t,e))):[]}function x_(n,e){return{documents:[eh(n,e.path)]}}function F_(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=eh(n,s);const o=function(d){if(d.length!==0)return rh(Me.create(d,"and"))}(e.filters);o&&(t.structuredQuery.where=o);const a=function(d){if(d.length!==0)return d.map(p=>function(R){return{field:en(R.field),direction:q_(R.dir)}}(p))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const u=Ni(n,e.limit);return u!==null&&(t.structuredQuery.limit=u),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{ft:t,parent:s}}function U_(n){let e=D_(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){W(r===1,65062);const p=t.from[0];p.allDescendants?s=p.collectionId:e=e.child(p.collectionId)}let o=[];t.where&&(o=function(y){const R=nh(y);return R instanceof Me&&Nl(R)?R.getFilters():[R]}(t.where));let a=[];t.orderBy&&(a=function(y){return y.map(R=>function(N){return new ir(tn(N.field),function(D){switch(D){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(N.direction))}(R))}(t.orderBy));let u=null;t.limit&&(u=function(y){let R;return R=typeof y=="object"?y.value:y,Ts(R)?null:R}(t.limit));let h=null;t.startAt&&(h=function(y){const R=!!y.before,C=y.values||[];return new os(C,R)}(t.startAt));let d=null;return t.endAt&&(d=function(y){const R=!y.before,C=y.values||[];return new os(C,R)}(t.endAt)),n_(e,s,a,o,u,"F",h,d)}function B_(n,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return x(28987,{purpose:s})}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function nh(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=tn(t.unaryFilter.field);return ie.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=tn(t.unaryFilter.field);return ie.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=tn(t.unaryFilter.field);return ie.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=tn(t.unaryFilter.field);return ie.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return x(61313);default:return x(60726)}}(n):n.fieldFilter!==void 0?function(t){return ie.create(tn(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return x(58110);default:return x(50506)}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return Me.create(t.compositeFilter.filters.map(r=>nh(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return x(1026)}}(t.compositeFilter.op))}(n):x(30097,{filter:n})}function q_(n){return C_[n]}function j_(n){return b_[n]}function $_(n){return V_[n]}function en(n){return{fieldPath:n.canonicalString()}}function tn(n){return de.fromServerFormat(n.fieldPath)}function rh(n){return n instanceof ie?function(t){if(t.op==="=="){if(Vc(t.value))return{unaryFilter:{field:en(t.field),op:"IS_NAN"}};if(bc(t.value))return{unaryFilter:{field:en(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Vc(t.value))return{unaryFilter:{field:en(t.field),op:"IS_NOT_NAN"}};if(bc(t.value))return{unaryFilter:{field:en(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:en(t.field),op:j_(t.op),value:t.value}}}(n):n instanceof Me?function(t){const r=t.getFilters().map(s=>rh(s));return r.length===1?r[0]:{compositeFilter:{op:$_(t.op),filters:r}}}(n):x(54877,{filter:n})}function z_(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function sh(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function ih(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class ht{constructor(e,t,r,s,o=F.min(),a=F.min(),u=fe.EMPTY_BYTE_STRING,h=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=u,this.expectedCount=h}withSequenceNumber(e){return new ht(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new ht(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new ht(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new ht(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class H_{constructor(e){this.yt=e}}function W_(n){const e=U_({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?ki(e,e.limit,"L"):e}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class G_{constructor(){this.bn=new K_}addToCollectionParentIndex(e,t){return this.bn.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this.bn.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(Et.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(Et.min())}updateCollectionGroup(e,t,r){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class K_{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new ce(Q.comparator),o=!s.has(r);return this.index[t]=s.add(r),o}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new ce(Q.comparator)).toArray()}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const zc={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},oh=41943040;class Ae{static withCacheSize(e){return new Ae(e,Ae.DEFAULT_COLLECTION_PERCENTILE,Ae.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */Ae.DEFAULT_COLLECTION_PERCENTILE=10,Ae.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ae.DEFAULT=new Ae(oh,Ae.DEFAULT_COLLECTION_PERCENTILE,Ae.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ae.DISABLED=new Ae(-1,0,0);/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class mn{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new mn(0)}static ar(){return new mn(-1)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Hc="LruGarbageCollector",Q_=1048576;function Wc([n,e],[t,r]){const s=j(n,t);return s===0?j(e,r):s}class Y_{constructor(e){this.Pr=e,this.buffer=new ce(Wc),this.Tr=0}Er(){return++this.Tr}Ir(e){const t=[e,this.Er()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();Wc(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class J_{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Ar(e){k(Hc,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Tn(t)?k(Hc,"Ignoring IndexedDB error during garbage collection: ",t):await In(t)}await this.Ar(3e5)})}}class X_{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.dr(e).next(r=>Math.floor(t/100*r))}nthSequenceNumber(e,t){if(t===0)return P.resolve(Is.ce);const r=new Y_(t);return this.Vr.forEachTarget(e,s=>r.Ir(s.sequenceNumber)).next(()=>this.Vr.mr(e,s=>r.Ir(s))).next(()=>r.maxValue)}removeTargets(e,t,r){return this.Vr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(k("LruGarbageCollector","Garbage collection skipped; disabled"),P.resolve(zc)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(k("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),zc):this.gr(e,t))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,t){let r,s,o,a,u,h,d;const p=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(y=>(y>this.params.maximumSequenceNumbersToCollect?(k("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${y}`),s=this.params.maximumSequenceNumbersToCollect):s=y,a=Date.now(),this.nthSequenceNumber(e,s))).next(y=>(r=y,u=Date.now(),this.removeTargets(e,r,t))).next(y=>(o=y,h=Date.now(),this.removeOrphanedDocuments(e,r))).next(y=>(d=Date.now(),Xt()<=q.DEBUG&&k("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-p}ms
	Determined least recently used ${s} in `+(u-a)+`ms
	Removed ${o} targets in `+(h-u)+`ms
	Removed ${y} documents in `+(d-h)+`ms
Total Duration: ${d-p}ms`),P.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:o,documentsRemoved:y})))}}function Z_(n,e){return new X_(n,e)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class ey{constructor(){this.changes=new Ht(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ee.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?P.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 *//**
 *   
   *
 *   
 *
 *     
 *
   
 */class ty{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class ny{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(r!==null&&Jn(r.mutation,s,Ne.empty(),J.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,$()).next(()=>r))}getLocalViewOfDocuments(e,t,r=$()){const s=Lt();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,r).next(o=>{let a=zn();return o.forEach((u,h)=>{a=a.insert(u,h.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=Lt();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,$()))}populateOverlays(e,t,r){const s=[];return r.forEach(o=>{t.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(e,s).next(o=>{o.forEach((a,u)=>{t.set(a,u)})})}computeViews(e,t,r,s){let o=Xe();const a=Yn(),u=function(){return Yn()}();return t.forEach((h,d)=>{const p=r.get(d.key);s.has(d.key)&&(p===void 0||p.mutation instanceof Wt)?o=o.insert(d.key,d):p!==void 0?(a.set(d.key,p.mutation.getFieldMask()),Jn(p.mutation,d,p.mutation.getFieldMask(),J.now())):a.set(d.key,Ne.empty())}),this.recalculateAndSaveOverlays(e,o).next(h=>(h.forEach((d,p)=>a.set(d,p)),t.forEach((d,p)=>u.set(d,new ty(p,a.get(d)??null))),u))}recalculateAndSaveOverlays(e,t){const r=Yn();let s=new X((a,u)=>a-u),o=$();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const u of a)u.keys().forEach(h=>{const d=t.get(h);if(d===null)return;let p=r.get(h)||Ne.empty();p=u.applyToLocalView(d,p),r.set(h,p);const y=(s.get(u.batchId)||$()).add(h);s=s.insert(u.batchId,y)})}).next(()=>{const a=[],u=s.getReverseIterator();for(;u.hasNext();){const h=u.getNext(),d=h.key,p=h.value,y=ql();p.forEach(R=>{if(!o.has(R)){const C=Gl(t.get(R),r.get(R));C!==null&&y.set(R,C),o=o.add(R)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,y))}return P.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,s){return r_(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Ml(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-o.size):P.resolve(Lt());let u=tr,h=o;return a.next(d=>P.forEach(d,(p,y)=>(u<y.largestBatchId&&(u=y.largestBatchId),o.get(p)?P.resolve():this.remoteDocumentCache.getEntry(e,p).next(R=>{h=h.insert(p,R)}))).next(()=>this.populateOverlays(e,d,o)).next(()=>this.computeViews(e,h,d,$())).next(p=>({batchId:u,changes:Bl(p)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new O(t)).next(r=>{let s=zn();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const o=t.collectionGroup;let a=zn();return this.indexManager.getCollectionParents(e,o).next(u=>P.forEach(u,h=>{const d=function(y,R){return new wn(R,null,y.explicitOrderBy.slice(),y.filters.slice(),y.limit,y.limitType,y.startAt,y.endAt)}(t,h.child(o));return this.getDocumentsMatchingCollectionQuery(e,d,r,s).next(p=>{p.forEach((y,R)=>{a=a.insert(y,R)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,o,s))).next(a=>{o.forEach((h,d)=>{const p=d.getKey();a.get(p)===null&&(a=a.insert(p,Ee.newInvalidDocument(p)))});let u=zn();return a.forEach((h,d)=>{const p=o.get(h);p!==void 0&&Jn(p.mutation,d,Ne.empty(),J.now()),Rs(t,d)&&(u=u.insert(h,d))}),u})}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class ry{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,t){return P.resolve(this.Nr.get(t))}saveBundleMetadata(e,t){return this.Nr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:$e(s.createTime)}}(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.Br.get(t))}saveNamedQuery(e,t){return this.Br.set(t.name,function(s){return{name:s.name,query:W_(s.bundledQuery),readTime:$e(s.readTime)}}(t)),P.resolve()}}/**
 *   
   *
 *   
 *
 *     
 *
   
 */class sy{constructor(){this.overlays=new X(O.comparator),this.Lr=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const r=Lt();return P.forEach(t,s=>this.getOverlay(e,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((s,o)=>{this.St(e,t,o)}),P.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Lr.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.Lr.delete(r)),P.resolve()}getOverlaysForCollection(e,t,r){const s=Lt(),o=t.length+1,a=new O(t.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const h=u.getNext().value,d=h.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return P.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let o=new X((d,p)=>d-p);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let p=o.get(d.largestBatchId);p===null&&(p=Lt(),o=o.insert(d.largestBatchId,p)),p.set(d.getKey(),d)}}const u=Lt(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((d,p)=>u.set(d,p)),!(u.size()>=s)););return P.resolve(u)}St(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Lr.get(s.largestBatchId).delete(r.key);this.Lr.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new w_(t,r));let o=this.Lr.get(t);o===void 0&&(o=$(),this.Lr.set(t,o)),this.Lr.set(t,o.add(r.key))}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class iy{constructor(){this.sessionToken=fe.EMPTY_BYTE_STRING}getSessionToken(e){return P.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,P.resolve()}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class _o{constructor(){this.kr=new ce(le.qr),this.Kr=new ce(le.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,t){const r=new le(e,t);this.kr=this.kr.add(r),this.Kr=this.Kr.add(r)}$r(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Wr(new le(e,t))}Qr(e,t){e.forEach(r=>this.removeReference(r,t))}Gr(e){const t=new O(new Q([])),r=new le(t,e),s=new le(t,e+1),o=[];return this.Kr.forEachInRange([r,s],a=>{this.Wr(a),o.push(a.key)}),o}zr(){this.kr.forEach(e=>this.Wr(e))}Wr(e){this.kr=this.kr.delete(e),this.Kr=this.Kr.delete(e)}jr(e){const t=new O(new Q([])),r=new le(t,e),s=new le(t,e+1);let o=$();return this.Kr.forEachInRange([r,s],a=>{o=o.add(a.key)}),o}containsKey(e){const t=new le(e,0),r=this.kr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class le{constructor(e,t){this.key=e,this.Jr=t}static qr(e,t){return O.comparator(e.key,t.key)||j(e.Jr,t.Jr)}static Ur(e,t){return j(e.Jr,t.Jr)||O.comparator(e.key,t.key)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class oy{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Yn=1,this.Hr=new ce(le.qr)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const o=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new T_(o,t,r,s);this.mutationQueue.push(a);for(const u of s)this.Hr=this.Hr.add(new le(u.key,o)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return P.resolve(a)}lookupMutationBatch(e,t){return P.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.Xr(r),o=s<0?0:s;return P.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?oo:this.Yn-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new le(t,0),s=new le(t,Number.POSITIVE_INFINITY),o=[];return this.Hr.forEachInRange([r,s],a=>{const u=this.Zr(a.Jr);o.push(u)}),P.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new ce(j);return t.forEach(s=>{const o=new le(s,0),a=new le(s,Number.POSITIVE_INFINITY);this.Hr.forEachInRange([o,a],u=>{r=r.add(u.Jr)})}),P.resolve(this.Yr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let o=r;O.isDocumentKey(o)||(o=o.child(""));const a=new le(new O(o),0);let u=new ce(j);return this.Hr.forEachWhile(h=>{const d=h.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(u=u.add(h.Jr)),!0)},a),P.resolve(this.Yr(u))}Yr(e){const t=[];return e.forEach(r=>{const s=this.Zr(r);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){W(this.ei(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Hr;return P.forEach(t.mutations,s=>{const o=new le(s.key,t.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.Hr=r})}nr(e){}containsKey(e,t){const r=new le(t,0),s=this.Hr.firstAfterOrEqual(r);return P.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}ei(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class ay{constructor(e){this.ti=e,this.docs=function(){return new X(O.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),o=s?s.size:0,a=this.ti(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return P.resolve(r?r.document.mutableCopy():Ee.newInvalidDocument(t))}getEntries(e,t){let r=Xe();return t.forEach(s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():Ee.newInvalidDocument(s))}),P.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let o=Xe();const a=t.path,u=new O(a.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(u);for(;h.hasNext();){const{key:d,value:{document:p}}=h.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||Og(Dg(p),r)<=0||(s.has(p.key)||Rs(t,p))&&(o=o.insert(p.key,p.mutableCopy()))}return P.resolve(o)}getAllFromCollectionGroup(e,t,r,s){x(9500)}ni(e,t){return P.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new cy(this)}getSize(e){return P.resolve(this.size)}}class cy extends ey{constructor(e){super(),this.Mr=e}applyChanges(e){const t=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?t.push(this.Mr.addEntry(e,s)):this.Mr.removeEntry(r)}),P.waitFor(t)}getFromCache(e,t){return this.Mr.getEntry(e,t)}getAllFromCache(e,t){return this.Mr.getEntries(e,t)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class uy{constructor(e){this.persistence=e,this.ri=new Ht(t=>uo(t),lo),this.lastRemoteSnapshotVersion=F.min(),this.highestTargetId=0,this.ii=0,this.si=new _o,this.targetCount=0,this.oi=mn._r()}forEachTarget(e,t){return this.ri.forEach((r,s)=>t(s)),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.ii&&(this.ii=t),P.resolve()}lr(e){this.ri.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.oi=new mn(t),this.highestTargetId=t),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,t){return this.lr(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.lr(t),P.resolve()}removeTargetData(e,t){return this.ri.delete(t.target),this.si.Gr(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,r){let s=0;const o=[];return this.ri.forEach((a,u)=>{u.sequenceNumber<=t&&r.get(u.targetId)===null&&(this.ri.delete(a),o.push(this.removeMatchingKeysForTargetId(e,u.targetId)),s++)}),P.waitFor(o).next(()=>s)}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const r=this.ri.get(t)||null;return P.resolve(r)}addMatchingKeys(e,t,r){return this.si.$r(t,r),P.resolve()}removeMatchingKeys(e,t,r){this.si.Qr(t,r);const s=this.persistence.referenceDelegate,o=[];return s&&t.forEach(a=>{o.push(s.markPotentiallyOrphaned(e,a))}),P.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this.si.Gr(t),P.resolve()}getMatchingKeysForTargetId(e,t){const r=this.si.jr(t);return P.resolve(r)}containsKey(e,t){return P.resolve(this.si.containsKey(t))}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class ah{constructor(e,t){this._i={},this.overlays={},this.ai=new Is(0),this.ui=!1,this.ui=!0,this.ci=new iy,this.referenceDelegate=e(this),this.li=new uy(this),this.indexManager=new G_,this.remoteDocumentCache=function(s){return new ay(s)}(r=>this.referenceDelegate.hi(r)),this.serializer=new H_(t),this.Pi=new ry(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new sy,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this._i[e.toKey()];return r||(r=new oy(t,this.referenceDelegate),this._i[e.toKey()]=r),r}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,t,r){k("MemoryPersistence","Starting transaction:",e);const s=new ly(this.ai.next());return this.referenceDelegate.Ti(),r(s).next(o=>this.referenceDelegate.Ei(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Ii(e,t){return P.or(Object.values(this._i).map(r=>()=>r.containsKey(e,t)))}}class ly extends Mg{constructor(e){super(),this.currentSequenceNumber=e}}class yo{constructor(e){this.persistence=e,this.Ri=new _o,this.Ai=null}static Vi(e){return new yo(e)}get di(){if(this.Ai)return this.Ai;throw x(60996)}addReference(e,t,r){return this.Ri.addReference(r,t),this.di.delete(r.toString()),P.resolve()}removeReference(e,t,r){return this.Ri.removeReference(r,t),this.di.add(r.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),P.resolve()}removeTarget(e,t){this.Ri.Gr(t.targetId).forEach(s=>this.di.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(o=>this.di.add(o.toString()))}).next(()=>r.removeTargetData(e,t))}Ti(){this.Ai=new Set}Ei(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.di,r=>{const s=O.fromPath(r);return this.mi(e,s).next(o=>{o||t.removeEntry(s,F.min())})}).next(()=>(this.Ai=null,t.apply(e)))}updateLimboDocument(e,t){return this.mi(e,t).next(r=>{r?this.di.delete(t.toString()):this.di.add(t.toString())})}hi(e){return 0}mi(e,t){return P.or([()=>P.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ii(e,t)])}}class ls{constructor(e,t){this.persistence=e,this.fi=new Ht(r=>Ug(r.path),(r,s)=>r.isEqual(s)),this.garbageCollector=Z_(this,t)}static Vi(e,t){return new ls(e,t)}Ti(){}Ei(e){return P.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){const t=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>t.next(s=>r+s))}pr(e){let t=0;return this.mr(e,r=>{t++}).next(()=>t)}mr(e,t){return P.forEach(this.fi,(r,s)=>this.wr(e,r,s).next(o=>o?P.resolve():t(s)))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const s=this.persistence.getRemoteDocumentCache(),o=s.newChangeBuffer();return s.ni(e,a=>this.wr(e,a,t).next(u=>{u||(r++,o.removeEntry(a,F.min()))})).next(()=>o.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,t){return this.fi.set(t,e.currentSequenceNumber),P.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.fi.set(r,e.currentSequenceNumber),P.resolve()}removeReference(e,t,r){return this.fi.set(r,e.currentSequenceNumber),P.resolve()}updateLimboDocument(e,t){return this.fi.set(t,e.currentSequenceNumber),P.resolve()}hi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Hr(e.data.value)),t}wr(e,t,r){return P.or([()=>this.persistence.Ii(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.fi.get(t);return P.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Eo{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Ts=r,this.Es=s}static Is(e,t){let r=$(),s=$();for(const o of t.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new Eo(e,t.fromCache,r,s)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class hy{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class dy{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=function(){return qd()?8:xg(Ie())>0?6:4}()}initialize(e,t){this.fs=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,r,s){const o={result:null};return this.gs(e,t).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.ps(e,t,s,r).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new hy;return this.ys(e,t,a).next(u=>{if(o.result=u,this.As)return this.ws(e,t,a,u.size)})}).next(()=>o.result)}ws(e,t,r,s){return r.documentReadCount<this.Vs?(Xt()<=q.DEBUG&&k("QueryEngine","SDK will not create cache indexes for query:",Zt(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),P.resolve()):(Xt()<=q.DEBUG&&k("QueryEngine","Query:",Zt(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.ds*s?(Xt()<=q.DEBUG&&k("QueryEngine","The SDK decides to create cache indexes for query:",Zt(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,je(t))):P.resolve())}gs(e,t){if(Oc(t))return P.resolve(null);let r=je(t);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=ki(t,null,"F"),r=je(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(o=>{const a=$(...o);return this.fs.getDocuments(e,a).next(u=>this.indexManager.getMinOffset(e,r).next(h=>{const d=this.Ss(t,u);return this.bs(t,d,a,h.readTime)?this.gs(e,ki(t,null,"F")):this.Ds(e,d,t,h)}))})))}ps(e,t,r,s){return Oc(t)||s.isEqual(F.min())?P.resolve(null):this.fs.getDocuments(e,r).next(o=>{const a=this.Ss(t,o);return this.bs(t,a,r,s)?P.resolve(null):(Xt()<=q.DEBUG&&k("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Zt(t)),this.Ds(e,a,t,Ng(s,tr)).next(u=>u))})}Ss(e,t){let r=new ce(Fl(e));return t.forEach((s,o)=>{Rs(e,o)&&(r=r.add(o))}),r}bs(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}ys(e,t,r){return Xt()<=q.DEBUG&&k("QueryEngine","Using full collection scan to execute query:",Zt(t)),this.fs.getDocumentsMatchingQuery(e,t,Et.min(),r)}Ds(e,t,r,s){return this.fs.getDocumentsMatchingQuery(e,r,s).next(o=>(t.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Io="LocalStore",fy=3e8;class py{constructor(e,t,r,s){this.persistence=e,this.Cs=t,this.serializer=s,this.vs=new X(j),this.Fs=new Ht(o=>uo(o),lo),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(r)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new ny(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.vs))}}function my(n,e,t,r){return new py(n,e,t,r)}async function ch(n,e){const t=U(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,t.Os(e),t.mutationQueue.getAllMutationBatches(r))).next(o=>{const a=[],u=[];let h=$();for(const d of s){a.push(d.batchId);for(const p of d.mutations)h=h.add(p.key)}for(const d of o){u.push(d.batchId);for(const p of d.mutations)h=h.add(p.key)}return t.localDocuments.getDocuments(r,h).next(d=>({Ns:d,removedBatchIds:a,addedBatchIds:u}))})})}function gy(n,e){const t=U(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),o=t.xs.newChangeBuffer({trackRemovals:!0});return function(u,h,d,p){const y=d.batch,R=y.keys();let C=P.resolve();return R.forEach(N=>{C=C.next(()=>p.getEntry(h,N)).next(L=>{const D=d.docVersions.get(N);W(D!==null,48541),L.version.compareTo(D)<0&&(y.applyToRemoteDocument(L,d),L.isValidDocument()&&(L.setReadTime(d.commitVersion),p.addEntry(L)))})}),C.next(()=>u.mutationQueue.removeMutationBatch(h,y))}(t,r,e,o).next(()=>o.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(u){let h=$();for(let d=0;d<u.mutationResults.length;++d)u.mutationResults[d].transformResults.length>0&&(h=h.add(u.batch.mutations[d].key));return h}(e))).next(()=>t.localDocuments.getDocuments(r,s))})}function uh(n){const e=U(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.li.getLastRemoteSnapshotVersion(t))}function _y(n,e){const t=U(n),r=e.snapshotVersion;let s=t.vs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",o=>{const a=t.xs.newChangeBuffer({trackRemovals:!0});s=t.vs;const u=[];e.targetChanges.forEach((p,y)=>{const R=s.get(y);if(!R)return;u.push(t.li.removeMatchingKeys(o,p.removedDocuments,y).next(()=>t.li.addMatchingKeys(o,p.addedDocuments,y)));let C=R.withSequenceNumber(o.currentSequenceNumber);e.targetMismatches.get(y)!==null?C=C.withResumeToken(fe.EMPTY_BYTE_STRING,F.min()).withLastLimboFreeSnapshotVersion(F.min()):p.resumeToken.approximateByteSize()>0&&(C=C.withResumeToken(p.resumeToken,r)),s=s.insert(y,C),function(L,D,H){return L.resumeToken.approximateByteSize()===0||D.snapshotVersion.toMicroseconds()-L.snapshotVersion.toMicroseconds()>=fy?!0:H.addedDocuments.size+H.modifiedDocuments.size+H.removedDocuments.size>0}(R,C,p)&&u.push(t.li.updateTargetData(o,C))});let h=Xe(),d=$();if(e.documentUpdates.forEach(p=>{e.resolvedLimboDocuments.has(p)&&u.push(t.persistence.referenceDelegate.updateLimboDocument(o,p))}),u.push(yy(o,a,e.documentUpdates).next(p=>{h=p.Bs,d=p.Ls})),!r.isEqual(F.min())){const p=t.li.getLastRemoteSnapshotVersion(o).next(y=>t.li.setTargetsMetadata(o,o.currentSequenceNumber,r));u.push(p)}return P.waitFor(u).next(()=>a.apply(o)).next(()=>t.localDocuments.getLocalViewOfDocuments(o,h,d)).next(()=>h)}).then(o=>(t.vs=s,o))}function yy(n,e,t){let r=$(),s=$();return t.forEach(o=>r=r.add(o)),e.getEntries(n,r).next(o=>{let a=Xe();return t.forEach((u,h)=>{const d=o.get(u);h.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(u)),h.isNoDocument()&&h.version.isEqual(F.min())?(e.removeEntry(u,h.readTime),a=a.insert(u,h)):!d.isValidDocument()||h.version.compareTo(d.version)>0||h.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(h),a=a.insert(u,h)):k(Io,"Ignoring outdated watch update for ",u,". Current version:",d.version," Watch version:",h.version)}),{Bs:a,Ls:s}})}function Ey(n,e){const t=U(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=oo),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function Iy(n,e){const t=U(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return t.li.getTargetData(r,e).next(o=>o?(s=o,P.resolve(s)):t.li.allocateTargetId(r).next(a=>(s=new ht(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.li.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=t.vs.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.vs=t.vs.insert(r.targetId,r),t.Fs.set(e,r.targetId)),r})}async function Mi(n,e,t){const r=U(n),s=r.vs.get(e),o=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",o,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!Tn(a))throw a;k(Io,`Failed to update sequence numbers for target ${e}: ${a}`)}r.vs=r.vs.remove(e),r.Fs.delete(s.target)}function Gc(n,e,t){const r=U(n);let s=F.min(),o=$();return r.persistence.runTransaction("Execute query","readwrite",a=>function(h,d,p){const y=U(h),R=y.Fs.get(p);return R!==void 0?P.resolve(y.vs.get(R)):y.li.getTargetData(d,p)}(r,a,je(e)).next(u=>{if(u)return s=u.lastLimboFreeSnapshotVersion,r.li.getMatchingKeysForTargetId(a,u.targetId).next(h=>{o=h})}).next(()=>r.Cs.getDocumentsMatchingQuery(a,e,t?s:F.min(),t?o:$())).next(u=>(Ty(r,o_(e),u),{documents:u,ks:o})))}function Ty(n,e,t){let r=n.Ms.get(e)||F.min();t.forEach((s,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)}),n.Ms.set(e,r)}class Kc{constructor(){this.activeTargetIds=d_()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class wy{constructor(){this.vo=new Kc,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,t,r){this.Fo[e]=t}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new Kc,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */class vy{Mo(e){}shutdown(){}}/**
 *   
 *    2019 Google   
 *
 *   
 *
 *     
 *
   
 */const Qc="ConnectivityMonitor";class Yc{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){k(Qc,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){k(Qc,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */let Ur=null;function xi(){return Ur===null?Ur=function(){return 268435456+Math.round(2147483648*Math.random())}():Ur++,"0x"+Ur.toString(16)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const fi="RestConnection",Ay={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class Ry{get qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Ko=t+"://"+e.host,this.Uo=`projects/${r}/databases/${s}`,this.$o=this.databaseId.database===ss?`project_id=${r}`:`project_id=${r}&database_id=${s}`}Wo(e,t,r,s,o){const a=xi(),u=this.Qo(e,t.toUriEncodedString());k(fi,`Sending RPC '${e}' ${a}:`,u,r);const h={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(h,s,o);const{host:d}=new URL(u),p=lr(d);return this.zo(e,u,h,r,p).then(y=>(k(fi,`Received RPC '${e}' ${a}: `,y),y),y=>{throw qt(fi,`RPC '${e}' ${a} failed with error: `,y,"url: ",u,"request:",r),y})}jo(e,t,r,s,o,a){return this.Wo(e,t,r,s,o)}Go(e,t,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+En}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((s,o)=>e[o]=s),r&&r.headers.forEach((s,o)=>e[o]=s)}Qo(e,t){const r=Ay[e];let s=`${this.Ko}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Sy{constructor(e){this.Jo=e.Jo,this.Ho=e.Ho}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Ho()}send(e){this.Jo(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const _e="WebChannelConnection",Bn=(n,e,t)=>{n.listen(e,r=>{try{t(r)}catch(s){setTimeout(()=>{throw s},0)}})};class on extends Ry{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!on.c_){const e=fl();Bn(e,dl.STAT_EVENT,t=>{t.stat===Ai.PROXY?k(_e,"STAT_EVENT: detected buffering proxy"):t.stat===Ai.NOPROXY&&k(_e,"STAT_EVENT: detected no buffering proxy")}),on.c_=!0}}zo(e,t,r,s,o){const a=xi();return new Promise((u,h)=>{const d=new ll;d.setWithCredentials(!0),d.listenOnce(hl.COMPLETE,()=>{try{switch(d.getLastErrorCode()){case zr.NO_ERROR:const y=d.getResponseJson();k(_e,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(y)),u(y);break;case zr.TIMEOUT:k(_e,`RPC '${e}' ${a} timed out`),h(new V(S.DEADLINE_EXCEEDED,"Request time out"));break;case zr.HTTP_ERROR:const R=d.getStatus();if(k(_e,`RPC '${e}' ${a} failed with status:`,R,"response text:",d.getResponseText()),R>0){let C=d.getResponseJson();Array.isArray(C)&&(C=C[0]);const N=C==null?void 0:C.error;if(N&&N.status&&N.message){const L=function(H){const G=H.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(G)>=0?G:S.UNKNOWN}(N.status);h(new V(L,N.message))}else h(new V(S.UNKNOWN,"Server responded with status "+d.getStatus()))}else h(new V(S.UNAVAILABLE,"Connection failed."));break;default:x(9055,{l_:e,streamId:a,h_:d.getLastErrorCode(),P_:d.getLastError()})}}finally{k(_e,`RPC '${e}' ${a} completed.`)}});const p=JSON.stringify(s);k(_e,`RPC '${e}' ${a} sending request:`,s),d.send(t,"POST",p,r,15)})}T_(e,t,r){const s=xi(),o=[this.Ko,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=this.createWebChannelTransport(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Go(u.initMessageHeaders,t,r),u.encodeInitMessageHeaders=!0;const d=o.join("");k(_e,`Creating RPC '${e}' stream ${s}: ${d}`,u);const p=a.createWebChannel(d,u);this.E_(p);let y=!1,R=!1;const C=new Sy({Jo:N=>{R?k(_e,`Not sending because RPC '${e}' stream ${s} is closed:`,N):(y||(k(_e,`Opening RPC '${e}' stream ${s} transport.`),p.open(),y=!0),k(_e,`RPC '${e}' stream ${s} sending:`,N),p.send(N))},Ho:()=>p.close()});return Bn(p,$n.EventType.OPEN,()=>{R||(k(_e,`RPC '${e}' stream ${s} transport opened.`),C.i_())}),Bn(p,$n.EventType.CLOSE,()=>{R||(R=!0,k(_e,`RPC '${e}' stream ${s} transport closed`),C.o_(),this.I_(p))}),Bn(p,$n.EventType.ERROR,N=>{R||(R=!0,qt(_e,`RPC '${e}' stream ${s} transport errored. Name:`,N.name,"Message:",N.message),C.o_(new V(S.UNAVAILABLE,"The operation could not be completed")))}),Bn(p,$n.EventType.MESSAGE,N=>{var L;if(!R){const D=N.data[0];W(!!D,16349);const H=D,G=(H==null?void 0:H.error)||((L=H[0])==null?void 0:L.error);if(G){k(_e,`RPC '${e}' stream ${s} received error:`,G);const Z=G.status;let Pe=function(I){const m=se[I];if(m!==void 0)return Ql(m)}(Z),pe=G.message;Z==="NOT_FOUND"&&pe.includes("database")&&pe.includes("does not exist")&&pe.includes(this.databaseId.database)&&qt(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),Pe===void 0&&(Pe=S.INTERNAL,pe="Unknown error status: "+Z+" with message "+G.message),R=!0,C.o_(new V(Pe,pe)),p.close()}else k(_e,`RPC '${e}' stream ${s} received:`,D),C.__(D)}}),on.u_(),setTimeout(()=>{C.s_()},0),C}terminate(){this.a_.forEach(e=>e.close()),this.a_=[]}E_(e){this.a_.push(e)}I_(e){this.a_=this.a_.filter(t=>t===e)}Go(e,t,r){super.Go(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return pl()}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function Py(n){return new on(n)}function pi(){return typeof document<"u"?document:null}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function bs(n){return new k_(n,!0)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */on.c_=!1;class lh{constructor(e,t,r=1e3,s=1.5,o=6e4){this.Ci=e,this.timerId=t,this.R_=r,this.A_=s,this.V_=o,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),r=Math.max(0,Date.now()-this.f_),s=Math.max(0,t-r);s>0&&k("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,s,()=>(this.f_=Date.now(),e())),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Jc="PersistentStream";class hh{constructor(e,t,r,s,o,a,u,h){this.Ci=e,this.S_=r,this.b_=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=h,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new lh(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Ci.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(e){this.K_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.K_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(Je(t.toString()),Je("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(t)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.D_===t&&this.G_(r,s)},r=>{e(()=>{const s=new V(S.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(s)})})}G_(e,t){const r=this.Q_(this.D_);this.stream=this.j_(e,t),this.stream.Zo(()=>{r(()=>this.listener.Zo())}),this.stream.Yo(()=>{r(()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.Yo()))}),this.stream.t_(s=>{r(()=>this.z_(s))}),this.stream.onMessage(s=>{r(()=>++this.F_==1?this.J_(s):this.onNext(s))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return k(Jc,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return t=>{this.Ci.enqueueAndForget(()=>this.D_===e?t():(k(Jc,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Cy extends hh{constructor(e,t,r,s,o,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=O_(this.serializer,e),r=function(o){if(!("targetChange"in o))return F.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?F.min():a.readTime?$e(a.readTime):F.min()}(e);return this.listener.H_(t,r)}Z_(e){const t={};t.database=Li(this.serializer),t.addTarget=function(o,a){let u;const h=a.target;if(u=bi(h)?{documents:x_(o,h)}:{query:F_(o,h).ft},u.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){u.resumeToken=Xl(o,a.resumeToken);const d=Ni(o,a.expectedCount);d!==null&&(u.expectedCount=d)}else if(a.snapshotVersion.compareTo(F.min())>0){u.readTime=us(o,a.snapshotVersion.toTimestamp());const d=Ni(o,a.expectedCount);d!==null&&(u.expectedCount=d)}return u}(this.serializer,e);const r=B_(this.serializer,e);r&&(t.labels=r),this.q_(t)}X_(e){const t={};t.database=Li(this.serializer),t.removeTarget=e,this.q_(t)}}class by extends hh{constructor(e,t,r,s,o,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return W(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,W(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){W(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=M_(e.writeResults,e.commitTime),r=$e(e.commitTime);return this.listener.na(r,t)}ra(){const e={};e.database=Li(this.serializer),this.q_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>L_(this.serializer,r))};this.q_(t)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Vy{}class ky extends Vy{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new V(S.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,r,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Wo(e,Di(t,r),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new V(S.UNKNOWN,o.toString())})}jo(e,t,r,s,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,u])=>this.connection.jo(e,Di(t,r),s,a,u,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new V(S.UNKNOWN,a.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}function Ny(n,e,t,r){return new ky(n,e,t,r)}class Dy{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(Je(t),this.aa=!1):k("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const jt="RemoteStore";class Oy{constructor(e,t,r,s,o){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ea=new Map,this.Ia=new Set,this.Ra=[],this.Aa=o,this.Aa.Mo(a=>{r.enqueueAndForget(async()=>{Gt(this)&&(k(jt,"Restarting streams for network reachability change."),await async function(h){const d=U(h);d.Ia.add(4),await _r(d),d.Va.set("Unknown"),d.Ia.delete(4),await Vs(d)}(this))})}),this.Va=new Dy(r,s)}}async function Vs(n){if(Gt(n))for(const e of n.Ra)await e(!0)}async function _r(n){for(const e of n.Ra)await e(!1)}function dh(n,e){const t=U(n);t.Ea.has(e.targetId)||(t.Ea.set(e.targetId,e),Ao(t)?vo(t):vn(t).O_()&&wo(t,e))}function To(n,e){const t=U(n),r=vn(t);t.Ea.delete(e),r.O_()&&fh(t,e),t.Ea.size===0&&(r.O_()?r.L_():Gt(t)&&t.Va.set("Unknown"))}function wo(n,e){if(n.da.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(F.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}vn(n).Z_(e)}function fh(n,e){n.da.$e(e),vn(n).X_(e)}function vo(n){n.da=new P_({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),At:e=>n.Ea.get(e)||null,ht:()=>n.datastore.serializer.databaseId}),vn(n).start(),n.Va.ua()}function Ao(n){return Gt(n)&&!vn(n).x_()&&n.Ea.size>0}function Gt(n){return U(n).Ia.size===0}function ph(n){n.da=void 0}async function Ly(n){n.Va.set("Online")}async function My(n){n.Ea.forEach((e,t)=>{wo(n,e)})}async function xy(n,e){ph(n),Ao(n)?(n.Va.ha(e),vo(n)):n.Va.set("Unknown")}async function Fy(n,e,t){if(n.Va.set("Online"),e instanceof Jl&&e.state===2&&e.cause)try{await async function(s,o){const a=o.cause;for(const u of o.targetIds)s.Ea.has(u)&&(await s.remoteSyncer.rejectListen(u,a),s.Ea.delete(u),s.da.removeTarget(u))}(n,e)}catch(r){k(jt,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await hs(n,r)}else if(e instanceof Kr?n.da.Xe(e):e instanceof Yl?n.da.st(e):n.da.tt(e),!t.isEqual(F.min()))try{const r=await uh(n.localStore);t.compareTo(r)>=0&&await function(o,a){const u=o.da.Tt(a);return u.targetChanges.forEach((h,d)=>{if(h.resumeToken.approximateByteSize()>0){const p=o.Ea.get(d);p&&o.Ea.set(d,p.withResumeToken(h.resumeToken,a))}}),u.targetMismatches.forEach((h,d)=>{const p=o.Ea.get(h);if(!p)return;o.Ea.set(h,p.withResumeToken(fe.EMPTY_BYTE_STRING,p.snapshotVersion)),fh(o,h);const y=new ht(p.target,h,d,p.sequenceNumber);wo(o,y)}),o.remoteSyncer.applyRemoteEvent(u)}(n,t)}catch(r){k(jt,"Failed to raise snapshot:",r),await hs(n,r)}}async function hs(n,e,t){if(!Tn(e))throw e;n.Ia.add(1),await _r(n),n.Va.set("Offline"),t||(t=()=>uh(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{k(jt,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await Vs(n)})}function mh(n,e){return e().catch(t=>hs(n,t,e))}async function ks(n){const e=U(n),t=vt(e);let r=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:oo;for(;Uy(e);)try{const s=await Ey(e.localStore,r);if(s===null){e.Ta.length===0&&t.L_();break}r=s.batchId,By(e,s)}catch(s){await hs(e,s)}gh(e)&&_h(e)}function Uy(n){return Gt(n)&&n.Ta.length<10}function By(n,e){n.Ta.push(e);const t=vt(n);t.O_()&&t.Y_&&t.ea(e.mutations)}function gh(n){return Gt(n)&&!vt(n).x_()&&n.Ta.length>0}function _h(n){vt(n).start()}async function qy(n){vt(n).ra()}async function jy(n){const e=vt(n);for(const t of n.Ta)e.ea(t.mutations)}async function $y(n,e,t){const r=n.Ta.shift(),s=po.from(r,e,t);await mh(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await ks(n)}async function zy(n,e){e&&vt(n).Y_&&await async function(r,s){if(function(a){return A_(a)&&a!==S.ABORTED}(s.code)){const o=r.Ta.shift();vt(r).B_(),await mh(r,()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s)),await ks(r)}}(n,e),gh(n)&&_h(n)}async function Xc(n,e){const t=U(n);t.asyncQueue.verifyOperationInProgress(),k(jt,"RemoteStore received new credentials");const r=Gt(t);t.Ia.add(3),await _r(t),r&&t.Va.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await Vs(t)}async function Hy(n,e){const t=U(n);e?(t.Ia.delete(2),await Vs(t)):e||(t.Ia.add(2),await _r(t),t.Va.set("Unknown"))}function vn(n){return n.ma||(n.ma=function(t,r,s){const o=U(t);return o.sa(),new Cy(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Zo:Ly.bind(null,n),Yo:My.bind(null,n),t_:xy.bind(null,n),H_:Fy.bind(null,n)}),n.Ra.push(async e=>{e?(n.ma.B_(),Ao(n)?vo(n):n.Va.set("Unknown")):(await n.ma.stop(),ph(n))})),n.ma}function vt(n){return n.fa||(n.fa=function(t,r,s){const o=U(t);return o.sa(),new by(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),Yo:qy.bind(null,n),t_:zy.bind(null,n),ta:jy.bind(null,n),na:$y.bind(null,n)}),n.Ra.push(async e=>{e?(n.fa.B_(),await ks(n)):(await n.fa.stop(),n.Ta.length>0&&(k(jt,`Stopping write stream with ${n.Ta.length} pending writes`),n.Ta=[]))})),n.fa}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Ro{constructor(e,t,r,s,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new _t,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,o){const a=Date.now()+r,u=new Ro(e,t,a,s,o);return u.start(r),u}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new V(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function So(n,e){if(Je("AsyncQueue",`${e}: ${n}`),Tn(n))return new V(S.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class an{static emptySet(e){return new an(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||O.comparator(t.key,r.key):(t,r)=>O.comparator(t.key,r.key),this.keyedMap=zn(),this.sortedSet=new X(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof an)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(!s.isEqual(o))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new an;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Zc{constructor(){this.ga=new X(O.comparator)}track(e){const t=e.doc.key,r=this.ga.get(t);r?e.type!==0&&r.type===3?this.ga=this.ga.insert(t,e):e.type===3&&r.type!==1?this.ga=this.ga.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.ga=this.ga.remove(t):e.type===1&&r.type===2?this.ga=this.ga.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):x(63341,{Vt:e,pa:r}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal((t,r)=>{e.push(r)}),e}}class gn{constructor(e,t,r,s,o,a,u,h,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=u,this.excludesMetadataChanges=h,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,s,o){const a=[];return t.forEach(u=>{a.push({type:0,doc:u})}),new gn(e,t,an.emptySet(t),a,r,s,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&As(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Wy{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(e=>e.Da())}}class Gy{constructor(){this.queries=eu(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(t,r){const s=U(t),o=s.queries;s.queries=eu(),o.forEach((a,u)=>{for(const h of u.Sa)h.onError(r)})})(this,new V(S.ABORTED,"Firestore shutting down"))}}function eu(){return new Ht(n=>xl(n),As)}async function yh(n,e){const t=U(n);let r=3;const s=e.query;let o=t.queries.get(s);o?!o.ba()&&e.Da()&&(r=2):(o=new Wy,r=e.Da()?0:1);try{switch(r){case 0:o.wa=await t.onListen(s,!0);break;case 1:o.wa=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const u=So(a,`Initialization of query '${Zt(e.query)}' failed`);return void e.onError(u)}t.queries.set(s,o),o.Sa.push(e),e.va(t.onlineState),o.wa&&e.Fa(o.wa)&&Po(t)}async function Eh(n,e){const t=U(n),r=e.query;let s=3;const o=t.queries.get(r);if(o){const a=o.Sa.indexOf(e);a>=0&&(o.Sa.splice(a,1),o.Sa.length===0?s=e.Da()?0:1:!o.ba()&&e.Da()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function Ky(n,e){const t=U(n);let r=!1;for(const s of e){const o=s.query,a=t.queries.get(o);if(a){for(const u of a.Sa)u.Fa(s)&&(r=!0);a.wa=s}}r&&Po(t)}function Qy(n,e,t){const r=U(n),s=r.queries.get(e);if(s)for(const o of s.Sa)o.onError(t);r.queries.delete(e)}function Po(n){n.Ca.forEach(e=>{e.next()})}var Fi,tu;(tu=Fi||(Fi={})).Ma="default",tu.Cache="cache";class Ih{constructor(e,t,r){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new gn(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache||!this.Da())return!0;const r=t!=="Offline";return(!this.options.qa||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}ka(e){e=gn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==Fi.Cache}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Th{constructor(e){this.key=e}}class wh{constructor(e){this.key=e}}class Yy{constructor(e,t){this.query=e,this.Za=t,this.Xa=null,this.hasCachedResults=!1,this.current=!1,this.Ya=$(),this.mutatedKeys=$(),this.eu=Fl(e),this.tu=new an(this.eu)}get nu(){return this.Za}ru(e,t){const r=t?t.iu:new Zc,s=t?t.tu:this.tu;let o=t?t.mutatedKeys:this.mutatedKeys,a=s,u=!1;const h=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((p,y)=>{const R=s.get(p),C=Rs(this.query,y)?y:null,N=!!R&&this.mutatedKeys.has(R.key),L=!!C&&(C.hasLocalMutations||this.mutatedKeys.has(C.key)&&C.hasCommittedMutations);let D=!1;R&&C?R.data.isEqual(C.data)?N!==L&&(r.track({type:3,doc:C}),D=!0):this.su(R,C)||(r.track({type:2,doc:C}),D=!0,(h&&this.eu(C,h)>0||d&&this.eu(C,d)<0)&&(u=!0)):!R&&C?(r.track({type:0,doc:C}),D=!0):R&&!C&&(r.track({type:1,doc:R}),D=!0,(h||d)&&(u=!0)),D&&(C?(a=a.add(C),o=L?o.add(p):o.delete(p)):(a=a.delete(p),o=o.delete(p)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const p=this.query.limitType==="F"?a.last():a.first();a=a.delete(p.key),o=o.delete(p.key),r.track({type:1,doc:p})}return{tu:a,iu:r,bs:u,mutatedKeys:o}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const o=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const a=e.iu.ya();a.sort((p,y)=>function(C,N){const L=D=>{switch(D){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return x(20277,{Vt:D})}};return L(C)-L(N)}(p.type,y.type)||this.eu(p.doc,y.doc)),this.ou(r),s=s??!1;const u=t&&!s?this._u():[],h=this.Ya.size===0&&this.current&&!s?1:0,d=h!==this.Xa;return this.Xa=h,a.length!==0||d?{snapshot:new gn(this.query,e.tu,o,a,e.mutatedKeys,h===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:u}:{au:u}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new Zc,mutatedKeys:this.mutatedKeys,bs:!1},!1)):{au:[]}}uu(e){return!this.Za.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach(t=>this.Za=this.Za.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Za=this.Za.delete(t)),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Ya;this.Ya=$(),this.tu.forEach(r=>{this.uu(r.key)&&(this.Ya=this.Ya.add(r.key))});const t=[];return e.forEach(r=>{this.Ya.has(r)||t.push(new wh(r))}),this.Ya.forEach(r=>{e.has(r)||t.push(new Th(r))}),t}cu(e){this.Za=e.ks,this.Ya=$();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return gn.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Xa===0,this.hasCachedResults)}}const Co="SyncEngine";class Jy{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class Xy{constructor(e){this.key=e,this.hu=!1}}class Zy{constructor(e,t,r,s,o,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Pu={},this.Tu=new Ht(u=>xl(u),As),this.Eu=new Map,this.Iu=new Set,this.Ru=new X(O.comparator),this.Au=new Map,this.Vu=new _o,this.du={},this.mu=new Map,this.fu=mn.ar(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function eE(n,e,t=!0){const r=Ch(n);let s;const o=r.Tu.get(e);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),s=o.view.lu()):s=await vh(r,e,t,!0),s}async function tE(n,e){const t=Ch(n);await vh(t,e,!0,!1)}async function vh(n,e,t,r){const s=await Iy(n.localStore,je(e)),o=s.targetId,a=n.sharedClientState.addLocalQueryTarget(o,t);let u;return r&&(u=await nE(n,e,o,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&dh(n.remoteStore,s),u}async function nE(n,e,t,r,s){n.pu=(y,R,C)=>async function(L,D,H,G){let Z=D.view.ru(H);Z.bs&&(Z=await Gc(L.localStore,D.query,!1).then(({documents:I})=>D.view.ru(I,Z)));const Pe=G&&G.targetChanges.get(D.targetId),pe=G&&G.targetMismatches.get(D.targetId)!=null,me=D.view.applyChanges(Z,L.isPrimaryClient,Pe,pe);return ru(L,D.targetId,me.au),me.snapshot}(n,y,R,C);const o=await Gc(n.localStore,e,!0),a=new Yy(e,o.ks),u=a.ru(o.documents),h=gr.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),d=a.applyChanges(u,n.isPrimaryClient,h);ru(n,t,d.au);const p=new Jy(e,t,a);return n.Tu.set(e,p),n.Eu.has(t)?n.Eu.get(t).push(e):n.Eu.set(t,[e]),d.snapshot}async function rE(n,e,t){const r=U(n),s=r.Tu.get(e),o=r.Eu.get(s.targetId);if(o.length>1)return r.Eu.set(s.targetId,o.filter(a=>!As(a,e))),void r.Tu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Mi(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),t&&To(r.remoteStore,s.targetId),Ui(r,s.targetId)}).catch(In)):(Ui(r,s.targetId),await Mi(r.localStore,s.targetId,!0))}async function sE(n,e){const t=U(n),r=t.Tu.get(e),s=t.Eu.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),To(t.remoteStore,r.targetId))}async function iE(n,e,t){const r=dE(n);try{const s=await function(a,u){const h=U(a),d=J.now(),p=u.reduce((C,N)=>C.add(N.key),$());let y,R;return h.persistence.runTransaction("Locally write mutations","readwrite",C=>{let N=Xe(),L=$();return h.xs.getEntries(C,p).next(D=>{N=D,N.forEach((H,G)=>{G.isValidDocument()||(L=L.add(H))})}).next(()=>h.localDocuments.getOverlayedDocuments(C,N)).next(D=>{y=D;const H=[];for(const G of u){const Z=E_(G,y.get(G.key).overlayedDocument);Z!=null&&H.push(new Wt(G.key,Z,bl(Z.value.mapValue),Oe.exists(!0)))}return h.mutationQueue.addMutationBatch(C,d,H,u)}).next(D=>{R=D;const H=D.applyToLocalDocumentSet(y,L);return h.documentOverlayCache.saveOverlays(C,D.batchId,H)})}).then(()=>({batchId:R.batchId,changes:Bl(y)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(a,u,h){let d=a.du[a.currentUser.toKey()];d||(d=new X(j)),d=d.insert(u,h),a.du[a.currentUser.toKey()]=d}(r,s.batchId,t),await yr(r,s.changes),await ks(r.remoteStore)}catch(s){const o=So(s,"Failed to persist write");t.reject(o)}}async function Ah(n,e){const t=U(n);try{const r=await _y(t.localStore,e);e.targetChanges.forEach((s,o)=>{const a=t.Au.get(o);a&&(W(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.hu=!0:s.modifiedDocuments.size>0?W(a.hu,14607):s.removedDocuments.size>0&&(W(a.hu,42227),a.hu=!1))}),await yr(t,r,e)}catch(r){await In(r)}}function nu(n,e,t){const r=U(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Tu.forEach((o,a)=>{const u=a.view.va(e);u.snapshot&&s.push(u.snapshot)}),function(a,u){const h=U(a);h.onlineState=u;let d=!1;h.queries.forEach((p,y)=>{for(const R of y.Sa)R.va(u)&&(d=!0)}),d&&Po(h)}(r.eventManager,e),s.length&&r.Pu.H_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function oE(n,e,t){const r=U(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Au.get(e),o=s&&s.key;if(o){let a=new X(O.comparator);a=a.insert(o,Ee.newNoDocument(o,F.min()));const u=$().add(o),h=new Cs(F.min(),new Map,new X(j),a,u);await Ah(r,h),r.Ru=r.Ru.remove(o),r.Au.delete(e),bo(r)}else await Mi(r.localStore,e,!1).then(()=>Ui(r,e,t)).catch(In)}async function aE(n,e){const t=U(n),r=e.batch.batchId;try{const s=await gy(t.localStore,e);Sh(t,r,null),Rh(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await yr(t,s)}catch(s){await In(s)}}async function cE(n,e,t){const r=U(n);try{const s=await function(a,u){const h=U(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let p;return h.mutationQueue.lookupMutationBatch(d,u).next(y=>(W(y!==null,37113),p=y.keys(),h.mutationQueue.removeMutationBatch(d,y))).next(()=>h.mutationQueue.performConsistencyCheck(d)).next(()=>h.documentOverlayCache.removeOverlaysForBatchId(d,p,u)).next(()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,p)).next(()=>h.localDocuments.getDocuments(d,p))})}(r.localStore,e);Sh(r,e,t),Rh(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await yr(r,s)}catch(s){await In(s)}}function Rh(n,e){(n.mu.get(e)||[]).forEach(t=>{t.resolve()}),n.mu.delete(e)}function Sh(n,e,t){const r=U(n);let s=r.du[r.currentUser.toKey()];if(s){const o=s.get(e);o&&(t?o.reject(t):o.resolve(),s=s.remove(e)),r.du[r.currentUser.toKey()]=s}}function Ui(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Eu.get(e))n.Tu.delete(r),t&&n.Pu.yu(r,t);n.Eu.delete(e),n.isPrimaryClient&&n.Vu.Gr(e).forEach(r=>{n.Vu.containsKey(r)||Ph(n,r)})}function Ph(n,e){n.Iu.delete(e.path.canonicalString());const t=n.Ru.get(e);t!==null&&(To(n.remoteStore,t),n.Ru=n.Ru.remove(e),n.Au.delete(t),bo(n))}function ru(n,e,t){for(const r of t)r instanceof Th?(n.Vu.addReference(r.key,e),uE(n,r)):r instanceof wh?(k(Co,"Document no longer in limbo: "+r.key),n.Vu.removeReference(r.key,e),n.Vu.containsKey(r.key)||Ph(n,r.key)):x(19791,{wu:r})}function uE(n,e){const t=e.key,r=t.path.canonicalString();n.Ru.get(t)||n.Iu.has(r)||(k(Co,"New document in limbo: "+t),n.Iu.add(r),bo(n))}function bo(n){for(;n.Iu.size>0&&n.Ru.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new O(Q.fromString(e)),r=n.fu.next();n.Au.set(r,new Xy(t)),n.Ru=n.Ru.insert(t,r),dh(n.remoteStore,new ht(je(vs(t.path)),r,"TargetPurposeLimboResolution",Is.ce))}}async function yr(n,e,t){const r=U(n),s=[],o=[],a=[];r.Tu.isEmpty()||(r.Tu.forEach((u,h)=>{a.push(r.pu(h,e,t).then(d=>{var p;if((d||t)&&r.isPrimaryClient){const y=d?!d.fromCache:(p=t==null?void 0:t.targetChanges.get(h.targetId))==null?void 0:p.current;r.sharedClientState.updateQueryState(h.targetId,y?"current":"not-current")}if(d){s.push(d);const y=Eo.Is(h.targetId,d);o.push(y)}}))}),await Promise.all(a),r.Pu.H_(s),await async function(h,d){const p=U(h);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",y=>P.forEach(d,R=>P.forEach(R.Ts,C=>p.persistence.referenceDelegate.addReference(y,R.targetId,C)).next(()=>P.forEach(R.Es,C=>p.persistence.referenceDelegate.removeReference(y,R.targetId,C)))))}catch(y){if(!Tn(y))throw y;k(Io,"Failed to update sequence numbers: "+y)}for(const y of d){const R=y.targetId;if(!y.fromCache){const C=p.vs.get(R),N=C.snapshotVersion,L=C.withLastLimboFreeSnapshotVersion(N);p.vs=p.vs.insert(R,L)}}}(r.localStore,o))}async function lE(n,e){const t=U(n);if(!t.currentUser.isEqual(e)){k(Co,"User change. New user:",e.toKey());const r=await ch(t.localStore,e);t.currentUser=e,function(o,a){o.mu.forEach(u=>{u.forEach(h=>{h.reject(new V(S.CANCELLED,a))})}),o.mu.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await yr(t,r.Ns)}}function hE(n,e){const t=U(n),r=t.Au.get(e);if(r&&r.hu)return $().add(r.key);{let s=$();const o=t.Eu.get(e);if(!o)return s;for(const a of o){const u=t.Tu.get(a);s=s.unionWith(u.view.nu)}return s}}function Ch(n){const e=U(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Ah.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=hE.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=oE.bind(null,e),e.Pu.H_=Ky.bind(null,e.eventManager),e.Pu.yu=Qy.bind(null,e.eventManager),e}function dE(n){const e=U(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=aE.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=cE.bind(null,e),e}class ds{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=bs(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return my(this.persistence,new dy,e.initialUser,this.serializer)}Cu(e){return new ah(yo.Vi,this.serializer)}Du(e){return new wy}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ds.provider={build:()=>new ds};class fE extends ds{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){W(this.persistence.referenceDelegate instanceof ls,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new J_(r,e.asyncQueue,t)}Cu(e){const t=this.cacheSizeBytes!==void 0?Ae.withCacheSize(this.cacheSizeBytes):Ae.DEFAULT;return new ah(r=>ls.Vi(r,t),this.serializer)}}class Bi{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>nu(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=lE.bind(null,this.syncEngine),await Hy(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Gy}()}createDatastore(e){const t=bs(e.databaseInfo.databaseId),r=Py(e.databaseInfo);return Ny(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,s,o,a,u){return new Oy(r,s,o,a,u)}(this.localStore,this.datastore,e.asyncQueue,t=>nu(this.syncEngine,t,0),function(){return Yc.v()?new Yc:new vy}())}createSyncEngine(e,t){return function(s,o,a,u,h,d,p){const y=new Zy(s,o,a,u,h,d);return p&&(y.gu=!0),y}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const o=U(s);k(jt,"RemoteStore shutting down."),o.Ia.add(5),await _r(o),o.Aa.shutdown(),o.Va.set("Unknown")}(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}Bi.provider={build:()=>new Bi};/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 *//**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class bh{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):Je("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const At="FirestoreClient";class pE{constructor(e,t,r,s,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=ye.UNAUTHENTICATED,this.clientId=io.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,async a=>{k(At,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(k(At,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new _t;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=So(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function mi(n,e){n.asyncQueue.verifyOperationInProgress(),k(At,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await ch(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function su(n,e){n.asyncQueue.verifyOperationInProgress();const t=await mE(n);k(At,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>Xc(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>Xc(e.remoteStore,s)),n._onlineComponents=e}async function mE(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){k(At,"Using user provided OfflineComponentProvider");try{await mi(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===S.FAILED_PRECONDITION||s.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;qt("Error using user provided cache. Falling back to memory cache: "+t),await mi(n,new ds)}}else k(At,"Using default OfflineComponentProvider"),await mi(n,new fE(void 0));return n._offlineComponents}async function Vh(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(k(At,"Using user provided OnlineComponentProvider"),await su(n,n._uninitializedComponentsProvider._online)):(k(At,"Using default OnlineComponentProvider"),await su(n,new Bi))),n._onlineComponents}function gE(n){return Vh(n).then(e=>e.syncEngine)}async function qi(n){const e=await Vh(n),t=e.eventManager;return t.onListen=eE.bind(null,e.syncEngine),t.onUnlisten=rE.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=tE.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=sE.bind(null,e.syncEngine),t}function _E(n,e,t,r){const s=new bh(r),o=new Ih(e,s,t);return n.asyncQueue.enqueueAndForget(async()=>yh(await qi(n),o)),()=>{s.Nu(),n.asyncQueue.enqueueAndForget(async()=>Eh(await qi(n),o))}}function yE(n,e,t={}){const r=new _t;return n.asyncQueue.enqueueAndForget(async()=>function(o,a,u,h,d){const p=new bh({next:R=>{p.Nu(),a.enqueueAndForget(()=>Eh(o,y));const C=R.docs.has(u);!C&&R.fromCache?d.reject(new V(S.UNAVAILABLE,"Failed to get document because the client is offline.")):C&&R.fromCache&&h&&h.source==="server"?d.reject(new V(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(R)},error:R=>d.reject(R)}),y=new Ih(vs(u.path),p,{includeMetadataChanges:!0,qa:!0});return yh(o,y)}(await qi(n),n.asyncQueue,e,t,r)),r.promise}function EE(n,e){const t=new _t;return n.asyncQueue.enqueueAndForget(async()=>iE(await gE(n),e,t)),t.promise}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function kh(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const IE="ComponentProvider",iu=new Map;function TE(n,e,t,r,s){return new jg(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,kh(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r)}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const Nh="firestore.googleapis.com",ou=!0;class au{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new V(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Nh,this.ssl=ou}else this.host=e.host,this.ssl=e.ssl??ou;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=oh;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Q_)throw new V(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}kg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=kh(e.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new V(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new V(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new V(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ns{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new au({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new V(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new V(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new au(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Tg;switch(r.type){case"firstParty":return new Rg(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new V(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=iu.get(t);r&&(k(IE,"Removing Datastore"),iu.delete(t),r.terminate())}(this),Promise.resolve()}}function wE(n,e,t,r={}){var d;n=qe(n,Ns);const s=lr(e),o=n._getSettings(),a={...o,emulatorOptions:n._getEmulatorOptions()},u=`${e}:${t}`;s&&wu(`https://${u}`),o.host!==Nh&&o.host!==u&&qt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h={...o,host:u,ssl:s,emulatorOptions:r};if(!xt(h,a)&&(n._setSettings(h),r.mockUserToken)){let p,y;if(typeof r.mockUserToken=="string")p=r.mockUserToken,y=ye.MOCK_USER;else{p=Od(r.mockUserToken,(d=n._app)==null?void 0:d.options.projectId);const R=r.mockUserToken.sub||r.mockUserToken.user_id;if(!R)throw new V(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");y=new ye(R)}n._authCredentials=new wg(new gl(p,y))}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Kt{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Kt(this.firestore,e,this._query)}}class re{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new yt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new re(this.firestore,e,this._key)}toJSON(){return{type:re._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(pr(t,re._jsonSchema))return new re(e,r||null,new O(Q.fromString(t.referencePath)))}}re._jsonSchemaVersion="firestore/documentReference/1.0",re._jsonSchema={type:oe("string",re._jsonSchemaVersion),referencePath:oe("string")};class yt extends Kt{constructor(e,t,r){super(e,t,vs(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new re(this.firestore,null,new O(e))}withConverter(e){return new yt(this.firestore,e,this._path)}}function KE(n,e,...t){if(n=te(n),_l("collection","path",e),n instanceof Ns){const r=Q.fromString(e,...t);return Ic(r),new yt(n,null,r)}{if(!(n instanceof re||n instanceof yt))throw new V(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Q.fromString(e,...t));return Ic(r),new yt(n.firestore,null,r)}}function vE(n,e,...t){if(n=te(n),arguments.length===1&&(e=io.newId()),_l("doc","path",e),n instanceof Ns){const r=Q.fromString(e,...t);return Ec(r),new re(n,null,new O(r))}{if(!(n instanceof re||n instanceof yt))throw new V(S.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Q.fromString(e,...t));return Ec(r),new re(n.firestore,n instanceof yt?n.converter:null,new O(r))}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const cu="AsyncQueue";class uu{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new lh(this,"async_queue_retry"),this._c=()=>{const r=pi();r&&k(cu,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=e;const t=pi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=pi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const t=new _t;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Yu.push(e),this.lc()))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!Tn(e))throw e;k(cu,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const t=this.ac.then(()=>(this.rc=!0,e().catch(r=>{throw this.nc=r,this.rc=!1,Je("INTERNAL UNHANDLED ERROR: ",lu(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=t,t}enqueueAfterDelay(e,t,r){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const s=Ro.createAndSchedule(this,e,t,r,o=>this.hc(o));return this.tc.push(s),s}uc(){this.nc&&x(47125,{Pc:lu(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ec(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ic(e){return this.Tc().then(()=>{this.tc.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()})}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function lu(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class $t extends Ns{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new uu,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new uu(e),this._firestoreClient=void 0,await e}}}function QE(n,e){const t=typeof n=="object"?n:Ru(),r=typeof n=="string"?n:ss,s=zi(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=Nd("firestore");o&&wE(s,...o)}return s}function Vo(n){if(n._terminated)throw new V(S.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||AE(n),n._firestoreClient}function AE(n){var r,s,o,a;const e=n._freezeSettings(),t=TE(n._databaseId,((r=n._app)==null?void 0:r.options.appId)||"",n._persistenceKey,(s=n._app)==null?void 0:s.options.apiKey,e);n._componentsProvider||(o=e.localCache)!=null&&o._offlineComponentProvider&&((a=e.localCache)!=null&&a._onlineComponentProvider)&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new pE(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&function(h){const d=h==null?void 0:h._online.build();return{_offline:h==null?void 0:h._offline.build(d),_online:d}}(n._componentsProvider))}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Ve{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ve(fe.fromBase64String(e))}catch(t){throw new V(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Ve(fe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Ve._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(pr(e,Ve._jsonSchema))return Ve.fromBase64String(e.bytes)}}Ve._jsonSchemaVersion="firestore/bytes/1.0",Ve._jsonSchema={type:oe("string",Ve._jsonSchemaVersion),bytes:oe("string")};/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Dh{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new V(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new de(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Oh{constructor(e){this._methodName=e}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class ze{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new V(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new V(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return j(this._lat,e._lat)||j(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:ze._jsonSchemaVersion}}static fromJSON(e){if(pr(e,ze._jsonSchema))return new ze(e.latitude,e.longitude)}}ze._jsonSchemaVersion="firestore/geoPoint/1.0",ze._jsonSchema={type:oe("string",ze._jsonSchemaVersion),latitude:oe("number"),longitude:oe("number")};/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Le{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0}(this._values,e._values)}toJSON(){return{type:Le._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(pr(e,Le._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new Le(e.vectorValues);throw new V(S.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Le._jsonSchemaVersion="firestore/vectorValue/1.0",Le._jsonSchema={type:oe("string",Le._jsonSchemaVersion),vectorValues:oe("object")};/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */const RE=/^__.*__$/;class SE{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Wt(e,this.data,this.fieldMask,t,this.fieldTransforms):new mr(e,this.data,t,this.fieldTransforms)}}function Lh(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw x(40011,{dataSource:n})}}class ko{constructor(e,t,r,s,o,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.Ac(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new ko({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}dc(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.i({path:t,arrayElement:!1});return r.mc(e),r}fc(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.i({path:t,arrayElement:!1});return r.Ac(),r}gc(e){return this.i({path:void 0,arrayElement:!0})}yc(e){return fs(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.mc(this.path.get(e))}mc(e){if(e.length===0)throw this.yc("Document fields must not be empty");if(Lh(this.dataSource)&&RE.test(e))throw this.yc('Document fields cannot begin and end with "__"')}}class PE{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||bs(e)}I(e,t,r,s=!1){return new ko({dataSource:e,methodName:t,targetDoc:r,path:de.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function No(n){const e=n._freezeSettings(),t=bs(n._databaseId);return new PE(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Mh(n,e,t,r,s,o={}){const a=n.I(o.merge||o.mergeFields?2:0,e,t,s);Uh("Data must be an object, but it was:",a,r);const u=xh(r,a);let h,d;if(o.merge)h=new Ne(a.fieldMask),d=a.fieldTransforms;else if(o.mergeFields){const p=[];for(const y of o.mergeFields){const R=Ds(e,y,t);if(!a.contains(R))throw new V(S.INVALID_ARGUMENT,`Field '${R}' is specified in your field mask but missing from your input data.`);kE(p,R)||p.push(R)}h=new Ne(p),d=a.fieldTransforms.filter(y=>h.covers(y.field))}else h=null,d=a.fieldTransforms;return new SE(new be(u),h,d)}function CE(n,e,t,r=!1){return Do(t,n.I(r?4:3,e))}function Do(n,e){if(Fh(n=te(n)))return Uh("Unsupported field value:",e,n),xh(n,e);if(n instanceof Oh)return function(r,s){if(!Lh(s.dataSource))throw s.yc(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.yc(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.yc("Nested arrays are not supported");return function(r,s){const o=[];let a=0;for(const u of r){let h=Do(u,s.gc(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}}(n,e)}return function(r,s){if((r=te(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return f_(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=J.fromDate(r);return{timestampValue:us(s.serializer,o)}}if(r instanceof J){const o=new J(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:us(s.serializer,o)}}if(r instanceof ze)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Ve)return{bytesValue:Xl(s.serializer,r._byteString)};if(r instanceof re){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.yc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:go(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Le)return function(a,u){const h=a instanceof Le?a.toArray():a;return{mapValue:{fields:{[Sl]:{stringValue:Cl},[is]:{arrayValue:{values:h.map(p=>{if(typeof p!="number")throw u.yc("VectorValues must only contain numeric values.");return ho(u.serializer,p)})}}}}}}(r,s);if(ih(r))return r._toProto(s.serializer);throw s.yc(`Unsupported field value: ${Es(r)}`)}(n,e)}function xh(n,e){const t={};return Il(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):zt(n,(r,s)=>{const o=Do(s,e.dc(r));o!=null&&(t[r]=o)}),{mapValue:{fields:t}}}function Fh(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof J||n instanceof ze||n instanceof Ve||n instanceof re||n instanceof Oh||n instanceof Le||ih(n))}function Uh(n,e,t){if(!Fh(t)||!yl(t)){const r=Es(t);throw r==="an object"?e.yc(n+" a custom object"):e.yc(n+" "+r)}}function Ds(n,e,t){if((e=te(e))instanceof Dh)return e._internalPath;if(typeof e=="string")return VE(n,e);throw fs("Field path arguments must be of type string or ",n,!1,void 0,t)}const bE=new RegExp("[~\\*/\\[\\]]");function VE(n,e,t){if(e.search(bE)>=0)throw fs(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Dh(...e.split("."))._internalPath}catch{throw fs(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function fs(n,e,t,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new V(S.INVALID_ARGUMENT,u+n+h)}function kE(n,e){return n.some(t=>t.isEqual(e))}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class NE{convertValue(e,t="none"){switch(wt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ne(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Tt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw x(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return zt(e,(s,o)=>{r[s]=this.convertValue(o,t)}),r}convertVectorValue(e){var r,s,o;const t=(o=(s=(r=e.fields)==null?void 0:r[is].arrayValue)==null?void 0:s.values)==null?void 0:o.map(a=>ne(a.doubleValue));return new Le(t)}convertGeoPoint(e){return new ze(ne(e.latitude),ne(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=ws(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(nr(e));default:return null}}convertTimestamp(e){const t=It(e);return new J(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=Q.fromString(e);W(sh(r),9688,{name:e});const s=new rr(r.get(1),r.get(3)),o=new O(r.popFirst(5));return s.isEqual(t)||Je(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),o}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class Bh extends NE{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ve(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new re(this.firestore,null,t)}}const hu="@firebase/firestore",du="4.14.0";/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function fu(n){return function(t,r){if(typeof t!="object"||t===null)return!1;const s=t;for(const o of r)if(o in s&&typeof s[o]=="function")return!0;return!1}(n,["next","error","complete"])}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */class qh{constructor(e,t,r,s,o){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new re(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new DE(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Ds("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class DE extends qh{data(){return super.data()}}/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function OE(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new V(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Oo{}class jh extends Oo{}function YE(n,e,...t){let r=[];e instanceof Oo&&r.push(e),r=r.concat(t),function(o){const a=o.filter(h=>h instanceof Mo).length,u=o.filter(h=>h instanceof Lo).length;if(a>1||a>0&&u>0)throw new V(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)n=s._apply(n);return n}class Lo extends jh{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new Lo(e,t,r)}_apply(e){const t=this._parse(e);return $h(e._query,t),new Kt(e.firestore,e.converter,Vi(e._query,t))}_parse(e){const t=No(e.firestore);return function(o,a,u,h,d,p,y){let R;if(d.isKeyField()){if(p==="array-contains"||p==="array-contains-any")throw new V(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${p}' queries on documentId().`);if(p==="in"||p==="not-in"){mu(y,p);const N=[];for(const L of y)N.push(pu(h,o,L));R={arrayValue:{values:N}}}else R=pu(h,o,y)}else p!=="in"&&p!=="not-in"&&p!=="array-contains-any"||mu(y,p),R=CE(u,a,y,p==="in"||p==="not-in");return ie.create(d,p,R)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}class Mo extends Oo{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Mo(e,t)}_parse(e){const t=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return t.length===1?t[0]:Me.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(s,o){let a=s;const u=o.getFlattenedFilters();for(const h of u)$h(a,h),a=Vi(a,h)}(e._query,t),new Kt(e.firestore,e.converter,Vi(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class xo extends jh{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new xo(e,t)}_apply(e){const t=function(s,o,a){if(s.startAt!==null)throw new V(S.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new V(S.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ir(o,a)}(e._query,this._field,this._direction);return new Kt(e.firestore,e.converter,i_(e._query,t))}}function JE(n,e="asc"){const t=e,r=Ds("orderBy",n);return xo._create(r,t)}function pu(n,e,t){if(typeof(t=te(t))=="string"){if(t==="")throw new V(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Ml(e)&&t.indexOf("/")!==-1)throw new V(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(Q.fromString(t));if(!O.isDocumentKey(r))throw new V(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Cc(n,new O(r))}if(t instanceof re)return Cc(n,t._key);throw new V(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Es(t)}.`)}function mu(n,e){if(!Array.isArray(n)||n.length===0)throw new V(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function $h(n,e){const t=function(s,o){for(const a of s)for(const u of a.getFlattenedFilters())if(o.indexOf(u.op)>=0)return u.op;return null}(n.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new V(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new V(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function zh(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}class Wn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Mt extends qh{constructor(e,t,r,s,o,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Qr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Ds("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new V(S.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Mt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Mt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Mt._jsonSchema={type:oe("string",Mt._jsonSchemaVersion),bundleSource:oe("string","DocumentSnapshot"),bundleName:oe("string"),bundle:oe("string")};class Qr extends Mt{data(e={}){return super.data(e)}}class cn{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Wn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new Qr(this._firestore,this._userDataWriter,r.key,r,new Wn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new V(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,o){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(u=>{const h=new Qr(s._firestore,s._userDataWriter,u.doc.key,u.doc,new Wn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:h,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(u=>o||u.type!==3).map(u=>{const h=new Qr(s._firestore,s._userDataWriter,u.doc.key,u.doc,new Wn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,p=-1;return u.type!==0&&(d=a.indexOf(u.doc.key),a=a.delete(u.doc.key)),u.type!==1&&(a=a.add(u.doc),p=a.indexOf(u.doc.key)),{type:LE(u.type),doc:h,oldIndex:d,newIndex:p}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new V(S.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=cn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=io.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach(o=>{o._document!==null&&(t.push(o._document),r.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),s.push(o.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function LE(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return x(61501,{type:n})}}/**
 *   
   *
 *   
 *
 *     
 *
   
 */cn._jsonSchemaVersion="firestore/querySnapshot/1.0",cn._jsonSchema={type:oe("string",cn._jsonSchemaVersion),bundleSource:oe("string","QuerySnapshot"),bundleName:oe("string"),bundle:oe("string")};/**
 *   
 *      
 *
 *   
 *
 *     
 *
   
 */function XE(n){n=qe(n,re);const e=qe(n.firestore,$t),t=Vo(e);return yE(t,n._key).then(r=>Hh(e,n,r))}function ZE(n,e,t){n=qe(n,re);const r=qe(n.firestore,$t),s=zh(n.converter,e,t),o=No(r);return Fo(r,[Mh(o,"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,Oe.none())])}function eI(n){return Fo(qe(n.firestore,$t),[new fo(n._key,Oe.none())])}function tI(n,e){const t=qe(n.firestore,$t),r=vE(n),s=zh(n.converter,e),o=No(n.firestore);return Fo(t,[Mh(o,"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,Oe.exists(!1))]).then(()=>r)}function nI(n,...e){var d,p,y;n=te(n);let t={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||fu(e[r])||(t=e[r++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(fu(e[r])){const R=e[r];e[r]=(d=R.next)==null?void 0:d.bind(R),e[r+1]=(p=R.error)==null?void 0:p.bind(R),e[r+2]=(y=R.complete)==null?void 0:y.bind(R)}let o,a,u;if(n instanceof re)a=qe(n.firestore,$t),u=vs(n._key.path),o={next:R=>{e[r]&&e[r](Hh(a,n,R))},error:e[r+1],complete:e[r+2]};else{const R=qe(n,Kt);a=qe(R.firestore,$t),u=R._query;const C=new Bh(a);o={next:N=>{e[r]&&e[r](new cn(a,C,R,N))},error:e[r+1],complete:e[r+2]},OE(n._query)}const h=Vo(a);return _E(h,u,s,o)}function Fo(n,e){const t=Vo(n);return EE(t,e)}function Hh(n,e,t){const r=t.docs.get(e._key),s=new Bh(n);return new Mt(n,s,e._key,r,new Wn(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){Ig(_n),un(new Ft("firestore",(r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),u=new $t(new vg(r.getProvider("auth-internal")),new Sg(a,r.getProvider("app-check-internal")),$g(a,s),a);return o={useFetchStreams:t,...o},u._setSettings(o),u},"PUBLIC").setMultipleInstances(!0)),pt(hu,du,e),pt(hu,du,"esm2020")})();export{yn as E,Ze as F,ct as G,Ru as a,WE as b,QE as c,dm as d,vE as e,XE as f,ME as g,ZE as h,Yf as i,KE as j,JE as k,eI as l,tI as m,$E as n,nI as o,HE as p,YE as q,BE as r,jE as s,xE as t,qE as u,zE as v,UE as w,FE as x};
