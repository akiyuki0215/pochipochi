// ===== core.js (safe loader & router) =====
(() => {
  const state = {
    stack: [],     // navigation stack
    data: null,    // loaded data.json
  };

  // ---------- utils ----------
  function $(sel){ return document.querySelector(sel); }
  function el(tag, attrs={}){
    const node = document.createElement(tag);
    Object.entries(attrs||{}).forEach(([k,v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    });
    return node;
  }

  async function loadJSON(url){
    try{
      const res = await fetch(url, { cache: 'no-store' });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    }catch(err){
      fatal(`設定ファイルの読み込みに失敗しました: ${url} / ${err.message}`);
      throw err;
    }
  }

  function fatal(msg){
    const box = $('#menuBox');
    if (box) box.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
  }

  function info(msg, tone='warn'){
    const box = $('#menuBox');
    if (box) box.innerHTML = `<div class="alert alert-${tone === 'ok' ? 'success':'warn'}">${msg}</div>`;
  }

  // ---------- renderer ----------
  function setProgress(pathTexts){
    $('#progress').textContent = '進行：' + (pathTexts.length ? pathTexts.join(' > ') : 'メーカー選択');
    // fire event for update accordion visibility
    document.dispatchEvent(new CustomEvent('nav:changed', { detail: { level: pathTexts.length ? 'inner':'root' } }));
  }

  function renderTopMenu(){
    const box = $('#menuBox');
    box.innerHTML = '';
    const g = state.data.groups;
    const title = el('div', {class:'section-title', text:'メーカー選択'});
    box.appendChild(title);

    function makeGroup(titleText, items){
      const wrap = el('div', {class:'card'});
      const head = el('div', {class:'section-title', text:titleText});
      wrap.appendChild(head);
      const row = el('div', {class:'row'});
      items.forEach(name => {
        const btn = el('button', {class:'btn'});
        btn.textContent = name;
        btn.addEventListener('click', () => onBrandSelected(name));
        row.appendChild(btn);
      });
      wrap.appendChild(row);
      return wrap;
    }

    // show groups
    box.appendChild(makeGroup('国内メーカー', g.domestic || []));
    box.appendChild(makeGroup('海外メーカー', g.overseas || []));
    box.appendChild(makeGroup('Surface', g.surface || []));
    box.appendChild(makeGroup('Apple', g.apple || []));

    setProgress([]);
  }

  function renderResult(html, tone='ok'){
    const box = $('#menuBox');
    const cls = tone==='ok' ? 'alert-success' : tone==='ng' ? 'alert-danger' : 'alert-warn';
    box.innerHTML = `<div class="alert ${cls}">${html}</div>`;
  }

  // ---------- vendor dispatch ----------
  // Each vendor_*.js should register handler into window.VENDOR_HANDLERS
  function getVendorHandler(brand){
    const map = (window.VENDOR_HANDLERS || {});
    return map[brand];
  }

  function onBrandSelected(brand){
    state.stack.push({ type:'brand', label: brand });
    setProgress(state.stack.map(s => s.label));

    const handler = getVendorHandler(brand);
    if (handler && typeof handler.start === 'function'){
      // let vendor render into #menuBox and use helpers we pass
      handler.start({
        container: $('#menuBox'),
        data: state.data,
        ui: { renderResult, makeBtn, setProgress, push, pop }
      });
    }else{
      // fallback: simple message
      info(`${brand} の詳細フローが未設定です。`, 'warn');
    }
  }

  // helper to create button
  function makeBtn(label, onclick){
    const b = el('button', {class:'btn'});
    b.textContent = label;
    b.addEventListener('click', onclick);
    return b;
  }

  function push(node){ state.stack.push(node); setProgress(state.stack.map(s=>s.label)); }
  function pop(){ state.stack.pop(); setProgress(state.stack.map(s=>s.label)); }

  // ---------- update log (top only) ----------
  async function loadUpdateLog(url){
    try{
      const data = await loadJSON(url);
      const tbody = $('#updateTbody');
      tbody.innerHTML = '';
      (data.records || []).forEach(r => {
        const tr = document.createElement('tr');
        ['date','store','name','note'].forEach(k => {
          const td = document.createElement('td');
          td.style.padding = '6px';
          td.textContent = r[k] ?? '';
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }catch(_e){
      // 既定のメッセージのままにする
    }
  }

  // ---------- public init ----------
  async function initApp(cfg){
    // wire buttons
    $('#btnHome').addEventListener('click', () => { state.stack = []; renderTopMenu(); });
    $('#btnBackOne').addEventListener('click', () => {
      if (state.stack.length === 0){ renderTopMenu(); return; }
      state.stack.pop();
      if (state.stack.length === 0){ renderTopMenu(); return; }
      // 再描画（ブランド直下は開始から呼び直す）
      const top = state.stack[state.stack.length-1];
      if (top.type === 'brand'){
        state.stack.pop();  // brand を抜いて再開
        onBrandSelected(top.label);
      }else{
        renderTopMenu();
      }
    });

    // update log accordion visibility
    const acc = $('#updateAccordion');
    document.addEventListener('nav:changed', (e)=>{
      if (!acc) return;
      acc.style.display = (e.detail.level === 'root') ? '' : 'none';
      if (e.detail.level === 'root') acc.open = false;
    });

    // load jsons
    state.data = await loadJSON(cfg.dataUrl);
    renderTopMenu();
    if (cfg.updateLogUrl) loadUpdateLog(cfg.updateLogUrl);
  }

  // expose
  window.initApp = initApp;
  window.renderResult = renderResult; // optional use from vendor files
  window.makeBtn = makeBtn;
})();