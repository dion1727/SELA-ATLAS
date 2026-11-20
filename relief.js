// Perspective contour slices for browsers without WebGL2.
function canvasRelief(canvas){
  const ctx=canvas.getContext('2d');
  let w=1,h=1,frame=0,visible=false,last=0,phase=0,hover=null,ripple=null;
  const peaks=[[.22,.51,.32,.21,.23],[.54,.42,.5,.18,.24],[.8,.58,.35,.2,.22],[.48,.88,.2,.24,.14]];
  function paint(now){
    frame=0;if(!visible||document.hidden)return;
    if(last&&now-last<38&&!reduced.matches){wake();return}
    phase+=reduced.matches||!last?0:Math.min(now-last,80)*.00012;last=now;
    ctx.clearRect(0,0,w,h);
    for(let j=0;j<56;j++){
      const z=j/55,opacity=.3+z*.66;
      ctx.beginPath();
      for(let i=0;i<=110;i++){
        const x=i/110*1.18-.09,u=x+.026*Math.sin(phase*.8+z*5),v=z+.03*Math.sin(phase+x*7);
        let elevation=0;
        for(const [px,pz,amplitude,sx,sz] of peaks)elevation+=amplitude*Math.exp(-(((u-px)/sx)**2+((v-pz)/sz)**2));
        elevation+=.03*Math.sin(11*u+v*7+phase)*Math.cos(v*9+u*4)+.015*Math.cos(v*20+u*19);
        let y=(.34+.63*z-elevation*.98)*h;
        if(hover){const d=((x*w-hover.x)/(w*.16))**2+((y-hover.y)/(h*.32))**2;y-=h*.10*Math.exp(-d)}
        if(ripple){const age=(now-ripple.t)/1000,dist=Math.hypot(x-ripple.x,(y/h-ripple.y)*.7);y-=h*.09*Math.exp(-((dist-age*.48)**2)/.002)*Math.max(0,1-age/1.8)}
        if(i===0)ctx.moveTo(x*w,y);else ctx.lineTo(x*w,y);
      }
      ctx.lineTo(w*1.1,h+3);ctx.lineTo(-w*.1,h+3);ctx.closePath();ctx.fillStyle='#102c2c';ctx.fill();ctx.strokeStyle=j%5===0?'rgba(193,223,207,'+opacity+')':'rgba(119,178,179,'+opacity+')';ctx.lineWidth=j%5===0?1.15:.75;ctx.stroke();
    }
    if(ripple&&now-ripple.t>1800)ripple=null;
    if(!reduced.matches)wake();
  }
  function wake(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(paint)}
  function size(){const b=canvas.getBoundingClientRect();if(!b.width||!b.height)return;w=b.width;h=b.height;const d=Math.min(1.5,devicePixelRatio||1);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);wake()}
  const point=e=>{const b=canvas.getBoundingClientRect();return{x:e.clientX-b.left,y:e.clientY-b.top}};
  function pulse(x=.5,y=.55){if(reduced.matches)return;ripple={x,y,t:performance.now()};wake()}
  canvas.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;hover=point(e);wake()});
  canvas.addEventListener('pointerleave',()=>{hover=null;wake()});
  canvas.addEventListener('pointerdown',e=>{const p=point(e);pulse(p.x/w,p.y/h)});
  new ResizeObserver(size).observe(canvas);
  new IntersectionObserver(([e])=>{visible=e.isIntersecting;last=0;if(visible)wake()}).observe(canvas);
  document.addEventListener('visibilitychange',()=>{last=0;wake()});size();
  return {pulse,preference(){hover=null;ripple=null;wake()}};
}
export async function mountRelief(host,button){
  let renderer;
  function fallback(){const canvas=document.createElement('canvas');host.replaceChildren(canvas);renderer=canvasRelief(canvas)}
  try{if(!navigator.gpu||reduced.matches)throw Error('Canvas relief');
    const adapter=await navigator.gpu.requestAdapter({powerPreference:'low-power'});
    if(!adapter||adapter.isFallbackAdapter||adapter.info?.isFallbackAdapter)throw Error('Canvas relief');
    const {createRelief}=await import('./relief-webgl.js');renderer=createRelief(host,host.querySelector('canvas'),fallback);if(!renderer)fallback()}catch{fallback()}
  function preference(){button.hidden=reduced.matches;renderer?.preference()}
  button.addEventListener('click',()=>renderer.pulse());
  document.addEventListener('sela:motion',preference);preference();
}
