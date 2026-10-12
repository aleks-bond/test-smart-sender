import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Badge({ tone = 'neutral', children }: { tone?: 'success' | 'neutral'; children: ReactNode }) {
  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
      tone === 'success' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600')}>
      {children}
    </span>
  );
}
