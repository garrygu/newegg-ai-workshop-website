// Supabase Client Setup
// This file initializes the Supabase client
// Make sure Supabase JS library is loaded before this script

let supabaseClient = null;

function initSupabase() {
    // Check if Supabase library is loaded
    if (typeof supabase === 'undefined') {
        console.error('Supabase library not loaded. Please include: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
        return null;
    }
    
    // Check if config is loaded
    if (typeof SUPABASE_CONFIG === 'undefined') {
        console.error('Supabase configuration not loaded. Please include js/config.js before this script.');
        return null;
    }
    
    // Check if config is set
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
        console.error('Supabase configuration missing. Please update js/config.js with your Supabase credentials.');
        return null;
    }
    
    // Check if config still has placeholder values
    if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_PROJECT_URL' || 
        SUPABASE_CONFIG.anonKey === 'YOUR_SUPABASE_ANON_KEY') {
        console.warn('Please configure your Supabase credentials in js/config.js');
        return null;
    }
    
    // Create Supabase client
    try {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('Supabase client initialized successfully');
        return supabaseClient;
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        return null;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof SUPABASE_CONFIG !== 'undefined') {
            initSupabase();
        }
    });
} else {
    // DOM already loaded
    if (typeof SUPABASE_CONFIG !== 'undefined') {
        initSupabase();
    }
}

