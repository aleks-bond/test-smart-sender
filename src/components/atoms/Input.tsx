import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid, className, ...rest }: Props) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(
        'block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2',
        invalid ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-200',
        className,
      )}
    />
  );
}
