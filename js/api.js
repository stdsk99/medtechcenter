/* ===== บัญชีผู้เรียนและการเชื่อมต่อหลังบ้าน (ใช้ร่วมกับแอปฝึกซ่อม) =====
   session ร่วม เก็บที่ localStorage คีย์ "mtc-session" = {profile, pin, enrolled, t}
   เว็บหลักและแอปอยู่โดเมนเดียวกัน แอปจึงอ่าน session นี้ได้ ไม่ต้องล็อกอินซ้ำ
   หมายเหตุ: วิธีเข้ารหัส PIN ต้องเหมือนในแอป ("ipt|" + รหัสผู้ใช้ + "|" + PIN) ห้ามเปลี่ยน */
(function(){
  const S = window.SITE || {};
  const K = "mtc-session";
  /* คีย์ของแอปฝึกซ่อม ลบพร้อมกันตอนออกจากระบบ */
  const APP_KEYS = ["ipt-session","ipt-history","iit-session","iit-history"];

  const esc = s => String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const read = ()=>{ try{ return JSON.parse(localStorage.getItem(K)); }catch(e){ return null; } };
  const write = v=>{ try{ localStorage.setItem(K, JSON.stringify(v)); }catch(e){} };

  async function hashPin(uid, pin){
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`ipt|${uid}|${pin}`));
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
  }
  const norm = (type, u)=> type==="gp" ? u.trim().toLowerCase() : u.trim().replace(/\s+/g,"");

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
    badpin:"PIN ไม่ถูกต้อง", net:"เชื่อมต่อระบบไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่", token:"ระบบตั้งค่าไม่ถูกต้อง กรุณาแจ้งผู้ดูแลระบบ",
    offline:"ยังไม่ได้ตั้งค่าการเชื่อมต่อระบบ", bad:"คำขอไม่ถูกต้อง", notfound:"ไม่พบเลขที่นี้ในระบบ", format:"รูปแบบเลขที่ไม่ถูกต้อง"};
  const errText = r => MSG[r && r.err] || ("เกิดข้อผิดพลาด (" + ((r && r.err) || "unknown") + ")");

  /* เข้าสู่ระบบ / สมัคร: เก็บ session และดึงภาพรวมทันที */
  async function login(type, uidRaw, pin){
    const uid = norm(type, uidRaw), h = await hashPin(uid, pin);
    const r = await call("portal", {sid:uid, pin:h});
    if(!r.ok) return r;
    write({profile:r.profile, pin:h, enrolled:r.enrolled||[], t:Date.now()});
    return r;
  }
  async function register(profile, pin){
    const uid = norm(profile.type, profile.sid), h = await hashPin(uid, pin);
    profile = Object.assign({}, profile, {sid:uid});
    const r = await call("register", {sid:uid, pin:h, profile, consent:S.pdpa||""});
    if(!r.ok) return r;
    write({profile:r.profile, pin:h, enrolled:[], t:Date.now()});
    return Object.assign(r, {enrolled:[], progress:{}, certs:[]});
  }
  /* ดึงภาพรวมล่าสุดของคนที่ล็อกอินอยู่ */
  async function refresh(){
    const s = read(); if(!s) return {ok:false, err:"nouser"};
    const r = await call("portal", {sid:s.profile.sid, pin:s.pin});
    if(r.ok) write(Object.assign(s, {profile:r.profile, enrolled:r.enrolled||[], t:Date.now()}));
    else if(r.err==="badpin" || r.err==="nouser") logout();
    return r;
  }
  async function enroll(app){
    const s = read(); if(!s) return {ok:false, err:"nouser"};
    const r = await call("enroll", {sid:s.profile.sid, pin:s.pin, app});
    if(r.ok) write(Object.assign(s, {enrolled:r.enrolled}));
    return r;
  }
  const verify = ref => call("verify", {ref});
  function logout(){ try{ localStorage.removeItem(K); APP_KEYS.forEach(k=>localStorage.removeItem(k)); }catch(e){} }

  /* ไปหน้าที่ต้องการหลังล็อกอิน (เฉพาะหน้าในเว็บนี้) */
  function nextUrl(def){
    const n = new URLSearchParams(location.search).get("next");
    return (n && /^[a-z]+\.html(\?[\w=&-]*)?$/.test(n)) ? n : (def || "my.html");
  }

  window.MTC = {session:read, login, register, refresh, enroll, verify, logout, errText, esc, nextUrl, norm};
})();
