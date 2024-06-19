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
        console.log("Messages retrieved");
        resolve(event.target.result);
      };

      getAllRequest.onerror = (e) => {
        reject(e);
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
    getMessageFromStorage().then((messages) => {
      const url = replaceStringInUrl(location.origin, "5500", "8000");

      console.log("Sending message to", url);

      fetch(url, {
        method: "POST",
        body: JSON.stringify({ record: messages }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          if (response.ok) {
            messages.forEach((message) => {
              console.log(message.id, "Message sent");
              removeMessageFromStorage(message.id);
            });
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          throw new Error(error);
          reject(error);
        });
    });
  });
}

self.addEventListener("sync", (e) => {
  console.log("Sync event fired:", e.tag);
  if (e.tag === "message") {
    console.log("Handling send outgoing message sync event");
    e.waitUntil(sendMessage());
  }
});
