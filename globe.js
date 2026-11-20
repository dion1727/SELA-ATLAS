// Orthographic view of the Natural Earth land dots. The same projection handles pins and routes.
const RAD=Math.PI/180;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const vector=([lat,lon])=>[Math.cos(lat*RAD)*Math.sin(lon*RAD),Math.sin(lat*RAD),Math.cos(lat*RAD)*Math.cos(lon*RAD)];
const coordinates=v=>[Math.atan2(v[1],Math.hypot(v[0],v[2]))/RAD,Math.atan2(v[0],v[2])/RAD];
function greatCircle(a,b){
  const angle=Math.acos(clamp(a.reduce((sum,n,i)=>sum+n*b[i],0),-1,1));
  if(angle<.00001)return [a,b];
  const sin=Math.sin(angle);
  return Array.from({length:97},(_,i)=>{
    const t=i/96,p=Math.sin((1-t)*angle)/sin,q=Math.sin(t*angle)/sin;
    return a.map((n,j)=>n*p+b[j]*q);
  });
}
export async function makeGlobe(canvas,onChoose,isReduced){
  const response=await fetch('assets/land-dots.json');
  if(!response.ok)throw Error('Globe data unavailable');
  const data=await response.json(),land=[];
  for(let i=0;i<data.length;i+=2)land.push(vector([data[i+1],data[i]]));
  const markers=Object.entries(LOCATIONS).map(([id,loc])=>({id,v:vector(loc),name:byId.get(id).name}));
  const lines=[];
  for(let lat=-60;lat<=60;lat+=30)lines.push(Array.from({length:121},(_,i)=>vector([lat,-180+i*3])));
  for(let lon=-180;lon<180;lon+=30)lines.push(Array.from({length:61},(_,i)=>vector([-90+i*3,lon])));
  const ctx=canvas.getContext('2d');
  let active=false,selected='',lon=0,lat=18,scale=1,frame=0,press=null,rotation=null,coast=null,visible=false;
  let width=0,height=0,cx=0,cy=0,r=0,pins=[],routePath=[],routeIds=[],routeStart=0,routeEnd=0,hover='';
  function draw(time=performance.now()){
    if(!active||!width||!height)return;
    ctx.clearRect(0,0,width,height);
    const cl=Math.cos(lon*RAD),sl=Math.sin(lon*RAD),ct=Math.cos(lat*RAD),st=Math.sin(lat*RAD);
    function project(v){
      const front=v[0]*sl+v[2]*cl;
      return [cx+r*(v[0]*cl-v[2]*sl),cy-r*(v[1]*ct-front*st),v[1]*st+front*ct];
    }
    function trace(path){
      let pen=false;ctx.beginPath();
      for(const v of path){const [x,y,z]=project(v);if(z<0){pen=false;continue}if(pen)ctx.lineTo(x,y);else ctx.moveTo(x,y);pen=true}
      ctx.stroke();
    }
    const shade=ctx.createRadialGradient(cx-r*.43,cy-r*.44,0,cx,cy,r);
    shade.addColorStop(0,'#f2f1dc');shade.addColorStop(.77,'#e2e8d3');shade.addColorStop(1,'#c1d0b8');
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=shade;ctx.fill();ctx.lineWidth=1;ctx.strokeStyle='#95ac94';ctx.stroke();
    ctx.lineWidth=.65;ctx.strokeStyle='#81997a88';lines.forEach(trace);
    ctx.fillStyle='#55775c';ctx.beginPath();
    for(const v of land){const [x,y,z]=project(v);if(z<=0)continue;const size=Math.max(.55,r*.007*(.55+z*.45));ctx.moveTo(x+size,y);ctx.arc(x,y,size,0,2*Math.PI)}
    ctx.fill();
    if(routePath.length){
      ctx.lineWidth=2.3;ctx.strokeStyle='#a44931';ctx.setLineDash([4,4]);trace(routePath);ctx.setLineDash([]);
      const progress=isReduced()?1:clamp((time-routeStart)/1600,0,1);
      const k=Math.min(routePath.length-1,Math.floor(progress*(routePath.length-1)));
      const [x,y,z]=project(routePath[k]);if(z>0&&progress<1){ctx.fillStyle='#f9e1a6';ctx.strokeStyle='#863f24';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();ctx.stroke()}
    }
    pins=[];
    for(const m of markers){
      const [x,y,z]=project(m.v);if(z<=0)continue;
      const strong=m.id===selected||routeIds.includes(m.id);
      ctx.beginPath();ctx.arc(x,y,strong?5.8:4.3,0,2*Math.PI);ctx.fillStyle=strong?'#ae5136':'#264c40';ctx.fill();ctx.lineWidth=1.6;ctx.strokeStyle='#fffdeb';ctx.stroke();
      pins.push({id:m.id,x,y,name:m.name});
    }
    const labels=routeIds.length?pins.filter(m=>routeIds.includes(m.id)):[pins.find(m=>m.id===hover)||pins.find(m=>m.id===selected)].filter(Boolean);
    for(const tag of labels){if(press)break;
      ctx.font='600 12px Inter, sans-serif';const w=ctx.measureText(tag.name).width+16;
      const left=clamp(tag.x-w/2,2,width-w-2),top=clamp(tag.y-32,2,height-22);
      ctx.fillStyle='#203f35';ctx.beginPath();ctx.roundRect(left,top,w,20,4);ctx.fill();
      ctx.fillStyle='#fffbe8';ctx.textBaseline='middle';ctx.fillText(tag.name,left+8,top+10);
    }
    canvas.dataset.orientation=lat.toFixed(1)+','+lon.toFixed(1);
  }
  function resize(){
    const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;
    width=box.width;height=box.height;cx=width/2;cy=height/2;r=Math.min(width*.42,height*.44)*scale;
    const ratio=Math.min(devicePixelRatio||1,2),w=Math.round(width*ratio),h=Math.round(height*ratio);
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;ctx.setTransform(ratio,0,0,ratio,0,0)}
    draw();
  }
  function wake(){if(active&&visible&&!document.hidden&&!frame)frame=requestAnimationFrame(tick)}
  function tick(now){
    frame=0;if(!active||!visible||document.hidden)return;
    if(rotation){
      const t=isReduced()?1:clamp((now-rotation.start)/590,0,1),f=1-(1-t)**3;
      lat=rotation.lat+rotation.dy*f;lon=rotation.lon+rotation.dx*f;if(t===1)rotation=null;
    }
    if(coast){
      const dt=clamp(now-coast.time,1,35);coast.time=now;
      if(isReduced()||Math.abs(coast.x)+Math.abs(coast.y)<.012)coast=null;
      else{lon+=coast.x*dt;lat=clamp(lat+coast.y*dt,-89,89);const decay=Math.exp(-dt/145);coast.x*=decay;coast.y*=decay}
    }
    draw(now);if(rotation||coast||(!isReduced()&&routeEnd>now))wake();
  }
  function turnTo(target,instant=false){
    rotation=null;coast=null;
    if(!target)return;
    if(instant||isReduced()||!visible){[lat,lon]=target;draw();return}
    rotation={lat,lon,dy:target[0]-lat,dx:((target[1]-lon+540)%360+360)%360-180,start:performance.now()};wake();
  }
  function select(id,instant=false){selected=id;turnTo(LOCATIONS[id],instant)}
  function route(ids){
    routeIds=ids||[];routePath=[];routeEnd=0;
    if(ids){routePath=greatCircle(vector(LOCATIONS[ids[0]]),vector(LOCATIONS[ids[1]]));routeStart=performance.now();routeEnd=routeStart+1600;turnTo(coordinates(routePath[Math.floor(routePath.length/2)]));wake()}
    draw();
  }
  function zoom(direction){
    scale=clamp(Math.round((scale+direction*.2)*10)/10,.8,1.8);
    document.getElementById('zoom-in').disabled=scale>=1.8;document.getElementById('zoom-out').disabled=scale<=.8;resize();
  }
  function home(){scale=1;zoom(0);route(null);select(selected)}
  function nearest(x,y){let pin=null,best=16;for(const p of pins){const d=Math.hypot(p.x-x,p.y-y);if(d<best){pin=p;best=d}}return pin}
  function local(e){const rect=canvas.getBoundingClientRect();return [e.clientX-rect.left,e.clientY-rect.top]}
  canvas.addEventListener('pointerdown',e=>{
    if(e.button!==0||press)return;const [x,y]=local(e);
    rotation=null;coast=null;hover='';press={id:e.pointerId,x,y,lastX:x,lastY:y,time:performance.now(),vx:0,vy:0,drag:false};
    canvas.setPointerCapture(e.pointerId);canvas.classList.add('is-dragging');draw();
  });
  canvas.addEventListener('pointermove',e=>{
    const [x,y]=local(e);
    if(!press){if(e.pointerType==='mouse'){const id=nearest(x,y)?.id||'';if(id!==hover){hover=id;draw()}}return}
    if(e.pointerId!==press.id)return;
    if(!press.drag&&Math.hypot(x-press.x,y-press.y)<4)return;
    press.drag=true;const factor=78/Math.max(1,r),now=performance.now(),dt=Math.max(8,now-press.time);
    const dx=-(x-press.lastX)*factor,dy=(y-press.lastY)*factor;
    lon+=dx;lat=clamp(lat+dy,-89,89);press.vx=clamp(dx/dt,-.55,.55);press.vy=clamp(dy/dt,-.55,.55);
    press.lastX=x;press.lastY=y;press.time=now;draw();
  });
  function end(e,cancelled){
    if(!press||press.id!==e.pointerId)return;
    const p=press;press=null;canvas.classList.remove('is-dragging');
    if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
    if(!cancelled&&!p.drag){const hit=nearest(...local(e));if(hit)onChoose(hit.id)}
    else if(!cancelled&&!isReduced()&&performance.now()-p.time<90){coast={x:p.vx,y:p.vy,time:performance.now()};wake()}
    draw();
  }
  canvas.addEventListener('pointerup',e=>end(e,false));canvas.addEventListener('pointercancel',e=>end(e,true));
  canvas.addEventListener('lostpointercapture',e=>end(e,true));canvas.addEventListener('pointerleave',()=>{hover='';draw()});
  canvas.addEventListener('keydown',e=>{
    const step=e.shiftKey?30:12;
    const delta={ArrowLeft:[0,-step],ArrowRight:[0,step],ArrowUp:[step,0],ArrowDown:[-step,0]}[e.key];
    if(delta){e.preventDefault();turnTo([clamp(lat+delta[0],-89,89),lon+delta[1]]);return}
    if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1)}
    if(e.key==='-'){e.preventDefault();zoom(-1)}
  });
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){resize();wake()}}).observe(canvas);
  document.addEventListener('visibilitychange',wake);
  return {select,route,zoom,home,show(id){active=true;resize();select(id,true)},hide(){active=false;rotation=coast=null;cancelAnimationFrame(frame);frame=0}};
}
