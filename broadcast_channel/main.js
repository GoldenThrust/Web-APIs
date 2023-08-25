// Create a Broadcast Channel named "channel"
const channel = new BroadcastChannel("channel");

// Get the color picker element
const colorPicker = document.getElementById("colorPicker");
const text = document.getElementById("text");

// Listen for color changes in the color picker
colorPicker.addEventListener("input", (event) => {
    // When the color picker's value changes, send the selected color through the channel
    channel.postMessage({ color: event.target.value });
});

// Listen for text changes in the textarea
text.addEventListener("input", (event) => {
    // When the text area's value changes, send the entered text through the channel
    channel.postMessage({ text: event.target.value });
});

// Listen for color messages from other tabs/windows
channel.addEventListener("message", (event) => {
    // Retrieve the received color and text from the message
    const receivedColor = event.data.color;
    const receivedText = event.data.text;

    // Update the UI based on the received message
    if (receivedText) {
        // If the received message contains text, update the text area's value
        text.value = receivedText;
    } else {
        // If the received message contains color, update the text color using CSS custom property
        document.documentElement.style.setProperty("--text-color", receivedColor);
    }
});

// Listen for errors in message reception
channel.addEventListener("messageerror", (event) => {
    console.log(event);
});
