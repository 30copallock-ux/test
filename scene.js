(()=>{
if(!window.THREE){$("#scene").style.background="linear-gradient(#8fd0f5,#8ed16a)";return}
const T=THREE,H=2.7,W=10.4,LX=W/2+1.2,FL=4;
const ren=new T.WebGLRenderer({antialias:true});ren.setPixelRatio(Math.min(devicePixelRatio,2));ren.shadowMap.enabled=true;ren.shadowMap.type=T.PCFSoftShadowMap;ren.outputEncoding=T.sRGBEncoding;
$("#scene").append(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(30,1,1,200);
const hemi=new T.HemisphereLight(0xdff1ff,0x8a6a3a,.75),sun=new T.DirectionalLight(0xfff1d6,.85);sun.position.set(10,20,16);sun.castShadow=true;
Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-12});sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0005;sc.add(hemi,sun);
const M=c=>new T.MeshStandardMaterial({color:c,roughness:.85}),mats={};
const box=(w,h,d,c,x,y,z,p=sc)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;p.add(m);return m};
const ground=new T.Mesh(new T.PlaneGeometry(120,120),M(0x7cc05a));ground.rotation.x=-Math.PI/2;ground.position.y=-.5;ground.receiveShadow=true;sc.add(ground);
const road=box(60,.1,4.6,0x4b4f58,0,-.44,3.3);for(let x=-28;x<28;x+=3)box(1.2,.02,.14,0xf3e9b0,x,-.37,3.3);
// tower
const floors=[];
for(let i=0;i<=FL;i++){box(W+.8,.3,3.9,0x8a5a2e,0,i*H,0)}
for(let i=0;i<FL;i++){const y=i*H;box(W,H-.3,.2,i%2?0xf2dba6:0xeac98c,0,y+H/2,-1.75);
 for(let k=0;k<5;k++)box(1.3,.5,.7,0xb98450,-4+k*2,y+.45,-1.3);
 [-1,1].forEach(s=>box(.3,H-.3,3.9,0xa06a38,s*(W/2+.15),y+H/2,0));floors.push({y:y+.15,hens:[]})}
const roofS=new T.Shape();roofS.moveTo(-W/2-.9,0);roofS.lineTo(W/2+.9,0);roofS.lineTo(0,2.4);
const roof=new T.Mesh(new T.ExtrudeGeometry(roofS,{depth:4.4,bevelEnabled:false}),M(0xc0392b));roof.position.set(0,FL*H+.15,-2.2);roof.castShadow=true;sc.add(roof);
const shaft=box(1.3,FL*H+.3,1.3,0x9fb4c4,LX,FL*H/2-.05,0);shaft.material.transparent=true;shaft.material.opacity=.45;
box(1.6,.3,1.6,0x6c7a86,LX,FL*H+.2,0);
// scenery
function tree(x,z,s){const g=new T.Group();box(.35,1.2,.35,0x7a5230,0,.6,0,g);[0,.9,1.7].forEach((y,i)=>{const c=new T.Mesh(new T.ConeGeometry(1.3-i*.3,1.4,8),M(0x2f8f46));c.position.y=1.5+y;c.castShadow=true;g.add(c)});g.position.set(x,-.5,z);g.scale.setScalar(s);sc.add(g)}
[[-10,-3,1.3],[-12.5,2,1],[-9,-6,1.5],[13,-4,1.2],[15,0,1.5],[11,-7,1.2]].forEach(a=>tree(...a));
const clouds=[];for(let i=0;i<5;i++){const g=new T.Group();for(let k=0;k<4;k++){const s=new T.Mesh(new T.SphereGeometry(1+Math.random()*.7,12,8),new T.MeshBasicMaterial({color:0xffffff}));s.position.set(k*1.2,Math.random()*.4,0);g.add(s)}g.position.set(-30+i*14,20+Math.random()*5,-20);sc.add(g);clouds.push(g)}
// hen
const white=M(0xfffdf5),wing=M(0xefe6d2),red=M(0xe23b2e),org=M(0xf0a020),blk=M(0x222222);
const part=(g,geo,m,x,y,z,sx=1,sy=1,sz=1)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;g.add(o);return o};
const sph=new T.SphereGeometry(1,14,10),cone=new T.ConeGeometry(1,1,8),cyl=new T.CylinderGeometry(1,1,1,6);
function hen(){const g=new T.Group(),b=new T.Group();g.add(b);
 part(b,sph,white,0,.55,0,.4,.36,.5);part(b,cone,white,0,.8,-.5,.16,.5,.16).rotation.x=-1;
 part(b,sph,wing,.34,.58,0,.1,.22,.3);part(b,sph,wing,-.34,.58,0,.1,.22,.3);
 part(b,sph,white,0,.98,.32,.19,.19,.19);part(b,sph,red,0,1.2,.3,.05,.08,.1);part(b,sph,red,0,1.14,.4,.05,.07,.07);part(b,sph,red,0,.84,.47,.04,.07,.04);
 part(b,cone,org,0,.95,.54,.06,.16,.06).rotation.x=Math.PI/2;part(b,sph,blk,.1,1.02,.46,.03,.03,.03);part(b,sph,blk,-.1,1.02,.46,.03,.03,.03);
 part(g,cyl,org,.12,.12,.05,.025,.24,.025);part(g,cyl,org,-.12,.12,.05,.025,.24,.025);
 g.userData={b,vx:(Math.random()<.5?-1:1)*(.4+Math.random()*.5),ph:Math.random()*9,z:-.9+Math.random()*2.1};g.rotation.y=g.userData.vx>0?1.57:-1.57;return g}
// eggs
const eggG=new T.SphereGeometry(.17,10,8),eggM=M(0xfff2c9),eggs=[];
// trucks
const trucks=[];const cols=[0xe8e8e8,0x3b82c4,0xe0a030,0x59a55a];
function truck(i){const g=new T.Group();box(2,1,1,cols[i],-.3,.9,0,g);box(.9,.75,1,0xc0392b,1.1,.78,0,g);box(.4,.4,.9,0x9fd3f0,1.4,1,0,g);
 [-.9,.7,1.3].forEach(x=>{const w=new T.Mesh(new T.CylinderGeometry(.28,.28,1.1,12),M(0x222222));w.rotation.x=1.57;w.position.set(x,.3,0);g.add(w)});
 g.position.z=2.6+i*.95;g.userData.i=i;g.userData.ph=i*.31;sc.add(g);return g}
function layout(){const a=innerWidth/innerHeight,f=Math.tan(T.MathUtils.degToRad(cam.fov/2)),d=Math.max(8.2/f,(9.2/a)/f);
 cam.aspect=a;cam.position.set(4,6.4+(a<.8?1.5:0),d+4);cam.lookAt(.8,5.3+(a<.8?.6:0),0);cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight)}
addEventListener("resize",layout);layout();
const SEAS={Spring:0x86cf5a,Summer:0x6fbd44,Autumn:0xc5a24a,Winter:0xeef3f7},c1=new T.Color(),c2=new T.Color(0x8fd0f5),c3=new T.Color(0x0a1530);
let last=performance.now(),acc=[0,0,0,0];
function loop(n){requestAnimationFrame(loop);const dt=Math.min((n-last)/1e3,.1),t=n/1e3;last=n;const S=Egg.S();
 // environment
 let day=1;if(S.esync){const h=new Date().getHours()+new Date().getMinutes()/60;day=Math.max(.12,Math.sin(Math.PI*(h-6)/12))}
 hemi.intensity=.25+.5*day;sun.intensity=.1+.75*day;sc.background=c1.copy(c3).lerp(c2,day);ground.material.color.set(SEAS[S.season]||0x7cc05a);
 clouds.forEach(c=>{c.position.x+=dt*.6;if(c.position.x>40)c.position.x=-40});
 // hens
 const per=S.hens/FL,want=S.hens<1?0:Math.min(14,Math.ceil(Math.sqrt(per)));
 floors.forEach((f,fi)=>{while(f.hens.length<want){const h=hen();h.position.set(-4+Math.random()*8,f.y,h.userData.z);sc.add(h);f.hens.push(h)}while(f.hens.length>want)sc.remove(f.hens.pop());
  f.hens.forEach(h=>{const u=h.userData;h.position.x+=u.vx*dt;if(Math.abs(h.position.x)>W/2-.7){u.vx*=-1;h.position.x=Math.sign(h.position.x)*(W/2-.7)}
   h.rotation.y+=((u.vx>0?1.57:-1.57)-h.rotation.y)*Math.min(1,dt*8);const hop=Math.abs(Math.sin(t*7+u.ph));h.position.y=f.y+hop*.07;u.b.rotation.z=Math.sin(t*7+u.ph)*.06});
  const rate=Math.min(2.2,Egg.lay()/FL*.12);acc[fi]+=rate*dt;
  if(acc[fi]>1&&f.hens.length&&eggs.length<60){acc[fi]=0;const h=f.hens[Math.floor(Math.random()*f.hens.length)],e=new T.Mesh(eggG,eggM);e.scale.y=1.3;e.castShadow=true;e.position.set(h.position.x,f.y+.17,h.userData.z);e.userData={f,st:0};sc.add(e);eggs.push(e)}});
 for(let i=eggs.length-1;i>=0;i--){const e=eggs[i],u=e.userData;
  if(u.st==0){e.position.x+=dt*2.4;e.rotation.z-=dt*8;if(e.position.x>LX-.1){u.st=1;e.position.set(LX,e.position.y,0)}}
  else{e.position.y-=dt*3;if(e.position.y<0){sc.remove(e);eggs.splice(i,1)}}}
 // trucks
 const want2=1+S.lv.fleet;while(trucks.length<want2)trucks.push(truck(trucks.length));while(trucks.length>want2)sc.remove(trucks.pop());
 trucks.forEach(g=>{const p=((t/14)+g.userData.ph)%1;let x;if(p<.3)x=-26+(LX-1.2+26)*(p/.3);else if(p<.62)x=LX-1.2;else x=LX-1.2+27*((p-.62)/.38);g.position.x=x});
 ren.render(sc,cam)}
requestAnimationFrame(loop);
})();
