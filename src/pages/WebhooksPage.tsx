import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { Pagination } from '@/components/molecules/Pagination';
import { SearchInput } from '@/components/molecules/SearchInput';
import { StateMessage } from '@/components/molecules/StateMessage';
import { WebhookTable } from '@/features/webhooks/WebhookTable';
import { useListParams } from '@/features/webhooks/useListParams';
import { useWebhooks } from '@/features/webhooks/useWebhooks';

export function WebhooksPage() {
  const { page, search, setPage, setSearch } = useListParams();
  const { data, isPending, isError, error, isFetching, isPlaceholderData, refetch } = useWebhooks({ page, search });
  const returnTo = `/webhooks${useLocation().search}`;
  const lastPage = data?.paging.pages.last;

  useEffect(() => {
    if (lastPage && !isPlaceholderData && page > lastPage) setPage(lastPage, true);
  }, [lastPage, isPlaceholderData, page, setPage]);

  let content;
  if (isPending) content = <StateMessage variant="loading" title="Loading webhooks…" />;
  else if (isError)
    content = (
      <StateMessage variant="error" title={`Failed to load webhooks: ${error.message}`}
        action={<Button variant="secondary" onClick={() => refetch()}>Retry</Button>} />
    );
  else if (data.data.length === 0)
    content = (
      <StateMessage variant="empty"
        title={search ? `No webhooks match “${search}”.` : 'No webhooks yet.'}
        action={page > 1 ? <Button variant="secondary" onClick={() => setPage(1)}>Go to first page</Button> : undefined} />
    );
  else
    content = (
      <div className={isPlaceholderData ? 'space-y-4 opacity-60' : 'space-y-4'}>
        <WebhookTable items={data.data} returnTo={returnTo} />
        <Pagination page={data.paging.pages.current} lastPage={data.paging.pages.last}
          total={data.paging.results.total} onPageChange={setPage} />
      </div>
    );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
          Webhooks {isFetching && !isPending && <Spinner className="text-indigo-600" />}
        </h1>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name…" />
      </div>
      {content}
    </section>
  );
}
