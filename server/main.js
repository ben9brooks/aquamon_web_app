const express = require("express");
const axios = require("axios");
const Database = require("better-sqlite3"); //.verbose();
const path = require("path");
const { time } = require("console");
const cors = require('cors');
// const moment = require("moment"); // Or use the Date object directly!!!!!!

const app = express();
const port = 5001;

// Enable CORS for all routes or limit it to specific origins
app.use(cors({
  origin: 'http://localhost:3000' // Allow only your frontend origin
}));

app.use(express.json());

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

    const timestamp = Math.floor(new Date().getTime()); // Get current date/time in ISO format IN SECONDS
    console.log(timestamp);
    const date = new Date(timestamp);
    console.log(date.toUTCString());

    // Insert each sensor reading into the database
    const insertTemp = db.prepare(`
        INSERT INTO temp (temp, timestamp) VALUES (?, ?)
      `);
    const insertPh = db.prepare(`
        INSERT INTO ph (ph, timestamp) VALUES (?, ?)
      `);
    const insertTDS = db.prepare(`
      INSERT INTO tds (tds, timestamp) VALUES (?, ?)
    `);

    // Assuming the data is an array of sensor readings
    for (const item of data) {
      insertTemp.run(item.temp, timestamp);
      output.push([item.temp, timestamp]);

      insertPh.run(item.ph, timestamp);
      output.push([item.ph, timestamp]);

      insertTDS.run(item.tds, timestamp);
      output.push([item.tds, timestamp]);
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
  const currentTime = Date.now(); //current time in milliseconds

  // Calculate 1 week (7 days) in milliseconds
  const oneWeekInS = 7 * 24 * 60 * 60 * 1000;

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
  console.log("bruh")
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`BACKEND started on port ${port}`);
  setInterval(fetchDataAndStore, 50000);
  setInterval(cleanTable, 600000);
});

app.get('/temp-data', (req, res) => {
  const rows = db.prepare('SELECT temp, timestamp FROM temp').all()
  res.json(rows)
})

app.get('/ph-data', (req, res) => {
  const rows = db.prepare('SELECT ph, timestamp FROM ph').all()
  res.json(rows)
})

app.get('/tds-data', (req, res) => {
  const rows = db.prepare('SELECT tds, timestamp FROM tds').all()
  res.json(rows)
})

app.get('/user-parameters/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const data = db.prepare('SELECT * FROM user_parameters WHERE user_id = ?').all(userId);
  res.json(data)

})


app.put('/upload-user-parameters/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const updatedData = req.body;
  // console.log("PUT?", updatedData)

  // should add error handling...
  for( const key in updatedData) {
    if( updatedData[key] != -100){
      console.log(`${key} ${updatedData[key]}`);
      const post = db.prepare(`UPDATE user_parameters SET ${key} = ${updatedData[key]} WHERE user_id = ${userId}`);
      post.run();
    }
  }
})

