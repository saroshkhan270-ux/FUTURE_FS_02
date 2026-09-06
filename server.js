require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("Connected to MySQL database!");
});

// Get all leads
app.get("/api/leads", (req, res) => {
    const sql = "SELECT * FROM leads ORDER BY id DESC";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

// Add a new lead
app.post("/api/leads", (req, res) => {
    const { name, email, source, status, notes } = req.body;

    if (!name || !email || !source) {
        return res.status(400).json({
            error: "Name, email and source are required."
        });
    }

    const sql = `
        INSERT INTO leads (name, email, source, status, notes)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, source, status || "New", notes || ""],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: "Lead added successfully!",
                id: result.insertId
            });
        }
    );
});

// Update a lead
app.put("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, source, status, notes } = req.body;

    const sql = `
        UPDATE leads
        SET name = ?, email = ?, source = ?, status = ?, notes = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, email, source, status, notes || "", id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: "Lead updated successfully!" });
        }
    );
});

// Delete a lead
app.delete("/api/leads/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM leads WHERE id = ?", [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Lead deleted successfully!" });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`CRM server running at http://localhost:${PORT}`);
});