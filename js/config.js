// Database Configuration
// Switch between database backends by changing DB_TYPE
// Options: 'supabase', 'mysql', 'mssql'

const DB_CONFIG = {
    // Database type: 'supabase', 'mysql', or 'mssql'
    type: 'supabase',
    
    // Supabase configuration (when type = 'supabase')
    supabase: {
        url: 'https://kkamkwjbiymuasqfoxna.supabase.co', // e.g., 'https://xxxxx.supabase.co'
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrYW1rd2piaXltdWFzcWZveG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MjYwNDUsImV4cCI6MjA3ODIwMjA0NX0.HuXrNZdH4410o5K75td9rPih9wxpOsK6HX9CFK-Y6Gc'
    },
    
    // MySQL configuration (when type = 'mysql')
    // Requires a backend API that connects to MySQL
    mysql: {
        apiUrl: 'https://your-api.com/api' // Your backend API endpoint
    },
    
    // MSSQL configuration (when type = 'mssql')
    // Requires a backend API that connects to MSSQL
    mssql: {
        apiUrl: 'https://your-api.com/api' // Your backend API endpoint
    },
    
    // Current workshop event identifier
    // Change this for each new workshop event
    currentEventId: 'youthai-explorer-2025-nov'
};

// Workshop event details
const WORKSHOP_EVENTS = {
    'youthai-explorer-2025-nov': {
        name: 'YouthAI Explorer Level - November 2025',
        level: 'Explorer Level',
        maxCapacity: 12,
        startDate: '2025-11-15',
        endDate: '2025-12-20',
        registrationDeadline: '2025-11-11', // Registration closes on this date (YYYY-MM-DD)
        registrationDeadlineTime: '23:59' // Time on deadline day (24-hour format, optional)
    }
    // Add more events here as needed
    // 'youthai-explorer-2026-jan': { ... }
};

// Legacy support - keep for backward compatibility
const SUPABASE_CONFIG = DB_CONFIG.supabase;

