/* ===== สคริปต์ร่วมของเว็บหลัก ===== */
(function(){
  const S = window.SITE || {};

  /* เมนูบนมือถือ */
  const btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
  if(btn && nav){
    btn.addEventListener("click", ()=>{
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "ปิดเมนู" : "เปิดเมนู");
    });
    nav.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=>{ nav.classList.remove("open"); btn.setAttribute("aria-expanded","false"); }));
  }

  /* เส้นใต้แถบเมนูเมื่อเลื่อนหน้า */
  const head = document.querySelector(".site-head");
  const onScroll = ()=> head && head.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  /* ตัวอย่างเคส: เลือกคำตอบได้จริง */
  const choices = document.querySelectorAll(".choice");
  choices.forEach(c=>c.addEventListener("click", ()=>{
    const ok = c.dataset.ok === "1", box = c.closest(".ticket");
    choices.forEach(x=>x.classList.remove("good","bad"));
    c.classList.add(ok ? "good" : "bad");
    box.querySelector(".fb.good").hidden = !ok;
    box.querySelector(".fb.bad").hidden = ok;
  }));

  /* ช่องทางติดต่อ: แสดงเฉพาะที่ตั้งค่าไว้ใน js/config.js */
  const ct = document.getElementById("contact"), C = S.contact || {};
  if(ct){
    const rows = [];
    if(C.email) rows.push(`<a href="mailto:${encodeURI(C.email)}">${C.email}</a>`);
    if(C.line) rows.push(`<span>LINE: ${C.line}</span>`);
    if(C.phone) rows.push(`<a href="tel:${C.phone.replace(/[^0-9+]/g,"")}">${C.phone}</a>`);
    if(rows.length){ ct.insertAdjacentHTML("beforeend", rows.join("")); ct.hidden = false; }
  }
})();
