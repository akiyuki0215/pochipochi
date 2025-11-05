// vendor_vaio.js  (ver 2025-11-05)
import { ui } from './core.js';

export function renderVAIO(step="chooseMaker"){
  ui.clear();
  if(step==="chooseMaker"){
    ui.pushCrumb("VAIO");
    ui.panel.append(ui.h2("Sony株式会社が販売しているVAIOですか？ それとも VAIO株式会社が販売しているVAIOですか？"));
    ui.panel.append(ui.h2("時期目安・製造元"));
    ui.panel.append(ui.result("warn","",[
      "〜2014年6月頃まで　→　ソニー株式会社",
      "2014年7月以降　　　→　VAIO株式会社（長野県安曇野市）"
    ]));
    const row=ui.rowBox();
    row.append(ui.chip("Sony株式会社のVAIO", ()=> renderVAIO("sony")));
    row.append(ui.chip("VAIO株式会社のVAIO", ()=> renderVAIO("vaio_corp_q")));
    ui.panel.append(row);
    return;
  }
  if(step==="sony"){
    ui.clear();
    ui.panel.append(ui.result("warn","店舗受付不可の可能性（要案内）",[
      "Sony株式会社が販売しているVAIO製品の修理受付は終了している可能性が高いですが、下記にて問い合わせ可能です。",
      "VAIOカスタマーリンク修理相談窓口：0120-60-5599（フリーダイヤル）",
      "受付時間：月～金 9:00～18:00（祝日・年末年始除く）"
    ]));
    return;
  }
  if(step==="vaio_corp_q"){
    ui.clear();
    ui.panel.append(ui.h2("当社で購入していますか？"));
    const row=ui.rowBox();
    row.append(ui.chip("はい", ()=> renderVAIO("vaio_corp_yes")));
    row.append(ui.chip("いいえ", ()=> renderVAIO("vaio_corp_no")));
    ui.panel.append(row);
    return;
  }
  if(step==="vaio_corp_yes"){
    ui.clear();
    ui.panel.append(ui.result("ok","店舗で修理受付を行ってください。",[
      "商品センター下取り修理班宛（080-9365-5140）へ連絡し、修理センター経由でVAIOに修理依頼を行ってください。",
      "保守期間: 発売日から約5年（目安）"
    ]));
    return;
  }
  if(step==="vaio_corp_no"){
    ui.clear();
    ui.panel.append(ui.result("warn","修理受付は可能（注意喚起）",[
      "店舗で修理受付は可能ですが、お客様がメーカーと直接やり取りするよりも高額になる可能性があります。",
      "ご説明のうえ、判断を尊重してください。"
    ]));
    return;
  }
}
