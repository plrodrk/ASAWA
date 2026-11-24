const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg';
const show=id=>{document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('on',e.id===id));scrollTo(0,0)};
const mk=(p,t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e};

/* cake: frosting drips, pearls, 18 candles */
const drip=(g,x0,n,r,cx,rx,y0,ry,fill)=>{for(let i=0;i<n;i++){const x=x0+r+i*2*r,d=(x-cx)/rx;mk(g,'circle',{cx:x,cy:y0+ry*Math.sqrt(Math.max(0,1-d*d)),r,fill})}};
drip($('#g1'),55,13,11.15,200,145,255,30,'#D7EDD8');
drip($('#g0'),55,29,5,200,145,320,30,'#D7EDD8');
drip($('#g2'),95,10,10.5,200,105,170,26,'#D7EDD8');
const g3=$('#g3');
[...Array(18)].map((_,i)=>{const a=i/18*Math.PI*2;return{i,x:200+78*Math.cos(a),y:152+15*Math.sin(a)}}).sort((a,b)=>a.y-b.y).forEach(c=>{
  mk(g3,'rect',{x:c.x-3.2,y:c.y-32,width:6.4,height:32,rx:2,fill:['#fffdf0','#CFD8AC','#B1D095'][c.i%3],stroke:'#5E8342','stroke-width':1});
  mk(g3,'path',{d:`M${c.x} ${c.y-32}v-4`,stroke:'#3d3a2a','stroke-width':1.2});
  const g=mk(g3,'g',{transform:`translate(${c.x} ${c.y-35})`});
  mk(g,'path',{class:'flame',d:'M0-14C6-7 5-1 0 1C-5-1-6-7 0-14Z'}).style.transitionDelay=c.i*.12+'s';
});

/* music: the song file is set in the <audio id="bgm"> tag in index.html */
const au=$('#bgm');au.volume=.6;let want=true;
const sync=()=>{$('#mus').textContent=au.paused?'♪ Play music':'♪ Pause music'};
au.onplay=au.onpause=sync;sync();
au.onerror=()=>{$('#bar').style.display='none'};
$('#mus').onclick=()=>{if(au.paused){want=true;au.play().catch(()=>{})}else{want=false;au.pause()}};

/* click the cake: light candles, then zoom in to the letter page */
let lit=false;
$('#cake').onclick=()=>{
  if(lit)return;lit=true;
  $('#svg').classList.add('lit');$('#hint').textContent='Make a wish…';
  if(au.paused&&want)au.play().catch(()=>{});
  setTimeout(()=>{$('#stage').classList.add('zoom');$('#home').classList.add('out')},3600);
  setTimeout(()=>{show('letter');startLetter()},5700);
};

/* letter: you write it inside <p id="msg"> in index.html, and it is typed out here */
const M=$('#msg');let tm,typed=false;
const full=M.textContent.split('\n').map(l=>l.trim()).join('\n').trim();
M.textContent='';
function typeIt(){
  typed=true;M.classList.add('typing');let i=0;clearTimeout(tm);
  (function step(){M.textContent=full.slice(0,++i);if(i>=full.length)return M.classList.remove('typing');
    tm=setTimeout(step,38+Math.random()*30+(/[,.!?\n]/.test(full[i-1])?200:0))})();
}
const startLetter=()=>{if(!typed)typeIt()};
$('#paper').onclick=()=>{clearTimeout(tm);M.textContent=full;M.classList.remove('typing')};
$('#next').onclick=e=>{e.stopPropagation();show('mem')};
$('#back').onclick=()=>show('letter');

/* photobooth strips: built from the <img> list in index.html, 4 photos per strip */
const srcs=[...document.querySelectorAll('#photo-list img')].map(i=>i.getAttribute('src'));
const cap=$('#photo-list').dataset.caption||'';
for(let s=0;s*4<srcs.length;s++){
  const d=document.createElement('div');d.className='strip';d.style.setProperty('--r',(s%2?2:-2)+'deg');
  srcs.slice(s*4,s*4+4).forEach((u,k)=>{
    const im=new Image();im.className='shot';im.alt='';im.src=u;
    im.onload=()=>{im.alt='Photo '+(s*4+k+1)};
    im.onerror=()=>{im.onerror=null;im.src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='};
    d.appendChild(im);
  });
  const p=document.createElement('p');p.textContent=cap;d.appendChild(p);
  $('#strips').appendChild(d);
}

/* video: set in the <video id="v"> tag in index.html (pauses the music while it plays) */
const v=$('#v');let resume=false;
v.onerror=()=>{$('#vf').style.display='none'};
v.onplay=()=>{resume=!au.paused;au.pause()};
v.onpause=v.onended=()=>{if(resume){resume=false;au.play().catch(()=>{})}};

/* background daisies: scattered along the edges and the bottom */
$('#defs').innerHTML='<symbol id="daisy" viewBox="0 0 100 100"><g fill="#fffdf4" stroke="#BEC9B2" stroke-width="1.2">'+[...Array(12)].map((_,i)=>`<ellipse cx="50" cy="24" rx="8" ry="21" transform="rotate(${i*30} 50 50)"/>`).join('')+'</g><circle cx="50" cy="50" r="13" fill="#f2c94c" stroke="#d9a62e" stroke-width="2"/></symbol>';
{let s=7;const r=()=>(s=s*16807%2147483647)/2147483647;let out='';
for(let i=0;i<28;i++){
  const side=i<9?0:i<18?1:2,x=side==0?r()*10:side==1?90+r()*8:r()*94,y=side==2?86+r()*10:5+r()*80,w=26+r()*40;
  out+=`<svg class="dz" viewBox="0 0 100 100" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;width:${w.toFixed(0)}px;--r:${(r()*60-30).toFixed(0)}deg"><use href="#daisy"/></svg>`;
}
$('#bg').insertAdjacentHTML('beforeend',out)}
