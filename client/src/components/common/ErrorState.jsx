export default function ErrorState({ message, onRetry, children }) {
  return (
    <div role="alert" className="glass state-box state-box-error">
      <p className="mb-4 text-lg font-medium">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-primary btn-auto">
            Try again
          </button>
        )}
        {children}
      </div>
    </div>
  );
}