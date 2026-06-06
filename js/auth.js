// ===================================
// SUPABASE AUTHENTICATION
// ===================================

// Load Supabase client from CDN
const { createClient } = supabase;

// Initialize Supabase client
let supabase;

function initSupabase() {
    if (!validateSupabaseConfig()) {
        console.error('Supabase configuration is invalid');
        return null;
    }
    
    supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, SUPABASE_CONFIG.auth);
    console.log('✅ Supabase client initialized');
    return supabase;
}

// Authentication Functions
// =================================================

/**
 * Sign up a new user
 */
async function signUp(email, password, metadata = {}) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
                emailRedirectTo: `${window.location.origin}/dashboard.html`
            }
        });

        if (error) throw error;

        // Check if email confirmation is required
        if (data.user && !data.session) {
            return {
                success: true,
                message: 'Registration successful! Please check your email to verify your account.',
                requiresConfirmation: true
            };
        }

        return {
            success: true,
            message: 'Registration successful!',
            user: data.user,
            session: data.session
        };
    } catch (error) {
        console.error('Sign up error:', error);
        return {
            success: false,
            message: error.message || 'Registration failed. Please try again.'
        };
    }
}

/**
 * Sign in user
 */
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Check if email is not confirmed
        if (!data.user.email_confirmed_at) {
            return {
                success: false,
                message: 'Please verify your email before signing in. Check your inbox for the verification link.',
                requiresConfirmation: true
            };
        }

        // Fetch user role
        const role = await getUserRole(data.user.id);

        return {
            success: true,
            message: 'Login successful!',
            user: data.user,
            session: data.session,
            role: role
        };
    } catch (error) {
        console.error('Sign in error:', error);
        return {
            success: false,
            message: error.message || 'Login failed. Please check your credentials.'
        };
    }
}

/**
 * Sign out user
 */
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Redirect to home page
        window.location.href = 'index.html';
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Get current session
 */
async function getSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    } catch (error) {
        console.error('Get session error:', error);
        return null;
    }
}

/**
 * Get current user
 */
async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Get user error:', error);
        return null;
    }
}

/**
 * Reset password - send reset email
 */
async function resetPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`
        });

        if (error) throw error;

        return {
            success: true,
            message: 'Password reset email sent! Please check your inbox.'
        };
    } catch (error) {
        console.error('Reset password error:', error);
        return {
            success: false,
            message: error.message || 'Failed to send reset email. Please try again.'
        };
    }
}

/**
 * Update password
 */
async function updatePassword(newPassword) {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        return {
            success: true,
            message: 'Password updated successfully!'
        };
    } catch (error) {
        console.error('Update password error:', error);
        return {
            success: false,
            message: error.message || 'Failed to update password. Please try again.'
        };
    }
}

/**
 * Resend confirmation email
 */
async function resendConfirmationEmail(email) {
    try {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/dashboard.html`
            }
        });

        if (error) throw error;

        return {
            success: true,
            message: 'Confirmation email resent! Please check your inbox.'
        };
    } catch (error) {
        console.error('Resend confirmation error:', error);
        return {
            success: false,
            message: error.message || 'Failed to resend confirmation email.'
        };
    }
}

// Role Management Functions
// =================================================

/**
 * Get user role from user_roles table
 */
async function getUserRole(userId) {
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (error) {
            // If role doesn't exist, default to 'user'
            if (error.code === 'PGRST116') {
                return 'user';
            }
            throw error;
        }

        return data.role || 'user';
    } catch (error) {
        console.error('Get user role error:', error);
        return 'user';
    }
}

/**
 * Set user role (admin only)
 */
async function setUserRole(userId, role) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Not authenticated' };
        }

        // Check if current user is admin
        const currentRole = await getUserRole(currentUser.id);
        if (currentRole !== 'admin') {
            return { success: false, message: 'Unauthorized. Admin access required.' };
        }

        const { error } = await supabase
            .from('user_roles')
            .upsert({ user_id: userId, role: role });

        if (error) throw error;

        return {
            success: true,
            message: `User role updated to ${role}`
        };
    } catch (error) {
        console.error('Set user role error:', error);
        return {
            success: false,
            message: error.message || 'Failed to update user role.'
        };
    }
}

/**
 * Check if user has specific role
 */
async function hasRole(requiredRole) {
    try {
        const user = await getCurrentUser();
        if (!user) return false;

        const userRole = await getUserRole(user.id);
        return userRole === requiredRole;
    } catch (error) {
        console.error('Check role error:', error);
        return false;
    }
}

/**
 * Check if user is admin
 */
async function isAdmin() {
    return await hasRole('admin');
}

/**
 * Check if user is premium
 */
async function isPremium() {
    return await hasRole('premium');
}

// User Profile Functions
// =================================================

/**
 * Update user profile
 */
async function updateProfile(metadata) {
    try {
        const { error } = await supabase.auth.updateUser({
            data: metadata
        });

        if (error) throw error;

        return {
            success: true,
            message: 'Profile updated successfully!'
        };
    } catch (error) {
        console.error('Update profile error:', error);
        return {
            success: false,
            message: error.message || 'Failed to update profile.'
        };
    }
}

/**
 * Get user profile
 */
async function getProfile() {
    try {
        const user = await getCurrentUser();
        if (!user) return null;

        return {
            id: user.id,
            email: user.email,
            metadata: user.user_metadata || {},
            createdAt: user.created_at,
            emailConfirmed: user.email_confirmed_at
        };
    } catch (error) {
        console.error('Get profile error:', error);
        return null;
    }
}

// Page Protection Functions
// =================================================

/**
 * Protect page - redirect if not authenticated
 */
async function protectPage(redirectUrl = 'login.html') {
    const session = await getSession();
    if (!session) {
        // Store intended destination
        sessionStorage.setItem('intendedDestination', window.location.pathname);
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

/**
 * Protect premium page - redirect if not premium user
 */
async function protectPremiumPage(redirectUrl = 'premium-membership.html') {
    const session = await getSession();
    if (!session) {
        sessionStorage.setItem('intendedDestination', window.location.pathname);
        window.location.href = 'login.html';
        return false;
    }

    const premium = await isPremium();
    if (!premium) {
        window.location.href = redirectUrl;
        return false;
    }

    return true;
}

/**
 * Protect admin page - redirect if not admin
 */
async function protectAdminPage(redirectUrl = 'index.html') {
    const session = await getSession();
    if (!session) {
        window.location.href = 'login.html';
        return false;
    }

    const admin = await isAdmin();
    if (!admin) {
        window.location.href = redirectUrl;
        return false;
    }

    return true;
}

// UI Update Functions
// =================================================

/**
 * Update navbar based on authentication state
 */
async function updateNavbarAuth() {
    const user = await getCurrentUser();
    const authButtonsContainer = document.getElementById('authButtons');
    
    if (!authButtonsContainer) return;

    if (user) {
        const role = await getUserRole(user.id);
        const displayName = user.user_metadata?.full_name || user.email.split('@')[0];
        
        authButtonsContainer.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle"></i>
                    <span class="d-none d-sm-inline">${displayName}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="dashboard.html"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
                    <li><a class="dropdown-item" href="dashboard.html#profile"><i class="bi bi-person"></i> Profile</a></li>
                    <li><a class="dropdown-item" href="dashboard.html#courses"><i class="bi bi-mortarboard"></i> My Courses</a></li>
                    ${role === 'premium' ? '<li><a class="dropdown-item" href="dashboard.html#downloads"><i class="bi bi-download"></i> Downloads</a></li>' : ''}
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="handleSignOut(event)"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
                </ul>
            </div>
        `;
    } else {
        authButtonsContainer.innerHTML = `
            <a href="login.html" class="btn btn-outline-light me-2">Login</a>
            <a href="signup.html" class="btn btn-primary">Sign Up</a>
        `;
    }
}

/**
 * Handle sign out from UI
 */
async function handleSignOut(event) {
    event.preventDefault();
    const result = await signOut();
    if (result.success) {
        window.location.href = 'index.html';
    } else {
        alert(result.message);
    }
}

// Auth State Listener
// =================================================

/**
 * Set up auth state change listener
 */
function setupAuthListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        // Update navbar on auth state change
        await updateNavbarAuth();
        
        // Handle specific events
        if (event === 'SIGNED_IN') {
            console.log('User signed in');
            // Check if there's an intended destination
            const intendedDestination = sessionStorage.getItem('intendedDestination');
            if (intendedDestination && intendedDestination !== window.location.pathname) {
                sessionStorage.removeItem('intendedDestination');
                window.location.href = intendedDestination;
            }
        } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
        }
    });
}

// Initialize
// =================================================

/**
 * Initialize authentication
 */
function initAuth() {
    supabase = initSupabase();
    if (supabase) {
        setupAuthListener();
        updateNavbarAuth();
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}
