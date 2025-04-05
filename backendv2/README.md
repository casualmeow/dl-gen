# FastAPI Backend with OAuth Authentication

This is a simple FastAPI backend with OAuth2 authentication for the DL-Gen application.

## Features

- OAuth2 password flow authentication
- JWT token-based authentication
- Protected API endpoints
- User authentication and authorization

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Install the required dependencies:

```bash
pip install -r requirements.txt
```

2. Run the application:

```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

### Docker

You can also run the application using Docker:

```bash
docker build -t fastapi-backend .
docker run -p 8000:8000 fastapi-backend
```

## API Documentation

Once the application is running, you can access the interactive API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Authentication

### Getting a Token

To authenticate, make a POST request to `/token` with form data containing username and password:

```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=johndoe&password=secret"
```

This will return a JWT token that can be used to access protected endpoints.

### Accessing Protected Endpoints

Use the token in the Authorization header with the Bearer scheme:

```bash
curl -X GET "http://localhost:8000/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Default Users

For testing purposes, the following users are available:

- Username: johndoe, Password: secret
- Username: alice, Password: password

**Note:** In a production environment, you should replace the mock user database with a real database and generate a secure SECRET_KEY.