# Request Portal Backend API

This is the backend API for the Unity Bank Request Portal. It handles:

- User registration and account creation
- Login and authentication
- Password reset functionality
- OTP verification
- Request submission and status tracking

## Features

- RESTful API endpoints
- JWT authentication
- OTP-based 2FA
- Request status management
- Database persistence
- Error handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with security code
- `POST /api/auth/verify-otp` - Verify OTP token

### Requests
- `POST /api/requests` - Submit new request
- `GET /api/requests/:id` - Get request details
- `GET /api/requests` - List user's requests

## Database Models

- User
- OTPToken
- PasswordReset
- Request
- RequestStatus

## Environment Variables

```
DATABASE_URL=
JWT_SECRET=
OTP_SECRET=
API_PORT=3000
```

## Installation

```bash
npm install
npm run dev
```
