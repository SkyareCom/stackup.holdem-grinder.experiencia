/* StackUp Grinder — TEMA ESQUADRÃO + PERFIL DE HERÓI
   - Liga o tema visual (classe "esq" em <html> e no #app2) e mantém a folha
     grinder-esquadrao-app.css sempre por último dentro do shadow root.
   - Perfil de herói calculado SOMENTE a partir dos dados reais de treino:
       nível / XP / patente  -> StackUpXPPerformance.summary()
       atributos e classe    -> StackUpTrainingPerformance.records()
       missão do dia         -> decisões registradas hoje (meta: 20 spots)
   - Desligar o tema: abrir com ?theme=classic (fica salvo); voltar: ?theme=esquadrao
   Todo texto novo existe em PT, EN e ES. */
(function(global){
  'use strict';

  const THEME_KEY='stackup.grinder.theme';
  const DAILY_GOAL=20;
  const MIN_SAMPLES=3;

  function chooseTheme(){
    let theme='esquadrao';
    try{
      const q=new URLSearchParams(global.location.search).get('theme');
      if(q==='classic'||q==='esquadrao'){localStorage.setItem(THEME_KEY,q);theme=q;}
      else theme=localStorage.getItem(THEME_KEY)||'esquadrao';
    }catch(_){}
    return theme;
  }
  const ACTIVE=chooseTheme()!=='classic';
  if(ACTIVE)document.documentElement.classList.add('esq');

  const TX={
    pt:{
      hero:'HERÓI',level:'NV',xpTo:'XP para',max:'Patente máxima',
      ranks:{REC:'RECRUTA',REG:'VETERANO',PRO:'ELITE'},
      classLabel:'CLASSE',
      classes:{aggr:'AGRESSOR',read:'ESTRATEGISTA',disc:'SENTINELA',press:'INABALÁVEL',none:'EM AVALIAÇÃO'},
      attrs:{aggr:'AGRESSÃO',read:'LEITURA',disc:'DISCIPLINA',press:'PRESSÃO'},
      attrNote:'Atributos = acerto nas suas decisões reais. Aparecem a partir de 3 spots em cada área.',
      dailyKicker:'// MISSÃO DO DIA',dailyTitle:'{n} DECISÕES CERTEIRAS',dailyDone:'MISSÃO DO DIA CUMPRIDA',
      dailySub:'Responda {goal} spots hoje · {c} certos até agora',
      dailyCta:'INICIAR MISSÃO',dailyCtaDone:'CONTINUAR TREINANDO',
      ops:'OPERAÇÕES',attrsTitle:'// ATRIBUTOS DE HERÓI',
      mission:{correct:'MISSÃO CUMPRIDA',adjustable:'AJUSTE TÁTICO',incorrect:'MISSÃO FALHOU'}
    },
    en:{
      hero:'HERO',level:'LV',xpTo:'XP to',max:'Top rank reached',
      ranks:{REC:'RECRUIT',REG:'VETERAN',PRO:'ELITE'},
      classLabel:'CLASS',
      classes:{aggr:'ENFORCER',read:'STRATEGIST',disc:'SENTINEL',press:'UNSHAKEABLE',none:'UNDER REVIEW'},
      attrs:{aggr:'AGGRESSION',read:'READING',disc:'DISCIPLINE',press:'PRESSURE'},
      attrNote:'Attributes = accuracy on your real decisions. They show up after 3 spots in each area.',
      dailyKicker:'// DAILY MISSION',dailyTitle:'{n} SHARP DECISIONS',dailyDone:'DAILY MISSION ACCOMPLISHED',
      dailySub:'Answer {goal} spots today · {c} correct so far',
      dailyCta:'START MISSION',dailyCtaDone:'KEEP TRAINING',
      ops:'OPERATIONS',attrsTitle:'// HERO ATTRIBUTES',
      mission:{correct:'MISSION ACCOMPLISHED',adjustable:'TACTICAL ADJUSTMENT',incorrect:'MISSION FAILED'}
    },
    es:{
      hero:'HÉROE',level:'NV',xpTo:'XP para',max:'Rango máximo',
      ranks:{REC:'RECLUTA',REG:'VETERANO',PRO:'ÉLITE'},
      classLabel:'CLASE',
      classes:{aggr:'AGRESOR',read:'ESTRATEGA',disc:'CENTINELA',press:'INQUEBRANTABLE',none:'EN EVALUACIÓN'},
      attrs:{aggr:'AGRESIÓN',read:'LECTURA',disc:'DISCIPLINA',press:'PRESIÓN'},
      attrNote:'Atributos = acierto en tus decisiones reales. Aparecen a partir de 3 spots en cada área.',
      dailyKicker:'// MISIÓN DEL DÍA',dailyTitle:'{n} DECISIONES CERTERAS',dailyDone:'MISIÓN DEL DÍA CUMPLIDA',
      dailySub:'Responde {goal} spots hoy · {c} correctos hasta ahora',
      dailyCta:'INICIAR MISIÓN',dailyCtaDone:'SEGUIR ENTRENANDO',
      ops:'OPERACIONES',attrsTitle:'// ATRIBUTOS DE HÉROE',
      mission:{correct:'MISIÓN CUMPLIDA',adjustable:'AJUSTE TÁCTICO',incorrect:'MISIÓN FALLIDA'}
    }
  };
  function curLang(){
    let l=null;
    try{ if(typeof lang!=='undefined')l=lang; }catch(_){}
    l=String(l||document.documentElement.lang||'pt').slice(0,2).toLowerCase();
    return TX[l]?l:'pt';
  }
  const tx=()=>TX[curLang()];

  /* ---------------- MODELO DO HERÓI (dados reais) ---------------- */
  const AGGR=/raise|bet|all.?in|shove|jam|3.?bet|4.?bet|squeeze|iso/i;
  const PASSIVE=/fold|check/i;
  const POSTFLOP=/FLOP|TURN|RIVER/i;
  function score(status){return status==='correct'?1:status==='adjustable'?0.5:status==='incorrect'?0:null;}
  function attribute(list){
    const valid=list.map(r=>score(String(r?.status||''))).filter(v=>v!=null);
    if(valid.length<MIN_SAMPLES)return {value:null,samples:valid.length};
    return {value:Math.round(valid.reduce((a,b)=>a+b,0)/valid.length*100),samples:valid.length};
  }
  function heroModel(){
    const X=global.StackUpXPPerformance;
    let s=null;try{s=X?.summary?.()||null;}catch(_){}
    let recs=[];try{recs=global.StackUpTrainingPerformance?.records?.()||[];}catch(_){}
    const xp=Number(s?.heroXP)||0;
    const rank=s?.rank||{name:'REC',progress:0,remaining:2500,next:2500};
    const attrs={
      aggr:attribute(recs.filter(r=>AGGR.test(String(r?.indicatedAction||'')))),
      read:attribute(recs.filter(r=>POSTFLOP.test(String(r?.street||r?.scenario?.street||'')))),
      disc:attribute(recs.filter(r=>PASSIVE.test(String(r?.indicatedAction||''))&&!AGGR.test(String(r?.indicatedAction||'')))),
      press:attribute(recs.filter(r=>String(r?.difficulty||'').toUpperCase()==='PRO'))
    };
    let best='none',bestV=-1;
    Object.entries(attrs).forEach(([k,a])=>{if(a.value!=null&&a.value>bestV){bestV=a.value;best=k;}});
    let events=[];try{events=X?.events?.()||[];}catch(_){}
    const today=new Date();const sameDay=iso=>{const d=new Date(iso);return d.getFullYear()===today.getFullYear()&&d.getMonth()===today.getMonth()&&d.getDate()===today.getDate();};
    const todays=events.filter(e=>e?.answeredAt&&sameDay(e.answeredAt));
    return {
      xp,level:Math.floor(xp/100)+1,rank,attrs,klass:best,
      total:Number(s?.total)||0,
      daily:{done:todays.length,correct:todays.filter(e=>e.status==='correct').length,goal:DAILY_GOAL}
    };
  }

  /* ---------------- MARCAÇÃO ---------------- */
  const ATTR_COLOR={aggr:'#E3263B',read:'#22C8FF',disc:'#3BE38A',press:'#FFB020'};
  function cells(value,n,on){
    const lit=value==null?0:Math.round(value/100*n);
    let h='';for(let i=0;i<n;i++)h+='<i'+(i<lit?' class="on"':'')+(on&&i<lit?' style="background:'+on+'"':'')+'></i>';
    return h;
  }
  function attrsHtml(m){
    const t=tx();
    return '<div class="esq-attrs">'+['aggr','read','press','disc'].map(k=>{
      const a=m.attrs[k];
      return '<div class="esq-attr"><div><span>'+t.attrs[k]+'</span><b>'+(a.value==null?'—':a.value)+'</b></div><div class="esq-cells">'+cells(a.value,10,ATTR_COLOR[k])+'</div></div>';
    }).join('')+'</div>';
  }
  function heroCardHtml(m){
    const t=tx(),r=m.rank;
    const nextName=r.name==='REC'?t.ranks.REG:r.name==='REG'?t.ranks.PRO:null;
    const xpLine=nextName
      ?'<span>'+t.xpTo+' '+nextName+'</span><span>'+m.xp.toLocaleString(curLang()==='en'?'en-US':'pt-BR')+' / '+Number(r.next).toLocaleString(curLang()==='en'?'en-US':'pt-BR')+'</span>'
      :'<span>'+t.max+'</span><span>'+m.xp.toLocaleString(curLang()==='en'?'en-US':'pt-BR')+' XP</span>';
    return '<div class="esq-plate esq-herocard">'+
      '<span class="esq-rank">'+t.level+' '+m.level+' · '+(t.ranks[r.name]||r.name)+'</span>'+
      '<div class="esq-row"><div class="esq-hexav"><i>GR</i></div><div class="esq-id">'+
        '<span class="esq-name">GRINDER</span>'+
        '<span class="esq-class">'+t.classLabel+': '+t.classes[m.klass]+'</span>'+
        '<div class="esq-xpline">'+xpLine+'</div>'+
        '<div class="esq-xpbar"><i style="width:'+Math.max(2,Math.min(100,Number(r.progress)||0)).toFixed(1)+'%"></i></div>'+
      '</div></div>'+attrsHtml(m)+
    '</div>';
  }
  function missionHtml(m){
    const t=tx(),d=m.daily,done=d.done>=d.goal;
    const lit=Math.min(10,Math.floor(d.done/d.goal*10));
    let c='';for(let i=0;i<10;i++)c+='<i'+(i<lit?' class="on"':'')+'></i>';
    return '<div class="esq-plate esq-mission">'+
      '<div class="esq-kicker">'+t.dailyKicker+'</div>'+
      '<div class="esq-headline">'+(done?t.dailyDone:t.dailyTitle.replace('{n}',d.goal))+'</div>'+
      '<div class="esq-sub">'+t.dailySub.replace('{goal}',d.goal).replace('{c}',d.correct)+'</div>'+
      '<div class="esq-progress"><div class="esq-cells">'+c+'</div><span>'+Math.min(d.done,d.goal)+'/'+d.goal+'</span></div>'+
      '<button type="button" class="esq-cta" data-esq-go="spots">'+(done?t.dailyCtaDone:t.dailyCta)+
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" aria-hidden="true"><path d="M6 4l8 8-8 8M13 4l8 8-8 8"/></svg></button>'+
    '</div>';
  }

  /* ---------------- LIGAÇÃO COM O APP ---------------- */
  let R=null,host=null,appLink=null;
  function keepLinkLast(){
    if(!R||!appLink)return;
    let n=appLink.nextElementSibling,needs=false;
    while(n){if(n.tagName==='STYLE'||n.tagName==='LINK'){needs=true;break;}n=n.nextElementSibling;}
    if(needs||!appLink.isConnected)R.appendChild(appLink);
  }
  function renderHome(){
    if(!R)return;
    const grid=R.querySelector('.homegrid');if(!grid)return;
    let block=R.querySelector('.esq-home');
    if(!block){
      block=document.createElement('div');block.className='esq-block esq-home';
      grid.parentNode.insertBefore(block,grid);
      const label=document.createElement('div');label.className='esq-section-label esq-ops-label';
      grid.parentNode.insertBefore(label,grid);
    }
    const label=R.querySelector('.esq-ops-label');
    const visible=!grid.hidden;
    block.classList.toggle('esq-hidden',!visible);
    if(label){label.classList.toggle('esq-hidden',!visible);label.textContent=tx().ops;}
    if(!visible)return;
    const m=heroModel();
    const html=heroCardHtml(m)+missionHtml(m);
    if(block.__esqHtml!==html){block.__esqHtml=html;block.innerHTML=html;}
  }
  function renderStatsAttrs(){
    if(!R)return;
    const panel=R.querySelector('.statspanel');
    if(!panel||panel.hidden||panel.style.display==='none')return;
    if(panel.firstElementChild&&panel.firstElementChild.classList.contains('esq-statsattrs'))return;
    const old=panel.querySelector('.esq-statsattrs');if(old)old.remove();
    const m=heroModel(),t=tx();
    const el=document.createElement('div');el.className='esq-block esq-statsattrs';
    el.innerHTML='<div class="esq-plate"><div class="esq-kicker" style="color:#22C8FF">'+t.attrsTitle+'</div>'+
      '<div class="esq-class" style="margin-top:6px">'+t.classLabel+': '+t.classes[m.klass]+' · '+t.level+' '+m.level+' · '+(t.ranks[m.rank.name]||m.rank.name)+'</div>'+
      attrsHtml(m)+'<div class="esq-note">'+t.attrNote+'</div></div>';
    panel.insertBefore(el,panel.firstChild);
  }
  function markFeedback(){
    if(!R)return;
    const fb=R.querySelector('.spotfeedback');if(!fb)return;
    const st=['correct','adjustable','incorrect'].find(c=>fb.classList.contains(c));
    const want=st?tx().mission[st]:'';
    if(fb.getAttribute('data-mission')!==want)fb.setAttribute('data-mission',want);
  }
  function swapLogos(root){
    if(!root)return;
    root.querySelectorAll('img[src*="logo-stackup-"]').forEach(img=>{
      const src=img.getAttribute('src');img.setAttribute('src',src.replace('logo-stackup-','logo-esquadrao-'));
    });
  }
  let pending=0;
  function refresh(){
    if(pending)return;
    pending=global.requestAnimationFrame(()=>{pending=0;try{swapLogos(R);renderHome();renderStatsAttrs();markFeedback();}catch(_){}});
  }
  function attach(){
    host=document.getElementById('app2');
    R=host&&host.shadowRoot;
    if(!R)return false;
    host.classList.add('esq');
    swapLogos(document);swapLogos(R);
    appLink=document.createElement('link');appLink.rel='stylesheet';appLink.href='grinder-esquadrao-app.css?v=esq4';appLink.setAttribute('data-esq','');
    R.appendChild(appLink);
    new MutationObserver(()=>{keepLinkLast();refresh();}).observe(R,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','style']});
    R.addEventListener('click',e=>{
      const go=e.target.closest&&e.target.closest('[data-esq-go]');
      if(go){const tab=R.querySelector('.tab[data-t="'+go.getAttribute('data-esq-go')+'"]');if(tab)tab.click();}
    });
    document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#menu button'))setTimeout(refresh,30);});
    global.addEventListener('focus',refresh);
    refresh();
    return true;
  }
  if(ACTIVE){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{if(!attach())setTimeout(attach,300);});
    else if(!attach())setTimeout(attach,300);
  }

  global.StackUpEsquadrao=Object.freeze({active:ACTIVE,model:heroModel,refresh});
})(window);
