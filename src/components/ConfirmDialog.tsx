import { useEffect, useRef, useState } from "react";

interface ConfirmDialogProps {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const ConfirmDialog = ({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [working, setWorking] = useState(false);

  // Native <dialog> handles focus trapping and Escape for us.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-lg border border-base-300
                 bg-base-100 p-0 text-base-content backdrop:bg-black/40"
    >
      <div className="px-5 py-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1.5 text-sm opacity-70">{body}</p>
      </div>
      <div className="flex justify-end gap-2 border-t border-base-300 px-5 py-3">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => dialogRef.current?.close()}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-error btn-sm"
          disabled={working}
          onClick={async () => {
            setWorking(true);
            await onConfirm();
          }}
        >
          {working ? "Working..." : confirmLabel}
        </button>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
