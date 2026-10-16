
const $=s=>document.querySelector(s);
const F=n=>{if(n<1e3)return n<10?n.toFixed(2):n<100?n.toFixed(1):""+Math.floor(n);const u="KMBTqQs";let i=-1;while(n>=1e3&&i<6){n/=1e3;i++}return n.toFixed(n<10?2:1)+u[i]};
const R={
 rate:{n:"Comfy nests",i:"🪺",b:40,g:1.55,m:25,d:l=>`Laying speed ×${(1+.25*l).toFixed(2)}`},
 value:{n:"Egg quality",i:"🥚",b:60,g:1.6,m:25,d:l=>`Egg value ×${(1+.35*l).toFixed(2)}`},
 cap:{n:"Hen house size",i:"🏠",b:150,g:1.7,m:12,d:l=>`${4*(50+50*l)} hens max`},
 hatch:{n:"Internal hatchery",i:"🐣",b:100,g:1.6,m:12,d:l=>`${(.5*l).toFixed(1)} free hens / sec`},
 ship:{n:"Truck capacity",i:"📦",b:80,g:1.6,m:25,d:l=>`Shipping ×${(1+.4*l).toFixed(1)}`},
 fleet:{n:"Bigger fleet",i:"🚚",b:600,g:4,m:3,d:l=>`${1+l} truck${l?"s":""}`},
 silo:{n:"Silo",i:"🌾",b:2,g:1.7,m:9,gold:1,d:l=>`${3+3*l}h offline earnings`}
};
const TABS={research:["rate","value","cap","hatch"],fleet:["ship","fleet"],boost:["silo"]};
const fresh=()=>({cash:5,gold:0,soul:0,hens:1,life:0,lv:{rate:0,value:0,cap:0,hatch:0,ship:0,fleet:0,silo:0},boost:0,last:Date.now(),season:"off",esync:false});
let S=fresh(),tab=null;
const lvl=k=>S.lv[k]||0,cost=k=>Math.ceil(R[k].b*R[k].g**lvl(k));
const cap=()=>4*(50+50*lvl("cap")),boost=()=>Date.now()<S.boost?2:1;
const lay=()=>S.hens*.2*(1+.25*lvl("rate"))*boost();
const ship=()=>(1+lvl("fleet"))*8*(1+.4*lvl("ship"));
const val=()=>.25*(1+.35*lvl("value"))*(1+.1*S.soul);
const deliv=()=>Math.min(lay(),ship()),income=()=>deliv()*val();
const henCost=()=>1+.04*Math.pow(Math.floor(S.hens),1.6);
const pending=()=>Math.floor(Math.sqrt(S.life/2e4));
window.Egg={S:()=>S,lay,ship,deliv,cap};
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("show"),2200)}
function buyHen(){const c=henCost();if(S.cash>=c&&S.hens<cap()){S.cash-=c;S.hens=Math.floor(S.hens)+1}}
function buy(k){const g=R[k].gold,c=cost(k),w=g?"gold":"cash";if(S[w]<c||lvl(k)>=R[k].m)return;S[w]-=c;S.lv[k]=lvl(k)+1;sheet()}
function frenzy(){if(S.gold<5)return;S.gold-=5;S.boost=Math.max(Date.now(),S.boost)+3e5;toast("Egg frenzy! Laying ×2 for 5 min");sheet()}
function prestige(){const p=pending();if(p<1)return;if(!confirm(`Prestige for ${p} soul eggs? Farm resets, soul eggs and golden eggs stay.`))return;
 const k={soul:S.soul+p,gold:S.gold,season:S.season,esync:S.esync,silo:0};S=Object.assign(fresh(),k);S.lv.silo=0;toast("Prestiged! +"+p+" soul eggs");sheet()}
const key=()=>"eggorg_slot_"+Math.min(256,Math.max(1,+($("#slot")?.value||localStorage.eggorg_slot||1)));
function save(q){S.last=Date.now();localStorage[key()]=JSON.stringify(S);if(!q)toast("Saved")}
function load(){try{const raw=localStorage[key()];S=Object.assign(fresh(),raw?JSON.parse(raw):{});S.lv=Object.assign(fresh().lv,S.lv);
 if(raw){const away=Math.min((Date.now()-S.last)/1e3,(3+3*lvl("silo"))*3600);if(away>60){const g=income()*away;S.cash+=g;S.life+=g;toast("Welcome back! +$"+F(g)+" while away")}}}catch(e){S=fresh()}sheet()}
function card(k){const r=R[k],l=lvl(k),mx=l>=r.m,c=cost(k),w=r.gold?"gold":"cash";
 return `<div class="card"><div class="ico">${r.i}</div><div><h3>${r.n} <small>Lv ${l}/${r.m}</small></h3><p>${r.d(l)}${mx?"":" → "+r.d(l+1)}</p></div>
 <button class="buy ${r.gold?"g":""}" data-k="${k}" ${mx||S[w]<c?"disabled":""}>${mx?"MAX":(r.gold?"":"$")+F(c)+(r.gold?" 🥚":"")}</button></div>`}
const TITLE={research:"Research",fleet:"Fleet",boost:"Silos & boosts",prestige:"Prestige",settings:"Settings"};
function sheet(){const s=$("#sheet");if(!tab){s.hidden=true;return}s.hidden=false;$("#sheetTitle").textContent=TITLE[tab];let h="";
 if(TABS[tab])h=TABS[tab].map(card).join("");
 if(tab=="boost")h+=`<div class="card"><div class="ico">⚡</div><div><h3>Egg frenzy</h3><p>Laying ×2 for 5 minutes${boost()>1?" (active)":""}</p></div><button class="buy g" data-f="1" ${S.gold<5?"disabled":""}>5 🥚</button></div><p class="note">Shoot down golden-egg drones that fly across the sky to earn golden eggs.</p>`;
 if(tab=="prestige")h=`<p class="note">Each soul egg gives +10% to all earnings forever. You would earn <b>${pending()}</b> now (based on this run's earnings). Prestige resets cash, hens and research.</p><button class="buy" data-p="1" ${pending()<1?"disabled":""}>Prestige</button>`;
 if(tab=="settings")h=`<div class="row">Save slot <input id="slot" type="number" min="1" max="256" value="${localStorage.eggorg_slot||1}"><button class="buy" data-s="save">Save</button><button class="buy" data-s="load">Load</button><button class="buy" data-s="wipe">Wipe</button></div>
 <div class="row">Season <select id="season">${["off","Spring","Summer","Autumn","Winter"].map(x=>`<option ${S.season==x?"selected":""}>${x}</option>`)}</select></div>
 <label><input type="checkbox" id="esync" ${S.esync?"checked":""}> ESync: day and night follow your clock</label>`;
 $("#sheetBody").innerHTML=h}
$("#sheetBody").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
 if(b.dataset.k)buy(b.dataset.k);if(b.dataset.f)frenzy();if(b.dataset.p)prestige();
 if(b.dataset.s=="save"){localStorage.eggorg_slot=$("#slot").value;save()}if(b.dataset.s=="load"){localStorage.eggorg_slot=$("#slot").value;load()}
 if(b.dataset.s=="wipe"&&confirm("Wipe this slot?")){delete localStorage[key()];S=fresh();sheet()}});
$("#sheetBody").addEventListener("change",e=>{if(e.target.id=="season")S.season=e.target.value;if(e.target.id=="esync")S.esync=e.target.checked});
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>{tab=tab==b.dataset.t?null:b.dataset.t;sheet()});
$("#close").onclick=()=>{tab=null;sheet()};
let rep;const hb=$("#hatchBtn");hb.onpointerdown=()=>{buyHen();rep=setInterval(buyHen,110)};["pointerup","pointerleave","pointercancel"].forEach(ev=>hb.addEventListener(ev,()=>clearInterval(rep)));
function drone(){const d=document.createElement("div");d.className="drone";d.style.top=(14+Math.random()*28)+"%";d.innerHTML="<i></i>";
 d.onclick=()=>{const r=Math.random();if(r<.65){const c=Math.max(5,income()*90);S.cash+=c;S.life+=c;toast("Drone delivered $"+F(c))}else{const g=r>.92?2:1;S.gold+=g;toast("+"+g+" golden egg"+(g>1?"s":""))}d.remove()};
 $("#sky").append(d);setTimeout(()=>d.remove(),10500)}
setInterval(()=>{if(!document.hidden&&Math.random()<.6)drone()},12000);setTimeout(drone,5000);
let prev=performance.now(),t5=0;
function frame(n){const dt=Math.min((n-prev)/1e3,.25);prev=n;const i=income();S.cash+=i*dt;S.life+=i*dt;
 if(S.hens<cap())S.hens=Math.min(cap(),S.hens+.5*lvl("hatch")*dt);
 $("#cash").textContent=F(S.cash);$("#gold").textContent=F(S.gold);$("#soul").textContent=F(S.soul);
 $("#eps").textContent=`${F(deliv())} eggs/s shipped`+(lay()>ship()?" (trucks full)":"");$("#ips").textContent=`$${F(i)}/s`;
 const c=henCost(),full=S.hens>=cap();hb.disabled=full||S.cash<c;$("#hatchInfo").textContent=full?`Coops full ${Math.floor(S.hens)}/${cap()}`:`${Math.floor(S.hens)} hens · $${F(c)}`;
 if((t5+=dt)>1){t5=0;if(tab&&tab!="settings"&&tab!="prestige")sheet();}
 requestAnimationFrame(frame)}
setInterval(()=>save(true),10000);addEventListener("beforeunload",()=>save(true));
load();requestAnimationFrame(frame);
