# Todo Python JavaScript

This project is a full-stack application built with FastAPI for the backend and React for the frontend. It allows users to register, log in, create events, and add notes.

## Project Structure

## Backend

The backend is built using FastAPI and SQLAlchemy. It includes user authentication, event management, and note management.

### Setup

1. Create a virtual environment and activate it:
```sh
    python3 -m venv venv
    source venv/bin/activate
```

2. Install the dependencies:
```sh
    pip install -r app/backend/requirements.txt
```

3. Run the backend server:
```sh
    uvicorn app.backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Database Migrations

Database migrations are managed using Alembic. To create a new migration,
choose correct ```get_url``` function in ```env.py``` file while having Docker db containter running and run:
```sh
alembic revision --autogenerate -m "Migration message"
alembic upgrade head
```

## Frontend
The frontend is built using React and Bootstrap. It includes components for user registration, login, event creation, and note management.

### Setup
Navigate to the frontend directory:
```sh
cd app/frontend
```
Install the dependencies:
```sh
npm install
```
Run the server
```sh
npm start
```

### Docker
The project includes a docker-compose.yml file to run the application using Docker. To start the application, run:
```sh
docker-compose up --build
```

### CI/CD
The project uses CircleCI for continuous integration. The configuration file is located at config.yml.

### Pre-commit
Pre-commit hooks are configured in .pre-commit-config.yaml. To install the hooks, run:
```sh
pre-commit install
```

### License
This project is licensed under the MIT License. See the LICENSE file for details.
