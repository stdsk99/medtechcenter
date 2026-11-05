/* ===== ข้อมูลวิชา (1 เครื่อง = 1 วิชา) =====
   id ต้องตรงกับชื่อแอปใน Code.gs (APPS) และใน js/config.js (apps)
   เพิ่มวิชาใหม่: เพิ่มรายการในไฟล์นี้ + ที่อยู่แอปใน config.js + APPS ใน Code.gs */
window.COURSES = [
 {id:"pump", th:"เครื่องควบคุมการให้สารละลาย", en:"Volumetric Infusion Pump", art:"sky", ref:"IPT",
  intro:"เครื่องที่ใช้ให้ยาและสารน้ำทางหลอดเลือดดำด้วยอัตราที่แม่นยำ พบได้ในทุกหอผู้ป่วย วิชานี้พาไปดูกลไกบีบสายภายในเครื่อง ระบบตรวจจับฟองอากาศและการอุดตัน แล้วฝึกซ่อมจากใบแจ้งซ่อมจริง",
  learn:["หลักการทำงานของกลไก peristaltic และเซนเซอร์แต่ละตัว","ความหมายของ alarm 15 รายการ และสิ่งที่ตรวจได้เองก่อนส่งซ่อม","ฝึกซ่อม 8 เคส เช่น alarm ฟองอากาศหลอก ฝาปิดไม่สนิท และอัตราไหลคลาดเคลื่อน","ทดสอบ flow accuracy, occlusion pressure และความปลอดภัยทางไฟฟ้า (IEC 62353)","เรียงลำดับขั้นตอนงานซ่อม การเปลี่ยนแบตเตอรี่ และการทำความสะอาด","แบบทดสอบ 20 ข้อ พร้อมเฉลย","การตั้งค่าเครื่องทางคลินิก: คำนวณอัตราไหล ฝึกตั้งค่าบนเครื่องจำลองปุ่มกด และแยกให้ออกว่าตั้งค่าผิดหรือเครื่องเสีย"],
  crit:["ทำโหมดเรียนรู้ครบ 8 เคส","โหมดสอบครบ 8 เคส เฉลี่ยอย่างน้อย 70 คะแนน","แบบทดสอบอย่างน้อย 80%","ลำดับขั้นตอนครบ 3 งาน","เครื่องจำลองการตั้งค่าทางคลินิกอย่างน้อย 80%"],
  clin:{pct:80, label:"เครื่องจำลองตั้งค่าทางคลินิก"}},
 {id:"incubator", th:"ตู้อบทารก", en:"Infant Incubator", art:"peach", ref:"IIT",
  intro:"ตู้ที่ควบคุมอุณหภูมิ ความชื้น และออกซิเจนรอบตัวทารกแรกเกิดและทารกคลอดก่อนกำหนด วิชานี้พาไปดูลมอุ่นหมุนเวียนในตู้ ระบบความปลอดภัย แล้วฝึกซ่อมและบำรุงรักษาเหมือนงานจริง",
  learn:["หลักการทำงานของพัดลม ฮีตเตอร์ เซนเซอร์อุณหภูมิ ระบบความชื้น และ servo O₂","ความหมายของ alarm 15 รายการ และลำดับการตรวจ","ฝึกซ่อม 8 เคส เช่น Fan Failure, Heater Failure และเซนเซอร์ O₂ หมดอายุ","ทดสอบประสิทธิภาพอุณหภูมิด้วย incubator analyzer ตาม IEC 60601-2-19 และความปลอดภัยทางไฟฟ้า","เรียงลำดับการถอดล้างตู้ระหว่างผู้ป่วย และการทำ PM ประจำปี","แบบทดสอบ 20 ข้อ พร้อมเฉลย","การใช้งานสำหรับช่าง: โหมด Air/Skin การตั้งค่าเครื่องโดยช่าง ฝึกตั้งค่าบนแผงควบคุมจำลอง ตรวจเครื่องก่อนใช้งาน และแยกให้ออกว่าใช้งานผิดหรือเครื่องเสีย"],
  crit:["ทำโหมดเรียนรู้ครบ 8 เคส","โหมดสอบครบ 8 เคส เฉลี่ยอย่างน้อย 70 คะแนน","แบบทดสอบอย่างน้อย 80%","ลำดับขั้นตอนครบ 3 งาน","การใช้งานสำหรับช่าง (ฝึกตั้งค่า + มุมช่าง) อย่างน้อย 80%"],
  clin:{pct:80, label:"การใช้งานสำหรับช่าง"}}
];
/* ภาพวาดเครื่อง (ใช้ซ้ำในหลายหน้า) */
window.COURSE_ART = {
 pump:`<svg viewBox="0 0 160 130" aria-hidden="true"><rect x="20" y="20" width="120" height="96" rx="16" fill="#FFFFFF" stroke="#22303A" stroke-width="3"/><rect x="34" y="32" width="64" height="30" rx="6" fill="#22303A"/><text x="66" y="52" font-size="13" text-anchor="middle" fill="#9FE6D6" font-family="ui-monospace, monospace">125 mL/h</text><rect x="106" y="32" width="22" height="9" rx="3" fill="#CFE6F7" stroke="#22303A" stroke-width="1.5"/><rect x="106" y="45" width="22" height="9" rx="3" fill="#CFE6F7" stroke="#22303A" stroke-width="1.5"/><rect x="34" y="74" width="94" height="30" rx="8" fill="#E3F5F0" stroke="#22303A" stroke-width="2"/><path d="M44 89 h74" stroke="#5B9BD5" stroke-width="5" stroke-linecap="round"/><path d="M10 89 h24 M128 89 h22" stroke="#5B9BD5" stroke-width="4" stroke-linecap="round"/></svg>`,
 incubator:`<svg viewBox="0 0 180 130" aria-hidden="true"><path d="M24 84 V52 Q24 24 52 24 H128 Q156 24 156 52 V84" fill="#FFFFFF" stroke="#22303A" stroke-width="3"/><circle cx="56" cy="58" r="12" fill="none" stroke="#22303A" stroke-width="2" stroke-dasharray="4 3"/><circle cx="124" cy="58" r="12" fill="none" stroke="#22303A" stroke-width="2" stroke-dasharray="4 3"/><ellipse cx="86" cy="76" rx="22" ry="6" fill="#F6CFAE"/><circle cx="112" cy="74" r="7" fill="#F6CFAE"/><path d="M34 80 V40 M146 80 V40" stroke="#F2785C" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 5"/><rect x="16" y="84" width="148" height="28" rx="8" fill="#0B6E62"/><circle cx="40" cy="98" r="8" fill="#FFF0C2"/><path d="M58 98 h60" stroke="#FFD166" stroke-width="3" stroke-linecap="round"/></svg>`
};
