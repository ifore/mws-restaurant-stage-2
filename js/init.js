

    /**
     * Service Worker
     */
    function registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js',  {scope: '/'}).then(function(reg) {
            return;
          }).catch(function(err) {
            console.log('ServiceWorker registration failed!');
          });
        });
      } else {
        return;
      }
    }
    registerServiceWorker();


    //check for support
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
    }
