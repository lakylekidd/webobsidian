import { useEffect, useRef } from 'react';
import { useConfirm } from '../lib/confirm';

/** Modal host for confirmDialog(): Esc / backdrop / Cancel resolve false, the action button true. */
export default function ConfirmDialog() {
  const req = useConfirm((s) => s.req);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus Cancel by default so a stray Enter never confirms a destructive action.
  useEffect(() => {
    if (req) cancelRef.current?.focus();
  }, [req]);

  if (!req) return null;
  const cancel = () => req.resolve(false);
  return (
    <div className="modal-bg" onClick={cancel}>
      <div
        className="modal confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label={req.message}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            cancel();
          }
        }}
      >
        <p className="confirm-dialog-msg">{req.message}</p>
        <div className="confirm-dialog-actions">
          <button ref={cancelRef} className="btn secondary" onClick={cancel}>
            Cancel
          </button>
          <button className={req.danger ? 'btn danger' : 'btn'} onClick={() => req.resolve(true)}>
            {req.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
