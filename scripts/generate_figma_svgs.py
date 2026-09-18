#!/usr/bin/env python3
import os
import shutil

OUTPUT_DIR = "docs/figma-ui-kit"
PUBLIC_DIR = "public/figma-ui-kit"
BRAIN_DIR = "/Users/dangkhoii/.gemini/antigravity/brain/5a5b7b72-1a5d-4863-a8da-3c7b1ca88fd5/figma-ui-kit"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(BRAIN_DIR, exist_ok=True)

# -------------------------------------------------------------
# SVG Icons helper definitions
# -------------------------------------------------------------
ICONS = {
    "printer": '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="14" width="12" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="2"/>',
    "rotate": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 3v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "pencil": '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m15 5 4 4" fill="none" stroke="currentColor" stroke-width="2"/>',
    "x_circle": '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="m15 9-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m9 9 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "chevron_down": '<path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "chevron_up": '<path d="m18 15-6-6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "check": '<path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "truck": '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 18H9" stroke="currentColor" stroke-width="2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.23-4.27a1 1 0 0 0-.78-.46H14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="2"/>',
    "map_pin": '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="2"/>',
    "shield_check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "download": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 10 12 15 17 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" x2="12" y1="15" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "upload": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 8 12 3 7 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" x2="12" y1="3" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "search": '<circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" x2="16.65" y1="21" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "plus": '<path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "file_check": '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m9 15 2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "eye": '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>',
    "save": '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 21 17 13 7 13 7 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 3 7 8 15 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "home": '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "settings": '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>',
    "info": '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" x2="12" y1="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" x2="12.01" y1="8" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "copy": '<rect width="14" height="14" x="8" y="8" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "x": '<path d="M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m6 6 12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
}

def render_icon(name, x, y, size=16, color="#000000"):
    body = ICONS.get(name, "")
    return f'<g transform="translate({x}, {y}) scale({size/24})" color="{color}">{body}</g>'

def save_svg(filename, content):
    for directory in [OUTPUT_DIR, PUBLIC_DIR, BRAIN_DIR]:
        path = os.path.join(directory, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip())
    print(f"Generated {filename}")

# =============================================================================
# 1. 01_color_tokens_and_typography.svg
# =============================================================================
svg_01 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 860" width="920" height="860">
  <defs>
    <style>
      .title {{ font-family: 'Inter', system-ui, sans-serif; font-weight: 700; fill: #0f172a; }}
      .sub {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12px; fill: #64748b; }}
      .swatch-lbl {{ font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 600; fill: #0f172a; }}
      .swatch-hex {{ font-family: 'Inter', system-ui, sans-serif; font-size: 10px; fill: #64748b; }}
      .type-label {{ font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 700; fill: #64748b; letter-spacing: 0.5px; text-transform: uppercase; }}
      .card {{ fill: #ffffff; stroke: #e2e8f0; stroke-width: 1; rx: 12px; }}
    </style>
  </defs>

  <rect width="920" height="860" fill="#f8fafc"/>

  <!-- Header -->
  <text x="32" y="44" class="title" font-size="22">SuperPlatform — Design Tokens &amp; Typography</text>
  <text x="32" y="66" class="sub">Hệ thống màu ngữ nghĩa (Color Variables) và Phông chữ chuẩn Inter cho Figma UI Kit</text>

  <!-- Section 1: Color Swatches -->
  <g transform="translate(32, 90)">
    <rect width="856" height="340" class="card"/>
    <text x="24" y="32" class="title" font-size="15">Semantic Color Tokens (Bảng màu ngữ nghĩa)</text>
    <text x="24" y="50" class="sub">Tạo Color Styles trong Figma theo cấu trúc: Category/Color-Name/Shade</text>

    <!-- Row 1: Brand Red -->
    <g transform="translate(24, 70)">
      <rect x="0" y="0" width="120" height="50" rx="8" fill="#E11D48"/>
      <text x="0" y="68" class="swatch-lbl">Brand Red</text>
      <text x="0" y="82" class="swatch-hex">#E11D48 (Primary)</text>

      <rect x="135" y="0" width="120" height="50" rx="8" fill="#BE123C"/>
      <text x="135" y="68" class="swatch-lbl">Brand Red Hover</text>
      <text x="135" y="82" class="swatch-hex">#BE123C (Hover/Dark)</text>

      <rect x="270" y="0" width="120" height="50" rx="8" fill="#FEE2E2" stroke="#FECDD3"/>
      <text x="270" y="68" class="swatch-lbl">Brand Red Soft</text>
      <text x="270" y="82" class="swatch-hex">#FEE2E2 (Banner Bg)</text>

      <rect x="405" y="0" width="120" height="50" rx="8" fill="#FFF1F2" stroke="#FECDD3"/>
      <text x="405" y="68" class="swatch-lbl">Brand Red Tint</text>
      <text x="405" y="82" class="swatch-hex">#FFF1F2 (Hover Outline)</text>
    </g>

    <!-- Row 2: Functional Colors -->
    <g transform="translate(24, 175)">
      <rect x="0" y="0" width="120" height="50" rx="8" fill="#2563EB"/>
      <text x="0" y="68" class="swatch-lbl">Action Blue</text>
      <text x="0" y="82" class="swatch-hex">#2563EB (Active/Link)</text>

      <rect x="135" y="0" width="120" height="50" rx="8" fill="#16A34A"/>
      <text x="135" y="68" class="swatch-lbl">Success Green</text>
      <text x="135" y="82" class="swatch-hex">#16A34A (Delivered/Check)</text>

      <rect x="270" y="0" width="120" height="50" rx="8" fill="#D97706"/>
      <text x="270" y="68" class="swatch-lbl">Warning Amber</text>
      <text x="270" y="82" class="swatch-hex">#D97706 (Delay/Alert)</text>

      <rect x="405" y="0" width="120" height="50" rx="8" fill="#7C3AED"/>
      <text x="405" y="68" class="swatch-lbl">Internal Purple</text>
      <text x="405" y="82" class="swatch-hex">#7C3AED (Admin/Nội bộ)</text>

      <rect x="540" y="0" width="120" height="50" rx="8" fill="#0F172A"/>
      <text x="540" y="68" class="swatch-lbl">Neutral Dark 900</text>
      <text x="540" y="82" class="swatch-hex">#0F172A (Headings)</text>

      <rect x="675" y="0" width="120" height="50" rx="8" fill="#F1F5F9" stroke="#CBD5E1"/>
      <text x="675" y="68" class="swatch-lbl">Surface Gray 100</text>
      <text x="675" y="82" class="swatch-hex">#F1F5F9 (Pill/Border)</text>
    </g>

    <!-- Row 3: Tint Backgrounds -->
    <g transform="translate(24, 280)">
      <rect x="0" y="0" width="95" height="24" rx="4" fill="#EFF6FF" stroke="#BFDBFE"/>
      <text x="8" y="16" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#2563EB">Shop Pill Bg</text>

      <rect x="110" y="0" width="95" height="24" rx="4" fill="#F5F3FF" stroke="#DDD6FE"/>
      <text x="8" y="16" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#7C3AED">Internal Pill Bg</text>

      <rect x="220" y="0" width="95" height="24" rx="4" fill="#ECFDF5" stroke="#A7F3D0"/>
      <text x="8" y="16" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#047857">Success Pill Bg</text>

      <rect x="330" y="0" width="95" height="24" rx="4" fill="#FFFBEB" stroke="#FDE68A"/>
      <text x="8" y="16" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#B45309">Warning Pill Bg</text>

      <rect x="440" y="0" width="95" height="24" rx="4" fill="#FEF2F2" stroke="#FECDD3"/>
      <text x="8" y="16" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#DC2626">Error Pill Bg</text>
    </g>
  </g>

  <!-- Section 2: Typography Scale -->
  <g transform="translate(32, 450)">
    <rect width="856" height="370" class="card"/>
    <text x="24" y="32" class="title" font-size="15">Typography System (Hệ thống chữ chuẩn Inter)</text>
    <text x="24" y="50" class="sub">Tạo Text Styles trong Figma: Font Inter, Line Height chuẩn, Letter-spacing tối ưu</text>

    <!-- Table Header -->
    <g transform="translate(24, 75)">
      <text x="0" y="0" class="type-label">Style Name</text>
      <text x="180" y="0" class="type-label">Size / Line Height</text>
      <text x="320" y="0" class="type-label">Weight</text>
      <text x="440" y="0" class="type-label">Sample Preview</text>
      <line x1="0" y1="12" x2="808" y2="12" stroke="#E2E8F0" stroke-width="1"/>
    </g>

    <!-- Type Rows -->
    <g transform="translate(24, 115)">
      <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#0F172A">Heading/H1 - Page</text>
      <text x="180" y="0" font-family="'Inter', sans-serif" font-size="12" fill="#64748B">24px / 32px (-0.3px)</text>
      <text x="320" y="0" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#0F172A">Bold (700)</text>
      <text x="440" y="0" font-family="'Inter', sans-serif" font-size="24" font-weight="700" fill="#0F172A">Chi tiết đơn hàng SPF-HN-00291</text>

      <line x1="0" y1="20" x2="808" y2="20" stroke="#F1F5F9" stroke-width="1"/>
    </g>

    <g transform="translate(24, 160)">
      <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#0F172A">Heading/H2 - Section</text>
      <text x="180" y="0" font-family="'Inter', sans-serif" font-size="12" fill="#64748B">18px / 26px (-0.2px)</text>
      <text x="320" y="0" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#0F172A">SemiBold (600)</text>
      <text x="440" y="0" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#0F172A">Thông tin vận chuyển &amp; Bảng tính 3 cấp</text>

      <line x1="0" y1="20" x2="808" y2="20" stroke="#F1F5F9" stroke-width="1"/>
    </g>

    <g transform="translate(24, 205)">
      <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#0F172A">Title/Stage - Cardlet</text>
      <text x="180" y="0" font-family="'Inter', sans-serif" font-size="12" fill="#64748B">13.5px / 18px (0px)</text>
      <text x="320" y="0" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#0F172A">Bold (700)</text>
      <text x="440" y="0" font-family="'Inter', sans-serif" font-size="13.5" font-weight="700" fill="#0F172A">Chặng 1: Lấy hàng (SuperShip)</text>

      <line x1="0" y1="20" x2="808" y2="20" stroke="#F1F5F9" stroke-width="1"/>
    </g>

    <g transform="translate(24, 250)">
      <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#0F172A">Body/Default</text>
      <text x="180" y="0" font-family="'Inter', sans-serif" font-size="12" fill="#64748B">14px / 20px (0px)</text>
      <text x="320" y="0" font-family="'Inter', sans-serif" font-size="12" font-weight="500" fill="#0F172A">Regular / Medium</text>
      <text x="440" y="0" font-family="'Inter', sans-serif" font-size="14" fill="#334155">231/15 Dương Bá Trạc, Phường 01, Quận 8, TP.HCM</text>

      <line x1="0" y1="20" x2="808" y2="20" stroke="#F1F5F9" stroke-width="1"/>
    </g>

    <g transform="translate(24, 295)">
      <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#0F172A">Badge / Pill Status</text>
      <text x="180" y="0" font-family="'Inter', sans-serif" font-size="12" fill="#64748B">11px / 14px (+0.2px)</text>
      <text x="320" y="0" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#0F172A">SemiBold (600)</text>
      <text x="440" y="0" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#047857">ĐÃ BÀN GIAO NHÀ VẬN CHUYỂN KHÁC</text>

      <line x1="0" y1="20" x2="808" y2="20" stroke="#F1F5F9" stroke-width="1"/>
    </g>

    <g transform="translate(24, 340)">
      <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#0F172A">Code / Raw Monospace</text>
      <text x="180" y="0" font-family="'Inter', sans-serif" font-size="12" fill="#64748B">11.5px / 15px (0px)</text>
      <text x="320" y="0" font-family="monospace" font-size="12" fill="#0F172A">Mono 500</text>
      <text x="440" y="0" font-family="monospace" font-size="11.5" font-weight="600" fill="#6D28D9">SPF_DELIVERY_FAIL_CARRIER_NOT_REACHABLE</text>
    </g>
  </g>
</svg>
'''
save_svg("01_color_tokens_and_typography.svg", svg_01)

# =============================================================================
# 2. 02_buttons_matrix.svg
# =============================================================================
svg_02 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 480" width="920" height="480">
  <defs>
    <style>
      .title {{ font-family: 'Inter', system-ui, sans-serif; font-weight: 700; fill: #0f172a; }}
      .sub {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12px; fill: #64748b; }}
      .col-lbl {{ font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 700; fill: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }}
      .btn-text-white {{ font-family: 'Inter', system-ui, sans-serif; font-size: 13px; font-weight: 700; fill: #ffffff; }}
      .btn-text-red {{ font-family: 'Inter', system-ui, sans-serif; font-size: 13px; font-weight: 700; fill: #e11d48; }}
      .btn-text-slate {{ font-family: 'Inter', system-ui, sans-serif; font-size: 13px; font-weight: 600; fill: #334155; }}
      .card {{ fill: #ffffff; stroke: #e2e8f0; stroke-width: 1; rx: 12px; }}
    </style>
  </defs>

  <rect width="920" height="480" fill="#f8fafc"/>

  <!-- Header -->
  <text x="32" y="44" class="title" font-size="22">SuperPlatform — Button Matrix &amp; Action System</text>
  <text x="32" y="66" class="sub">Ma trận các biến thể nút bấm (Primary, Outline, Toolbar, Excel Pills) dùng chung cho module Order</text>

  <!-- Section: Buttons Grid -->
  <g transform="translate(32, 90)">
    <rect width="856" height="360" class="card"/>

    <!-- Headers -->
    <g transform="translate(24, 35)">
      <text x="0" y="0" class="col-lbl">Variant Type</text>
      <text x="200" y="0" class="col-lbl">Default State (H: 40px)</text>
      <text x="420" y="0" class="col-lbl">Hover / Active State</text>
      <text x="640" y="0" class="col-lbl">Compact / Small (H: 32px)</text>
      <line x1="0" y1="12" x2="808" y2="12" stroke="#E2E8F0" stroke-width="1"/>
    </g>

    <!-- Row 1: Primary Red -->
    <g transform="translate(24, 75)">
      <text x="0" y="24" class="title" font-size="13">Primary Red</text>

      <!-- Default -->
      <rect x="200" y="0" width="170" height="40" rx="8" fill="#E11D48"/>
      {render_icon("printer", 216, 12, 16, "#FFFFFF")}
      <text x="242" y="25" class="btn-text-white">IN PHIẾU GỬI</text>

      <!-- Hover -->
      <rect x="420" y="0" width="170" height="40" rx="8" fill="#BE123C"/>
      {render_icon("printer", 436, 12, 16, "#FFFFFF")}
      <text x="462" y="25" class="btn-text-white">IN PHIẾU GỬI</text>

      <!-- Small -->
      <rect x="640" y="4" width="140" height="32" rx="6" fill="#E11D48"/>
      {render_icon("printer", 652, 12, 14, "#FFFFFF")}
      <text x="674" y="25" class="btn-text-white" font-size="12">In phiếu</text>
    </g>

    <!-- Row 2: Outline Red -->
    <g transform="translate(24, 135)">
      <text x="0" y="24" class="title" font-size="13">Outline Red</text>

      <!-- Default -->
      <rect x="200" y="0" width="170" height="40" rx="8" fill="#FFFFFF" stroke="#E11D48" stroke-width="1.5"/>
      {render_icon("rotate", 216, 12, 16, "#E11D48")}
      <text x="242" y="25" class="btn-text-red">IN LẠI TEM CŨ</text>

      <!-- Hover -->
      <rect x="420" y="0" width="170" height="40" rx="8" fill="#FFF1F2" stroke="#BE123C" stroke-width="1.5"/>
      {render_icon("rotate", 436, 12, 16, "#BE123C")}
      <text x="242" y="25" class="btn-text-red" fill="#BE123C" transform="translate(220, 0)">IN LẠI TEM CŨ</text>

      <!-- Small -->
      <rect x="640" y="4" width="140" height="32" rx="6" fill="#FFFFFF" stroke="#E11D48" stroke-width="1.5"/>
      {render_icon("rotate", 652, 12, 14, "#E11D48")}
      <text x="674" y="25" class="btn-text-red" font-size="12">In lại tem</text>
    </g>

    <!-- Row 3: Outline Slate -->
    <g transform="translate(24, 195)">
      <text x="0" y="24" class="title" font-size="13">Outline Slate</text>

      <!-- Default -->
      <rect x="200" y="0" width="170" height="40" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
      {render_icon("x_circle", 226, 12, 16, "#334155")}
      <text x="252" y="25" class="btn-text-slate">HỦY ĐƠN</text>

      <!-- Hover -->
      <rect x="420" y="0" width="170" height="40" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1"/>
      {render_icon("x_circle", 446, 12, 16, "#0F172A")}
      <text x="472" y="25" class="btn-text-slate" fill="#0F172A">HỦY ĐƠN</text>

      <!-- Small (Edit Order) -->
      <rect x="640" y="4" width="140" height="32" rx="6" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
      {render_icon("pencil", 652, 12, 14, "#334155")}
      <text x="674" y="25" class="btn-text-slate" font-size="12">Sửa đơn</text>
    </g>

    <!-- Row 4: Top Toolbar Pills -->
    <g transform="translate(24, 255)">
      <text x="0" y="24" class="title" font-size="13">Spreadsheet Pills</text>

      <!-- Pill 1: Excel Download -->
      <g transform="translate(200, 4)">
        <rect width="135" height="32" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
        {render_icon("download", 12, 8, 15, "#0F172A")}
        <text x="34" y="20" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#0F172A">Tải mẫu Excel</text>
      </g>

      <!-- Pill 2: Excel Import -->
      <g transform="translate(345, 4)">
        <rect width="135" height="32" rx="16" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
        {render_icon("upload", 12, 8, 15, "#1D4ED8")}
        <text x="34" y="20" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#1D4ED8">Nhập file Excel</text>
      </g>

      <!-- Pill 3: Add Rows -->
      <g transform="translate(490, 4)">
        <rect width="115" height="32" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
        {render_icon("plus", 12, 8, 15, "#334155")}
        <text x="34" y="20" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#334155">Thêm dòng</text>
      </g>

      <!-- Pill 4: Check Data -->
      <g transform="translate(615, 4)">
        <rect width="145" height="32" rx="16" fill="#FEF2F2" stroke="#EF4444" stroke-width="1.5"/>
        {render_icon("file_check", 12, 8, 15, "#DC2626")}
        <text x="34" y="20" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#DC2626">Kiểm tra dữ liệu</text>
      </g>
    </g>
  </g>
</svg>
'''
save_svg("02_buttons_matrix.svg", svg_02)

# =============================================================================
# 3. 03_status_badges_and_pills.svg
# =============================================================================
svg_03 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 440" width="920" height="440">
  <defs>
    <style>
      .title {{ font-family: 'Inter', system-ui, sans-serif; font-weight: 700; fill: #0f172a; }}
      .sub {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12px; fill: #64748b; }}
      .sec-title {{ font-family: 'Inter', system-ui, sans-serif; font-size: 13px; font-weight: 700; fill: #0f172a; }}
      .card {{ fill: #ffffff; stroke: #e2e8f0; stroke-width: 1; rx: 12px; }}
    </style>
  </defs>

  <rect width="920" height="440" fill="#f8fafc"/>

  <!-- Header -->
  <text x="32" y="44" class="title" font-size="22">SuperPlatform — Badges, Pills &amp; Visibility Tags</text>
  <text x="32" y="66" class="sub">Tất cả các loại huy hiệu trạng thái chặng, nhãn quyền Shop / Nội bộ và Tag nhà vận chuyển</text>

  <g transform="translate(32, 90)">
    <!-- Card 1: Stage Status Pills -->
    <rect width="856" height="150" class="card"/>
    <text x="24" y="30" class="sec-title">Stage Status Badges (Huy hiệu trạng thái chặng)</text>
    <text x="24" y="48" class="sub">Thiết kế góc tròn 9999px, padding 2.5px 9px, text SemiBold 11px, tự động cắt ngắn khi co hẹp</text>

    <g transform="translate(24, 70)">
      <!-- Done Green -->
      <g transform="translate(0, 0)">
        <rect width="180" height="24" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1"/>
        <text x="14" y="16" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#047857">Đã bàn giao nhà vận chuyển...</text>
      </g>

      <!-- Warn Yellow -->
      <g transform="translate(195, 0)">
        <rect width="185" height="24" rx="12" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1"/>
        <text x="14" y="16" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#B45309">Giao hàng không thành công</text>
      </g>

      <!-- In-transit Blue -->
      <g transform="translate(395, 0)">
        <rect width="150" height="24" rx="12" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
        <text x="14" y="16" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#2563EB">Đang đi giao hàng</text>
      </g>

      <!-- Error Red -->
      <g transform="translate(560, 0)">
        <rect width="125" height="24" rx="12" fill="#FEF2F2" stroke="#FECDD3" stroke-width="1"/>
        <text x="14" y="16" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#DC2626">Hủy đơn hàng</text>
      </g>

      <!-- Pending Slate -->
      <g transform="translate(700, 0)">
        <rect width="105" height="24" rx="12" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
        <text x="14" y="16" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#64748B">Chờ lấy hàng</text>
      </g>
    </g>

    <!-- Card 2: Role & Visibility + Carriers -->
    <g transform="translate(0, 170)">
      <rect width="856" height="150" class="card"/>
      <text x="24" y="30" class="sec-title">Visibility Role Pills &amp; Carrier Tags</text>
      <text x="24" y="48" class="sub">Nhãn định danh Shop vs Nội bộ (Admin) và định danh đối tác vận chuyển</text>

      <g transform="translate(24, 70)">
        <!-- Shop Role Pill -->
        <g transform="translate(0, 0)">
          <rect width="60" height="22" rx="11" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
          <text x="13" y="15" font-family="'Inter', sans-serif" font-size="10.5" font-weight="700" fill="#2563EB">SHOP</text>
        </g>

        <!-- Internal Role Pill -->
        <g transform="translate(75, 0)">
          <rect width="72" height="22" rx="11" fill="#F5F3FF" stroke="#DDD6FE" stroke-width="1"/>
          <text x="12" y="15" font-family="'Inter', sans-serif" font-size="10.5" font-weight="700" fill="#7C3AED">NỘI BỘ</text>
        </g>

        <!-- Carrier Tag 1 -->
        <g transform="translate(170, 0)">
          <rect width="105" height="22" rx="4" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
          <text x="10" y="15" font-family="'Inter', sans-serif" font-size="11.5" font-weight="600" fill="#475569">NVC: SuperShip</text>
        </g>

        <!-- Carrier Tag 2 -->
        <g transform="translate(290, 0)">
          <rect width="115" height="22" rx="4" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
          <text x="10" y="15" font-family="'Inter', sans-serif" font-size="11.5" font-weight="600" fill="#475569">NVC: SPX Express</text>
        </g>

        <!-- Carrier Tag 3 -->
        <g transform="translate(420, 0)">
          <rect width="105" height="22" rx="4" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
          <text x="10" y="15" font-family="'Inter', sans-serif" font-size="11.5" font-weight="600" fill="#475569">NVC: BEST</text>
        </g>

        <!-- Carrier Tag 4 -->
        <g transform="translate(540, 0)">
          <rect width="85" height="22" rx="4" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
          <text x="10" y="15" font-family="'Inter', sans-serif" font-size="11.5" font-weight="600" fill="#475569">NVC: GHN</text>
        </g>

        <!-- Raw Monospace Code Pill -->
        <g transform="translate(640, 0)">
          <rect width="165" height="22" rx="4" fill="#EDE9FE" stroke="#DDD6FE" stroke-width="1"/>
          <text x="10" y="15" font-family="monospace" font-size="10.5" font-weight="600" fill="#6D28D9">SPF_DELIVERY_OUT</text>
        </g>
      </g>
    </g>
  </g>
</svg>
'''
save_svg("03_status_badges_and_pills.svg", svg_03)

# =============================================================================
# 4. 04_stage_cardlets_anti_collision.svg (THE 2-ROW NON-OVERLAPPING ARCHITECTURE)
# =============================================================================
svg_04 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 680" width="920" height="680">
  <defs>
    <style>
      .title {{ font-family: 'Inter', system-ui, sans-serif; font-weight: 700; fill: #0f172a; }}
      .sub {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12px; fill: #64748b; }}
      .stage-title {{ font-family: 'Inter', system-ui, sans-serif; font-size: 13.5px; font-weight: 700; fill: #0f172a; }}
      .carrier-tag-text {{ font-family: 'Inter', system-ui, sans-serif; font-size: 11.5px; font-weight: 600; fill: #475569; }}
      .badge-text-done {{ font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 600; fill: #047857; }}
      .badge-text-warn {{ font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 600; fill: #b45309; }}
      .cardlet {{ fill: #ffffff; stroke: #e2e8f0; stroke-width: 1; rx: 10px; }}
      .banner-red {{ fill: #fef2f2; rx: 6px; }}
      .banner-text {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12px; font-weight: 700; fill: #dc2626; text-transform: uppercase; letter-spacing: 0.5px; }}
    </style>
  </defs>

  <rect width="920" height="680" fill="#f8fafc"/>

  <!-- Header -->
  <text x="32" y="44" class="title" font-size="22">Order Stage Cardlets — 2-Row Anti-Collision Architecture</text>
  <text x="32" y="66" class="sub">Thiết kế thẻ chặng hành trình 2 dòng độc lập, tính toán pixel chuẩn xác loại bỏ 100% hiện tượng đè chữ</text>

  <g transform="translate(32, 90)">
    <!-- Column 1: Chặng 1 Lấy hàng (Done - Collapsed) -->
    <g transform="translate(0, 0)">
      <!-- Flow Banner -->
      <rect width="400" height="26" class="banner-red"/>
      <rect x="0" y="0" width="4" height="26" rx="2" fill="#E11D48"/>
      <text x="16" y="17" class="banner-text">LẤY HÀNG</text>

      <!-- Stepper & Line -->
      <g transform="translate(10, 42)">
        <circle cx="14" cy="14" r="14" fill="#16A34A"/>
        {render_icon("check", 6, 6, 16, "#FFFFFF")}
        <line x1="14" y1="36" x2="14" y2="76" stroke="#CBD5E1" stroke-width="2"/>
      </g>

      <!-- Cardlet Box (2-Row Design) -->
      <g transform="translate(50, 36)">
        <rect width="350" height="64" class="cardlet"/>

        <!-- Row 1: Title + Chevron -->
        <g transform="translate(14, 20)">
          <text x="0" y="0" class="stage-title">Chặng 1: Lấy hàng</text>
          {render_icon("chevron_down", 305, -12, 16, "#64748B")}
        </g>

        <!-- Row 2: Carrier Tag + Status Badge -->
        <g transform="translate(14, 38)">
          <!-- Left: Carrier -->
          <rect width="95" height="18" rx="4" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
          <text x="8" y="13" class="carrier-tag-text">NVC: SuperShip</text>

          <!-- Right: Status Badge (Green Done) -->
          <g transform="translate(145, 0)">
            <rect width="175" height="18" rx="9" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1"/>
            <text x="10" y="13" class="badge-text-done">Đã bàn giao nhà vận chuyển khác</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Column 2: Chặng 2 Giao hàng (Warning - Collapsed) -->
    <g transform="translate(0, 130)">
      <!-- Flow Banner -->
      <rect width="400" height="26" class="banner-red"/>
      <rect x="0" y="0" width="4" height="26" rx="2" fill="#E11D48"/>
      <text x="16" y="17" class="banner-text">GIAO HÀNG</text>

      <!-- Stepper & Line -->
      <g transform="translate(10, 42)">
        <circle cx="14" cy="14" r="14" fill="#FEF3C7"/>
        <text x="10" y="19" font-family="'Inter', sans-serif" font-size="14" font-weight="800" fill="#D97706">!</text>
        <line x1="14" y1="36" x2="14" y2="76" stroke="#CBD5E1" stroke-width="2"/>
      </g>

      <!-- Cardlet Box (2-Row Design) -->
      <g transform="translate(50, 36)">
        <rect width="350" height="64" class="cardlet"/>

        <!-- Row 1: Title + Chevron -->
        <g transform="translate(14, 20)">
          <text x="0" y="0" class="stage-title">Chặng 2: Giao hàng</text>
          {render_icon("chevron_down", 305, -12, 16, "#64748B")}
        </g>

        <!-- Row 2: Carrier Tag + Status Badge -->
        <g transform="translate(14, 38)">
          <!-- Left: Carrier -->
          <rect width="88" height="18" rx="4" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
          <text x="8" y="13" class="carrier-tag-text">NVC: BEST</text>

          <!-- Right: Status Badge (Yellow Warn) -->
          <g transform="translate(155, 0)">
            <rect width="165" height="18" rx="9" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1"/>
            <text x="10" y="13" class="badge-text-warn">Giao hàng không thành công</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Column 3: Chặng 3 Hoàn hàng (Expanded with Event List) -->
    <g transform="translate(440, 0)">
      <!-- Flow Banner -->
      <rect width="416" height="26" class="banner-red"/>
      <rect x="0" y="0" width="4" height="26" rx="2" fill="#E11D48"/>
      <text x="16" y="17" class="banner-text">HOÀN HÀNG · LẤY HÀNG → GIAO HÀNG</text>

      <!-- Stepper -->
      <g transform="translate(10, 42)">
        <circle cx="14" cy="14" r="14" fill="#FEF3C7"/>
        <text x="10" y="19" font-family="'Inter', sans-serif" font-size="14" font-weight="800" fill="#D97706">!</text>
      </g>

      <!-- Cardlet Box (Expanded) -->
      <g transform="translate(50, 36)">
        <rect width="366" height="420" class="cardlet"/>

        <!-- Header Part (2-Row) -->
        <rect width="366" height="64" rx="10" fill="#FAFAFA"/>
        <line x1="0" y1="64" x2="366" y2="64" stroke="#F1F5F9" stroke-width="1"/>

        <!-- Row 1: Title + ChevronUp -->
        <g transform="translate(14, 22)">
          <text x="0" y="0" class="stage-title">Chặng 3: Hoàn hàng</text>
          {render_icon("chevron_up", 320, -12, 16, "#64748B")}
        </g>

        <!-- Row 2: Carrier Tag + Status Badge -->
        <g transform="translate(14, 40)">
          <rect width="95" height="18" rx="4" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
          <text x="8" y="13" class="carrier-tag-text">NVC: SuperShip</text>

          <g transform="translate(145, 0)">
            <rect width="190" height="18" rx="9" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1"/>
            <text x="10" y="13" class="badge-text-warn">Xuất hàng khỏi trung tâm...</text>
          </g>
        </g>

        <!-- Expanded Event List Body -->
        <g transform="translate(16, 80)">
          <!-- Event Line 1 -->
          <g transform="translate(0, 0)">
            <circle cx="5" cy="8" r="4" fill="#D97706"/>
            <text x="18" y="10" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#0F172A">SuperShip <tspan font-weight="400" fill="#475569">— Xuất hàng khỏi trung tâm</tspan></text>
            <text x="250" y="10" font-family="'Inter', sans-serif" font-size="11" fill="#64748B">26/08 - 14:15</text>
            <!-- Meta tags -->
            <g transform="translate(18, 16)">
              <rect width="45" height="16" rx="8" fill="#EFF6FF" stroke="#BFDBFE"/>
              <text x="7" y="11" font-family="'Inter', sans-serif" font-size="9" font-weight="700" fill="#2563EB">SHOP</text>
            </g>
          </g>

          <line x1="0" y1="46" x2="334" y2="46" stroke="#F1F5F9" stroke-width="1"/>

          <!-- Event Line 2 (Internal Style) -->
          <g transform="translate(0, 56)">
            <rect x="-6" y="-6" width="346" height="52" rx="6" fill="#FAF5FF"/>
            <circle cx="5" cy="8" r="4" fill="#6D28D9"/>
            <text x="18" y="10" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#0F172A">SuperShip <tspan font-weight="400" fill="#475569">— Nhập kho trung chuyển</tspan></text>
            <text x="250" y="10" font-family="'Inter', sans-serif" font-size="11" fill="#64748B">26/08 - 11:30</text>
            <!-- Internal tag & Raw code -->
            <g transform="translate(18, 16)">
              <rect width="55" height="16" rx="8" fill="#F5F3FF" stroke="#DDD6FE"/>
              <text x="7" y="11" font-family="'Inter', sans-serif" font-size="9" font-weight="700" fill="#7C3AED">NỘI BỘ</text>
              <rect x="62" y="0" width="130" height="16" rx="4" fill="#EDE9FE" stroke="#DDD6FE"/>
              <text x="68" y="11" font-family="monospace" font-size="9" font-weight="600" fill="#6D28D9">SPF_HUB_INBOUND</text>
            </g>
          </g>

          <line x1="0" y1="118" x2="334" y2="118" stroke="#F1F5F9" stroke-width="1"/>

          <!-- Event Line 3 -->
          <g transform="translate(0, 130)">
            <circle cx="5" cy="8" r="4" fill="#64748B"/>
            <text x="18" y="10" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#0F172A">SuperShip <tspan font-weight="400" fill="#475569">— Đã nhận yêu cầu chuyển hoàn</tspan></text>
            <text x="250" y="10" font-family="'Inter', sans-serif" font-size="11" fill="#64748B">26/08 - 09:00</text>
            <g transform="translate(18, 16)">
              <rect width="45" height="16" rx="8" fill="#EFF6FF" stroke="#BFDBFE"/>
              <text x="7" y="11" font-family="'Inter', sans-serif" font-size="9" font-weight="700" fill="#2563EB">SHOP</text>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>
'''
save_svg("04_stage_cardlets_anti_collision.svg", svg_04)

# =============================================================================
# 5. 05_detail_bottom_toolbar.svg (FIXED DOCKED BOTTOM ACTION TOOLBAR)
# =============================================================================
svg_05 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 200" width="1080" height="200">
  <defs>
    <style>
      .title {{ font-family: 'Inter', system-ui, sans-serif; font-weight: 700; fill: #0f172a; }}
      .sub {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12px; fill: #64748b; }}
      .btn-white {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12.5px; font-weight: 700; fill: #ffffff; letter-spacing: 0.3px; }}
      .btn-red {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12.5px; font-weight: 700; fill: #e11d48; letter-spacing: 0.3px; }}
      .btn-slate {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12.5px; font-weight: 700; fill: #334155; letter-spacing: 0.3px; }}
      .note-badge {{ font-family: 'Inter', system-ui, sans-serif; font-size: 10px; font-weight: 700; fill: #2563eb; }}
    </style>
  </defs>

  <rect width="1080" height="200" fill="#f8fafc"/>

  <text x="32" y="36" class="title" font-size="18">Order Detail — Fixed Docked Bottom Toolbar (4 Equal-Width Action Buttons)</text>
  <text x="32" y="56" class="sub">Thanh điều hướng cố định mép dưới màn hình, 4 nút chia đều bằng nhau (flex: 1), căn lề chạm khít mép Sidebar 220px</text>

  <!-- Pinned Toolbar Component -->
  <g transform="translate(32, 80)">
    <!-- Backdrop bar -->
    <rect width="1016" height="68" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>

    <!-- 4 Buttons (Each width 232px, gap 16px) -->
    <!-- Button 1: IN PHIẾU GỬI -->
    <g transform="translate(16, 14)">
      <rect width="232" height="40" rx="8" fill="#E11D48"/>
      {render_icon("printer", 44, 12, 16, "#FFFFFF")}
      <text x="70" y="25" class="btn-white">IN PHIẾU GỬI</text>
    </g>

    <!-- Button 2: IN LẠI TEM CŨ -->
    <g transform="translate(264, 14)">
      <rect width="232" height="40" rx="8" fill="#FFFFFF" stroke="#E11D48" stroke-width="1.5"/>
      {render_icon("rotate", 44, 12, 16, "#E11D48")}
      <text x="70" y="25" class="btn-red">IN LẠI TEM CŨ</text>
    </g>

    <!-- Button 3: CHỈNH SỬA ĐƠN -->
    <g transform="translate(512, 14)">
      <rect width="232" height="40" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
      {render_icon("pencil", 40, 12, 16, "#334155")}
      <text x="66" y="25" class="btn-slate">CHỈNH SỬA ĐƠN</text>
    </g>

    <!-- Button 4: HỦY ĐƠN -->
    <g transform="translate(760, 14)">
      <rect width="232" height="40" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
      {render_icon("x_circle", 64, 12, 16, "#334155")}
      <text x="90" y="25" class="btn-slate">HỦY ĐƠN</text>
    </g>
  </g>
</svg>
'''
save_svg("05_detail_bottom_toolbar.svg", svg_05)

# =============================================================================
# 6. 06_bulk_orders_docked_control_panel.svg (BULK SPREADSHEET DOCKED CONTROL PANEL)
# =============================================================================
svg_06 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1140 320" width="1140" height="320">
  <defs>
    <style>
      .title {{ font-family: 'Inter', system-ui, sans-serif; font-weight: 700; fill: #0f172a; }}
      .sub {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12px; fill: #64748b; }}
      .card-title {{ font-family: 'Inter', system-ui, sans-serif; font-size: 13.5px; font-weight: 700; fill: #0f172a; }}
      .card-link {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12px; font-weight: 600; fill: #dc2626; }}
      .btn-grid-lbl {{ font-family: 'Inter', system-ui, sans-serif; font-size: 11.5px; font-weight: 600; fill: #ffffff; }}
      .btn-grid-lbl-red {{ font-family: 'Inter', system-ui, sans-serif; font-size: 11.5px; font-weight: 600; fill: #dc2626; }}
    </style>
  </defs>

  <rect width="1140" height="320" fill="#f8fafc"/>

  <text x="32" y="36" class="title" font-size="18">Bulk Orders — Pinned Docked Control Panel (Thanh điều khiển cố định)</text>
  <text x="32" y="56" class="sub">Cố định ở đáy màn hình khi cuộn bảng tính lên/xuống. Khít lề sidebar 220px, màu nền trắng tinh khôi (#ffffff)</text>

  <!-- Pinned Panel -->
  <g transform="translate(32, 75)">
    <rect width="1076" height="225" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>

    <!-- Row 1: Status Bar -->
    <g transform="translate(16, 12)">
      <rect width="1044" height="42" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>

      <!-- Left: Draft selector & timestamp -->
      <g transform="translate(16, 26)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#0F172A">Lưu nháp:</text>

        <!-- Radio Tu Dong -->
        <circle cx="85" cy="-4" r="6" fill="none" stroke="#64748B" stroke-width="1.5"/>
        <text x="96" y="0" font-family="'Inter', sans-serif" font-size="12.5" fill="#334155">Tự động</text>

        <!-- Radio Thu Cong (Active) -->
        <circle cx="165" cy="-4" r="6" fill="none" stroke="#E11D48" stroke-width="1.5"/>
        <circle cx="165" cy="-4" r="3" fill="#E11D48"/>
        <text x="176" y="0" font-family="'Inter', sans-serif" font-size="12.5" font-weight="600" fill="#0F172A">Thủ công</text>

        <!-- Timestamp -->
        <text x="255" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#0F172A">14/09/2026 - 12:08:24</text>
      </g>

      <!-- Right: Action Triggers -->
      <g transform="translate(560, 6)">
        <!-- Find Errors -->
        <g transform="translate(0, 0)">
          <rect width="200" height="30" rx="6" fill="#FFFFFF" stroke="#EF4444" stroke-width="1.5"/>
          {render_icon("eye", 10, 7, 15, "#EF4444")}
          <text x="32" y="19" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#EF4444">Tìm Ô Chưa Điền [0]</text>
        </g>

        <!-- Check Data -->
        <g transform="translate(210, 0)">
          <rect width="135" height="30" rx="6" fill="#EF4444"/>
          <text x="14" y="19" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#FFFFFF">✓ Kiểm Tra Dữ Liệu</text>
        </g>

        <!-- Create Bulk -->
        <g transform="translate(355, 0)">
          <rect width="120" height="30" rx="6" fill="#16A34A"/>
          <text x="12" y="19" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#FFFFFF">Tạo Nhiều Đơn</text>
        </g>
      </g>
    </g>

    <!-- Row 2: 3 Cards Grid -->
    <g transform="translate(16, 64)">
      <!-- Card 1: 2x3 Buttons (width 430) -->
      <g transform="translate(0, 0)">
        <rect width="430" height="145" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>

        <!-- Top 3 Buttons -->
        <g transform="translate(12, 16)">
          <!-- Save Draft -->
          <rect width="128" height="48" rx="6" fill="#0284C7"/>
          {render_icon("save", 10, 16, 15, "#FFFFFF")}
          <text x="32" y="30" class="btn-grid-lbl">Lưu Nháp</text>

          <!-- Restore -->
          <g transform="translate(138, 0)">
            <rect width="128" height="48" rx="6" fill="#16A34A"/>
            {render_icon("rotate", 8, 16, 15, "#FFFFFF")}
            <text x="28" y="30" class="btn-grid-lbl">Khôi Phục</text>
          </g>

          <!-- Add Rows -->
          <g transform="translate(276, 0)">
            <rect width="130" height="48" rx="6" fill="#EA580C"/>
            {render_icon("plus", 8, 16, 15, "#FFFFFF")}
            <text x="28" y="30" class="btn-grid-lbl">Thêm Dòng</text>
          </g>
        </g>

        <!-- Bottom 3 Buttons (Outlined Red) -->
        <g transform="translate(12, 78)">
          <!-- Toggle Guide -->
          <rect width="128" height="48" rx="6" fill="#FFFFFF" stroke="#EF4444" stroke-width="1.2"/>
          {render_icon("info", 10, 16, 15, "#DC2626")}
          <text x="30" y="30" class="btn-grid-lbl-red">Ẩn/Hiện HD</text>

          <!-- Return Home -->
          <g transform="translate(138, 0)">
            <rect width="128" height="48" rx="6" fill="#FFFFFF" stroke="#EF4444" stroke-width="1.2"/>
            {render_icon("home", 8, 16, 15, "#DC2626")}
            <text x="28" y="30" class="btn-grid-lbl-red">Trang Chủ</text>
          </g>

          <!-- Defaults -->
          <g transform="translate(276, 0)">
            <rect width="130" height="48" rx="6" fill="#FFFFFF" stroke="#EF4444" stroke-width="1.2"/>
            {render_icon("settings", 8, 16, 15, "#DC2626")}
            <text x="28" y="30" class="btn-grid-lbl-red">Cấu Hình</text>
          </g>
        </g>
      </g>

      <!-- Card 2: Shipping Method (width 270) -->
      <g transform="translate(442, 0)">
        <rect width="270" height="145" rx="8" fill="#FFFFFF" stroke="#BFDBFE"/>
        <!-- Header -->
        <g transform="translate(14, 22)">
          {render_icon("truck", 0, -4, 18, "#2563EB")}
          <text x="26" y="10" class="card-title">Phương thức</text>
          <text x="195" y="10" class="card-link">Thay đổi</text>
        </g>

        <!-- Content -->
        <g transform="translate(14, 66)">
          <text x="0" y="0" font-family="'Inter', sans-serif" font-size="12" fill="#E11D48">Một nhà vận chuyển mặc định</text>
          <text x="0" y="26" font-family="'Inter', sans-serif" font-size="15" font-weight="800" fill="#0284C7">SPX Express</text>
        </g>
      </g>

      <!-- Card 3: Pickup Address (width 320) -->
      <g transform="translate(724, 0)">
        <rect width="320" height="145" rx="8" fill="#FFFFFF" stroke="#FECDD3"/>
        <!-- Header -->
        <g transform="translate(14, 22)">
          {render_icon("map_pin", 0, -4, 18, "#E11D48")}
          <text x="26" y="10" class="card-title">Địa chỉ lấy hàng</text>
          <text x="245" y="10" class="card-link">Thay đổi</text>
        </g>

        <!-- Content -->
        <g transform="translate(14, 58)">
          <text x="0" y="0" font-family="'Inter', sans-serif" font-size="11.5" fill="#334155">231/15 Dương Bá Trạc, Phường 01,</text>
          <text x="0" y="18" font-family="'Inter', sans-serif" font-size="11.5" fill="#334155">Quận 8, Thành phố Hồ Chí Minh</text>
          <text x="0" y="44" font-family="'Inter', sans-serif" font-size="12.5" font-weight="700" fill="#0F172A">S275518 - AB - 039****077</text>
          {render_icon("eye", 175, 30, 14, "#64748B")}
        </g>
      </g>
    </g>
  </g>
</svg>
'''
save_svg("06_bulk_orders_docked_control_panel.svg", svg_06)

# =============================================================================
# 7. 07_collapsible_guide_banner.svg
# =============================================================================
svg_07 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 340" width="920" height="340">
  <defs>
    <style>
      .title {{ font-family: 'Inter', system-ui, sans-serif; font-weight: 700; fill: #dc2626; }}
      .sub {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12px; fill: #64748b; }}
      .step-bold {{ font-family: 'Inter', system-ui, sans-serif; font-size: 13px; font-weight: 700; fill: #0f172a; }}
      .step-body {{ font-family: 'Inter', system-ui, sans-serif; font-size: 13px; fill: #334155; }}
      .guide-card {{ fill: #ffffff; stroke: #fee2e2; stroke-width: 1.5; rx: 14px; }}
    </style>
  </defs>

  <rect width="920" height="340" fill="#f8fafc"/>

  <!-- Top Banner (Positioned above table) -->
  <g transform="translate(32, 25)">
    <rect width="856" height="280" class="guide-card"/>

    <!-- Header Row: Title & Close Button -->
    <g transform="translate(24, 30)">
      <text x="0" y="0" class="title" font-size="16">Hướng Dẫn Sử Dụng</text>
      <!-- Close Button Circle -->
      <g transform="translate(780, -14)">
        <circle cx="12" cy="12" r="14" fill="#F1F5F9"/>
        {render_icon("x", 4, 4, 16, "#64748B")}
      </g>
    </g>

    <!-- Body Steps -->
    <g transform="translate(24, 70)">
      <!-- Step 1 -->
      <g transform="translate(0, 0)">
        <text x="0" y="0" class="step-bold">Bước 1: <tspan class="step-body">Nhập vào các thông tin bắt buộc: </tspan><tspan font-weight="700">Tên Người Nhận, SĐT Người Nhận, Địa Chỉ Chi Tiết, Khối Lượng (gram), COD.</tspan></text>
        <text x="0" y="20" font-family="'Inter', sans-serif" font-size="12" fill="#64748B">Tick chọn ô "Đổi Lấy Hàng Về" (nếu có nhu cầu) và ghi chú giao hàng. Các trường có dấu [*] là bắt buộc.</text>
      </g>

      <!-- Step 2 -->
      <g transform="translate(0, 56)">
        <text x="0" y="0" class="step-bold">Bước 2: <tspan class="step-body">Tại cột Tỉnh/Thành Phố, Phường/Xã </tspan><tspan font-weight="700" fill="#E11D48">SuperAI</tspan><tspan class="step-body"> sẽ tự động gợi ý tuyến chuẩn hóa khi điền Địa Chỉ Chi Tiết.</tspan></text>
        <rect x="0" y="12" width="808" height="42" rx="6" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1"/>
        <text x="12" y="28" font-family="'Inter', sans-serif" font-size="11.5" font-weight="600" fill="#B45309">Lưu ý: Các ô được tô nền xanh dương nhạt là các ô chuyển đổi từ Địa Chỉ 3 Cấp sang 2 Cấp, vui lòng kiểm tra lại.</text>
      </g>

      <!-- Step 3 -->
      <g transform="translate(0, 140)">
        <text x="0" y="0" class="step-bold">Bước 3: <tspan class="step-body">Bấm </tspan><tspan font-weight="700" fill="#DC2626">✓ Kiểm Tra Dữ Liệu</tspan><tspan class="step-body"> để hệ thống xác thực dữ liệu hợp lệ (tô màu xanh lá). Sau đó bấm </tspan><tspan font-weight="700" fill="#16A34A">Tạo Nhiều Đơn Hàng</tspan><tspan class="step-body"> để tạo đơn.</tspan></text>
      </g>
    </g>
  </g>
</svg>
'''
save_svg("07_collapsible_guide_banner.svg", svg_07)

# =============================================================================
# 8. 08_role_switcher_header_popover.svg
# =============================================================================
svg_08 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 440" width="540" height="440">
  <defs>
    <style>
      .title {{ font-family: 'Inter', system-ui, sans-serif; font-weight: 700; fill: #0f172a; }}
      .sub {{ font-family: 'Inter', system-ui, sans-serif; font-size: 12px; fill: #64748b; }}
      .popover-card {{ fill: #ffffff; stroke: #e2e8f0; stroke-width: 1; rx: 12px; filter: drop-shadow(0 10px 25px rgba(0,0,0,0.08)); }}
    </style>
  </defs>

  <rect width="540" height="440" fill="#f8fafc"/>

  <!-- Header Account Pill -->
  <g transform="translate(130, 30)">
    <rect width="280" height="40" rx="20" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
    {render_icon("shield_check", 14, 10, 18, "#16A34A")}
    <text x="40" y="25" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#0F172A">S275518 - AB (Shop)</text>
    {render_icon("chevron_down", 248, 12, 16, "#64748B")}
  </g>

  <!-- Popover Dropdown Card -->
  <g transform="translate(110, 90)">
    <rect width="320" height="310" class="popover-card"/>

    <!-- Popover Title -->
    <g transform="translate(20, 28)">
      <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#0F172A">Chế độ xem dữ liệu</text>
      <text x="0" y="18" class="sub">Nơi DUY NHẤT quyết định phân quyền giao diện</text>
    </g>

    <!-- Option 1: Shop Mode (Active) -->
    <g transform="translate(16, 68)">
      <rect width="288" height="74" rx="8" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1.5"/>
      <text x="16" y="26" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#1D4ED8">🏪 Giao diện Shop</text>
      <text x="16" y="46" font-family="'Inter', sans-serif" font-size="11.5" fill="#64748B">Mã: S275518 - AB (Khách hàng)</text>
      {render_icon("check", 256, 26, 18, "#1D4ED8")}
    </g>

    <!-- Option 2: Internal Mode -->
    <g transform="translate(16, 154)">
      <rect width="288" height="74" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
      <text x="16" y="26" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#6D28D9">🔒 Giao diện Nội bộ</text>
      <text x="16" y="46" font-family="'Inter', sans-serif" font-size="11.5" fill="#64748B">Admin / CSKH / Điều phối vận hành</text>
    </g>

    <line x1="16" y1="244" x2="304" y2="244" stroke="#E2E8F0" stroke-width="1"/>

    <!-- Bottom Link -->
    <text x="96" y="276" font-family="'Inter', sans-serif" font-size="12.5" font-weight="600" fill="#DC2626">Xem chi tiết tài khoản</text>
  </g>
</svg>
'''
save_svg("08_role_switcher_header_popover.svg", svg_08)

# =============================================================================
# 9. MASTER_SUPERPLATFORM_ORDER_DESIGN_SYSTEM.svg (ALL-IN-ONE FIGMA BOARD)
# =============================================================================
master_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 1800" width="2400" height="1800">
  <defs>
    <style>
      .master-canvas {{ fill: #0f172a; }}
      .board-title {{ font-family: 'Inter', system-ui, sans-serif; font-size: 32px; font-weight: 800; fill: #ffffff; letter-spacing: -0.5px; }}
      .board-sub {{ font-family: 'Inter', system-ui, sans-serif; font-size: 15px; fill: #94a3b8; }}
      .frame-bg {{ fill: #ffffff; rx: 16px; stroke: #334155; stroke-width: 1; }}
      .frame-header {{ font-family: 'Inter', system-ui, sans-serif; font-size: 16px; font-weight: 700; fill: #38bdf8; }}
    </style>
  </defs>

  <!-- Dark Master Background -->
  <rect width="2400" height="1800" class="master-canvas"/>

  <!-- Master Canvas Title Bar -->
  <g transform="translate(60, 60)">
    <rect width="180" height="34" rx="17" fill="#E11D48"/>
    <text x="24" y="22" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">SUPERPLATFORM</text>
    <text x="200" y="24" class="board-title">Order Module — Figma UI Framework &amp; Component Kit 2026</text>
    <text x="200" y="52" class="board-sub">Tất cả các Vector Components, Tokens và Layouts chuẩn hóa. Kéo thả file .svg này trực tiếp vào Figma để làm việc.</text>
  </g>

  <!-- Board 1: Color Tokens & Typography (Top Left: 60, 140) -->
  <g transform="translate(60, 140)">
    <text x="0" y="-12" class="frame-header">01. DESIGN TOKENS &amp; TYPOGRAPHY SCALE</text>
    <g transform="scale(0.82)">
      {svg_01.split('<svg')[1].split('>', 1)[1].rsplit('</svg>', 1)[0]}
    </g>
  </g>

  <!-- Board 2: Button System Matrix (Top Center: 850, 140) -->
  <g transform="translate(850, 140)">
    <text x="0" y="-12" class="frame-header">02. BUTTON MATRIX &amp; ACTION SYSTEM</text>
    <g transform="scale(0.82)">
      {svg_02.split('<svg')[1].split('>', 1)[1].rsplit('</svg>', 1)[0]}
    </g>
  </g>

  <!-- Board 3: Badges & Pills (Center: 850, 560) -->
  <g transform="translate(850, 560)">
    <text x="0" y="-12" class="frame-header">03. STATUS BADGES, PILLS &amp; CARRIER TAGS</text>
    <g transform="scale(0.82)">
      {svg_03.split('<svg')[1].split('>', 1)[1].rsplit('</svg>', 1)[0]}
    </g>
  </g>

  <!-- Board 4: Stage Cardlets Anti-Collision (Top Right: 1640, 140) -->
  <g transform="translate(1640, 140)">
    <text x="0" y="-12" class="frame-header">04. ORDER STAGE CARDLETS (2-ROW ANTI-COLLISION)</text>
    <g transform="scale(0.82)">
      {svg_04.split('<svg')[1].split('>', 1)[1].rsplit('</svg>', 1)[0]}
    </g>
  </g>

  <!-- Board 5: Detail Bottom Fixed Toolbar (Bottom Left: 60, 980) -->
  <g transform="translate(60, 980)">
    <text x="0" y="-12" class="frame-header">05. DETAIL BOTTOM FIXED TOOLBAR (4 EQUAL BUTTONS)</text>
    <g transform="scale(0.82)">
      {svg_05.split('<svg')[1].split('>', 1)[1].rsplit('</svg>', 1)[0]}
    </g>
  </g>

  <!-- Board 6: Bulk Orders Docked Control Panel (Bottom Center: 60, 1180) -->
  <g transform="translate(60, 1180)">
    <text x="0" y="-12" class="frame-header">06. BULK ORDERS DOCKED CONTROL PANEL (STATUS BAR &amp; 3 CARDS)</text>
    <g transform="scale(0.82)">
      {svg_06.split('<svg')[1].split('>', 1)[1].rsplit('</svg>', 1)[0]}
    </g>
  </g>

  <!-- Board 7: Collapsible Guide Banner (Bottom Right: 1040, 980) -->
  <g transform="translate(1040, 980)">
    <text x="0" y="-12" class="frame-header">07. COLLAPSIBLE GUIDE BANNER (TOP POSITION)</text>
    <g transform="scale(0.82)">
      {svg_07.split('<svg')[1].split('>', 1)[1].rsplit('</svg>', 1)[0]}
    </g>
  </g>

  <!-- Board 8: Role Switcher Popover (Bottom Right Corner: 1820, 980) -->
  <g transform="translate(1820, 980)">
    <text x="0" y="-12" class="frame-header">08. ROLE SWITCHER POPOVER (SHOP VS NỘI BỘ)</text>
    <g transform="scale(0.82)">
      {svg_08.split('<svg')[1].split('>', 1)[1].rsplit('</svg>', 1)[0]}
    </g>
  </g>
</svg>
'''
save_svg("MASTER_SUPERPLATFORM_ORDER_DESIGN_SYSTEM.svg", master_svg)

print("All 9 Figma SVG Design System files generated successfully!")
