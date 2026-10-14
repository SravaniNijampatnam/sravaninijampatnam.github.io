(function(){'use strict';
var d=document,root=d.documentElement,$=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ---- links for LinkedIn / GitHub: add yours here (leave empty to hide) ---- */
var SOCIAL={LinkedIn:'',GitHub:''};
var soc=$('#social');Object.keys(SOCIAL).forEach(function(k){if(SOCIAL[k]){var a=d.createElement('a');a.className='btn';a.textContent=k;a.href=SOCIAL[k];a.target='_blank';a.rel='noopener';soc.appendChild(a)}});
/* ---- theme ---- */
var tb=$('#theme');function setTheme(t){root.dataset.theme=t;tb.innerHTML=t==='light'?'&#9790;':'&#9788;';try{localStorage.setItem('theme',t)}catch(e){}}
var saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
setTheme(saved||'dark');
tb.addEventListener('click',function(){setTheme(root.dataset.theme==='light'?'dark':'light')});
/* ---- mobile menu ---- */
var burger=$('#burger'),menu=$('#menu');
burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
$$('#menu a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');burger.setAttribute('aria-expanded',false)})});
/* ---- reveal on scroll (content is always visible if this fails) ---- */
var rev=$$('.reveal');
if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});rev.forEach(function(el){io.observe(el)});setTimeout(function(){rev.forEach(function(el){el.classList.add('in')})},6000)}
else rev.forEach(function(el){el.classList.add('in')});
/* ---- counters ---- */
function count(el){var to=parseFloat(el.dataset.count),dec=+el.dataset.dec||0,suf=el.dataset.suffix||'';if(reduce){el.textContent=to.toFixed(dec)+suf;return}
var t0=performance.now();(function f(t){var p=Math.min((t-t0)/1200,1),e=1-Math.pow(1-p,3);el.textContent=(to*e).toFixed(dec)+(p===1?suf:'');if(p<1)requestAnimationFrame(f)})(t0)}
if('IntersectionObserver' in window){var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);co.unobserve(e.target)}})},{threshold:.6});$$('[data-count]').forEach(function(el){co.observe(el)})}
/* ---- scroll progress, timeline draw, active nav ---- */
var bar=$('#progress'),tl=$('.timeline'),links=$$('#menu a'),secs=links.map(function(a){return $(a.getAttribute('href'))});
var nav=$('.nav');function onScroll(){nav.classList.toggle('show',scrollY>innerHeight*.45);var h=root.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')';
if(tl){var r=tl.getBoundingClientRect();tl.style.setProperty('--tl',Math.max(0,Math.min(1,(innerHeight*.6-r.top)/r.height)))}
var cur=-1;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<innerHeight*.4)cur=i});links.forEach(function(a,i){a.classList.toggle('on',i===cur)})}
addEventListener('scroll',function(){requestAnimationFrame(onScroll)},{passive:true});onScroll();
/* ---- 3D tilt on cards (desktop) ---- */
if(!reduce&&matchMedia('(hover:hover)').matches){$$('.tilt').forEach(function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(800px) rotateY('+x*7+'deg) rotateX('+-y*7+'deg) translateY(-3px)'});c.addEventListener('pointerleave',function(){c.style.transform=''})})}
/* ---- contact form -> mailto ---- */
$('#form').addEventListener('submit',function(e){e.preventDefault();var f=e.target,n=f.name.value.trim(),m=f.msg.value.trim(),em=f.email.value.trim();
location.href='mailto:nijampatnamsravani12@gmail.com?subject='+encodeURIComponent('Portfolio message from '+n)+'&body='+encodeURIComponent(m+'\n\n'+n+'\n'+em)});
$('#year').textContent=new Date().getFullYear();
})();
