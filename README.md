# Food Bridge - Surplus Food Redistribution Platform

Food Bridge connects food donors (restaurants, caterers, households) with NGOs, shelters, and volunteer food heroes to reduce food waste and feed those in need.

---

## 🚀 Quick Start (One Command)

To run the entire website (both Backend API and Frontend React Web App):

```bash
npm start
```

- **Frontend Website:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)

---

## 🔑 Demo Accounts

You can test all roles immediately using the pre-configured accounts or sign up for a new account:

| Role | Email | Password | Dashboard Features |
| :--- | :--- | :--- | :--- |
| **Donor** | `donor@foodbridge.org` | `donor123` | Create food donations, view stats, donation tracking |
| **Receiver (NGO)** | `ngo@foodbridge.org` | `ngo123` | Browse surplus food donations, claim food, request deliveries |
| **Volunteer (Food Hero)** | `hero@foodbridge.org` | `hero123` | Accept delivery tasks, live routes & GPS coordination |

---

## 🛠️ Available Scripts

- **`npm start`**: Runs both backend API (port 8000) and frontend React app (port 3000) concurrently with unified logging.
- **`npm run start:client`**: Runs only the React frontend development server on port 3000.
- **`npm run start:server`**: Runs only the Node.js Express backend server on port 8000.
- **`npm run build`**: Builds an optimized production bundle in the `build/` folder.

---

## 📦 Database & Storage

The backend includes dual-engine persistence:
1. **Zero-Configuration Mode (Default):** If PostgreSQL is not installed or running, the backend seamlessly stores data in `backend/data/db.json`. All registrations, logins, donations, requests, and updates persist across restarts automatically.
2. **PostgreSQL Mode:** If PostgreSQL is running on `postgresql://postgres@localhost:5432/foodbridge` (or specified via `DATABASE_URL` in `backend/.env`), the server will automatically use PostgreSQL tables.

---

## 🌟 Key Features

- **Interactive Landing Page**: Modern, responsive design with impact metrics.
- **Role-Based Authentication**: Custom dashboards tailored for Donors, NGOs, and Volunteers.
- **Surplus Food Donation Flow**: Donors can list food with photos, categories, quantities, and pickup times.
- **NGO Claiming & Distribution**: Verified charities can browse and claim available surplus food.
- **Volunteer Delivery & Routing**: Real-time pickup/dropoff routing with GPS distance calculations.
- **Gamified Rewards System**: Donors and volunteers earn points for meals saved, unlock mystery gift boxes, and scratch reward vouchers.
