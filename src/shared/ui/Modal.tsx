import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from './Button';
export function Modal({
  title,
  children,
  onClose,
  footer,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={wide ? 'modal-wide' : ''}
      onCancel={onClose}
    >
      <div className="modal-head" id={titleId}>
        {title}
      </div>
      <div className="modal-body">{children}</div>
      {footer !== null && (
        <div className="modal-foot">
          {footer ?? (
            <Button variant="primary" onClick={onClose}>
              Đóng
            </Button>
          )}
        </div>
      )}
    </dialog>
  );
}
