'use strict';
(() => {
  const menu=document.getElementById('world-menu'),filter=document.getElementById('region-filter');
  const tracks=new Map();
  const safe=escapeHTML;
  function photoThumb(id){return '<img decoding="async" loading="lazy" src="assets/'+id+'.webp" alt="">'}
  for(const item of REGIONS){
    const places=DESTINATIONS.filter(p=>p.region===item.name);
    const a=document.createElement('a');a.className='flow-row';a.href='#benua/'+item.key;
    const count=places.length+' destinasi';
    a.setAttribute('aria-label',item.name+', '+count);
    const segment=places.map(p=>'<span>'+photoThumb(p.id)+safe(p.name)+'</span>').join('');
    a.innerHTML='<span class="flow-main" aria-hidden="true">'+photoThumb(item.cover)+'<span>'+safe(item.name)+'</span><small>'+count+'</small></span>'+
      '<span class="flow-band" aria-hidden="true"><span class="flow-track"><span class="flow-segment">'+segment+'</span><span class="flow-segment">'+segment+'</span></span></span>';
    menu.append(a);filter.add(new Option(item.name,item.name));
    const band=a.querySelector('.flow-band'),track=a.querySelector('.flow-track');
    const segmentEl=a.querySelector('.flow-segment');
    let slide=null,travel=null,entered=false,focused=false;
    function enter(fromBottom){
      if(reduced.matches||!matchMedia('(hover:hover)').matches)return;
      a.classList.add('flow-active');slide?.cancel();travel?.cancel();
      slide=band.animate([{clipPath:fromBottom?'inset(100% 0 0 0)':'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:350,easing:'cubic-bezier(.17,.8,.24,1)',fill:'both'});
      const width=segmentEl.getBoundingClientRect().width;
      travel=track.animate([{transform:'translateX(0)'},{transform:'translateX(-'+width+'px)'}],{duration:Math.max(1,width)/60*1000,iterations:Infinity,easing:'linear'});
    }
    function exit(down){
      if(entered||focused)return;
      slide?.cancel();if(!travel){a.classList.remove('flow-active');return}
      slide=band.animate([{clipPath:'inset(0 0 0 0)'},{clipPath:down?'inset(100% 0 0 0)':'inset(0 0 100% 0)'}],{duration:195,easing:'ease-in',fill:'both'});
      slide.onfinish=()=>{travel?.cancel();travel=null;a.classList.remove('flow-active')};
    }
    a.onpointerenter=e=>{if(e.pointerType!=='mouse')return;entered=true;const b=a.getBoundingClientRect();enter(e.clientY>b.top+b.height/2)};
    a.onpointermove=e=>{if(!travel||e.pointerType!=='mouse')return;const b=a.getBoundingClientRect();travel.playbackRate=.72+(e.clientX-b.left)/b.width*.65};
    a.onpointerleave=e=>{entered=false;const b=a.getBoundingClientRect();exit(e.clientY>b.top+b.height/2)};
    a.onfocus=()=>{focused=true;if(a.matches(':focus-visible'))enter(false)};a.onblur=()=>{focused=false;exit(false)};
    a.onclick=e=>{if(!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&location.hash===a.hash){e.preventDefault();goIndex()}};
    tracks.set(a,()=>{slide?.cancel();travel?.cancel();travel=null;entered=focused=false;a.classList.remove('flow-active')});
  }
  filter.value=region;
  filter.addEventListener('change',()=>{const item=REGIONS.find(r=>r.name===filter.value);location.hash=item?'benua/'+item.key:'indeks'});
  document.addEventListener('sela:motion',()=>{if(reduced.matches)tracks.forEach(stop=>stop())});
  document.addEventListener('sela:route',()=>tracks.forEach(stop=>stop()));
  const world=document.getElementById('dunia');
  const loadTerrain=new IntersectionObserver(entries=>{
    if(!entries.some(e=>e.isIntersecting))return;loadTerrain.disconnect();
    import('./relief.js').then(({mountRelief})=>mountRelief(document.getElementById('terrain'),document.getElementById('terrain-pulse')));
  },{rootMargin:'250px'});loadTerrain.observe(world);
  const gallery=document.querySelector('.gallery');
  const showCards=new IntersectionObserver(entries=>{
    if(!entries.some(e=>e.isIntersecting))return;
    showCards.disconnect();if(reduced.matches||deck.hidden)return;
    const cards=[...deck.querySelectorAll('[data-pos="-1"],[data-pos="0"],[data-pos="1"]')];
    cards.forEach((card,i)=>card.animate([{translate:'0 55px',scale:'.87'},{translate:'0 -7px',scale:'1.015',offset:.76},{translate:'0 0',scale:'1'}],{duration:630,delay:i*55,easing:'cubic-bezier(.22,.64,.27,1)',fill:'backwards'}));
  },{threshold:.3});showCards.observe(gallery);
})();
