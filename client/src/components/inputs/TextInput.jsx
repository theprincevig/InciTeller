import { useId } from "react";

export default function TextInput({
  label,
  error,
  hint,
  className = "",
  type = "text",
  ...props
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        {...props}
        id={id}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="field"
      />
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}