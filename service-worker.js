var GAS_API_URL = 'https://script.google.com/macros/s/AKfycbzm1heZA6dcYx27REb0xN9_UoP7NPGjE9RnW-c2BdXh8schWMhiRqQiym852rEHJAel/exec';
var PUSH_USER = 'Anthony';

self.addEventListener('message', function(event) {
  if (event.data && event.data.user) {
    PUSH_USER = event.data.user;
  }
});

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});

self.addEventListener('push', function(event) {
  event.waitUntil(
    fetch(GAS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'getLatestUnread', args: [PUSH_USER] })
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
      var notif = result.data;
      if (notif) {
        return self.registration.showNotification('Le\'Fam Central', {
          body: notif.Message,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          data: { page: notif.Page || 'dashboard' }
        });
      } else {
        return self.registration.showNotification('Le\'Fam Central', {
          body: 'You have new activity!',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          data: { page: 'dashboard' }
        });
      }
    })
    .catch(function() {
      return self.registration.showNotification('Le\'Fam Central', {
        body: 'You have new activity!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: { page: 'dashboard' }
      });
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var page = (event.notification.data && event.notification.data.page) || 'dashboard';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].focus) {
          clientList[i].focus();
          clientList[i].postMessage({ action: 'navigate', page: page });
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});
