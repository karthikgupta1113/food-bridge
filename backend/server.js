const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");

let bcrypt;
try {
  bcrypt = require("bcryptjs");
} catch (e) {
  bcrypt = require("bcrypt");
}

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Always reflect the request origin in dev to avoid CORS mismatches
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "10mb" }));

// ----------------------------------------------------
// Database Engine: PostgreSQL with automatic File-DB Fallback
// ----------------------------------------------------
let usePostgres = false;
let pool = null;

const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const defaultData = {
  users: [
    {
      id: 1,
      full_name: "Demo Donor",
      email: "donor@foodbridge.org",
      phone: "+91 9876543210",
      password: "$2a$10$k2ufzX.TLqBjExQlD3yfd./TayvkfJ.jfNvhjclFfCUVLuRpP.LqW", // donor123
      role: "Donor",
      joined: new Date().toLocaleDateString(),
      donations: 3,
      profile_image: "",
      provider: "local",
    },
    {
      id: 2,
      full_name: "Hope NGO",
      email: "ngo@foodbridge.org",
      phone: "+91 9876543211",
      password: "$2a$10$NgSJtjb.AMlFl5B57b44FOuoHUyoy/0ujn7TVd2C0gmxq3A7Y2AOK", // ngo123
      role: "Receiver",
      joined: new Date().toLocaleDateString(),
      donations: 0,
      profile_image: "",
      provider: "local",
    },
    {
      id: 3,
      full_name: "Alex Volunteer",
      email: "hero@foodbridge.org",
      phone: "+91 9876543212",
      password: "$2a$10$M6K8MaqkD9uxg44K/EzE6.fAKKuxLfLxfyfkIFhlsuTW1W7dKgf4u", // hero123
      role: "Volunteer",
      joined: new Date().toLocaleDateString(),
      donations: 0,
      profile_image: "",
      provider: "local",
    },
  ],
  donations: [
    {
      id: 1,
      donor_id: 1,
      donor_name: "Royal Palace Banquet",
      food_name: "Fresh Veg Biryani & Curry",
      quantity: "35 meals",
      category: "Cooked Meals",
      pickup_date: new Date().toISOString().split("T")[0],
      pickup_time: "19:30",
      address: "Beach Road, Visakhapatnam, Andhra Pradesh",
      notes: "Freshly prepared, packed in hygienic containers.",
      image: "",
      status: "Available",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      donor_id: 1,
      donor_name: "Green Grocers",
      food_name: "Organic Apples & Seasonal Fruits",
      quantity: "15 kg",
      category: "Fruits & Veggies",
      pickup_date: new Date().toISOString().split("T")[0],
      pickup_time: "18:00",
      address: "Dwaraka Nagar, Visakhapatnam",
      notes: "Crisp and fresh fruit baskets.",
      image: "",
      status: "Available",
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  requests: [
    {
      id: 1,
      donation_id: 1,
      title: "Fresh Veg Biryani & Curry",
      quantity: "35 meals",
      status: "Requested",
      image: "",
      donor_name: "Royal Palace Banquet",
      category: "Cooked Meals",
      address: "Beach Road, Visakhapatnam, Andhra Pradesh",
      pickup_address: "Beach Road, Visakhapatnam, Andhra Pradesh",
      pickup_time: "19:30",
      dropoff_address: "Hope Orphanage & Care Center, Seethammadhara, Visakhapatnam",
      ngo_name: "Hope NGO",
      accepted_at: new Date().toISOString(),
      source: "Hope NGO",
      assigned_to: null,
      pickup_location: { lat: 17.7126, lng: 83.3159 },
      dropoff_location: { lat: 17.7346, lng: 83.3218 },
      reward_points: 35,
      meals_saved: 35,
    },
  ],
};

function readDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db.json, returning default data:", err);
    return defaultData;
  }
}

function writeDb(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to db.json:", err);
  }
}

const ensureTables = async () => {
  if (usePostgres && pool) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        joined TEXT NOT NULL,
        donations INTEGER DEFAULT 0,
        profile_image TEXT,
        provider TEXT
      );

      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        donor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        donor_name TEXT,
        food_name TEXT,
        quantity TEXT,
        category TEXT,
        pickup_date TEXT,
        pickup_time TEXT,
        address TEXT,
        notes TEXT,
        image TEXT,
        status TEXT DEFAULT 'Available',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        donation_id INTEGER REFERENCES donations(id) ON DELETE SET NULL,
        title TEXT,
        quantity TEXT,
        status TEXT DEFAULT 'Requested',
        image TEXT,
        donor_name TEXT,
        category TEXT,
        address TEXT,
        pickup_address TEXT,
        pickup_time TEXT,
        dropoff_address TEXT,
        ngo_name TEXT,
        accepted_at TIMESTAMPTZ,
        source TEXT,
        assigned_to TEXT,
        pickup_location JSONB,
        dropoff_location JSONB,
        reward_points INTEGER,
        meals_saved INTEGER
      );
    `);
  } else {
    readDb();
  }
};

const normalizeRole = (role) => {
  if (!role) return "Donor";

  const normalized = String(role).trim().toLowerCase();
  if (["donor", "donate", "donation"].includes(normalized)) return "Donor";
  if (["ngo", "receiver", "recipient", "charity", "organization"].includes(normalized)) return "Receiver";
  if (["hero", "volunteer", "food hero", "worker"].includes(normalized)) return "Volunteer";

  return String(role).trim();
};

const mapUser = (row) => ({
  id: row.id,
  fullName: row.full_name || row.fullName,
  email: row.email,
  phone: row.phone,
  role: row.role,
  joined: row.joined,
  donations: row.donations || 0,
  profileImage: row.profile_image || row.profileImage || "",
  provider: row.provider,
});

// ----------------------------------------------------
// API Routes
// ----------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({ ok: true, storage: usePostgres ? "postgresql" : "file-db" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, phone, password, role, joined } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required user fields." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const joinedValue = joined || new Date().toLocaleDateString();
    const normalizedRole = normalizeRole(role);
    const emailLower = email.toLowerCase().trim();

    if (usePostgres && pool) {
      const insert = await pool.query(
        `INSERT INTO users (full_name, email, phone, password, role, joined, donations, profile_image)
         VALUES ($1, $2, $3, $4, $5, $6, 0, '')
         RETURNING *`,
        [fullName, emailLower, phone || "", hashedPassword, normalizedRole, joinedValue]
      );
      const user = mapUser(insert.rows[0]);
      return res.json({ user });
    } else {
      const db = readDb();
      const existing = db.users.find((u) => u.email.toLowerCase() === emailLower);
      if (existing) {
        return res.status(409).json({ error: "A user with this email already exists." });
      }
      const nextId = db.users.length > 0 ? Math.max(...db.users.map((u) => u.id || 0)) + 1 : 1;
      const newUser = {
        id: nextId,
        full_name: fullName,
        email: emailLower,
        phone: phone || "",
        password: hashedPassword,
        role: normalizedRole,
        joined: joinedValue,
        donations: 0,
        profile_image: "",
        provider: "local",
      };
      db.users.push(newUser);
      writeDb(db);
      return res.json({ user: mapUser(newUser) });
    }
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "A user with this email already exists." });
    }
    console.error(error);
    res.status(500).json({ error: "Registration failed." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const emailLower = email.toLowerCase().trim();
    let user;

    if (usePostgres && pool) {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [emailLower]);
      user = result.rows[0];
    } else {
      const db = readDb();
      user = db.users.find((u) => u.email.toLowerCase() === emailLower);
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const normalizedRequestedRole = normalizeRole(role);
    if (normalizedRequestedRole && normalizeRole(user.role) !== normalizedRequestedRole) {
      return res.status(403).json({ error: "Selected role does not match registered account role." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      // Support demo accounts plaintext check fallback if needed
      if (password !== user.password) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
    }

    res.json({ user: mapUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed." });
  }
});

app.post("/api/auth/social-login", async (req, res) => {
  try {
    const { email, role, provider } = req.body;
    if (!email || !provider) {
      return res.status(400).json({ error: "Email and provider are required." });
    }

    const emailLower = email.toLowerCase().trim();
    const normalizedRequestedRole = normalizeRole(role);

    if (usePostgres && pool) {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [emailLower]);
      const existingUser = result.rows[0];

      if (existingUser) {
        if (normalizedRequestedRole && normalizeRole(existingUser.role) !== normalizedRequestedRole) {
          return res.status(403).json({ error: "Selected role does not match registered account role." });
        }
        await pool.query("UPDATE users SET provider = $1 WHERE id = $2", [provider.toLowerCase(), existingUser.id]);
        return res.json({ user: mapUser(existingUser) });
      }

      const hashedPassword = await bcrypt.hash(`${provider.toLowerCase()}-auth`, 10);
      const newUserResult = await pool.query(
        `INSERT INTO users (full_name, email, phone, password, role, joined, donations, profile_image, provider)
         VALUES ($1, $2, $3, $4, $5, $6, 0, '', $7)
         RETURNING *`,
        [
          email.split("@")[0].replace(/[._-]/g, " "),
          emailLower,
          "",
          hashedPassword,
          normalizedRequestedRole || "Volunteer",
          new Date().toLocaleDateString(),
          provider.toLowerCase(),
        ]
      );

      return res.json({ user: mapUser(newUserResult.rows[0]) });
    } else {
      const db = readDb();
      const existingUser = db.users.find((u) => u.email.toLowerCase() === emailLower);

      if (existingUser) {
        if (normalizedRequestedRole && normalizeRole(existingUser.role) !== normalizedRequestedRole) {
          return res.status(403).json({ error: "Selected role does not match registered account role." });
        }
        existingUser.provider = provider.toLowerCase();
        writeDb(db);
        return res.json({ user: mapUser(existingUser) });
      }

      const hashedPassword = await bcrypt.hash(`${provider.toLowerCase()}-auth`, 10);
      const nextId = db.users.length > 0 ? Math.max(...db.users.map((u) => u.id || 0)) + 1 : 1;
      const newUser = {
        id: nextId,
        full_name: email.split("@")[0].replace(/[._-]/g, " "),
        email: emailLower,
        phone: "",
        password: hashedPassword,
        role: normalizedRequestedRole || "Volunteer",
        joined: new Date().toLocaleDateString(),
        donations: 0,
        profile_image: "",
        provider: provider.toLowerCase(),
      };
      db.users.push(newUser);
      writeDb(db);
      return res.json({ user: mapUser(newUser) });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Social login failed." });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  res.json({ success: true });
});

app.put("/api/users/me", async (req, res) => {
  try {
    const updates = req.body;
    if (!updates.email) {
      return res.status(400).json({ error: "Email is required for user updates." });
    }

    const emailLower = updates.email.toLowerCase().trim();

    if (usePostgres && pool) {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [emailLower]);
      const user = result.rows[0];
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const fields = [];
      const values = [];
      let index = 1;
      Object.keys(updates).forEach((key) => {
        if (key === "email") return;
        const column = key === "profileImage" ? "profile_image" : key === "fullName" ? "full_name" : key;
        fields.push(`${column} = $${index}`);
        values.push(updates[key]);
        index += 1;
      });

      if (fields.length === 0) {
        return res.json({ user: mapUser(user) });
      }

      const query = `UPDATE users SET ${fields.join(", ")} WHERE email = $${index} RETURNING *`;
      values.push(emailLower);

      const updated = await pool.query(query, values);
      return res.json({ user: mapUser(updated.rows[0]) });
    } else {
      const db = readDb();
      const userIndex = db.users.findIndex((u) => u.email.toLowerCase() === emailLower);
      if (userIndex === -1) {
        return res.status(404).json({ error: "User not found." });
      }

      const user = db.users[userIndex];
      Object.keys(updates).forEach((key) => {
        if (key === "email") return;
        if (key === "fullName") user.full_name = updates[key];
        else if (key === "profileImage") user.profile_image = updates[key];
        else user[key] = updates[key];
      });

      writeDb(db);
      return res.json({ user: mapUser(user) });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Profile update failed." });
  }
});

app.get("/api/donations", async (req, res) => {
  try {
    if (usePostgres && pool) {
      const donations = await pool.query("SELECT * FROM donations ORDER BY created_at DESC");
      return res.json({ donations: donations.rows });
    } else {
      const db = readDb();
      const sorted = [...(db.donations || [])].sort((a, b) => {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
      return res.json({ donations: sorted });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch donations." });
  }
});

app.post("/api/donations", async (req, res) => {
  try {
    const donation = req.body;
    if (usePostgres && pool) {
      const insert = await pool.query(
        `INSERT INTO donations (donor_id, donor_name, food_name, quantity, category, pickup_date, pickup_time, address, notes, image, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          null,
          donation.donorName || donation.donor_name || "Anonymous",
          donation.foodName || donation.food_name,
          donation.quantity,
          donation.category,
          donation.pickupDate,
          donation.pickupTime,
          donation.address,
          donation.notes,
          donation.image,
          donation.status || "Available",
        ]
      );

      if (donation.email) {
        await pool.query("UPDATE users SET donations = donations + 1 WHERE email = $1", [donation.email.toLowerCase()]);
      }

      return res.json({ donation: insert.rows[0] });
    } else {
      const db = readDb();
      const nextId = db.donations.length > 0 ? Math.max(...db.donations.map((d) => d.id || 0)) + 1 : 1;
      const newDonation = {
        id: nextId,
        donor_id: null,
        donor_name: donation.donorName || donation.donor_name || "Anonymous",
        food_name: donation.foodName || donation.food_name,
        quantity: donation.quantity,
        category: donation.category,
        pickup_date: donation.pickupDate,
        pickup_time: donation.pickupTime,
        address: donation.address,
        notes: donation.notes,
        image: donation.image || "",
        status: donation.status || "Available",
        created_at: new Date().toISOString(),
      };
      db.donations.unshift(newDonation);

      if (donation.email) {
        const u = db.users.find((user) => user.email.toLowerCase() === donation.email.toLowerCase());
        if (u) {
          u.donations = (u.donations || 0) + 1;
        }
      }

      writeDb(db);
      return res.json({ donation: newDonation });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to save donation." });
  }
});

app.put("/api/donations/:id", async (req, res) => {
  try {
    const donationId = parseInt(req.params.id, 10);
    const updates = req.body;

    if (usePostgres && pool) {
      const fields = [];
      const values = [];
      let index = 1;

      Object.keys(updates).forEach((key) => {
        const column =
          key === "foodName"
            ? "food_name"
            : key === "pickupDate"
            ? "pickup_date"
            : key === "pickupTime"
            ? "pickup_time"
            : key === "donorName"
            ? "donor_name"
            : key;
        fields.push(`${column} = $${index}`);
        values.push(updates[key]);
        index += 1;
      });

      if (fields.length === 0) {
        return res.status(400).json({ error: "No donation fields to update." });
      }

      const query = `UPDATE donations SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;
      values.push(donationId);

      const updated = await pool.query(query, values);
      return res.json({ donation: updated.rows[0] });
    } else {
      const db = readDb();
      const donation = db.donations.find((d) => d.id === donationId);
      if (!donation) {
        return res.status(404).json({ error: "Donation not found." });
      }

      Object.keys(updates).forEach((key) => {
        const mappedKey =
          key === "foodName"
            ? "food_name"
            : key === "pickupDate"
            ? "pickup_date"
            : key === "pickupTime"
            ? "pickup_time"
            : key === "donorName"
            ? "donor_name"
            : key;
        donation[mappedKey] = updates[key];
      });

      writeDb(db);
      return res.json({ donation });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update donation." });
  }
});

app.get("/api/requests", async (req, res) => {
  try {
    if (usePostgres && pool) {
      const requests = await pool.query("SELECT * FROM requests ORDER BY id DESC");
      return res.json({ requests: requests.rows });
    } else {
      const db = readDb();
      const sorted = [...(db.requests || [])].sort((a, b) => (b.id || 0) - (a.id || 0));
      return res.json({ requests: sorted });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch requests." });
  }
});

app.post("/api/requests", async (req, res) => {
  try {
    const request = req.body;
    if (usePostgres && pool) {
      const insert = await pool.query(
        `INSERT INTO requests (donation_id, title, quantity, status, image, donor_name, category, address, pickup_address, pickup_time, dropoff_address, ngo_name, accepted_at, source, assigned_to, pickup_location, dropoff_location, reward_points, meals_saved)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
         RETURNING *`,
        [
          request.donationId || request.donation_id,
          request.title,
          request.quantity,
          request.status || "Requested",
          request.image,
          request.donorName || request.donor_name,
          request.category,
          request.address,
          request.pickup_address,
          request.pickup_time,
          request.dropoff_address,
          request.ngo_name,
          request.acceptedAt,
          request.source,
          request.assigned_to,
          request.pickup_location ? JSON.stringify(request.pickup_location) : null,
          request.dropoff_location ? JSON.stringify(request.dropoff_location) : null,
          request.reward_points,
          request.meals_saved,
        ]
      );
      return res.json({ request: insert.rows[0] });
    } else {
      const db = readDb();
      const nextId = db.requests.length > 0 ? Math.max(...db.requests.map((r) => r.id || 0)) + 1 : 1;
      const newRequest = {
        id: nextId,
        donation_id: request.donationId || request.donation_id,
        title: request.title,
        quantity: request.quantity,
        status: request.status || "Requested",
        image: request.image,
        donor_name: request.donorName || request.donor_name,
        category: request.category,
        address: request.address,
        pickup_address: request.pickup_address,
        pickup_time: request.pickup_time,
        dropoff_address: request.dropoff_address,
        ngo_name: request.ngo_name,
        accepted_at: request.acceptedAt || new Date().toISOString(),
        source: request.source,
        assigned_to: request.assigned_to || null,
        pickup_location: request.pickup_location || null,
        dropoff_location: request.dropoff_location || null,
        reward_points: request.reward_points || 20,
        meals_saved: request.meals_saved || 10,
      };
      db.requests.unshift(newRequest);
      writeDb(db);
      return res.json({ request: newRequest });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to save request." });
  }
});

app.put("/api/requests/:id", async (req, res) => {
  try {
    const requestId = parseInt(req.params.id, 10);
    const updates = req.body;

    if (usePostgres && pool) {
      const fields = [];
      const values = [];
      let index = 1;

      Object.keys(updates).forEach((key) => {
        const columnMap = {
          assigned_to: "assigned_to",
          status: "status",
          dropoff_address: "dropoff_address",
          pickup_address: "pickup_address",
          pickup_time: "pickup_time",
        };
        const column = columnMap[key] || key;
        let value = updates[key];
        if (key === "pickup_location" || key === "dropoff_location") {
          value = JSON.stringify(value);
        }
        fields.push(`${column} = $${index}`);
        values.push(value);
        index += 1;
      });

      if (fields.length === 0) {
        return res.status(400).json({ error: "No request fields to update." });
      }

      const query = `UPDATE requests SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;
      values.push(requestId);

      const updated = await pool.query(query, values);
      return res.json({ request: updated.rows[0] });
    } else {
      const db = readDb();
      const request = db.requests.find((r) => r.id === requestId);
      if (!request) {
        return res.status(404).json({ error: "Request not found." });
      }

      Object.keys(updates).forEach((key) => {
        request[key] = updates[key];
      });

      writeDb(db);
      return res.json({ request });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update request." });
  }
});

// Serve production build if available
const buildPath = path.join(__dirname, "..", "build");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// ----------------------------------------------------
// Start Server
// ----------------------------------------------------
const startServer = async () => {
  try {
    // Try connecting to PostgreSQL if DATABASE_URL or default is specified
    const dbUrl = process.env.DATABASE_URL || "postgresql://postgres@localhost:5432/foodbridge";
    try {
      const testPool = new Pool({
        connectionString: dbUrl,
        connectionTimeoutMillis: 2000,
      });
      await testPool.query("SELECT 1");
      pool = testPool;
      usePostgres = true;
      console.log("Connected to PostgreSQL database successfully.");
    } catch (pgErr) {
      usePostgres = false;
      console.log("PostgreSQL not available. Falling back to local file-based database (backend/data/db.json).");
    }

    await ensureTables();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Food Bridge Backend is running at http://localhost:${port}`);
      console.log(`Database engine: ${usePostgres ? "PostgreSQL" : "Local JSON (backend/data/db.json)"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
