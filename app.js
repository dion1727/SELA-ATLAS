'use strict';
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const icons = {
  suitcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M7 8v12m10-12v12"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16.5 7.5-3 6-6 3 3-6z"/>',
  left:'<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',right:'<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',up:'<path d="m5 13 7-7 7 7M12 6v13"/>',down:'<path d="m6 9 6 6 6-6"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',bookmark:'<path d="M6 4.5c0-.8.7-1.5 1.5-1.5h9c.8 0 1.5.7 1.5 1.5V21l-6-4-6 4z"/>',
  close:'<path d="m6 6 12 12m0-12L6 18"/>',place:'<path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.4"/>',
  coast:'<path d="M2 14q2-2 4 0t4 0 4 0 4 0 4 0M2 18q2-2 4 0t4 0 4 0 4 0 4 0M6 10a6 6 0 0 1 12 0"/>',
  mountain:'<path d="m2 20 8-14 9 14H2zm9-12 2-3 9 15h-3M7 12l3 2 2-2"/>',city:'<path d="M3 21V8h6v13m0-17h9v17m0-10h3v10M2 21h20M12 8h2m-2 4h2m-2 4h2"/>',check:'<path d="m4 12 5 5L20 6"/>'
};
function svg(key){return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">'+(icons[key]||'')+'</svg>'}
$$('[data-icon]').forEach(el=>el.outerHTML=svg(el.dataset.icon));
const byId = new Map(DESTINATIONS.map(d=>[d.id,d]));
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
let motionOff = false;
try { motionOff = localStorage.getItem('sela.motion') === 'off'; } catch {}
const reduced = {get matches(){return systemMotion.matches || motionOff;}};
document.documentElement.classList.toggle('low-motion',reduced.matches);
const kindIcon={Kota:'city',Alam:'mountain',Pesisir:'coast'};
const categories=['Semua','Alam','Kota','Pesisir'];
let slide=0,category='Semua',region='',query='',route='',lastList='jelajahi',returnY=0,flight=null,originPhoto=null,toastTimer,drag=null,ignoreClickUntil=0;
const storageKey='sela.atlas.v1';
function readState(){
 try{const s=JSON.parse(localStorage.getItem(storageKey)||'{}');return {saved:[...new Set((Array.isArray(s.saved)?s.saved:[]).filter(id=>byId.has(id)))],plans:(Array.isArray(s.plans)?s.plans:[]).filter(p=>p&&byId.has(p.id)&&/^\d{4}-\d{2}-\d{2}$/.test(p.date)&&[1,2,3].includes(p.days)&&typeof p.note==='string')}}
 catch{return {saved:[],plans:[]}}
}
let state=readState();
function notify(msg){const el=$('#toast');el.textContent=msg;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2100)}
function persist(msg){try{localStorage.setItem(storageKey,JSON.stringify(state));notify(msg)}catch{notify('Perubahan berlaku untuk sesi ini. Penyimpanan browser tidak tersedia.')}}
function escapeHTML(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const photo=(d,cls='',lazy=false)=>'<img class="'+cls+'" src="./assets/'+d.id+'.webp" alt="'+d.alt+'" style="object-position:'+d.pos+'" '+(lazy?'loading="lazy"':'')+' draggable="false">';
function stamp(d){
 const arc='seal-'+d.id;
 return '<svg class="seal" viewBox="0 0 100 100" aria-hidden="true" style="color:'+d.color+'"><defs><path id="'+arc+'" d="M17 50a33 33 0 1 1 66 0a33 33 0 1 1-66 0"/></defs><g fill="none" stroke="currentColor"><circle cx="50" cy="50" r="46" stroke-width="1.7"/><circle cx="50" cy="50" r="42" stroke-width=".8"/><circle cx="50" cy="50" r="27" stroke-dasharray="2 3"/></g><text font-family="monospace" font-size="9.6" font-weight="bold" letter-spacing="1.05" fill="currentColor"><textPath href="#'+arc+'" textLength="204">SELA • POS UDARA • '+d.code+' • </textPath></text><path d="m29 54 17-6 4-15 5-2-1 15 13-5q4-1 5 0t-3 4l-14 7-1 12-3 2-3-12-12 4z" fill="currentColor"/></svg>'
}
function buildDeck(){
 $('#deck').innerHTML=DESTINATIONS.map((d,i)=>'<button class="postcard" type="button" data-i="'+i+'" aria-label="Pindahkan kartu '+d.name+' ke belakang"><span class="picture">'+photo(d).replace(' src=',' data-src=')+'</span><span class="post-foot"><span class="post-name">'+d.name+'</span><span class="post-country">'+d.country+'</span>'+stamp(d)+'</span></button>').join('');
 paintDeck();
}
function paintDeck(){
 const n=DESTINATIONS.length;
 $$('.postcard[data-i]').forEach((el,i)=>{let pos=(i-slide+n)%n;if(pos>n/2)pos-=n;el.dataset.pos=pos;const im=el.querySelector('img[data-src]');if(im&&Math.abs(pos)<=2){im.src=im.dataset.src;delete im.dataset.src}el.tabIndex=pos===0?0:-1;el.setAttribute('aria-hidden',String(pos!==0))});
 $('#slide-count').innerHTML='<b>'+(slide+1)+'</b> dari '+n+'<span class="sr">, '+DESTINATIONS[slide].name+'</span>';
 const d=DESTINATIONS[slide];
 $('#studio-title').textContent=d.name;$('#studio-location').textContent=d.area+', '+d.country;
 $('#studio-intro').textContent=d.intro;$('#studio-open').href='#tempat/'+d.id;
 document.dispatchEvent(new CustomEvent('sela:slide',{detail:d.id}));
}
function changeSlide(step){
 const count=DESTINATIONS.length;
 if(step===0)return;
 const old=$('.postcard[data-pos="0"]');
 const transferFocus=deck.contains(document.activeElement);
 slide=(slide+step+count)%count;
 if(old && !reduced.matches && !deck.hidden){
   const direction=step>0?-1:1;
   const clone=old.cloneNode(true);
   clone.removeAttribute('data-i');clone.removeAttribute('data-pos');clone.removeAttribute('aria-label');
   clone.className='postcard card-flight';clone.tabIndex=-1;clone.setAttribute('aria-hidden','true');
   clone.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
   deck.querySelector('.card-flight')?.remove();deck.append(clone);
   const base='translate(-50%,-50%) rotate(-5deg)';
   const anim=clone.animate([{transform:base,opacity:1},{transform:'translate(calc(-50% + '+(direction*85)+'%),-67%) rotate('+(direction*23)+'deg) scale(.93)',opacity:.96,offset:.54},{transform:'translate(calc(-50% + '+(direction*55)+'%),-57%) rotate('+(direction*14)+'deg) scale(.68)',opacity:0}],{duration:570,easing:'cubic-bezier(.3,.64,.25,1)',fill:'both'});
   anim.onfinish=()=>clone.remove();
 }
 if(transferFocus){const next=deck.querySelector('[data-i="'+slide+'"]');next.removeAttribute('aria-hidden');next.focus({preventScroll:true})}
 paintDeck();
}
$('#studio-open').addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;e.preventDefault();openDest(DESTINATIONS[slide].id,deck.hidden?null:$('.postcard[data-pos="0"] img'))});
$('#prev').onclick=()=>changeSlide(-1);$('#next').onclick=()=>changeSlide(1);
const deck=$('#deck');
function resetTilt(){for(const p of ['--dx','--dy','--tilt','--shine-x'])deck.style.removeProperty(p)}
function hideTip(){resetTilt()}
let wheelTotal=0, lastWheel=0, lastShift=0;
deck.addEventListener('wheel',e=>{
 const amount=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.shiftKey?e.deltaY:0;
 if(!amount)return;
 e.preventDefault();
 const t=performance.now();
 if(t-lastWheel>140)wheelTotal=0;
 lastWheel=t;
 if(t-lastShift<440)return;
 wheelTotal+=amount;
 if(Math.abs(wheelTotal)>24){changeSlide(Math.sign(wheelTotal));wheelTotal=0;lastShift=t}
},{passive:false});
deck.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};hideTip()});
deck.addEventListener('pointermove',e=>{
 if(drag&&drag.id===e.pointerId){const d=e.clientX-drag.x;if(Math.abs(d)>9&&Math.abs(d)>Math.abs(e.clientY-drag.y)){if(!drag.moved)deck.setPointerCapture(e.pointerId);drag.moved=true;deck.style.removeProperty('--tilt');deck.style.setProperty('--dx',Math.max(-34,Math.min(34,d*.28))+'px')}return}
 if(e.pointerType!=='mouse'||reduced.matches||!e.target.closest('[data-pos="0"]')){hideTip();return}
 const b=deck.getBoundingClientRect(),fraction=(e.clientX-b.left)/b.width;
 deck.style.setProperty('--tilt',((fraction-.5)*14)+'deg');deck.style.setProperty('--shine-x',(fraction*100)+'%')

});
deck.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x;if(drag.moved){ignoreClickUntil=performance.now()+350;if(Math.abs(dx)>30)changeSlide(dx<0?1:-1)}drag=null;resetTilt()});
deck.addEventListener('pointercancel',()=>{drag=null;resetTilt()});deck.addEventListener('pointerleave',()=>{if(!drag)resetTilt();hideTip()});
deck.addEventListener('click',e=>{if(performance.now()<ignoreClickUntil)return;const card=e.target.closest('.postcard');if(!card)return;const pos=Number(card.dataset.pos);if(pos!==0){changeSlide(pos);return}changeSlide(1)});
$('.gallery').addEventListener('keydown',e=>{if(e.target.id!=='globe'&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();changeSlide(e.key==='ArrowRight'?1:-1);if(e.target.classList.contains('postcard'))$('.postcard[data-pos="0"]').focus()}});

function contours(){
 const c=$('#contour'), b=c.getBoundingClientRect();if(!b.width||!b.height)return;
 const ratio=Math.min(devicePixelRatio||1,2);c.width=b.width*ratio;c.height=b.height*ratio;const ctx=c.getContext('2d');ctx.scale(ratio,ratio);ctx.strokeStyle='rgba(91,111,80,.20)';ctx.lineWidth=.8;
 for(let k=0;k<37;k++){const radius=22+k*9;ctx.beginPath();for(let j=0;j<=240;j++){const t=j*Math.PI/120;const wave=1+.13*Math.cos(3*t+.4)+.07*Math.sin(5*t+k*.028)+.048*Math.cos(7*t+.9);const x=b.width*.52+radius*wave*Math.cos(t)*1.48;const y=b.height*.47+radius*wave*Math.sin(t)*.93;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.closePath();ctx.stroke()}
}
new ResizeObserver(contours).observe($('.gallery'));

function tile(d){const s=state.saved.includes(d.id);
 return '<article class="tile"><a href="#tempat/'+d.id+'" data-open="'+d.id+'"><div class="tile-img">'+photo(d,'',true)+'</div><div class="tile-area">'+d.country+'</div><div class="tile-end"><h3>'+d.name+'</h3><span class="tile-category">'+svg(kindIcon[d.category])+'<span>'+d.category+'</span></span></div></a><button class="bookmark" data-save="'+d.id+'" aria-pressed="'+s+'" aria-label="'+(s?'Hapus dari simpanan':'Simpan')+' '+d.name+'">'+svg('bookmark')+'</button></article>'
}
function showTiles(){
 $('#filters').innerHTML=categories.map(c=>'<button class="filter" data-filter="'+c+'" aria-pressed="'+(category===c)+'">'+c+'</button>').join('');
 const found=DESTINATIONS.filter(d=>(!region||region===d.region)&&(category==='Semua'||category===d.category)&&[d.name,d.country,d.area,d.region].join(' ').toLocaleLowerCase('id').includes(query.trim().toLocaleLowerCase('id')));
 $('#tiles').innerHTML=found.length?found.map(tile).join(''):'<div class="empty"><h3>Destinasi belum ditemukan</h3><p>Coba nama kota, negara, atau kategori lain.</p><button class="button secondary" data-do="reset">Tampilkan semua destinasi</button></div>';
 document.dispatchEvent(new Event('sela:tiles'));
 $('#index-count').textContent='('+String(found.length).padStart(2,'0')+')';$('#index-live').textContent=found.length+' destinasi ditampilkan.'
}
$('#query').oninput=e=>{query=e.target.value;showTiles()};
function renderCollection(){const saved=DESTINATIONS.filter(d=>state.saved.includes(d.id));
 $('#collection').innerHTML='<h1>Destinasi tersimpan</h1>'+(saved.length?'<div class="tiles">'+saved.map(tile).join('')+'</div>':'<div class="empty"><img class="empty-picture" src="./assets/journal.webp" alt="Tulisan tentang perjalanan di sebuah etalase"><h2>Simpan kartu pos pertamamu</h2><p>Ketuk ikon penanda pada foto destinasi yang ingin kamu kunjungi.</p><a class="button primary" href="#indeks">Lihat destinasi</a></div>')}
function formatDate(date){return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric'}).format(new Date(date+'T12:00:00'))}
function planRow(p){const d=byId.get(p.id);
 return '<article class="plan-item">'+photo(d)+'<div><span class="date-label">'+formatDate(p.date)+' · '+p.days+' hari</span><h3><a href="#tempat/'+d.id+'" data-open="'+d.id+'">'+d.name+'</a></h3><p class="plan-note">'+escapeHTML(p.note)+'</p><details><summary>Agenda perjalanan '+svg('down')+'</summary><ol>'+d.days.slice(0,p.days).map(item=>'<li><strong>'+item[0]+'</strong><p class="day-text">'+item[1]+'</p></li>').join('')+'</ol></details><div class="plan-actions"><button class="text-button" data-plan="'+d.id+'">Ubah rencana</button><button class="text-button" data-remove="'+d.id+'">Hapus</button></div></div></article>'
}
function renderPlans(){const rows=[...state.plans].sort((a,b)=>a.date.localeCompare(b.date));
 $('#plans').innerHTML='<h1>Rencana saya</h1>'+(rows.length?'<p class="page-intro">Diurutkan menurut tanggal berangkat.</p><div class="plan-list">'+rows.map(planRow).join('')+'</div>':'<div class="empty"><img class="empty-picture" src="./assets/hills.webp" alt="Perbukitan hijau di bawah awan putih"><h2>Mau berangkat ke mana?</h2><p>Buka kartu pos destinasi, lalu pilih “Susun rencana” untuk menentukan tanggal dan durasi.</p><a class="button primary" href="#indeks">Pilih destinasi</a></div>')}
function itinerary(d){
 return '<section class="itinerary"><h2 class="section-title">Ide perjalanan</h2>'+d.days.map((x,i)=>'<details '+(i===0?'open':'')+'><summary><span><small>Hari '+(i+1)+'</small> '+x[0]+'</span>'+svg('down')+'</summary><p class="day-text">'+x[1]+'</p></details>').join('')+'</section>';
}
function renderDetail(d){const s=state.saved.includes(d.id),planned=state.plans.some(p=>p.id===d.id);
 $('#detail').innerHTML='<a class="back" href="#'+lastList+'">'+svg('left')+(lastList==='tersimpan'?'Tersimpan':lastList==='rencana'?'Rencana saya':'Kembali ke destinasi')+'</a><div class="detail-grid"><div>'+photo(d,'detail-picture')+(PHOTO_CREDITS[d.id]?'<p class="byline">Foto oleh <a href="'+PHOTO_CREDITS[d.id].url+'" target="_blank" rel="noopener">'+PHOTO_CREDITS[d.id].name+'</a> di Unsplash</p>':'')+'<div class="itinerary-desktop">'+itinerary(d)+'</div></div><div class="detail-copy"><div class="detail-region">'+svg('place')+d.area+', '+d.country+'</div><h1>'+d.name+'</h1><p>'+d.intro+'</p><div class="card-actions"><button class="button primary" data-plan="'+d.id+'">'+svg('suitcase')+(planned?'Ubah rencana':'Susun rencana')+'</button><button class="save-pill" data-save="'+d.id+'" aria-pressed="'+s+'">'+svg('bookmark')+(s?'Tersimpan':'Simpan')+'</button></div><h2 class="micro-head">Yang bisa kamu lakukan</h2><ul class="moments">'+d.moments.map(x=>'<li>'+svg(kindIcon[d.category])+x+'</li>').join('')+'</ul><div class="field-notes"><span>'+d.region+' · '+LOCATIONS[d.id].map((v,i)=>Math.abs(v).toFixed(2)+'° '+(i?(v<0?'BB':'BT'):(v<0?'LS':'LU'))).join(', ')+'</span>'+(d.guide?'<a target="_blank" rel="noopener" href="'+d.guide.url+'">Panduan lokal · '+d.guide.name+'</a>':'')+'</div></div></div><div class="itinerary-mobile">'+itinerary(d)+'</div>'
}
function countSaved(){const b=$('#saved-count');b.textContent=state.saved.length;b.hidden=!state.saved.length}
function toggleSave(id,button){const i=state.saved.indexOf(id),saved=i<0;
 if(saved)state.saved.push(id);else state.saved.splice(i,1);
 persist(saved?'Kartu pos disimpan.':'Kartu pos dihapus dari simpanan.');countSaved();
 if(route==='tersimpan'){renderCollection();($('#collection button')||$('#collection a'))?.focus({preventScroll:true});return}
 button.setAttribute('aria-pressed',String(saved));
 if(button.classList.contains('save-pill'))button.innerHTML=svg('bookmark')+(saved?'Tersimpan':'Simpan');
 else button.setAttribute('aria-label',(saved?'Hapus dari simpanan ':'Simpan ')+byId.get(id).name);
 if(saved&&!reduced.matches){
   button.querySelector('.icon').animate(
     [{transform:'scale(.82)'},{transform:'scale(1.12)',offset:.57},{transform:'scale(1)'}],
     {duration:215,easing:'ease-out'}
   );
 }
}
function openForm(id){
 const d=byId.get(id), p=state.plans.find(x=>x.id===id),form=$('#plan-form');
 const now=new Date();const today=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
 $('#dialog-heading').textContent=d.name;$('#dialog-sub').textContent=d.country+' · '+d.category;form.elements.dest.value=id;form.elements.date.value=p?.date||today;form.elements.days.value=p?.days||2;form.elements.note.value=p?.note||'';$('#planner-dialog').showModal()
}
$('#plan-form').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;const id=form.elements.dest.value;
 const item={id,date:form.elements.date.value,days:Number(form.elements.days.value),note:form.elements.note.value.trim()};state.plans=[...state.plans.filter(x=>x.id!==id),item];persist('Rencana perjalanan disimpan.');$('#planner-dialog').close();if(route==='rencana')renderPlans();else location.hash='rencana'});
$('#planner-dialog').addEventListener('click',e=>{if(e.target===e.currentTarget){const b=e.currentTarget.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)e.currentTarget.close()}});
document.addEventListener('click',e=>{
 if(!(e.target instanceof Element))return;
 const el=e.target.closest('a,button');if(!el)return;
 if(el.dataset.open&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();openDest(el.dataset.open,el.querySelector('img'));return}
 if(el.dataset.save){toggleSave(el.dataset.save,el);return}
 if(el.dataset.filter){category=el.dataset.filter;showTiles();if(!reduced.matches){$$('#tiles .tile').forEach((t,i)=>t.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:280,delay:i*32,fill:'backwards'}))}$('[data-filter="'+category+'"]').focus({preventScroll:true});return}
 if(el.dataset.plan){openForm(el.dataset.plan);return}
 if(el.dataset.remove){el.textContent='Konfirmasi hapus';el.dataset.confirmDelete=el.dataset.remove;delete el.dataset.remove;return}
 if(el.dataset.confirmDelete){state.plans=state.plans.filter(p=>p.id!==el.dataset.confirmDelete);persist('Rencana dihapus.');renderPlans();return}
 if(el.dataset.do==='close-form')$('#planner-dialog').close();
 if(el.dataset.do==='reset'){query='';category='Semua';region='';$('#region-filter').value='';$('#query').value='';if(route.startsWith('benua/'))location.hash='indeks';showTiles();$('#query').focus()}
 if(el.hash==='#indeks'&&location.hash==='#indeks'){e.preventDefault();goIndex()}
 if(el.hash==='#jelajahi'&&(route==='jelajahi'||route==='indeks')&&location.hash==='#jelajahi')window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'})
});
function openDest(id,img){
 if(img){const r=img.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight&&r.width)originPhoto={id,r,src:img.currentSrc||img.src}}
 location.hash='tempat/'+id
}
function transitionPhoto(d,from){
 if(!from||from.id!==d.id||reduced.matches||!Element.prototype.animate)return;
 const target=$('.detail-picture').getBoundingClientRect();if(!target.width)return;
 const layer=document.createElement('div');layer.className='switch-photo';layer.setAttribute('aria-hidden','true');layer.style.background='transparent';
 const curtain=document.createElement('div');curtain.className='curtain';const im=new Image();im.src=from.src;im.style.objectPosition=d.pos;layer.append(curtain,im);document.body.append(layer);flight=layer;
 const r=from.r,centerW=Math.min(innerWidth*.37,245),centerH=centerW*1.14;
 const geo=(x,y,w,h)=>({left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
 curtain.animate([{opacity:.05,clipPath:'inset(100% 0 0)'},{opacity:1,clipPath:'inset(0 0 0)',offset:.38},{opacity:1,offset:.63},{opacity:0}],{duration:720,fill:'both'});
 const anim=im.animate([geo(r.left,r.top,r.width,r.height),{...geo((innerWidth-centerW)/2,(innerHeight-centerH)/2,centerW,centerH),offset:.42},geo(target.left,target.top,target.width,target.height)],{duration:720,easing:'cubic-bezier(.28,.63,.29,1)',fill:'both'});
 anim.finished.then(()=>{layer.remove();if(flight===layer)flight=null}).catch(()=>layer.remove())
}
function goIndex(){document.getElementById('indeks').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});$('#indeks').focus({preventScroll:true})}
function routePage(initial=false){
 let next=location.hash.slice(1)||'jelajahi';const id=next.startsWith('tempat/')?next.slice(7):null;const d=byId.get(id);
 const selectedRegion=next.startsWith('benua/')?REGIONS.find(r=>r.key===next.slice(6)):null;
 if(!d&&!selectedRegion&&!['jelajahi','kartu','peta','dunia','indeks','rencana','tersimpan'].includes(next))next='jelajahi';
 if(next==='indeks'||selectedRegion){
   const requested=selectedRegion?.name||'';
   if(region!==requested){query='';category='Semua';$('#query').value=''}
   region=requested;$('#region-filter').value=region;
 }
 if(flight){flight.remove();flight=null}hideTip();
 const previous=route,detailBefore=previous.startsWith('tempat/');if(d&&!detailBefore){lastList=route||'jelajahi';returnY=scrollY}
 const from=originPhoto;originPhoto=null;route=next;
 const home=Boolean(selectedRegion)||['jelajahi','indeks','kartu','dunia','peta'].includes(next);$('#home').hidden=!home;$('#detail').hidden=!d;$('#collection').hidden=next!=='tersimpan';$('#plans').hidden=next!=='rencana';
 if(d)renderDetail(d);else if(next==='tersimpan')renderCollection();else if(next==='rencana')renderPlans();else showTiles();
 const navRoute=d?lastList:next;
 const currentNav=['rencana','tersimpan'].includes(navRoute)?navRoute:'jelajahi';
 $$('[data-nav]').forEach(a=>{if(a.dataset.nav===currentNav)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 document.title=(d?d.name:next==='tersimpan'?'Destinasi tersimpan':next==='rencana'?'Rencana saya':'Atlas perjalanan')+' di Sela';
 if(!initial)$('#content').focus({preventScroll:true});
 if(detailBefore&&next===lastList){window.scrollTo({top:returnY,behavior:'instant'});const old=previous.slice(7);const el=(home&&lastList==='kartu'?$('#studio-open'):null)||[...$$('[data-open="'+old+'"]')].find(x=>x.getClientRects().length);el?.focus({preventScroll:true})}
 else if(next==='kartu'||next==='peta')$('#kartu').scrollIntoView({behavior:'instant'});else if(next==='dunia')$('#dunia').scrollIntoView({behavior:'instant'});else if(next==='indeks'||selectedRegion)goIndex();else window.scrollTo({top:0,behavior:'instant'});
 document.dispatchEvent(new CustomEvent('sela:route',{detail:next}));
 if(d)transitionPhoto(d,from);else if(!home&&!reduced.matches){const el=next==='tersimpan'?$('#collection'):$('#plans');el.classList.remove('arrive');void el.offsetWidth;el.classList.add('arrive')}
}
window.addEventListener('hashchange',()=>routePage());$('#top').onclick=()=>window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});
window.addEventListener('storage',e=>{if(e.key!==storageKey)return;state=readState();countSaved();if(route==='tersimpan')renderCollection();else if(route==='rencana')renderPlans();else if(route.startsWith('tempat/'))renderDetail(byId.get(route.slice(7)));else showTiles()});
$('.skip').onclick=e=>{e.preventDefault();$('#content').focus();};
buildDeck();countSaved();routePage(true);
if(!reduced.matches && !$('#home').hidden){
 deck.animate([{opacity:0,transform:'translateY(14px) rotate(2deg)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.22,.73,.18,1)'});
}
