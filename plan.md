# Kế hoạch xây dựng Portfolio Website (SPA) — index.html

## Context

Xây dựng một trang portfolio cá nhân dạng SPA (Single Page Application) cho **Trần Khánh Huyền — Business Analyst**. Toàn bộ ứng dụng (bao gồm Trang chủ, Trang chi tiết Kỹ năng, Trang chi tiết Dự án) nằm gọn trong một file `index.html` duy nhất, chạy trực tiếp từ `file://` mà không cần server. Stack: React qua CDN, Babel in-browser, Tailwind Play CDN.

---

## 1. Phân tích cấu trúc Component & Routing

Do là SPA, giao diện sẽ được quyết định bởi state `currentPage` và `selectedProject`.

```text
<App> (Quản lý state currentPage, selectedProject, lang)
 ├── <Header>
 │    ├── <Logo>          — Tên + chức danh bên trái (Inline)
 │    ├── <NavMenu>       — Trang chủ | Dự án | Kỹ năng | Liên hệ
 │    └── <LangToggle>    — Nút dạng text VI | EN
 │
 ├── <HomeView> (Khi currentPage === 'home')
 │    ├── <HeroSection>      — Avatar bo góc đổ bóng (trái) + Thông tin & Nút liên hệ (phải)
 │    ├── <ProjectsSection>  — Danh sách dự án nổi bật (Thẻ nằm ngang full-width)
 │    ├── <SkillsSection>    — Lưới 2 cột thẻ kỹ năng
 │    └── <ContactFooter>    — Section Liên hệ nền trắng (3 thẻ rời) + Copyright
 │
 ├── <ProjectDetailView> (Khi currentPage === 'project_detail')
 │    ├── <PageHero>         — Tên dự án căn giữa, 2 đường kẻ ngang
 │    ├── <OverviewBlock>    — Khối Giới thiệu & Phạm vi (Grid 2 cột)
 │    ├── <ProjectContent>   — Thanh Navy phân cách + Các sơ đồ (BPMN, Use Case, ERD...)
 │    └── <BottomNav>        — Điều hướng ma trận (Dự án trước / Dự án tiếp / Về trang chủ)
 │
 ├── <SystemDesignView> / <UiUxDesignView> (Khi xem chi tiết theo Kỹ năng)
 │    └── ... (Các component tương tự, có <BottomNav> để chuyển qua lại giữa các kỹ năng)
 │
 └── <BackToTop>             — Nút cuộn lên đầu trang (Fixed góc dưới phải)
2. Giải pháp quản lý State, Routing và Scroll
Dùng React.useState để điều hướng mà không cần reload trang:

JavaScript
const [lang, setLang] = React.useState('vi');
const [currentPage, setCurrentPage] = React.useState('home'); // 'home' | 'system' | 'uiux' | 'project_detail'
const [selectedProject, setSelectedProject] = React.useState(null); // Lưu id dự án đang xem
Logic Điều hướng Ma trận (BottomNav)
Sử dụng currentIndex của dự án trong mảng PROJECTS:

Dự án đầu tiên: Trái: < Trở về trang chủ, Phải: Dự án tiếp theo >

Dự án ở giữa: Trái: < Dự án trước, Phải: Dự án tiếp theo >

Dự án cuối cùng: Trái: < Dự án trước, Phải: Trở về trang chủ >

Lưu ý Scroll: Bất cứ khi nào gọi setCurrentPage hoặc setSelectedProject, phải gọi kèm window.scrollTo({ top: 0, behavior: 'smooth' }).

3. Phương pháp xử lý tài nguyên — Đường dẫn tương đối
Vì chạy từ file://, mọi đường dẫn tài nguyên phải là đường dẫn tương đối (relative path).

Ảnh: <img src="./avatar.jpg" />, <img src="./assets/yummy-erd.png" />

CDN: Sử dụng link https:// cho Tailwind, React, ReactDOM, Babel, Google Fonts.

4. Cấu trúc Dữ liệu (Song ngữ VI / EN)
Tập trung toàn bộ text vào các Object:

CONTENT: Dữ liệu cho <HomeView> (hero, about, list skills, list projects...).

PROJECTS: Object chứa mảng dự án chi tiết { vi: [...], en: [...] }.

SHARED: Các nhãn dùng chung (nút bấm, điều hướng, footer, title).

5. Thiết kế giao diện (UI/UX)
Màu sắc & Typography
Màu sắc: Navy chính (#000046), Lavender nhạt (#c9c4e0), Trắng (#ffffff).

Font chữ: Plus Jakarta Sans cho Tiêu đề/Heading. Nunito Sans cho Nội dung/Body text.

Header
Nền trắng, chữ màu Navy, sticky top.

Chữ logo nằm trên 1 dòng: TRẦN KHÁNH HUYỀN / BUSINESS ANALYST.

Nút đổi ngôn ngữ (VI | EN): Dạng text thuần (không nền), ngôn ngữ active in đậm màu Navy.

Hero Section (Trang chủ)
Ảnh đại diện không lót nền màu phía sau, chỉ bo góc rounded-2xl và đổ bóng shadow-xl.

Các nút liên hệ (LinkedIn, Mail, Phone): Viền mỏng, chữ mảnh, KHÔNG CÓ ICON bên trong.

Projects Section (Trang chủ) & Skills Section
Dự án: Layout xếp dọc (flex-col), mỗi dự án là một thẻ nằm ngang rộng (full-width). Nút "XEM THÊM" nền navy bo tròn nằm góc dưới phải.

Kỹ năng: Lưới 2 cột (grid grid-cols-1 md:grid-cols-2 gap-6).

Contact Section (Footer)
Container: Nền trắng (bg-white), padding rộng.

Tiêu đề: Chữ 'LIÊN HỆ' bên trái + Đường kẻ ngang kéo dài hết phần còn lại (flex items-center gap-4).

Khối Cards: Grid 3 cột (gap-6), 3 thẻ hoàn toàn riêng biệt. Mỗi thẻ bo góc rounded-xl, viền mỏng, nền trắng.

Bố cục Card: Icon Navy (trên trái) + Icon mũi tên chéo (trên phải). Nhãn in hoa tracking rộng (dưới) + Giá trị thông tin. Tất cả text và icon dùng màu Navy.

Copyright Bar: Nền trắng, viền trên mỏng, text trái, 3 links mạng xã hội bên phải.

Nút bấm & Điều hướng
BottomNav: Nút dạng Pill (rounded-full), nền Navy chữ trắng. Chữ viết in hoa chữ cái đầu (Title Case). Dùng icon Chevron mảnh (<, >).

BackToTop: Nút tròn nhỏ góc dưới phải (fixed bottom-8 right-8 z-50). Chỉ hiện khi scrollY > 400. Nền navy, icon Chevron Up trắng.

6. Khung HTML cơ bản
HTML
<!DOCTYPE html>
<html lang="vi" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Trần Khánh Huyền — Business Analyst Portfolio</title>
  <script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>
  <script src="[https://unpkg.com/react@18/umd/react.development.js](https://unpkg.com/react@18/umd/react.development.js)" crossorigin></script>
  <script src="[https://unpkg.com/react-dom@18/umd/react-dom.development.js](https://unpkg.com/react-dom@18/umd/react-dom.development.js)" crossorigin></script>
  <script src="[https://unpkg.com/@babel/standalone/babel.min.js](https://unpkg.com/@babel/standalone/babel.min.js)"></script>
  <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)" />
  <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin />
  <link href="[https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito+Sans:wght@300;400;600;700&display=swap](https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito+Sans:wght@300;400;600;700&display=swap)" rel="stylesheet" />
  <script>
    tailwind.config = {
      theme: { extend: { colors: { navy: '#000046', lavender: '#c9c4e0' }, fontFamily: { heading: ['Plus Jakarta Sans', 'sans-serif'], body: ['Nunito Sans', 'sans-serif'] } } }
    };
  </script>
</head>
<body class="bg-white text-gray-800">
  <div id="root"></div>
  <script type="text/babel">
    // Toàn bộ React Code (Data, Components, Views, App Root) nằm ở đây
  </script>
</body>
</html>
7. Danh sách các bước thực hiện mã nguồn
Chuẩn bị Dữ liệu: Gộp toàn bộ CONTENT, PROJECTS (song ngữ) vào một khối duy nhất đầu script.

Components dùng chung: Xây dựng Header, BackToTop, BottomNav, ContactFooter (nền trắng 3 card), LangToggle.

HomeView: Xây dựng HeroSection (Sửa ảnh, nút), ProjectsSection (Thẻ ngang), SkillsSection (Thẻ grid 2).

ProjectDetailView: Xây dựng PageHero (tên dự án), OverviewBlock (2 thẻ ngang), ProjectContent (Thanh Navy phân cách + Hình ảnh không bo góc viền).

App Root: Khởi tạo state routing. Viết logic switch-case để render đúng View theo currentPage.

Kiểm thử: Đảm bảo mở file index.html chạy mượt, chuyển trang scroll lên đầu, đổi ngôn ngữ không lỗi.