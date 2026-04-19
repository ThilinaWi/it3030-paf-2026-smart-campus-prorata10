# it3030-paf-2026-smart-campus-groupXX
PAF assignment 2026-Smart campus

# Smart Campus Operations Hub

## Group XX

### Members
- IT22571984 Wickramarathna H.P.R.D.T
- IT22569172 Fernando S.I.R
- IT22581716 Perera M.M.D
- IT22349460 Warunika R.S

## Tech Stack
- Backend: Spring Boot
- Frontend: React
- Database: (MongoDB)

## Incident Management APIs

The backend now includes an Incident Management module with ticket workflows, attachments, and technician updates.

### Ticket Status Workflow
- OPEN (on create)
- ASSIGNED (admin assigns technician)
- IN_PROGRESS (technician starts work)
- RESOLVED (technician fixes issue)
- CLOSED (optional final closure)

### Role-Based Endpoints

USER:
- POST /api/tickets
- GET /api/tickets/my
- GET /api/tickets/{id}
- POST /api/tickets/{id}/attachments

ADMIN:
- GET /api/tickets/all
- PATCH /api/tickets/{id}/assign

TECHNICIAN:
- GET /api/tickets/assigned
- PATCH /api/tickets/{id}/status
- POST /api/tickets/{id}/updates

Shared:
- GET /api/tickets/{id}/updates

### Attachments
- Upload endpoint accepts multipart file under key file
- Max file size: 5MB
- Files stored locally under /uploads

### Notifications
- Ticket creation: notifies ADMIN users
- Technician assignment: notifies assigned TECHNICIAN
- Technician update message: notifies ticket owner
- Status RESOLVED: notifies ticket owner with clear status text
- Status CLOSED: notifies ticket owner with clear status text

### Postman Collection
- Updated collection file: docs/postman/SmartCampus.postman_collection.json
- New folder added: Incident Tickets
- Collection variables added: ticketId, technicianId

## Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+
- npm 9+

### 1. Start Backend

Open a terminal and run:

cd backend
mvn clean compile
mvn spring-boot:run

Backend runs on:
- http://localhost:8080

Alternative from project root:

mvn -f backend/pom.xml spring-boot:run

### 2. Start Frontend

Open another terminal and run:

cd frontend
npm install
npm run dev

Frontend runs on:
- http://localhost:5173

### 3. Run Both Together
- Terminal 1: backend
- Terminal 2: frontend

### Troubleshooting

If backend says port 8080 is already in use:

Get-NetTCPConnection -LocalPort 8080 -State Listen | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force }

If frontend says port 5173 is already in use:

Get-NetTCPConnection -LocalPort 5173 -State Listen | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force }

Then start again:
- backend: mvn spring-boot:run
- frontend: npm run dev

