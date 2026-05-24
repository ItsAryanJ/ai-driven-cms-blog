# AI-Driven Blog CMS

A self-hosted single-tenant Blog/CMS built with Next.js, FastAPI, PostgreSQL, and Docker.

This project was developed as a full-stack weekend project focused on learning AI-assisted software development and building a complete end-to-end application.

---

## Features

### Authentication
- Single admin user
- JWT authentication
- Protected admin routes
- Login and logout functionality
- HttpOnly cookie-based session handling

### Blog Management
- Create posts
- Edit posts
- Delete posts
- Draft / Published status
- Automatic slug generation
- Markdown editor support
- Excerpt support
- Timestamp management

### Content Organization
- Single category per post
- Many-to-many tags
- Filtering support

### Public Blog
- Homepage displaying published posts
- Dynamic blog pages

/blog/[slug]


- Pagination support
- Category filtering
- Tag filtering

### Admin Dashboard
- Post list view
- Search functionality
- Sorting
- Status filters
- Create/Edit interface

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic

### Database
- PostgreSQL

### Infrastructure
- Docker
- Docker Compose

---

## Project Structure

```text
ai-driven-cms-blog/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── core/
│   │
│   ├── alembic/
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Setup

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-driven-cms-blog.git

cd ai-driven-cms-blog
```

---

## Run Using Docker

Build and start:

```bash
docker compose up --build
```

Run in background:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

---

## Database Migration

Apply migrations:

```bash
docker compose run --rm backend alembic upgrade head
```

---

## Access Application

Frontend:

```text
http://localhost:3000
```

Backend API documentation:

```text
http://localhost:8000/docs
```

---

## Default Admin Credentials

```text
Email:
admin@blogcms.com

Password:
Admin@123456
```

---

## Environment Variables

Example:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=blogcms

JWT_SECRET_KEY=your-secret-key

NEXT_PUBLIC_API_URL=http://backend:8000/api
```

---

## API Endpoints

### Authentication

```text
POST /api/auth/login
POST /api/auth/logout
```

### Posts

```text
GET    /api/posts
GET    /api/posts/{slug}

POST   /api/posts
PUT    /api/posts/{id}
DELETE /api/posts/{id}
```

---

## Future Improvements

- Rich text editor
- Image uploads
- Dark/light theme
- User roles
- Comments system
- Analytics dashboard
- Search indexing

---

## License

MIT License

---

Built with Next.js, FastAPI, PostgreSQL, Docker, and AI-assisted development.
