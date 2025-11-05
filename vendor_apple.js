// vendor_apple.js  (ver 2025-11-05)
import { ui, app } from './core.js';

// 仕様：
// ・メーカー保証「はい」→ Apple 直接案内（店頭受付不可）
// ・メーカー保証「いいえ」→ ノジマ保証 3択（アルティメット／プレミアム保証プラス／未加入）
//   ・アルティメット：店頭で商品交換 or ポイントバック（マニュアル要確認）
//   ・プレミアム保証プラス：購入日分岐（2023/06/01以降=ポイントバック案内、以前=ウチダエスコへ）
//   ・未加入：Apple 直接案内
export function renderApple(path=[]){
  ui.clear();
  if(path.length===0){
    ui.pushCrumb("Apple");
    const q = app.DATA?.text?.apple?.q_hasWarranty || "メーカー保証の期間内ですか？";
    const row = ui.rowBox();
    ui.panel.append(ui.h2(q));
    row.append(ui.chip("はい", ()=> renderApple(["w_yes"])));
    row.append(ui.chip("いいえ", ()=> renderApple(["w_no"])));
    ui.panel.append(row);
    return;
  }
  // 保証「はい」→ Apple 直接
  if(path[0]==="w_yes"){
    ui.clear();
    ui.panel.append(ui.result("ng", app.DATA.text.apple.r_direct_title, [
      ...(app.DATA.text.apple.r_direct_details || [])
    ]));
    return;
  }
  // 保証「いいえ」→ 3択
  if(path[0]==="w_no" && path.length===1){
    const q = app.DATA?.text?.apple?.q_nojima_type || "ノジマ保証のご加入状況を選択してください";
    const row = ui.rowBox();
    ui.panel.append(ui.h2(q));
    row.append(ui.chip(app.DATA.text.apple.l_ultimate || "① アルティメット保証に加入している", ()=> renderApple(["w_no","ult"])));
    row.append(ui.chip(app.DATA.text.apple.l_premium_plus || "② プレミアム保証プラスに加入している", ()=> renderApple(["w_no","pre"])));
    row.append(ui.chip(app.DATA.text.apple.l_no_contract || "③ 保証に入っていない", ()=> renderApple(["w_no","none"])));
    ui.panel.append(row);
    return;
  }
  if(path[0]==="w_no" && path[1]==="ult"){
    ui.clear();
    ui.panel.append(ui.result("ok", app.DATA.text.apple.r_ultimate_title, [
      ...(app.DATA.text.apple.r_ultimate_details || [])
    ]));
    return;
  }
  if(path[0]==="w_no" && path[1]==="pre" && path.length===2){
    const q = app.DATA?.text?.apple?.q_after_date || "2023年6月1日以降に購入されていますか？";
    const row = ui.rowBox();
    ui.panel.append(ui.h2(q));
    row.append(ui.chip("はい", ()=> renderApple(["w_no","pre","after_yes"])));
    row.append(ui.chip("いいえ", ()=> renderApple(["w_no","pre","after_no"])));
    ui.panel.append(row);
    return;
  }
  if(path[0]==="w_no" && path[1]==="pre" && path[2]==="after_yes"){
    ui.clear();
    ui.panel.append(ui.result("warn", app.DATA.text.apple.r_pre_title, [
      ...(app.DATA.text.apple.r_pre_details || [])
    ]));
    return;
  }
  if(path[0]==="w_no" && path[1]==="pre" && path[2]==="after_no"){
    ui.clear();
    ui.panel.append(ui.result("ok", "通常どおり修理受付 → ウチダエスコ", [
      "通常通り修理受付をしてください。",
      "提携修理先ウチダエスコでの修理対応になります。",
      "Apple用製品修理申込書を記載の上、修理受付を行ってください。"
    ]));
    return;
  }
  if(path[0]==="w_no" && path[1]==="none"){
    ui.clear();
    ui.panel.append(ui.result("ng", app.DATA.text.apple.r_direct_title, [
      ...(app.DATA.text.apple.r_direct_details || [])
    ]));
    return;
  }
  // フォールバック
  ui.panel.append(ui.result("ng", app.DATA.text.apple.r_direct_title, [
    ...(app.DATA.text.apple.r_direct_details || [])
  ]));
}
