# Carrier fixture registry

Nguồn ưu tiên của registry này:

1. Danh sách mã NVC được Product/Business cung cấp ngày 19/09/2026.
2. `SuperShip - API CONTRACT MODULE ORDER (3).md`, baseline `1.3.0`.
3. Database Dictionary Module Order `v0.25.0`.

Mỗi mã Waybill dưới đây chỉ xuất hiện một lần trong test seed. Mã chia chọn được
lưu riêng tại `carrier_sorting_code`, không dùng thay `carrier_waybill_code` và
không tự tách chuỗi để suy diễn tuyến/kho.

| Carrier code | NVC | Waybill fixture | Sorting fixture | Trạng thái xác nhận |
|---:|---|---|---|---|
| 1 | SuperShip | `STGS983262LM.826941741` | Không cung cấp | Đã xác nhận |
| 2 | GHN | `GY8YLSDK` | `100-A2-09-00` | Đã xác nhận |
| 3 | J&T Express | `802808938571` | `470-024C33-` | Đã xác nhận |
| 4 | Viettel Post | `SOO10902766013` | Không cung cấp | Đã xác nhận |
| 6 | BEST Express | `999800060099891` | `OO012-00-003-02` | Đã xác nhận |
| 10 | SPX Express | `SPXVN066263841279` | `HCA-51-172-Q5P8-N` | Đã xác nhận |
| 13 | Vietnam Post | `CC2199034123VN` | Không cung cấp | Đã xác nhận |
| 15 | Green SM Express | `GSM-EXP-20260920-000003`, `GSM-EXP-20260920-000008` | `GSM-HCM-01` | Mã/format giả định theo API Contract, test hỏa tốc |
| 16 | GrabExpress | `DELV-1708923451-A8B9C`, `DELV-1708923452-B9C0D` | `GRAB-HCM-01` | Mã/format giả định theo API Contract, test hỏa tốc |

SPX còn có mẫu sorting code đã xác nhận `Q5-P8-03`; bộ seed hiện dùng mẫu dài
để kiểm tra bảo toàn đầy đủ ký tự.

Carrier code `15` và `16` xuất hiện trong các scenario hỏa tốc:
`SPF-0302`, `SPF-0303`, `SPF-0801` (`9209190000008`) và `SPF-0901` (`9209190000009`).
Đây là fixture thiết kế theo API Contract, không được mô tả là mã production đã được Carrier Registry xác nhận.

Hash trong seed là SHA-256 chữ thường của một canonical JSON cố định theo fixture.
Không dùng chuỗi lặp như `aaaa...`, `1111...` hoặc hash ngẫu nhiên theo lần chạy.

Các workflow coverage cần nhiều Waybill hơn bảy ví dụ Business cung cấp. Những
mã bổ sung là fixture deterministic tuân theo format của đúng NVC; chúng không
được mô tả là vận đơn production đã phát hành. Bảy mã trong bảng trên vẫn là bộ
mã xác nhận dùng để kiểm tra round-trip nguyên văn.
