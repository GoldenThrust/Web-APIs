function replaceStringInUrl(url, oldString, newString) {
  const modifiedUrl = url.replace(new RegExp(oldString, "g"), newString);
  return modifiedUrl;
}

function getMessageFromStorage() {
  return new Promise(function (resolve, reject) {
    const request = indexedDB.open("messagesDB", 1);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("messages", "readonly");
      const store = transaction.objectStore("messages");
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = (event) => {
        resolve(event.target.result[-1]);
      };

      getAllRequest.onerror = () => {
        reject();
      };
    };
  });
}

function removeMessageFromStorage(messageId) {
  const request = indexedDB.open("messagesDB", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("messages", "readwrite");
    const store = transaction.objectStore("messages");
    store.delete(messageId);
    console.log("Message removed from storage:", messageId);
  };
}

function sendMessage() {
  console.log("Sending message");
  return new Promise(function (resolve, reject) {
    getMessageFromStorage().then(function (message) {
      fetch(replaceStringInUrl(window.location.origin, "5500", "8000"), {
        method: "POST",
        body: JSON.stringify({ record: message }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          if (response.ok) {
            removeMessageFromStorage(message.id);
            console.log(response.body());
            alert(response.body());
            resolve();
          } else {
            reject();
          }
        })
        .catch(function (error) {
          reject();
        });
    });
  });
}


self.addEventListener('sync', (e) => {
    console.log('Sync event fired:', e.tag);
    if (e.tag === 'message') {
        console.log('Handling send outgoing message sync event');
        e.waitUntil(sendMessage());
    }
});