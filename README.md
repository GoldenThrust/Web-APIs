# Web-Browser-APIs
Web Browser APIs are a collection of programming interfaces provided by web browsers that enable developers to interact with and manipulate various aspects of the web browser itself, as well as the underlying web platform. These APIs offer a wide range of functionalities, empowering developers to create dynamic and interactive web applications.

## Getting Started

To get a copy of this project up and running on your local machine for development and testing purposes, follow these steps:

### Prerequisites

You need PHP installed on your machine.

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/GoldenThrust/Web-Browser-APIs.git
   ```
2. Navigate into the project directory:
   ```sh
   cd Web-Browser-APIs
   ```
3. Start the PHP built-in server:
   ```sh
   php -S 0.0.0.0:8000 -t public/
   ```

## Usage

### index.php

- Handles incoming POST requests.
- URL: `http://localhost:8000/index.php`

### getrecord.php

- Handles GET requests to fetch saved records.
- Returns the saved records in JSON format.
- URL: `http://localhost:8000/getrecord.php`

### Utility Functions (utils.php)

- `readfromBuffer($bufferName)`: Reads data from a buffer file.
- `writetoBuffer($bufferName, $data)`: Writes data to a buffer file.
- `appendtoBuffer($bufferName, $data)`: Appends data to a buffer file.

## Contributing

Feel free to fork the repository and extend the functionality. Pull requests are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.