/* ============================================
   Application Logic & Routing
   ============================================ */

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    if (auth.isLoggedIn()) {
        showDashboard();
    } else {
        showLogin();
    }
});

// ============================================
// Page Navigation
// ============================================

function goToLogin(event) {
    event?.preventDefault();
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('dashboard-container').classList.add('hidden');
    document.getElementById('login-page').classList.add('active');
    document.getElementById('register-page').classList.remove('active');
    clearErrors();
}

function goToRegister(event) {
    event?.preventDefault();
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('dashboard-container').classList.add('hidden');
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('register-page').classList.add('active');
    clearErrors();
}

function showLogin() {
    goToLogin();
}

function showDashboard() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');
    displayUserInfo();
}

// ============================================
// Authentication Handlers
// ============================================

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    // Validate
    if (!username || !email || !password || !confirm) {
        showError('register-error', 'All fields are required');
        return;
    }

    if (password !== confirm) {
        showError('register-error', 'Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError('register-error', 'Password must be at least 6 characters');
        return;
    }

    showLoading(true);

    try {
        const result = await auth.register(username, email, password);
        showToast(`✓ Account created successfully! Please login.`, 'success');
        setTimeout(() => {
            goToLogin();
            // Clear form
            document.getElementById('register-form').reset();
        }, 1500);
    } catch (error) {
        showError('register-error', error.message);
    } finally {
        showLoading(false);
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showError('login-error', 'Username and password are required');
        return;
    }

    showLoading(true);

    try {
        const result = await auth.login(username, password);
        showToast(`✓ Welcome back, ${result.user.username}!`, 'success');
        setTimeout(() => {
            showDashboard();
            document.getElementById('login-form').reset();
        }, 1000);
    } catch (error) {
        showError('login-error', error.message);
    } finally {
        showLoading(false);
    }
}

async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showLoading(true);
        try {
            await auth.logout();
            showToast('✓ Successfully logged out', 'success');
            setTimeout(() => {
                goToLogin();
            }, 800);
        } catch (error) {
            showToast('⚠ Error during logout', 'error');
        } finally {
            showLoading(false);
        }
    }
}

async function refreshAccessToken() {
    showLoading(true);
    try {
        const result = await auth.refreshAccessToken();
        showToast('✓ Access token refreshed successfully', 'success');
    } catch (error) {
        showToast('✗ Failed to refresh token: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// Dashboard Functions
// ============================================

function displayUserInfo() {
    const user = auth.getCurrentUser();

    if (user) {
        // Update user name
        document.getElementById('user-name').textContent = user.username;

        // Update profile info
        document.getElementById('display-username').textContent = user.username;
        document.getElementById('display-email').textContent = user.email;
        document.getElementById('display-id').textContent = user.id;
    }
}

async function testProtectedRoute() {
    showLoading(true);
    const resultDiv = document.getElementById('test-result');
    const outputDiv = document.getElementById('test-output');

    try {
        // For demonstration, we'll call the health endpoint with auth header
        const response = await auth.makeRequest('/health');
        const data = await response.json();

        resultDiv.classList.remove('hidden');
        outputDiv.innerHTML = `
<strong>✓ Protected Request Successful!</strong><br><br>
<strong>Endpoint:</strong> GET /api/health<br>
<strong>Status:</strong> ${response.status} ${response.statusText}<br>
<strong>Response:</strong><br>
${JSON.stringify(data, null, 2)}
        `;
        resultDiv.classList.add('success');
        showToast('✓ Protected endpoint test successful', 'success');
    } catch (error) {
        resultDiv.classList.remove('hidden');
        resultDiv.classList.add('error');
        outputDiv.innerHTML = `
<strong>✗ Protected Request Failed!</strong><br><br>
<strong>Error:</strong> ${error.message}
        `;
        showToast('✗ Protected endpoint test failed: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// UI Helpers
// ============================================

function showError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });
}

function showLoading(show) {
    const loadingDiv = document.getElementById('loading');
    if (show) {
        loadingDiv.classList.remove('hidden');
    } else {
        loadingDiv.classList.add('hidden');
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ============================================
// Auto-refresh token before expiry
// ============================================

// Token refresh interval (refresh every 50 seconds for 1 min tokens)
setInterval(() => {
    if (auth.isLoggedIn()) {
        // Silently refresh token in background
        auth.refreshAccessToken().catch(error => {
            console.log('Auto-refresh failed:', error.message);
        });
    }
}, 50000); // 50 seconds

// ============================================
// Handle token expiration on page focus
// ============================================

window.addEventListener('focus', () => {
    if (auth.isLoggedIn()) {
        // Check if token needs refresh
        const lastRefresh = localStorage.getItem('lastRefresh');
        const now = Date.now();

        if (!lastRefresh || now - parseInt(lastRefresh) > 45000) {
            auth.refreshAccessToken().catch(error => {
                console.log('Refresh on focus failed:', error.message);
            });
            localStorage.setItem('lastRefresh', now);
        }
    }
});

// ============================================
// Handle page visibility changes
// ============================================

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && auth.isLoggedIn()) {
        // Page became visible, refresh token
        auth.refreshAccessToken().catch(error => {
            console.log('Refresh on visibility change failed:', error.message);
        });
    }
});

// ============================================
// Prevent accidental logout
// ============================================

window.addEventListener('beforeunload', (event) => {
    if (auth.isLoggedIn()) {
        // Tokens will be preserved in localStorage
        // No need to prevent unload
    }
});

// ============================================
// Handle network errors
// ============================================

window.addEventListener('online', () => {
    if (auth.isLoggedIn()) {
        showToast('✓ Connection restored', 'success');
        auth.refreshAccessToken().catch(() => {});
    }
});

window.addEventListener('offline', () => {
    showToast('⚠ No internet connection', 'error');
});

// ============================================
// Development: Log auth state
// ============================================

console.log('🔐 Authentication System Ready');
console.log('Logged in:', auth.isLoggedIn());
if (auth.isLoggedIn()) {
    console.log('User:', auth.getCurrentUser());
}
