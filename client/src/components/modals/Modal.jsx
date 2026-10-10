import { useEffect, useId, useRef } from "react";

// Generic dialog. The parent controls it through `open` / `onClose`.
// Built on the native <dialog>: the browser traps focus, makes the page behind
// inert, handles Escape, and returns focus to the button that opened it.
export default function Modal({
  open,
  onClose,
  title,
  children,
  dismissible = true, // false blocks Escape and backdrop clicks (e.g. while saving)
}) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Escape: the parent decides, so state and dialog never disagree
  const handleCancel = (e) => {
    e.preventDefault();
    if (dismissible) onClose();
  };

  // A click on the backdrop lands on the <dialog> itself, not on the inner box
  const handleClick = (e) => {
    if (dismissible && e.target === e.currentTarget) onClose();
  };

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      <div className="p-6">
        <h2 id={titleId} className="mb-4 font-display text-2xl font-bold">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}