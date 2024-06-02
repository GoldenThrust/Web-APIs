navigator.serviceWorker.ready
  .then((registration) => {
    registration.sync.register("smessage");
  })
  .catch((error) => {
    console.error(error);
  });

navigator.serviceWorker.ready
  .then((registration) => {
    registration.sync
      .getTags()
      .then((tags) => {
        if (tags.includes("smessage")) {
          // Corrected tag name
          console.log("Message sync already requested");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  })
  .catch((error) => {
    console.error(error);
  });

function sendBeaconReport(data) {
  // Get the <p> element for displaying log information
  let p = document.querySelector("p");

  // Create a FormData object and append data as a JSON string
  let form = new FormData();
  form.append("log", JSON.stringify(data));

  // Send the Beacon report with the data to the specified URL
  navigator.sendBeacon("http://localhost/beacon/", form);

  // Update the <p> element with logged data details
  p.innerText = "Logged data : \r\n\r\n";
  for (keys in data) {
    if (keys == "brands") {
      p.innerText += keys + " = \n";
      for (let i = 0; i < data[keys].length; i++) {
        for (key in data[keys][i]) {
          p.innerText += key + " : " + data[keys][i][key] + "\n";
        }
      }
    } else {
      p.innerText += keys + " = " + data[keys] + "\n";
    }
  }

  // Set a random background color
  document.documentElement.style.backgroundColor =
    "rgb(" + randomColor() + "," + randomColor() + "," + randomColor() + ")";

  // Set a random text color
  document.documentElement.style.color =
    "rgb(" + randomColor() + "," + randomColor() + "," + randomColor() + ")";
}

// Function to log user activity
function logUserData() {
  let brands = [];

  // Iterate through user agent brands and push to the 'brands' array
  for (let i = 0; i < navigator.userAgentData.brands.length; i++) {
    brands.push(navigator.userAgentData.brands[i]);
  }

  // Create an activity data object
  const activityData = {
    timestamp: new Date().toISOString(),
    eventType: navigator.onLine ? "leavePage" : "goOffline",
    userAgent: navigator.userAgent,
    mobile: navigator.userAgentData.mobile,
    platform: navigator.userAgentData.platform,
    url: window.location.href,
    brands: brands,
  };

  // Send the activity data using the sendBeaconReport function
  sendBeaconReport(activityData);
}

self.addEventListener("sync", (e) => {
  if (e.tag === "smessage") {
    e.waitUntil(logUserData());
  }
});
