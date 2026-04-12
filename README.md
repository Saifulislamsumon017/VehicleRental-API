# 🚗 Vehicle Rental System

A scalable backend system for vehicle rental management, providing features for
vehicle browsing, booking processing, and efficient rental operation handling.

🌐 **Live URL:**  
👉`https://vehicle-rental-pi-gules.vercel.app`

---

## ✨ Features

### 🔐 Authentication & Authorization

- Secure user **signup & login** using JWT
- **Role-Based Access Control (RBAC)**
  - **Admin**
    - Manage vehicles (Create, Read, Update, Delete)
    - View all bookings
    - Manage users and roles
  - **Customer**
    - Browse available vehicles
    - Book vehicles
    - View personal booking history

### 🚘 Vehicle Management

- Add, update, and remove vehicles
- Track real-time **availability status**
- Prevent deletion of vehicles with active bookings

### 📅 Booking & Rentals

- Book vehicles with date validation
- Automatic **total cost calculation**
- Track active rentals
- Handle vehicle returns and status updates

---

## 🛠️ Technology Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript

### Database

- **Database:** PostgreSQL
- **Client:** `pg` (node-postgres) with raw SQL queries

### Security & Utilities

- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Environment Variables:** dotenv
- **Dev Tools:** tsx, nodemon (optional)

---

## 📦 Dependencies Overview

| Package      | Purpose                            |
| ------------ | ---------------------------------- |
| express      | Web framework                      |
| pg           | PostgreSQL client                  |
| bcryptjs     | Password hashing                   |
| jsonwebtoken | JWT authentication                 |
| dotenv       | Environment configuration          |
| typescript   | Type safety                        |
| tsx          | TypeScript runtime for development |

---

## ⚙️ Setup & Usage

### ✅ Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL installed & running
- npm or yarn

---

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saifulislamsumon017/VehicleRental-API.git
   ```
