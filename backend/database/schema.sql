-- PostgreSQL Schema for SeedBank Genetic Resource Cloud

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop tables if they exist (for clean setup)
DROP VIEW IF EXISTS activity_log_details_view;
DROP VIEW IF EXISTS storage_center_details_view;
DROP VIEW IF EXISTS seed_details_view;

DROP TABLE IF EXISTS monitoring_metrics CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS storage_centers CASCADE;
DROP TABLE IF EXISTS seeds CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Staff')),
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. STORAGE CENTERS TABLE
CREATE TABLE storage_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 0 CHECK (capacity >= 0),
    utilization_percentage NUMERIC(5,2) DEFAULT 0.00 CHECK (utilization_percentage BETWEEN 0 AND 100),
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. REPORTS TABLE
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    file_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ACTIVITY LOGS TABLE
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. MONITORING METRICS TABLE
CREATE TABLE monitoring_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cpu_usage NUMERIC(5,2) NOT NULL CHECK (cpu_usage BETWEEN 0 AND 100),
    memory_usage NUMERIC(5,2) NOT NULL CHECK (memory_usage BETWEEN 0 AND 100),
    disk_usage NUMERIC(5,2) NOT NULL CHECK (disk_usage BETWEEN 0 AND 100),
    network_usage NUMERIC(10,2) NOT NULL DEFAULT 0.00, -- in MB
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_seeds_region ON seeds(region);
CREATE INDEX idx_seeds_genetic_category ON seeds(genetic_category);
CREATE INDEX idx_seeds_created_at ON seeds(created_at);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_monitoring_metrics_recorded_at ON monitoring_metrics(recorded_at);

-- VIEWS FOR REPORTING & EASE OF ACCESS
-- Seed detail view (joins creator name)
CREATE VIEW seed_details_view AS
SELECT 
    s.*,
    u.name as creator_name,
    u.email as creator_email
FROM seeds s
LEFT JOIN users u ON s.created_by = u.id;

-- Storage center detail view (joins manager name)
CREATE VIEW storage_center_details_view AS
SELECT 
    sc.*,
    u.name as manager_name,
    u.email as manager_email
FROM storage_centers sc
LEFT JOIN users u ON sc.manager_id = u.id;

-- Activity log detail view (joins user details)
CREATE VIEW activity_log_details_view AS
SELECT 
    al.*,
    u.name as user_name,
    u.email as user_email,
    u.role as user_role
FROM activity_logs al
LEFT JOIN users u ON al.user_id = u.id;
