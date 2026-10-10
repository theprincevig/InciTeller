import Modal from "./Modal.jsx";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  loadingLabel = "Deleting…",
  loading = false,
  error = "",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} dismissible={!loading}>
      <p className="wrap-break-word leading-relaxed">{message}</p>

      {error && (
        <p role="alert" className="form-alert mt-4">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="btn-primary btn-auto"
        >
          {loading ? loadingLabel : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}