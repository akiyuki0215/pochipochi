// core.js  (ver 2025-11-05 stable-split)
// 役割: 画面遷移・共通UI・JSON読み込み・履歴制御
export const ui = (()=>{
  const $=(q,el=document)=>el.querySelector(q);
  const panel = $("#panel");
  const crumb = $("#crumb");
  const backBtn = $("#backBtn");
  const homeBtn = $("#homeBtn");
  const historyBox = $("#history");
  let historyShown=false;

  const trail=[];            // パンくず
  const viewStack=[];        // 画面復元

  function h2(t){ const el=document.createElement("div"); el.className="section-title"; el.textContent=t; return el; }
  function rowBox(){ const el=document.createElement("div"); el.className="row"; return el; }
  function chip(label,on){ const el=document.createElement("button"); el.type="button"; el.className="chip"; el.textContent=label; el.onclick=on; return el; }
  function result(kind,title,lines){
    const el=document.createElement("div");
    el.className=`result ${kind||"warn"}`;
    el.innerHTML=`<h3>${title}</h3>${(lines||[]).map(t=>`<p>${t}</p>`).join("")}`;
    return el;
  }
  function clear(){ panel.innerHTML=""; }
  function syncCrumb(){ crumb.textContent = "進行： " + (trail.length?trail.join(" > "):"メーカー選択"); backBtn.disabled=viewStack.length<=1; }
  function pushCrumb(label){ trail.push(label); syncCrumb(); }
  function popCrumb(){ trail.pop(); syncCrumb(); }
  function resetCrumb(){ trail.length=0; syncCrumb(); }

  function pushView(screen,args){ viewStack.push({screen,args}); }
  function current(){ return viewStack[viewStack.length-1] || null; }
  function goBack(renderer){
    if(viewStack.length>1){
      viewStack.pop();
      const cur=current();
      if(!cur) return;
      renderer(cur.screen, ...(cur.args||[]));
    }
  }
  function goHome(renderer){
    viewStack.length=0;
    resetCrumb();
    renderer("home");
  }

  async function safeFetchJSON(path){
    try{
      const res=await fetch(path,{cache:"no-store"});
      if(!res.ok) throw new Error(res.status+" "+res.statusText);
      return await res.json();
    }catch(e){
      console.error("JSON load error:", path, e);
      return null;
    }
  }

  async function renderHistoryOnce(){
    if(historyShown) { historyBox.style.display="none"; return; }
    const tbody=document.querySelector("#historyTable tbody");
    tbody.innerHTML="";
    try{
      const log = await safeFetchJSON("update_log.json");
      if(!Array.isArray(log)){ tbody.innerHTML=`<tr><td colspan="4" class="muted">update_log.json が見つからないか形式不正です。</td></tr>`; }
      else {
        for(const r of log){
          const tr=document.createElement("tr");
          tr.innerHTML=`<td>${r.date||"-"}</td><td>${r.store||"-"}</td><td>${r.name||"-"}</td><td>${r.note||"-"}</td>`;
          tbody.append(tr);
        }
      }
    }catch(_){ tbody.innerHTML=`<tr><td colspan="4" class="muted">履歴を読み込めませんでした。</td></tr>`; }
    historyBox.style.display="";
    historyShown=true;
  }

  return {
    $, panel, crumb, backBtn, homeBtn,
    historyBox,
    h2, rowBox, chip, result, clear,
    pushCrumb, popCrumb, resetCrumb, syncCrumb,
    pushView, goBack, goHome, current,
    renderHistoryOnce, safeFetchJSON
  };
})();

// アプリ本体（データ共有）
export const app = {
  DATA: null
};
