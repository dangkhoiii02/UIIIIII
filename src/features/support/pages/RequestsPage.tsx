import { Card } from '@/shared/ui/Card';
import { useSupport } from '../model/support-context';
export default function RequestsPage() {
  const { tickets } = useSupport();
  return (
    <>
      <h1>Yêu cầu hỗ trợ</h1>
      <Card title="Yêu cầu hỗ trợ" icon="?">
        {tickets.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Đơn hàng</th>
                  <th>Danh mục</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.orderId}</td>
                    <td>{ticket.category}</td>
                    <td>{ticket.content}</td>
                    <td>Bản mẫu</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            Chưa có yêu cầu hỗ trợ. Bạn có thể tạo yêu cầu từ danh sách đơn hàng.
          </div>
        )}
      </Card>
    </>
  );
}
