import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
}

/** Pass only `icon` (plus an aria-label) for an icon-only button. */
export default function Button({
  variant = 'secondary', icon, children, className = '', type = 'button', ...rest
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, children ? '' : 'btn--icon-only', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={classes} {...rest}>
      {icon && <span className="btn__icon" aria-hidden="true">{icon}</span>}
      {children && <span className="btn__label">{children}</span>}
    </button>
  );
}
