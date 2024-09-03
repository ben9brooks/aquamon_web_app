const express = require("express");
const axios = require("axios");
const Database = require("better-sqlite3"); //.verbose();
const path = require("path");
// const moment = require("moment"); // Or use the Date object directly!!!!!!

const app = express();
const port = 5000;

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

    const timestamp = Math.floor(new Date().getTime() / 100); // Get current date/time in ISO format
    console.log(timestamp);

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

app.listen(port, () => {
  console.log(`BACKEND started on port ${port}`);
});
