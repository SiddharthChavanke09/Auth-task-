# Project Structure & File Guide

## Overview
A complete Node.js authentication system with Express, MongoDB, and JWT tokens.

## Directory Structure

```
auth-system/
├── 📁 config/
│   └── db.js                          # MongoDB connection configuration
│
├── 📁 controllers/
│   └── authController.js              # Business logic for auth endpoints
│
├── 📁 middleware/
│   └── auth.js                        # JWT verification middleware
│
├── 📁 models/
│   └── User.js                        # MongoDB User schema & methods
│
├── 📁 routes/
│   └── auth.js                        # API route definitions
│
├── 📁 utils/
│   └── tokenGenerator.js              # JWT token generation utilities
│
├── 📄 server.js                       # Main application entry point
├── 📄 package.json                    # Dependencies & npm scripts
├── 📄 .env                            # Environment variables (local)
├── 📄 .env.example                    # Environment template
├── 📄 .gitignore                      # Git ignore rules
│
├── 📖 README.md                       # Full documentation
├── 📖 QUICK_START.md                  # Setup & testing guide
├── 📖 PROJECT_STRUCTURE.md            # This file
│
├── 📝 frontend-example.js             # Frontend integration examples
├── 📝 postman-collection.json         # Postman API collection
│
├── 🐳 Dockerfile                      # Docker image configuration
└── 🐳 docker-compose.yml              # Docker multi-container setup
```

## File Descriptions

### Core Application Files

#### `server.js`
- **Purpose**: Main application entry point
- **Responsibilities**: 
  - Load environment variables
  - Connect to MongoDB
  - Set up Express middleware
  - Configure routes
  - Start HTTP server
- **Key Features**: Error handling, health check endpoint

#### `config/db.js`
- **Purpose**: MongoDB database connection
- **Responsibilities**:
  - Establish Mongoose connection
  - Handle connection errors
  - Exit gracefully on failure
- **Configuration**: Uses `MONGODB_URI` from .env

### Models

#### `models/User.js`
- **Purpose**: User data structure and methods
- **Schema Fields**:
  - `username` (String, unique, required)
  - `email` (String, unique, required)
  - `password` (String, hashed, required)
  - `refreshTokens` (Array, stores valid refresh tokens)
  - `timestamps` (Auto: createdAt, updatedAt)
- **Methods**:
  - `comparePassword()` - Compare plain text with hashed password
- **Middleware**:
  - Pre-save hook to hash password using bcryptjs

### Controllers

#### `controllers/authController.js`
- **Purpose**: Business logic for authentication
- **Functions**:
  - `register()` - Create new user account
  - `login()` - Authenticate user and issue tokens
  - `refreshToken()` - Issue new access token
  - `logout()` - Invalidate refresh token
- **Responsibilities**:
  - Input validation
  - Password verification
  - Token generation and storage
  - Error handling

### Routes

#### `routes/auth.js`
- **Purpose**: API endpoint definitions
- **Endpoints**:
  - `POST /register` - User registration (public)
  - `POST /login` - User login (public)
  - `POST /refresh-token` - Token refresh (public)
  - `POST /logout` - User logout (protected)
- **Imports**: authController, authenticateToken middleware

### Middleware

#### `middleware/auth.js`
- **Purpose**: JWT verification & authentication
- **Function**: `authenticateToken`
- **Responsibilities**:
  - Extract token from Authorization header
  - Verify token validity
  - Attach user info to request object
  - Return 401/403 errors for invalid tokens

### Utilities

#### `utils/tokenGenerator.js`
- **Purpose**: JWT token creation and verification
- **Functions**:
  - `generateAccessToken()` - Create access token (1 min)
  - `generateRefreshToken()` - Create refresh token (7 days)
  - `verifyAccessToken()` - Verify access token validity
  - `verifyRefreshToken()` - Verify refresh token validity
- **Configuration**: Uses JWT secrets from .env

### Configuration Files

#### `.env`
- Local environment variables (DO NOT COMMIT)
- Contains sensitive data (JWT secrets, DB URI, etc.)
- Created from `.env.example` template

#### `.env.example`
- Template for environment variables
- Safe to commit to version control
- Contains dummy/example values

#### `package.json`
- Project metadata
- Dependencies:
  - express (web framework)
  - mongoose (MongoDB ODM)
  - jsonwebtoken (JWT library)
  - bcryptjs (password hashing)
  - dotenv (env variable loader)
- Dev Dependencies:
  - nodemon (auto-reload during development)
- Scripts:
  - `npm start` - Run production server
  - `npm run dev` - Run development server with nodemon

#### `.gitignore`
- Excludes files from git version control
- Ignores: node_modules, .env, logs, etc.

### Documentation Files

#### `README.md`
- Complete project documentation
- Features overview
- Installation instructions
- API endpoint documentation
- Environment variable reference
- Project structure
- Security considerations
- Enhancement suggestions

#### `QUICK_START.md`
- Step-by-step setup guide
- Prerequisites
- MongoDB setup (local & Atlas)
- Testing with Postman/cURL/JavaScript
- Troubleshooting guide
- File structure overview

#### `PROJECT_STRUCTURE.md`
- This file
- Detailed description of each file
- Purpose and responsibilities
- Key features and methods

### Testing & Examples

#### `postman-collection.json`
- Pre-configured Postman collection
- 5 requests: Health Check, Register, Login, Refresh, Logout
- Auto-saves tokens to environment variables
- Ready to import and test

#### `frontend-example.js`
- AuthService class for frontend integration
- Usage examples for vanilla JavaScript
- React hooks example (commented)
- Vue 3 composable example (commented)
- Angular service example (commented)
- Token persistence with localStorage
- Automatic token refresh on expiry

### Docker Files

#### `Dockerfile`
- Docker image configuration
- Base: Node.js 18 Alpine
- Includes all dependencies
- Exposes port 5000

#### `docker-compose.yml`
- Multi-container setup
- Services: MongoDB + Node.js app
- Networking and volumes
- Environment configuration
- Easy one-command startup: `docker-compose up`

## API Endpoint Summary

| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| POST | `/api/auth/refresh-token` | ❌ | Get new access token |
| POST | `/api/auth/logout` | ✅ | Logout user |
| GET | `/api/health` | ❌ | Health check |

## Token Flow Diagram

```
User Registration
       ↓
Create User (password hashed)
       ↓
User Login
       ↓
Verify Credentials
       ↓
Generate accessToken (1 min) + refreshToken (7 days)
       ↓
Return tokens to client
       ↓
Access Token Expires (after 1 min)
       ↓
Client calls /refresh-token with refreshToken
       ↓
Server validates refreshToken
       ↓
Generate new accessToken
       ↓
Return new accessToken
       ↓
User can continue using app
       ↓
User Logout
       ↓
Remove refreshToken from database
```

## Data Flow

### Registration
```
Frontend → POST /register → Controller → Validate & Hash Password
    ↓
Create User → MongoDB → Return Success
```

### Login
```
Frontend → POST /login → Controller → Find User → Verify Password
    ↓
Generate Tokens → Store refreshToken in DB → Return both tokens
```

### Token Refresh
```
Frontend → POST /refresh-token → Controller → Verify refreshToken
    ↓
Check in Database → Generate new accessToken → Return token
```

### Protected Request
```
Frontend → Request with accessToken header
    ↓
Middleware → Verify Token → Extract userId → Attach to request
    ↓
Controller processes request with user context
```

## Key Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4.18.2 | Web framework |
| MongoDB | 7.0 | Database |
| Mongoose | 7.0 | ODM |
| JWT | 9.0.0 | Token management |
| bcryptjs | 2.4.3 | Password hashing |
| dotenv | 16.0.3 | Config management |
| nodemon | 2.0.20 | Dev auto-reload |

## Security Implementations

✅ Password hashing with bcryptjs (10 salt rounds)
✅ JWT token expiration
✅ Refresh token whitelist in database
✅ Token verification middleware
✅ Environment variable secrets
✅ Input validation
✅ Unique username/email constraints

## Getting Started

1. **Install**: `npm install`
2. **Configure**: Update `.env` with your settings
3. **Run**: `npm run dev`
4. **Test**: Import `postman-collection.json` to Postman
5. **Read**: Check `QUICK_START.md` for detailed guide

## Common Tasks

### Add a New Endpoint
1. Create function in `controllers/authController.js`
2. Add route in `routes/auth.js`
3. Add middleware if protected

### Extend User Model
1. Modify `models/User.js` schema
2. Add validation if needed

### Change Token Expiry
1. Update times in `.env`:
   - `ACCESS_TOKEN_EXPIRY=1m`
   - `REFRESH_TOKEN_EXPIRY=7d`

### Use Different Database
1. Change `MONGODB_URI` in `.env`
2. Ensure MongoDB is running

### Deploy to Production
1. Use `docker-compose up -d`
2. Update `.env` with production values
3. Set `NODE_ENV=production`

## Support & Resources

- Full docs: See `README.md`
- Quick setup: See `QUICK_START.md`
- Examples: See `frontend-example.js`
- API testing: See `postman-collection.json`
- JWT info: https://jwt.io
- Mongoose docs: https://mongoosejs.com
- Express docs: https://expressjs.com
