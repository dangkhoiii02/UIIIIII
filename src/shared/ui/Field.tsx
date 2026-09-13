import { useId, type InputHTMLAttributes, type SelectHTMLAttributes, type ComponentType } from 'react';
import { Info } from 'lucide-react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  infoTooltip?: string;
  showInfo?: boolean;
  icon?: ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
};

export function Field({
  label,
  error,
  infoTooltip,
  showInfo,
  icon: Icon,
  id: providedId,
  required,
  className = '',
  ...props
}: Props) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const hasError = !!error;

  return (
    <label className={`field ${hasError ? 'has-error' : ''} ${className}`} htmlFor={id}>
      <span className="field-label-row">
        <span>
          {label} {required && <b className="required">*</b>}
        </span>
        {(showInfo || infoTooltip) && (
          <span className="field-info-icon" title={infoTooltip || label}>
            <Info size={15} />
          </span>
        )}
      </span>
      <div className="field-input-container">
        {Icon && <Icon size={18} className="input-left-icon" />}
        <input
          id={id}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? id + '-error' : undefined}
          className={`${Icon ? 'has-left-icon' : ''} ${hasError ? 'error-input' : ''}`}
          {...props}
          value={typeof props.value === 'number' && !Number.isFinite(props.value) ? '' : props.value}
        />
      </div>
      {error && (
        <span id={id + '-error'} className="field-error-text">
          {error}
        </span>
      )}
    </label>
  );
}

export function SelectField({
  label,
  options,
  required,
  error,
  showInfo,
  infoTooltip,
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: readonly string[];
  error?: string;
  showInfo?: boolean;
  infoTooltip?: string;
}) {
  const hasError = !!error;
  return (
    <label className={`field ${hasError ? 'has-error' : ''} ${className}`}>
      <span className="field-label-row">
        <span>
          {label} {required && <b className="required">*</b>}
        </span>
        {(showInfo || infoTooltip) && (
          <span className="field-info-icon" title={infoTooltip || label}>
            <Info size={15} />
          </span>
        )}
      </span>
      <select required={required} className={hasError ? 'error-input' : ''} {...props}>
        <option value="">Chọn {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="field-error-text">{error}</span>}
    </label>
  );
}
