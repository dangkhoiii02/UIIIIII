import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  subLabel?: string;
}

export interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  className?: string;
}

export function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Chọn một tùy chọn',
  icon: Icon,
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`field ${className}`} ref={containerRef}>
      {label && <span>{label}</span>}
      <div className="time-select-popover-container">
        <button
          type="button"
          className={`time-select-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {Icon && <Icon size={18} className="time-calendar-icon" />}
          <span className="time-trigger-text">
            {selectedOption ? selectedOption.label : placeholder}
            {selectedOption?.subLabel ? ` (${selectedOption.subLabel})` : ''}
          </span>
          {isOpen ? (
            <ChevronUp size={16} className="time-chevron-icon" />
          ) : (
            <ChevronDown size={16} className="time-chevron-icon" />
          )}
        </button>

        {isOpen && (
          <div className="time-popover-menu">
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <div
                  key={opt.value}
                  className={`time-popover-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  <span className={`radio-dot-icon ${isSelected ? 'checked' : ''}`} />
                  <span>
                    {opt.label}
                    {opt.subLabel ? ` (${opt.subLabel})` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
