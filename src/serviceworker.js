const version = 'V0.0.2';
const staticCacheName = version + 'staticfiles';

// TODO: Lissen if a new SW worker is installed, promt user to update
addEventListener('install', (installEvent) => {
  console.log('Installed a new SW', installEvent);
  installEvent.waitUntil(
    caches
      .open(staticCacheName)
      .then( staticCache => {
        // dynamic assets
        staticCache.addAll([
          '/assets/work/qgroup/hero.jpg',
          
          '/assets/logowall/collector_logo.svg',
          '/assets/logowall/ddb_logo.svg',
          '/assets/logowall/ica_logo.svg',
          '/assets/logowall/kappahl_logo.svg',
          '/assets/logowall/mr_bear_logo.png',
          '/assets/logowall/ssl_logo.svg',
          '/assets/logowall/stenaline_logo.svg',
          '/assets/logowall/study-logo.svg',

          '/assets/bundles/news_svenskaskolan.js',
          '/assets/hero/cloud.png',
          '/assets/hero/castle.png',
          '/assets/hero/garden.png',
          '/assets/hero/tree.png',

        ]);
        // Files that might differ from unit to unit
        staticCache.addAll([
          '/assets/typefaces/moderat-subset/moderat-bold-subset.woff2',
          '/assets/typefaces/moderat-subset/moderat-regular-subset.woff2',
        ])
        // Must have assets
        return staticCache.addAll([
          '/assets/fully-studios-logo.svg',
          '/assets/images/img_0.png',
          '/assets/logo.json',
          '/assets/css/main.css',
          '/assets/bundles/app.js',
        ])
      })
  );

});

// TODO: Remove previous prompt
addEventListener('activate',  (activateEvent) => {
  // Remove old cache
  activateEvent.waitUntil(
    caches.keys()
      .then( cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName != staticCacheName) {
              console.log('removed cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        )
      })
      .then(() => clients.claim()) // make sure the SW takes over immediately
  );

});

// All fetch events
addEventListener('fetch', (fetchEvent) => {
  const request = fetchEvent.request;
  // console.log('SW fetch:', request.url);
  fetchEvent.respondWith(
    // new Response('Hello mate!')
    caches.match(request)
      .then( responseFromCache => {
        // console.log('responseFromCache', responseFromCache)
        return responseFromCache ? responseFromCache : fetch(request);
      })

    // fetch(request)
    //   .then(responeFromFetch => responeFromFetch)
    //   .catch(error => {
    //     return new Response(`
    //       <h1>Opps!</h1>
    //       <p>Something went wrong:</p>
    //       <p>${error}</p>
    //     `,
    //     {
    //       headers: { 'Content-type': 'text/html; charset=utf-8'}
    //     }
    //   );
    // })

    // DOM finisched: 633-779ms. With cache: 449ms - 707
  )
});
