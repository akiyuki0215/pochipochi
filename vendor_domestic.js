// vendor_domestic.js  (ver 2025-11-05)
import { ui, app } from './core.js';

// 国内: 汎用分岐（メーカー保証→可/不可）
export function renderDomestic(maker){
  ui.clear();
  ui.pushCrumb(maker);
  // 第1分岐：メーカー保証期間内？
  const q = app.DATA?.text?.domestic?.q_hasWarranty || "メーカー保証の期間内ですか？";
  const row = ui.rowBox();
  const sec = document.createElement("div");
  sec.append(ui.h2(q));
  row.append(ui.chip("はい", ()=> showDomesticWarrantyYes(maker)));
  row.append(ui.chip("いいえ", ()=> showDomesticWarrantyNo(maker)));
  sec.append(row);
  ui.panel.append(sec);
}

function showDomesticWarrantyYes(maker){
  ui.clear();
  const title = app.DATA?.text?.domestic?.r_warranty_title || "メーカー保証内の受付（注意事項あり）";
  const lines = (app.DATA?.text?.domestic?.r_warranty_details||[]).slice();
  const extra = app.DATA?.makerInfo?.[maker];
  if(extra) lines.push(...extra);
  ui.panel.append(ui.result("ok", title, lines));
}

function showDomesticWarrantyNo(maker){
  ui.clear();
  const title = app.DATA?.text?.domestic?.r_prepay_title || "修理受付は可能（前受け金あり）";
  const lines = (app.DATA?.text?.domestic?.r_prepay_details||[]).slice();
  const extra = app.DATA?.makerInfo?.[maker];
  if(extra) lines.push(...extra);
  ui.panel.append(ui.result("warn", title, lines));
}

// Surface（Microsoft）は店舗受付不可 + 連絡先表示
export function renderSurface(){
  ui.clear();
  ui.pushCrumb("Surface");
  ui.panel.append(ui.result("ng","店舗修理受付不可（メーカー直接）",[
    "当店での修理受付はできません。お客様とメーカーで直接のやり取りになります。",
    "マイクロソフトサポートセンター（Surface専用）",
    "電話番号：0120-54-2244",
    "受付時間：月〜金 9:00〜18:00（土日祝休み）"
  ]));
}
