// vendor_overseas.js  (ver 2025-11-05)
import { ui, app } from './core.js';

// 海外: 保証→ノジマ保証確認→結果
export function renderOverseas(maker){
  ui.clear();
  ui.pushCrumb(maker);
  const q = app.DATA?.text?.overseas?.q_hasWarranty || "メーカー保証の期間内ですか？";
  const sec = document.createElement("div");
  const row = ui.rowBox();
  sec.append(ui.h2(q));
  row.append(ui.chip("はい", ()=> overseasWarrantyYes(maker)));
  row.append(ui.chip("いいえ", ()=> overseasWarrantyNo(maker)));
  sec.append(row);
  ui.panel.append(sec);
}

function overseasWarrantyYes(maker){
  // Yes → ノジマ保証 ある/なし
  ui.clear();
  const q = app.DATA?.text?.common?.q_hasNojima || "ノジマの保証に入っていますか？";
  const row = ui.rowBox();
  ui.panel.append(ui.h2(q));
  row.append(ui.chip("はい", ()=> overseasYesNojimaYes(maker)));
  row.append(ui.chip("いいえ", ()=> overseasYesNojimaNo(maker)));
  ui.panel.append(row);
}

function overseasYesNojimaYes(maker){
  ui.clear();
  const title = app.DATA?.text?.overseas?.r_store_ok_title || "店舗での修理受付：対応可能（ノジマ保証）";
  const lines = (app.DATA?.text?.overseas?.r_store_ok_details||[]).slice();
  const extra = app.DATA?.makerInfo?.[maker];
  if(extra) lines.push(...extra);
  ui.panel.append(ui.result("ok", title, lines));
}

function overseasYesNojimaNo(maker){
  ui.clear();
  const title = app.DATA?.text?.overseas?.r_warn_title || "修理受付可能（注意喚起）";
  const lines = (app.DATA?.text?.overseas?.r_warn_details||[]).slice();
  const extra = app.DATA?.makerInfo?.[maker];
  if(extra) lines.push(...extra);
  ui.panel.append(ui.result("warn", title, lines));
}

function overseasWarrantyNo(maker){
  // No → 注意喚起（ノジマ受付は可能だが高額化の可能性）
  ui.clear();
  const title = app.DATA?.text?.overseas?.r_warn_title || "修理受付可能（注意喚起）";
  const lines = (app.DATA?.text?.overseas?.r_warn_details||[]).slice();
  const extra = app.DATA?.makerInfo?.[maker];
  if(extra) lines.push(...extra);
  ui.panel.append(ui.result("warn", title, lines));
}
