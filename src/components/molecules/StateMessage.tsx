import type { ReactNode } from 'react';
import { Spinner } from '../atoms/Spinner';

interface Props {
  variant: 'loading' | 'empty' | 'error';
  title: string;
  action?: ReactNode;
}

export function StateMessage({ variant, title, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      {variant === 'loading' && <Spinner className="h-6 w-6 text-indigo-600" />}
      <p className={variant === 'error' ? 'text-red-600' : 'text-slate-600'}>{title}</p>
      {action}
    </div>
  );
}
