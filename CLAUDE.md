# CLAUDE.md: เว็บหลัก ศูนย์การเรียนรู้เทคโนโลยีทางการแพทย์

ก่อนเริ่มงานทุกครั้ง อ่าน 3 ไฟล์นี้ตามลำดับ
1. `STANDARDS.md` มาตรฐานกลางของศูนย์ฯ (ต้นฉบับอยู่ที่ repo นี้)
2. `HANDOFF.md` แผนผังระบบทั้งหมด Code.gs และวิธีเพิ่มวิชา
3. `MEMORY.md` สิ่งที่เจ้าของงานเคยสั่งแก้ในเว็บหลัก

เมื่อเจ้าของงานสั่งแก้หรือตัดสินใจเรื่องใหม่ ให้จดลง `MEMORY.md` (วันที่ + กฎ) ถ้ากฎนั้นใช้กับทุกวิชา ให้เสนอย้ายเข้า `STANDARDS.md` แล้วใช้ `/ซิงก์มาตรฐาน`

## หน้าที่ของ repo นี้

- เว็บหลัก: สมัคร เข้าสู่ระบบ ลงทะเบียนรายวิชา หน้าวิชาของฉัน (`my.html`) และตรวจสอบเกียรติบัตร (`verify.html`)
- **ต้นฉบับของ `STANDARDS.md`** แก้ที่นี่ก่อนเสมอ แล้วจึงคัดไปทุก repo

## ไฟล์สำคัญ

- `js/courses.js` ข้อมูลวิชาทั้งหมด (intro, learn, crit) และภาพวาดเครื่อง `COURSE_ART`
- `js/config.js` ที่อยู่แอปแต่ละวิชา · `js/api.js` คีย์ localStorage (`APP_KEYS`)
- `index.html` การ์ดวิชาในหน้าแรก

## repo ทั้งหมดของศูนย์ฯ (ต้องมี STANDARDS.md ชุดเดียวกัน)

medtechcenter · infusion-pump-trainer · infant-incubator-trainer · oxygen-concentrator · medical-suction · infant-warmer · phototherapy
