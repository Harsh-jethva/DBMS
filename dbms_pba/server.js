const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const START_PORT = Number(process.env.PORT) || 3000;

const dbPath = path.join(__dirname, "registration.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      mobileNumber TEXT NOT NULL,
      address TEXT NOT NULL,
      email TEXT NOT NULL,
      gender TEXT NOT NULL,
      nationality TEXT NOT NULL
    )
  `);
});

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/register", (req, res) => {
  const {
    firstName,
    lastName,
    mobileNumber,
    address,
    email,
    gender,
    nationality,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !mobileNumber ||
    !address ||
    !email ||
    !gender ||
    !nationality
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = `
    INSERT INTO registrations
    (firstName, lastName, mobileNumber, address, email, gender, nationality)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [firstName, lastName, mobileNumber, address, email, gender, nationality],
    function onInsert(err) {
      if (err) {
        return res.status(500).json({ message: "Failed to save data." });
      }
      return res.json({
        message: "Registration saved successfully.",
        id: this.lastID,
      });
    }
  );
});

app.get("/api/registrations", (_req, res) => {
  db.all("SELECT * FROM registrations ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch data." });
    }
    return res.json(rows);
  });
});

app.put("/api/registrations/:id", (req, res) => {
  const oldId = Number(req.params.id);
  const {
    id,
    firstName,
    lastName,
    mobileNumber,
    address,
    email,
    gender,
    nationality,
  } = req.body;

  const newId = Number(id);

  if (!Number.isInteger(newId) || newId < 1) {
    return res.status(400).json({ message: "ID must be a positive integer." });
  }

  const sql = `
    UPDATE registrations
    SET id = ?,
        firstName = ?,
        lastName = ?,
        mobileNumber = ?,
        address = ?,
        email = ?,
        gender = ?,
        nationality = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [newId, firstName, lastName, mobileNumber, address, email, gender, nationality, oldId],
    function onUpdate(err) {
      if (err) {
        if (err.message && err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ message: "This ID already exists." });
        }
        return res.status(500).json({ message: "Failed to update data." });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Record not found." });
      }
      return res.json({ message: "Record updated successfully.", id: newId });
    }
  );
});

app.delete("/api/registrations/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM registrations WHERE id = ?", [id], function onDelete(err) {
    if (err) {
      return res.status(500).json({ message: "Failed to delete data." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Record not found." });
    }
    return res.json({ message: "Record deleted successfully." });
  });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.log(`Port ${port} is busy. Trying port ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error("Server failed to start:", error.message);
    process.exit(1);
  });
}

startServer(START_PORT);
