/* Velcendra: privacy-conscious first-party interaction events.
   No third-party analytics is activated until a measurement ID and consent approach are approved. */
(function(){
const allowed=['outbound_click','finder_result'];
window.velcendraEvent=function(name,details){
 if(!allowed.includes(name))return;
 window.dispatchEvent(new CustomEvent('velcendra:analytics',{detail:{name:name,properties:details||{}}}));
 // Future consent-controlled analytics integration belongs here.
};
document.addEventListener('click',function(event){
 const a=event.target.closest&&event.target.closest('a[href]');if(!a)return;
 let url;try{url=new URL(a.href,location.href)}catch(e){return}
 if(url.origin===location.origin||!/^https?:$/.test(url.protocol))return;
 const provider=url.hostname.replace(/^www\./,'');
 window.velcendraEvent('outbound_click',{provider:provider,affiliate:url.hostname==='shopify.pxf.io',page:location.pathname});
});
})();