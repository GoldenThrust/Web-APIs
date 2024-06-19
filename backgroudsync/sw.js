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
      const url = replaceStringInUrl(window.location.origin, "5500", "8000");

      console.log("Sending message", url);

      const formdata = new FormData();

      formdata.append("record", JSON.stringify(messages));

      navigator.sendBeacon(url, formdata);

      fetch(url, {
        method: "POST",
        body: formdata,
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
        .catch(function (error) {
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
