# THIẾT KẾ UI FRAMEWORK & COMPONENT DÙNG CHUNG (ORDER MODULE)
> **Dành cho Figma Design System & UI Kits — SuperPlatform Order**  
> *Chuẩn hóa theo kiến trúc thiết kế SuperPlatform 2026*

---

## MỤC LỤC
0. [Danh Sách Tệp Tin .SVG Vector Cho Figma](#0-danh-sách-tệp-tin-svg-vector-cho-figma)
1. [Hệ Thống Design Tokens (Figma Variables & Styles)](#1-hệ-thống-design-tokens)
   - Bảng màu ngữ nghĩa (Color Palette)
   - Phông chữ & Kiểu chữ (Typography System)
   - Khoảng cách & Lưới (Spacing & Layout Grid)
   - Bo góc & Độ bóng (Border Radius & Elevations)
2. [Hệ Thống Thành Phần Dùng Chung (Figma Core Components)](#2-hệ-thống-thành-phần-dùng-chung)
   - **Nút Bấm (Button System Matrix)**
   - **Huy Hiệu & Nhãn (Badges, Pills & Visibility Tags)**
   - **Thẻ Hành Trình Chặng (Order Stage Cardlet — 2-Row Anti-Collision)**
   - **Chặng Vận Chuyển Vận Đơn (Route Leg Cardlet)**
   - **Thanh Điều Hướng Cố Định Dưới Cùng (Detail Bottom Toolbar)**
   - **Bảng Tính & Thanh Điều Khiển Ghim (Bulk Orders Docked Control Panel)**
   - **Khối Hướng Dẫn Sử Dụng Đóng/Mở (Collapsible Guide Banner)**
   - **Bộ Chọn Vai Trò Header (Role Switcher Popover - Shop vs Nội Bộ)**
3. [Quy Chuẩn Auto-Layout Trong Figma (Figma Auto-Layout Guidelines)](#3-quy-chuẩn-auto-layout-trong-figma)
4. [Bảng Tra Cứu Pixel & Tọa Độ Responsive](#4-bảng-tra-cứu-pixel--tọa-độ-responsive)

---

## 0. DANH SÁCH TỆP TIN .SVG VECTOR CHO FIGMA

> [!TIP]
> **Cách đưa vào Figma:** Bạn chỉ cần mở Figma, kéo thả (Drag & Drop) trực tiếp file `.svg` vào Canvas hoặc chọn menu **File > Place Image / Import (Ctrl/Cmd + Shift + K)**. Toàn bộ text, vector paths, icon và màu sắc sẽ chuyển đổi thành các **Frame, Group và Vector Layers có thể chỉnh sửa 100% trong Figma!**

| Tên Tệp Tin .SVG | Mô Tả Thành Phần Vector | Đường Dẫn Tệp Tin |
| :--- | :--- | :--- |
| ⭐ **`MASTER_SUPERPLATFORM_ORDER_DESIGN_SYSTEM.svg`** | **Master Artboard tổng hợp toàn bộ 8 artboards (2400x1800px)** | [MASTER SVG](file:///Users/dangkhoii/module_order/superplatform-order/docs/figma-ui-kit/MASTER_SUPERPLATFORM_ORDER_DESIGN_SYSTEM.svg) |
| `01_color_tokens_and_typography.svg` | Bảng màu Swatches Tokens + Thang kích thước Typography Inter | [01 SVG](file:///Users/dangkhoii/module_order/superplatform-order/docs/figma-ui-kit/01_color_tokens_and_typography.svg) |
| `02_buttons_matrix.svg` | Ma trận Nút bấm: Primary, Outline Red, Outline Slate, Excel Pills | [02 SVG](file:///Users/dangkhoii/module_order/superplatform-order/docs/figma-ui-kit/02_buttons_matrix.svg) |
| `03_status_badges_and_pills.svg` | Huy hiệu trạng thái chặng, Tag Shop/Nội bộ, Tag Nhà vận chuyển | [03 SVG](file:///Users/dangkhoii/module_order/superplatform-order/docs/figma-ui-kit/03_status_badges_and_pills.svg) |
| `04_stage_cardlets_anti_collision.svg`| Thẻ chặng 2 dòng chống đè chữ (Lấy hàng, Giao hàng, Hoàn hàng mở rộng) | [04 SVG](file:///Users/dangkhoii/module_order/superplatform-order/docs/figma-ui-kit/04_stage_cardlets_anti_collision.svg) |
| `05_detail_bottom_toolbar.svg` | Thanh thao tác cố định dưới cùng của Chi tiết đơn (4 nút bằng nhau) | [05 SVG](file:///Users/dangkhoii/module_order/superplatform-order/docs/figma-ui-kit/05_detail_bottom_toolbar.svg) |
| `06_bulk_orders_docked_control_panel.svg` | Thanh điều khiển ghim đáy Bảng tính (Thanh trạng thái + Lưới 3 card) | [06 SVG](file:///Users/dangkhoii/module_order/superplatform-order/docs/figma-ui-kit/06_bulk_orders_docked_control_panel.svg) |
| `07_collapsible_guide_banner.svg` | Khối Hướng Dẫn Sử Dụng có thể đóng/mở ở đầu bảng tính | [07 SVG](file:///Users/dangkhoii/module_order/superplatform-order/docs/figma-ui-kit/07_collapsible_guide_banner.svg) |
| `08_role_switcher_header_popover.svg` | Menu chọn vai trò Header (Shop S275518 vs Nội bộ SuperPlatform) | [08 SVG](file:///Users/dangkhoii/module_order/superplatform-order/docs/figma-ui-kit/08_role_switcher_header_popover.svg) |


---

## 1. HỆ THỐNG DESIGN TOKENS

### 1.1. Bảng Màu Ngữ Nghĩa (Color Palette Styles)

Tạo **Color Variables** trong Figma theo định dạng `Category/Color-Name/Shade`:

| Token Name (Figma Style) | Hex Code | Độ mờ / Alpha | Ứng dụng thực tế |
| :--- | :--- | :--- | :--- |
| `Brand/Red-Primary` | `#E11D48` | 100% | Màu chủ đạo SuperPlatform, Sidebar nền đỏ, nút chính CTA |
| `Brand/Red-Hover` | `#BE123C` | 100% | Trạng thái Hover của nút Primary Red |
| `Brand/Red-Light-Bg` | `#FFF1F2` | 100% | Nền hover nút Outline Red, thẻ cảnh báo |
| `Brand/Red-Border` | `#FECDD3` | 100% | Đường viền badge lỗi, viền khung cảnh báo |
| `Brand/Red-Subtle` | `#FEE2E2` | 100% | Viền khung Hướng dẫn sử dụng |
| `Action/Blue-600` | `#2563EB` | 100% | Nút hành động nổi bật (Lưu, Xác nhận), link trạng thái |
| `Action/Blue-Hover` | `#1D4ED8` | 100% | Hover nút xanh dương |
| `Action/Blue-Light-Bg` | `#EFF6FF` | 100% | Nền Badge Chặng đang thực hiện, Badge quyền Shop |
| `Action/Blue-Border` | `#BFDBFE` | 100% | Viền Badge Chặng đang thực hiện, viền Shop |
| `Success/Green-600` | `#16A34A` | 100% | Nút "Tạo Nhiều Đơn Hàng" active, icon thành công |
| `Success/Green-Hover` | `#15803D` | 100% | Hover nút tạo đơn hàng |
| `Success/Green-Bg` | `#ECFDF5` | 100% | Nền Badge "Đã giao hàng", hàng hợp lệ bảng tính |
| `Success/Green-Border` | `#A7F3D0` | 100% | Viền badge hoàn thành |
| `Warning/Amber-600` | `#D97706` | 100% | Cảnh báo chặng chậm trễ, lưu ý quan trọng |
| `Warning/Amber-Bg` | `#FFFBEB` | 100% | Nền badge cảnh báo, lưu ý vàng |
| `Warning/Amber-Border` | `#FDE68A` | 100% | Viền badge cảnh báo |
| `Internal/Purple-600` | `#7C3AED` | 100% | Màu nhận diện chế độ Nội Bộ (Admin / CSKH) |
| `Internal/Purple-Dark` | `#6D28D9` | 100% | Chữ tag mã trạng thái nội bộ |
| `Internal/Purple-Bg` | `#F5F3FF` | 100% | Nền dòng log sự kiện nội bộ, badge Nội Bộ |
| `Internal/Purple-Border`| `#DDD6FE` | 100% | Viền badge phân quyền nội bộ |
| `Neutral/900` | `#0F172A` | 100% | Tiêu đề trang, chữ quan trọng cấp 1 |
| `Neutral/800` | `#1E293B` | 100% | Nội dung văn bản thường (Body text) |
| `Neutral/700` | `#334155` | 100% | Nhãn trường nhập liệu, text phụ |
| `Neutral/600` | `#475569` | 100% | Sub-label, text thứ cấp |
| `Neutral/500` | `#64748b` | 100% | Icon phụ, ngày giờ timestamp, chevron |
| `Neutral/400` | `#94A3B8` | 100% | Placeholder, nút disabled |
| `Neutral/300` | `#CBD5E1` | 100% | Đường viền input thường, viền nút xám |
| `Neutral/200` | `#E2E8F0` | 100% | Đường viền thẻ card, đường phân cách (divider) |
| `Neutral/100` | `#F1F5F9` | 100% | Nền header bảng tính, nền tag NVC, background phụ |
| `Neutral/50` | `#F8FAFC` | 100% | Nền toàn trang (Main Background) |
| `Base/White` | `#FFFFFF` | 100% | Nền thẻ Card, Header, Toolbar ghim cố định |

---

### 1.2. Phông Chữ & Kiểu Chữ (Typography System)

Bộ phông chuẩn: **Inter** (Google Font). Nếu không có Inter, dùng **SF Pro Display / Roboto**.

| Text Style Name | Font Size | Line Height | Weight | Letter Spacing | Sử dụng trong Figma |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Heading/H1 - Page` | 24px | 32px | Bold (700) | -0.3px | Tiêu đề trang chính (Chi tiết đơn, Bảng tính) |
| `Heading/H2 - Section`| 18px | 26px | SemiBold (600) | -0.2px | Tiêu đề card lớn, tiêu đề khối hướng dẫn |
| `Heading/H3 - Card` | 15px | 22px | SemiBold (600) | 0px | Tiêu đề cụm thẻ: "Thông tin vận chuyển", v.v. |
| `Title/Stage` | 13.5px | 18px | Bold (700) | 0px | Tiêu đề chặng: `Chặng 1: Lấy hàng` |
| `Body/Default` | 14px | 20px | Regular (400) | 0px | Nội dung mô tả, văn bản thường |
| `Body/Medium` | 14px | 20px | Medium (500) | 0px | Văn bản trường dữ liệu, input text |
| `Body/SemiBold` | 14px | 20px | SemiBold (600) | 0px | Giá trị quan trọng, tên khách hàng |
| `Body/Small` | 13px | 18px | Regular (400) | 0px | Ghi chú, mô tả phụ bên dưới |
| `Body/Small-Bold` | 13px | 18px | SemiBold (600) | 0px | Nhãn bảng điều khiển: `Lưu nháp:` |
| `Caption/Regular` | 12px | 16px | Regular (400) | 0px | Thời gian timestamp, phụ chú nhỏ |
| `Caption/SemiBold` | 12px | 16px | SemiBold (600) | 0px | Tag NVC, link "Thay đổi" |
| `Badge/Status` | 11px | 14px | SemiBold (600) | +0.2px | Huy hiệu trạng thái chặng (`Đã bàn giao...`) |
| `Badge/Role` | 10.5px | 13px | Bold (700) | +0.4px | Huy hiệu viết hoa: `SHOP`, `NỘI BỘ` |
| `Code/Monospace` | 11.5px | 15px | Medium (500) | 0px | Mã vận đơn, mã sự kiện RAW |

---

### 1.3. Hệ Thống Khoảng Cách & Bo Góc (Spacing & Radius)

- **Grid cơ bản**: 4px / 8px Grid.
- **Spacing Scale**:
  - `Space/4`: 4px (Gap giữa icon và nhãn nhỏ)
  - `Space/6`: 6px (Gap giữa 2 dòng trong stage cardlet)
  - `Space/8`: 8px (Gap giữa các nút phụ, khoảng cách phần tử)
  - `Space/12`: 12px (Padding thẻ nhỏ, gap giữa các button toolbar)
  - `Space/16`: 16px (Padding thẻ card vừa, gap lưới)
  - `Space/20`: 20px (Padding thẻ lớn)
  - `Space/24`: 24px (Padding ngang của Main Content và Docked Panel)
- **Radius Scale**:
  - `Radius/Sm`: 4px (Tag NVC, ô mã RAW)
  - `Radius/Md`: 6px (Badge phân quyền Shop/Nội bộ)
  - `Radius/Lg`: 8px (Nút bấm Button, Input, Thẻ chặng nhỏ)
  - `Radius/Xl`: 10px (Thẻ Cardlet chặng hành trình, Thanh docked status)
  - `Radius/2Xl`: 12px (Thẻ Card thông tin chính, Khung bảng tính)
  - `Radius/3Xl`: 14px (Khung Hướng Dẫn Sử Dụng)
  - `Radius/Full`: 9999px (Pill buttons, Badge trạng thái tròn góc tuyệt đối)

---

## 2. HỆ THỐNG THÀNH PHẦN DÙNG CHUNG (CORE COMPONENTS MATRIX)

### 2.1. Nút Bấm (Button System Matrix)

#### Variant 1: `Button / Primary-Red`
- **Áp dụng**: Nút thao tác tối thượng (In phiếu gửi, Kiểm tra dữ liệu).
- **Kích thước**: Chiều cao `40px` (Toolbar) hoặc `36px` (Form chuẩn).
- **Auto-Layout**: Horizontal, Align Center, Padding `0 18px`, Gap `8px`.
- **Fills**: `#E11D48` (Default) | Hover: `#BE123C`.
- **Text**: `Inter SemiBold 13.5px`, Màu `#FFFFFF`.
- **Corner Radius**: `8px`.

#### Variant 2: `Button / Outline-Red`
- **Áp dụng**: In lại tem cũ, nút thao tác phụ nổi bật.
- **Kích thước**: Chiều cao `40px` hoặc `36px`.
- **Stroke**: `1.5px Solid #E11D48`.
- **Fills**: `#FFFFFF` | Hover: `#FFF1F2`.
- **Text**: `Inter SemiBold 13px`, Màu `#E11D48`.

#### Variant 3: `Button / Outline-Slate`
- **Áp dụng**: Chỉnh sửa đơn, Hủy đơn, Đóng popup.
- **Kích thước**: Chiều cao `40px` hoặc `36px`.
- **Stroke**: `1px Solid #CBD5E1`.
- **Fills**: `#FFFFFF` | Hover: `#F8FAFC`, Border `#94A3B8`.
- **Text**: `Inter SemiBold 13px`, Màu `#334155`.

#### Variant 4: `Button / Pill-Action (Top Toolbar)`
- **Áp dụng**: Nhóm nút tải Excel, thêm dòng trên thanh công cụ Bảng tính.
- **Kích thước**: Chiều cao `32px`, Radius `9999px`.
- **Auto-Layout**: Horizontal, Padding `4px 14px`, Gap `6px`.
- **Styling cụ thể**:
  - `Tải mẫu Excel`: Fill `#F8FAFC`, Stroke `1px #CBD5E1`, Text `#0F172A`, Icon Download `15px`.
  - `Nhập file Excel`: Fill `#EFF6FF`, Stroke `1px #BFDBFE`, Text `#1D4ED8`, Icon Upload `15px`.
  - `Thêm dòng`: Fill `#F8FAFC`, Stroke `1px #CBD5E1`, Text `#334155`, Icon Plus `15px`.
  - `Kiểm tra dữ liệu`: Fill `#FEF2F2`, Stroke `1.5px #EF4444`, Text `#DC2626`, Icon FileCheck `15px`.

---

### 2.2. Huy Hiệu & Nhãn (Badges & Pills)

#### A. Badge Trạng Thái Chặng (`Stage-Status-Badge`)
Thiết kế hình con nhộng (Pill), ôm trọn chữ trạng thái nhưng có giới hạn chiều rộng an toàn (`max-width: 70%`) và cắt ngắn `...` nếu tên trạng thái quá dài:
- **Xong / Đã giao**: Fill `#ECFDF5`, Stroke `1px #A7F3D0`, Text `#047857` (11px SemiBold).
- **Cảnh báo / Giao không thành công**: Fill `#FFFBEB`, Stroke `1px #FDE68A`, Text `#B45309` (11px SemiBold).
- **Lỗi / Hủy / Hoàn**: Fill `#FEF2F2`, Stroke `1px #FECDD3`, Text `#DC2626` (11px SemiBold).
- **Đang xử lý / Đang đi giao**: Fill `#EFF6FF`, Stroke `1px #BFDBFE`, Text `#2563EB` (11px SemiBold).
- **Chờ tiếp nhận**: Fill `#F1F5F9`, Stroke `1px #E2E8F0`, Text `#64748B` (11px SemiBold).

#### B. Badge Phân Quyền (`Visibility-Badge`)
Dùng trong Lịch sử hành động và Sự kiện chặng để phân định Shop vs Nội bộ:
- **Shop**: Auto-Layout Padding `1px 7px`, Radius `9999px`, Fill `#EFF6FF`, Stroke `1px #BFDBFE`, Text `SHOP` (10.5px Bold, Màu `#2563EB`).
- **Nội bộ**: Auto-Layout Padding `1px 7px`, Radius `9999px`, Fill `#F5F3FF`, Stroke `1px #DDD6FE`, Text `NỘI BỘ` (10.5px Bold, Màu `#7C3AED`).

#### C. Tag Nhà Vận Chuyển (`Carrier-Tag`)
- Auto-Layout: Padding `1.5px 7px`, Radius `4px`, Fill `#F1F5F9`, Stroke `1px #E2E8F0`.
- Text: `NVC: SuperShip` (11.5px SemiBold, Màu `#475569`).

---

### 2.3. Thẻ Hành Trình Chặng (Order Stage Cardlet — 2-Row Anti-Collision)
> **Giải pháp chuẩn hóa loại bỏ hoàn toàn lỗi đè chữ (Overlap)**

```
┌─────────────────────────────────────────────────────────────┐
│ Chặng 1: Lấy hàng                                      ( ⌃ ) │  <- ROW 1 (Space-Between)
│ [ NVC: SuperShip ]         [ Đã bàn giao nhà vận chuyển... ] │  <- ROW 2 (Space-Between)
└─────────────────────────────────────────────────────────────┘
```

#### Thông số Auto-Layout trong Figma:
1. **Khung ngoài (`Stage-Cardlet`)**:
   - Resizing: **Fill container** (Chiều rộng thích ứng từ 260px đến 500px).
   - Fills: `#FFFFFF`.
   - Stroke: `1px Solid #E2E8F0`.
   - Corner Radius: `10px`.
   - Auto-Layout: **Vertical**, Gap `0px`.
2. **Khung tiêu đề (`Stage-Cardlet-Header`)**:
   - Padding: `10px 14px`.
   - Auto-Layout: **Vertical**, Gap `6px`, Resizing: **Fill container**.
   - **Row 1 (`Stage-Header-Top-Row`)**:
     - Auto-Layout: **Horizontal**, Alignment: Center, Distribution: **Space between**, Resizing: **Fill container**.
     - Left: Text `Chặng {n}: {Tên chặng}` (Font: `Inter 13.5px Bold`, Màu `#0F172A`, Resizing: **Fill container**, Truncate with ellipsis).
     - Right: Chevron Icon Button (Kích thước `20x20px`, Icon ChevronDown `16px`, Màu `#64748B`, Resizing: **Fixed**).
   - **Row 2 (`Stage-Header-Bottom-Row`)**:
     - Auto-Layout: **Horizontal**, Alignment: Center, Distribution: **Space between**, Gap `8px`, Resizing: **Fill container**.
     - Left: `Carrier-Tag` (Ví dụ: `NVC: SuperShip`, Resizing: **Hug contents**).
     - Right: `Stage-Status-Badge` (Ví dụ: `Đã bàn giao nhà vận chuyển khác`, Resizing: **Hug contents**, Max-width: `70%`, Truncate with ellipsis).
3. **Danh sách sự kiện mở rộng (`Stage-Cardlet-Events`)**:
   - Auto-Layout: **Vertical**, Padding `10px 14px`, Gap `8px`, Fills: `#FAFAFA`, Border-top: `1px Solid #F1F5F9`.
   - Mỗi dòng sự kiện: **Horizontal**, Gap `8px`, Left: Dot tròn (8px), Text diễn giải sự kiện, Right: Giờ phút `12px Regular #64748B`.

---

### 2.4. Chặng Vận Chuyển Vận Đơn (Route Leg Cardlet)
Thẻ hiển thị mã vận đơn và đơn vị vận chuyển ở mục "Thông tin vận chuyển":
- **Khung ngoài**: Fills `#F8FAFC`, Stroke `1px #E2E8F0`, Radius `8px`, Padding `10px 12px`.
- **Dòng trên**: Label `CHẶNG 1: LẤY HÀNG` (11px Bold, Màu `#64748B`), Right: `Đã lấy hàng` (12px Bold `#16A34A`).
- **Dòng dưới**:
  - Tên nhà vận chuyển: `SuperShip` (13px Bold `#0F172A`).
  - Ô mã vận đơn kèm nút Copy: Background `#FFFFFF`, Border `1px #E2E8F0`, Radius `6px`, Padding `3px 8px`, Monospace text `SPF-HN-00291-P` + Copy Icon.

---

### 2.5. Thanh Điều Hướng Cố Định Dưới Cùng (Detail Bottom Toolbar)
> **Cố định dưới màn hình trang chi tiết đơn hàng, luôn khít sát Sidebar**

- **Vị trí**: Fixed Bottom, `height: 64px`, `background: #FFFFFF`, `border-top: 1px solid #E2E8F0`, `box-shadow: 0 -4px 18px rgba(0,0,0,0.05)`.
- **Căn lề trái theo Sidebar**:
  - Màn hình thường (Desktop): `left: 220px` (Trùng khít sidebar 220px, không hở 10px).
  - Màn hình lớn (>= 1700px): `left: 250px`.
  - Màn hình nhỏ (<= 1150px): `left: 190px`.
  - Sidebar thu gọn / Mobile: `left: 76px`.
- **4 Nút bấm có chiều rộng bằng nhau (`flex: 1`, chiều rộng chia đều 25%)**:
  1. `IN PHIẾU GỬI`: Fill `#E11D48`, Text trắng, Icon Printer.
  2. `IN LẠI TEM CŨ`: Stroke `1.5px #E11D48`, Fills `#FFFFFF`, Text đỏ, Icon RotateCcw.
  3. `CHỈNH SỬA ĐƠN`: Stroke `1px #CBD5E1`, Fills `#FFFFFF`, Text xám đậm, Icon Pencil.
  4. `HỦY ĐƠN`: Stroke `1px #CBD5E1`, Fills `#FFFFFF`, Text xám đậm, Icon XCircle (chỉ ghi "HỦY ĐƠN", không thêm tên NVC).

---

### 2.6. Bảng Tính & Thanh Điều Khiển Ghim (Bulk Orders Docked Control Panel)
> **Cố định ở đáy màn hình khi người dùng cuộn lên cuộn xuống trong Bảng tính**

- **Vị trí**: Fixed Bottom, `background: #FFFFFF` (màu trắng tinh, không lệch màu `#F8FAFC`), `border-top: 1px solid #E2E8F0`, `box-shadow: 0 -4px 18px rgba(15,23,42,0.08)`.
- **Căn lề trái**: Khít sát sidebar `220px` (không có khe hở lệch màu).
- **Cấu trúc gồm 2 khối**:
  1. **Thanh Trạng Thái Ghim (`Sheet-Docked-Status-Bar`)**:
     - Auto-Layout: Horizontal, Space-Between, Align Center, Padding `8px 16px`, Radius `10px`, Border `1px #E2E8F0`.
     - Phía trái: Radio chọn chế độ lưu nháp (`Tự động` / `Thủ công`) + Thời gian lưu gần nhất `14/09/2026 - 12:08:24`.
     - Phía phải: 3 nút hành động:
       - `Tìm Ô Chưa Điền/Điền Sai [0]`: Stroke đỏ `1.5px #EF4444`, Text đỏ.
       - `✓ Kiểm Tra Dữ Liệu`: Fill đỏ `#EF4444`, Text trắng.
       - `Tạo Nhiều Đơn Hàng [0]`: Disabled (`#F1F5F9`, text `#94A3B8`) hoặc Active (`#16A34A`, text trắng).
  2. **Lưới 3 Thẻ Dưới Cùng (`Sheet-Bottom-Section-Grid`)**:
     - Lưới 3 cột theo tỷ lệ: `1.5fr - 1fr - 1.3fr`.
     - **Thẻ 1 (2x3 Grid nút thao tác)**:
       - Hàng trên: 3 nút Solid màu: `Lưu Nháp Dữ Liệu` (Blue), `Khôi Phục Dữ Liệu` (Green), `Thêm Dòng Bảng Tính` (Orange).
       - Hàng dưới: 3 nút Viền đỏ nhạt: `Ẩn/Hiện Hướng Dẫn`, `Quay Về Trang Chủ`, `Cấu Hình Mặc Định`.
     - **Thẻ 2 (Phương thức vận chuyển)**:
       - Header: Icon xe tải xanh + `Phương thức vận chuyển` + Nút text đỏ `Thay đổi`.
       - Body: Label `Một nhà vận chuyển mặc định` + Tên NVC nổi bật `SPX Express` (Xanh dương đậm 14px Bold).
     - **Thẻ 3 (Địa chỉ lấy hàng)**:
       - Header: Icon định vị đỏ + `Địa chỉ lấy hàng` + Nút text đỏ `Thay đổi`.
       - Body: Địa chỉ kho chi tiết + Mã Shop `S275518 - AB` + SĐT kèm icon con mắt bật/tắt hiển thị SĐT.

---

### 2.7. Khối Hướng Dẫn Sử Dụng Đóng/Mở (Collapsible Guide Banner)
> **Được bố trí ở TRÊN CÙNG của bảng tính (ngay dưới header, phía trên bảng tính)**

- **Khung ngoài**: Background `#FFFFFF`, Border `1.5px Solid #FEE2E2`, Radius `14px`, Padding `16px 20px`, Shadow `0 2px 6px rgba(239,68,68,0.04)`.
- **Header**:
  - Horizontal Auto-Layout, Space-Between.
  - Tiêu đề: `Hướng Dẫn Sử Dụng` (`Inter 16px Bold`, Màu `#DC2626`).
  - Nút đóng: Nút tròn chứa icon `X` (`18px`, Màu `#64748B`, Hover: `#0F172A`).
- **Body**:
  - Bước 1: Liệt kê các trường bắt buộc có dấu `[*]`.
  - Bước 2: Hướng dẫn cơ chế gợi ý địa chỉ chuẩn hóa thông minh từ SuperAI.
  - Bước 3: Hướng dẫn bấm "Kiểm Tra Dữ Liệu" rồi bấm "Tạo Nhiều Đơn Hàng".

---

### 2.8. Bộ Chọn Vai Trò Header (Role Switcher Popover - Shop vs Nội Bộ)
> **Nơi DUY NHẤT quyết định hiển thị dữ liệu dạng Shop hay Nội bộ trên toàn hệ thống**

- **Account Pill trên Header**:
  - Height `36px`, Radius `9999px`, Padding `0 14px`, Background `#FFFFFF`, Border `1px #E2E8F0`.
  - Icon khiên xác thực `ShieldCheck` (Xanh lá khi ở Shop, Tím khi ở Nội bộ).
  - Tên hiển thị: `S275518 - AB` (Chế độ Shop) hoặc `Nội bộ - SuperPlatform` (Chế độ Nội bộ).
  - ChevronDown icon.
- **Menu Popover đổ xuống (`Role-Dropdown-Popover`)**:
  - Width `280px`, Background `#FFFFFF`, Border `1px #E2E8F0`, Radius `12px`, Shadow `0 10px 25px rgba(0,0,0,0.1)`.
  - Header: `Chế độ xem dữ liệu` (12px Bold), Phụ đề: `Chọn giao diện phân quyền`.
  - 2 Tùy chọn lựa chọn:
    - **🏪 Giao diện Shop**: Dành cho chủ shop S275518 - AB. Khi chọn, toàn bộ hành trình chỉ hiển thị các mốc Shop được xem.
    - **🔒 Giao diện Nội bộ**: Dành cho Điều phối / CSKH. Khi chọn, hiển thị toàn bộ 20 dòng log sự kiện, mã raw code, và menu Quản lý tem in.

---

## 3. QUY CHUẨN AUTO-LAYOUT TRONG FIGMA (FIGMA AUTO-LAYOUT GUIDELINES)

Để các component trong Figma co giãn mượt mà đúng như bản thiết kế code:

1. **Nguyên tắc Resizing (Co giãn)**:
   - **Thẻ Card / Cardlet**: Luôn đặt chiều rộng là `Fill container`, chiều cao là `Hug contents`.
   - **Tiêu đề dài & Tên trạng thái**: Luôn bật thuộc tính `Truncate text` (Cắt ngắn có dấu 3 chấm) trong Figma, đặt chiều rộng là `Fill container` (đối với tiêu đề) hoặc `Max width` (đối với badge trạng thái).
   - **Icon Chevron & Icon thao tác**: Luôn đặt kích thước `Fixed` (ví dụ `16x16px` hoặc `20x20px`).

2. **Cấu trúc Layer chuẩn của Thẻ Chặng trong Figma**:
   ```
   [Frame] Stage-Cardlet (Fill container, Hug contents, Radius: 10, Stroke: #E2E8F0)
   ├── [Frame] Stage-Cardlet-Header (Vertical, Fill container, Hug, Padding: 10px 14px, Gap: 6)
   │   ├── [Frame] Stage-Header-Top-Row (Horizontal, Space-Between, Fill container, Gap: 8)
   │   │   ├── [Text] "Chặng 1: Lấy hàng" (Fill container, Truncate, Bold 13.5)
   │   │   └── [Frame] Chevron-Button (Fixed 20x20, Center, Hug)
   │   └── [Frame] Stage-Header-Bottom-Row (Horizontal, Space-Between, Fill container, Gap: 8)
   │       ├── [Frame] Carrier-Tag (Hug contents, Radius: 4, BG: #F1F5F9)
   │       │   └── [Text] "NVC: SuperShip" (Medium 11.5)
   │       └── [Frame] Status-Badge (Hug contents, Max: 70%, Radius: 9999, BG: #ECFDF5)
   │           └── [Text] "Đã bàn giao nhà vận chuyển khác" (SemiBold 11, Truncate)
   └── [Frame] Stage-Cardlet-Events (Vertical, Fill container, Hug, Padding: 10px 14px, BG: #FAFAFA)
   ```

3. **Cấu trúc Layer Thanh Docked Bottom Toolbar**:
   ```
   [Frame] Detail-Bottom-Toolbar (Fixed to viewport bottom, Height: 64px, Fill width)
   └── [Frame] Action-Buttons-Wrapper (Horizontal, Fill container, Gap: 12px, Padding: 12px 30px)
       ├── [Button] "IN PHIẾU GỬI" (Fill container, Height: 40px)
       ├── [Button] "IN LẠI TEM CŨ" (Fill container, Height: 40px)
       ├── [Button] "CHỈNH SỬA ĐƠN" (Fill container, Height: 40px)
       └── [Button] "HỦY ĐƠN" (Fill container, Height: 40px)
   ```

---

## 4. BẢNG TRA CỨU PIXEL & TỌA ĐỘ RESPONSIVE

| Thiết bị & Kích thước | Chiều rộng Sidebar | Căn lề trái Toolbar/Docked Panel | Khoảng cách khả dụng nội dung |
| :--- | :--- | :--- | :--- |
| **Màn hình cực lớn (>= 1700px)** | `250px` | `left: 250px` | Rộng rãi, hiển thị song song 2 cột lớn |
| **Màn hình chuẩn Desktop (1151px - 1699px)** | `220px` | `left: 220px` (Khít sát viền) | Chuẩn tối ưu 1366x768 & 1920x1080 |
| **Màn hình vừa / Laptop (801px - 1150px)** | `190px` | `left: 190px` | Tự động rút gọn lề để ưu tiên bảng |
| **Sidebar thu gọn (Collapsed / Mobile <= 800px)**| `76px` | `left: 76px` | Tối ưu không gian bảng tính & chi tiết đơn |

---
*Tài liệu này được biên soạn đầy đủ để nhập trực tiếp vào Figma Design System của SuperPlatform Order Module.*
