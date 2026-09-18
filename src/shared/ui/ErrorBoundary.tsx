import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AsyncStatePanel } from './AsyncStatePanel';
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI render failed', error, info.componentStack);
  }
  render() {
    if (this.state.failed)
      return (
        <div className="route-state-page">
          <AsyncStatePanel
            state="error"
            title="Không thể hiển thị trang"
            description="Giao diện gặp lỗi ngoài dự kiến. Hãy tải lại; nếu lỗi tiếp diễn, liên hệ hỗ trợ kèm mã Order đang thao tác."
            actionLabel="Tải lại"
            onAction={() => window.location.reload()}
          />
        </div>
      );
    return this.props.children;
  }
}
