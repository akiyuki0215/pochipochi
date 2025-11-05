export const app = {
  DATA:null,LOGS:null,panel:null,crumb:null,stack:[],registry:{},
  register(key,fn){this.registry[key]=fn;},
  go(view){this.stack.push(view);view();},
  goBack(){if(this.stack.length>1){this.stack.pop();const prev=this.stack[this.stack.length-1];prev();}},
  goHome(){this.stack=[];renderHome();}
};

export const ui={
  panel:null,crumb:null,
  clear(){ui.panel.innerHTML='';},
  pushCrumb(txt){ui.crumb.textContent=`進行：${txt}`;},
  h2(txt){const h=document.createElement('h2');h.textContent=txt;return h;},
  rowBox(){const d=document.createElement('div');d.className='row';return d;},
  chip(label,on){const b=document.createElement('div');b.className='chip';b.textContent=label;b.onclick=on;return b;},
  result(kind,title,lines){const wrap=document.createElement('div');wrap.className=`result ${kind}`;
    const h=document.createElement('h3');h.textContent=title||'';wrap.append(h);
    if(lines?.length){const ul=document.createElement('ul');
      for(const s of lines){const li=document.createElement('li');li.textContent=s;ul.append(li);}wrap.append(ul);}
    return wrap;}
};

async function loadJSON(url,fallback=null){
  try{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${url} ${r.status}`);return await r.json();}
  catch(e){console.warn('loadJSON fallback:',url,e);return fallback;}
}

export async function initApp(){
  ui.panel=document.getElementById('panel');ui.crumb=document.getElementById('crumb');
  app.DATA=await loadJSON('./data.json',{groups:{},text:{}});
  app.LOGS=await loadJSON('./update_log.json',{logs:[]});
  const hist=document.getElementById('history');const tbl=document.createElement('table');tbl.className='table';
  tbl.innerHTML=`<thead><tr><th>日付</th><th>店舗名</th><th>名前</th><th>更新内容</th></tr></thead>`;
  const tbody=document.createElement('tbody');
  (app.LOGS.logs||[]).forEach(r=>{const tr=document.createElement('tr');
    tr.innerHTML=`<td>${r.date||''}</td><td>${r.store||''}</td><td>${r.name||''}</td><td>${r.content||''}</td>`;
    tbody.append(tr);});
  tbl.append(tbody);hist.replaceChildren(tbl);
}

export function renderHome(){
  ui.clear();ui.pushCrumb('メーカー選択');
  const g=app.DATA?.groups||{};const mkPanel=document.createElement('div');
  const section=(title,list,onclick)=>{if(!Array.isArray(list)||!list.length)return;
    const h=ui.h2(title);mkPanel.append(h);const row=ui.rowBox();
    for(const name of list){row.append(ui.chip(name,()=>onclick(name)));}mkPanel.append(row);};
  section('国内メーカー',g.domestic,name=>{app.go(()=>app.registry['__domestic__']?.(name));});
  section('海外メーカー',g.overseas,name=>{app.go(()=>app.registry['__overseas__']?.(name));});
  section('Surface',g.surface,_=>{app.go(()=>app.registry['Apple']?.(['surface']));});
  section('Apple',g.apple,_=>{app.go(()=>app.registry['Apple']?.([]));});
  ui.panel.append(mkPanel);
  document.getElementById('historyWrap').open=true;
}
