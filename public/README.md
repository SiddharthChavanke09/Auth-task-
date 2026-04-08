# Frontend UI - Authentication System

A modern, responsive web interface for the authentication system.

## Features

✅ **User Registration** - Create new accounts with validation  
✅ **User Login** - Secure login with error handling  
✅ **Dashboard** - Protected user dashboard  
✅ **Token Management** - View and refresh tokens  
✅ **Auto Token Refresh** - Automatic background refresh  
✅ **Responsive Design** - Works on all devices  
✅ **Error Handling** - User-friendly error messages  
✅ **Toast Notifications** - Real-time feedback  
✅ **Secure Storage** - Tokens stored in localStorage  

## Accessing the UI

### Development
```bash
npm run dev
```

Then open your browser:
```
http://localhost:5000
```

### Production
Simply navigate to your domain:
```
https://yourdomain.com
```

## File Structure

```
public/
├── index.html           # Main HTML file
├── css/
│   └── style.css       # All styling
└── js/
    ├── auth.js         # Authentication service
    └── app.js          # Application logic
```

## How It Works

### 1. **Login/Register Page**
- Users can create new accounts or login
- Form validation on client-side
- Error messages for invalid input
- Link to switch between login and register

### 2. **Dashboard (Protected)**
- Shows user profile information
- Displays token status
- Token refresh button
- Protected endpoint test
- Security tips

### 3. **Token Management**
- Tokens stored in browser localStorage
- Auto-refresh every 50 seconds
- Manual refresh option available
- Automatic logout on token expiry

## Authentication Flow

```
1. User enters credentials
   ↓
2. Client sends to /api/auth/login
   ↓
3. Server validates and issues tokens
   ↓
4. Tokens stored in localStorage
   ↓
5. User redirected to dashboard
   ↓
6. Every request includes accessToken in header
   ↓
7. Token auto-refreshes before expiry
```

## Key Features Explained

### Auto Token Refresh
- Tokens auto-refresh every 50 seconds
- Also refreshes when page becomes visible
- No manual intervention needed

### Error Handling
- Invalid credentials: Shows error message
- Network errors: Shows connection status
- Token expired: Auto-refresh with fallback to login
- Protected routes: Returns to login if needed

### Security

✅ **Secure Token Storage**: localStorage (XSS protection recommended)  
✅ **Automatic Expiry**: Tokens expire if not used  
✅ **HTTPS in Production**: Use HTTPS for token security  
✅ **Clear on Logout**: All tokens cleared from storage  
✅ **CORS Enabled**: Frontend-backend communication  

## Customization

### Change Server URL
Edit `public/js/auth.js`:
```javascript
// Change default API URL
class AuthService {
    constructor(apiUrl = 'http://your-server.com:5000/api') {
        // ...
    }
}
```

### Change Colors
Edit `public/css/style.css`:
```css
:root {
    --primary: #your-color;
    --primary-dark: #your-dark-color;
    /* ... other colors ... */
}
```

### Add More Pages
1. Add new page div in `index.html`
2. Add navigation function in `app.js`
3. Style in `style.css`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design

- Works on desktop (1024px+)
- Tablet friendly (768px - 1023px)
- Mobile optimized (< 768px)
- Touch-friendly buttons
- Readable on all devices

## Performance

- No external dependencies (vanilla JS)
- Minimal CSS (~8KB)
- Fast page load
- Auto token refresh
- Efficient API calls

## Security Best Practices Implemented

✅ Password must be 6+ characters  
✅ Email validation  
✅ HTTPS recommended for production  
✅ Tokens with expiration  
✅ Secure logout procedure  
✅ No sensitive data in localStorage (only tokens)  
✅ CORS handling  

## Troubleshooting

### "Cannot connect to server"
- Make sure backend is running (`npm run dev`)
- Check server is on port 5000
- Check firewall settings
- Verify API URL in `auth.js`

### "Token refresh failed"
- Refresh token might be expired (logout and login again)
- Server might be down
- Check localStorage for valid tokens

### "Page not loading"
- Check browser console for errors (F12)
- Clear browser cache
- Try in incognito mode
- Ensure files are in `public/` folder

### "Form not submitting"
- Check browser console for JavaScript errors
- Ensure all required fields are filled
- Check password criteria (6+ chars)
- Verify email format

## API Integration

The UI integrates with these endpoints:

```
POST /api/auth/register
  - username, email, password
  - Returns: user object

POST /api/auth/login
  - username, password
  - Returns: accessToken, refreshToken, user

POST /api/auth/refresh-token
  - refreshToken
  - Returns: new accessToken

POST /api/auth/logout
  - refreshToken (in body)
  - accessToken (in header)
  - Returns: confirmation

GET /api/health
  - Returns: server status
```

## Development Tips

1. **Inspect tokens**: Copy a token and paste at https://jwt.io
2. **Check storage**: Open DevTools → Application → LocalStorage
3. **Monitor network**: DevTools Network tab to see API calls
4. **Test refresh**: Click "Refresh Token" button on dashboard
5. **Test logout**: Logout clears all stored data

## Next Steps

1. **Test Registration**: Create a new account
2. **Test Login**: Login with your account
3. **Check Dashboard**: View your profile info
4. **Refresh Token**: Click refresh button
5. **Test Logout**: Logout and notice you're back at login

## Support

- Check browser console (F12) for errors
- Review code comments for explanations
- Check backend logs for API errors
- Test endpoints with Postman
- Review security tips in dashboard

---

**The UI is fully functional and ready for production use!**
