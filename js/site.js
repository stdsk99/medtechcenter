/* ===== สคริปต์ร่วมของเว็บหลัก: แถบเมนู ส่วนท้าย และตัวอย่างเคส ===== */
(function(){
  const S = window.SITE || {}, M = window.MTC, esc = M ? M.esc : (s=>s);
  const page = (document.body.dataset.page || "");
  const sess = M && M.session();

  /* ---------- แถบเมนู ---------- */
  const head = document.querySelector(".site-head");
  if(head){
    const first = sess ? esc(String(sess.profile.name||"").split(" ")[0]) : "";
    const link = (href, txt, key)=>`<a href="${href}"${page===key?' aria-current="page"':""}>${txt}</a>`;
    head.innerHTML = `<div class="wrap head-row">
      <a class="brand" href="./">
        <span class="logo"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/><path d="M8 12h2l1-2 2 4 1-2h2"/></svg></span>
        <span class="brand-name">${esc(S.name||"ศูนย์การเรียนรู้เทคโนโลยีทางการแพทย์")}</span>
      </a>
      <button class="menu-btn" type="button" aria-label="เปิดเมนู" aria-expanded="false" aria-controls="nav">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      <nav class="nav" id="nav" aria-label="เมนูหลัก">
        ${link("./#devices","เครื่องที่ฝึกได้","")}
        ${page==="home"?link("#example","ลองดูตัวอย่าง",""):""}
        ${link("verify.html","ตรวจสอบเกียรติบัตร","verify")}
        ${sess
          ? `<a class="nav-user${page==="my"?" on":""}" href="my.html"${page==="my"?' aria-current="page"':""}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>วิชาของฉัน · ${first}</a>`
          : `<a class="nav-login" href="login.html">เข้าสู่ระบบ</a><a class="btn btn-primary btn-sm" href="login.html?mode=reg">สมัครเรียนฟรี</a>`}
      </nav></div>`;
    const btn = head.querySelector(".menu-btn"), nav = head.querySelector("#nav");
    btn.addEventListener("click", ()=>{
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open); btn.setAttribute("aria-label", open ? "ปิดเมนู" : "เปิดเมนู");
    });
    nav.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=>{ nav.classList.remove("open"); btn.setAttribute("aria-expanded","false"); }));
    const onScroll = ()=> head.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
  }

  /* ---------- ส่วนท้าย ---------- */
  const foot = document.querySelector(".site-foot");
  if(foot){
    const C = S.contact || {}, rows = [];
    if(C.email) rows.push(`<a href="mailto:${encodeURI(C.email)}">${esc(C.email)}</a>`);
    if(C.line) rows.push(`<span>LINE: ${esc(C.line)}</span>`);
    if(C.phone) rows.push(`<a href="tel:${C.phone.replace(/[^0-9+]/g,"")}">${esc(C.phone)}</a>`);
    foot.innerHTML = `<div class="wrap foot-row">
      <div class="foot-main"><span class="foot-name">${esc(S.name||"")}</span>
        <span class="muted" style="font-size:14px">สื่อเพื่อการศึกษา การซ่อมเครื่องจริงต้องทำตาม service manual ของผู้ผลิต โดยช่างที่ผ่านการอบรม</span></div>
      <div class="foot-col"><a href="verify.html">ตรวจสอบเกียรติบัตร</a><a href="howto.html"${page==="howto"?' aria-current="page"':""}>วิธีใช้งาน</a><a href="privacy.html"${page==="privacy"?' aria-current="page"':""}>นโยบายความเป็นส่วนตัว (PDPA)</a></div>
      ${rows.length?`<div class="foot-col"><b>ติดต่อ</b>${rows.join("")}</div>`:""}
    </div>`;
  }

  /* ---------- ตัวอย่างเคสในหน้าแรก ---------- */
  const choices = document.querySelectorAll(".choice");
  choices.forEach(c=>c.addEventListener("click", ()=>{
    const ok = c.dataset.ok === "1", box = c.closest(".ticket");
    choices.forEach(x=>x.classList.remove("good","bad"));
    c.classList.add(ok ? "good" : "bad");
    box.querySelector(".fb.good").hidden = !ok;
    box.querySelector(".fb.bad").hidden = ok;
  }));
})();
