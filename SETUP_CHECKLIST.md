# 📋 Setup Checklist & Verification Guide

## Pre-Installation Checklist

Before you start, ensure you have:

- [ ] **Node.js** installed (v14+)
  - Check: `node --version`
  - Download: https://nodejs.org/

- [ ] **npm** installed
  - Check: `npm --version`
  - Usually comes with Node.js

- [ ] **MongoDB** available
  - [ ] **Option A**: Local MongoDB
    - Check: `mongod --version`
    - Download: https://www.mongodb.com/try/download/community
  
  - [ ] **Option B**: MongoDB Atlas (Cloud)
    - Create account: https://www.mongodb.com/cloud/atlas
    - Create free cluster
    - Get connection string

- [ ] **Postman** (optional, for testing)
  - Download: https://www.postman.com/downloads/

- [ ] **Code Editor** (VS Code recommended)
  - Download: https://code.visualstudio.com/

---

## Installation Checklist

### Step 1: Project Setup
- [ ] Navigate to project folder in terminal
- [ ] Run `npm install`
  - Expected: 300-500MB of dependencies installed
  - Expected time: 2-5 minutes
  - Should see: ✔ added X packages

### Step 2: Environment Configuration
- [ ] Copy `.env.example` to `.env`
  - Command: `cp .env.example .env` (Mac/Linux)
  - Command: `copy .env.example .env` (Windows)

- [ ] Edit `.env` file:
  - [ ] Update `MONGODB_URI` with your MongoDB connection
  - [ ] Change `JWT_ACCESS_SECRET` (use a strong value)
  - [ ] Change `JWT_REFRESH_SECRET` (use a strong value)
  - [ ] Verify `PORT=5000`

### Step 3: MongoDB Setup

#### Local MongoDB
- [ ] Start MongoDB service
  - macOS: `brew services start mongodb-community`
  - Windows: MongoDB should auto-start or use Services app
  - Linux: `sudo systemctl start mongod`

- [ ] Verify MongoDB is running
  - [ ] `mongosh` or `mongo` connects successfully
  - [ ] No connection errors

#### MongoDB Atlas (Cloud)
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster
- [ ] Add user in Database Access
- [ ] Whitelist IP address (or allow all)
- [ ] Get connection string
- [ ] Update `MONGODB_URI` in `.env`
- [ ] Format: `mongodb+srv://username:password@cluster.mongodb.net/auth-system?retryWrites=true&w=majority`

### Step 4: Start the Server
- [ ] Run `npm run dev`
- [ ] Expected output:
  ```
  ✓ MongoDB connected successfully
  ✓ Server running on port 5000
  ```
- [ ] If errors, check:
  - [ ] MongoDB running?
  - [ ] Port 5000 available?
  - [ ] Correct `.env` settings?

---

## Testing Checklist

### Quick Health Check
- [ ] Server is running
- [ ] Open browser to `http://localhost:5000/api/health`
- [ ] Should see: `{"message":"Server is running"}`

### Test with Postman
- [ ] Download and open Postman
- [ ] Import `postman-collection.json` file
  - File → Import → Select the collection file
- [ ] Create environment variables:
  - [ ] `accessToken` (will be auto-filled)
  - [ ] `refreshToken` (will be auto-filled)

- [ ] Run tests in order:
  1. [ ] **Health Check** → Status 200
  2. [ ] **Register** → Status 201
  3. [ ] **Login** → Status 200 (saves tokens)
  4. [ ] **Refresh Token** → Status 200 (saves new token)
  5. [ ] **Logout** → Status 200

### Test with cURL
```bash
# Test 1: Health Check
curl http://localhost:5000/api/health

# Test 2: Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"pass123"}'

# Test 3: Login (save token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pass123"}'
```

Tasks:
- [ ] Health check responds
- [ ] Register returns user ID
- [ ] Login returns tokens
- [ ] Tokens are valid JWTs

### Test with JavaScript/Node
```bash
# Run test script
node test-api.js
```

- [ ] All tests pass
- [ ] No connection errors
- [ ] Responses are valid JSON

---

## Verification Checks

### File Structure
Verify all files are created:
```
✓ server.js
✓ package.json
✓ .env
✓ .env.example
✓ config/db.js
✓ models/User.js
✓ controllers/authController.js
✓ routes/auth.js
✓ middleware/auth.js
✓ utils/tokenGenerator.js
✓ README.md
✓ QUICK_START.md
✓ PROJECT_STRUCTURE.md
✓ postman-collection.json
✓ frontend-example.js
✓ test-api.js
✓ Dockerfile (optional)
✓ docker-compose.yml (optional)
```

### Dependencies Installed
```bash
npm list --depth=0
```

Should show:
- [ ] express
- [ ] mongoose
- [ ] jsonwebtoken
- [ ] bcryptjs
- [ ] dotenv
- [ ] nodemon (dev)

### MongoDB Connection
```bash
mongosh "mongodb://localhost:27017"
```

Should show:
- [ ] Connection successful
- [ ] Can see databases
- [ ] Can create test collections

### API Response Formats
Test each endpoint and verify response includes:

**Register (201)**
- [ ] `message` field
- [ ] `user` object with `id`, `username`, `email`

**Login (200)**
- [ ] `message` field
- [ ] `accessToken` (JWT format)
- [ ] `refreshToken` (JWT format)
- [ ] `user` object

**Refresh Token (200)**
- [ ] `message` field
- [ ] `accessToken` (new JWT)

**Logout (200)**
- [ ] `message` field

---

## Common Issues & Solutions

### ❌ "MongoDB connection error"
- [ ] Is MongoDB running? Check with `mongod --version`
- [ ] Is connection string correct? Check `.env`
- [ ] For Atlas: Is IP whitelisted?
- **Solution**: Start MongoDB or update connection string

### ❌ "Port 5000 already in use"
- [ ] Find process: `lsof -i :5000` (Mac/Linux)
- [ ] Or Windows: `netstat -ano | findstr :5000`
**Solution**: Kill process or change PORT in `.env`

### ❌ "npm install fails"
- [ ] Delete `node_modules` and `package-lock.json`
- [ ] Run `npm cache clean --force`
- [ ] Run `npm install` again
**Solution**: Clean install

### ❌ "Invalid or expired token"
- [ ] Access token expires in 1 minute
- [ ] Call `/refresh-token` with refresh token
- [ ] Refresh token expires in 7 days
**Solution**: Use `/refresh-token` endpoint

### ❌ "Username/email already exists"
- [ ] Another user registered with same email
**Solution**: Use different email or username

### ❌ "Cannot find module"
- [ ] `npm install` didn't complete properly
- [ ] Reinstall dependencies
**Solution**: Run `npm install` again

---

## Optional Enhancements Done ✅

- [x] Complete API documentation
- [x] Password hashing with bcryptjs
- [x] JWT access & refresh tokens
- [x] Token expiration handling
- [x] Error handling & validation
- [x] Protected routes with middleware
- [x] Postman collection for testing
- [x] Frontend integration examples
- [x] Docker support
- [x] Comprehensive documentation
- [x] Testing script

---

## Next Steps After Setup

### Immediate Next Steps
1. [ ] **Test the API**
   - Use Postman or cURL
   - Follow the testing checklist above
   - Verify all endpoints work

2. [ ] **Read Documentation**
   - [ ] Read `README.md` for full docs
   - [ ] Read `QUICK_START.md` for quick reference
   - [ ] Read `PROJECT_STRUCTURE.md` for file descriptions

3. [ ] **Understand the Code**
   - [ ] Review `server.js` entry point
   - [ ] Review `controllers/authController.js` logic
   - [ ] Review `utils/tokenGenerator.js` token handling

### Customization

4. [ ] **Customize for Your Use Case**
   - Add more user fields in `models/User.js`
   - Add more validation in controllers
   - Extend token payload with more claims
   - Add new endpoints as needed

5. [ ] **Security Hardening**
   - Enable RATE limiting
   - Add input sanitization
   - HTTPS in production
   - Implement CORS if needed

6. [ ] **Frontend Integration**
   - Use `frontend-example.js` as reference
   - Integrate with your frontend app
   - Handle token refresh automatically
   - Store tokens securely

### Deployment

7. [ ] **Deploy to Production**
   - Use Docker: `docker-compose up -d`
   - Or deploy to cloud (Heroku, AWS, etc.)
   - Update environment variables
   - Set `NODE_ENV=production`
   - Use strong secrets
   - Enable HTTPS

---

## Helpful Commands

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Install dependencies
npm install

# Check Node packages
npm list

# Clear npm cache
npm cache clean --force

# Connect to MongoDB locally
mongosh

# Run API tests
node test-api.js

# Check if port is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # Mac/Linux
```

---

## Verification Summary

| Item | Status | Evidence |
|------|--------|----------|
| Node.js installed | ✓ | `node --version` shows v14+ |
| npm installed | ✓ | `npm --version` works |
| MongoDB running | ✓ | Connection string works |
| .env configured | ✓ | Port and secrets set |
| Dependencies installed | ✓ | `npm list` shows packages |
| Server starts | ✓ | `npm run dev` shows ready |
| Health check works | ✓ | GET /api/health → 200 |
| Register works | ✓ | POST /register → 201 |
| Login works | ✓ | POST /login → 200 + tokens |
| Tokens valid | ✓ | JWT.io shows valid tokens |
| All documentation read | ✓ | README, QUICK_START reviewed |

---

## Support Resources

- **JWT Info**: https://jwt.io
- **MongoDB Docs**: https://docs.mongodb.com
- **Express Docs**: https://expressjs.com
- **Mongoose Docs**: https://mongoosejs.com
- **Node.js Docs**: https://nodejs.org/docs
- **Postman Docs**: https://learning.postman.com

---

**Status**: Ready to use! ✅

Once you've completed this checklist, your authentication system is fully operational and ready for customization or deployment.
