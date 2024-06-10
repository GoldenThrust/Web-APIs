import { replaceStringInUrl, getMessageFromStorage, removeMessageFromStorage, storeMessageLocally, uuid } from '../utils.js'

const p = document.querySelector('p')
const saveData = document.getElementById('saveData');
const previewData = document.getElementById('previewData');
const saveDataButton = document.getElementById('saveDataButton');

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    console.log("Serviceworker registered with scoped:", registration.scope)
  }).catch(error => {
    console.log("Serviceworker registration failed:", error)
  })
}

saveDataButton.addEventListener('click', () => {
  const message = {
    id: uuid,
    content: saveData.value,
    timestamp: Date.now()
  }

  storeMessageLocally(message);

  navigator.serviceWorker.ready.then(function (registration) {
    return registration.sync.register('message');
  }).then(() => {
    console.log('Sync registered');
  }).catch(error => {
    console.error('Sync registration failed:', error);
  });
})

previewData.addEventListener('click', async () => {
  p.innerText = await getMessage();
})

function getMessage() {
  return new Promise(
    function (resolve, reject) {
      fetch(replaceStringInUrl(window.location.origin, "5502", "8000") + '/getdata.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok');
        }
      }).then(function (data) {
        resolve(data);
      })
    })
}

export function sendMessage() {
  return new Promise(function (resolve, reject) {
    getMessageFromStorage().then(function (message) {
      fetch(replaceStringInUrl(window.location.origin, "5502", "8000"), {
        method: 'POST',
        body: JSON.stringify({ record: message }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        if (response.ok) {
          removeMessageFromStorage(message.id);
          console.log(response.body());
          alert(response.body())
          resolve();
        } else {
          reject();
        }
      }).catch(function (error) {
        reject();
      });
    });
  });
}
