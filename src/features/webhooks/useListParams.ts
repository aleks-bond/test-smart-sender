import { useSearchParams } from 'react-router-dom';

export function useListParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '', 10) || 1);
  const search = searchParams.get('search') ?? '';

  const update = (next: { page: number; search: string }, replace = false) => {
    const params = new URLSearchParams();
    if (next.page > 1) params.set('page', String(next.page));
    if (next.search) params.set('search', next.search);
    setSearchParams(params, { replace });
  };

  return {
    page,
    search,
    setPage: (p: number, replace = false) => update({ page: p, search }, replace),
    // new search always starts from page 1
    setSearch: (s: string) => update({ page: 1, search: s }, true),
  };
}
