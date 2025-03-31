# OAuth Authentication for DL-Gen

This document describes how to use the OAuth authentication system implemented for the DL-Gen application.

## Overview

The authentication system uses OAuth 2.0 Password Flow with JWT tokens. It consists of:

1. A FastAPI backend that handles authentication and provides protected API endpoints
2. Frontend components for login and authentication state management

## Backend (FastAPI)

The FastAPI backend provides the following endpoints:

- `/token` - POST endpoint for obtaining JWT tokens
- `/users/me` - GET endpoint to retrieve the current user's information
- `/users` - GET endpoint to list all users (protected)
- `/users` - POST endpoint to create a new user
- `/protected-resource` - Example of a protected endpoint

### Running the Backend

You can run the FastAPI backend in several ways:

#### Using Docker Compose

```bash
docker-compose up
```

This will start both the frontend and backend services.

#### Running Directly

```bash
cd fastapi-backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Test Users

For testing purposes, the following users are available:

- Username: `johndoe`, Password: `secret`
- Username: `alice`, Password: `password`

## Frontend Integration

The frontend includes:

1. Authentication context provider (`AuthProvider`)
2. Login form component
3. Protected route component

### Using Authentication in React Components

```tsx
import { useAuth } from '../shared/api/auth';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Protecting Routes

Use the `ProtectedRoute` component to protect routes that require authentication:

```tsx
import { ProtectedRoute } from './app/providers/protected-route';

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } 
  />
</Routes>
```

## Security Considerations

1. In production, always use HTTPS for all communications
2. Generate a secure random key for the SECRET_KEY environment variable
3. Store sensitive information in environment variables, not in code
4. Consider implementing refresh tokens for better security
5. Implement proper CORS settings in production

## Customization

You can customize the authentication system by:

1. Adding more user fields in the `User` model
2. Implementing email verification
3. Adding social login providers (Google, GitHub, etc.)
4. Implementing password reset functionality

For more information, refer to the FastAPI documentation on security: https://fastapi.tiangolo.com/tutorial/security/