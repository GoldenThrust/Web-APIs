# Real-Time Channel Broadcast

This is a simple web application that demonstrates real-time communication and synchronization of color and text updates across multiple browser tabs/windows using the Broadcast Channel API.

## Table of Contents
- [Introduction](#introduction)
- [Usage](#usage)
- [Features](#features)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## Introduction
The Real-Time Channel Broadcast application showcases the use of the Broadcast Channel API to enable real-time updates of color and text data between different instances of the application running in separate browser tabs or windows. This can be useful for collaborative environments or scenarios where synchronized updates are essential.

## Usage
With this application, you can:
- Select a color using the color picker.
- Enter text in the textarea.

The selected color and entered text are immediately broadcasted to all other instances of the application open in different tabs or windows, ensuring that the color and text remain synchronized in real-time.

## Features
- Real-time synchronization of color and text updates.
- Simple and intuitive user interface.
- Broadcasts messages to all instances using the same Broadcast Channel.

## Getting Started
To run this application locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/real-time-channel-broadcast.git
   ```
2. Navigate to the project directory:
    ```sh
    cd real-time-channel-broadcast
    ```
3. Open the index.html file in a web browser.
4. You should see the color picker and text area. Try opening the same index.html file in multiple browser tabs/windows to see the real-time synchronization in action.
