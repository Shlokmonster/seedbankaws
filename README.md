# 🌿 SeedBank Genetic Resource Cloud

A comprehensive cloud platform for managing seed genetic resources, built for scalability, high availability, and security.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)

## ✨ Features
- 📊 **Centralized Dashboard**: Real-time metrics and KPIs
- 🌱 **Seed Management**: Track seed varieties, genetic categories, and preservation status
- 🏛️ **Storage Center Management**: Manage multi-location storage facilities
- 👥 **Role-Based Access Control**: Admin, Manager, and Staff user roles
- 📈 **Analytics & Reporting**: Custom reports and data visualization
- 📡 **Monitoring & Alerting**: System health monitoring with endpoints (/health, /ready, /metrics)
- 💲 **Pricing Strategy**: Subscription plans and AWS cost breakdown
- 🔒 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 📦 **Dockerized Deployment**: Containerized application services with Docker Compose
- ☁️ **AWS-Ready**: CloudFormation template for AWS deployment
- 📄 **API Documentation**: Swagger/OpenAPI documentation at /api-docs
- 📁 **File Uploads**: Secure file uploads (images, PDFs, CSVs) with Multer
- 🔐 **Security Features**: Helmet, rate limiting, CORS, SQL injection protection, XSS protection

## 🛠️ Tech Stack
**Frontend**:
- React 19
- Vite
- Recharts

**Backend**:
- Node.js
- Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- Multer
- Helmet
- Express Rate Limit
- Winston (logging)
- Swagger/OpenAPI

**DevOps**:
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- AWS CloudFormation

## 🚀 Local Development

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker and Docker Compose

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Seedbankawsshlokkadam
   ```

2. **Install dependencies**
   ```bash
   ./setup.sh
   ```
   Or manually:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install && cd ..
   ```

3. **Copy environment variables**
   ```bash
   cp .env.example .env
   cd backend && cp .env.example .env
   ```

4. **Start the application**
   - **Option 1: Using Docker Compose (Recommended)**
     ```bash
     ./deploy.sh
     ```
   - **Option 2: Manual setup**
     1. Start PostgreSQL database
     2. Setup database schema (`npm run db:setup`)
     3. Seed database (`npm run db:seed`)
     4. Start backend (`npm run dev`)
     5. Start frontend (in new terminal: `npm run dev`)

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001
   - API Docs: http://localhost:5001/api-docs

### Default Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | priya@seedbank.gov | password123 |
| Manager | erik@seedbank.gov | password123 |
| Staff | amara@seedbank.gov | password123 |

## 🐳 Docker Deployment

### Build and Run with Docker Compose
```bash
# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Initialize database (only first run)
docker-compose exec backend node database/setup.js
docker-compose exec backend node database/seed.js
```

### Service URLs
- Frontend: http://localhost
- Backend: http://localhost:5000
- API Docs: http://localhost/api-docs
- Database: localhost:5432

## ☁️ AWS Deployment

### Prerequisites
1. An AWS account
2. A GitHub repository with your SeedBank code
3. An EC2 Key Pair (for SSH access)

---

### Option 1: CloudFormation (One-Click Deployment)
This is the easiest and most automated method! It sets up all infrastructure for you (VPC, EC2, RDS).

#### Step 1: Create an EC2 Key Pair
1. Go to AWS Console → **EC2**
2. Left sidebar → **Network & Security** → **Key Pairs**
3. Click **Create key pair**
4. Name: `seedbank-key` (or your preferred name)
5. Key pair type: **RSA**
6. Private key file format: `.pem` (for macOS/Linux) or `.ppk` (for PuTTY on Windows)
7. Click **Create key pair** → save the file somewhere safe!

#### Step 2: Launch CloudFormation Stack
1. Go to AWS Console → **CloudFormation**
2. Click **Create stack** → **With new resources (standard)**
3. **Prepare template**: Choose **Upload a template file**
4. Click **Choose file** → select `cloudformation.yml` from your project
5. Click **Next**
6. **Specify stack details**:
   - Stack name: `seedbank-stack`
   - KeyName: Select the key pair you created in Step 1
   - InstanceType: Choose `t3.medium` (good for testing; upgrade later if needed)
   - DBUsername: `postgres` (default, or your preferred username)
   - DBPassword: Choose a strong password (8+ characters, no slashes or @ signs)
7. Click **Next** → **Next** (you can skip tags)
8. **Capabilities**: Check the box "I acknowledge that AWS CloudFormation might create IAM resources" (if shown)
9. Click **Submit**!

#### Step 3: Wait for Stack Creation
- Go to CloudFormation → **Stacks** → Select `seedbank-stack`
- Check the **Events** tab for progress (takes ~5-10 minutes)
- When status changes to **CREATE_COMPLETE**, go to the **Outputs** tab
- Copy:
  - `WebsiteURL`: Your application's public URL
  - `RDSEndpoint`: Your PostgreSQL database endpoint

#### Step 4: Connect to EC2 and Deploy the App
1. **SSH into your EC2 instance**:
   ```bash
   # On macOS/Linux
   chmod 400 seedbank-key.pem  # Restrict file permissions
   ssh -i seedbank-key.pem ec2-user@<your-ec2-public-dns>
   
   # On Windows (PowerShell)
   icacls seedbank-key.pem /inheritance:r
   icacls seedbank-key.pem /grant:r "$($env:USERNAME):(R)"
   ssh -i seedbank-key.pem ec2-user@<your-ec2-public-dns>
   ```
   Replace `<your-ec2-public-dns>` with the value from `WebsiteURL` (without `http://`).

2. **Clone your GitHub repo**:
   ```bash
   git clone <your-github-repo-url>
   cd Seedbankawsshlokkadam
   ```

3. **Configure database**:
   Edit `docker-compose.yml` and update the `backend.environment.DATABASE_URL` to use your RDS endpoint:
   ```yaml
   DATABASE_URL=postgresql://<DBUsername>:<DBPassword>@<RDSEndpoint>:5432/seedbank_cloud
   ```

4. **Deploy the app**:
   ```bash
   ./deploy.sh
   ```

5. **Done!** Access your app at the `WebsiteURL`!

---

### Option 2: Manual EC2 + RDS Deployment (Full Control)
Use this if you want to set up each resource manually.

#### Step 1: Create a VPC (Optional)
You can use your default VPC, or create a new one:
1. Go to **VPC Console** → **Your VPCs**
2. Click **Create VPC**
3. Choose **VPC and more** (default settings)
4. Click **Create VPC**

#### Step 2: Launch an EC2 Instance
1. Go to **EC2 Console** → **Launch Instances**
2. **Name and tags**: `seedbank-server`
3. **Application and OS Images**: Select **Amazon Linux 2 AMI** (free tier eligible)
4. **Instance Type**: Choose `t3.medium` (or `t3.micro` for free tier)
5. **Key Pair**: Select your key pair from Option 1, Step 1
6. **Network Settings**:
   - Click **Edit**
   - Create new security group named `seedbank-server-sg`
   - Add rules:
     - Type: SSH, Protocol: TCP, Port: 22, Source: My IP
     - Type: HTTP, Protocol: TCP, Port: 80, Source: Anywhere
     - Type: HTTPS, Protocol: TCP, Port: 443, Source: Anywhere
7. **Configure Storage**: Default 8GB is fine
8. Click **Launch Instance**

#### Step 3: Create RDS Database
1. Go to **RDS Console** → **Create database**
2. **Choose a database creation method**: **Standard Create**
3. **Engine options**: **PostgreSQL**, Version **15**
4. **Templates**: **Free tier** (if eligible) or **Production**
5. **Settings**:
   - DB instance identifier: `seedbank-db`
   - Master username: `postgres`
   - Master password: Choose a strong one
6. **Instance configuration**: `db.t3.micro` (free tier)
7. **Storage**: Default 20GB
8. **Connectivity**:
   - VPC: Same as your EC2 instance
   - Public access: **Yes**
   - VPC security group (firewall): Create new → `seedbank-db-sg`
9. **Additional configuration**: Initial database name → `seedbank_cloud`
10. Click **Create database**

#### Step 4: Update Security Groups
1. **Allow EC2 to connect to RDS**:
   - Go to RDS → `seedbank-db` → **Connectivity & security** → VPC security groups → Click the SG
   - Click **Edit inbound rules** → Add rule:
     - Type: PostgreSQL, Port: 5432, Source: Select the `seedbank-server-sg` (your EC2 security group)
   - Click **Save rules**

#### Step 5: Deploy the App
Same as Option 1, Step 4!

---

### Optional: Add SSL (HTTPS) with Let's Encrypt
To secure your app with HTTPS:
1. **Get a domain name**: Use Route 53 or any domain registrar (like GoDaddy, Namecheap)
2. **Point your domain to EC2**: Create an A record pointing to your EC2 public IP
3. **SSH into EC2**
4. **Install Certbot**:
   ```bash
   sudo yum install -y certbot python3-certbot-nginx
   ```
5. **Obtain SSL certificate**:
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```
6. **Follow the prompts**: Enter your email, agree to terms, etc.
7. **Done!** Certbot will automatically update your Nginx config!

---

### AWS Infrastructure Includes
- VPC with public subnets in multiple AZs
- Internet Gateway for public internet access
- EC2 instance for running Docker containers (frontend + backend)
- PostgreSQL RDS instance for persistent database storage
- Security groups to control network traffic

## 📁 Project Structure
```
Seedbankawsshlokkadam/
├── backend/
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── database/           # Schema and seed scripts
│   ├── middleware/         # Auth, error, validation
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── uploads/            # File storage
│   ├── utils/              # Logger, utilities
│   ├── logs/               # Log files
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   └── Dockerfile
├── src/
│   ├── components/         # React components
│   ├── context/            # React context (Auth)
│   ├── pages/              # Page components (including Pricing!)
│   ├── services/           # API services
│   └── main.jsx
├── public/
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # GitHub Actions pipeline
├── cloudformation.yml      # AWS CloudFormation template
├── docker-compose.yml      # Docker Compose config
├── Dockerfile              # Frontend Dockerfile
├── nginx.conf              # Nginx reverse proxy config
├── .dockerignore
├── .env.example
├── setup.sh                # Local setup
├── setup-server.sh         # AWS server setup
├── deploy.sh               # Docker deployment
├── health-check.sh         # Service health checks
├── backup.sh               # Database backup
└── README.md
```

## 📄 API Documentation
Swagger/OpenAPI documentation is available at:
- Local: http://localhost:5001/api-docs
- Production: [Your Domain]/api-docs

## 🔧 Configuration
### Environment Variables
- `PORT`: Backend server port (default 5001)
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: Token expiration time (e.g., 24h)
- `CORS_ORIGIN`: Allowed origin for CORS
- `FRONTEND_URL`: Frontend application URL
- `LOG_LEVEL`: Logging level (debug/info/warn/error)
- AWS_*: AWS configuration (optional)

### Database
- Run schema setup: `cd backend && npm run db:setup`
- Seed database: `cd backend && npm run db:seed`

## 🛡️ Security
- Helmet for security headers
- Rate limiting to prevent abuse
- CORS configuration
- bcrypt for password hashing
- JWT authentication
- Role-based authorization
- Input validation with express-validator
- Parameterized queries to prevent SQL injection

## 📊 Monitoring
- `/health`: Basic health check
- `/api/health`: Detailed health check (including DB)
- `/api/ready`: Readiness probe
- `/api/metrics`: System metrics (CPU, memory, uptime)

## 📝 Logs
Logs are stored in `backend/logs/`:
- `error.log`: Errors only
- `combined.log`: All logs
- Console output in development mode

## 💾 Backups
Run `./backup.sh` to create a gzipped PostgreSQL backup. Keeps last 7 days of backups by default.

## ✅ CI/CD
GitHub Actions workflow automatically:
- Installs dependencies
- Builds the app
- Runs linting
- Builds Docker images
- Verifies database connectivity

## 🎉 Complete!
Your SeedBank application is now fully production-ready and deployable on AWS!
