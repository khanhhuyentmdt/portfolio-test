# Kế hoạch xây dựng trang chi tiết: Thiết Kế Hệ Thống
**File xuất:** `skills_systemdesign.html`  
**Kết nối:** Nút "XEM THÊM" trong skill card "THIẾT KẾ HỆ THỐNG" của `index.html` → `href="./skills_systemdesign.html"`

---

## 1. Tổng quan & Kiến trúc

**Tech Stack** — kế thừa hoàn toàn từ `index.html`:
- React 18 (unpkg CDN) + Babel Standalone (in-browser JSX)
- Tailwind Play CDN
- Font: Plus Jakarta Sans (heading) + Nunito Sans (body) — Google Fonts CDN
- Màu: navy `#000046` | lavender `#c9c4e0` | lav-bg `#f0eef8`
- Chạy trực tiếp từ `file://` — không cần server, không build step

**Shared components** được copy nguyên từ `index.html`: `LangToggle`, `Header`, `ContactFooter`, toàn bộ icon SVG. Mọi thay đổi về style hay nội dung shared sau này cần cập nhật đồng bộ ở cả 2 file.

---

## 2. Phân tích UI từ mockup (images 2.png → 6.png)

### 2.1 Cấu trúc tổng thể trang

```
┌─────────────────────────────────────────────────────────────────┐
│  <Header>        — giống hệt index.html (trắng, sticky)         │
├─────────────────────────────────────────────────────────────────┤
│  <PageHero>      — tiêu đề "THIẾT KẾ HỆ THỐNG" + back link      │
├─────────────────────────────────────────────────────────────────┤
│  <ProjectNavMenu>— 4 cards dạng 2×2 (sub-navigation)           │
│     [01 — Quản lý Tồn Sản Phẩm]  [02 — Bán Hàng ÔM]            │
│     [03 — ERP Wonder Wood     ]  [04 — ERP Singapore Yummy]     │
├─────────────────────────────────────────────────────────────────┤
│  <ProjectSection id="p1">  ← cuộn đến từ card 01                │
│  <ProjectSection id="p2">  ← cuộn đến từ card 02                │
│  <ProjectSection id="p3">  ← cuộn đến từ card 03                │
│  <ProjectSection id="p4">  ← cuộn đến từ card 04                │
├─────────────────────────────────────────────────────────────────┤
│  <ContactFooter> — giống hệt index.html                         │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Bốn dự án — Tên và Sections (đọc từ mockup)

| # | ID | Tên đầy đủ (từ navy header bar) | Sections có mặt |
|---|----|---------------------------------|-----------------|
| 01 | p1 | Hệ thống quản lý vị trí sản phẩm trên kệ kho và cửa hàng the SHEA | Giới thiệu · Phạm vi · Use Case Diagram · Use Case Spec · Activity Diagram |
| 02 | p2 | Hệ thống ERP Yến Sào Nam An - Công ty TNHH Nam Việt Phương | Giới thiệu · Swim Lane · User Stories · Use Case Diagram · Use Case Spec · Activity Diagram · ERD |
| 03 | p3 | HỆ THỐNG ERP CHO CÔNG TY TNHH WONDER WOOD | Giới thiệu · Swim Lane · User Stories · Use Case Diagram · Use Case Spec · Activity Diagram · ERD |
| 04 | p4 | HỆ THỐNG ERP CHO THƯƠNG HIỆU TÀU HỦ SINGAPORE YUMMY | Giới thiệu · Phạm vi · Swim Lane · User Stories · Use Case Diagram · Use Case Spec · Activity Diagram · ERD (3 module) |

### 2.3 Visual patterns rút ra từ mockup

| Element | Màu / Style |
|---------|-------------|
| Project header bar | `bg-navy text-white` — toàn chiều rộng, padding py-4 px-6 |
| Header bảng User Stories | Nền cam (`bg-orange-500 text-white`) |
| Header bảng Use Case Spec | Nền cam (`bg-orange-500 text-white`) |
| Section sub-label (GIỚI THIỆU, PHẠM VI…) | `text-xs font-bold tracking-widest text-gray-400 uppercase` + đường kẻ ngang bên dưới |
| Sơ đồ (diagram images) | Bordered box, `rounded-lg border border-gray-200 bg-white` |
| Nền xen kẽ section | Dự án lẻ `bg-white`, dự án chẵn `bg-gray-50` (tùy chọn) |
| ProjectNavCard active | `border-navy shadow-md` hoặc `bg-lav-bg` |
| Footer copyright bar | `bg-white border-t` — giữ nguyên từ index.html |

---

## 3. Cấu trúc Component

### 3.1 Cây component

```
<App>
 ├── <Header lang setLang activeSection />        ← Copy từ index.html
 ├── <PageHero />                                  ← Mới
 ├── <ProjectNavMenu
 │       projects={PROJECTS}
 │       activeProject={activeProject} />          ← Mới
 ├── <ProjectSection project={PROJECTS[0]} />      ← id="p1"
 ├── <ProjectSection project={PROJECTS[1]} />      ← id="p2"
 ├── <ProjectSection project={PROJECTS[2]} />      ← id="p3"
 ├── <ProjectSection project={PROJECTS[3]} />      ← id="p4"
 └── <ContactFooter lang={lang} />                 ← Copy từ index.html
```

### 3.2 Chi tiết từng component

| Component | Props | Trách nhiệm |
|-----------|-------|-------------|
| `Header` | `lang`, `setLang`, `activeSection` | Copy nguyên. Thay logo `href` thành `./index.html` |
| `PageHero` | — | Tiêu đề "THIẾT KẾ HỆ THỐNG" + nút "← Quay lại Portfolio" (`href="./index.html"`) |
| `ProjectNavMenu` | `projects`, `activeProject` | Grid 2×2, render 4 `ProjectNavCard` |
| `ProjectNavCard` | `project`, `index`, `isActive` | Badge số (01–04), tên ngắn, hover, click → anchor scroll |
| `ProjectSection` | `project` | Container `<section id="pX">`, render `ProjectHeader` + danh sách `SectionBlock` |
| `ProjectHeader` | `title`, `index` | Navy bar: badge số + tên đầy đủ dự án |
| `SectionBlock` | `type`, `data` | Dispatcher: căn cứ `type` → render đúng component |
| `TextBlock` | `heading`, `paragraphs[]` | Giới thiệu / Phạm vi — đoạn văn plain text |
| `ImageBlock` | `heading`, `images[]`, `layout` | Sơ đồ — single / pair / multi |
| `UserStoriesTable` | `heading`, `columns[]`, `rows[]` | Bảng User Stories, header cam |
| `UseCaseSpecTable` | `heading`, `specs[]` | Bảng Use Case Specification, key-value dọc |
| `ContactFooter` | `lang` | Copy nguyên từ index.html |

### 3.3 SectionBlock — dispatcher logic

```
type = 'intro'            → <TextBlock>
type = 'scope'            → <TextBlock>
type = 'swimlane'         → <ImageBlock layout="full">
type = 'user-stories'     → <UserStoriesTable>
type = 'use-case-diagram' → <ImageBlock layout="pair">
type = 'use-case-spec'    → <UseCaseSpecTable>
type = 'activity-diagram' → <ImageBlock layout="pair">
type = 'erd'              → <ImageBlock layout="full" | "multi">
```

---

## 4. Quản lý State & Scroll

### 4.1 State trong `<App>`

```js
const [lang, setLang]                   = useState('vi');       // VI/EN
const [activeSection, setActiveSection] = useState('');         // cho Header nav (không dùng ở trang này)
const [activeProject, setActiveProject] = useState('p1');       // cho ProjectNavMenu highlight
```

### 4.2 Scroll logic

- `<html class="scroll-smooth">` — kế thừa từ index.html
- CSS: `section[id] { scroll-margin-top: 80px }` — offset cho sticky header
- `ProjectNavCard` dùng `<a href="#p1">` — anchor thuần, không cần JS click handler

### 4.3 Active project card — scroll listener

```js
useEffect(() => {
  const PROJECT_IDS = ['p1', 'p2', 'p3', 'p4'];
  const handleScroll = () => {
    const scrollY = window.scrollY + 130;  // offset cao hơn để trigger sớm hơn
    let current = 'p1';
    for (const id of PROJECT_IDS) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    }
    setActiveProject(current);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

## 5. Cấu trúc Dữ liệu Mẫu (CONTENT Object)

### 5.1 Mảng PROJECTS — schema tổng quát

> **Quy tắc naming asset:** `theshea-*` · `naman-*` · `wonderwood-*` · `yummy-*`
>
> **Schema chuẩn** (theo p1):
> - `overview` → `intro: { heading, paragraphs[] }` + `scope: { heading, paragraphs[] }` (scope tùy chọn)
> - `use-case-diagram` → `layout: 'full'`, chỉ ảnh Level 1 có `size: 'md'`
> - `use-case-spec` → `layout: 'full'`, dùng `images[]` (không dùng `specs[]`)
> - `activity-diagram` → `layout: 'pair'`, section có `size: 'md'`
> - `swimlane` → `layout: 'full'`
> - `erd` → `layout: 'full'` (1 ảnh) hoặc `layout: 'multi'` (nhiều ảnh)

```js
const PROJECTS = [

  // ── Dự án 1 — The SHEA ───────────────────────────────────────
  {
    id: 'p1',
    shortTitle: 'HỆ THỐNG QUẢN LÝ VỊ TRÍ SẢN PHẨM TRÊN KỆ KHO VÀ CỬA HÀNG THE SHEA',
    fullTitle:  'HỆ THỐNG QUẢN LÝ VỊ TRÍ SẢN PHẨM TRÊN KỆ KHO VÀ CỬA HÀNG THE SHEA',
    cardDesc:   'Phân tích và thiết kế hệ thống quản lý vị trí sản phẩm theo slot kệ tại kho và cửa hàng cho The SHEA, đảm bảo đặc tả rõ ràng, logic và sát thực tế vận hành.',
    sections: [
      {
        type: 'overview',
        intro: {
          heading: 'GIỚI THIỆU',
          paragraphs: [
            'The SHEA đang quản lý vị trí sản phẩm trên kệ kho và cửa hàng theo cách thủ công, dựa vào kinh nghiệm cá nhân nhân viên, dẫn đến tình trạng tìm hàng chậm, sắp xếp sai vị trí, hàng tồn không luân chuyển đúng quy tắc và quản lý thiếu dữ liệu để giám sát, kiểm soát kịp thời.',
          ],
        },
        scope: {
          heading: 'PHẠM VI',
          paragraphs: [
            'Hệ thống tập trung vào việc quản lý vị trí sản phẩm trên kệ tại kho và cửa hàng của the SHEA, bao gồm phân bổ và cập nhật vị trí sản phẩm, tra cứu hàng hóa, kiểm soát luân chuyển hàng hóa.',
          ],
        },
      },
      {
        type: 'use-case-diagram',
        heading: 'SƠ ĐỒ USE CASE',
        layout: 'full',
        images: [
          { src: './assets/theshea-uc-lv1.png', alt: 'Use Case Level 1', caption: 'Use Case Level 1', size: 'md' },
          { src: './assets/theshea-uc-lv2.png', alt: 'Use Case Level 2', caption: 'Use Case Level 2' },
          { src: './assets/theshea-uc-lv3.png', alt: 'Use Case Level 3', caption: 'Use Case Level 3' },
        ],
      },
      {
        type: 'use-case-spec',
        heading: 'USE CASE SPECIFICATION',
        layout: 'full',
        images: [
          { src: './assets/theshea-ucs.png', alt: 'Use Case Specification', caption: 'Use Case Specification' },
        ],
      },
      {
        type: 'activity-diagram',
        heading: 'ACTIVITY DIAGRAM',
        layout: 'pair',
        size: 'md',
        images: [
          { src: './assets/theshea-ad1.png', alt: 'Activity Diagram 1', caption: 'Activity Diagram — UC1.1. Thêm mới giá kệ' },
          { src: './assets/theshea-ad2.png', alt: 'Activity Diagram 2', caption: 'Activity Diagram — UC1.4. Xóa giá kệ' },
        ],
      },
    ],
  },

  // ── Dự án 2 — Yến Sào Nam An ─────────────────────────────────
  {
    id: 'p2',
    shortTitle: 'HỆ THỐNG ERP YẾN SÀO NAM AN - CÔNG TY TNHH NAM VIỆT PHƯƠNG',
    fullTitle:  'HỆ THỐNG ERP YẾN SÀO NAM AN - CÔNG TY TNHH NAM VIỆT PHƯƠNG',
    cardDesc:   'Phân tích và thiết kế hệ thống ERP cho Công ty TNHH Nam Việt Phương, tập trung vào quy trình mua hàng, bán hàng và quản lý kho cho dòng sản phẩm yến sào Nam An.',
    sections: [
      {
        type: 'overview',
        intro: {
          heading: 'GIỚI THIỆU',
          paragraphs: [
            'Yến Sào Nam An hoạt động trong lĩnh vực sản xuất và kinh doanh yến sào từ thu hoạch, sơ chế, tinh chế đến bán lẻ và bán sỉ. Doanh nghiệp đang vận hành trên nhiều nền tảng (Sapo, Excel, chứng từ giấy), dẫn đến dữ liệu phân tán, khó tổng hợp và thiếu khả năng phân tích phục vụ ra quyết định. Dự án ERP được triển khai nhằm tập trung hóa dữ liệu, chuẩn hóa quy trình vận hành và hỗ trợ doanh nghiệp chuyển dữ liệu thành thông tin và khuyến nghị kinh doanh thực tiễn.',
          ],
        },
        scope: {
          heading: 'PHẠM VI',
          paragraphs: [
            'Phụ trách phân tích và thiết kế module Tài chính trong hệ thống ERP, bao gồm các nghiệp vụ theo dõi thu chi, quản lý công nợ bán sỉ/bán lẻ và báo cáo tài chính nội bộ đảm bảo nghiệp vụ tài chính được đặc tả rõ ràng, sát thực tế và sẵn sàng cho giai đoạn phát triển hệ thống.',
          ],
        },
      },
      {
        type: 'swimlane',
        heading: 'Quy trình QUẢN LÝ TÀI CHÍNH được mô hình hóa bằng bpmn',
        layout: 'full',
        images: [
          { src: './assets/naman-bpmn.png', alt: 'Swim Lane — Yến Sào Nam An', caption: 'Quy trình quản lý tài chính' },
        ],
      },
      {
        type: 'user-stories',
        heading: 'USER STORIES',
        layout: 'full',
        images: [
          { src: './assets/naman-us1.png', alt: 'User Stories - 1', caption: 'User Stories - 1' },
          { src: './assets/naman-us2.png', alt: 'User Stories - 2', caption: 'User Stories - 2' },
        ],
      },
      {
        type: 'use-case-diagram',
        heading: 'SƠ ĐỒ USE CASE',
        layout: 'full',
        images: [
          { src: './assets/naman-uc-lv1.png', alt: 'Use Case Level 1', caption: 'Use Case Level 1', size: 'md' },
          { src: './assets/naman-uc-lv2.png', alt: 'Use Case Level 2', caption: 'Use Case Level 2' },
        ],
      },
      {
        type: 'use-case-spec',
        heading: 'USE CASE SPECIFICATION',
        layout: 'full',
        images: [
          { src: './assets/naman-ucs1.png', alt: 'UCS 6.2.1. Thêm nguồn quỹ', caption: 'Đặc tả UC-6.2.1. Thêm nguồn quỹ' },
          { src: './assets/naman-ucs2.png', alt: 'UCS 6.4.1b. Xem chi tiết công nợ nhà cung cấp', caption: 'Đặc tả UC-6.4.1b. Xem chi tiết công nợ nhà cung cấp' },
        ],
      },
      {
        type: 'activity-diagram',
        heading: 'ACTIVITY DIAGRAM',
        layout: 'pair',
        size: 'md',
        images: [
          { src: './assets/naman-ad1.png', alt: 'Activity Diagram 1', caption: 'Activity Diagram — UC6.2.1. Thêm nguồn quỹ' },
          { src: './assets/naman-ad2.png', alt: 'Activity Diagram 2', caption: 'Activity Diagram — UC-6.4.1b. Xem chi tiết công nợ nhà cung cấp' },
        ],
      },
      {
        type: 'erd',
        heading: 'SƠ ĐỒ THỰC THỂ MỐI QUAN HỆ (ERD)',
        layout: 'full',
        images: [
          { src: './assets/naman-erd.png', alt: 'ERD — Yến Sào Nam An', caption: 'ERD' },
        ],
      },
    ],
  },

  // ── Dự án 3 — Wonder Wood ────────────────────────────────────
  {
    id: 'p3',
    shortTitle: 'HỆ THỐNG ERP CHO CÔNG TY TNHH WONDER WOOD',
    fullTitle:  'HỆ THỐNG ERP CHO CÔNG TY TNHH WONDER WOOD',
    cardDesc:   'Phân tích và thiết kế hệ thống ERP cho Công ty TNHH Wonder Wood, bao gồm quy trình quản lý bán hàng, tồn kho và báo cáo vận hành cho doanh nghiệp sản xuất đồ gỗ.',
    sections: [
      {
        type: 'overview',
        intro: {
          heading: 'GIỚI THIỆU',
          paragraphs: [
            'Wonder Wood hoạt động trong lĩnh vực sản xuất và gia công ván gỗ công nghiệp, phục vụ khách hàng B2B. Doanh nghiệp đang vận hành chủ yếu bằng Excel và Google Sheet, khó kiểm soát quy trình sản xuất, tồn kho và theo dõi đơn hàng. Dự án ERP được triển khai nhằm số hóa toàn bộ hoạt động vận hành từ sản xuất, kho bãi đến bán hàng giúp doanh nghiệp quản lý hiệu quả hơn và hướng đến mô hình vận hành hiện đại, không phụ thuộc vào giấy tờ thủ công.',
          ],
        },
        scope: {
          heading: 'PHẠM VI',
          paragraphs: [
            'Phụ trách phân tích và thiết kế module Bán hàng B2B trong hệ thống ERP, bao gồm các nghiệp vụ tiếp nhận đơn hàng, quản lý thông tin khách hàng và theo dõi tiến độ giao hàng, nhằm đảm bảo nghiệp vụ bán hàng được đặc tả rõ ràng, sát thực tế và sẵn sàng cho giai đoạn phát triển hệ thống.',
          ],
        },
      },
      {
        type: 'swimlane',
        heading: 'Quy trình QUẢN LÝ BÁN HÀNG được mô hình hóa bằng bpmn',
        layout: 'full',
        images: [
          { src: './assets/wonderwood-bpmn.png', alt: 'Swim Lane — Wonder Wood', caption: 'Quy trình quản lý bán hàng' },
        ],
      },
      {
        type:    'user-stories',
        heading: 'USER STORIES',
        layout:  'pair',
        images: [
          { src: './assets/wonderwood-us1.png', alt: 'User Stories - 1', caption: 'User Stories - 1' },
          { src: './assets/wonderwood-us2.png', alt: 'User Stories - 2', caption: 'User Stories - 2' },
        ],
      },
      {
        type:    'use-case-diagram',
        heading: 'SƠ ĐỒ USE CASE',
        layout:  'full',
        images: [
          { src: './assets/wonderwood-uc-lv1.png', alt: 'Use Case Level 1', caption: 'Use Case Level 1', size: 'sm' },
          { src: './assets/wonderwood-uc-lv2.png', alt: 'Use Case Level 2', caption: 'Use Case Level 2' },
        ],
      },
      {
        type:    'use-case-spec',
        heading: 'USE CASE SPECIFICATION',
        layout:  'pair',
        images: [
          { src: './assets/wonderwood-ucs1.png', alt: 'Use Case Specification 1', caption: 'Use Case Specification 1' },
          { src: './assets/wonderwood-ucs2.png', alt: 'Use Case Specification 2', caption: 'Use Case Specification 2' },
        ],
      },
      {
        type: 'activity-diagram',
        heading: 'ACTIVITY DIAGRAM',
        layout: 'pair',
        size: 'md',
        images: [
          { src: './assets/wonderwood-ad1.png', alt: 'Activity Diagram 1', caption: 'Activity Diagram 1' },
          { src: './assets/wonderwood-ad2.png', alt: 'Activity Diagram 2', caption: 'Activity Diagram 2' },
        ],
      },
      {
        type: 'erd',
        heading: 'SƠ ĐỒ THỰC THỂ MỐI QUAN HỆ (ERD)',
        layout: 'full',
        images: [
          { src: './assets/wonderwood-erd.png', alt: 'ERD — Wonder Wood', caption: 'ERD' },
        ],
      },
    ],
  },

  // ── Dự án 4 — Singapore Yummy ────────────────────────────────
  {
    id: 'p4',
    shortTitle: 'HỆ THỐNG ERP CHO THƯƠNG HIỆU TÀU HỦ SINGAPORE YUMMY',
    fullTitle:  'HỆ THỐNG ERP CHO THƯƠNG HIỆU TÀU HỦ SINGAPORE YUMMY',
    cardDesc:   'Phân tích và thiết kế hệ thống ERP cho thương hiệu tàu hủ Singapore Yummy, bao gồm quy trình kinh doanh, đặt hàng, quản lý nhà sỹ và ERD 3 module phân tách rõ ràng.',
    sections: [
      {
        type: 'overview',
        intro: {
          heading: 'GIỚI THIỆU',
          paragraphs: [
            'Thương hiệu tàu hũ Singapore Yummy đang vận hành chuỗi cửa hàng trực thuộc. Doanh nghiệp hiện sử dụng iPOS cho nghiệp vụ bán hàng, tuy nhiên doanh nghiệp thiếu sự liên kết giữa các bộ phận. Dự án ERP được triển khai nhằm số hóa quy trình vận hành từ sản xuất đến nhân sự, giúp doanh nghiệp kiểm soát chặt chẽ hơn và sẵn sàng mở rộng chuỗi trong tương lai.',
          ],
        },
        scope: {
          heading: 'PHẠM VI',
          paragraphs: [
            'Phụ trách phân tích và thiết kế module Sản xuất & Nhân sự trong hệ thống ERP, bao gồm các nghiệp vụ quản lý quy trình sản xuất tàu hũ, theo dõi nguyên vật liệu, quản lý ca làm việc, chấm công và tính lương nhân viên, đảm bảo nghiệp vụ sản xuất và nhân sự được đặc tả rõ ràng, sát thực tế và sẵn sàng cho giai đoạn phát triển hệ thống.',
          ],
        },
      },
      {
        type: 'swimlane',
        heading: 'Quy trình kinh doanh được mô hình hóa bằng bpmn',
        layout: 'full',
        images: [
          { src: './assets/yummy-bpmn1.png', alt: 'Swim Lane — Singapore Yummy', caption: 'BPMN quy trình quản lý sản xuất' },
          { src: './assets/yummy-bpmn2.png', alt: 'Swim Lane — Singapore Yummy', caption: 'BPMN quy trình quản lý nhân sự' },
        ],
      },
      {
        type:    'user-stories',
        heading: 'USER STORIES',
        layout:  'pair',
        images: [
          { src: './assets/yummy-us1.png', alt: 'User Stories - 1', caption: 'User Stories - 1' },
          { src: './assets/yummy-us2.png', alt: 'User Stories - 2', caption: 'User Stories - 2' },
        ],
      },
      {
        type:    'use-case-diagram',
        heading: 'SƠ ĐỒ USE CASE',
        layout:  'full',
        images: [
          { src: './assets/yummy-uc-lv1.png', alt: 'Use Case Level 1', caption: 'Use Case Level 1', size: 'sm' },
          { src: './assets/yummy-uc-lv2.png', alt: 'Use Case Level 2', caption: 'Use Case Level 2', size: 'sl' },
          { src: './assets/yummy-uc-lv3.png', alt: 'Use Case Level 3', caption: 'Use Case Level 3', size: 'sl' },
        ],
      },
      {
        type:    'use-case-spec',
        heading: 'USE CASE SPECIFICATION',
        layout:  'pair',
        images: [
          { src: './assets/yummy-ucs1.png', alt: 'Use Case Specification 1', caption: 'Use Case Specification 1' },
          { src: './assets/yummy-ucs2.png', alt: 'Use Case Specification 2', caption: 'Use Case Specification 2' },
        ],
      },
      {
        type: 'activity-diagram',
        heading: 'ACTIVITY DIAGRAM',
        layout: 'pair',
        size: 'md',
        images: [
          { src: './assets/yummy-ad1.png', alt: 'Activity Diagram 1', caption: 'Activity Diagram 1' },
          { src: './assets/yummy-ad2.png', alt: 'Activity Diagram 2', caption: 'Activity Diagram 2' },
        ],
      },
      {
        type: 'erd',
        heading: 'SƠ ĐỒ THỰC THỂ MỐI QUAN HỆ (ERD)',
        layout: 'multi',   // 3 ảnh xếp dọc full-width
        images: [
          { src: './assets/yummy-erd1.png', alt: 'ERD Module Sản Xuất', caption: 'ERD Module Sản Xuất' },
          { src: './assets/yummy-erd2.png', alt: 'ERD Module Nhân Sự',  caption: 'ERD Module Nhân Sự' },
        ],
      },
    ],
  },

];
```

### 5.2 Schema chi tiết — UserStoriesTable

```js
// columns chuẩn (5 cột, đọc từ mockup)
columns: ['STT', 'Vai trò (As a)', 'Tôi muốn (I want to)', 'Để (So that)', 'Tiêu chí chấp nhận'],

// mỗi row
{
  id: 'US-01',
  role: 'Nhân viên kho',
  want: 'Xem danh sách tồn kho hiện tại',
  soThat: 'Tôi có thể kiểm tra số lượng còn lại',
  criteria: '- Hiển thị mã SP, tên SP, số lượng\n- Lọc được theo nhóm\n- Cập nhật real-time',
}
```

### 5.3 Schema chi tiết — UseCaseSpecTable

```js
// Dạng key-value dọc (render thành <table> 2 cột: field | value)
{
  id: 'UC-01',
  name: 'Tên use case',
  actor: 'Nhân viên / Quản lý...',
  precondition: 'Người dùng đã đăng nhập',
  description: 'Mô tả ngắn mục đích use case',
  mainFlow: [           // render dạng <ol>
    'Bước 1: ...',
    'Bước 2: ...',
    'Bước 3: ...',
  ],
  altFlow: [            // render dạng <ul>
    'Nếu X thì Y...',
  ],
  postcondition: 'Kết quả sau khi hoàn thành',
}
```

---

## 6. Thiết kế giao diện chi tiết

### 6.1 PageHero (Tiêu đề chính)
[py-12 bg-white]
[flex items-center justify-center max-w-6xl mx-auto px-6 gap-6]
- Line trái: `h-px bg-gray-300 flex-1`
- Text: `font-heading font-black text-3xl text-navy uppercase tracking-wide`
- Line phải: `h-px bg-gray-300 flex-1`

### 6.2 ProjectNavMenu (Project Cards Grid)
[bg-white pb-16 px-6]
[max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8]

Mỗi ProjectNavCard:
- Wrapper: `bg-white border border-gray-200 rounded-2xl p-8 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow`
- Title: `font-heading font-bold text-lg text-navy uppercase leading-snug mb-4`
- Mô tả (cardDesc): `font-body text-gray-600 text-[15px] leading-relaxed mb-8 flex-grow`
- Nút XEM THÊM: `self-end bg-navy text-white font-heading text-xs font-bold px-6 py-2.5 rounded-full hover:bg-navy/90 transition-colors` (Thẻ <a> gắn href="#p1" để cuộn xuống chi tiết).

### 6.3 ProjectHeader (navy bar)

```
- Container: `bg-navy text-white py-6 px-6 flex justify-center text-center`
- Text: `font-heading font-bold text-xl md:text-2xl uppercase tracking-wide`
- (Không còn badge số 01, 02)
```

### 6.4 OverviewBlock (Giới thiệu & Phạm vi)

```
- Grid 2 cột: `grid grid-cols-1 md:grid-cols-2 gap-8 py-8` (nếu chỉ có intro thì md:grid-cols-1).
- Mỗi thẻ (Card): `bg-white border border-gray-200 rounded-3xl p-8 shadow-sm`
- Tiêu đề thẻ: `font-heading font-bold text-navy text-lg uppercase mb-4`
- Nội dung: `font-body text-gray-700 leading-relaxed`
```

### 6.5 ImageBlock layouts

| Layout | Dùng khi | Tailwind |
|--------|----------|---------|
| `full` | 1 ảnh (swim lane, ERD to) | `max-w-5xl mx-auto` — ảnh `w-full object-contain` |
| `pair` | 2 ảnh cạnh nhau (use case, activity) | `grid grid-cols-1 md:grid-cols-2 gap-4` |
| `multi` | 3+ ảnh (ERD nhiều module) | `flex flex-col gap-6` — mỗi ảnh full width |

Mỗi ảnh bọc trong:
```
[rounded-xl border border-gray-200 overflow-hidden bg-white p-2 shadow-sm]
  <img src="..." class="w-full h-auto object-contain" />
  [caption nếu có: text-center text-xs text-gray-400 mt-2]
```

### 6.6 UserStoriesTable

```html
[overflow-x-auto]  ← wrapper, quan trọng cho mobile
  <table class="w-full border-collapse text-sm min-w-[700px]">
    <thead>
      <tr class="bg-orange-500 text-white">
        <th class="px-4 py-3 text-left font-heading text-xs tracking-wide">STT</th>
        ...
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-100 hover:bg-gray-50">
        <td class="px-4 py-3 text-gray-400 font-mono text-xs">US-01</td>
        ...
      </tr>
    </tbody>
  </table>
```

### 6.7 UseCaseSpecTable

```html
<!-- Mỗi spec = 1 bảng key-value dọc, 2 cột -->
<table class="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
  <tr>
    <td class="bg-gray-50 font-heading font-bold text-xs text-navy w-1/4 px-4 py-3 border-b border-r border-gray-200">
      Use Case ID
    </td>
    <td class="px-4 py-3 border-b border-gray-100 font-mono text-gray-600">UC-01</td>
  </tr>
  <tr>
    <td class="bg-gray-50 ...">Tên Use Case</td>
    <td class="...">Tên đầy đủ</td>
  </tr>
  <!-- mainFlow: render <ol class="list-decimal list-inside space-y-1"> -->
  <!-- altFlow: render <ul class="list-disc list-inside space-y-1"> -->
</table>
```

### 6.8 Section sub-heading pattern (dùng lại cho mọi loại section)

```jsx
<div className="mb-4">
  <p className="font-heading text-[10px] font-bold tracking-widest text-gray-400 uppercase">
    {heading}
  </p>
  <div className="h-px bg-gray-200 mt-1.5" />
</div>
```
### 6.9 CopyrightFooter
- Loại bỏ hoàn toàn khối hộp ContactFooter chứa Email, LinkedIn, Phone lớn màu Navy.
- Trang này CHỈ dùng một thanh nhỏ dưới cùng: Nền trắng, có viền trên (border-t border-gray-200), padding py-4 px-6.
- Bố cục flex justify-between: 
  + Bên trái: Text "2026 | Tran Khanh Huyen | Business Analyst" (text-gray-500).
  + Bên phải: Cụm 3 icon link (LinkedIn, Phone, Email) căn ngang.

---

## 7. Chiến lược Tài nguyên (Assets)

### 7.1 Cấu trúc thư mục

```
portfolio/
├── index.html
├── skills_systemdesign.html
├── avatar.jpg
└── assets/
    │
    │  ── Dự án 1 — The SHEA (theshea-*) ──
    ├── theshea-uc-lv1.png          ← Use Case Level 1 (size: 'md')
    ├── theshea-uc-lv2.png          ← Use Case Level 2
    ├── theshea-uc-lv3.png          ← Use Case Level 3
    ├── theshea-ucs.png             ← Use Case Specification
    ├── theshea-ad1.png             ← Activity Diagram 1
    ├── theshea-ad2.png             ← Activity Diagram 2
    │
    │  ── Dự án 2 — Yến Sào Nam An (naman-*) ──
    ├── naman-bpmn.png              ← Swim Lane (quy trình mua hàng)
    ├── naman-uc-lv1.png            ← Use Case Level 1 (size: 'md')
    ├── naman-uc-lv2.png            ← Use Case Level 2
    ├── naman-ucs.png               ← Use Case Specification
    ├── naman-ad1.png               ← Activity Diagram 1
    ├── naman-ad2.png               ← Activity Diagram 2
    ├── naman-erd.png               ← ERD
    │
    │  ── Dự án 3 — Wonder Wood (wonderwood-*) ──
    ├── wonderwood-bpmn.png         ← Swim Lane (quy trình quản lý bán hàng)
    ├── wonderwood-uc-lv1.png       ← Use Case Level 1 (size: 'md')
    ├── wonderwood-uc-lv2.png       ← Use Case Level 2
    ├── wonderwood-ucs.png          ← Use Case Specification
    ├── wonderwood-ad1.png          ← Activity Diagram 1
    ├── wonderwood-ad2.png          ← Activity Diagram 2
    ├── wonderwood-erd.png          ← ERD
    │
    │  ── Dự án 4 — Singapore Yummy (yummy-*) ──
    ├── yummy-bpmn.png            ← Swim Lane (quy trình kinh doanh)
    ├── yummy-uc-lv1.png          ← Use Case Level 1 (size: 'md')
    ├── yummy-ucs.png             ← Use Case Specification
    ├── yummy-ad1.png             ← Activity Diagram 1
    ├── yummy-ad2.png             ← Activity Diagram 2
    ├── yummy-erd1.png            ← ERD Tổng quan
    ├── yummy-erd2.png            ← ERD Module Đặt hàng
    └── yummy-erd3.png            ← ERD Module Nhà sỹ
```

**Tổng:** 27 file ảnh cần cắt từ mockup gốc.

### 7.2 Phân loại render

| Loại nội dung | Render bằng | Lý do |
|---------------|-------------|-------|
| GIỚI THIỆU / PHẠM VI | `<TextBlock>` — HTML text | Dễ cập nhật, không mất chất lượng |
| USER STORIES | `<UserStoriesTable>` — `<table>` HTML | Cấu trúc dạng text, searchable, responsive |
| USE CASE SPECIFICATION | `<UseCaseSpecTable>` — `<table>` HTML | Nhiều trường, text dài, dễ bảo trì |
| Swim Lane Diagram | `<ImageBlock>` — `<img>` | Biểu đồ quy trình phức tạp |
| Use Case Diagram | `<ImageBlock>` — `<img>` | Sơ đồ UML |
| Activity Diagram | `<ImageBlock>` — `<img>` | Sơ đồ UML |
| ERD | `<ImageBlock>` — `<img>` | Sơ đồ phức tạp, nhiều entity |

---

## 8. Các bước thực thi

### Bước 1 — Chuẩn bị file và assets *(thủ công)*
- Tạo file `skills_systemdesign.html` (rỗng)
- Tạo thư mục `assets/`
- Cắt từng ảnh diagram từ mockup, đặt tên theo quy ước `p{n}-{type}-{index}.png`
- Lưu vào `assets/`

### Bước 2 — Khung HTML + CDN
- Copy `<head>` từ `index.html` (CDN, Tailwind config, Google Fonts, CSS rules)
- Thêm CSS bổ sung: `section[id] { scroll-margin-top: 80px }`
- Cập nhật `<title>`: "Thiết Kế Hệ Thống — Trần Khánh Huyền"

### Bước 3 — Copy shared code từ index.html
- Copy nguyên: tất cả icon SVG (`IconLinkedIn`, `IconMail`, `IconPhone`, `IconArrowUpRight`, `IconMenu`, `IconClose`, `ContactColIcon`)
- Copy nguyên: `LangToggle`, `Header` (chỉ sửa logo `href` thành `./index.html`)
- Copy nguyên: `ContactFooter` + phần CONTENT `contact` (vi + en)

### Bước 4 — Khai báo data object PROJECTS
- Viết mảng `PROJECTS` với 4 object đầy đủ theo schema trên
- Điền nội dung thực tế cho `intro.paragraphs` và `scope.paragraphs`
- Điền đầy đủ `rows[]` cho User Stories và `specs[]` cho Use Case Spec
- Paths ảnh dùng `./assets/pX-type-N.png`

### Bước 5 — PageHero + ProjectNavMenu
- Xây dựng `PageHero`: h1 tiêu đề + nút back
- Xây dựng `ProjectNavCard`: badge số, tên ngắn, arrow icon, hover + active style
- Xây dựng `ProjectNavMenu`: grid 2×2, nhận `activeProject` để highlight

### Bước 6 — ProjectSection + ProjectHeader + SectionBlock dispatcher
- `ProjectSection`: `<section id="pX">` với scroll-margin-top
- `ProjectHeader`: navy bar, badge số, tên đầy đủ
- `SectionBlock`: switch/if theo `type` → dispatch đúng component

### Bước 7 — TextBlock + ImageBlock
- `TextBlock`: section sub-heading pattern + `paragraphs.map()`
- `ImageBlock`: xử lý 3 layout (`full`, `pair`, `multi`)
- Thêm fallback placeholder khi ảnh chưa có: `onError` → hiển thị khung xám + tên file

### Bước 8 — UserStoriesTable
- Render `<table>` với header cam `bg-orange-500`
- Wrapper `overflow-x-auto` cho responsive mobile
- `min-w-[700px]` để bảng không bị vỡ trên màn hình nhỏ

### Bước 9 — UseCaseSpecTable
- Render dạng key-value dọc: 2-cột table
- `mainFlow` → `<ol class="list-decimal">`, `altFlow` → `<ul class="list-disc">`
- Nếu 1 dự án có nhiều spec → render nhiều bảng liên tiếp, cách nhau `mt-6`

### Bước 10 — App root + scroll state + ReactDOM
- Khai báo `useState` cho `lang`, `activeSection`, `activeProject`
- `useEffect` scroll listener cho `activeProject`
- `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`

### Bước 11 — Kiểm tra & tinh chỉnh *(thủ công)*
- Double-click `skills_systemdesign.html` → kiểm tra render
- Click 4 project cards → scroll mượt đến đúng section
- Active card highlight thay đổi khi scroll qua từng project
- Toggle VI ↔ EN (Header nav + Footer)
- Thay placeholder images bằng ảnh thực từ `assets/`
- Kiểm tra responsive 375px: bảng có horizontal scroll, ảnh không overflow

---

## 9. Danh sách assets cần cắt *(Checklist)*

### Dự án 1 — The SHEA (`theshea-*`)
- [ ] `theshea-uc-lv1.png` — Use Case Level 1
- [ ] `theshea-uc-lv2.png` — Use Case Level 2
- [ ] `theshea-uc-lv3.png` — Use Case Level 3
- [ ] `theshea-ucs.png` — Use Case Specification
- [ ] `theshea-ad1.png` — Activity Diagram 1
- [ ] `theshea-ad2.png` — Activity Diagram 2

### Dự án 2 — Yến Sào Nam An (`naman-*`)
- [ ] `naman-bpmn.png` — Swim Lane (Quy trình mua hàng)
- [ ] `naman-uc-lv1.png` — Use Case Level 1
- [ ] `naman-uc-lv2.png` — Use Case Level 2
- [ ] `naman-ucs.png` — Use Case Specification
- [ ] `naman-ad1.png` — Activity Diagram 1
- [ ] `naman-ad2.png` — Activity Diagram 2
- [ ] `naman-erd.png` — ERD

### Dự án 3 — Wonder Wood (`wonderwood-*`)
- [ ] `wonderwood-bpmn.png` — Swim Lane (Quy trình quản lý bán hàng)
- [ ] `wonderwood-us1.png` — User Stories ảnh 1
- [ ] `wonderwood-us2.png` — User Stories ảnh 2
- [ ] `wonderwood-uc-lv1.png` — Use Case Level 1 (size: 'sm')
- [ ] `wonderwood-uc-lv2.png` — Use Case Level 2
- [ ] `wonderwood-ucs1.png` — Use Case Specification ảnh 1
- [ ] `wonderwood-ucs2.png` — Use Case Specification ảnh 2
- [ ] `wonderwood-ad1.png` — Activity Diagram 1
- [ ] `wonderwood-ad2.png` — Activity Diagram 2
- [ ] `wonderwood-erd.png` — ERD

### Dự án 4 — Singapore Yummy (`yummy-*`)
- [ ] `yummy-bpmn.png` — Swim Lane (Quy trình kinh doanh)
- [ ] `yummy-us1.png` — User Stories ảnh 1
- [ ] `yummy-us2.png` — User Stories ảnh 2
- [ ] `yummy-uc-lv1.png` — Use Case Level 1 (size: 'sm')
- [ ] `yummy-ucs1.png` — Use Case Specification ảnh 1
- [ ] `yummy-ucs2.png` — Use Case Specification ảnh 2
- [ ] `yummy-ad1.png` — Activity Diagram 1
- [ ] `yummy-ad2.png` — Activity Diagram 2
- [ ] `yummy-erd1.png` — ERD Tổng quan
- [ ] `yummy-erd2.png` — ERD Module Đặt hàng
- [ ] `yummy-erd3.png` — ERD Module Nhà sỹ

---

## 10. Rủi ro & Giải pháp

| Rủi ro | Giải pháp |
|--------|-----------|
| Bảng User Stories / Use Case Spec quá rộng trên mobile | `overflow-x-auto` wrapper + `min-w-[700px]` trên table |
| ERD dự án 4 rất phức tạp, khó nhìn | `object-contain` giữ tỉ lệ + có thể thêm link "Mở ảnh lớn" (`target="_blank"`) |
| Swim Lane dạng landscape rất dài | `max-w-6xl mx-auto overflow-x-auto` — cho phép scroll ngang ảnh |
| Use Case Spec nhiều trường, text dài | Có thể bổ sung accordion collapse nếu cần (bước tùy chọn sau) |
| File HTML dài (4 dự án đầy đủ) | Chấp nhận — single file portfolio, tải một lần, không ảnh hưởng UX |
| Babel compile chậm với file lớn | Dùng `React.memo` trên ProjectSection để giảm re-render khi toggle lang |

---

## 11. Xác minh hoàn thành

1. `Double-click skills_systemdesign.html` → trang load, font đúng, layout đúng
2. Header logo → click → về `index.html`
3. Click 4 project nav cards → scroll mượt, đến đúng section
4. Scroll qua từng project → card nav highlight đúng
5. Toggle VI ↔ EN → nav labels và footer thay đổi ngôn ngữ
6. Tất cả ảnh diagram load (không broken image)
7. Bảng User Stories: header cam, cột đúng, không vỡ layout
8. Bảng Use Case Spec: key-value rõ ràng, mainFlow dạng danh sách số
9. DevTools 375px → bảng có horizontal scroll, không overflow
10. Nút "XEM THÊM" trong `index.html` dẫn đúng vào trang này
