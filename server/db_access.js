// backend
const { app, BrowserWindow } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const { spawn } = require('child_process')

let mainWindow
let backendProcess

// Path to your SQLite database file
const dbPath = path.join(__dirname, 'database.db')

// Create a new SQLite database
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Error opening database', err.message)
  } else {
    console.log('Connected to the SQLite database.')
  }
})

// Function to insert a new row into the 'temp' table
function insertTemp(id, temp, timestamp) {
  const sql = `INSERT INTO temp (id, temp, timestamp) VALUES (?, ?, ?)`

  db.run(sql, [id, temp, timestamp], function (err) {
    if (err) {
      console.error('Error inserting data', err.message)
    } else {
      console.log(`A row has been inserted with id ${this.lastID}`)
    }
  })
}

// Insert a sample row (you can change this as needed)
insertTemp(1, 22.5, new Date().toISOString())

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`)
// })

// Close the database when done
process.on('exit', () => {
  db.close(err => {
    if (err) {
      console.error('Error closing database', err.message)
    } else {
      console.log('Database closed.')
    }
  })
})
