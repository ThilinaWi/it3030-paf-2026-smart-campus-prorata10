# it3030-paf-2026-smart-campus-prorata10
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

