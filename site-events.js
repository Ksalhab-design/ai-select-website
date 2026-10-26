/* Velcendra Google Analytics 4. Consent-first tracking.
   Measurement ID is public configuration, not a secret.
   Google Analytics loads only after a visitor opts in. */
(function(){
'use strict';
const measurementId='G-S0DYSG2Y39';
const storageKey='velcendra_analytics_consent';
const allowed=['outbound_click','finder_result'];
let consent=false,loaded=false;
try{consent=localStorage.getItem(storageKey)==='granted';}catch(e){}
function loadAnalytics(){
 if(loaded||!consent)return;
 loaded=true;
 window.dataLayer=window.dataLayer||[];
 window.gtag=function(){window.dataLayer.push(arguments);};
 window.gtag('js',new Date());
 window.gtag('config',measurementId,{send_page_view:true});
 const s=document.createElement('script');
 s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(measurementId);
 document.head.appendChild(s);
}
window.velcendraEvent=function(name,details){
 if(!allowed.includes(name))return;
 window.dispatchEvent(new CustomEvent('velcendra:analytics',{detail:{name:name,properties:details||{}}}));
 if(consent&&loaded&&typeof window.gtag==='function'){
  const properties=Object.assign({},details||{});
  window.gtag('event',name,properties);
 }
};
function saveConsent(value){
 const wasLoaded=loaded;
 consent=value==='granted';
 try{localStorage.setItem(storageKey,value);}catch(e){}
 if(consent)loadAnalytics();
 const panel=document.getElementById('velcendra-consent');if(panel)panel.remove();
 if(!consent&&wasLoaded)location.reload();
}
function showConsent(force){
 if(consent&&!force){loadAnalytics();return;}
 let decided=false;try{decided=localStorage.getItem(storageKey)==='denied';}catch(e){}
 if(decided&&!force)return;
 const panel=document.createElement('div');
 panel.id='velcendra-consent';panel.setAttribute('role','region');panel.setAttribute('aria-label','Analytics preferences');
 panel.style.cssText='position:fixed;bottom:12px;left:12px;right:12px;max-width:640px;z-index:9999;background:#fff;color:#14213a;border:1px solid #cdd6e2;box-shadow:0 5px 24px #0002;border-radius:12px;padding:16px;font:14px/1.5 system-ui,sans-serif';
 const message=document.createElement('p');message.style.margin='0 0 12px';message.textContent='May we use optional Google Analytics to understand visits and software referral clicks? You can decline and still use Velcendra.';
 const link=document.createElement('a');link.href='/privacy/';link.textContent='Privacy policy';link.style.marginRight='14px';
 const accept=document.createElement('button');accept.type='button';accept.textContent='Accept analytics';accept.style.cssText='padding:9px 12px;margin-right:8px;background:#1459e8;color:white;border:0;border-radius:6px;cursor:pointer';
 const decline=document.createElement('button');decline.type='button';decline.textContent='Decline';decline.style.cssText='padding:9px 12px;background:#f2f4f8;border:1px solid #bac4d1;border-radius:6px;cursor:pointer';
 accept.addEventListener('click',()=>saveConsent('granted'));
 decline.addEventListener('click',()=>saveConsent('denied'));
 panel.append(message,link,accept,decline);document.body.appendChild(panel);
}
document.addEventListener('click',function(event){
 const a=event.target.closest&&event.target.closest('a[href]');if(!a)return;
 let url;try{url=new URL(a.href,location.href);}catch(e){return;}
 if(url.origin===location.origin||!/^https?:$/.test(url.protocol))return;
 const provider=url.hostname.replace(/^www\./,'');
 window.velcendraEvent('outbound_click',{provider:provider,affiliate:url.hostname==='shopify.pxf.io',page:location.pathname});
});
function init(){
 const control=document.createElement('button');
 control.type='button';control.textContent='Analytics preferences';
 control.setAttribute('aria-label','Change analytics preferences');
 control.style.cssText='position:fixed;bottom:0;right:0;z-index:9998;background:#fff;color:#243b5a;border:1px solid #cbd5e1;border-radius:8px 0 0 0;padding:5px 9px;font:12px system-ui,sans-serif;cursor:pointer';
 control.addEventListener('click',function(){const existing=document.getElementById('velcendra-consent');if(existing)existing.remove();showConsent(true);});
 document.body.appendChild(control);
 showConsent(false);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();