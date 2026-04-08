/* ============================================
   Authentication Service
   ============================================ */

class AuthService {
    constructor(apiUrl = 'http://localhost:5000/api') {
        this.apiUrl = apiUrl;
        this.accessToken = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');
    }

    /**
     * Register a new user
     */
    async register(username, email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Login user and store tokens
     */
    async login(username, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
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
            throw error;
        }
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken() {
        try {
            const response = await fetch(`${this.apiUrl}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: this.refreshToken }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Token refresh failed');
            }

            const data = await response.json();
            this.accessToken = data.accessToken;
            localStorage.setItem('accessToken', this.accessToken);

            return data;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.logout();
            throw error;
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            if (this.accessToken && this.refreshToken) {
                await fetch(`${this.apiUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.accessToken}`,
                    },
                    body: JSON.stringify({ refreshToken: this.refreshToken }),
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.accessToken = null;
            this.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }

    /**
     * Make authenticated API request
     */
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
                this.logout();
                throw error;
            }
        }

        return response;
    }

    /**
     * Get current user from localStorage
     */
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!this.accessToken;
    }

    /**
     * Get stored tokens
     */
    getTokens() {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
        };
    }
}

// Create global auth service instance
const auth = new AuthService();
