import type { ElementType, HTMLAttributes } from 'react';
import './card.css';

interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'tinted';
  as?: ElementType;
}

export default function Card({ variant = 'default', as: Tag = 'section', className = '', children, ...rest }: CardProps) {
  return (
    <Tag className={`card card--${variant} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
