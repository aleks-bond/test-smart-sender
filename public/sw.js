// only api requests reach msw, everything else goes straight to the network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isApi =
    url.origin === self.location.origin &&
    (url.pathname === '/csrf' || url.pathname.startsWith('/auth/') || url.pathname.startsWith('/v1/'));
  if (!isApi) event.stopImmediatePropagation();
});

importScripts('/mockServiceWorker.js');
