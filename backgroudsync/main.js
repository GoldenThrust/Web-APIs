import { replaceStringInUrl, uuid } from "../utils.js";

const p = document.querySelector("p");
const saveData = document.getElementById("saveData");
const previewData = document.getElementById("previewData");
const saveDataButton = document.getElementById("saveDataButton");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/backgroudsync/sw.js", { scope: "/backgroudsync/" })
    .then(function (registration) {
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
    })
    .catch(function (error) {
      console.log("ServiceWorker registration failed: ", error);
    });

  self.addEventListener("install", (event) => {
    console.log("Service Worker installing.");
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    console.log("Service Worker activating.");
  });
}

export function storeMessageLocally(message) {
  const request = indexedDB.open("messagesDB", 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore("messages", { keyPath: "id" });
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction("messages", "readwrite");
    const store = transaction.objectStore("messages");
    store.put(message);
    console.log("Message stored locally:", message);
  };
}

saveDataButton.addEventListener("click", () => {
  const message = {
    id: uuid(),
    content: saveData.value,
    timestamp: Date.now(),
  };

  storeMessageLocally(message);

  navigator.serviceWorker.ready
    .then(function (registration) {
      return registration.sync.register("message");
    })
    .then(() => {
      console.log("Sync registered");
    })
    .catch((error) => {
      console.error("Sync registration failed:", error);
    });
});

previewData.addEventListener("click", async () => {
  const message = await getMessage();
  p.innerText = message.message;
});

function getMessage() {
  return new Promise(function (resolve, reject) {
    const url =
      replaceStringInUrl(window.location.origin, "5500", "8000") +
      "/getdata.php";
    console.log(url);

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then(function (data) {
        resolve(data);
      });
  });
}
