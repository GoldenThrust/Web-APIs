export function replaceStringInUrl(url, oldString, newString) {
    // Replace all occurrences of oldString with newString
    const modifiedUrl = url.replace(new RegExp(oldString, 'g'), newString);
    return modifiedUrl;
} 

export function uuid() {
    const head = Date.now().toString(36);
    const tail = Math.random().toString(36).substring(2);
    return head + tail;
}

export function storeMessageLocally(message) {
    const request = indexedDB.open('messagesDB', 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('messages', { keyPath: 'id' });
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('messages', 'readwrite');
        const store = transaction.objectStore('messages');
        store.put(message);
        console.log('Message stored locally:', message);
    };
}

export function getMessageFromStorage() {
    return new Promise(function (resolve, reject) {
        const request = indexedDB.open('messagesDB', 1);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction('messages', 'readonly');
            const store = transaction.objectStore('messages');
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

export function removeMessageFromStorage(messageId) {
    const request = indexedDB.open('messagesDB', 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction('messages', 'readwrite');
        const store = transaction.objectStore('messages');
        store.delete(messageId);
        console.log('Message removed from storage:', messageId);
    };
}