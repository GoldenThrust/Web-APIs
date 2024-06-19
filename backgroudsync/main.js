import { replaceStringInUrl, uuid } from "../utils.js";

const p = document.querySelector("p");
const form = document.forms[0];
const showRecord = document.getElementById("showRecord");

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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (form[0].value !== "") {
    const message = {
      id: uuid(),
      content: form[0].value,
      timestamp: Date.now(),
    };

    form[0].value = "";

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
  }
});

showRecord.addEventListener("click", async () => {
  const message = await getMessage();
  p.innerText = message.message;
});

function getMessage() {
  return new Promise(function (resolve, reject) {
    const url =
      replaceStringInUrl(window.location.origin, "5500", "8000") +
      "/getrecord.php";
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
