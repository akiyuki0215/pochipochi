// vendor_generic.js
export function renderSurface({panel}){
  panel.innerHTML="";
  panel.append(result("ng","店舗修理受付不可（メーカー直接）",[
    "当店での修理受付はできません。お客様とメーカーで直接のやり取りになります。",
    "マイクロソフトサポートセンター（Surface専用）",
    "電話番号：0120-54-2244",
    "受付時間：月〜金 9:00〜18:00（土日祝休み）"
  ]));
}

export function renderGeneric(ctx, maker, path=[], overseas=false){
  const { panel, DATA, trail, push } = ctx;
  panel.innerHTML="";
  if(path.length===0){
    panel.append(h2("メーカー保証の期間内ですか？"));
    const row=rowBox();
    row.append(chip("はい",()=>{ push("保証：はい"); renderGeneric(ctx, maker, ["w_yes"],overseas);}));
    row.append(chip("いいえ",()=>{ push("保証：いいえ"); renderGeneric(ctx, maker, ["w_no"],overseas);}));
    panel.append(row);
    return;
  }
  if(path[0]==="w_yes"){
    if(!overseas){
      const lines = (DATA.text?.domestic?.r_warranty_details||[]).slice();
      const extra = DATA.makerInfo?.[maker];
      if(extra) lines.push(...extra);
      panel.append(result("ok", DATA.text?.domestic?.r_warranty_title||"メーカー保証内の受付", lines));
      return;
    }else{
      if(path.length===1){
        panel.append(h2(DATA.text?.common?.q_hasNojima||"ノジマの保証に入っていますか？"));
        const row=rowBox();
        row.append(chip("はい",()=>renderGeneric(ctx, maker, ["w_yes","n_yes"],true)));
        row.append(chip("いいえ",()=>renderGeneric(ctx, maker, ["w_yes","n_no"],true)));
        panel.append(row);
        return;
      }
      if(path[1]==="n_yes"){
        const lines=[...(DATA.text?.overseas?.r_store_ok_details||[])];
        const extra = DATA.makerInfo?.[maker];
        if(extra) lines.push(...extra);
        panel.append(result("ok", DATA.text?.overseas?.r_store_ok_title||"店舗での修理受付：対応可能", lines));
        return;
      }
      if(path[1]==="n_no"){
        const lines=[...(DATA.text?.overseas?.r_warn_details||[])];
        const extra = DATA.makerInfo?.[maker];
        if(extra) lines.push(...extra);
        panel.append(result("warn", DATA.text?.overseas?.r_warn_title||"修理受付可能（注意喚起）", lines));
        return;
      }
    }
  }
  if(path[0]==="w_no"){
    const lines=[...(DATA.text?.domestic?.r_prepay_details||[])];
    const extra = DATA.makerInfo?.[maker];
    if(extra) lines.push(...extra);
    panel.append(result("warn", DATA.text?.domestic?.r_prepay_title||"修理受付は可能（前受け金あり）", lines));
    return;
  }
}

// --- UI helpers ---
function h2(t){ const el=document.createElement("div"); el.className="section-title"; el.textContent=t; return el; }
function rowBox(){ const el=document.createElement("div"); el.className="row"; return el; }
function chip(label,on){ const el=document.createElement("button"); el.className="chip"; el.textContent=label; el.onclick=on; return el; }
function result(kind,title,lines){ const el=document.createElement("div"); el.className=`result ${kind||"warn"}`; el.innerHTML=`<h3>${title}</h3>${(lines||[]).map(t=>`<p>${t}</p>`).join("")}`; return el; }
