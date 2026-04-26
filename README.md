# it3030-paf-2026-smart-campus-porata10
PAF assignment 2026-Smart campus

# Smart Campus Operations Hub

PAF assignment 2026 - Smart Campus

## Group - porata10

### Members
- IT22571984 Wickramarathna H.P.R.D.T
- IT22569172 Fernando S.I.R
- IT22581716 Perera M.M.D
- IT22349460 Warunika R.S

## Project Overview

Smart Campus Operations Hub is a role-based platform for:
- Incident (ticket) lifecycle management
- Resource booking and approval workflows
- Notification and preference management
- Admin analytics and user role management

### Roles
- USER
- ADMIN
- TECHNICIAN

## Tech Stack

### Backend
- Spring Boot 3.4.4
- Spring Security + JWT
- Spring Data MongoDB
- Google OAuth token verification
- Java 17

### Frontend
- React 19 + Vite
- React Router
- Axios
- Tailwind CSS

### Data Store
- MongoDB (Atlas connection configured in backend)

## Core Workflows

### Authentication Workflow

Supports both local auth and Google sign-in.

1. User signs in or registers via frontend login page.
2. Backend returns JWT (`token`) + user profile.
3. Frontend stores token in `localStorage` (`smart_campus_token`).
4. Axios interceptor attaches `Authorization: Bearer <token>` on protected requests.
5. Backend JWT filter validates token and populates Spring Security context.

Public auth endpoints:
- `POST /api/auth/login` (Google token exchange)
- `POST /api/auth/login/local`
- `POST /api/auth/register`

Protected profile endpoints:
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `POST /api/auth/me/profile-picture`

### Ticket (Incident) Workflow

Status flow:
- `OPEN` (created)
- `ASSIGNED` (admin assigns technician)
- `IN_PROGRESS` (technician starts)
- `RESOLVED` (technician resolves)
- `CLOSED` (admin closes)

Technician updates and attachments are supported.

### Booking Workflow

Status flow:
- `PENDING` (created)
- `APPROVED` (admin)
- `REJECTED` (admin, with reason)
- `CANCELLED` (user)

Rules:
- Resource must be active.
- `startTime` must be before `endTime`.
- Overlapping bookings are blocked by availability checks.

### Notification Workflow

Notifications are created by backend business actions (bookings, ticket assignments, status changes, technician updates).

Client operations:
- list notifications
- unread count
- mark one as read
- mark all as read

Preference categories:
- `statusUpdates`
- `technicianUpdates`
- `assignments`
- `system`

## API Summary

### Auth
- `POST /api/auth/login`
- `POST /api/auth/login/local`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `POST /api/auth/me/profile-picture`

### Bookings
- `POST /api/bookings`
- `PUT /api/bookings/{id}`
- `GET /api/bookings/my`
- `GET /api/bookings/check-availability`
- `GET /api/bookings` (ADMIN)
- `PATCH /api/bookings/{id}/status` (ADMIN)
- `DELETE /api/bookings/{id}`

### Tickets
- `POST /api/tickets` (USER)
- `GET /api/tickets/my` (USER)
- `GET /api/tickets/{id}` (USER/ADMIN/TECHNICIAN)
- `GET /api/tickets/all` (ADMIN)
- `PATCH /api/tickets/{id}/assign` (ADMIN)
- `GET /api/tickets/assigned` (TECHNICIAN)
- `PATCH /api/tickets/{id}/status` (ADMIN/TECHNICIAN)
- `POST /api/tickets/{id}/attachments` (USER/ADMIN/TECHNICIAN)
- `GET /api/tickets/{id}/attachments/download` (USER/ADMIN/TECHNICIAN)
- `POST /api/tickets/{id}/updates` (TECHNICIAN)
- `GET /api/tickets/{id}/updates` (USER/ADMIN/TECHNICIAN)

### Incident Compatibility Endpoints

The project also exposes update/delete/status routes under `/api/incidents`:
- `PUT /api/incidents/{id}/status`
- `PUT /api/incidents/{id}`
- `DELETE /api/incidents/{id}`

### Resources
- `GET /api/resources`
- `GET /api/resources/{id}`
- `POST /api/resources` (ADMIN)
- `PUT /api/resources/{id}` (ADMIN)
- `PUT /api/resources/{id}/status` (ADMIN)
- `DELETE /api/resources/{id}` (ADMIN)

Search filters for `GET /api/resources`:
- `name`
- `type`
- `minCapacity`
- `location`

### Notifications
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PATCH /api/notifications/{id}/read`
- `PATCH /api/notifications/read-all`

### User Preferences
- `GET /api/users/preferences`
- `PUT /api/users/preferences`

### Admin APIs

User role management:
- `GET /api/admin/users`
- `PATCH /api/admin/users/{id}/role`

Analytics:
- `GET /api/admin/analytics/top-resources`
- `GET /api/admin/analytics/peak-hours`
- `GET /api/admin/analytics/booking-trends`
- `GET /api/admin/analytics/incidents-summary`

## Frontend Route Map

Public:
- `/`
- `/login`

Protected (role-aware):
- `/dashboard/user`
- `/dashboard/admin`
- `/dashboard/technician`
- `/bookings`
- `/admin/bookings`
- `/admin/users`
- `/incidents/create`
- `/incidents/my`
- `/incidents/admin`
- `/incidents/assigned`
- `/incidents/:id`
- `/notifications`
- `/settings/notifications`
- `/settings/profile`
- `/settings/security`
- `/resources`
- `/resources/:id`
- `/resources/create` (ADMIN)
- `/resources/edit/:id` (ADMIN)

## Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+
- npm 9+

### 1. Start Backend

```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

Backend runs on:
- `http://localhost:8080`

Alternative from project root:

```bash
mvn -f backend/pom.xml spring-boot:run
```

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
- `http://localhost:5173`

### 3. Optional Commands

Frontend:
```bash
npm run lint
npm run build
npm run preview
```

Backend:
```bash
mvn test
```

## File Upload Limits

- Max single file size: `5MB`
- Max multipart request size: `10MB`
- Upload directory: `/uploads`

## Troubleshooting (Windows PowerShell)

If backend port `8080` is already in use:

```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force }
```

If frontend port `5173` is already in use:

```powershell
Get-NetTCPConnection -LocalPort 5173 -State Listen | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force }
```

Then restart:
- backend: `mvn spring-boot:run`
- frontend: `npm run dev`

