# Quick Start Guide

## Prerequisites

1. **Node.js** - Download from https://nodejs.org/ (v14 or higher)
2. **MongoDB** - Either:
   - Local installation: https://www.mongodb.com/try/download/community
   - MongoDB Atlas (Cloud): https://www.mongodb.com/cloud/atlas

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- jsonwebtoken (JWT)
- bcryptjs (password hashing)
- dotenv (environment variables)
- nodemon (development auto-reload)

## Step 2: Configure MongoDB

### Option A: Local MongoDB
1. Start MongoDB service on your machine
2. Default connection in `.env`: `mongodb://localhost:27017/auth-system`

### Option B: MongoDB Atlas (Recommended)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth-system?retryWrites=true&w=majority
   ```

## Step 3: Update JWT Secrets

In `.env` file, change the JWT secrets to strong values:
```
JWT_ACCESS_SECRET=your_very_secret_access_key_12345
JWT_REFRESH_SECRET=your_very_secret_refresh_key_67890
```

## Step 4: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✓ MongoDB connected successfully
✓ Server running on port 5000
```

## Step 5: Test the API

### Using Postman (Recommended)

1. Download Postman from https://www.postman.com/downloads/
2. Import the collection:
   - File → Import → Select `postman-collection.json` from this project
3. Follow the requests in order:
   1. Register User
   2. Login (automatically saves tokens)
   3. Refresh Access Token (automatically saves new token)
   4. Logout

### Using cURL (Command Line)

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

Save the `accessToken` and `refreshToken` from the response.

#### Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

#### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

### Using JavaScript/Fetch

```javascript
// Register
const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  })
});

// Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser',
    password: 'password123'
  })
});

const loginData = await loginResponse.json();
const { accessToken, refreshToken } = loginData;

// Refresh Token
const refreshResponse = await fetch('http://localhost:5000/api/auth/refresh-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken })
});

const newData = await refreshResponse.json();
const newAccessToken = newData.accessToken;

// Logout (Protected)
const logoutResponse = await fetch('http://localhost:5000/api/auth/logout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({ refreshToken })
});
```

## File Structure Overview

```
auth-system/
├── config/db.js              # MongoDB connection setup
├── controllers/authController.js  # Business logic
├── middleware/auth.js        # JWT verification middleware
├── models/User.js            # User database schema
├── routes/auth.js            # API route definitions
├── utils/tokenGenerator.js   # JWT utility functions
├── server.js                 # Main application file
├── package.json              # Dependencies
├── .env                      # Configuration (secret)
├── .env.example              # Configuration template
├── README.md                 # Full documentation
└── postman-collection.json   # Postman test collection
```

## Key Features Implemented

✅ User Registration with input validation
✅ User Login with password hashing
✅ JWT Access Token (1 minute expiry)
✅ JWT Refresh Token (7 days expiry)
✅ Token Refresh Endpoint
✅ Logout with token invalidation
✅ Protected routes with middleware
✅ Secure password hashing (bcryptjs)
✅ Error handling
✅ MongoDB integration

## Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify connection string in `.env`
- Check username/password for MongoDB Atlas

### Port Already in Use
```bash
# Change PORT in .env or kill the process
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### Token Expired
- Access tokens expire in 1 minute
- Call `/refresh-token` endpoint to get a new one
- Tokens can be viewed at https://jwt.io

### "Invalid or Expired Access Token"
- Your access token expired
- Call `/refresh-token` with your refresh token
- Login again if refresh token also expired

## Security Notes

⚠️ Never commit `.env` file to version control
⚠️ Change JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in production
⚠️ Use strong passwords (enforce min 8 chars)
⚠️ Use HTTPS in production
⚠️ Implement rate limiting for production
⚠️ Use environment variables for all secrets

## Next Steps

1. ✅ Test all endpoints in Postman
2. 📝 Read the full [README.md](README.md)
3. 🔧 Customize the system for your needs
4. 🚀 Deploy to production

## Support

For issues or questions, check:
- Error messages in the terminal
- Response messages from API
- MongoDB connection logs
- JWT token details at https://jwt.io
