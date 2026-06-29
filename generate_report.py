import os
import sys
from fpdf import FPDF

class PDFReport(FPDF):
    def header(self):
        # We don't want header on the cover page (page 1)
        if self.page_no() == 1:
            return
        
        # Header title
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, 'SeedBank Genetic Resource Cloud - University Project Report', 0, 0, 'L')
        self.cell(0, 10, f'Section {self.page_no()}', 0, 1, 'R')
        
        # Line under header
        self.set_draw_color(200, 200, 200)
        self.line(10, 18, 200, 18)
        self.ln(5)

    def footer(self):
        # No footer on the cover page
        if self.page_no() == 1:
            return
        
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Font
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(100, 100, 100)
        # Page number
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def add_chapter_title(self, num, title):
        self.set_font('Helvetica', 'B', 16)
        self.set_text_color(24, 76, 120)  # Premium deep blue
        self.cell(0, 10, f'{num}. {title}', 0, 1, 'L')
        self.ln(4)
        # Decorative underline
        self.set_draw_color(24, 76, 120)
        self.line(self.get_x(), self.get_y(), self.get_x() + 40, self.get_y())
        self.ln(6)

    def add_section_title(self, title):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(40, 40, 40)
        self.cell(0, 8, title, 0, 1, 'L')
        self.ln(2)

    def add_body_text(self, text, indent=False):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(60, 60, 60)
        if indent:
            self.cell(10)
        self.multi_cell(0, 6, text)
        self.ln(4)

    def add_code_block(self, code):
        self.set_font('Courier', '', 8.5)
        self.set_fill_color(245, 247, 250)
        self.set_text_color(50, 50, 50)
        self.set_draw_color(220, 225, 230)
        
        # We process line by line to keep it clean
        lines = code.strip().split('\n')
        for line in lines:
            # Check if line would exceed page limit
            if self.get_y() > 270:
                self.add_page()
            self.cell(0, 5, line, 1, 1, 'L', fill=True)
        self.ln(4)

def generate_pdf():
    pdf = PDFReport()
    pdf.set_margins(15, 20, 15)
    pdf.alias_nb_pages()
    
    # ------------------ PAGE 1: COVER PAGE ------------------
    pdf.add_page()
    
    # Top border / accent
    pdf.set_fill_color(24, 76, 120) # Deep Blue
    pdf.rect(0, 0, 210, 15, 'F')
    
    pdf.ln(30)
    
    # University/Institute Placeholder Header
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 10, 'UNIVERSITY PROJECT SUBMISSION', 0, 1, 'C')
    pdf.ln(10)
    
    # Title
    pdf.set_font('Helvetica', 'B', 28)
    pdf.set_text_color(24, 76, 120)
    pdf.cell(0, 15, 'SeedBank Genetic', 0, 1, 'C')
    pdf.cell(0, 15, 'Resource Cloud', 0, 1, 'C')
    pdf.ln(5)
    
    # Subtitle
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(46, 117, 89) # Forest green accent
    pdf.cell(0, 10, 'A Scalable, Secure & High-Availability Genetic Preservation Platform', 0, 1, 'C')
    pdf.ln(30)
    
    # Abstract Card
    pdf.set_fill_color(248, 249, 250)
    pdf.set_draw_color(230, 235, 240)
    pdf.rect(20, 130, 170, 50, 'DF')
    pdf.set_xy(25, 135)
    pdf.set_font('Helvetica', 'B', 11)
    pdf.set_text_color(40, 40, 40)
    pdf.cell(160, 6, 'Abstract', 0, 1, 'L')
    pdf.ln(2)
    pdf.set_x(25)
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(80, 80, 80)
    abstract_text = (
        "The SeedBank Genetic Resource Cloud is an enterprise-grade web and cloud system designed "
        "to manage, track, and monitor seed genetic resources globally. Built using React 19, "
        "Node.js/Express, PostgreSQL, and AWS CloudFormation, the system implements a modern, secure architecture "
        "incorporating Role-Based Access Control, robust Docker containerization, system-level health diagnostics, "
        "and multi-environment deployment capabilities. This report outlines the design, architecture, "
        "database structures, and cloud configuration of the platform."
    )
    pdf.multi_cell(160, 5, abstract_text)
    
    # Student Metadata at the bottom
    pdf.set_xy(15, 205)
    pdf.set_draw_color(24, 76, 120)
    pdf.line(40, 205, 170, 205)
    pdf.ln(10)
    
    pdf.set_font('Helvetica', 'B', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 6, 'Submitted By:', 0, 1, 'C')
    pdf.set_font('Helvetica', '', 12)
    pdf.set_text_color(40, 40, 40)
    pdf.cell(0, 6, 'Shlok Kadam', 0, 1, 'C')
    pdf.set_font('Helvetica', 'I', 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 6, 'Email: shlokkadam46@gmail.com', 0, 1, 'C')
    
    pdf.ln(12)
    pdf.set_font('Helvetica', 'B', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 6, 'Project Context:', 0, 1, 'C')
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 6, 'Full-Stack Web & DevOps Capstone Project', 0, 1, 'C')
    
    pdf.set_y(-25)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 10, 'Academic Year: 2026', 0, 1, 'C')
    
    # ------------------ PAGE 2: TABLE OF CONTENTS ------------------
    pdf.add_page()
    pdf.add_chapter_title('TOC', 'Table of Contents')
    
    toc_items = [
        ('1. Project Overview & Scope', '3'),
        ('2. System Architecture & Tech Stack', '4'),
        ('3. Database Design & Relational Schema', '6'),
        ('4. Backend API Architecture & Endpoints', '8'),
        ('5. Frontend Component Architecture', '10'),
        ('6. Deployment & Infrastructure as Code (AWS & Docker)', '12'),
        ('7. Security, Verification & System Health Monitoring', '14'),
        ('8. Conclusion & Future Directions', '15'),
    ]
    
    pdf.ln(10)
    for title, page in toc_items:
        pdf.set_font('Helvetica', 'B', 11)
        pdf.set_text_color(50, 50, 50)
        # Dot leaders
        dots = '.' * (80 - len(title))
        pdf.cell(140, 8, title + dots, 0, 0, 'L')
        pdf.cell(30, 8, page, 0, 1, 'R')
        pdf.ln(2)
        
    # ------------------ PAGE 3: PROJECT OVERVIEW ------------------
    pdf.add_page()
    pdf.add_chapter_title('1', 'Project Overview & Scope')
    
    pdf.add_section_title('1.1 Introduction')
    overview_p1 = (
        "Genetic diversity in agriculture is rapidly declining, with countless heirloom seed varieties "
        "and native plant genomes at risk of extinction due to climate change, monoculture farming, "
        "and environmental degradation. Seed banks are critical defenses in preserving this biological "
        "heritage. However, managing global seed catalogs, storage conditions, genetic categories, and distribution "
        "logs requires a sophisticated, secure, and centralized database tracking system."
    )
    pdf.add_body_text(overview_p1)
    
    overview_p2 = (
        "The SeedBank Genetic Resource Cloud provides a modern web application and robust cloud framework "
        "specifically tailored for genetic preservationists, lab administrators, and security staff. "
        "It acts as a single point of control for tracking species details, storage vault conditions, "
        "and administrative logs, backed by automated infrastructure templates for straightforward replication "
        "and scale in production environments."
    )
    pdf.add_body_text(overview_p2)
    
    pdf.add_section_title('1.2 Objectives & Key Deliverables')
    objectives = [
        "Create a centralized database system representing seed catalogs, storage vaults, and activity logging.",
        "Implement a Secure, Role-Based Access Control (RBAC) frontend and backend supporting Admin, Manager, and Staff roles.",
        "Ensure high availability and fault tolerance through Docker containerization and AWS CloudFormation templates.",
        "Build live telemetry and health-monitoring systems mapping CPU, memory, and database status in real-time.",
        "Establish automated CI/CD workflows and automated database backup routines for system durability."
    ]
    for obj in objectives:
        pdf.add_body_text("- " + obj, indent=True)
        
    # ------------------ PAGE 4: SYSTEM ARCHITECTURE ------------------
    pdf.add_page()
    pdf.add_chapter_title('2', 'System Architecture & Tech Stack')
    
    pdf.add_section_title('2.1 Multi-Tier Architecture')
    arch_desc = (
        "The application utilizes a classic multi-tier architecture, separating presentation, "
        "application logic, and data storage. Communication is strictly decoupled and API-driven."
    )
    pdf.add_body_text(arch_desc)
    
    # Drawing a simple text-based architecture layout
    pdf.set_font('Courier', '', 10)
    pdf.set_fill_color(240, 242, 245)
    pdf.set_draw_color(180, 180, 180)
    
    pdf.cell(180, 6, " +---------------------------------------------------------------+ ", 0, 1, 'C')
    pdf.cell(180, 6, " |                 Presentation Tier (React / Vite)              | ", 0, 1, 'C')
    pdf.cell(180, 6, " +-------------------------------+-------------------------------+ ", 0, 1, 'C')
    pdf.cell(180, 6, "                                 | HTTPS / JSON                    ", 0, 1, 'C')
    pdf.cell(180, 6, "                                 v                                 ", 0, 1, 'C')
    pdf.cell(180, 6, " +-------------------------------+-------------------------------+ ", 0, 1, 'C')
    pdf.cell(180, 6, " |            Application logic Tier (Node.js / Express)         | ", 0, 1, 'C')
    pdf.cell(180, 6, " +-------------------------------+-------------------------------+ ", 0, 1, 'C')
    pdf.cell(180, 6, "                                 | TCP / SQL                       ", 0, 1, 'C')
    pdf.cell(180, 6, "                                 v                                 ", 0, 1, 'C')
    pdf.cell(180, 6, " +-------------------------------+-------------------------------+ ", 0, 1, 'C')
    pdf.cell(180, 6, " |                Data Tier (PostgreSQL Database)                | ", 0, 1, 'C')
    pdf.cell(180, 6, " +---------------------------------------------------------------+ ", 0, 1, 'C')
    pdf.ln(6)
    
    pdf.add_section_title('2.2 Technology Stack Breakdown')
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(40, 6, 'Component', 1, 0, 'L')
    pdf.cell(60, 6, 'Technology Used', 1, 0, 'L')
    pdf.cell(80, 6, 'Purpose & Context', 1, 1, 'L')
    
    pdf.set_font('Helvetica', '', 9)
    tech_data = [
        ('Frontend Framework', 'React 19, Vite, Recharts', 'Component-based UI with interactive data charts'),
        ('Backend Runtime', 'Node.js, Express.js', 'Asynchronous event-driven REST API server'),
        ('Database Engine', 'PostgreSQL (RDS)', 'Relational seed registries and transaction histories'),
        ('Security / Auth', 'JWT, bcrypt, Helmet', 'State-free authentication, hashing, and response headers'),
        ('Containerization', 'Docker & Docker Compose', 'Service isolation (Frontend, Backend, Postgres)'),
        ('Infrastructure', 'AWS CloudFormation', 'Infrastructure-as-Code VPC, EC2, RDS configuration'),
        ('CI/CD Pipeline', 'GitHub Actions', 'Automated build, lint checks, and database validation')
    ]
    
    for comp, tech, purp in tech_data:
        pdf.cell(40, 6, comp, 1, 0, 'L')
        pdf.cell(60, 6, tech, 1, 0, 'L')
        pdf.cell(80, 6, purp, 1, 1, 'L')
    pdf.ln(6)

    # ------------------ PAGE 6: DATABASE DESIGN ------------------
    pdf.add_page()
    pdf.add_chapter_title('3', 'Database Design & Relational Schema')
    
    pdf.add_section_title('3.1 Entity Relationship Model')
    db_desc = (
        "The relational storage leverages PostgreSQL. A total of six primary tables are modeled to handle "
        "user registries, seed catalogs, storage physical locations, generated PDF reports, system monitoring metadata, "
        "and administrative logs."
    )
    pdf.add_body_text(db_desc)
    
    pdf.add_section_title('3.2 Schema Table Specifications')
    
    tables_info = [
        ('users', 'Primary user table storing names, hashes, role (Admin/Manager/Staff), status, and timestamps.'),
        ('seeds', 'Stores taxonomic details, genetic statuses, stock quantities, source regions, and links to creator ID.'),
        ('storage_centers', 'Represents physical storage vaults, storage capacity limits, and utilization metrics.'),
        ('reports', 'Keeps a record of generated system audits, file storage paths, and the generating user.'),
        ('activity_logs', 'Maintains system audit trail tracking user interactions (action, targeted module, timestamp).'),
        ('monitoring_metrics', 'Stores periodic system metrics (CPU usage, memory percentage, disk storage IO logs).')
    ]
    
    for tbl, desc in tables_info:
        pdf.set_font('Helvetica', 'B', 10)
        pdf.cell(0, 6, f'Table: {tbl}', 0, 1, 'L')
        pdf.set_font('Helvetica', '', 9.5)
        pdf.multi_cell(0, 5, desc)
        pdf.ln(2)
        
    # SQL creation sample
    pdf.add_section_title('3.3 Core Table Creation DDL (SQL)')
    sql_sample = (
        "CREATE TABLE seeds (\n"
        "    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n"
        "    seed_name VARCHAR(255) NOT NULL,\n"
        "    species VARCHAR(255) NOT NULL,\n"
        "    genetic_category VARCHAR(100) NOT NULL,\n"
        "    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),\n"
        "    region VARCHAR(255) NOT NULL,\n"
        "    preservation_status VARCHAR(100) NOT NULL,\n"
        "    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Endangered', 'Critical', 'Archived')),\n"
        "    created_by UUID REFERENCES users(id) ON DELETE SET NULL,\n"
        "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n"
        ");"
    )
    pdf.add_code_block(sql_sample)

    # ------------------ PAGE 8: API ARCHITECTURE ------------------
    pdf.add_page()
    pdf.add_chapter_title('4', 'Backend API Architecture & Endpoints')
    
    api_p1 = (
        "The server exposes structured HTTP endpoints via Express.js. Cross-Origin Resource Sharing (CORS) is enabled "
        "to allow connection from the React client. Responses are standard JSON objects with HTTP status code mappings "
        "describing operation states."
    )
    pdf.add_body_text(api_p1)
    
    pdf.add_section_title('4.1 Key Endpoints and Authentication')
    
    endpoints = [
        ('POST /api/auth/login', 'Authenticates users. Returns JSON Web Token (JWT) + user metadata on success.'),
        ('POST /api/auth/register', 'Creates new user account. Role is checked and restricted to validation criteria.'),
        ('GET /api/seeds', 'Lists all seeds. Supports filtering by species, region, or preservation classification.'),
        ('POST /api/seeds', 'Creates a new seed record. Requires Manager or Admin authorization permissions.'),
        ('GET /api/storage-centers', 'Returns storage vaults metadata including capacity and utilization ratings.'),
        ('GET /api/monitoring', 'Exposes internal metrics (database connectivity, process CPU, memory usage).'),
        ('GET /api/analytics/summary', 'Aggregates dashboard telemetry statistics, including total seed weight and count.')
    ]
    
    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(55, 6, 'Endpoint Route', 1, 0, 'L')
    pdf.cell(125, 6, 'Purpose / Auth Constraint', 1, 1, 'L')
    pdf.set_font('Helvetica', '', 8.5)
    for route, desc in endpoints:
        pdf.cell(55, 6, route, 1, 0, 'L')
        pdf.cell(125, 6, desc, 1, 1, 'L')
    pdf.ln(6)
    
    pdf.add_section_title('4.2 Sample Controller Implementation')
    controller_code = (
        "// seedController.js - Create Seed Handler\n"
        "export const createSeed = async (req, res, next) => {\n"
        "  try {\n"
        "    const { seed_name, species, genetic_category, quantity, region, preservation_status, status, description } = req.body;\n"
        "    const created_by = req.user.id;\n\n"
        "    const result = await pool.query(\n"
        "      'INSERT INTO seeds (seed_name, species, genetic_category, quantity, region, preservation_status, status, description, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',\n"
        "      [seed_name, species, genetic_category, quantity, region, preservation_status, status, description, created_by]\n"
        "    );\n\n"
        "    res.status(201).json(result.rows[0]);\n"
        "  } catch (error) {\n"
        "    next(error);\n"
        "  }\n"
        "};"
    )
    pdf.add_code_block(controller_code)

    # ------------------ PAGE 10: FRONTEND COMPONENT ARCHITECTURE ------------------
    pdf.add_page()
    pdf.add_chapter_title('5', 'Frontend Component Architecture')
    
    front_desc = (
        "The user interface is built on React 19 and bundled using Vite for rapid builds and optimized bundle sizes. "
        "Styling is managed using Vanilla CSS stylesheet associations for performance and component scoping. "
        "Interactive charting and telemetry data are displayed using Recharts SVG layers."
    )
    pdf.add_body_text(front_desc)
    
    pdf.add_section_title('5.1 Main Component Routing')
    pdf.add_body_text(
        "Application routes are declared inside App.jsx, guarded by React Context providers checking user "
        "authentication statuses. Unauthenticated routes redirect to /login."
    )
    
    app_jsx_desc = (
        "// Route Setup in App.jsx\n"
        "<Routes>\n"
        "  <Route path=\"/login\" element={<Login />} />\n"
        "  <Route path=\"/\" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>\n"
        "    <Route index element={<Dashboard />} />\n"
        "    <Route path=\"seeds\" element={<SeedManagement />} />\n"
        "    <Route path=\"storage\" element={<StorageCenters />} />\n"
        "    <Route path=\"users\" element={<AdminRoute><UserManagement /></AdminRoute>} />\n"
        "    <Route path=\"monitoring\" element={<Monitoring />} />\n"
        "    <Route path=\"pricing\" element={<Pricing />} />\n"
        "    <Route path=\"reports\" element={<Reports />} />\n"
        "    <Route path=\"settings\" element={<Settings />} />\n"
        "  </Route>\n"
        "</Routes>"
    )
    pdf.add_code_block(app_jsx_desc)
    
    pdf.add_section_title('5.2 UI Layout and Theme System')
    pdf.add_body_text(
        "The project applies a premium dark-themed aesthetic with modern CSS custom properties. Colors, font hierarchies, "
        "and flex grids are declared globally inside index.css and customized in pages stylesheet files."
    )

    # ------------------ PAGE 12: DEPLOYMENT & DEVOPS ------------------
    pdf.add_page()
    pdf.add_chapter_title('6', 'Deployment & Infrastructure as Code')
    
    devops_desc = (
        "SeedBank Genetic Resource Cloud utilizes containerization for multi-service execution. The system runs "
        "isolated node environments alongside PostgreSQL and reverse-proxy gateways using Docker and Nginx."
    )
    pdf.add_body_text(devops_desc)
    
    pdf.add_section_title('6.1 Multi-Service Docker Compose Setup')
    docker_yml = (
        "# docker-compose.yml snippet\n"
        "version: '3.8'\n"
        "services:\n"
        "  backend:\n"
        "    build: ./backend\n"
        "    environment:\n"
        "      - DATABASE_URL=postgresql://postgres:pass@db:5432/seedbank_cloud\n"
        "    ports:\n"
        "      - \"5001:5001\"\n"
        "    depends_on:\n"
        "      - db\n\n"
        "  frontend:\n"
        "    build: .\n"
        "    ports:\n"
        "      - \"80:80\"\n"
        "    depends_on:\n"
        "      - backend"
    )
    pdf.add_code_block(docker_yml)
    
    pdf.add_section_title('6.2 Cloud Infrastructure (AWS CloudFormation)')
    pdf.add_body_text(
        "Infrastructure is automated using an AWS CloudFormation template (cloudformation.yml). The setup provisions a Virtual "
        "Private Cloud (VPC) with isolated public and private subnets, security firewalls (Security Groups), "
        "an Elastic Compute Cloud (EC2) application host running the Docker services, and an RDS PostgreSQL database instance."
    )

    # ------------------ PAGE 14: SECURITY & MONITORING ------------------
    pdf.add_page()
    pdf.add_chapter_title('7', 'Security, Verification & Health Monitoring')
    
    sec_desc = (
        "Securing genetic data is critical. The backend implements security layers including express-rate-limit, "
        "helmet headers, CORS validation policies, parameterized queries to combat SQL Injection, and "
        "bcrypt hash checks."
    )
    pdf.add_body_text(sec_desc)
    
    pdf.add_section_title('7.1 API Health & Telemetry Probes')
    pdf.add_body_text(
        "The API server implements endpoints that can be scraped by load balancers or monitoring daemons:\n"
        "- /health: Quick liveness check returning status 200.\n"
        "- /api/health: Full check including database connectivity metrics.\n"
        "- /api/ready: Readiness probe checking database connectivity before traffic routing.\n"
        "- /api/metrics: Returns memory footprints, CPU cores, process uptime, and resource levels."
    )
    
    pdf.add_section_title('7.2 Automated Testing and Quality Checks')
    pdf.add_body_text(
        "The project integrates GitHub Actions pipelines (.github/workflows/ci-cd.yml) that trigger on push "
        "and pull-request branches. The script verifies NPM packages, runs code compilation, and checks database setup."
    )
    
    # ------------------ PAGE 15: CONCLUSION ------------------
    pdf.add_page()
    pdf.add_chapter_title('8', 'Conclusion & Future Directions')
    
    conc_p1 = (
        "The SeedBank Genetic Resource Cloud successfully combines modern web design paradigms with "
        "rigorous security and scalable infrastructure. By leveraging React 19, Express, PostgreSQL, "
        "Docker, and AWS CloudFormation, the project satisfies the requirements of standard industrial applications, "
        "making it ideal for university project evaluations."
    )
    pdf.add_body_text(conc_p1)
    
    pdf.add_section_title('8.2 Future Scope')
    futures = [
        "IoT Integration: Incorporate physical telemetry scraping directly from physical seed vault sensors.",
        "Blockchain Provenance: Record distribution histories on ledger technologies to guarantee authenticity.",
        "Deep Learning Classifiers: Add vision modules to categorize seed health statuses using photographs."
    ]
    for fut in futures:
        pdf.add_body_text("- " + fut, indent=True)
        
    pdf.ln(10)
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 10, 'End of Report', 0, 1, 'C')
    
    # Save PDF
    pdf_filename = "SeedBank_Project_Report.pdf"
    pdf.output(pdf_filename, 'F')
    print(f"Report successfully created: {pdf_filename}")

if __name__ == '__main__':
    generate_pdf()
