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
