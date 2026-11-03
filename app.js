const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => "R" + Math.round(n).toLocaleString("en-ZA");
const imgSrc = n => (window.IMAGES && window.IMAGES[n]) || `images/${n}.svg`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v===null ? d : JSON.parse(v); }catch{ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
};
const currentUser = () => store.get("session", null);
/* Demo-only hash (NOT secure). Real sign-up needs a server that hashes passwords properly. */
const hashPw = s => { let h = 5381; for(const c of s) h = ((h<<5)+h+c.charCodeAt(0))|0; return "d" + h; };

/* ---------- Cart ---------- */
const getCart = () => store.get("cart", []);
const cartCount = () => getCart().reduce((n,i)=>n+i.qty,0);
function cartLines(){ return getCart().map(i => ({p:PRODUCTS.find(x=>x.id===i.id), qty:i.qty})).filter(l=>l.p); }
function addToCart(id){ const c=getCart(), it=c.find(i=>i.id===id); it ? it.qty++ : c.push({id,qty:1}); store.set("cart",c); onCartChange(); }
function setQty(id,q){ let c=getCart(); if(q<=0) c=c.filter(i=>i.id!==id); else c.find(i=>i.id===id).qty=q; store.set("cart",c); onCartChange(); }
function removeItem(id){ store.set("cart", getCart().filter(i=>i.id!==id)); onCartChange(); }
function clearCart(){ store.set("cart", []); onCartChange(); }
function totals(){
  const lines = cartLines();
  const sub = lines.reduce((n,l)=>n+l.p.price*l.qty,0);
  const physical = lines.some(l=>!l.p.digital);
  const ship = !physical || sub===0 || sub>=COMPANY.freeShipOver ? 0 : COMPANY.shipFlat;
  const total = sub + ship;
  return {sub, ship, total, vat: total*COMPANY.vat/(1+COMPANY.vat), physical, lines};
}
function onCartChange(){ renderLayout(); if(PAGE_RENDER.cart) PAGE_RENDER.cart(); }
const PAGE_RENDER = {};

/* ---------- Layout ---------- */
const NAV = [["index.html","Home"],["login.html","Login"],["downloads.html","Downloads"],["shop.html","Shop"],["contact.html","Contact"]];
function renderLayout(){
  const cur = document.body.dataset.page;
  const user = currentUser(), n = cartCount();
  $("#site-header").innerHTML = `<div class="nav"><a class="logo" href="index.html">B.I.P <span>Diversity</span></a><button class="menu-btn" id="menu-btn" aria-label="Menu" aria-expanded="false">☰</button><ul id="menu">` +
    NAV.map(([h,l]) => {
      if(h==="login.html" && user) l = "Account";
      const on = h===cur || (h==="login.html" && cur==="signup.html") || (h==="shop.html" && cur==="checkout.html");
      const badge = h==="shop.html" && n ? `<span class="badge">${n}</span>` : "";
      return `<li><a class="link ${on?"active":""}" href="${h}">${l}${badge}</a></li>`;
    }).join("") + `</ul></div>`;
  const mb = $("#menu-btn");
  mb.onclick = () => { const o = $("#menu").classList.toggle("open"); mb.setAttribute("aria-expanded", o); mb.textContent = o ? "✕" : "☰"; };
  $("#site-footer").innerHTML = `© 2026 ${COMPANY.name}. Genesis Smart Home Systems.`;
  const tabs = $("#topic-tabs");
  if(tabs) tabs.innerHTML = TOPICS.map(t=>`<a class="tab ${t.file===cur?"active":""}" href="${t.file}">${t.label}</a>`).join("");
}
function note(el, text, ok=true){ el.className = "msg " + (ok?"ok":"err"); el.textContent = text; }

/* ---------- Newsletter ---------- */
function bindNewsletter(){
  const f = $("#news-form"); if(!f) return;
  f.addEventListener("submit", e => {
    e.preventDefault();
    const subs = store.get("subscribers", []), email = $("#news-email").value.trim().toLowerCase();
    if(!subs.includes(email)) subs.push(email);
    store.set("subscribers", subs); f.reset();
    note($("#news-result"), "You're subscribed. Thanks!");
  });
}

/* ---------- Pages ---------- */
function initHome(){
  $("#stat-devices").textContent = COMPANY.devices;
  $("#news-list").innerHTML = ARTICLES.map(a=>`<li><small>${esc(a.tag)} · ${esc(a.when||new Date(a.date).toLocaleDateString("en-ZA",{day:"numeric",month:"short",year:"numeric"}))}</small><a href="${a.url}" target="_blank" rel="noopener">${esc(a.title)}</a><small>${esc(a.src)}</small></li>`).join("");
  bindNewsletter();
}

function initTopic(){
  const t = TOPIC_PAGES[document.body.dataset.page]; if(!t) return;
  $("#topic-body").innerHTML = `<h1>${t.title}</h1><p class="lead">${t.lead}</p>` + t.body.map(p=>`<p>${p}</p>`).join("") +
    `<h3 style="margin-top:20px">Key features</h3><ul class="checks">${t.points.map(p=>`<li>${p}</li>`).join("")}</ul>` +
    `<p style="margin-top:24px"><a class="btn" href="${t.cta.href}">${t.cta.label}</a> <a class="btn ghost" href="contact.html">Talk to us</a></p>`;
}

function initLogin(){
  const box = $("#login-box");
  (function draw(){
    const user = currentUser();
    if(user){
      box.innerHTML = `<h2>Welcome, ${esc(user.name)}</h2><p>You are signed in as ${esc(user.email)}.</p><br><a class="btn" href="downloads.html">Go to Downloads</a> <button id="out" class="btn ghost">Log out</button>`;
      $("#out").onclick = () => { store.set("session", null); renderLayout(); draw(); };
      return;
    }
    box.innerHTML = `<h2>Login</h2><input id="u" placeholder="Email (or admin)" autocomplete="username"><input id="p" type="password" placeholder="Password" autocomplete="current-password"><button id="go">Login</button><div id="m" class="msg"></div><p class="alt">New here? <a href="signup.html">Create an account</a></p><p class="alt small">Demo admin login: admin / genesis123</p>`;
    const submit = () => {
      const u = $("#u").value.trim().toLowerCase(), p = $("#p").value;
      if(u==="admin" && p==="genesis123"){ store.set("session",{name:"Admin",email:"admin"}); renderLayout(); return draw(); }
      const acct = store.get("users", []).find(x=>x.email===u && x.pw===hashPw(p));
      if(acct){ store.set("session",{name:acct.name,email:acct.email}); renderLayout(); draw(); }
      else note($("#m"), "Incorrect email or password.", false);
    };
    $("#go").onclick = submit;
    $("#p").addEventListener("keydown", e => { if(e.key==="Enter") submit(); });
  })();
}

function initSignup(){
  $("#signup-form").addEventListener("submit", e => {
    e.preventDefault();
    const m = $("#s-msg"), name=$("#s-name").value.trim(), email=$("#s-email").value.trim().toLowerCase(),
          phone=$("#s-phone").value.trim(), pw=$("#s-pass").value, pw2=$("#s-pass2").value;
    const users = store.get("users", []);
    if(pw.length < 8) return note(m, "Password must be at least 8 characters.", false);
    if(pw !== pw2) return note(m, "Passwords do not match.", false);
    if(!$("#s-terms").checked) return note(m, "Please accept the terms to continue.", false);
    if(users.some(u=>u.email===email) || email==="admin") return note(m, "An account with that email already exists. Try logging in.", false);
    users.push({name, email, phone, pw:hashPw(pw), created:new Date().toISOString(), newsletter:$("#s-news").checked});
    store.set("users", users);
    store.set("session", {name, email});
    if($("#s-news").checked){ const s=store.get("subscribers",[]); if(!s.includes(email)){ s.push(email); store.set("subscribers",s);} }
    renderLayout(); note(m, "Account created! Redirecting to downloads…");
    setTimeout(()=>location.href="downloads.html", 1200);
  });
}

function initDownloads(){
  const user = currentUser(), box = $("#dl-body");
  $("#dl-tabs").innerHTML = OS_LIST.map((o,i)=>`<button class="tab ${i===0?"active":""}" data-os="${o.id}">${o.label}</button>`).join("");
  function show(id){
    const o = OS_LIST.find(x=>x.id===id);
    $$("#dl-tabs .tab").forEach(b=>b.classList.toggle("active", b.dataset.os===id));
    box.innerHTML = `<p class="req"><b>${o.label}</b> · ${o.req}</p><div class="table-wrap"><table><thead><tr><th>Version</th><th>Released</th><th>Type</th><th>Size</th><th>Notes</th><th></th></tr></thead><tbody>` +
      o.versions.map((v,i)=>`<tr><td data-label="Version"><b>${v.v}</b></td><td data-label="Released">${v.date}</td><td data-label="Type">.${v.ext}</td><td data-label="Size">${v.size}</td><td data-label="Notes">${v.note}</td><td><button data-i="${i}" ${user?"":"disabled"}>Download</button></td></tr>`).join("") + `</tbody></table></div>`;
    $$("button[data-i]", box).forEach(b => b.onclick = () => {
      const v = o.versions[b.dataset.i], name = `genesis-${o.id}-${v.v}.${v.ext}.txt`;
      const text = `Genesis ${o.label} ${v.v}\nThis is a placeholder file. Replace it with the real .${v.ext} installer.\n`;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text],{type:"text/plain"})); a.download = name; a.click(); URL.revokeObjectURL(a.href);
    });
  }
  if(!user) $("#dl-lock").innerHTML = `<div class="msg err" style="display:block">Please <a href="login.html">log in</a> or <a href="signup.html">create an account</a> to download.</div>`;
  $("#dl-tabs").addEventListener("click", e => { const b=e.target.closest("[data-os]"); if(b) show(b.dataset.os); });
  show(OS_LIST[0].id);
}

function lineRow(l, opts={}){
  return `<div class="line"><img src="${imgSrc(l.p.img)}" alt="${esc(l.p.name)}"><div class="grow"><b>${esc(l.p.name)}</b><br><small>${money(l.p.price)}${l.p.digital?" /mo":""} each</small></div>` +
    `<div class="qty"><button class="sm" data-q="${l.p.id}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button class="sm" data-q="${l.p.id}" data-d="1" aria-label="Increase">+</button></div>` +
    `<b class="amt">${money(l.p.price*l.qty)}</b><button class="sm danger" data-rm="${l.p.id}" title="Remove this item" aria-label="Remove ${esc(l.p.name)}">✕</button></div>`;
}
function bindLineButtons(root){
  $$("[data-q]", root).forEach(b => b.onclick = () => { const l=getCart().find(i=>i.id===b.dataset.q); setQty(b.dataset.q, l.qty + Number(b.dataset.d)); });
  $$("[data-rm]", root).forEach(b => b.onclick = () => removeItem(b.dataset.rm));
}

function initShop(){
  const cats = ["All", ...new Set(PRODUCTS.map(p=>p.cat))]; let cat = "All";
  $("#cat-tabs").innerHTML = cats.map(c=>`<button class="tab ${c===cat?"active":""}" data-c="${c}">${c}</button>`).join("");
  function grid(){
    $("#products").innerHTML = PRODUCTS.filter(p=>cat==="All"||p.cat===cat).map(p=>`<div class="card product"><img src="${imgSrc(p.img)}" alt="${esc(p.name)}"><span class="chip">${p.cat}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><div class="price">${money(p.price)}${p.digital?" <small>/mo</small>":""}</div><button data-add="${p.id}">Add to cart</button></div>`).join("");
    $$("[data-add]").forEach(b => b.onclick = () => { addToCart(b.dataset.add); b.textContent="Added ✓"; setTimeout(()=>b.textContent="Add to cart",900); });
  }
  $("#cat-tabs").addEventListener("click", e => { const b=e.target.closest("[data-c]"); if(!b) return; cat=b.dataset.c; $$("#cat-tabs .tab").forEach(t=>t.classList.toggle("active",t===b)); grid(); });
  PAGE_RENDER.cart = () => {
    const t = totals(), box = $("#cart");
    if(!t.lines.length){ box.innerHTML = "<p>Your cart is empty. Add something above.</p>"; return; }
    box.innerHTML = t.lines.map(lineRow).join("") +
      `<div class="line total"><span class="grow">Subtotal</span><b>${money(t.sub)}</b></div>` +
      `<p class="actions"><a class="btn" href="checkout.html">Go to checkout</a> <button class="btn ghost" id="clear">Remove all items</button></p>`;
    bindLineButtons(box);
    $("#clear").onclick = () => { if(confirm("Remove every item from your cart?")) clearCart(); };
  };
  grid(); PAGE_RENDER.cart();
}

function initCheckout(){
  const done = $("#co-done"), main = $("#co-main"), dlg = $("#review");
  let method = "";
  const saved = store.get("delivery", {});
  ["c-name","c-email","c-phone","c-addr","c-city","c-code"].forEach(id => { if(saved[id]) $("#"+id).value = saved[id]; });
  function delivery(){ const d={}; ["c-name","c-email","c-phone","c-addr","c-city","c-code"].forEach(id=>d[id]=$("#"+id).value.trim()); return d; }

  function render(){
    const t = totals();
    if(!t.lines.length && !done.hidden) return;
    $("#co-empty").hidden = t.lines.length>0; main.hidden = t.lines.length===0;
    if(!t.lines.length){ if(dlg.open) dlg.close(); return; }
    const items = t.lines.map(lineRow).join("");
    $("#co-items").innerHTML = items;
    $("#addr-fields").hidden = !t.physical; $$("#addr-fields input").forEach(i=>i.required = t.physical);
    const sum = `<div class="line total"><span class="grow">Subtotal</span><b>${money(t.sub)}</b></div><div class="line"><span class="grow">Delivery</span><b>${t.physical ? (t.ship?money(t.ship):"Free") : "Digital, none"}</b></div><div class="line total"><span class="grow">Total (incl. VAT)</span><b class="price" style="margin:0">${money(t.total)}</b></div><small>Includes ${money(t.vat)} VAT at 15%. Prices in ZAR.</small>`;
    $("#co-sum").innerHTML = sum; $("#rv-items").innerHTML = items; $("#rv-sum").innerHTML = sum;
    bindLineButtons($("#co-items")); bindLineButtons($("#rv-items"));
    $("#rv-ship").innerHTML = t.physical ? (()=>{const d=delivery(); return `<b>Deliver to:</b> ${esc(d["c-name"])}, ${esc(d["c-addr"])}, ${esc(d["c-city"])} ${esc(d["c-code"])}<br>${esc(d["c-email"])} · ${esc(d["c-phone"])}`;})() : "<b>Digital order:</b> licence details will be emailed to " + esc(delivery()["c-email"]);
    $("#rv-pay").innerHTML = `<b>Payment:</b> ${method==="gpay"?"Google Pay":method==="payfast"?"PayFast":"—"}`;
    updateConfirm();
  }
  PAGE_RENDER.cart = render;

  function updateConfirm(){ $("#confirm").disabled = !($$(".ck").every(c=>c.checked)) || !getCart().length; }
  $$(".ck").forEach(c => c.onchange = updateConfirm);
  $$("input[name=pay]").forEach(r => r.onchange = () => { method = r.value; $$(".pay-opt").forEach(l=>l.classList.toggle("sel", l.contains(r) && r.checked)); });
  $("#clear-all").onclick = () => { if(confirm("Remove every item from your cart?")) clearCart(); };

  $("#to-review").onclick = () => {
    const err = $("#co-err"), t = totals(), d = delivery();
    const form = $("#delivery");
    if(!form.reportValidity()) return;
    if(!method) return note(err, "Please choose Google Pay or PayFast.", false);
    err.className="msg"; store.set("delivery", d);
    $$(".ck").forEach(c=>c.checked=false);
    render(); $("#confirm").textContent = "Confirm and pay with " + (method==="gpay"?"Google Pay":"PayFast"); dlg.showModal();
  };
  $("#back").onclick = () => dlg.close();

  $("#confirm").onclick = () => {
    const t = totals(), order = {id:"GEN-"+Date.now().toString(36).toUpperCase(), items:t.lines.map(l=>({id:l.p.id,qty:l.qty})), total:t.total, method, delivery:delivery(), time:new Date().toISOString()};
    if(method==="payfast" && PAYMENTS.payfast.merchantId && PAYMENTS.payfast.merchantKey) return payfastRedirect(order, t);
    /* Demo mode (and Google Pay): no real charge. See PAYMENTS in data.js and the README for going live. */
    $("#confirm").disabled = true; $("#confirm").textContent = "Processing…";
    setTimeout(() => finish(order), 900);
  };
  function finish(order){
    const orders = store.get("orders", []); orders.push(order); store.set("orders", orders);
    clearCart(); dlg.close(); main.hidden = true; $("#co-empty").hidden = true; done.hidden = false;
    $("#co-done-msg").textContent = `Order ${order.id} for ${money(order.total)} was recorded (${order.method==="gpay"?"Google Pay":"PayFast"} demo, no payment taken).`;
  }
  function payfastRedirect(order, t){
    const f = document.createElement("form"); f.method="post";
    f.action = PAYMENTS.payfast.sandbox ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process";
    const base = location.href.replace(/[^/]*$/, "");
    Object.entries({merchant_id:PAYMENTS.payfast.merchantId, merchant_key:PAYMENTS.payfast.merchantKey,
      return_url:base+"checkout.html", cancel_url:base+"checkout.html", name_first:order.delivery["c-name"],
      email_address:order.delivery["c-email"], m_payment_id:order.id, amount:t.total.toFixed(2), item_name:"Genesis order "+order.id}
    ).forEach(([k,v]) => { const i=document.createElement("input"); i.type="hidden"; i.name=k; i.value=v; f.appendChild(i); });
    document.body.appendChild(f); store.set("pending", order); f.submit();
  }
  render();
}

function initContact(){
  $("#c-email").textContent = COMPANY.email; $("#c-tel").textContent = COMPANY.tel;
  $("#contact-form").addEventListener("submit", e => {
    e.preventDefault();
    const leads = store.get("leads", []);
    leads.push({name:$("#name").value, email:$("#email").value, msg:$("#msg").value, time:new Date().toISOString()});
    store.set("leads", leads); e.target.reset();
    note($("#form-result"), "Thanks! Your message was saved. We'll be in touch.");
  });
}

const INIT = {"index.html":initHome, "login.html":initLogin, "signup.html":initSignup, "downloads.html":initDownloads, "shop.html":initShop, "checkout.html":initCheckout, "contact.html":initContact};
document.addEventListener("DOMContentLoaded", () => {
  renderLayout();
  const page = document.body.dataset.page;
  (INIT[page] || (TOPIC_PAGES[page] ? initTopic : ()=>{}))();
});
