# Tlog Team Blog App

A modern, production-ready full-stack blog application.

## 🚀 Tech Stack

### Backend
- **Framework:** Django 5.2 / Django REST Framework
- **Database:** MySQL 8.0
- **Architecture:** Service/Selector pattern ("Fat Models, Thin Views")
- **Code Quality:** Ruff, Black

### Frontend
- **Framework:** React 18 / Vite / TypeScript
- **State Management:** TanStack React Query (Server State), Zustand (Client State)
- **Styling:** Tailwind CSS / Radix UI / shadcn/ui
- **Testing:** Vitest, ESLint

### DevOps
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx & Gunicorn
- **CI/CD:** GitHub Actions (Linting, Testing, Docker Build & Push)

---

## 🛠️ Local Development (Hot-Reloading)

To run the application locally for development with full hot-reloading for both the backend and frontend:

```bash
# Start the development containers
docker compose -f docker-compose.dev.yml up -d

# Check the logs to ensure everything is running smoothly
docker compose -f docker-compose.dev.yml logs -f

# Run database migrations
docker compose -f docker-compose.dev.yml exec backend python manage.py migrate

# Create a superuser for the Django admin panel
docker compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser
```

**Accessing the application:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api/`
- Django Admin: `http://localhost:8000/admin/`

---

## 🌍 Production Deployment

To run the application in a production-like environment using Gunicorn and Nginx:

```bash
# Start the production containers
docker compose -f docker-compose.prod.yml up -d --build

# Run database migrations
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Collect static files (if necessary)
docker compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
```

**Accessing the application:**
- The application will be served directly on port `80` by Nginx.
- API requests under `/api/` and static requests under `/static/` are automatically reverse-proxied to the Gunicorn backend.

---

## 🧪 Testing

The project uses GitHub actions for CI/CD which automatically lints and tests code on pushes to `main` and `develop`.

To run tests locally:

**Backend:**
```bash
docker compose -f docker-compose.dev.yml exec backend python manage.py test
```

**Frontend:**
```bash
docker compose -f docker-compose.dev.yml exec frontend npm run test
```
