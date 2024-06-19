# User Activity Logger

This repository contains code examples for logging user activity using HTML, CSS, JavaScript, and PHP.

## Features

- Logs user activity and sends data using the Beacon API.
- Captures user agent details, platform, and URL.
- Changes background and text colors randomly.
- Stores logged data using PHP on the server.

## How It Works

1. The `index.html` file contains a simple webpage with an embedded JavaScript file and a stylesheet.

2. The `main.js` JavaScript file includes functions to generate random colors, send Beacon reports with data, and log user activity. It also attaches these functions to relevant events.

3. The `style.css` stylesheet provides basic styling, including text shadows and center-aligned headers.

4. The PHP file contains server-side logic for managing log data. It defines functions to read and write log data,