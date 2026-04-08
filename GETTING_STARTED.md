# 🚀 Authentication System - Getting Started

Welcome! This is a complete, production-ready authentication system with JWT access and refresh tokens.

## ⭐ What You Get

✅ **User Registration** - Create accounts with username, email, password  
✅ **User Login** - Authenticate and receive tokens  
✅ **JWT Access Token** - Short-lived (1 minute) for API requests  
✅ **JWT Refresh Token** - Long-lived (7 days) to get new access tokens  
✅ **Token Refresh Endpoint** - Get new tokens without re-logging in  
✅ **Password Hashing** - Secure bcryptjs hashing  
✅ **MongoDB Integration** - Persistent data storage  
✅ **Protected Routes** - Middleware for authentication  
✅ **Error Handling** - Comprehensive error responses  
✅ **Full Documentation** - Everything you need  

---

## 🎯 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
# Copy example to .env
cp .env.example .env

# Edit .env and change:
# - MONGODB_URI (if using custom MongoDB)
# - JWT secrets (use strong values)
```

### 3. Start MongoDB
```bash
# Local MongoDB
mongod

# OR use MongoDB Atlas (cloud) - update MONGODB_URI in .env
```

### 4. Start Server
```bash
npm run dev
```

### 5. Test It!
```bash
# In another terminal
node test-api.js
```

✨ **That's it!** Your server is running on `http://localhost:5000`

---

## 📖 Documentation Guide

Read these files in this order:

1. **THIS FILE** → You are here! Overview and quick start
2. **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** → Detailed setup with verification *(5-10 min)*
3. **[QUICK_START.md](QUICK_START.md)** → Testing and cURL examples *(10-15 min)*
4. **[README.md](README.md)** → Complete API documentation *(15-20 min)*
5. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** → Code organization details *(10 min)*

---

## 🔑 API Endpoints

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Login & get tokens | ❌ |
| POST | `/api/auth/refresh-token` | Get new access token | ❌ |
| POST | `/api/auth/logout` | Logout & invalidate token | ✅ |
| GET | `/api/health` | Health check | ❌ |

---

## 🧪 Quick API Test

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "password123"
  }'
```

Gets you:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "username": "john", "email": "john@example.com" }
}
```

### Refresh Token (when access token expires)
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

---

## 🛠️ Technology Stack

| Technology | What It Does |
|-----------|-------------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | Database driver |
| **JWT** | Token generation |
| **bcryptjs** | Password hashing |
| **dotenv** | Configuration management |

---

## 📁 Project Files

```
authentication-system/
├── 📖 YOUR STARTING POINTS:
│   ├── THIS_FILE (you are here)
│   ├── SETUP_CHECKLIST.md (detailed setup)
│   ├── QUICK_START.md (testing guide)
│   ├── README.md (full docs)
│   └── PROJECT_STRUCTURE.md (code structure)
│
├── 🎮 TESTING:
│   ├── postman-collection.json (import to Postman)
│   ├── test-api.js (node test-api.js)
│   └── frontend-example.js (integration examples)
│
├── 🔧 CONFIGURATION:
│   ├── package.json (dependencies)
│   ├── .env (your settings - secret!)
│   ├── .env.example (template)
│   └── .gitignore (git ignore)
│
├── 💻 APPLICATION CODE:
│   ├── server.js (main entry point)
│   ├── config/db.js (database connection)
│   ├── routes/auth.js (endpoints)
│   ├── controllers/authController.js (business logic)
│   ├── models/User.js (data schema)
│   ├── middleware/auth.js (token verification)
│   └── utils/tokenGenerator.js (JWT utilities)
│
└── 🐳 DOCKER (optional):
    ├── Dockerfile
    └── docker-compose.yml
```

---

## ⭐ Key Features Explained

### 1️⃣ Access Token
- **Valid for**: 1 minute
- **Use**: Include in every API request header
- **Header Format**: `Authorization: Bearer <token>`
- **Expires**: After 1 minute - call `/refresh-token`

### 2️⃣ Refresh Token
- **Valid for**: 7 days
- **Use**: Get new access token when it expires
- **Storage**: Stored in database (secure!)
- **Expired**: After 7 days - user must login again

### 3️⃣ Protected Routes
- **Middleware**: Verifies access token
- **Returns**: 403 if token invalid/expired
- **Usage**: Password-protected APIs

### 4️⃣ Password Hashing
- **Algorithm**: bcryptjs
- **Salt rounds**: 10 (very secure)
- **Storage**: Hashed only (never plain text)

---

## 🚨 Common Issues

### ❌ "MongoDB connection error"
**Solution**: Make sure MongoDB is running
```bash
# Check MongoDB
mongod --version

# Start MongoDB
mongod  # or use MongoDB Atlas
```

### ❌ "Port 5000 already in use"
**Solution**: Change PORT in `.env` or kill the process
```bash
# Find process
lsof -i :5000

# Change PORT in .env to 5001, etc.
```

### ❌ "Cannot authenticate"
**Solution**: Token might be expired
```bash
# Use refresh-token endpoint
curl -X POST http://localhost:5000/api/auth/refresh-token ...
```

### ❌ "npm install fails"
**Solution**: Clean cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

See [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) for more troubleshooting.

---

## 💡 What's Next?

### Immediate (Next 30 minutes)
1. [ ] Follow [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
2. [ ] Get the server running
3. [ ] Test endpoints with Postman or cURL
4. [ ] Read [README.md](README.md)

### Short Term (Next 1-2 hours)
- [ ] Review code in `controllers/` and `models/`
- [ ] Understand token generation in `utils/`
- [ ] Try frontend integration examples
- [ ] Customize for your needs

### Medium Term (Next few hours)
- [ ] Add more user fields (profile, roles, etc.)
- [ ] Add email verification
- [ ] Add password reset
- [ ] Add rate limiting
- [ ] Deploy to production

### Advanced (Optional)
- [ ] Redis caching for tokens
- [ ] OAuth2 integration
- [ ] 2FA (two-factor authentication)
- [ ] Role-based access control (RBAC)
- [ ] API documentation with Swagger

---

## 📚 Learning Resources

| Topic | Resource |
|-------|----------|
| JWT Tokens | https://jwt.io |
| MongoDB | https://docs.mongodb.com |
| Express.js | https://expressjs.com |
| Mongoose | https://mongoosejs.com |
| Node.js | https://nodejs.org/docs |
| Postman | https://learning.postman.com |

---

## 🔒 Security Notes

⚠️ **Important**:
- Never commit `.env` file (added to `.gitignore`)
- Change JWT secrets in `.env` for production
- Use HTTPS in production (not HTTP)
- Keep Node.js and dependencies updated
- Implement rate limiting for production
- Validate all user input

---

## 📞 Getting Help

1. **Check error messages** - They're very descriptive
2. **Read the docs** - Start with [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
3. **Test endpoints** - Use Postman or cURL
4. **Review code comments** - Every file has comments
5. **Verify JWT tokens** - Copy token to https://jwt.io

---

## ✨ Congratulations!

You now have a **professional, production-ready authentication system**!

### What It Includes:
✅ Complete API with 5 endpoints  
✅ Secure password hashing  
✅ JWT token management  
✅ MongoDB persistence  
✅ Error handling  
✅ Middleware protection  
✅ Full documentation  
✅ Testing tools  
✅ Docker support  
✅ Frontend examples  

---

## 🎉 Ready?

**Start here:**
```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env if needed

# 3. Run
npm run dev

# 4. Test (in another terminal)
node test-api.js
```

**Questions?** Check the documentation files or review the code - it's heavily commented!

---

**Next Step**: Read [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) → ⭐
