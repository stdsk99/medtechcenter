/* ===== ตั้งค่าเว็บหลัก =====
   แก้ไฟล์นี้ไฟล์เดียวเมื่อย้ายเว็บไปโฮสต์อื่น หรือเพิ่มเครื่องใหม่

   apiUrl  : URL ของ Google Apps Script ตัวเดียวกับแอปฝึกซ่อม
   token   : ต้องตรงกับ TOKEN ใน Code.gs
   apps    : ที่อยู่ของแอปฝึกซ่อมแต่ละเครื่อง (ต้องอยู่โดเมนเดียวกับเว็บหลัก จึงล็อกอินครั้งเดียวได้)
             บน GitHub Pages คือ "/ชื่อ repo/"  ย้ายขึ้นโฮสต์แล้วเปลี่ยนเป็น เช่น "/pump/" และ "/incubator/"
   contact : ช่องทางติดต่อที่แสดงในส่วนท้ายเว็บ เว้นว่าง = ไม่แสดง
*/
window.SITE = {
  name: "ศูนย์การเรียนรู้เทคโนโลยีทางการแพทย์",
  apiUrl: "https://script.google.com/macros/s/AKfycbzLcs08L6W0fnHHZ5tCq8JjkXFPcux3G3_WT1t3vUC8zSo-oQKoACC3xHc67-h-yy6KTw/exec",
  token: "pump-2569",
  apps: {
    pump: "/infusion-pump-trainer/",
    incubator: "/infant-incubator-trainer/",
    "incubator-clin": "/infant-incubator-trainer/clinical/",
    "pump-clin": "/infusion-pump-trainer/clinical/",
    o2: "/oxygen-concentrator/",
    "o2-clin": "/oxygen-concentrator/clinical/",
    suction: "/medical-suction/",
    "suction-clin": "/medical-suction/clinical/",
    warmer: "/infant-warmer/",
    photo: "/phototherapy/",
    "warmer-clin": "/infant-warmer/clinical/"
  },
  contact: {
    email: "theptharo2019@gmail.com",
    line: "",
    phone: ""
  },
  pdpa: "ข้าพเจ้ายินยอมให้เก็บชื่อ รหัสหรืออีเมล หน่วยงาน และผลการเรียนในระบบนี้ เพื่อใช้บันทึกผลการเรียน ติดตามความก้าวหน้า และออกใบรับรองเท่านั้น ข้อมูลจะไม่ถูกเปิดเผยต่อบุคคลภายนอก และขอให้ระงับบัญชีหรือลบข้อมูลได้โดยติดต่อผู้ดูแลระบบ ยกเว้นผลการเรียนและเกียรติบัตรที่ต้องเก็บไว้เป็นหลักฐาน"
};
