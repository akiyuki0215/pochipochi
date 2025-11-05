// === APPLE SPECIAL BEGIN (Do NOT edit without reason) ===
export function renderApple(ctx, path=[]){
  const { panel, DATA, pushCrumb, nav } = ctx;
  panel.innerHTML="";
  if(path.length===0){
    panel.append(h2(DATA.text?.apple?.q_hasWarranty || "メーカー保証の期間内ですか？"));
    const row=rowBox();
    row.append(chip("はい", ()=>{ pushCrumb("保証：はい"); nav("apple", [ctx, ["w_yes"]]); }));
    row.append(chip("いいえ", ()=>{ pushCrumb("保証：いいえ"); nav("apple", [ctx, ["w_no"]]); }));
    panel.append(row);
    return;
  }
  if(path[0]==="w_no"){
    panel.append(result("ng", DATA.text.apple.r_direct_title, [
      ...DATA.text.apple.r_direct_details
    ]));
    return;
  }
  if(path[0]==="w_yes" && path.length===1){
    panel.append(h2(DATA.text.apple.q_nojima_type || "ノジマ保証のご加入状況を選択してください"));
    const row=rowBox();
    row.append(chip(DATA.text.apple.l_ultimate || "① アルティメット保証に加入している", ()=> nav("apple", [ctx, ["w_yes","ult"]]) ));
    row.append(chip(DATA.text.apple.l_premium_plus || "② プレミアム保証プラスに加入している", ()=> nav("apple", [ctx, ["w_yes","pre"]]) ));
    row.append(chip(DATA.text.apple.l_no_contract || "③ 保証に入っていない", ()=> nav("apple", [ctx, ["w_yes","none"]]) ));
    panel.append(row);
    return;
  }
  if(path[1]==="ult"){
    panel.append(result("ok", DATA.text.apple.r_ultimate_title, [
      ...DATA.text.apple.r_ultimate_details
    ]));
    return;
  }
  if(path[1]==="pre" && path.length===2){
    panel.append(h2(DATA.text.apple.q_after_date || "2023年6月1日以降に購入されていますか？"));
    const row=rowBox();
    row.append(chip("はい", ()=> nav("apple", [ctx, ["w_yes","pre","after_yes"]]) ));
    row.append(chip("いいえ", ()=> nav("apple", [ctx, ["w_yes","pre","after_no"]]) ));
    panel.append(row);
    return;
  }
  if(path[1]==="pre" && path[2]==="after_yes"){
    panel.append(result("warn", DATA.text.apple.r_pre_title, [
      ...DATA.text.apple.r_pre_details
    ]));
    return;
  }
  if(path[1]==="pre" && path[2]==="after_no"){
    panel.append(result("ok", "通常どおり修理受付 → ウチダエスコ", [
      "通常通り修理受付をしてください。",
      "提携修理先ウチダエスコでの修理対応になります。",
      "Apple用製品修理申込書を記載の上、修理受付を行ってください。"
    ]));
    return;
  }
  if(path[1]==="none"){
    panel.append(result("ng", DATA.text.apple.r_direct_title, [
      ...DATA.text.apple.r_direct_details
    ]));
    return;
  }
  panel.append(result("ng", DATA.text.apple.r_direct_title, [
    ...DATA.text.apple.r_direct_details
  ]));
}
// === APPLE SPECIAL END ===

function h2(t){ const el=document.createElement("div"); el.className="section-title"; el.textContent=t; return el; }
function rowBox(){ const el=document.createElement("div"); el.className="row"; return el; }
function chip(label,on){ const el=document.createElement("button"); el.className="chip"; el.textContent=label; el.onclick=on; return el; }
function result(kind,title,lines){ const el=document.createElement("div"); el.className=`result ${kind||"warn"}`; el.innerHTML=`<h3>${title}</h3>${(lines||[]).map(t=>`<p>${t}</p>`).join("")}`; return el; }
