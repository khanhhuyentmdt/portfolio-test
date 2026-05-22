# Kế hoạch xây dựng Portfolio Website — index.html

## Context

Xây dựng một trang portfolio cá nhân dạng SPA (Single Page Application) cho **Trần Khánh Huyền — Business Analyst**. Toàn bộ ứng dụng nằm trong một file `index.html` duy nhất, chạy trực tiếp từ `file://` mà không cần server. Stack không có build step: React qua CDN, Babel in-browser, Tailwind Play CDN.

---

## 1. Phân tích cấu trúc Component

```
<App>
 ├── <Header>
 │    ├── <Logo>          — Tên + chức danh bên trái
 │    ├── <NavMenu>       — Các nút: Trang chủ | Kỹ năng | Liên hệ (Click để scroll)
 │    └── <LangToggle>    — Nút VI / EN
 │
 ├── <HeroSection>        — Hero: ảnh trái + thông tin phải + Download CV (id="home")
 ├── <SkillsSection>      — Danh sách 5 thẻ (card) kỹ năng chi tiết (id="skills")
 └── <ContactFooter>      — Section Liên hệ nền Navy + Copyright (id="contact")
```

### Chi tiết từng component

| Component | Trách nhiệm | Props nhận |
|---|---|---|
| `Header` | Render logo, nav, lang toggle | `activeTab`, `setActiveTab`, `lang`, `setLang` |
| `NavMenu` | Render các nút tab | `activeTab`, `setActiveTab`, `lang` |
| `LangToggle` | Nút VI/EN | `lang`, `setLang` |
| `HomeSection` | Hero layout 2 cột | `lang` |
| `SkillsSection` | Grid tags + nút xem thêm | `lang` |
| `AboutSection` | Văn bản giới thiệu | `lang` |
| `ContactSection` | Thông tin liên hệ | `lang` |

---

## 2. Giải pháp quản lý State và Scroll

Dùng `React.useState` thuần cho đa ngôn ngữ. Giao diện hiển thị dạng One-page scroll:

```js
// Trong <App> (root component)
const [lang, setLang] = React.useState('vi');
```

- `setActiveTab` truyền xuống `NavMenu` qua props
- Không có router, không hash URL — đủ cho yêu cầu portfolio tĩnh
- Khi `lang` thay đổi, tất cả component re-render với nội dung mới từ object `CONTENT`

---

## 3. Phương pháp xử lý tài nguyên — Đường dẫn tương đối

Vì chạy từ `file://`, không có server gốc (`/`). Cần dùng đường dẫn tương đối thuần túy.

### Ảnh đại diện

```jsx
// Đúng — tương đối, cùng thư mục
<img src="avatar.png" alt="Trần Khánh Huyền" />

// Sai — tuyệt đối sẽ fail khi mở file://
<img src="/avatar.png" />
```

### CDN Links (dùng HTTPS, không cần local)

```html
<!-- Tailwind Play CDN -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- React + ReactDOM -->
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

<!-- Babel standalone (biên dịch JSX trên browser) -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

### Script JSX phải khai báo type đúng

```html
<script type="text/babel">
  // Toàn bộ React component ở đây
</script>
```

---

## 4. Đa ngôn ngữ (VI / EN)

Dùng một object `CONTENT` tập trung:

```js
const CONTENT = {
  vi: {
    nav: ['Trang chủ', 'Kỹ năng', 'Liên hệ'],
    hero: {
      // Giữ nguyên như cũ...
    },
    skillsData: [
      {
        title: 'THIẾT KẾ HỆ THỐNG',
        tags: ['User Story', 'BPMN', 'Use Case', 'Activity Diagram', 'Use Case Specification'],
        desc: 'Tiếp cận thiết kế hệ thống theo hướng có cấu trúc...',
        hasButton: true
      },
      {
        title: 'THIẾT KẾ UI/UX',
        tags: ['Figma'],
        desc: 'Thiết kế prototype UI/UX trên Figma giúp mô phỏng thao tác...',
        hasButton: true
      },
      {
        title: 'VIBE CODING',
        tags: [],
        desc: 'Với nền tảng tài liệu phân tích đã được xây dựng...',
        hasButton: false
      },
      // Thêm tiếp cho "Khởi gợi yêu cầu" và "Agile/Scrum"
    ],
    contact: {
      title: 'LIÊN HỆ',
      copyright: '2026 | Tran Khanh Huyen | Business Analyst'
      footerLinks: {
        linkedin: 'Khanh Huyen Tran',
        phone: '+84915 085 900',
        email: 'tkhuyen1714@gmail.com'
      }
    }
  },
  // Khai báo tương tự cho phần 'en'
};
```

Mỗi component nhận `lang` prop và truy cập `CONTENT[lang].*`.

---

## 5. Thiết kế giao diện — Mapping từ homepage.png

### Màu sắc (Tailwind custom config)

| Vai trò | Màu | Class gợi ý |
|---|---|---|
| Navy chính | `#000046` | `bg-navy` / `text-navy` |
| Lavender nhạt | `#c9c4e0` | `bg-lavender` |
| Nền trang | Trắng | `bg-white` |

**Bổ sung thêm quy tắc Font:**
- **Tiêu đề (Headings, Logo, Tên, Title các thẻ):** Sử dụng font `Plus Jakarta Sans`.
- **Nội dung (Đoạn văn, Mô tả, Tags):** Sử dụng font `Nunito Sans`.

### Header layout

```
[TRẦN KHÁNH HUYỀN / BUSINESS ANALYST]  [Menu...] [VI | EN]
```
- `flex justify-between items-center`
- Nền trắng (bg-white), text màu navy (text-navy), có thể thêm border-b mỏng.
- NavMenu dùng `flex gap-6`; tab active có underline hoặc text đậm.

### Hero Section layout (HomeSection)

```
[Ảnh — lavender bg rounded]   [Tên lớn]
                               [LinkedIn] [Email] [SĐT]  ← pill buttons
                               [Đoạn giới thiệu]
                               [DOWNLOAD CV]
```
- `grid grid-cols-2 gap-8 items-center`
- Ảnh: `rounded-2xl`, nền lavender, `object-cover`
- Buttons liên hệ: `border rounded-full px-4 py-1 text-sm`
- CV button: `bg-slate-900 text-white rounded-full px-6 py-2`

### Skills Section

- Dùng cấu trúc Card (thẻ): Mỗi thẻ có border, rounded-xl, p-6, nền trắng.

- Header của thẻ: flex justify-between items-center (chứa Tiêu đề và nút XEM THÊM nền Navy).

- Tags bên trong thẻ: border border-gray-400 rounded-full text-sm.

- Description: text-gray-600 mt-4.

### Contact Section

### Contact Section

- Container chính: bg-navy text-white py-12 px-8.
- Tiêu đề "LIÊN HỆ": Căn giữa, text màu trắng, font Outfit, margin-bottom lớn.
- Khối thông tin liên hệ (Card): 
  - Là một thẻ div duy nhất: Bo góc (rounded-xl), nền dạng kính hoặc màu sáng hơn navy một chút (ví dụ: bg-white/10), có viền mỏng (border border-white/20).
  - Bố cục bên trong: Grid 3 cột (grid-cols-3), sử dụng `divide-x divide-white/20` để tạo đường kẻ dọc mỏng ngăn cách giữa 3 cột.
  - Layout từng cột (padding p-6): 
    - Top: Flex justify-between. Chứa Icon đại diện bên trái và Icon mũi tên chéo (↗) bên phải (kích thước nhỏ, màu trắng mờ).
    - Bottom (margin-top): Nhãn (EMAIL, LINKEDIN, PHONE) viết hoa, text nhỏ màu xám nhạt (text-gray-300). Ngay bên dưới là giá trị thông tin text màu trắng.
- Thanh bản quyền dưới cùng: Nền trắng, text màu navy đậm. Dùng `flex justify-between items-center`. Bên trái là text copyright. Bên phải là cụm 3 thông tin (LinkedIn, Phone, Email) xếp ngang có kèm icon.

---

## 6. Cấu trúc file index.html

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Trần Khánh Huyền — Portfolio</title>

  <!-- CDN: Tailwind -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- CDN: React 18 -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>

  <!-- CDN: Babel -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Tailwind custom config (màu, font) -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { navy: '#000046', lavender: '#c9c4e0' },
          fontFamily: { 
            heading: ['Plus Jakarta Sans', 'sans-serif'], 
            body: ['Nunito Sans', 'sans-serif'] 
          },
        },
      },
    };
  </script>

  <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,600&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="bg-white">
  <div id="root"></div>
  <script type="text/babel">
</head>
<html lang="vi" class="scroll-smooth">
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // 1. CONTENT object (VI + EN)
    // 2. Component definitions
    // 3. App root với useState
    // 4. ReactDOM.createRoot('#root').render(<App />)
  </script>
</body>
</html>
```

---

## 7. Danh sách các bước thực hiện

### Bước 1 — Khung HTML cơ bản
- Tạo file `portfolio/index.html`
- Thêm tất cả CDN tags (Tailwind, React, ReactDOM, Babel)
- Cấu hình `tailwind.config` với màu custom navy + lavender
- Thêm Google Fonts Inter

### Bước 2 — Object dữ liệu CONTENT
- Viết object `CONTENT` với đầy đủ key VI và EN
- Bao gồm: nav labels, hero text, skills tags, about text, contact info

### Bước 3 — Component Header
- Logo: tên + chức danh (trái)
- NavMenu: map qua CONTENT[lang].nav, gán href tương ứng (#home, #skills, #contact) để kích hoạt tính năng scroll smooth".
- LangToggle: hai nút VI / EN

### Bước 4 — HomeSection (Hero)
- Layout 2 cột (grid)
- Cột trái: `<img src="avatar.png" />` với container lavender
- Cột phải: tên, pill buttons (LinkedIn/Email/Phone), intro, Download CV button

### Bước 5 — SkillsSection (Render danh sách Card)
- Map qua mảng CONTENT[lang].skillsData, render thành các khối card chứa title, tags (nếu có), description và nút bấm.

### Bước 6 — ContactFooter
- Xây dựng khối background xanh Navy chia 3 cột thông tin chính.
- Xây dựng thanh bản quyền (copyright bar) ở dưới cùng: Nền trắng, flex ngang. Bên trái hiển thị chữ bản quyền, bên phải hiển thị LinkedIn, số điện thoại và Email kèm icon.

### Bước 7 — App root + State
- App component: khai báo lang. Render tuần tự <Header>, <HeroSection>, <SkillsSection>, <ContactFooter>.
- Render `<Header>` + điều kiện render section theo `activeTab`
- `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`

### Bước 8 — Responsive cơ bản
- Header: ẩn NavMenu trên mobile, dùng hamburger nếu cần
- Hero: chuyển từ `grid-cols-2` sang `grid-cols-1` trên `sm:`
- Skills: `flex-wrap` đã đủ responsive

### Bước 9 — Kiểm tra & tinh chỉnh
- Mở `index.html` trực tiếp bằng trình duyệt (double-click)
- Kiểm tra ảnh `homepage.png` load đúng (relative path)
- Kiểm tra chuyển tab không reload
- Kiểm tra chuyển ngôn ngữ VI ↔ EN
- Kiểm tra trên mobile (DevTools responsive mode)

---

## 8. Rủi ro & giải pháp dự phòng

| Rủi ro | Giải pháp |
|---|---|
| Babel compile chậm (in-browser) | Chấp nhận — portfolio nhỏ, không ảnh hưởng UX |
| CDN không khả dụng (offline) | Tải CDN về local nếu cần offline hoàn toàn |
| `file://` block CORS cho một số CDN | Dùng `crossorigin` attribute; Google Fonts fallback sang system font |
| Ảnh avatar.png dùng làm avatar, mockup: homepage.png | Thay bằng ảnh chân dung thật khi có sẵn |

---

## 9. Xác minh hoàn thành

1. `Double-click index.html` → trang hiển thị đúng layout từ mockup
2. Click từng tab → nội dung thay đổi, URL không đổi, không reload
3. Click VI ↔ EN → toàn bộ text chuyển ngôn ngữ
4. DevTools → Responsive → 375px → layout xếp dọc không vỡ
5. DevTools → Network → ảnh `homepage.png` load với path tương đối (status 200)
