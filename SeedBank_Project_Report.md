# 🌿 University Project Report: SeedBank Genetic Resource Cloud

**Course/Subject:** Capstone Project / Full-Stack Web Development & DevOps  
**Project Title:** SeedBank Genetic Resource Cloud  
**Developer:** Shlok Kadam  
**Contact:** shlokkadam46@gmail.com  
**Academic Year:** 2026  

---

## 1. Project Overview & Scope

### 1.1 Introduction
In recent decades, genetic diversity in agriculture has experienced a sharp decline. Countless heirloom seed varieties and native plant genomes are at risk of extinction due to climate change, monoculture farming, and environmental shifts. Seed banks serve as a critical buffer for preserving this botanical heritage. However, managing global seed catalogs, physical storage location metrics, seed statuses, and administrative access logs requires a secure, scalable, and centralized database tracking system.

The **SeedBank Genetic Resource Cloud** is a professional-grade web and cloud system developed for genetic preservationists, laboratory administrators, and security staff. It offers a single point of control for tracking species data, physical vault statuses, and administrative activity logs, backed by automated infrastructure-as-code templates for instant replication in production.

### 1.2 Project Scope & Objectives
1. **Centralized Repository:** Manage seed genetic catalogs, taxonomic species details, and location tracking under a secure database schema.
2. **Role-Based Security:** Protect critical data using Role-Based Access Control (RBAC) with specific authorization layers for Admins, Managers, and Staff.
3. **Containerization & High Availability:** Enable cross-platform execution and deployment standardization using Docker and Docker Compose.
4. **Cloud Infrastructure as Code:** Establish repeatable AWS resource provisioning (VPC, EC2, RDS) using a unified CloudFormation configuration.
5. **System Telemetry & Monitoring:** Expose memory, CPU, and database health metrics for real-time dashboard analytics.

---

## 2. System Architecture & Tech Stack

### 2.1 Multi-Tier Architecture
The project is built around a decoupled multi-tier architecture to isolate concerns:
1. **Presentation Layer (Frontend):** Responsive React 19 application built using Vite for hot module replacement (HMR) and optimized distribution builds.
2. **Application Layer (Backend):** Asynchronous event-driven REST API server running on Node.js and Express.js, providing secure routes, input validation, and business logic processing.
3. **Database Layer (Data Store):** PostgreSQL database hosting relational tables, indexes, and views for optimal search execution.

```
 +---------------------------------------------------------------+
 |                 Presentation Tier (React 19 / Vite)           |
 +-------------------------------+-------------------------------+
                                 | HTTPS / JSON Request-Response
                                 v
 +-------------------------------+-------------------------------+
 |            Application Logic Tier (Node.js / Express)         |
 +-------------------------------+-------------------------------+
                                 | TCP / SQL Connection
                                 v
 +-------------------------------+-------------------------------+
 |               Data Tier (PostgreSQL Database)                 |
 +---------------------------------------------------------------+
```

### 2.2 Tech Stack Details
* **Frontend:** React 19, React Router, Recharts (visual charts), Vanilla CSS.
* **Backend:** Node.js, Express.js, JWT (jsonwebtoken), bcrypt (password security), Helmet (header protections), Winston (logging).
* **Database:** PostgreSQL (SQL schemas, indexing, and data views).
* **DevOps:** Docker, Docker Compose, AWS CloudFormation (Infrastructure-as-Code), GitHub Actions (CI/CD workflows).

---

## 3. Database Design & Relational Schema

### 3.1 Entity Relationship Model
The database features six primary tables designed to map the domain entities of the seed bank system:
1. **`users`**: Manages account credentials, user verification status, and RBAC roles.
2. **`seeds`**: Keeps record of taxonomy, quantities, origin regions, and links back to the user who recorded the seed entry.
3. **`storage_centers`**: Maps physical vault details, volumetric capacity, and real-time usage percentages.
4. **`reports`**: Logs generated audit report names, URLs, and creator references.
5. **`activity_logs`**: Internal security ledger auditing actions done by users.
6. **`monitoring_metrics`**: Saves CPU and memory levels for analytics dashboards.

### 3.2 SQL Schema DDL (`schema.sql`)
```sql
-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Staff')),
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. SEEDS TABLE
CREATE TABLE seeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seed_name VARCHAR(255) NOT NULL,
    species VARCHAR(255) NOT NULL,
    genetic_category VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    region VARCHAR(255) NOT NULL,
    preservation_status VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Endangered', 'Critical', 'Archived')),
    description TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. STORAGE CENTERS TABLE
CREATE TABLE storage_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 0 CHECK (capacity >= 0),
    utilization_percentage NUMERIC(5,2) DEFAULT 0.00 CHECK (utilization_percentage BETWEEN 0 AND 100),
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Backend API Endpoints & Controller Logic

### 4.1 Rest Endpoints Mapping
* **`POST /api/auth/login`**: Checks credentials, returns signed JSON Web Tokens.
* **`GET /api/seeds`**: Yields list of registered seed resources. Supports query parameter filtering.
* **`POST /api/seeds`**: Creates a seed entry. Protected; restricted to Manager and Admin profiles.
* **`GET /api/storage-centers`**: Yields physical vault records.
* **`GET /api/monitoring`**: Returns memory, CPU platform levels, and API uptime metrics.

### 4.2 Seed Creation Controller Example (`seedController.js`)
```javascript
export const createSeed = async (req, res, next) => {
  try {
    const { seed_name, species, genetic_category, quantity, region, preservation_status, status, description } = req.body;
    const created_by = req.user.id; // Retreived from JWT verification middleware

    const result = await pool.query(
      'INSERT INTO seeds (seed_name, species, genetic_category, quantity, region, preservation_status, status, description, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [seed_name, species, genetic_category, quantity, region, preservation_status, status, description, created_by]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
```

---

## 5. Frontend Component Architecture

### 5.1 Main Component Routing (`App.jsx`)
```jsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SeedManagement from './pages/SeedManagement';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="seeds" element={<SeedManagement />} />
        <Route path="storage" element={<StorageCenters />} />
        <Route path="users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
```

---

## 6. DevOps & Infrastructure as Code

### 6.1 Multi-Service Configuration (`docker-compose.yml`)
Standardizes multi-container setups so that any system containing Docker can launch the whole system (frontend, backend, database, and reverse proxy) using a single command:
```yaml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: seedbank_cloud
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      - PORT=5001
      - DATABASE_URL=postgresql://postgres:password123@db:5432/seedbank_cloud
    ports:
      - "5001:5001"
    depends_on:
      - db
```

### 6.2 AWS Infrastructure Template (`cloudformation.yml`)
Automates creation of AWS resources:
* **VPC Networking:** Spans isolated public subnets with route tables and internet gateways.
* **EC2 Web Host:** Deploys an Amazon Linux instance configured to spin up the application services via Docker.
* **RDS Database:** Provisions a PostgreSQL instance for database backups, connected only to the application instance via security group constraints.

---

## 7. Security & Telemetry Monitoring
* **Security Headers:** Express app includes `helmet` middleware to set critical security headers (XSS filters, CSP, iframe prevention).
* **Rate Limiting:** Protects API endpoints against Denial of Service (DoS) and brute-force authentication attempts by mapping IP calls to 100 requests per 15 minutes.
* **Active Health Probes:** Exposes `/health`, `/api/health`, `/api/ready` and `/api/metrics` endpoints.

---

## 8. Conclusion
The SeedBank Genetic Resource Cloud successfully combines modern web design paradigms with security and DevOps automation. Leveraging React, Node.js, PostgreSQL, Docker, and AWS CloudFormation, this project is fully production-ready and structured to meet university project standards.
