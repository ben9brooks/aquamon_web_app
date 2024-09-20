const express = require("express");
const axios = require("axios");
const Database = require("better-sqlite3"); //.verbose();
const path = require("path");
const { time } = require("console");
// const moment = require("moment"); // Or use the Date object directly!!!!!!

const app = express();
const port = 5001;

// Open the existing database
const db = Database("database.db");

// Fetch data and insert into the database
async function fetchDataAndStore() {
  let output = [];

  try {
    const response = await fetch(
      "https://66cca760a4dd3c8a71b860e1.mockapi.io/sensors"
    );
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();

    const timestamp = Math.floor(new Date().getTime() / 100); // Get current date/time in ISO format IN SECONDS
    console.log(timestamp);
    const date = new Date(timestamp);
    console.log(date.toUTCString());

    // Insert each sensor reading into the database
    const insert = db.prepare(`
        INSERT INTO temp (temp, timestamp) VALUES (?, ?)
      `);

    // Assuming the data is an array of sensor readings
    for (const item of data) {
      insert.run(item.temp, timestamp);
      output.push([item.temp, timestamp]);
    }

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error fetching data or inserting into the database:", error);
  }
  return output;
}

// Route to test fetching and storing data
app.get("/test", async (req, res) => {
  try {
    let output = await fetchDataAndStore();
    res.json({
      message: "Data fetched and stored successfully",
      results: output,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Drop old entries
async function cleanTable() {
  // find timestamp 1 week ago and delete anything earlier
  const currentTime = Date.now() / 100; // This gives the current time in s

  // Calculate 1 week (7 days) in seconds
  const oneWeekInS = 7 * 24 * 60 * 60;

  // Subtract 1 week from the current time
  const aboutAWeekAgo = currentTime - oneWeekInS;

  const deleteQuery = db.prepare(`
    DELETE FROM temp WHERE timestamp < ?
  `);
  deleteQuery.run(aboutAWeekAgo);

  console.log("Cleaned")
}

// Catch all other routes and return the index.html file
app.get("/temp", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`BACKEND started on port ${port}`);
  setInterval(fetchDataAndStore, 60000);
  setInterval(cleanTable, 600000);
});
