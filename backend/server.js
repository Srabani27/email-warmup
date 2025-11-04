import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initDB } from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

let db;
initDB().then((d) => {
  db = d;
  console.log("DB Ready ✅");
});

// ✅ ADD ROUTE HERE
app.post("/accounts", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email & Password required" });

  try {
    await db.run(
      `INSERT INTO accounts (email, password) VALUES (?, ?)`,
      [email, password]
    );
    res.json({ message: "Account added ✅" });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(400).json({ message: "Email already exists ❗" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.post("/start-one", async (req, res) => {
  try {
    // Get two random accounts
    const accounts = await db.all("SELECT * FROM accounts ORDER BY RANDOM() LIMIT 2");
    
    if (accounts.length < 2) {
      return res.status(400).json({ message: "Need at least two accounts to warm emails" });
    }

    const sender = accounts[0].email;
    const receiver = accounts[1].email;

    // Insert into logs table
    await db.run(
      `INSERT INTO logs (sender, receiver, status) VALUES (?, ?, ?)`,
      [sender, receiver, "sent"]
    );

    res.json({ message: `Warm-up email queued from ${sender} to ${receiver}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Warm-up failed", error: err.message });
  }
});


// ✅ GET LOGS ROUTE
app.get("/logs", async (req, res) => {
  const rows = await db.all("SELECT * FROM logs ORDER BY id DESC");
  res.json(rows);
});

// ✅ SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
