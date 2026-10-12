import { Button } from '../atoms/Button';

interface Props {
  page: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, lastPage, total, onPageChange }: Props) {
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between text-sm text-slate-600">
      <span>{total} result{total === 1 ? '' : 's'}</span>
      <div className="flex items-center gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
        <span>Page {page} of {lastPage}</span>
        <Button variant="secondary" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </nav>
  );
}
