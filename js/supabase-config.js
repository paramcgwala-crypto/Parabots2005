// ===================================
// SUPABASE CONFIGURATION
// ===================================
// 
// SETUP INSTRUCTIONS:
// 1. Create a free Supabase project at https://supabase.com
// 2. Go to Project Settings > API
// 3. Copy your Project URL and Anon Key
// 4. Paste them below
// 5. Enable Email Auth in Authentication > Providers
// 6. Set up email templates in Authentication > Email Templates
// 7. Create user_roles table in SQL Editor (see SETUP_GUIDE.md)
// ===================================

const SUPABASE_CONFIG = {
    // Replace these with your actual Supabase credentials
    url: 'YOUR_SUPABASE_PROJECT_URL_HERE',
    anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE',
    
    // Authentication settings
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
    }
};

// Validate configuration
function validateSupabaseConfig() {
    if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_PROJECT_URL_HERE' || 
        SUPABASE_CONFIG.anonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
        console.error('⚠️ Supabase credentials not configured. Please update supabase-config.js with your credentials.');
        return false;
    }
    return true;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}
