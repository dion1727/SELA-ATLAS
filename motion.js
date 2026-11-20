'use strict';
(() => {
 const fine = matchMedia('(any-hover:hover) and (any-pointer:fine)');
 const screen = $('.cine-screen'), cover = $('#sampul');
 const shots = [
   {title:['Ke mana','kita pergi?'],kicker:'Atlas perjalanan',copy:'Buka kartu pos dari 18 destinasi, lalu pilih tempat yang ingin kamu kunjungi.',to:'#indeks',action:'Jelajahi destinasi'},
   {title:['Pagi di','Tegallalang.'],kicker:'Gianyar, Bali',copy:'Dari atas lembah, petak sawah terlihat bertingkat di antara pohon kelapa. Ikuti pematang untuk melihatnya dari dekat.',to:'#tempat/bali',action:'Jelajahi Tegallalang'},
   {title:['Senja di','Venesia.'],kicker:'Grand Canal, Italia',copy:'Naik ke Jembatan Rialto menjelang senja. Di bawahnya, vaporetto dan perahu kayu berselisih di tikungan kanal.',to:'#tempat/venezia',action:'Jelajahi Venesia'}
 ];
 const images = $$('.scene-photo'), shotButtons = $$('[data-scene]');
 let chapter=0, scrollFrame=0, coverInView=true;
 function entrance(elements, distance=22) {
   if(reduced.matches)return;
   elements.forEach((el,i)=>el.animate([{opacity:0,transform:'translateY('+distance+'px)'},{opacity:1,transform:'none'}],{duration:610,delay:i*53,fill:'backwards',easing:'cubic-bezier(.19,.73,.22,1)'}));
 }
 function showShot(n,force=false) {
   if(chapter===n&&!force)return;chapter=n;
   const s=shots[n];images.forEach((im,i)=>im.classList.toggle('active',i===n));shotButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));
   $('#scene-kicker').textContent=s.kicker;$('#hero-heading span').textContent=s.title[0];$('#hero-heading em').textContent=s.title[1];$('#scene-summary').textContent=s.copy;
   $('#scene-cta').href=s.to;$('#scene-cta span').textContent=s.action;$('#chapter-count').textContent=(n+1)+' dari '+shots.length;
   entrance([$('#scene-kicker'),$('#hero-heading span'),$('#hero-heading em'),$('#scene-summary'),$('#scene-cta')]);
 }
 function syncScroll(){
   scrollFrame=0;if($('#home').hidden||!coverInView||reduced.matches)return;
   const box=cover.getBoundingClientRect(), range=Math.max(1,box.height-screen.offsetHeight);
   const progress=Math.max(0,Math.min(1,(parseFloat(getComputedStyle(screen).top)-box.top)/range));
   showShot(progress<.32?0:progress<.72?1:2);
 }
 window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(syncScroll);},{passive:true});
 new IntersectionObserver(([entry])=>{coverInView=entry.isIntersecting;if(coverInView)syncScroll()}).observe(cover);
 shotButtons.forEach((b,n)=>b.addEventListener('click',()=>{
   if(!reduced.matches){const y=scrollY+cover.getBoundingClientRect().top-parseFloat(getComputedStyle(screen).top)+[0,.49,.88][n]*Math.max(0,cover.offsetHeight-screen.offsetHeight);window.scrollTo({top:y,behavior:'instant'});}
   showShot(n);
 }));
 $('#scene-cta').addEventListener('click',e=>{
   if(chapter===0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
   e.preventDefault();openDest(shots[chapter].to.split('/')[1],images[chapter]);
 });
 function toCards(){if(location.hash==='#kartu')$('#kartu').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});else location.hash='kartu'}
 $('#jump-atlas').addEventListener('click',toCards);

 const drawer=$('#menu-drawer'),menuButton=$('#menu-toggle'),credits=$('#credits-dialog');
 $$('#menu-drawer nav a').forEach((a,i)=>a.style.setProperty('--item',i));
 let closeTimer=0;
 function closeMenu(immediate=false){
   if(!drawer.open)return;
   if(immediate===true||reduced.matches){clearTimeout(closeTimer);drawer.close();return}
   if(drawer.classList.contains('closing'))return;
   drawer.classList.add('closing');closeTimer=setTimeout(()=>drawer.close(),220);
 }
 drawer.addEventListener('cancel',event=>{event.preventDefault();closeMenu()});
 menuButton.onclick=()=>{drawer.classList.remove('closing');drawer.showModal();menuButton.setAttribute('aria-expanded','true');hidePointer();};
 $('#menu-close').onclick=closeMenu;
 drawer.addEventListener('close',()=>{drawer.classList.remove('closing');menuButton.setAttribute('aria-expanded','false')});
 drawer.addEventListener('click',e=>{if(e.target===drawer){const r=drawer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)closeMenu()}else if(e.target.closest('nav a')){closeMenu();if(e.target.closest('a').hash==='#kartu'&&location.hash==='#kartu')toCards()}});
 const photoNames={departure:'Terbit dari udara',air:'Jendela pesawat',bali:'Tegallalang',lisboa:'Lisboa',venezia:'Venesia',kyoto:'Kyoto'};
 $('#credits-list').innerHTML=Object.entries(PHOTO_CREDITS).map(([key,c])=>'<li><span>'+(byId.get(key)?.name||photoNames[key])+'</span><a href="'+c.url+'" target="_blank" rel="noopener">'+c.name+'</a></li>').join('');
 $$('[data-credits]').forEach(b=>b.onclick=()=>{closeMenu(true);credits.showModal();hidePointer()});
 $('#credit-close').onclick=()=>credits.close();
 credits.addEventListener('click',e=>{if(e.target!==credits)return;const r=credits.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)credits.close()});


 const plane=$('#plane-pointer');
 let planeFrame=0,planeVisible=false,targetX=0,targetY=0,planeX=0,planeY=0,heading=-35,wantedHeading=-35;
 function pointerAllowed(){return fine.matches&&!reduced.matches&&!document.hidden}
 function hidePointer(){planeVisible=false;plane.hidden=true;document.documentElement.classList.remove('flying');cancelAnimationFrame(planeFrame);planeFrame=0}
 function fly(){
   planeFrame=0;if(!planeVisible)return;
   planeX+=(targetX-planeX)*.63;planeY+=(targetY-planeY)*.63;
   const turn=((wantedHeading-heading+540)%360+360)%360-180;
   heading+=turn*.25;
   plane.style.transform='translate3d('+planeX+'px,'+planeY+'px,0)';
   plane.firstElementChild.style.transform='translate(-50%, -50%) rotate('+heading+'deg)';
   if(Math.abs(targetX-planeX)+Math.abs(targetY-planeY)>.18||Math.abs(turn)>.4)planeFrame=requestAnimationFrame(fly);
 }
 document.addEventListener('pointermove',e=>{
   if(e.pointerType!=='mouse'||!pointerAllowed()||e.target.closest('dialog,input,textarea,select,#globe')){hidePointer();return}
   const dx=e.clientX-targetX,dy=e.clientY-targetY;
   targetX=e.clientX;targetY=e.clientY;
   if(!planeVisible){planeX=targetX;planeY=targetY;planeVisible=true;plane.hidden=false;document.documentElement.classList.add('flying')}
   else if(Math.hypot(dx,dy)>1.5)wantedHeading=Math.atan2(dy,dx)*180/Math.PI+90;
   plane.classList.toggle('navigating',!!e.target.closest('a,button,summary'));
   if(!planeFrame)planeFrame=requestAnimationFrame(fly);
 },{passive:true});
 document.documentElement.addEventListener('pointerleave',hidePointer);
 window.addEventListener('blur',hidePointer);
 document.addEventListener('keydown',e=>{if(e.key==='Tab')hidePointer()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hidePointer()});
 const motionButton=$('#toggle-motion');
 function syncPreference(){
   document.documentElement.classList.toggle('low-motion',reduced.matches);
   motionButton.disabled=systemMotion.matches;motionButton.setAttribute('aria-pressed',String(!reduced.matches));
   motionButton.querySelector('b').textContent=systemMotion.matches?'Dikurangi oleh perangkat':motionOff?'Nonaktif':'Aktif';
   if(!pointerAllowed())hidePointer();
   if(reduced.matches)$$('.card-flight').forEach(el=>el.remove());
   document.dispatchEvent(new Event('sela:motion'));
 }
 motionButton.onclick=()=>{motionOff=!motionOff;try{localStorage.setItem('sela.motion',motionOff?'off':'on')}catch{}syncPreference()};
 systemMotion.addEventListener('change',syncPreference);fine.addEventListener('change',syncPreference);
 let lit=null;
 document.addEventListener('pointermove',e=>{
   const el=e.pointerType==='mouse'&&pointerAllowed()?e.target.closest('.tile-img'):null;
   if(lit!==el){lit?.classList.remove('edge-lit');lit=el}
   if(!el)return;const b=el.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;
   el.style.setProperty('--gx',x+'px');el.style.setProperty('--gy',y+'px');el.classList.toggle('edge-lit',Math.min(x,y,b.width-x,b.height-y)<48);
 },{passive:true});
 const reveal=new IntersectionObserver(entries=>{entries.forEach(entry=>{
   if(!entry.isIntersecting)return;reveal.unobserve(entry.target);if(reduced.matches)return;
   const el=entry.target;el.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],{duration:660,delay:(Number(el.dataset.order)||0)*52,easing:'cubic-bezier(.18,.78,.23,1)',fill:'backwards'});
 })},{threshold:.1});
 function revealContent(){[...document.querySelectorAll('#home .tile,#collection .tile,.plan-item,.itinerary,.studio-location')].filter(el=>el.getClientRects().length).forEach((el,i)=>{el.dataset.order=i%3;reveal.observe(el)})}
 document.addEventListener('sela:tiles',revealContent);
 document.addEventListener('sela:route',()=>{hidePointer();closeMenu();revealContent();if(!$('#home').hidden)requestAnimationFrame(syncScroll)});
 const label=$('#studio-kicker'),cards=$('#view-cards'),globeBtn=$('#view-globe'),view=$('#globe-view');
 let globe=null,globeLoading=null;
 async function setView(isGlobe){
   $('#route-tool').hidden=!isGlobe;deck.hidden=isGlobe;view.hidden=!isGlobe;cards.setAttribute('aria-pressed',String(!isGlobe));globeBtn.setAttribute('aria-pressed',String(isGlobe));
   label.textContent=isGlobe?'Globe':'Kartu pos';$('#deck-hint').textContent=isGlobe?'Seret untuk memutar. Pilih titik untuk membuka kartu pos.':'Geser atau ketuk untuk melihat kartu berikutnya.';
   if(isGlobe){try{if(!globe){globeLoading??=import('./globe.js').then(({makeGlobe})=>makeGlobe($('#globe'),id=>changeSlide(DESTINATIONS.findIndex(d=>d.id===id)-slide),()=>reduced.matches));globe=await globeLoading}if(!view.hidden){globe.show(DESTINATIONS[slide].id);applyRoute()}}catch{globeLoading=null;setView(false);notify('Globe belum bisa dimuat. Kartu pos tetap tersedia.')}}
   else globe?.hide();
 }
 cards.onclick=()=>{if(location.hash==='#peta')location.hash='kartu';setView(false)};globeBtn.onclick=()=>setView(true);
 const from=$('#route-from'),to=$('#route-to'),tool=$('#route-tool');
 for(const sel of [from,to])for(const d of [...DESTINATIONS].sort((a,b)=>a.name.localeCompare(b.name,'id')))sel.add(new Option(d.name,d.id));
 from.value='bali';to.value=byId.has('sydney')?'sydney':'kyoto';
 function applyRoute(){
   if(!tool.open||tool.hidden){globe?.route(null);return}
   const a=LOCATIONS[from.value],b=LOCATIONS[to.value],rad=Math.PI/180;
   const h=Math.sin((b[0]-a[0])*rad/2)**2+Math.cos(a[0]*rad)*Math.cos(b[0]*rad)*Math.sin((b[1]-a[1])*rad/2)**2;
   const distance=12742*Math.asin(Math.sqrt(Math.min(1,h)));
   $('#route-distance').textContent=from.value===to.value?'Pilih dua destinasi berbeda.':'Sekitar '+Math.round(distance).toLocaleString('id-ID')+' km';
   globe?.route(from.value===to.value?null:[from.value,to.value]);
 }
 tool.addEventListener('toggle',applyRoute);from.onchange=to.onchange=applyRoute;
 $('#zoom-in').onclick=()=>globe?.zoom(1);$('#zoom-out').onclick=()=>globe?.zoom(-1);$('#globe-center').onclick=()=>{tool.open=false;globe?.home()};
 function syncGlobeRoute(){if($('#home').hidden){globe?.hide();return}if(location.hash==='#peta'){setView(true)}else if(location.hash==='#kartu'){setView(false)}else if(!view.hidden)globe?.show(DESTINATIONS[slide].id)}

 document.addEventListener('sela:slide',e=>{if(!view.hidden){if(tool.open)tool.open=false;globe?.select(e.detail)}entrance([$('#studio-title'),$('#studio-location'),$('#studio-intro')],9)});
 document.addEventListener('sela:route',syncGlobeRoute);syncGlobeRoute();

 syncPreference();showShot(chapter,true);revealContent();
})();
