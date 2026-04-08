// frontend-example.js
// Example of how to integrate with the authentication system from a frontend

class AuthService {
  constructor(apiUrl = 'http://localhost:5000/api') {
    this.apiUrl = apiUrl;
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  // Register a new user
  async register(username, email, password) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Login user
  async login(username, password) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;

      // Store tokens in localStorage
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const response = await fetch(`${this.apiUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      this.accessToken = data.accessToken;
      localStorage.setItem('accessToken', this.accessToken);

      return data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, user needs to login again
      this.logout();
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await fetch(`${this.apiUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens even if logout fails
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Make authenticated API request
  async makeRequest(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken}`,
      ...options.headers,
    };

    let response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // If access token expired (403), try to refresh it
    if (response.status === 403) {
      try {
        await this.refreshAccessToken();
        // Retry request with new token
        headers.Authorization = `Bearer ${this.accessToken}`;
        response = await fetch(`${this.apiUrl}${endpoint}`, {
          ...options,
          headers,
        });
      } catch (error) {
        console.error('Failed to refresh token', error);
        throw error;
      }
    }

    return response;
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.accessToken;
  }
}

// Usage Examples
// ==============

// 1. Register
async function exampleRegister() {
  const auth = new AuthService();
  try {
    const result = await auth.register('johndoe', 'john@example.com', 'password123');
    console.log('Registration successful:', result);
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
}

// 2. Login
async function exampleLogin() {
  const auth = new AuthService();
  try {
    const result = await auth.login('johndoe', 'password123');
    console.log('Login successful:', result);
    console.log('User:', auth.getCurrentUser());
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// 3. Make Protected Request
async function exampleProtectedRequest() {
  const auth = new AuthService();
  try {
    // Assume user is already logged in
    const response = await auth.makeRequest('/some-protected-endpoint', {
      method: 'GET',
    });
    const data = await response.json();
    console.log('Protected data:', data);
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

// 4. Logout
async function exampleLogout() {
  const auth = new AuthService();
  await auth.logout();
  console.log('Logged out successfully');
}

// Basic React Hook Example
// =========================

// import { createContext, useState, useContext } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem('user');
//     return stored ? JSON.parse(stored) : null;
//   });

//   const auth = new AuthService();

//   const register = async (username, email, password) => {
//     const result = await auth.register(username, email, password);
//     return result;
//   };

//   const login = async (username, password) => {
//     const result = await auth.login(username, password);
//     setUser(result.user);
//     return result;
//   };

//   const logout = async () => {
//     await auth.logout();
//     setUser(null);
//   };

//   const value = {
//     user,
//     register,
//     login,
//     logout,
//     isLoggedIn: auth.isLoggedIn(),
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// Vue 3 Composable Example
// =========================

// import { ref, computed } from 'vue';

// class AuthService {
//   // ... same as above
// }

// export const useAuth = () => {
//   const auth = new AuthService();
//   const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
//   const isLoggedIn = computed(() => !!auth.accessToken);

//   const register = async (username, email, password) => {
//     return await auth.register(username, email, password);
//   };

//   const login = async (username, password) => {
//     const result = await auth.login(username, password);
//     user.value = result.user;
//     return result;
//   };

//   const logout = async () => {
//     await auth.logout();
//     user.value = null;
//   };

//   return {
//     user,
//     isLoggedIn,
//     register,
//     login,
//     logout,
//   };
// };

// Angular Service Example
// =======================

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:5000/api';
//   private userSubject = new BehaviorSubject(
//     JSON.parse(localStorage.getItem('user') || 'null')
//   );
//   public user$ = this.userSubject.asObservable();

//   constructor(private http: HttpClient) {}

//   register(username: string, email: string, password: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/auth/register`, {
//       username,
//       email,
//       password,
//     });
//   }

//   login(username: string, password: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/auth/login`, {
//       username,
//       password,
//     }).pipe(
//       tap((response) => {
//         localStorage.setItem('accessToken', response.accessToken);
//         localStorage.setItem('refreshToken', response.refreshToken);
//         localStorage.setItem('user', JSON.stringify(response.user));
//         this.userSubject.next(response.user);
//       })
//     );
//   }

//   logout(): void {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     this.userSubject.next(null);
//   }
// }
