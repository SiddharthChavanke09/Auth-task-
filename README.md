# Authentication System with JWT

A complete authentication system built with Node.js, Express, and MongoDB featuring JWT access tokens and refresh tokens.

## Features

- User registration with unique usernames and emails
- User login with password hashing (bcryptjs)
- JWT access token (expires in 1 minute)
- JWT refresh token (expires in 7 days)
- Token refresh endpoint to get new access tokens
- User logout functionality
- Protected routes with middleware authentication

## Prerequisites

- Node.js (v14+)
- MongoDB (local or MongoDB Atlas connection string)

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd auth-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the values (MongoDB URI, JWT secrets, etc.)

4. **Start the server**
   ```bash
   # For development with auto-reload
   npm run dev

   # For production
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Register User
**POST** `/api/auth/register`

Request body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### 2. Login
**POST** `/api/auth/login`

Request body:
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

Response:
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### 3. Refresh Access Token
**POST** `/api/auth/refresh-token`

Request body:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:
```json
{
  "message": "Access token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Logout
**POST** `/api/auth/logout`

Headers:
```
Authorization: Bearer <accessToken>
```

Request body:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:
```json
{
  "message": "Logout successful"
}
```

## Token Flow

1. **User Registration** → User account created
2. **User Login** → Access Token (1 min) + Refresh Token (7 days) issued
3. **Access Token Expires** → Call `/refresh-token` endpoint with Refresh Token
4. **New Access Token** → User can continue using the app
5. **User Logout** → Refresh Token is invalidated

## Project Structure

```
.
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   └── authController.js     # Authentication logic
├── middleware/
│   └── auth.js               # JWT verification middleware
├── models/
│   └── User.js               # User schema and methods
├── routes/
│   └── auth.js               # Authentication routes
├── utils/
│   └── tokenGenerator.js     # JWT utilities
├── server.js                 # Main server file
├── .env                      # Environment variables
├── .env.example              # Example environment file
├── .gitignore                # Git ignore file
├── package.json              # Dependencies
└── README.md                 # This file
```

## Security Features

- Passwords hashed using bcryptjs with 10 salt rounds
- Refresh tokens stored in database (not in JWT payload)
- Token expiration validation
- Secure JWT verification
- Environment variables for secrets (don't commit .env)

## Testing with Postman

1. **Register**: POST `http://localhost:5000/api/auth/register`
2. **Login**: POST `http://localhost:5000/api/auth/login` → Copy `accessToken` and `refreshToken`
3. **Use Token**: Add header `Authorization: Bearer <accessToken>`
4. **Refresh**: POST `http://localhost:5000/api/auth/refresh-token` with `refreshToken`
5. **Logout**: POST `http://localhost:5000/api/auth/logout` with `accessToken` header and `refreshToken` body

## Error Handling

- **400**: Bad Request (missing fields)
- **401**: Unauthorized (invalid credentials)
- **403**: Forbidden (invalid/expired token)
- **409**: Conflict (username/email already exists)
- **500**: Server Error

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | `mongodb://localhost:27017/auth-system` |
| JWT_ACCESS_SECRET | Secret key for access tokens | `my_super_secret_access_key` |
| JWT_REFRESH_SECRET | Secret key for refresh tokens | `my_super_secret_refresh_key` |
| ACCESS_TOKEN_EXPIRY | Access token expiration time | `1m` |
| REFRESH_TOKEN_EXPIRY | Refresh token expiration time | `7d` |
| PORT | Server port | `5000` |
| NODE_ENV | Environment | `development` |

## Next Steps (Optional Enhancements)

- Add email verification
- Add password reset functionality
- Implement rate limiting
- Add Redis for token blacklisting
- Add role-based access control (RBAC)
- Add 2FA (Two-Factor Authentication)
- Implement CORS
- Add API documentation with Swagger

## License

ISC
