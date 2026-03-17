(() => {
  if (window.__eeLoaded) return;
  window.__eeLoaded = true;

  let activeEl = null;
  let bubble = null;
  let panel = null;
  let originalText = "";
  let originalStyle = "";
  let lastRightClicked = null;
  let dropdown = null;

  document.addEventListener("contextmenu", (e) => {
    lastRightClicked = e.target;
  }, true);

  window.__eeActivate = () => {
    if (lastRightClicked && !lastRightClicked.id?.startsWith("__ee")) {
      showBubbleOnly(lastRightClicked);
    }
  };

  // ── CSS property values map ──
  const cssValues = {
    "color": ["inherit","transparent","currentColor","red","blue","green","black","white","#","rgb(","rgba(","hsl(","hsla("],
    "background-color": ["inherit","transparent","currentColor","red","blue","green","black","white","#","rgb(","rgba(","hsl(","hsla("],
    "background": ["none","inherit","transparent","#","rgb(","rgba(","linear-gradient(","radial-gradient(","url("],
    "font-size": ["inherit","10px","12px","14px","16px","18px","20px","24px","32px","48px","1rem","1.5rem","2rem","small","medium","large"],
    "font-weight": ["100","200","300","400","500","600","700","800","900","normal","bold","lighter","bolder","inherit"],
    "font-family": ["inherit","Arial, sans-serif","Helvetica, sans-serif","Georgia, serif","'Times New Roman', serif","'Courier New', monospace","system-ui","monospace","sans-serif","serif"],
    "line-height": ["normal","inherit","1","1.2","1.4","1.5","1.6","1.8","2","16px","20px","24px"],
    "letter-spacing": ["normal","inherit","0.5px","1px","2px","-0.5px","0.05em","0.1em"],
    "text-align": ["left","center","right","justify","start","end","inherit"],
    "text-decoration": ["none","underline","overline","line-through","inherit"],
    "text-transform": ["none","uppercase","lowercase","capitalize","inherit"],
    "display": ["block","inline","inline-block","flex","inline-flex","grid","inline-grid","none","contents","table","inherit"],
    "position": ["static","relative","absolute","fixed","sticky","inherit"],
    "top": ["auto","0","10px","20px","50px","50%","inherit"],
    "right": ["auto","0","10px","20px","50px","inherit"],
    "bottom": ["auto","0","10px","20px","50px","inherit"],
    "left": ["auto","0","10px","20px","50px","inherit"],
    "width": ["auto","100%","50%","fit-content","max-content","min-content","inherit","100px","200px","300px"],
    "height": ["auto","100%","50%","fit-content","max-content","min-content","inherit","100px","200px"],
    "min-width": ["0","auto","100%","fit-content","max-content","min-content","inherit"],
    "min-height": ["0","auto","100%","fit-content","max-content","min-content","inherit"],
    "max-width": ["none","100%","fit-content","max-content","min-content","inherit"],
    "max-height": ["none","100%","fit-content","max-content","min-content","inherit"],
    "margin-top": ["0","auto","4px","8px","12px","16px","24px","32px","inherit"],
    "margin-right": ["0","auto","4px","8px","12px","16px","24px","32px","inherit"],
    "margin-bottom": ["0","auto","4px","8px","12px","16px","24px","32px","inherit"],
    "margin-left": ["0","auto","4px","8px","12px","16px","24px","32px","inherit"],
    "padding-top": ["0","4px","8px","12px","16px","24px","32px","inherit"],
    "padding-right": ["0","4px","8px","12px","16px","24px","32px","inherit"],
    "padding-bottom": ["0","4px","8px","12px","16px","24px","32px","inherit"],
    "padding-left": ["0","4px","8px","12px","16px","24px","32px","inherit"],
    "border": ["none","1px solid #000","1px solid #ccc","2px solid #000","1px dashed #000","1px dotted #000","inherit"],
    "border-radius": ["0","2px","4px","6px","8px","12px","16px","50%","9999px","inherit"],
    "box-shadow": ["none","0 1px 3px rgba(0,0,0,0.1)","0 2px 8px rgba(0,0,0,0.15)","0 4px 16px rgba(0,0,0,0.2)","inset 0 1px 3px rgba(0,0,0,0.1)","inherit"],
    "box-sizing": ["content-box","border-box","inherit"],
    "opacity": ["0","0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.8","0.9","1","inherit"],
    "overflow": ["visible","hidden","scroll","auto","clip","inherit"],
    "z-index": ["auto","0","1","10","100","1000","9999","-1","inherit"],
    "cursor": ["auto","default","pointer","move","text","wait","help","not-allowed","grab","crosshair","inherit"],
    "visibility": ["visible","hidden","collapse","inherit"],
    "flex-direction": ["row","row-reverse","column","column-reverse","inherit"],
    "justify-content": ["flex-start","flex-end","center","space-between","space-around","space-evenly","inherit"],
    "align-items": ["stretch","flex-start","flex-end","center","baseline","inherit"],
    "flex-wrap": ["nowrap","wrap","wrap-reverse","inherit"],
    "gap": ["0","4px","8px","12px","16px","24px","32px","1rem","inherit"],
    "grid-template-columns": ["none","1fr","repeat(2, 1fr)","repeat(3, 1fr)","repeat(auto-fit, minmax(200px, 1fr))","inherit"],
    "grid-template-rows": ["none","auto","1fr","repeat(2, 1fr)","inherit"],
    "transform": ["none","translateX(0)","translateY(0)","scale(1)","rotate(0deg)","skew(0deg)","inherit"],
    "transition": ["none","all 0.2s","all 0.3s ease","all 0.5s ease-in-out","opacity 0.3s","transform 0.3s","inherit"]
  };

  // All known CSS properties for new property autocomplete
  const allCssProps = Object.keys(cssValues);

  // ── Validate CSS value ──
  function isValidCssValue(prop, val) {
    if (!prop || !val) return true;
    const testEl = document.createElement("div");
    testEl.style.setProperty(prop, val);
    return testEl.style.getPropertyValue(prop) !== "";
  }

  // ── Styles ──
  const style = document.createElement("style");
  style.textContent = `
    .__ee-editable {
      outline: 2px solid #6366f1 !important;
      outline-offset: 2px !important;
      min-height: 1em;
    }
    .__ee-bubble {
      position: absolute; width: 28px; height: 28px;
      background: #1a1a1a; border: 1px solid #333; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 2147483646;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      font-family: 'SF Mono', Menlo, Consolas, monospace;
      font-size: 12px; font-weight: 700; color: #fff;
      transition: transform 0.1s, background 0.15s; user-select: none;
    }
    .__ee-bubble:hover { background: #6366f1; transform: scale(1.1); }
    #__ee-panel {
      position: fixed; top: 16px; right: 16px; width: 320px; max-height: 80vh;
      overflow-y: auto; background: #fff; color: #1a1a1a;
      border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
      font-size: 11px; z-index: 2147483647; border: 1px solid #e0e0e0;
    }
    #__ee-panel * { box-sizing: border-box; margin: 0; }
    #__ee-panel .hdr {
      display: flex; justify-content: space-between; align-items: center;
      padding: 6px 10px; background: #f8f8f8; border-bottom: 1px solid #e8e8e8;
      border-radius: 8px 8px 0 0; cursor: grab;
    }
    #__ee-panel .hdr-title { font-weight: 700; font-size: 11px; color: #6366f1; }
    #__ee-panel .hdr-btn {
      background: none; border: none; cursor: pointer; padding: 0 2px;
      font-size: 14px; color: #999; line-height: 1;
    }
    #__ee-panel .hdr-btn:hover { color: #333; }
    #__ee-panel .selector {
      padding: 4px 10px; background: #fafafa; border-bottom: 1px solid #eee;
      font-family: monospace; font-size: 10px; color: #6366f1;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer;
    }
    #__ee-panel .selector:hover { background: #f0f0ff; }
    #__ee-panel .section-hdr {
      display: flex; justify-content: space-between; align-items: center;
      padding: 4px 10px; background: #f8f8f8; border-bottom: 1px solid #eee;
    }
    #__ee-panel .label {
      font-size: 9px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.6px; color: #888;
    }
    #__ee-panel .pill {
      font-size: 9px; background: #f0f0f0; color: #666;
      padding: 1px 5px; border-radius: 3px; cursor: pointer;
    }
    #__ee-panel .pill:hover { background: #e0e0e0; }
    #__ee-panel .props {
      max-height: 55vh; overflow-y: auto; border-bottom: 1px solid #eee;
    }
    #__ee-panel .prop-row {
      display: flex; align-items: center; gap: 0; padding: 2px 6px 2px 10px;
      border-bottom: 1px solid #f3f3f3; font-family: 'SF Mono', Menlo, Consolas, monospace;
      font-size: 11px; line-height: 1.6; position: relative;
    }
    #__ee-panel .prop-row:hover { background: #f8f8ff; }
    #__ee-panel .prop-cb {
      width: 13px; height: 13px; margin-right: 6px; cursor: pointer;
      accent-color: #6366f1; flex-shrink: 0;
    }
    #__ee-panel .prop-key { color: #9333ea; margin-right: 4px; white-space: nowrap; }
    #__ee-panel .prop-sep { color: #999; margin-right: 4px; }
    #__ee-panel .prop-val {
      color: #1a1a1a; flex: 1; border: none; background: none;
      font-family: inherit; font-size: 11px; padding: 1px 0;
      outline: none; min-width: 0;
    }
    #__ee-panel .prop-val:focus { background: #eff0ff; border-radius: 2px; }
    #__ee-panel .prop-row.disabled .prop-key,
    #__ee-panel .prop-row.disabled .prop-val {
      opacity: 0.35; text-decoration: line-through;
    }
    #__ee-panel .prop-warn {
      width: 18px; height: 18px; flex-shrink: 0; margin-left: 4px;
      display: none; align-items: center; justify-content: center;
      font-size: 16px; cursor: default; color: #ef4444;
    }
    #__ee-panel .prop-row.invalid .prop-warn { display: flex; }
    #__ee-panel .prop-row.invalid .prop-key { text-decoration: line-through; opacity: 0.5; }
    #__ee-panel .prop-row.invalid .prop-val { color: #dc2626; text-decoration: line-through; opacity: 0.5; }
    #__ee-panel .add-prop {
      padding: 4px 10px; font-size: 10px; color: #6366f1; cursor: pointer;
      border-bottom: 1px solid #eee; font-family: monospace;
    }
    #__ee-panel .add-prop:hover { background: #f8f8ff; }
    #__ee-panel .settings-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 5px 10px; border-top: 1px solid #eee; background: #fafafa;
    }
    #__ee-panel .settings-label { font-size: 10px; color: #666; }
    #__ee-panel .toggle { position: relative; width: 28px; height: 16px; cursor: pointer; }
    #__ee-panel .toggle input { display: none; }
    #__ee-panel .toggle .slider {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: #ccc; border-radius: 16px; transition: 0.2s;
    }
    #__ee-panel .toggle .slider:before {
      content: ""; position: absolute; width: 12px; height: 12px;
      left: 2px; bottom: 2px; background: #fff; border-radius: 50%; transition: 0.2s;
    }
    #__ee-panel .toggle input:checked + .slider { background: #6366f1; }
    #__ee-panel .toggle input:checked + .slider:before { transform: translateX(12px); }
    #__ee-panel .actions { display: flex; gap: 4px; padding: 6px 10px 8px; justify-content: flex-end; }
    #__ee-panel .btn {
      flex: 0; padding: 4px 14px; border: none; border-radius: 4px;
      font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit;
    }
    #__ee-panel .btn-primary { background: #6366f1; color: #fff; }
    #__ee-panel .btn-primary:hover { background: #5558e6; }
    #__ee-panel .btn-secondary { background: #f0f0f0; color: #333; }
    #__ee-panel .btn-secondary:hover { background: #e4e4e4; }
    #__ee-panel .toast {
      position: absolute; bottom: 44px; left: 50%; transform: translateX(-50%);
      background: #1a1a1a; color: #fff; padding: 4px 10px; border-radius: 4px;
      font-size: 10px; display: none; white-space: nowrap;
    }
    .__ee-dropdown {
      position: fixed; background: #fff; border: 1px solid #ddd;
      border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-height: 160px; overflow-y: auto; z-index: 2147483647;
      font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 11px;
    }
    .__ee-dropdown-item {
      padding: 3px 10px; cursor: pointer; color: #1a1a1a;
    }
    .__ee-dropdown-item:hover, .__ee-dropdown-item.active {
      background: #6366f1; color: #fff;
    }
  `;
  document.head.appendChild(style);

  // ── Dropdown autocomplete ──
  let dropdownActiveIndex = -1;
  let dropdownInput = null;
  let dropdownPoll = null;

  function showDropdown(input, values) {
    closeDropdown();
    if (!values.length) return;

    dropdownInput = input;
    dropdown = document.createElement("div");
    dropdown.className = "__ee-dropdown";
    document.body.appendChild(dropdown);

    const rect = input.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 2) + "px";
    dropdown.style.left = rect.left + "px";
    dropdown.style.minWidth = Math.max(rect.width, 140) + "px";

    dropdownActiveIndex = -1;

    values.forEach((v) => {
      const item = document.createElement("div");
      item.className = "__ee-dropdown-item";
      item.textContent = v;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        input.value = v;
        if (input.dataset.prop !== undefined) {
          input.dispatchEvent(new Event("input", { bubbles: true }));
        } else if (input.classList.contains("prop-key-edit")) {
          const row = input.closest(".prop-row");
          if (row) row.querySelector(".prop-val").dataset.prop = v;
        }
        closeDropdown();
        input.focus();
      });
      dropdown.appendChild(item);
    });

    // Poll: close dropdown if input loses focus (not to dropdown)
    dropdownPoll = setInterval(() => {
      const active = document.activeElement;
      if (active !== dropdownInput) {
        closeDropdown();
      }
    }, 300);
  }

  function closeDropdown() {
    if (dropdownPoll) { clearInterval(dropdownPoll); dropdownPoll = null; }
    if (dropdown) { dropdown.remove(); dropdown = null; }
    dropdownInput = null;
    dropdownActiveIndex = -1;
  }

  function navigateDropdown(dir) {
    if (!dropdown) return;
    const items = dropdown.querySelectorAll(".__ee-dropdown-item");
    if (!items.length) return;
    items.forEach(i => i.classList.remove("active"));
    dropdownActiveIndex += dir;
    if (dropdownActiveIndex < 0) dropdownActiveIndex = items.length - 1;
    if (dropdownActiveIndex >= items.length) dropdownActiveIndex = 0;
    items[dropdownActiveIndex].classList.add("active");
    items[dropdownActiveIndex].scrollIntoView({ block: "nearest" });
  }

  function selectDropdownItem(input) {
    if (!dropdown) return false;
    const items = dropdown.querySelectorAll(".__ee-dropdown-item");
    if (dropdownActiveIndex >= 0 && dropdownActiveIndex < items.length) {
      input.value = items[dropdownActiveIndex].textContent;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      closeDropdown();
      return true;
    }
    return false;
  }

  // ── Triggers ──
  document.addEventListener("dblclick", (e) => {
    const target = e.target;
    if (!target || target.id?.startsWith("__ee") || target.closest("#__ee-panel") || target.closest(".__ee-bubble") || target.closest(".__ee-dropdown")) return;
    requestAnimationFrame(() => {
      const sel = window.getSelection();
      let anchorRect = null;
      if (sel && !sel.isCollapsed) anchorRect = sel.getRangeAt(0).getBoundingClientRect();
      showBubbleOnly(target, anchorRect);
    });
  });

  document.addEventListener("mouseup", (e) => {
    if (e.target.id?.startsWith("__ee") || e.target.closest("#__ee-panel") || e.target.closest(".__ee-bubble") || e.target.closest(".__ee-dropdown")) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) return;
    const range = sel.getRangeAt(0);
    let target = range.commonAncestorContainer;
    if (target.nodeType === Node.TEXT_NODE) target = target.parentElement;
    if (!target || target.id?.startsWith("__ee")) return;
    setTimeout(() => {
      const currentSel = window.getSelection();
      if (currentSel && !currentSel.isCollapsed && currentSel.toString().trim()) {
        showBubbleOnly(target, currentSel.getRangeAt(0).getBoundingClientRect());
      }
    }, 200);
  });

  function showBubbleOnly(target, anchorRect) {
    if (bubble) bubble.remove();
    bubble = document.createElement("div");
    bubble.className = "__ee-bubble";
    bubble.textContent = "{ }";
    bubble.title = "Edit styles";
    document.body.appendChild(bubble);
    const rect = anchorRect || target.getBoundingClientRect();
    bubble.style.top = (window.scrollY + rect.top - 32) + "px";
    bubble.style.left = (window.scrollX + rect.right + 4) + "px";
    bubble.addEventListener("click", (e) => {
      e.stopPropagation();
      cleanup();
      activeEl = target;
      originalText = target.innerText;
      originalStyle = target.style.cssText;
      target.setAttribute("contenteditable", "true");
      target.classList.add("__ee-editable");
      openStylePanel();
    });
  }

  document.addEventListener("mousedown", (e) => {
    if (e.target.closest(".__ee-bubble")) return;
    if (e.target.closest("#__ee-panel")) return;
    if (e.target.closest(".__ee-dropdown")) return;
    closeDropdown();
    if (bubble && !panel) { bubble.remove(); bubble = null; return; }
    if (!activeEl) return;
    if (e.target === activeEl || activeEl.contains(e.target)) return;
    setTimeout(() => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) return;
      cleanup();
    }, 250);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeDropdown(); cleanup(); }
  });

  function cleanup() {
    closeDropdown();
    if (activeEl) {
      activeEl.removeAttribute("contenteditable");
      activeEl.classList.remove("__ee-editable");
    }
    if (bubble) { bubble.remove(); bubble = null; }
    if (panel) { panel.remove(); panel = null; }
    activeEl = null;
  }

  // ── Style Panel ──
  function openStylePanel() {
    if (panel) { panel.remove(); panel = null; }
    if (!activeEl) return;

    const el = activeEl;
    const selector = getFullSelector(el);
    const styles = getRelevantStyles(el);

    panel = document.createElement("div");
    panel.id = "__ee-panel";

    const propsHtml = Object.entries(styles).map(([k, v]) => buildPropRowHtml(k, v)).join("");

    panel.innerHTML = `
      <div class="hdr" id="__ee-hdr">
        <span class="hdr-title">ClickStyle</span>
        <button class="hdr-btn" id="__ee-close" title="Close">&times;</button>
      </div>
      <div class="selector" id="__ee-selector" title="Click to copy">${selector}</div>
      <div class="section-hdr">
        <span class="label">CSS</span>
        <span class="pill" id="__ee-copy-css">Copy CSS</span>
      </div>
      <div class="props" id="__ee-props">${propsHtml}</div>
      <div class="add-prop" id="__ee-add">+ add property</div>
      <div class="settings-row">
        <span class="settings-label">Auto-apply</span>
        <label class="toggle">
          <input type="checkbox" id="__ee-auto" checked>
          <span class="slider"></span>
        </label>
      </div>
      <div class="actions">
        <button class="btn btn-primary" id="__ee-apply">Apply</button>
        <button class="btn btn-secondary" id="__ee-undo">Undo</button>
      </div>
      <div class="toast" id="__ee-toast"></div>
    `;

    document.body.appendChild(panel);
    makeDraggable(panel, panel.querySelector("#__ee-hdr"));

    const propsContainer = panel.querySelector("#__ee-props");
    const autoToggle = panel.querySelector("#__ee-auto");

    function toast(msg) {
      const t = panel.querySelector("#__ee-toast");
      t.textContent = msg; t.style.display = "block";
      setTimeout(() => t.style.display = "none", 1500);
    }

    function getActiveStyles() {
      const s = {};
      propsContainer.querySelectorAll(".prop-row").forEach(row => {
        const cb = row.querySelector(".prop-cb");
        const valInput = row.querySelector(".prop-val");
        const key = valInput.dataset.prop;
        const val = valInput.value;
        if (cb.checked && key && val && !row.classList.contains("invalid")) s[key] = val;
      });
      return s;
    }

    function applyStyles() {
      const s = getActiveStyles();
      el.style.cssText = originalStyle;
      Object.entries(s).forEach(([k, v]) => el.style.setProperty(k, v));
    }

    function maybeAutoApply() {
      if (autoToggle.checked) applyStyles();
    }

    function validateRow(row) {
      const valInput = row.querySelector(".prop-val");
      const prop = valInput.dataset.prop;
      const val = valInput.value.trim();
      if (!prop || !val) { row.classList.remove("invalid"); return; }
      const valid = isValidCssValue(prop, val);
      row.classList.toggle("invalid", !valid);
    }

    // Checkbox toggle
    propsContainer.addEventListener("change", (e) => {
      if (e.target.classList.contains("prop-cb")) {
        e.target.closest(".prop-row").classList.toggle("disabled", !e.target.checked);
        maybeAutoApply();
      }
    });

    // Value edit with autocomplete + validation
    propsContainer.addEventListener("input", (e) => {
      if (e.target.classList.contains("prop-val")) {
        const row = e.target.closest(".prop-row");
        const prop = e.target.dataset.prop;
        const val = e.target.value.trim().toLowerCase();
        validateRow(row);

        if (prop && cssValues[prop]) {
          const filtered = val.length > 0
            ? cssValues[prop].filter(v => v.toLowerCase().includes(val))
            : cssValues[prop];
          if (filtered.length) showDropdown(e.target, filtered);
          else closeDropdown();
        }
        maybeAutoApply();
      }
    });

    // Show all options on focus — always reopens
    propsContainer.addEventListener("focusin", (e) => {
      if (e.target.classList.contains("prop-val")) {
        const prop = e.target.dataset.prop;
        const val = e.target.value.trim().toLowerCase();
        if (prop && cssValues[prop]) {
          const filtered = val.length > 0
            ? cssValues[prop].filter(v => v.toLowerCase().includes(val))
            : cssValues[prop];
          if (filtered.length) showDropdown(e.target, filtered);
        }
      }
    });

    // Keyboard nav for dropdown
    propsContainer.addEventListener("keydown", (e) => {
      if (!dropdown) return;
      if (e.key === "ArrowDown") { e.preventDefault(); navigateDropdown(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); navigateDropdown(-1); }
      else if (e.key === "Enter" || e.key === "Tab") {
        if (selectDropdownItem(e.target)) {
          e.preventDefault();
          validateRow(e.target.closest(".prop-row"));
          maybeAutoApply();
        }
      }
    });

    // Dropdown closing handled by polling in showDropdown

    // Add property
    panel.querySelector("#__ee-add").addEventListener("click", () => {
      const row = document.createElement("div");
      row.className = "prop-row";
      row.innerHTML = `
        <input type="checkbox" class="prop-cb" checked>
        <input type="text" class="prop-key-edit" placeholder="property"
          style="color:#9333ea;border:none;background:none;font-family:inherit;font-size:11px;width:90px;outline:none;padding:1px 0;">
        <span class="prop-sep">:</span>
        <input type="text" class="prop-val" value="" data-prop="" placeholder="value">
        <span class="prop-warn" title="Invalid CSS value">&#9888;</span>
      `;
      propsContainer.appendChild(row);
      const keyInput = row.querySelector(".prop-key-edit");
      const valInput = row.querySelector(".prop-val");
      keyInput.focus();

      // Autocomplete for property names
      keyInput.addEventListener("input", () => {
        valInput.dataset.prop = keyInput.value;
        const query = keyInput.value.trim().toLowerCase();
        if (query.length > 0) {
          const filtered = allCssProps.filter(p => p.includes(query));
          showDropdown(keyInput, filtered);
        } else {
          closeDropdown();
        }
      });

      keyInput.addEventListener("keydown", (e) => {
        if (!dropdown) return;
        if (e.key === "ArrowDown") { e.preventDefault(); navigateDropdown(1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); navigateDropdown(-1); }
        else if (e.key === "Enter" || e.key === "Tab") {
          if (selectDropdownItem(keyInput)) {
            e.preventDefault();
            valInput.dataset.prop = keyInput.value;
            valInput.focus();
          }
        }
      });

      valInput.addEventListener("input", () => {
        validateRow(row);
        const prop = valInput.dataset.prop;
        const val = valInput.value.trim().toLowerCase();
        if (prop && cssValues[prop]) {
          const filtered = cssValues[prop].filter(v => v.toLowerCase().includes(val));
          if (filtered.length && val.length > 0) showDropdown(valInput, filtered);
          else closeDropdown();
        }
        maybeAutoApply();
      });

      valInput.addEventListener("keydown", (e) => {
        if (!dropdown) return;
        if (e.key === "ArrowDown") { e.preventDefault(); navigateDropdown(1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); navigateDropdown(-1); }
        else if (e.key === "Enter" || e.key === "Tab") {
          if (selectDropdownItem(valInput)) {
            e.preventDefault();
            validateRow(row);
            maybeAutoApply();
          }
        }
      });

      row.querySelector(".prop-cb").addEventListener("change", () => {
        row.classList.toggle("disabled", !row.querySelector(".prop-cb").checked);
        maybeAutoApply();
      });
    });

    panel.querySelector("#__ee-apply").addEventListener("click", () => {
      applyStyles();
      toast("Applied");
    });

    autoToggle.addEventListener("change", () => {
      if (autoToggle.checked) applyStyles();
    });

    panel.querySelector("#__ee-undo").addEventListener("click", () => {
      el.innerText = originalText;
      el.style.cssText = originalStyle;
      el.setAttribute("contenteditable", "true");
      el.classList.add("__ee-editable");
      const newStyles = getRelevantStyles(el);
      propsContainer.innerHTML = Object.entries(newStyles).map(([k, v]) => buildPropRowHtml(k, v)).join("");
      toast("Reverted");
    });

    panel.querySelector("#__ee-close").addEventListener("click", () => {
      closeDropdown();
      panel.remove(); panel = null;
    });

    panel.querySelector("#__ee-selector").addEventListener("click", () => {
      navigator.clipboard.writeText(selector).then(() => toast("Selector copied"));
    });

    panel.querySelector("#__ee-copy-css").addEventListener("click", () => {
      const s = getActiveStyles();
      let css = selector + " {\n";
      Object.entries(s).forEach(([k, v]) => css += "  " + k + ": " + v + ";\n");
      css += "}";
      navigator.clipboard.writeText(css).then(() => toast("CSS copied"));
    });
  }

  function buildPropRowHtml(k, v) {
    const valid = isValidCssValue(k, v);
    return `<div class="prop-row${valid ? "" : " invalid"}" data-prop="${k}">
      <input type="checkbox" class="prop-cb" checked>
      <span class="prop-key">${k}</span>
      <span class="prop-sep">:</span>
      <input type="text" class="prop-val" value="${escapeAttr(v)}" data-prop="${k}">
      <span class="prop-warn" title="Invalid CSS value">&#9888;</span>
    </div>`;
  }

  // ── Utilities ──
  function getFullSelector(el) {
    const parts = [];
    let node = el;
    while (node && node !== document.body && parts.length < 4) {
      let s = node.tagName.toLowerCase();
      if (node.id) { parts.unshift(s + "#" + node.id); break; }
      if (node.className && typeof node.className === "string") {
        const cls = node.className.trim().split(/\s+/).filter(c => !c.startsWith("__ee")).slice(0, 2);
        if (cls.length) s += "." + cls.join(".");
      }
      parts.unshift(s);
      node = node.parentElement;
    }
    return parts.join(" > ");
  }

  function getRelevantStyles(el) {
    const cs = window.getComputedStyle(el);
    const styles = {};
    const props = [
      "color","background-color","background","font-size","font-weight","font-family",
      "line-height","letter-spacing","text-align","text-decoration","text-transform",
      "display","position","top","right","bottom","left",
      "width","height","min-width","min-height","max-width","max-height",
      "margin-top","margin-right","margin-bottom","margin-left",
      "padding-top","padding-right","padding-bottom","padding-left",
      "border","border-radius","box-shadow","box-sizing",
      "opacity","overflow","z-index","cursor","visibility",
      "flex-direction","justify-content","align-items","flex-wrap","gap",
      "grid-template-columns","grid-template-rows","transform","transition"
    ];
    const skip = new Set(["none","normal","auto","0px","static","visible","stretch",
      "start","baseline","row","nowrap","0","0s","1","100%","separate",
      "content-box","rgba(0, 0, 0, 0)","rgb(0, 0, 0)"]);
    props.forEach(p => {
      const v = cs.getPropertyValue(p);
      if (v && !skip.has(v) && v !== "") {
        if (p === "display" && v === "block") return;
        if (p === "position" && v === "static") return;
        styles[p] = v;
      }
    });
    return styles;
  }

  function escapeAttr(s) {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function makeDraggable(el, handle) {
    let d = false, sx, sy, ox, oy;
    handle.addEventListener("mousedown", (e) => {
      if (e.target.closest("button")) return;
      d = true; sx = e.clientX; sy = e.clientY;
      const r = el.getBoundingClientRect(); ox = r.left; oy = r.top;
      handle.style.cursor = "grabbing"; e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (!d) return;
      el.style.left = (ox + e.clientX - sx) + "px";
      el.style.top = (oy + e.clientY - sy) + "px";
      el.style.right = "auto";
    });
    document.addEventListener("mouseup", () => { d = false; handle.style.cursor = "grab"; });
  }
})();