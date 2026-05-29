# Kế hoạch xây dựng trang `skills_uiuxdesign.html`

## 1. Phân tích thiết kế từ ảnh `7.png`

### 1.1 Cấu trúc tổng thể trang

```
<Header> (sticky, giống hệt skills_systemdesign.html)
<PageHero>  — tiêu đề "THIẾT KẾ UI/UX" căn giữa với 2 đường kẻ
<ProjectNavMenu> — lưới 2×2, 4 card dự án
<ProjectSection p1> — Singapore Yummy
<ProjectSection p2> — Nam An
<ProjectSection p3> — Wonder Wood
<ProjectSection p4> — The SHEA
<CopyrightFooter> (giống hệt skills_systemdesign.html)
```

### 1.2 Cấu trúc bên trong mỗi ProjectSection

```
<ProjectHeader>  — thanh nền navy, tên dự án căn giữa
<UXBlock>        — tiêu đề "UX DESIGN" + ảnh banner + nút PROTOTYPE
<UIBlock>        — tiêu đề "UI DESIGN" + lưới ảnh màn hình thiết kế
```

---

## 2. Cấu trúc Component

### 2.1 Component kế thừa NGUYÊN VẸN từ `skills_systemdesign.html`

| Component | Ghi chú |
|---|---|
| `Header` | Copy nguyên, nav + lang toggle |
| `LangToggle` | Copy nguyên |
| `PageHero` | Copy nguyên, chỉ thay `pageTitle` trong SHARED |
| `ProjectNavCard` + `ProjectNavMenu` | Copy nguyên, lưới 2×2 |
| `ProjectHeader` | Copy nguyên, thanh navy căn giữa |
| `CopyrightFooter` | Copy nguyên |
| `DiagramImage` (đổi tên → `MockupImage`) | Tái sử dụng logic fallback, **xoá toàn bộ `rounded-*`** khỏi `<img>` và placeholder `<div>` |
| Tất cả Icons (LinkedIn, Mail, Phone, Menu, Close, ImagePlaceholder) | Copy nguyên |

> **Lưu ý:** Tailwind config (màu `navy`, `lavender`, `lav-bg`; font `heading`, `body`) và Google Fonts link kế thừa nguyên si.

---

### 2.2 Component MỚI — `UXBlock`

**Chức năng:** Hiển thị phần UX Design gồm heading, ảnh banner, và nút dẫn ra Figma.

```
UXBlock
 ├── <p> "UX DESIGN"  — heading uppercase navy, font-heading extrabold
 ├── <MockupImage>    — ảnh banner lớn, layout full-width, không bo góc
 └── <a href={prototypeHref}>
       "PROTOTYPE"    — pill button nền navy, text trắng, căn giữa
```

**Quy tắc styling nút PROTOTYPE:**
- `font-heading font-bold tracking-widest uppercase`
- `bg-navy text-white rounded-full px-8 py-2.5`
- `inline-flex items-center gap-2` (kèm icon mũi tên chéo ↗ nhỏ)
- Container: `flex justify-center mt-5`
- `target="_blank" rel="noopener noreferrer"`

---

### 2.3 Component MỚI — `UIBlock`

**Chức năng:** Hiển thị lưới ảnh màn hình UI với layout thích nghi theo loại màn hình.

**Hai chế độ layout (điều khiển bởi field `uiLayout` trong data):**

| `uiLayout` | Dùng khi | Tailwind class |
|---|---|---|
| `'mobile'` | Màn hình **Mobile** (dọc, hẹp) — The SHEA | `grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3` |
| `'desktop'` | Màn hình **Desktop** (ngang, rộng) — Nam An, Wonder Wood, Singapore Yummy | `grid-cols-1 sm:grid-cols-2 gap-5` |

**Quy tắc styling ảnh:**
- `MockupImage` được dùng lại — **TUYỆT ĐỐI KHÔNG có `rounded-*`** trên ảnh thực tế
- Không có caption dưới mỗi ảnh UI (khác với SystemDesign)
- Có border mỏng `border border-gray-200 bg-white` để ảnh nổi bật trên nền trắng

---

### 2.4 Component `SectionBlock` (dispatcher)

```js
function SectionBlock({ data }) {
  if (data.type === 'ux') return <UXBlock data={data} />;
  if (data.type === 'ui') return <UIBlock data={data} />;
  return null;
}
```

---

### 2.5 Component `ProjectSection`

Giống hệt `skills_systemdesign.html`: bọc `ProjectHeader` + danh sách `SectionBlock` trong card `rounded-xl overflow-hidden border border-gray-200 shadow-sm`.

---

## 3. Cấu trúc Dữ liệu mẫu — Object `PROJECTS`

### 3.1 Schema một dự án

```js
{
  id:         'p1',          // p1 → p4 theo thứ tự hiển thị mới
  shortTitle: '...',         // tên ngắn cho nav card
  fullTitle:  '...',         // tên đầy đủ cho ProjectHeader (navy bar)
  cardDesc:   '...',         // mô tả ngắn trên nav card
  sections: [
    {
      type:          'ux',
      heading:       'UX DESIGN',          // hoặc 'UX DESIGN' (EN giống nhau)
      bannerSrc:     './assets/yummy0.png',
      bannerAlt:     '...',
      prototypeHref: 'https://www.figma.com/proto/NRuushQ45tYzRi72LHbkEo/Yummy?node-id=1412-72506&p=f&t=61rOmjiGgHpBDyLm-0&scaling=min-zoom&content-scaling=fixed&page-id=718%3A50376&starting-point-node-id=1412%3A72506&show-proto-sidebar=1',
    },
    {
      type:      'ui',
      heading:   'UI DESIGN',
      uiLayout:  'desktop',                // 'mobile' | 'desktop'
      images: [
        { src: './assets/yummy1.png', alt: 'UI Screen 1' },
        { src: './assets/yummy2.png', alt: 'UI Screen 2' },
        // ...
      ],
    },
  ],
}
```

### 3.2 Quy ước đặt tên asset

| Dự án | Prefix | Ví dụ |
|---|---|---|
| Singapore Yummy | `yummy` | `yummy0.png`, `yummy1.png` |
| Yến Sào Nam An | `naman` | `uiux-naman-banner.png`, `naman1.png` |
| Wonder Wood | `ww-` | `ww0.png`, `ww01.png` |
| The SHEA | `theshea` | `theshea0.png`, `theshea01.png` |

Tất cả asset đặt trong thư mục `./assets/`.

### 3.3 Object SHARED (cập nhật từ SystemDesign)

```js
const SHARED = {
  vi: {
    nav: [
      { label: 'TRANG CHỦ', href: './index.html#home'    },
      { label: 'KỸ NĂNG',   href: './index.html#skills'  },
      { label: 'LIÊN HỆ',   href: './index.html#contact' },
    ],
    pageTitle:      'THIẾT KẾ UI/UX',
    viewMore:       'XEM THÊM',
    prototype:      'PROTOTYPE',
    copyright:      '2026 | Tran Khanh Huyen | Business Analyst',
    footerLinkedIn: { name: 'Khanh Huyen Tran', href: 'https://www.linkedin.com/in/khanh-huyen-tran-16b728317/' },
    footerPhone:    { value: '+84915 085 900',   href: 'tel:+84915085900' },
    footerEmail:    { value: 'tkhuyen1714@gmail.com', href: 'mailto:tkhuyen1714@gmail.com' },
  },
  en: {
    nav: [
      { label: 'HOME',    href: './index.html#home'    },
      { label: 'SKILLS',  href: './index.html#skills'  },
      { label: 'CONTACT', href: './index.html#contact' },
    ],
    pageTitle:      'UI/UX DESIGN',
    viewMore:       'VIEW MORE',
    prototype:      'PROTOTYPE',
    copyright:      '2026 | Tran Khanh Huyen | Business Analyst',
    footerLinkedIn: { name: 'Khanh Huyen Tran', href: 'https://www.linkedin.com/in/khanh-huyen-tran-16b728317/' },
    footerPhone:    { value: '+84915 085 900',   href: 'tel:+84915085900' },
    footerEmail:    { value: 'tkhuyen1714@gmail.com', href: 'mailto:tkhuyen1714@gmail.com' },
  },
};
```

### 3.4 PROJECTS — Phác thảo dữ liệu đầy đủ (VI)

**Thứ tự hiển thị: p1=Singapore Yummy, p2=Nam An, p3=Wonder Wood, p4=The SHEA**

#### p1 — Singapore Yummy

```js
{
  id:         'p1',
  shortTitle: 'HỆ THỐNG ERP CHO THƯƠNG HIỆU TÀU HŨ SINGAPORE YUMMY',
  fullTitle:  'HỆ THỐNG ERP CHO THƯƠNG HIỆU TÀU HŨ SINGAPORE YUMMY',
  cardDesc:   'Thiết kế UX/UI cho hệ thống ERP module Sản xuất & Nhân sự của Singapore Yummy, bao gồm prototype tương tác và bộ màn hình giao diện hoàn chỉnh.',
  sections: [
    {
      type:          'ux',
      heading:       'UX DESIGN',
      bannerSrc:     './assets/yummy0.png',
      bannerAlt:     'UX Design — Singapore Yummy',
      prototypeHref: '#',  // Điền link Figma thực tế
    },
    {
      type:      'ui',
      heading:   'UI DESIGN',
      uiLayout:  'desktop',
      images: [
        { src: './assets/yummy1.png',  alt: 'UI Screen 1' },
        { src: './assets/yummy2.png',  alt: 'UI Screen 2' },
        { src: './assets/yummy3.png',  alt: 'UI Screen 3' },
        { src: './assets/yummy4.png',  alt: 'UI Screen 4' },
      ],
    },
  ],
}
```

#### p2 — Yến Sào Nam An

```js
{
  id:         'p2',
  shortTitle: 'HỆ THỐNG ERP YẾN SÀO NAM AN — CÔNG TY TNHH NAM VIỆT PHƯƠNG',
  fullTitle:  'HỆ THỐNG ERP YẾN SÀO NAM AN — CÔNG TY TNHH NAM VIỆT PHƯƠNG',
  cardDesc:   'Thiết kế UX/UI cho module Tài chính của hệ thống ERP Nam An, bao gồm prototype tương tác Figma và bộ màn hình giao diện desktop.',
  sections: [
    {
      type:          'ux',
      heading:       'UX DESIGN',
      bannerSrc:     './assets/naman0.png',
      bannerAlt:     'UX Design — Nam An',
      prototypeHref: '#',
    },
    {
      type:      'ui',
      heading:   'UI DESIGN',
      uiLayout:  'desktop',
      images: [
        { src: './assets/naman1.png', alt: 'UI Screen 1' },
        { src: './assets/naman2.png', alt: 'UI Screen 2' },
        { src: './assets/naman3.png', alt: 'UI Screen 3' },
        { src: './assets/naman4.png', alt: 'UI Screen 4' },
        // Thêm nếu cần
      ],
    },
  ],
}
```

#### p3 — Wonder Wood

```js
{
  id:         'p3',
  shortTitle: 'HỆ THỐNG ERP CHO CÔNG TY TNHH WONDER WOOD',
  fullTitle:  'HỆ THỐNG ERP CHO CÔNG TY TNHH WONDER WOOD',
  cardDesc:   'Thiết kế UX/UI cho module Bán hàng B2B của hệ thống ERP Wonder Wood, với prototype Figma và bộ màn hình desktop đầy đủ.',
  sections: [
    {
      type:          'ux',
      heading:       'UX DESIGN',
      bannerSrc:     './assets/ww0.png',
      bannerAlt:     'UX Design — Wonder Wood',
      prototypeHref: '#',
    },
    {
      type:      'ui',
      heading:   'UI DESIGN',
      uiLayout:  'desktop',
      images: [
        { src: './assets/ww1.png', alt: 'UI Screen 1' },
        { src: './assets/ww2.png', alt: 'UI Screen 2' },
        { src: './assets/ww3.png', alt: 'UI Screen 3' },
        { src: './assets/ww4.png', alt: 'UI Screen 4' },
      ],
    },
  ],
}
```

#### p4 — The SHEA

```js
{
  id:         'p4',
  shortTitle: 'HỆ THỐNG QUẢN LÝ VỊ TRÍ SẢN PHẨM TRÊN KỆ KHO VÀ CỬA HÀNG THE SHEA',
  fullTitle:  'HỆ THỐNG QUẢN LÝ VỊ TRÍ SẢN PHẨM TRÊN KỆ KHO VÀ CỬA HÀNG THE SHEA',
  cardDesc:   'Thiết kế UX/UI cho hệ thống quản lý vị trí sản phẩm The SHEA trên nền tảng Mobile, với bộ màn hình portrait hoàn chỉnh.',
  sections: [
    {
      type:          'ux',
      heading:       'UX DESIGN',
      bannerSrc:     './assets/theshea0.png',
      bannerAlt:     'UX Design — The SHEA',
      prototypeHref: '#',
    },
    {
      type:      'ui',
      heading:   'UI DESIGN',
      uiLayout:  'mobile',   // ← mobile portrait grid
      images: [
        { src: './assets/theshea1.png',  alt: 'Mobile Screen 1' },
        { src: './assets/theshea2.png',  alt: 'Mobile Screen 2' },
        { src: './assets/theshea3.png',  alt: 'Mobile Screen 3' },
        { src: './assets/theshea4.png',  alt: 'Mobile Screen 4' },
        { src: './assets/theshea5.png',  alt: 'Mobile Screen 5' },
        { src: './assets/theshea6.png',  alt: 'Mobile Screen 6' },
        { src: './assets/theshea7.png',  alt: 'Mobile Screen 7' },
        { src: './assets/theshea8.png',  alt: 'Mobile Screen 8' },
        // Thêm theo số màn hình thực tế
      ],
    },
  ],
}
```

---

## 4. Mapping chi tiết Component → Styling

### 4.1 `UXBlock` chi tiết

```
<div class="py-8">                                        ← section padding (đồng bộ ImageBlock)
  <p class="font-heading text-base font-extrabold
            tracking-normal text-navy uppercase mb-5">   ← heading "UX DESIGN"
    UX DESIGN
  </p>
  <MockupImage src={bannerSrc} alt={bannerAlt} />        ← ảnh full-width, không bo góc
  <div class="flex justify-center mt-6">
    <a href={prototypeHref} target="_blank"
       class="pill font-heading font-bold tracking-widest
              uppercase bg-navy text-white rounded-full
              px-8 py-2.5 inline-flex items-center gap-2
              hover:opacity-90 transition-all text-sm">
      {SHARED[lang].prototype}
      <IconArrowUpRight />                               ← icon mũi tên chéo nhỏ
    </a>
  </div>
</div>
```

### 4.2 `UIBlock` chi tiết

```
<div class="py-8">
  <p class="font-heading text-base font-extrabold
            tracking-normal text-navy uppercase mb-5">
    UI DESIGN
  </p>

  {/* uiLayout === 'desktop' */}
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
    {images.map(img => <MockupImage key={...} {...img} />)}
  </div>

  {/* uiLayout === 'mobile' */}
  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
    {images.map(img => <MockupImage key={...} {...img} />)}
  </div>
</div>
```

### 4.3 `MockupImage` (tương đương `DiagramImage` trong SystemDesign)

- Giữ nguyên logic fallback placeholder khi ảnh chưa có
- **Xóa hoàn toàn** `rounded-*` khỏi `<img>` và placeholder `<div>`
- Không có `caption` (khác với `DiagramImage`)
- Class ảnh: `w-full h-auto object-contain border border-gray-200 bg-white`

### 4.4 Icon mới cần thêm — `IconArrowUpRight`

```jsx
const IconArrowUpRight = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" stroke="currentColor"
       strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
);
```

---

## 5. Cấu trúc file `skills_uiuxdesign.html`

```
<!DOCTYPE html>
<html lang="vi" class="scroll-smooth">
<head>
  <!-- CDN: Tailwind, React 18, Babel (giống hệt skills_systemdesign.html) -->
  <!-- tailwind.config: navy, lavender, lav-bg, font-heading, font-body -->
  <!-- Google Fonts: Plus Jakarta Sans + Nunito Sans -->
  <!-- <style>: box-sizing, scroll-margin-top: 80px, .pill:active -->
  <title>Thiết Kế UI/UX — Trần Khánh Huyền</title>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;

    // 1. SHARED   — nav, pageTitle, viewMore, prototype, footer
    // 2. PROJECTS — { vi: [p1..p4], en: [p1..p4] }
    // 3. Icons    — LinkedIn, Mail, Phone, Menu, Close, ImagePlaceholder, ArrowUpRight
    // 4. LangToggle
    // 5. Header
    // 6. PageHero
    // 7. ProjectNavCard + ProjectNavMenu
    // 8. MockupImage (fallback, không bo góc, không caption)
    // 9. UXBlock
    // 10. UIBlock
    // 11. SectionBlock (dispatcher: ux → UXBlock, ui → UIBlock)
    // 12. ProjectHeader
    // 13. ProjectSection
    // 14. CopyrightFooter
    // 15. App  (useState lang; const projects = PROJECTS[lang])
    // 16. ReactDOM.createRoot('#root').render(<App />)
  </script>
</body>
</html>
```

---

## 6. Các bước thực thi

### Bước 1 — Khung HTML + config
- Copy toàn bộ phần `<head>` từ `skills_systemdesign.html`
- Cập nhật `<title>` thành `Thiết Kế UI/UX — Trần Khánh Huyền`

### Bước 2 — SHARED + PROJECTS data
- Viết object `SHARED` với `pageTitle: 'THIẾT KẾ UI/UX'` / `'UI/UX DESIGN'` và thêm field `prototype`
- Viết object `PROJECTS { vi, en }` đầy đủ 4 dự án theo thứ tự mới (Yummy → Nam An → Wonder Wood → SHEA)
- Điền placeholder `prototypeHref: '#'` để hoàn thiện link sau khi có URL Figma thực tế

### Bước 3 — Icons + LangToggle + Header
- Copy nguyên từ `skills_systemdesign.html`
- Thêm `IconArrowUpRight` mới

### Bước 4 — PageHero + ProjectNavMenu
- Copy nguyên từ `skills_systemdesign.html` (đọc `SHARED[lang].pageTitle` tự động trả về đúng tiêu đề)

### Bước 5 — MockupImage
- Copy `DiagramImage` từ `skills_systemdesign.html`
- Đổi tên thành `MockupImage`
- Xóa `rounded-xl overflow-hidden` hoặc bất kỳ `rounded-*` nào còn sót
- Loại bỏ phần render `caption` (không cần cho UI screens)

### Bước 6 — UXBlock
- Viết component mới theo spec mục 4.1
- Đọc `prototypeHref`, `bannerSrc`, `bannerAlt`, `heading` từ `data`
- Nút PROTOTYPE nhận `SHARED[lang].prototype` từ props `lang`

### Bước 7 — UIBlock
- Viết component mới theo spec mục 4.2
- Điều kiện render grid dựa trên `data.uiLayout`

### Bước 8 — SectionBlock + ProjectHeader + ProjectSection
- Copy `ProjectHeader` và `ProjectSection` nguyên từ `skills_systemdesign.html`
- Viết `SectionBlock` dispatcher mới (chỉ có 2 type: `ux`, `ui`)
- Truyền `lang` xuống `UXBlock` để đọc label nút Prototype

### Bước 9 — CopyrightFooter + App root
- Copy `CopyrightFooter` nguyên
- Viết `App`: `useState('vi')`, `const projects = PROJECTS[lang]`, render tuần tự các component
- `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`

### Bước 10 — Kiểm tra & tinh chỉnh
- Mở file trực tiếp bằng trình duyệt (double-click)
- Kiểm tra toggle VI ↔ EN — toàn bộ text chuyển đúng
- Kiểm tra nút PROTOTYPE mở đúng link Figma trong tab mới
- Kiểm tra ảnh placeholder hiển thị đúng khi chưa có asset
- Kiểm tra responsive: mobile lưới 3 cột, desktop lưới 2 cột
- Kiểm tra không có `rounded-*` trên bất kỳ ảnh nào

---

## 7. Rủi ro & giải pháp dự phòng

| Rủi ro | Giải pháp |
|---|---|
| Số lượng ảnh UI thực tế khác với kế hoạch | Field `images` là mảng động, thêm/bớt phần tử tự do |
| Link Figma chưa có | Để `prototypeHref: '#'` tạm, điền sau |
| Ảnh mobile portrait quá nhỏ trên màn hình lớn | Thêm `max-w-5xl mx-auto` bao ngoài grid mobile |
| Ảnh desktop 2 cột quá rộng | Grid tự co giãn, có thể thêm `max-w-6xl mx-auto` |
| `uiLayout` chưa đủ cho layout đặc biệt | Có thể mở rộng thêm giá trị `'mixed'` sau khi có đủ asset |
