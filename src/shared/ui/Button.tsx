import type { ButtonHTMLAttributes } from 'react';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' };
export function Button({
  variant = 'secondary',
  className = '',
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={['btn', variant === 'primary' ? 'primary' : '', className].join(' ')}
      {...props}
    />
  );
}
