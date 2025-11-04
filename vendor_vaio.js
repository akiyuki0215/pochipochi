// === VAIO SPECIAL BEGIN (Do NOT edit without reason) ===
export function renderVAIO(ctx, step="chooseMaker"){
  const { panel } = ctx;
  panel.innerHTML="";
  if(step==="chooseMaker"){
    panel.append(h2("Sony株式会社が販売しているVAIOですか？ それとも VAIO株式会社が販売しているVAIOですか？"));
    panel.append(h2("時期目安・製造元"));
    panel.append(result("warn","",[
      "〜2014年6月頃まで　→　ソニー株式会社",
      "2014年7月以降　　　→　VAIO株式会社（長野県安曇野市）"
    ]));
    const row=rowBox();
    row.append(chip("Sony株式会社のVAIO", ()=>{ renderVAIO(ctx,"sony"); }));
    row.append(chip("VAIO株式会社のVAIO", ()=>{ renderVAIO(ctx,"vaio_corp_q"); }));
    panel.append(row);
    return;
  }
  if(step==="sony"){
    panel.append(result("ng","店舗受付不可の可能性（要案内）",[
      "Sony株式会社が販売しているVAIO製品の修理受付は終了している可能性が高いですが、下記にて問い合わせ可能です。",
      "VAIOカスタマーリンク修理相談窓口：0120-60-5599（フリーダイヤル）",
      "受付時間：月～金 9:00～18:00（祝日・年末年始除く）"
    ]));
    return;
  }
  if(step==="vaio_corp_q"){
    panel.append(h2("当社で購入していますか？"));
    const row=rowBox();
    row.append(chip("はい", ()=>{ renderVAIO(ctx,"vaio_corp_yes"); }));
    row.append(chip("いいえ", ()=>{ renderVAIO(ctx,"vaio_corp_no"); }));
    panel.append(row);
    return;
  }
  if(step==="vaio_corp_yes"){
    panel.append(result("ok","店舗で修理受付を行ってください。",[
      "修理依頼先: ノジマ修理センター（修理センター経由でVAIOに修理依頼）",
      "保守期間: 発売日から約5年（目安）"
    ]));
    return;
  }
  if(step==="vaio_corp_no"){
    panel.append(result("warn","修理受付は可能（注意喚起）",[
      "店舗で修理受付は可能ですが、お客様がメーカーと直接やり取りするよりも高額になる可能性があります。",
      "ご説明のうえ、判断を尊重してください。"
    ]));
    return;
  }
}
// === VAIO SPECIAL END ===

function h2(t){ const el=document.createElement("div"); el.className="section-title"; el.textContent=t; return el; }
function rowBox(){ const el=document.createElement("div"); el.className="row"; return el; }
function chip(label,on){ const el=document.createElement("button"); el.className="chip"; el.textContent=label; el.onclick=on; return el; }
function result(kind,title,lines){ const el=document.createElement("div"); el.className=`result ${kind||"warn"}`; el.innerHTML=`<h3>${title}</h3>${(lines||[]).map(t=>`<p>${t}</p>`).join("")}`; return el; }
