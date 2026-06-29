# LifeBoard

A full stack job application tracker built to help job seekers organize and monitor their job search pipeline.

Built with ASP.NET Core, PostgreSQL, React, and TypeScript.

---

## Features

- User registration and login with JWT authentication
- Add, edit, and delete job applications
- Track application status (Applied, Interview, Offer, Rejected)
- Dashboard with real time pipeline stats
- Protected routes — users only see their own data

---

## Tech Stack

**Backend**
- ASP.NET Core 10 Web API
- PostgreSQL
- Entity Framework Core
- JWT Authentication
- BCrypt password hashing

**Frontend**
- React 19
- TypeScript
- React Router
- Axios

**Tools**
- Docker
- Git / GitHub
- Swagger UI

---

## Getting Started

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- PostgreSQL
- Docker (optional)

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/KelisGates22/LifeBoard.git
cd LifeBoard/LifeBoard.API
```

2. Update `appsettings.json` with your PostgreSQL credentials:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=LifeBoard;Username=postgres;Password=yourpassword"
},
"Jwt": {
  "Key": "your-secret-key",
  "Issuer": "LifeBoard",
  "Audience": "LifeBoard"
}
```

3. Run database migrations:
```bash
dotnet ef database update
```

4. Start the API:
```bash
dotnet run
```

API runs on `http://localhost:5237`
Swagger UI available at `http://localhost:5237/swagger`

### Frontend Setup

1. Navigate to the client folder:
```bash
cd LifeBoard/LifeBoard.Client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT token |

### Job Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobapplications | Get all job applications |
| GET | /api/jobapplications/{id} | Get job application by ID |
| POST | /api/jobapplications | Create a new job application |
| PUT | /api/jobapplications/{id} | Update a job application |
| DELETE | /api/jobapplications/{id} | Delete a job application |

---

## Author

Kelis Gates — [GitHub](https://github.com/KelisGates22)