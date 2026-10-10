import { useId } from "react";

export default function TextArea({
  label,
  error,
  hint,
  className = "",
  rows = 8,
  maxLength,
  ...props
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  const length = typeof props.value === "string" ? props.value.length : 0;

  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <textarea
        {...props}
        id={id}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="field resize-y leading-relaxed"
      />
      <div className="flex justify-between gap-4">
        {hint ? (
          <p id={hintId} className="field-hint">
            {hint}
          </p>
        ) : (
          <span />
        )}
        {maxLength && (
          <p className="field-hint shrink-0">
            {length} / {maxLength}
          </p>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}