# Background Sync

This repository contains a simple web application demonstrating background synchronization using Service Workers and IndexedDB. The application allows users to record a message, save it locally, and synchronize it with the server when connectivity is restored.

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get a copy of this project up and running on your local machine for development and testing purposes, follow these steps:

### Prerequisites

You need a web browser that supports Service Workers and background sync.

### Installation

1. Clone the repository:
2. Navigate into the project directory:
   ```sh
   cd backgroundsync
   ```
3. Start a local server to serve the files. You can use any server of your choice.
4. Open `index.html` in your web browser.

## Usage

1. **Record a Message:**
   - Open `index.html` in your web browser.
   - Enter a message in the textarea and click "Save Record".
   - The message is saved locally using IndexedDB.

2. **Background Sync:**
   - If the browser supports Service Workers, the message will be synchronized with the server when the network is available.

3. **Show Saved Record:**
   - Click on the "Show Record" button to fetch and display the saved record from the server.

## JavaScript Details

### main.js
- Registers the Service Worker.
- Handles the form submission to save messages locally and register a sync event.
- Defines `storeMessageLocally` to store messages in IndexedDB.
- Fetches and displays messages using the "Show Record" button.

### sw.js
- Listens for sync events.
- Retrieves messages from IndexedDB and sends them to the server.
- Removes messages from IndexedDB once they are successfully sent.
