/* ===== บัญชีผู้เรียนและการเชื่อมต่อหลังบ้าน (ใช้ร่วมกับแอปฝึกซ่อม) =====
   สมัคร เข้าสู่ระบบ และเปลี่ยนรหัสผ่าน ทำที่เว็บหลักนี้ที่เดียว
   หลังเข้าสู่ระบบ ระบบออก "บัตรผ่าน" (tk) อายุ 30 วัน เก็บที่ localStorage คีย์ "mtc-session" = {profile, tk, enrolled, t}
   ไม่เก็บรหัสผ่านไว้ในเบราว์เซอร์ แอปฝึกซ่อมอยู่โดเมนเดียวกัน จึงอ่านบัตรผ่านนี้ได้ ไม่ต้องล็อกอินซ้ำ */
(function(){
  const S = window.SITE || {};
  const K = "mtc-session";
  /* คีย์ของแอปฝึกซ่อม ลบพร้อมกันตอนออกจากระบบ */
  const APP_KEYS = ["ipt-session","ipt-history","iit-session","iit-history","iic-session","iic-history","iit-clin-part","ipt-local-users"];

  const esc = s => String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const read = ()=>{ try{ const s=JSON.parse(localStorage.getItem(K)); return s&&s.profile&&s.tk?s:null; }catch(e){ return null; } };
  const write = v=>{ try{ localStorage.setItem(K, JSON.stringify(v)); }catch(e){} };
  const norm = (type, u)=> type==="gp" ? u.trim().toLowerCase() : u.trim().replace(/\s+/g,"");

  /* นโยบายรหัสผ่าน (ต้องตรงกับ pwOk_ ใน Code.gs) */
  const PW_RULES = [
    {t:"ยาว 8–16 ตัวอักษร", f:p=>p.length>=8 && p.length<=16},
    {t:"ตัวพิมพ์ใหญ่ A–Z", f:p=>/[A-Z]/.test(p)},
    {t:"ตัวพิมพ์เล็ก a–z", f:p=>/[a-z]/.test(p)},
    {t:"ตัวเลข 0–9", f:p=>/\d/.test(p)},
    {t:"อักขระพิเศษ เช่น ! @ # $ %", f:p=>/[^A-Za-z0-9]/.test(p)}
  ];
  const pwCheck = p => PW_RULES.map(r=>({t:r.t, ok:r.f(p)}));
  const pwValid = p => /^[\x21-\x7E]{8,16}$/.test(p) && PW_RULES.every(r=>r.f(p));
  const pwBadChar = p => p && !/^[\x21-\x7E]*$/.test(p);

  async function call(action, payload){
    if(!S.apiUrl) return {ok:false, err:"offline"};
    const ctl = new AbortController(), tm = setTimeout(()=>ctl.abort(), 25000);
    try{
      const r = await fetch(S.apiUrl, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"},
        body: JSON.stringify(Object.assign({action, token:S.token}, payload)), signal:ctl.signal});
      clearTimeout(tm); return await r.json();
    }catch(e){ clearTimeout(tm); return {ok:false, err:"net"}; }
  }

  const MSG = {exists:"ชื่อผู้ใช้นี้ลงทะเบียนแล้ว ให้เข้าสู่ระบบแทน", nouser:"ไม่พบบัญชีนี้ กรุณาตรวจสอบหรือสมัครสมาชิก",
    badpw:"รหัสผ่านไม่ถูกต้อง", weakpw:"รหัสผ่านไม่ตรงตามเงื่อนไข", samepw:"รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสเดิม",
    suspended:"บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ", auth:"การเข้าสู่ระบบหมดอายุ กรุณาเข้าสู่ระบบใหม่",
    notenrolled:"ยังไม่ได้ลงทะเบียนวิชานี้",
    net:"เชื่อมต่อระบบไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่", token:"ระบบตั้งค่าไม่ถูกต้อง กรุณาแจ้งผู้ดูแลระบบ",
    offline:"ยังไม่ได้ตั้งค่าการเชื่อมต่อระบบ", bad:"คำขอไม่ถูกต้อง", notfound:"ไม่พบเลขที่นี้ในระบบ", format:"รูปแบบเลขที่ไม่ถูกต้อง"};
  function errText(r){
    if(r && r.err==="locked") return `ใส่รหัสผ่านผิดหลายครั้ง บัญชีถูกล็อกชั่วคราว กรุณาลองใหม่ในอีก ${r.mins||15} นาที หรือติดต่อผู้ดูแลระบบ`;
    if(r && r.err==="badpw" && r.left && r.left<=2) return `รหัสผ่านไม่ถูกต้อง (ใส่ผิดได้อีก ${r.left} ครั้งก่อนบัญชีถูกล็อก 15 นาที)`;
    return MSG[r && r.err] || ("เกิดข้อผิดพลาด (" + ((r && r.err) || "unknown") + ")");
  }
  /* ข้อผิดพลาดที่แปลว่าต้องเข้าสู่ระบบใหม่ */
  const isAuthErr = r => !!r && ["auth","suspended","nouser"].includes(r.err);

  const keep = r => { if(r.ok) write({profile:r.profile, tk:r.tk, enrolled:r.enrolled||[], t:Date.now()}); return r; };

  /* เข้าสู่ระบบ: ถ้าได้ err "mustchange" ต้องตั้งรหัสผ่านใหม่ด้วย changeWithOld() */
  async function login(type, uidRaw, pw){ return keep(await call("login", {sid:norm(type, uidRaw), pw})); }
  async function register(profile, pw){
    const sid = norm(profile.type, profile.sid);
    return keep(await call("register", {sid, pw, profile:Object.assign({}, profile, {sid}), consent:S.pdpa||""}));
  }
  /* ตั้งรหัสผ่านใหม่ด้วยรหัสเดิม (หรือ PIN เดิม / รหัสชั่วคราวจากผู้ดูแล) */
  async function changeWithOld(sid, old, pw){ return keep(await call("chpw", {sid, old, pw})); }
  async function changePassword(old, pw){
    const s = read(); if(!s) return {ok:false, err:"auth"};
    return changeWithOld(s.profile.sid, old, pw);
  }
  /* ดึงภาพรวมล่าสุดของคนที่ล็อกอินอยู่ (ได้บัตรผ่านใหม่ทุกครั้ง) */
  async function refresh(){
    const s = read(); if(!s) return {ok:false, err:"auth"};
    const r = await call("portal", {tk:s.tk});
    if(r.ok) keep(r); else if(isAuthErr(r)) logout();
    return r;
  }
  async function enroll(app){
    const s = read(); if(!s) return {ok:false, err:"auth"};
    const r = await call("enroll", {tk:s.tk, app});
    if(r.ok) write(Object.assign(s, {enrolled:r.enrolled})); else if(isAuthErr(r)) logout();
    return r;
  }
  const verify = ref => call("verify", {ref});
  function logout(){ try{ localStorage.removeItem(K); APP_KEYS.forEach(k=>localStorage.removeItem(k)); }catch(e){} }

  /* ไปหน้าที่ต้องการหลังล็อกอิน (เฉพาะหน้าในเว็บนี้) */
  function nextUrl(def){
    const n = new URLSearchParams(location.search).get("next");
    return (n && /^[a-z]+\.html(\?[\w=&-]*)?$/.test(n)) ? n : (def || "my.html");
  }

  /* ช่องรหัสผ่าน: ปุ่มแสดง/ซ่อน และรายการเงื่อนไขที่ติ๊กถูกตามที่พิมพ์ */
  function pwField(id, label, auto, withRules){
    return `<label class="field">${label}<span class="pw-wrap"><input id="${id}" type="password" maxlength="16" autocomplete="${auto}" autocapitalize="off" spellcheck="false" required>
      <button type="button" class="pw-eye" data-eye="${id}" aria-label="แสดงรหัสผ่าน">แสดง</button></span></label>
      ${withRules?`<ul class="pw-rules" id="${id}-rules" aria-live="polite">${PW_RULES.map(r=>`<li>${r.t}</li>`).join("")}</ul>`:""}`;
  }
  function bindPw(root){
    root.querySelectorAll("[data-eye]").forEach(b=>b.onclick=()=>{
      const i=root.querySelector("#"+b.dataset.eye), show=i.type==="password";
      i.type=show?"text":"password"; b.textContent=show?"ซ่อน":"แสดง"; b.setAttribute("aria-label", show?"ซ่อนรหัสผ่าน":"แสดงรหัสผ่าน");
    });
    root.querySelectorAll(".pw-rules").forEach(ul=>{
      const i=root.querySelector("#"+ul.id.replace(/-rules$/,"")); if(!i) return;
      const upd=()=>pwCheck(i.value).forEach((c,k)=>ul.children[k].classList.toggle("ok", c.ok));
      i.addEventListener("input", upd); upd();
    });
  }
  /* ตรวจรหัสผ่านใหม่ + ช่องยืนยัน คืนข้อความผิดพลาด หรือ "" ถ้าผ่าน */
  function pwProblem(pw, pw2){
    if(pwBadChar(pw)) return "รหัสผ่านใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และอักขระพิเศษ (ห้ามมีภาษาไทยหรือเว้นวรรค)";
    if(!pwValid(pw)) return "รหัสผ่านต้องยาว 8–16 ตัว และมีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ อย่างละ 1 ตัวขึ้นไป";
    if(pw!==pw2) return "รหัสผ่านทั้งสองช่องไม่ตรงกัน";
    return "";
  }

  window.MTC = {session:read, login, register, changeWithOld, changePassword, refresh, enroll, verify, logout,
    errText, isAuthErr, esc, nextUrl, norm, pwCheck, pwValid, pwProblem, pwField, bindPw};
})();
