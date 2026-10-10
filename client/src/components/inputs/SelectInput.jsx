import { useId } from "react";

// options: [{ value: "draft", label: "Draft" }, ...]
export default function SelectInput({
  label,
  options,
  error,
  hint,
  className = "",
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
      <select
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="field"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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