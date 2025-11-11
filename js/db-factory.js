// Database Factory
// Creates and initializes the appropriate database adapter based on configuration

// Import adapters (they should be loaded before this script)
// <script src="js/adapters/supabase-adapter.js"></script>
// <script src="js/adapters/mysql-adapter.js"></script>
// <script src="js/adapters/mssql-adapter.js"></script>

let dbAdapter = null;

// Make dbAdapter globally accessible
window.dbAdapter = null;

async function initializeDatabase() {
    if (!DB_CONFIG || !DB_CONFIG.type) {
        console.error('Database configuration not found');
        return null;
    }

    const dbType = DB_CONFIG.type.toLowerCase();
    let adapter = null;

    try {
        switch (dbType) {
            case 'supabase':
                if (typeof SupabaseAdapter === 'undefined') {
                    console.error('SupabaseAdapter not loaded. Include js/adapters/supabase-adapter.js');
                    return null;
                }
                adapter = new SupabaseAdapter(DB_CONFIG.supabase);
                break;

            case 'mysql':
                if (typeof MySQLAdapter === 'undefined') {
                    console.error('MySQLAdapter not loaded. Include js/adapters/mysql-adapter.js');
                    return null;
                }
                adapter = new MySQLAdapter(DB_CONFIG.mysql);
                break;

            case 'mssql':
                if (typeof MSSQLAdapter === 'undefined') {
                    console.error('MSSQLAdapter not loaded. Include js/adapters/mssql-adapter.js');
                    return null;
                }
                adapter = new MSSQLAdapter(DB_CONFIG.mssql);
                break;

            default:
                console.error(`Unknown database type: ${dbType}. Use 'supabase', 'mysql', or 'mssql'`);
                return null;
        }

        const initialized = await adapter.initialize();
        if (initialized) {
            dbAdapter = adapter;
            window.dbAdapter = adapter; // Make globally accessible
            console.log(`Database adapter initialized: ${dbType}`);
            return adapter;
        } else {
            console.error(`Failed to initialize ${dbType} adapter`);
            return null;
        }
    } catch (error) {
        console.error(`Error initializing database adapter (${dbType}):`, error);
        return null;
    }
}

// Make initializeDatabase globally accessible
window.initializeDatabase = initializeDatabase;

// Initialize on load
if (typeof DB_CONFIG !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDatabase);
    } else {
        initializeDatabase();
    }
}

