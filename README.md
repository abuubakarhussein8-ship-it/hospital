# Smart Maternal & Child Health Monitoring System (SMCHMS)

Project overview
- **Frontend:** React (Vite)
- **Backend:** Spring Boot (REST APIs + JWT security)

This repository contains the complete web application for monitoring maternal and child health activities (e.g., pregnancies, ANC visits, and appointments) with role-based access.

---

## Repository Structure

- `Frontend/` — React UI (pages, components, routing, API calls)
- `smchmsapi/` — Spring Boot backend (controllers, services, security, repositories)

---

## Backend (Spring Boot) — `smchmsapi/`

### What’s inside
- **Controllers** (e.g., Pregnancy, Appointment, ANC Visit, Auth)
- **Services** (business logic)
- **Security** (JWT filter/service + Spring Security configuration)
- **Repositories** (data access)
- **DTOs** (request/response objects)
- **Tests** (service/controller related tests)

### How to run
From `smchmsapi/`:
```bash
./mvnw test
./mvnw spring-boot:run
```

> The exact database/application configuration is expected in:
> - `smchmsapi/src/main/resources/application.yaml`

---

## Frontend (React) — `Frontend/`

### What’s inside
- Pages include:
  - Authentication: `Login`, `Register`
  - Dashboards for roles (Admin/Doctor/Nurse/Mother)
  - Pregnancy management (List/Details/Timeline/Add/Edit)
  - ANC visits
  - Appointments
  - Users management
  - Reports
- Components and layout:
  - `ProtectedRoute`, `Sidebar`, `Topbar`, common UI components

### How to run
From `Frontend/`:
```bash
npm install
npm run dev
```

Open the URL shown in the terminal (Vite).

---

## Security (JWT)

The backend uses JWT-based authentication:
- `JwtAuthenticationFilter` intercepts requests and validates tokens
- Security configuration enables role-based access control

---

## Notes for GitHub submission


- Project run commands are provided for both **Frontend** and **Backend**.

