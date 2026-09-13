import { Component, type ErrorInfo, type ReactNode } from 'react';
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
        <div className="empty" role="alert">
          <h1>Không thể hiển thị trang</h1>
          <p>Vui lòng tải lại để thử lại.</p>
          <button className="btn primary" onClick={() => window.location.reload()}>
            Tải lại
          </button>
        </div>
      );
    return this.props.children;
  }
}
