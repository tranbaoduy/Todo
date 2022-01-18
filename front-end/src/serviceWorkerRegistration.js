// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA
const pushServerPublicKey ='BCZlbUZWXYqzRBzycUgCKhxD4nJ7uR57M2PTm63yRdphCDQ144HnlzHBb2xlRm-K43nmR3dVAeCbYrpEcSV4Fow';



const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
          navigator.serviceWorker.ready.then((res) => {
            Checksubscribe(res)
            .then(result => {
                if(!result){
                  var x = getCookie('User');
                  if(x){
                    x = JSON.parse(x);
                    Notification.requestPermission(function(status) {
                      if(status === 'granted'){
                          res.pushManager.subscribe({
                              userVisibleOnly: true,
                              applicationServerKey: pushServerPublicKey
                          }).then(sub =>{
                             sendsubscribetoServer(res,x.UserName);
                          })
                          
                      }
                    });
                  }
                }
            })
        });
       
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    }
    
    );
  }
}

function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split('; ');
  let res;
  cArr.forEach(val => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  })
  return res
}

function sendsubscribetoServer(res,userName) {
    res.pushManager.getSubscription()
    .then(info => {
        if(info !== null){
           let data = {
              UserName: userName,
              subscrition :info
           }
            $.ajax({
              url : "https://localhost:5001/api/PushNotification/Getsubscrition",
              type : "POST",
              dataType: "json",
              contentType: "application/json; charset=utf-8",
              data : JSON.stringify(data),
              success : function (result){
                  console.log('result',result);
              }
           });
           
        }
    })
    .catch(err => console.log('err',err))
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

async function Checksubscribe(res) {
   let issubscribe = false;
    await res.pushManager.getSubscription()
    .then(info => {
      console.log('info',info);
        if(info !== null){
          issubscribe =  true;
        }
    })
    .catch(err => console.log('err',err))
    return issubscribe;
}




// function isPushNotificationSupported() {
//   return 'serviceWorker' in navigator && 'PushManager' in window;
// }