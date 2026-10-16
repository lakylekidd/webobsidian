import { create } from 'zustand';

/**
 * In-app replacement for window.confirm(). Native dialogs are blocked or silently
 * auto-cancelled in embedded/preview browsers (the click then appears to do nothing),
 * so destructive actions use this promise-based dialog instead. Rendered by ConfirmDialog.
 */
export interface ConfirmRequest {
  message: string;
  confirmLabel: string;
  danger: boolean;
  resolve: (ok: boolean) => void;
}

export const useConfirm = create<{ req: ConfirmRequest | null }>(() => ({ req: null }));

export function confirmDialog(
  message: string,
  opts: { confirmLabel?: string; danger?: boolean } = {},
): Promise<boolean> {
  // A second request while one is open cancels the first.
  useConfirm.getState().req?.resolve(false);
  return new Promise<boolean>((resolve) => {
    useConfirm.setState({
      req: {
        message,
        confirmLabel: opts.confirmLabel ?? 'OK',
        danger: opts.danger ?? false,
        resolve: (ok) => {
          useConfirm.setState({ req: null });
          resolve(ok);
        },
      },
    });
  });
}
