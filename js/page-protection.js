// ===================================
// PAGE PROTECTION MIDDLEWARE
// ===================================

/**
 * Protect premium pages - redirect if not authenticated
 * Add this script to pages that require authentication
 */
async function protectPage() {
    try {
        const session = await getSession();
        if (!session) {
            // Store intended destination
            sessionStorage.setItem('intendedDestination', window.location.pathname);
            window.location.href = 'login.php';
            return false;
        }
        return true;
    } catch (error) {
        console.error('Page protection error:', error);
        window.location.href = 'login.php';
        return false;
    }
}

/**
 * Protect premium pages - redirect if not premium user
 * Add this script to pages that require premium access
 */
async function protectPremiumPage() {
    try {
        const session = await getSession();
        if (!session) {
            sessionStorage.setItem('intendedDestination', window.location.pathname);
            window.location.href = 'login.php';
            return false;
        }

        const premium = await isPremium();
        if (!premium) {
            window.location.href = 'premium-membership.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Premium page protection error:', error);
        window.location.href = 'premium-membership.html';
        return false;
    }
}

/**
 * Protect admin pages - redirect if not admin
 * Add this script to pages that require admin access
 */
async function protectAdminPage() {
    try {
        const session = await getSession();
        if (!session) {
            window.location.href = 'login.php';
            return false;
        }

        const admin = await isAdmin();
        if (!admin) {
            window.location.href = 'index.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Admin page protection error:', error);
        window.location.href = 'index.html';
        return false;
    }
}

/**
 * Auto-protect page based on data attribute
 * Add data-protection="auth" or data-protection="premium" to body tag
 */
document.addEventListener('DOMContentLoaded', async () => {
    const body = document.body;
    const protectionType = body.getAttribute('data-protection');
    
    if (protectionType === 'auth') {
        await protectPage();
    } else if (protectionType === 'premium') {
        await protectPremiumPage();
    } else if (protectionType === 'admin') {
        await protectAdminPage();
    }
});
