#!/usr/bin/env python3
import os

OUTPUT_DIR = "/Users/dangkhoii/module_order/figma"
DOCS_DIR = "docs/figma-ui-kit"
PUBLIC_DIR = "public/figma-ui-kit"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

# -------------------------------------------------------------
# Icons helper definitions
# -------------------------------------------------------------
ICONS = {
    "package": '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    "plus_circle": '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
    "table": '<path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>',
    "message_square": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    "wallet": '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    "settings": '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    "shield_check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    "search": '<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>',
    "bell": '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    "globe": '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    "book_open": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    "mobile": '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    "menu": '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    "arrow_left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    "rotate_ccw": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    "file_text": '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
    "printer": '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    "chevron_down": '<path d="m6 9 6 6 6-6"/>',
    "copy": '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    "user": '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    "map_pin": '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    "eye": '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    "pencil": '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    "x_circle": '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    "calendar": '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    "truck": '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.23-4.27a1 1 0 0 0-.78-.46H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    "arrow_right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'
}

def icon(name, x, y, size=16, color="currentColor", stroke_width=2):
    body = ICONS.get(name, "")
    return f'<g transform="translate({x}, {y}) scale({size/24})" fill="none" stroke="{color}" stroke-width="{stroke_width}" stroke-linecap="round" stroke-linejoin="round">{body}</g>'

# =============================================================================
# SCREEN 01: SHOP ORDERS LIST PAGE (Trang danh sách Order dành cho Shop)
# Viewport: 1440 x 1120 px
# =============================================================================
screen_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1120" width="1440" height="1120">
  <defs>
    <style>
      .font-sans {{ font-family: 'Inter', system-ui, -apple-system, sans-serif; }}
      .font-mono {{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }}
      .shadow-sm {{ filter: drop-shadow(0 1px 2px rgba(0,0,0,0.04)); }}
      .shadow-md {{ filter: drop-shadow(0 2px 6px rgba(0,0,0,0.06)); }}
    </style>
  </defs>

  <!-- Canvas Background -->
  <rect width="1440" height="1120" fill="#F4F6F9"/>

  <!-- ===================================================================
       1. SIDEBAR (Left: 0, Width: 220, Height: 1120, Brand Red #E11D48)
       =================================================================== -->
  <g id="Sidebar" transform="translate(0, 0)">
    <rect width="220" height="1120" fill="#E11D48"/>

    <!-- Brand Logo & Title -->
    <g transform="translate(20, 24)">
      <!-- Hexagon AI Logo -->
      <path d="M19 2L35 11.2V29.8L19 39L3 29.8V11.2L19 2Z" stroke="#FFFFFF" stroke-width="2.5" fill="none"/>
      <path d="M13 14C13 12.3 14.3 11 16 11H22C23.7 11 25 12.3 25 14V17C25 18.7 23.7 20 22 20H16C14.3 20 13 21.3 13 23V26C13 27.7 14.3 29 16 29H22C23.7 29 25 27.7 25 26" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>

      <text x="46" y="20" class="font-sans" font-size="20" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">SuperAI</text>
      <text x="46" y="32" class="font-sans" font-size="8" font-weight="700" fill="rgba(255,255,255,0.85)" letter-spacing="0.8">TỐI ƯU GIAO HÀNG CÙNG AI</text>
    </g>

    <!-- Navigation Menu Items -->
    <g transform="translate(10, 85)">
      <!-- Item 1: Đơn hàng (ACTIVE) -->
      <g transform="translate(0, 0)">
        <rect width="200" height="40" rx="20" fill="#FFFFFF"/>
        {icon("package", 16, 11, 18, "#E11D48")}
        <text x="46" y="25" class="font-sans" font-size="13.5" font-weight="700" fill="#E11D48">Đơn hàng</text>
      </g>

      <!-- Item 2: Lên đơn nhanh -->
      <g transform="translate(0, 48)">
        {icon("plus_circle", 16, 11, 18, "rgba(255,255,255,0.9)")}
        <text x="46" y="25" class="font-sans" font-size="13.5" font-weight="500" fill="rgba(255,255,255,0.9)">Lên đơn nhanh</text>
      </g>

      <!-- Item 3: Bảng tính 3 cấp -->
      <g transform="translate(0, 96)">
        {icon("table", 16, 11, 18, "rgba(255,255,255,0.9)")}
        <text x="46" y="25" class="font-sans" font-size="13.5" font-weight="500" fill="rgba(255,255,255,0.9)">Bảng tính 3 cấp</text>
      </g>

      <!-- Item 4: Bảng tính 2 cấp -->
      <g transform="translate(0, 144)">
        {icon("table", 16, 11, 18, "rgba(255,255,255,0.9)")}
        <text x="46" y="25" class="font-sans" font-size="13.5" font-weight="500" fill="rgba(255,255,255,0.9)">Bảng tính 2 cấp</text>
      </g>

      <!-- Item 5: Yêu cầu hỗ trợ -->
      <g transform="translate(0, 192)">
        {icon("message_square", 16, 11, 18, "rgba(255,255,255,0.9)")}
        <text x="46" y="25" class="font-sans" font-size="13.5" font-weight="500" fill="rgba(255,255,255,0.9)">Yêu cầu hỗ trợ</text>
      </g>

      <!-- Item 6: Đối soát & Ví -->
      <g transform="translate(0, 240)">
        {icon("wallet", 16, 11, 18, "rgba(255,255,255,0.9)")}
        <text x="46" y="25" class="font-sans" font-size="13.5" font-weight="500" fill="rgba(255,255,255,0.9)">Đối soát &amp; Ví</text>
      </g>

      <!-- Item 7: Cấu hình shop -->
      <g transform="translate(0, 288)">
        {icon("settings", 16, 11, 18, "rgba(255,255,255,0.9)")}
        <text x="46" y="25" class="font-sans" font-size="13.5" font-weight="500" fill="rgba(255,255,255,0.9)">Cấu hình Shop</text>
      </g>
    </g>

    <!-- Sidebar Footer -->
    <g transform="translate(14, 1030)">
      <text x="0" y="0" class="font-sans" font-size="11" fill="rgba(255,255,255,0.75)">Phiên bản: 1.0.35</text>
      <g transform="translate(0, 12)">
        <rect width="192" height="24" rx="4" fill="rgba(0,0,0,0.15)"/>
        {icon("shield_check", 6, 4, 15, "#60A5FA")}
        <text x="26" y="16" class="font-sans" font-size="9.5" font-weight="700" fill="#FFFFFF" letter-spacing="0.3">ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG</text>
      </g>
    </g>
  </g>

  <!-- ===================================================================
       2. TOP HEADER (Left: 220, Width: 1220, Height: 70, White #FFFFFF)
       =================================================================== -->
  <g id="Top_Header" transform="translate(220, 0)">
    <rect width="1220" height="70" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>

    <!-- Menu Toggle -->
    <g transform="translate(24, 16)">
      <circle cx="19" cy="19" r="19" fill="#F8FAFC" stroke="#E2E8F0"/>
      {icon("menu", 10, 10, 18, "#64748B")}
    </g>

    <!-- Global Search Input -->
    <g transform="translate(80, 16)">
      <rect width="520" height="38" rx="19" fill="#F8FAFC" stroke="#E2E8F0"/>
      {icon("search", 16, 10, 18, "#94A3B8")}
      <text x="44" y="24" class="font-sans" font-size="13" fill="#94A3B8">Nhập Mã Vận Đơn/Mã Đơn Hàng/SĐT/Mã Đơn Riêng để tìm kiếm</text>
    </g>

    <!-- Right Header Actions -->
    <g transform="translate(740, 16)">
      <!-- Mobile App -->
      <g transform="translate(0, 0)">
        <circle cx="19" cy="19" r="19" fill="#F8FAFC" stroke="#E2E8F0"/>
        {icon("mobile", 10, 10, 18, "#64748B")}
      </g>

      <!-- Support / Guide -->
      <g transform="translate(48, 0)">
        <circle cx="19" cy="19" r="19" fill="#F8FAFC" stroke="#E2E8F0"/>
        {icon("book_open", 10, 10, 18, "#64748B")}
      </g>

      <!-- Notifications -->
      <g transform="translate(96, 0)">
        <circle cx="19" cy="19" r="19" fill="#F8FAFC" stroke="#E2E8F0"/>
        {icon("bell", 10, 10, 18, "#64748B")}
      </g>

      <!-- Public Tracking Link -->
      <g transform="translate(144, 0)">
        <circle cx="19" cy="19" r="19" fill="#F8FAFC" stroke="#E2E8F0"/>
        {icon("globe", 10, 10, 18, "#64748B")}
      </g>

      <!-- Shop Account Pill (Duy nhất phân quyền Shop) -->
      <g transform="translate(204, 0)">
        <rect width="210" height="38" rx="19" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
        <circle cx="19" cy="19" r="10" fill="#ECFDF5"/>
        {icon("shield_check", 11, 11, 16, "#16A34A")}
        <text x="40" y="24" class="font-sans" font-size="13" font-weight="700" fill="#0F172A">S275518 - AB</text>
        {icon("chevron_down", 182, 12, 14, "#64748B")}
      </g>
    </g>
  </g>

  <!-- ===================================================================
       3. MAIN CONTENT (Left: 220, Width: 1220, Margin/Padding: 24)
       =================================================================== -->
  <g id="Main_Content" transform="translate(244, 90)">

    <!-- Row 1: Page Title & Aux Actions -->
    <g id="Page_Header_Row" transform="translate(0, 0)">
      <g transform="translate(0, 0)">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF" stroke="#E2E8F0"/>
        {icon("arrow_left", 7, 7, 18, "#334155")}
      </g>
      <text x="44" y="23" class="font-sans" font-size="24" font-weight="700" fill="#0F172A">
        Đơn Hàng <tspan font-size="18" font-weight="600" fill="#64748B">(20)</tspan>
      </text>

      <g transform="translate(1080, 0)">
        <rect width="90" height="32" rx="6" fill="#F1F5F9" stroke="#E2E8F0"/>
        {icon("rotate_ccw", 10, 9, 14, "#475569")}
        <text x="32" y="21" class="font-sans" font-size="12" font-weight="600" fill="#475569">Reset DB</text>
      </g>
    </g>

    <!-- Row 2: Status Filter Tabs & Batch Buttons -->
    <g id="Status_Tabs_And_Batch_Bar" transform="translate(0, 44)">
      <!-- Tab 1: Tất cả (Active) -->
      <g transform="translate(0, 0)">
        <rect width="90" height="34" rx="17" fill="#E11D48"/>
        <text x="16" y="22" class="font-sans" font-size="12.5" font-weight="700" fill="#FFFFFF">Tất cả (20)</text>
      </g>

      <!-- Tab 2: Chưa lấy hàng -->
      <g transform="translate(98, 0)">
        <rect width="135" height="34" rx="17" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="14" y="22" class="font-sans" font-size="12.5" font-weight="500" fill="#475569">Chưa lấy hàng (4)</text>
      </g>

      <!-- Tab 3: Đã lấy - Đang giao -->
      <g transform="translate(241, 0)">
        <rect width="155" height="34" rx="17" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="14" y="22" class="font-sans" font-size="12.5" font-weight="500" fill="#475569">Đang giao hàng (6)</text>
      </g>

      <!-- Tab 4: Hoãn giao hàng -->
      <g transform="translate(404, 0)">
        <rect width="140" height="34" rx="17" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="14" y="22" class="font-sans" font-size="12.5" font-weight="500" fill="#475569">Hoãn giao hàng (2)</text>
      </g>

      <!-- Tab 5: Đã giao hàng -->
      <g transform="translate(552, 0)">
        <rect width="130" height="34" rx="17" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="14" y="22" class="font-sans" font-size="12.5" font-weight="500" fill="#475569">Đã giao hàng (5)</text>
      </g>

      <!-- Tab 6: Đang chuyển hoàn -->
      <g transform="translate(690, 0)">
        <rect width="150" height="34" rx="17" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="14" y="22" class="font-sans" font-size="12.5" font-weight="500" fill="#475569">Đang chuyển hoàn (2)</text>
      </g>

      <!-- Batch Action Buttons on Right -->
      <g transform="translate(870, 0)">
        <!-- Export Excel Button -->
        <g transform="translate(0, 0)">
          <rect width="130" height="34" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
          {icon("file_text", 12, 9, 15, "#334155")}
          <text x="34" y="22" class="font-sans" font-size="11.5" font-weight="700" fill="#334155">XUẤT EXCEL</text>
        </g>

        <!-- Print Template Button (Split) -->
        <g transform="translate(138, 0)">
          <rect width="125" height="34" rx="6" fill="#E11D48"/>
          {icon("printer", 12, 9, 15, "#FFFFFF")}
          <text x="34" y="22" class="font-sans" font-size="11.5" font-weight="700" fill="#FFFFFF">IN TEM (K46)</text>
          <line x1="128" y1="0" x2="128" y2="34" stroke="rgba(255,255,255,0.3)"/>
          <rect x="128" y="0" width="32" height="34" rx="6" fill="#E11D48"/>
          {icon("chevron_down", 136, 10, 14, "#FFFFFF")}
        </g>
      </g>
    </g>

    <!-- Row 3: BỘ LỌC ĐƠN HÀNG (Filter Card) -->
    <g id="Order_Filters_Card" transform="translate(0, 95)">
      <rect width="1170" height="130" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" class="shadow-sm"/>

      <!-- Header -->
      <g transform="translate(20, 24)">
        <text x="0" y="0" class="font-sans" font-size="13" font-weight="800" fill="#0F172A" letter-spacing="0.5">BỘ LỌC ĐƠN HÀNG</text>
        <rect x="150" y="-14" width="105" height="24" rx="12" fill="#EFF6FF"/>
        <text x="162" y="3" class="font-sans" font-size="11" font-weight="700" fill="#2563EB">Bộ lọc Shop</text>
      </g>

      <!-- 4 Filter Fields -->
      <g transform="translate(20, 50)">
        <!-- Field 1: Thời gian -->
        <g transform="translate(0, 0)">
          <text x="0" y="0" class="font-sans" font-size="11.5" font-weight="600" fill="#475569">Thời gian tạo đơn</text>
          <rect y="8" width="260" height="38" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
          {icon("calendar", 10, 18, 16, "#64748B")}
          <text x="34" y="32" class="font-sans" font-size="12.5" fill="#0F172A">7 ngày trước (08/09 - 14/09)</text>
          {icon("chevron_down", 234, 19, 14, "#64748B")}
        </g>

        <!-- Field 2: NVC -->
        <g transform="translate(275, 0)">
          <text x="0" y="0" class="font-sans" font-size="11.5" font-weight="600" fill="#475569">Đối tác vận chuyển</text>
          <rect y="8" width="220" height="38" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
          {icon("truck", 10, 18, 16, "#64748B")}
          <text x="34" y="32" class="font-sans" font-size="12.5" fill="#0F172A">Tất cả NVC</text>
          {icon("chevron_down", 194, 19, 14, "#64748B")}
        </g>

        <!-- Field 3: Tài khoản -->
        <g transform="translate(510, 0)">
          <text x="0" y="0" class="font-sans" font-size="11.5" font-weight="600" fill="#475569">Loại tài khoản cước</text>
          <rect y="8" width="230" height="38" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
          <text x="14" y="32" class="font-sans" font-size="12.5" fill="#0F172A">Hợp đồng Chung (SuperPlatform)</text>
          {icon("chevron_down", 204, 19, 14, "#64748B")}
        </g>

        <!-- Field 4: Trạng thái -->
        <g transform="translate(755, 0)">
          <text x="0" y="0" class="font-sans" font-size="11.5" font-weight="600" fill="#475569">Trạng thái xử lý</text>
          <rect y="8" width="210" height="38" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
          <text x="14" y="32" class="font-sans" font-size="12.5" fill="#0F172A">Tất cả trạng thái</text>
          {icon("chevron_down", 184, 19, 14, "#64748B")}
        </g>

        <!-- Buttons: Tìm kiếm & Làm mới -->
        <g transform="translate(980, 8)">
          <rect width="140" height="38" rx="6" fill="#E11D48"/>
          {icon("search", 24, 10, 16, "#FFFFFF")}
          <text x="48" y="24" class="font-sans" font-size="12.5" font-weight="700" fill="#FFFFFF">TÌM KIẾM</text>
        </g>
      </g>
    </g>

    <!-- Row 4: DANH SÁCH ĐƠN HÀNG (Data Table Card) -->
    <g id="Order_Table_Card" transform="translate(0, 240)">
      <rect width="1170" height="740" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" class="shadow-sm"/>

      <!-- Table Head -->
      <g id="Table_Header" transform="translate(0, 0)">
        <rect width="1170" height="46" rx="10" fill="#F8FAFC"/>
        <line x1="0" y1="46" x2="1170" y2="46" stroke="#E2E8F0" stroke-width="1"/>

        <!-- Head Columns -->
        <!-- Checkbox -->
        <rect x="20" y="15" width="16" height="16" rx="3" fill="#FFFFFF" stroke="#CBD5E1"/>

        <text x="56" y="28" class="font-sans" font-size="12" font-weight="700" fill="#475569">Mã Đơn Hàng</text>
        <text x="210" y="28" class="font-sans" font-size="12" font-weight="700" fill="#475569">Khách Hàng</text>
        <text x="430" y="28" class="font-sans" font-size="12" font-weight="700" fill="#475569">Sản Phẩm &amp; Trọng Lượng</text>
        <text x="630" y="28" class="font-sans" font-size="12" font-weight="700" fill="#475569">Thông Tin Vận Chuyển</text>
        <text x="880" y="28" class="font-sans" font-size="12" font-weight="700" fill="#475569">Thu Hộ (COD)</text>
        <text x="980" y="28" class="font-sans" font-size="12" font-weight="700" fill="#475569">Trạng Thái</text>
        <text x="1100" y="28" class="font-sans" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">Tác Vụ</text>
      </g>

      <!-- ===============================================================
           TABLE ROW 1: SPF-HN-00291 (Đang giao hàng)
           =============================================================== -->
      <g id="Row_1" transform="translate(0, 46)">
        <rect width="1170" height="150" fill="#FFFFFF"/>
        <line x1="0" y1="150" x2="1170" y2="150" stroke="#F1F5F9" stroke-width="1"/>

        <!-- Checkbox -->
        <rect x="20" y="24" width="16" height="16" rx="3" fill="#FFFFFF" stroke="#CBD5E1"/>

        <!-- Col 1: Mã Đơn Hàng -->
        <g transform="translate(56, 26)">
          <text x="0" y="0" class="font-sans" font-size="13.5" font-weight="700" fill="#2563EB">SPF-HN-00291</text>
          {icon("copy", 108, -12, 13, "#64748B")}
          <text x="0" y="22" class="font-sans" font-size="11.5" fill="#64748B">14/09/2026 - 14:20</text>
          <rect y="32" width="70" height="18" rx="4" fill="#F1F5F9"/>
          <text x="8" y="45" class="font-sans" font-size="10.5" font-weight="600" fill="#475569">Thương mại</text>
        </g>

        <!-- Col 2: Khách Hàng -->
        <g transform="translate(210, 24)">
          {icon("user", 0, -2, 14, "#64748B")}
          <text x="20" y="10" class="font-sans" font-size="13" font-weight="700" fill="#0F172A">Nguyễn Văn An</text>

          {icon("phone", 0, 22, 14, "#64748B")}
          <text x="20" y="34" class="font-sans" font-size="12" fill="#334155">0912****56</text>
          {icon("eye", 90, 22, 13, "#94A3B8")}

          {icon("map_pin", 0, 48, 14, "#E11D48")}
          <text x="20" y="58" class="font-sans" font-size="11.5" fill="#475569">45 Tràng Tiền, Hoàn Kiếm, Hà Nội</text>
        </g>

        <!-- Col 3: Sản Phẩm -->
        <g transform="translate(430, 24)">
          <text x="0" y="10" class="font-sans" font-size="13" font-weight="600" fill="#0F172A">Áo polo nam thể thao cao cấp</text>
          <text x="0" y="32" class="font-sans" font-size="11.5" fill="#64748B">Số lượng: 2 cái · 450 gram</text>
          <text x="0" y="54" class="font-sans" font-size="11" font-style="italic" fill="#64748B">"Giao giờ hành chính, gọi trước"</text>
        </g>

        <!-- Col 4: Vận Chuyển (3-Leg Mini Route View) -->
        <g transform="translate(630, 20)">
          <!-- Routing Stepper Box -->
          <rect width="230" height="96" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>

          <!-- Chặng 1: SuperShip (Chuyển) -->
          <g transform="translate(10, 18)">
            <circle cx="8" cy="8" r="8" fill="#16A34A"/>
            <text x="5" y="11" class="font-sans" font-size="9" font-weight="700" fill="#FFFFFF">1</text>
            <text x="22" y="12" class="font-sans" font-size="11" font-weight="700" fill="#0F172A">Chuyển: <tspan font-weight="500">SuperShip</tspan></text>
            <text x="135" y="12" class="font-mono" font-size="10.5" fill="#2563EB">910115664</text>
          </g>

          <line x1="18" y1="36" x2="18" y2="48" stroke="#CBD5E1" stroke-width="1.5"/>

          <!-- Chặng 2: GHN (Giao - Active) -->
          <g transform="translate(10, 54)">
            <circle cx="8" cy="8" r="8" fill="#2563EB"/>
            <text x="5" y="11" class="font-sans" font-size="9" font-weight="700" fill="#FFFFFF">2</text>
            <text x="22" y="12" class="font-sans" font-size="11" font-weight="700" fill="#0F172A">Giao: <tspan font-weight="700" fill="#2563EB">GHN Express</tspan></text>
            <text x="135" y="12" class="font-mono" font-size="10.5" fill="#2563EB">GY8C1303</text>
          </g>

          <!-- Current status mini tag -->
          <g transform="translate(10, 78)">
            <rect width="210" height="14" rx="4" fill="#EFF6FF"/>
            <text x="8" y="11" class="font-sans" font-size="9.5" font-weight="600" fill="#2563EB">Đang giao: Shipper đang phát hàng</text>
          </g>
        </g>

        <!-- Col 5: Tiền Thu Khách -->
        <g transform="translate(880, 26)">
          <text x="0" y="10" class="font-sans" font-size="14" font-weight="800" fill="#E11D48">350.000 ₫</text>
          <text x="0" y="30" class="font-sans" font-size="11" fill="#64748B">Trị giá: 500.000 ₫</text>
        </g>

        <!-- Col 6: Trạng Thái -->
        <g transform="translate(980, 26)">
          <rect width="105" height="26" rx="13" fill="#EFF6FF" stroke="#BFDBFE"/>
          <text x="12" y="17" class="font-sans" font-size="11" font-weight="700" fill="#2563EB">Đang giao hàng</text>
        </g>

        <!-- Col 7: Tác Vụ Icons -->
        <g transform="translate(1100, 24)">
          <!-- Detail -->
          <circle cx="-16" cy="14" r="14" fill="#F1F5F9"/>
          {icon("eye", -23, 7, 14, "#334155")}

          <!-- Print -->
          <circle cx="16" cy="14" r="14" fill="#F1F5F9"/>
          {icon("printer", 9, 7, 14, "#334155")}
        </g>
      </g>

      <!-- ===============================================================
           TABLE ROW 2: SPF-SG-00104 (Hoãn giao hàng)
           =============================================================== -->
      <g id="Row_2" transform="translate(0, 196)">
        <rect width="1170" height="150" fill="#FFFFFF"/>
        <line x1="0" y1="150" x2="1170" y2="150" stroke="#F1F5F9" stroke-width="1"/>

        <!-- Checkbox -->
        <rect x="20" y="24" width="16" height="16" rx="3" fill="#FFFFFF" stroke="#CBD5E1"/>

        <!-- Col 1: Mã Đơn Hàng -->
        <g transform="translate(56, 26)">
          <text x="0" y="0" class="font-sans" font-size="13.5" font-weight="700" fill="#2563EB">SPF-SG-00104</text>
          {icon("copy", 108, -12, 13, "#64748B")}
          <text x="0" y="22" class="font-sans" font-size="11.5" fill="#64748B">14/09/2026 - 11:05</text>
          <rect y="32" width="70" height="18" rx="4" fill="#F1F5F9"/>
          <text x="8" y="45" class="font-sans" font-size="10.5" font-weight="600" fill="#475569">Thương mại</text>
        </g>

        <!-- Col 2: Khách Hàng -->
        <g transform="translate(210, 24)">
          {icon("user", 0, -2, 14, "#64748B")}
          <text x="20" y="10" class="font-sans" font-size="13" font-weight="700" fill="#0F172A">Trần Thị Bích</text>

          {icon("phone", 0, 22, 14, "#64748B")}
          <text x="20" y="34" class="font-sans" font-size="12" fill="#334155">0988****12</text>
          {icon("eye", 90, 22, 13, "#94A3B8")}

          {icon("map_pin", 0, 48, 14, "#E11D48")}
          <text x="20" y="58" class="font-sans" font-size="11.5" fill="#475569">12 Bạch Đằng, Bình Thạnh, TP.HCM</text>
        </g>

        <!-- Col 3: Sản Phẩm -->
        <g transform="translate(430, 24)">
          <text x="0" y="10" class="font-sans" font-size="13" font-weight="600" fill="#0F172A">Giày sneaker basic unisex</text>
          <text x="0" y="32" class="font-sans" font-size="11.5" fill="#64748B">Số lượng: 1 đôi · 850 gram</text>
          <text x="0" y="54" class="font-sans" font-size="11" font-style="italic" fill="#E11D48">"Cho xem hàng trước khi nhận"</text>
        </g>

        <!-- Col 4: Vận Chuyển -->
        <g transform="translate(630, 20)">
          <rect width="230" height="96" rx="8" fill="#FFFBEB" stroke="#FDE68A"/>

          <g transform="translate(10, 18)">
            <circle cx="8" cy="8" r="8" fill="#16A34A"/>
            <text x="5" y="11" class="font-sans" font-size="9" font-weight="700" fill="#FFFFFF">1</text>
            <text x="22" y="12" class="font-sans" font-size="11" font-weight="700" fill="#0F172A">Chuyển: <tspan font-weight="500">SuperShip</tspan></text>
            <text x="135" y="12" class="font-mono" font-size="10.5" fill="#2563EB">910115668</text>
          </g>

          <line x1="18" y1="36" x2="18" y2="48" stroke="#CBD5E1" stroke-width="1.5"/>

          <g transform="translate(10, 54)">
            <circle cx="8" cy="8" r="8" fill="#D97706"/>
            <text x="5" y="11" class="font-sans" font-size="9" font-weight="800" fill="#FFFFFF">!</text>
            <text x="22" y="12" class="font-sans" font-size="11" font-weight="700" fill="#0F172A">Giao: <tspan font-weight="700" fill="#D97706">BEST</tspan></text>
            <text x="135" y="12" class="font-mono" font-size="10.5" fill="#2563EB">999800060872011</text>
          </g>

          <g transform="translate(10, 78)">
            <rect width="210" height="14" rx="4" fill="#FEF3C7"/>
            <text x="8" y="11" class="font-sans" font-size="9.5" font-weight="600" fill="#B45309">Hoãn: Không liên lạc được người nhận</text>
          </g>
        </g>

        <!-- Col 5: Tiền Thu Khách -->
        <g transform="translate(880, 26)">
          <text x="0" y="10" class="font-sans" font-size="14" font-weight="800" fill="#E11D48">620.000 ₫</text>
          <text x="0" y="30" class="font-sans" font-size="11" fill="#64748B">Trị giá: 750.000 ₫</text>
        </g>

        <!-- Col 6: Trạng Thái -->
        <g transform="translate(980, 26)">
          <rect width="105" height="26" rx="13" fill="#FFFBEB" stroke="#FDE68A"/>
          <text x="12" y="17" class="font-sans" font-size="11" font-weight="700" fill="#B45309">Hoãn giao hàng</text>
        </g>

        <!-- Col 7: Tác Vụ Icons -->
        <g transform="translate(1100, 24)">
          <circle cx="-16" cy="14" r="14" fill="#F1F5F9"/>
          {icon("eye", -23, 7, 14, "#334155")}

          <circle cx="16" cy="14" r="14" fill="#F1F5F9"/>
          {icon("printer", 9, 7, 14, "#334155")}
        </g>
      </g>

      <!-- ===============================================================
           TABLE ROW 3: SPF-DN-00055 (Đã giao hàng)
           =============================================================== -->
      <g id="Row_3" transform="translate(0, 346)">
        <rect width="1170" height="150" fill="#FFFFFF"/>
        <line x1="0" y1="150" x2="1170" y2="150" stroke="#F1F5F9" stroke-width="1"/>

        <!-- Checkbox -->
        <rect x="20" y="24" width="16" height="16" rx="3" fill="#FFFFFF" stroke="#CBD5E1"/>

        <!-- Col 1: Mã Đơn Hàng -->
        <g transform="translate(56, 26)">
          <text x="0" y="0" class="font-sans" font-size="13.5" font-weight="700" fill="#2563EB">SPF-DN-00055</text>
          {icon("copy", 108, -12, 13, "#64748B")}
          <text x="0" y="22" class="font-sans" font-size="11.5" fill="#64748B">13/09/2026 - 09:15</text>
          <rect y="32" width="70" height="18" rx="4" fill="#F1F5F9"/>
          <text x="8" y="45" class="font-sans" font-size="10.5" font-weight="600" fill="#475569">Thương mại</text>
        </g>

        <!-- Col 2: Khách Hàng -->
        <g transform="translate(210, 24)">
          {icon("user", 0, -2, 14, "#64748B")}
          <text x="20" y="10" class="font-sans" font-size="13" font-weight="700" fill="#0F172A">Lê Hoàng Cường</text>

          {icon("phone", 0, 22, 14, "#64748B")}
          <text x="20" y="34" class="font-sans" font-size="12" fill="#334155">0905****78</text>
          {icon("eye", 90, 22, 13, "#94A3B8")}

          {icon("map_pin", 0, 48, 14, "#E11D48")}
          <text x="20" y="58" class="font-sans" font-size="11.5" fill="#475569">88 Nguyễn Văn Linh, Hải Châu, Đà Nẵng</text>
        </g>

        <!-- Col 3: Sản Phẩm -->
        <g transform="translate(430, 24)">
          <text x="0" y="10" class="font-sans" font-size="13" font-weight="600" fill="#0F172A">Tai nghe bluetooth true wireless</text>
          <text x="0" y="32" class="font-sans" font-size="11.5" fill="#64748B">Số lượng: 1 hộp · 200 gram</text>
          <text x="0" y="54" class="font-sans" font-size="11" font-style="italic" fill="#64748B">"Hàng điện tử dễ vỡ"</text>
        </g>

        <!-- Col 4: Vận Chuyển -->
        <g transform="translate(630, 20)">
          <rect width="230" height="96" rx="8" fill="#ECFDF5" stroke="#A7F3D0"/>

          <g transform="translate(10, 18)">
            <circle cx="8" cy="8" r="8" fill="#16A34A"/>
            <text x="5" y="11" class="font-sans" font-size="9" font-weight="700" fill="#FFFFFF">1</text>
            <text x="22" y="12" class="font-sans" font-size="11" font-weight="700" fill="#0F172A">Chuyển: <tspan font-weight="500">SuperShip</tspan></text>
            <text x="135" y="12" class="font-mono" font-size="10.5" fill="#2563EB">910115661</text>
          </g>

          <line x1="18" y1="36" x2="18" y2="48" stroke="#CBD5E1" stroke-width="1.5"/>

          <g transform="translate(10, 54)">
            <circle cx="8" cy="8" r="8" fill="#16A34A"/>
            <text x="5" y="11" class="font-sans" font-size="9" font-weight="700" fill="#FFFFFF">2</text>
            <text x="22" y="12" class="font-sans" font-size="11" font-weight="700" fill="#0F172A">Giao: <tspan font-weight="700" fill="#16A34A">SPX Express</tspan></text>
            <text x="135" y="12" class="font-mono" font-size="10.5" fill="#2563EB">SPXVN0122</text>
          </g>

          <g transform="translate(10, 78)">
            <rect width="210" height="14" rx="4" fill="#D1FAE5"/>
            <text x="8" y="11" class="font-sans" font-size="9.5" font-weight="600" fill="#047857">Đã ký nhận: 13/09/2026 - 16:45</text>
          </g>
        </g>

        <!-- Col 5: Tiền Thu Khách -->
        <g transform="translate(880, 26)">
          <text x="0" y="10" class="font-sans" font-size="14" font-weight="800" fill="#16A34A">0 ₫ (Đã CK)</text>
          <text x="0" y="30" class="font-sans" font-size="11" fill="#64748B">Trị giá: 1.200.000 ₫</text>
        </g>

        <!-- Col 6: Trạng Thái -->
        <g transform="translate(980, 26)">
          <rect width="105" height="26" rx="13" fill="#ECFDF5" stroke="#A7F3D0"/>
          <text x="14" y="17" class="font-sans" font-size="11" font-weight="700" fill="#047857">Đã giao hàng</text>
        </g>

        <!-- Col 7: Tác Vụ Icons -->
        <g transform="translate(1100, 24)">
          <circle cx="-16" cy="14" r="14" fill="#F1F5F9"/>
          {icon("eye", -23, 7, 14, "#334155")}

          <circle cx="16" cy="14" r="14" fill="#F1F5F9"/>
          {icon("printer", 9, 7, 14, "#334155")}
        </g>
      </g>

      <!-- Table Footer / Pagination -->
      <g id="Table_Pagination" transform="translate(20, 510)">
        <text x="0" y="24" class="font-sans" font-size="12.5" fill="#64748B">Hiển thị 1 - 3 của tổng số 20 đơn hàng</text>

        <!-- Page Numbers on Right -->
        <g transform="translate(970, 6)">
          <rect width="28" height="28" rx="4" fill="#E11D48"/>
          <text x="10" y="19" class="font-sans" font-size="12" font-weight="700" fill="#FFFFFF">1</text>

          <rect x="36" y="0" width="28" height="28" rx="4" fill="#F1F5F9" stroke="#E2E8F0"/>
          <text x="46" y="19" class="font-sans" font-size="12" font-weight="600" fill="#475569">2</text>

          <rect x="72" y="0" width="28" height="28" rx="4" fill="#F1F5F9" stroke="#E2E8F0"/>
          <text x="82" y="19" class="font-sans" font-size="12" font-weight="600" fill="#475569">3</text>

          <rect x="108" y="0" width="28" height="28" rx="4" fill="#F1F5F9" stroke="#E2E8F0"/>
          {icon("arrow_right", 114, 6, 16, "#475569")}
        </g>
      </g>
    </g>
  </g>
</svg>
'''

# Save the full page screen SVG
for target_dir in [OUTPUT_DIR, DOCS_DIR, PUBLIC_DIR]:
    path = os.path.join(target_dir, "SCREEN_01_SHOP_ORDERS_LIST.svg")
    with open(path, "w", encoding="utf-8") as f:
        f.write(screen_svg.strip())
print("Generated SCREEN_01_SHOP_ORDERS_LIST.svg successfully in all directories!")

# -----------------------------------------------------------------------------
# Modular Component 1: Filter Section Card
# -----------------------------------------------------------------------------
filter_card_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1210 170" width="1210" height="170">
  <defs>
    <style>
      .font-sans {{ font-family: 'Inter', system-ui, -apple-system, sans-serif; }}
      .shadow-sm {{ filter: drop-shadow(0 1px 2px rgba(0,0,0,0.04)); }}
    </style>
  </defs>
  <rect width="1210" height="170" fill="#F8FAFC"/>
  <g transform="translate(20, 20)">
    <rect width="1170" height="130" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" class="shadow-sm"/>
    <g transform="translate(20, 24)">
      <text x="0" y="0" class="font-sans" font-size="13" font-weight="800" fill="#0F172A" letter-spacing="0.5">BỘ LỌC ĐƠN HÀNG</text>
      <rect x="150" y="-14" width="105" height="24" rx="12" fill="#EFF6FF"/>
      <text x="162" y="3" class="font-sans" font-size="11" font-weight="700" fill="#2563EB">Bộ lọc Shop</text>
    </g>
    <g transform="translate(20, 50)">
      <g transform="translate(0, 0)">
        <text x="0" y="0" class="font-sans" font-size="11.5" font-weight="600" fill="#475569">Thời gian tạo đơn</text>
        <rect y="8" width="260" height="38" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
        {icon("calendar", 10, 18, 16, "#64748B")}
        <text x="34" y="32" class="font-sans" font-size="12.5" fill="#0F172A">7 ngày trước (08/09 - 14/09)</text>
        {icon("chevron_down", 234, 19, 14, "#64748B")}
      </g>
      <g transform="translate(275, 0)">
        <text x="0" y="0" class="font-sans" font-size="11.5" font-weight="600" fill="#475569">Đối tác vận chuyển</text>
        <rect y="8" width="220" height="38" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
        {icon("truck", 10, 18, 16, "#64748B")}
        <text x="34" y="32" class="font-sans" font-size="12.5" fill="#0F172A">Tất cả NVC</text>
        {icon("chevron_down", 194, 19, 14, "#64748B")}
      </g>
      <g transform="translate(510, 0)">
        <text x="0" y="0" class="font-sans" font-size="11.5" font-weight="600" fill="#475569">Loại tài khoản cước</text>
        <rect y="8" width="230" height="38" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
        <text x="14" y="32" class="font-sans" font-size="12.5" fill="#0F172A">Hợp đồng Chung (SuperPlatform)</text>
        {icon("chevron_down", 204, 19, 14, "#64748B")}
      </g>
      <g transform="translate(755, 0)">
        <text x="0" y="0" class="font-sans" font-size="11.5" font-weight="600" fill="#475569">Trạng thái xử lý</text>
        <rect y="8" width="210" height="38" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
        <text x="14" y="32" class="font-sans" font-size="12.5" fill="#0F172A">Tất cả trạng thái</text>
        {icon("chevron_down", 184, 19, 14, "#64748B")}
      </g>
      <g transform="translate(980, 8)">
        <rect width="140" height="38" rx="6" fill="#E11D48"/>
        {icon("search", 24, 10, 16, "#FFFFFF")}
        <text x="48" y="24" class="font-sans" font-size="12.5" font-weight="700" fill="#FFFFFF">TÌM KIẾM</text>
      </g>
    </g>
  </g>
</svg>
'''

for target_dir in [OUTPUT_DIR, DOCS_DIR, PUBLIC_DIR]:
    path = os.path.join(target_dir, "SCREEN_01_PART_FILTER_SECTION.svg")
    with open(path, "w", encoding="utf-8") as f:
        f.write(filter_card_svg.strip())

# -----------------------------------------------------------------------------
# Modular Component 2: Single Table Row Component
# -----------------------------------------------------------------------------
row_component_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1210 190" width="1210" height="190">
  <defs>
    <style>
      .font-sans {{ font-family: 'Inter', system-ui, -apple-system, sans-serif; }}
      .font-mono {{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }}
    </style>
  </defs>
  <rect width="1210" height="190" fill="#F8FAFC"/>
  <g transform="translate(20, 20)">
    <rect width="1170" height="150" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <rect x="20" y="24" width="16" height="16" rx="3" fill="#FFFFFF" stroke="#CBD5E1"/>
    <g transform="translate(56, 26)">
      <text x="0" y="0" class="font-sans" font-size="13.5" font-weight="700" fill="#2563EB">SPF-HN-00291</text>
      {icon("copy", 108, -12, 13, "#64748B")}
      <text x="0" y="22" class="font-sans" font-size="11.5" fill="#64748B">14/09/2026 - 14:20</text>
      <rect y="32" width="70" height="18" rx="4" fill="#F1F5F9"/>
      <text x="8" y="45" class="font-sans" font-size="10.5" font-weight="600" fill="#475569">Thương mại</text>
    </g>
    <g transform="translate(210, 24)">
      {icon("user", 0, -2, 14, "#64748B")}
      <text x="20" y="10" class="font-sans" font-size="13" font-weight="700" fill="#0F172A">Nguyễn Văn An</text>
      {icon("phone", 0, 22, 14, "#64748B")}
      <text x="20" y="34" class="font-sans" font-size="12" fill="#334155">0912****56</text>
      {icon("eye", 90, 22, 13, "#94A3B8")}
      {icon("map_pin", 0, 48, 14, "#E11D48")}
      <text x="20" y="58" class="font-sans" font-size="11.5" fill="#475569">45 Tràng Tiền, Hoàn Kiếm, Hà Nội</text>
    </g>
    <g transform="translate(430, 24)">
      <text x="0" y="10" class="font-sans" font-size="13" font-weight="600" fill="#0F172A">Áo polo nam thể thao cao cấp</text>
      <text x="0" y="32" class="font-sans" font-size="11.5" fill="#64748B">Số lượng: 2 cái · 450 gram</text>
      <text x="0" y="54" class="font-sans" font-size="11" font-style="italic" fill="#64748B">"Giao giờ hành chính, gọi trước"</text>
    </g>
    <g transform="translate(630, 20)">
      <rect width="230" height="96" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
      <g transform="translate(10, 18)">
        <circle cx="8" cy="8" r="8" fill="#16A34A"/>
        <text x="5" y="11" class="font-sans" font-size="9" font-weight="700" fill="#FFFFFF">1</text>
        <text x="22" y="12" class="font-sans" font-size="11" font-weight="700" fill="#0F172A">Chuyển: <tspan font-weight="500">SuperShip</tspan></text>
        <text x="135" y="12" class="font-mono" font-size="10.5" fill="#2563EB">910115664</text>
      </g>
      <line x1="18" y1="36" x2="18" y2="48" stroke="#CBD5E1" stroke-width="1.5"/>
      <g transform="translate(10, 54)">
        <circle cx="8" cy="8" r="8" fill="#2563EB"/>
        <text x="5" y="11" class="font-sans" font-size="9" font-weight="700" fill="#FFFFFF">2</text>
        <text x="22" y="12" class="font-sans" font-size="11" font-weight="700" fill="#0F172A">Giao: <tspan font-weight="700" fill="#2563EB">GHN Express</tspan></text>
        <text x="135" y="12" class="font-mono" font-size="10.5" fill="#2563EB">GY8C1303</text>
      </g>
      <g transform="translate(10, 78)">
        <rect width="210" height="14" rx="4" fill="#EFF6FF"/>
        <text x="8" y="11" class="font-sans" font-size="9.5" font-weight="600" fill="#2563EB">Đang giao: Shipper đang phát hàng</text>
      </g>
    </g>
    <g transform="translate(880, 26)">
      <text x="0" y="10" class="font-sans" font-size="14" font-weight="800" fill="#E11D48">350.000 ₫</text>
      <text x="0" y="30" class="font-sans" font-size="11" fill="#64748B">Trị giá: 500.000 ₫</text>
    </g>
    <g transform="translate(980, 26)">
      <rect width="105" height="26" rx="13" fill="#EFF6FF" stroke="#BFDBFE"/>
      <text x="12" y="17" class="font-sans" font-size="11" font-weight="700" fill="#2563EB">Đang giao hàng</text>
    </g>
    <g transform="translate(1100, 24)">
      <circle cx="-16" cy="14" r="14" fill="#F1F5F9"/>
      {icon("eye", -23, 7, 14, "#334155")}
      <circle cx="16" cy="14" r="14" fill="#F1F5F9"/>
      {icon("printer", 9, 7, 14, "#334155")}
    </g>
  </g>
</svg>
'''

for target_dir in [OUTPUT_DIR, DOCS_DIR, PUBLIC_DIR]:
    path = os.path.join(target_dir, "SCREEN_01_PART_ORDER_ROW.svg")
    with open(path, "w", encoding="utf-8") as f:
        f.write(row_component_svg.strip())

print("All Screen 01 SVGs generated and verified successfully!")
