const express = require("express");
const axios = require("axios");
const Database = require("better-sqlite3"); //.verbose();
const path = require("path");
const { time } = require("console");
const cors = require('cors');
const nodemailer = require("nodemailer");
require('dotenv').config();

const app = express();
const port = 5001;
const currentlyCallingArduino = false; //false if calling mock api, true if calling arduino
const arduinoIP = "http://172.20.10.7";
const userEmail = "bdbfvr@umsystem.edu"; //alert emails will be sent here
const backEndAddress = "http://localhost:5001"; 
     

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
    let response = null;

    if (currentlyCallingArduino) {
      response = await fetch(arduinoIP + "/sensors");
    } else {
      response = await fetch("https://66cca760a4dd3c8a71b860e1.mockapi.io/sensors");
    }

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();

    console.log(data);

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

    //check global var
    if (!currentlyCallingArduino) {
      // Assuming the data is an array of sensor readings
      for (const item of data) {
        insertTemp.run(item.temp, timestamp);
        output.push([item.temp, timestamp]);
  
        insertPh.run(item.ph, timestamp);
        output.push([item.ph, timestamp]);
  
        insertTDS.run(item.tds, timestamp);
        output.push([item.tds, timestamp]);
      }
    } else {
      insertTemp.run(data.temp, timestamp);
        output.push([data.temp, timestamp]);
  
        insertPh.run(data.ph, timestamp);
        output.push([data.ph, timestamp]);
  
        insertTDS.run(data.tds, timestamp);
        output.push([data.tds, timestamp]);
    }

    console.log("Data inserted successfully");
    // check if fetched values are at dangerous levels
    // const response2 = await fetch(`http://localhost:5001/user-parameters/${0}`);
    // const user_param = await response2.json();
    const user_param = db.prepare('SELECT * FROM user_parameters WHERE user_id = 0').all()[0];
    // const user_param = response2.json();

  
    const email = db.prepare('SELECT email FROM user WHERE id = ?').all(0);
  
    if( data[0].temp < user_param.temp_alert_min || data[0].temp > user_param.temp_alert_max) {
      sendAlertEmail('Temperature', data[0].temp, userEmail);
      console.log("temp alert email");
    }
    console.log(data[0].ph, user_param.ph_alert_max, user_param.ph_alert_min);
    
    if( data[0].ph < user_param.ph_alert_min || data[0].ph > user_param.ph_alert_max) {
      console.log("ph alert email");
      sendAlertEmail('pH', data[0].ph, userEmail);
    }
    if( data[0].tds < user_param.tds_alert_min || data[0].tds > user_param.tds_alert_max) {
      //sendAlertEmail('TDS', data[0].tds, email);
      sendAlertEmail('TDS', data[0].tds, userEmail);
      console.log("tds alert email");
    }
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

function generate_lt_delete_query(table, timestamp) {
  // generates 'Less Than' query with given table and timestamp.
  return db.prepare(`DELETE FROM ${table} WHERE timestamp < ${timestamp}`);
}

// Drop old entries
async function cleanTable() {
  // find timestamp 1 week ago and delete anything earlier
  const currentTime = Date.now(); //current time in milliseconds

  // Calculate 1 week (7 days) in milliseconds
  const oneWeekInS = 7 * 24 * 60 * 60 * 1000;

  // Subtract 1 week from the current time
  const aboutAWeekAgo = currentTime - oneWeekInS;

  // const deleteQuery = db.prepare(`
  //   DELETE FROM ? WHERE timestamp < ?
  // `);
  generate_lt_delete_query('temp', aboutAWeekAgo).run();
  generate_lt_delete_query('tds', aboutAWeekAgo).run();
  generate_lt_delete_query('ph', aboutAWeekAgo).run();
  // deleteQuery.run('temp', aboutAWeekAgo);
  // deleteQuery.run('tds', aboutAWeekAgo);
  // deleteQuery.run('ph', aboutAWeekAgo);

  console.log("Cleaned")
}

// Catch all other routes and return the index.html file
app.get("/temp", (req, res) => {
  console.log("bruh")
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`BACKEND started on port ${port}`);
  setInterval(fetchDataAndStore, 60000);
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

app.get('/user-parameters/:user_id/:name', (req, res) => {
  const userId = req.params.user_id;
  const name = req.params.name;
  const data = db.prepare(`SELECT ${name} FROM user_parameters WHERE user_id = ${userId}`).all();
  console.log(data);
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

app.get('/login/:email/:password', (req, res) => {
  const email = req.params.email;
  const password = req.params.password;
  const data = db.prepare('SELECT * FROM user WHERE email = ? AND password = ?').all(email, password);
  res.json(data)

  console.log(data.body)

})

// Configure email transport (replace with your SMTP settings)
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', or use a custom SMTP server
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

async function sendAlertEmail(sensorType, value, email) {
  const message = {
    from: '"AquaMon" <aquamon.notifications@gmail.com>', // sender address
    to: email, // list of receivers
    subject: `${sensorType} Alert - AquaMon`,
    text: `Warning! ${sensorType} is out of range. Current value: ${value}`,
    html: `<p>Warning! <b>${sensorType}</b> is out of range.</p><p>Current value: <b>${value}</b></p>`,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

app.put('/mock/:sensor', (req, res) => {
  const sensorType = req.params.sensor;
  const parameters = req.body; //of format [low_range, high_range, interval (in min), time_frame (in hours)]
  console.log("Received", sensorType, parameters);

  const data = [];
  // generate sine wave data based on low, high, interval, and time_frame
  const low = parameters[0];
  const high = parameters[1];
  const interval = parameters[2];
  const time_frame = parameters[3];
  const num_points = (time_frame * 60) / interval;
  const now = Date.now();
  const time_start = Date.now() - (time_frame * 60 * 60 * 1000);
  const time_step = interval * 60 * 1000;
  for (let i = 0; i < num_points; i++) {
    const t = time_start + (i * time_step);
    const value = (high - low) / 2 * Math.sin(2 * Math.PI * i / num_points) + (high + low) / 2;
    data.push([value, t]);
  }

  // first, delete all previous data:
  generate_lt_delete_query(sensorType, now).run();

  const insertStmt = db.prepare(`INSERT INTO ${sensorType} (${sensorType}, timestamp) VALUES (?, ?)`);
  
  try {
    db.transaction(() => {
      data.forEach(([value, timestamp]) => {
        console.log(value, timestamp);
        try {
          insertStmt.run(value, timestamp);
        } catch {
          console.log("Failed to insert mock data", value, timestamp);
        }
      })
    })();
    console.log("Data mocked");

  } catch (transactionError) {
    console.log("DB Mock failed", transactionError);
  }
})