// Database Adapter Layer
// This abstraction allows switching between different database backends
// (Supabase/PostgreSQL, MySQL, MSSQL, etc.) without changing form code

class DatabaseAdapter {
    /**
     * Initialize the database connection
     * @returns {Promise<boolean>} True if successful
     */
    async initialize() {
        throw new Error('initialize() must be implemented by adapter');
    }

    /**
     * Check if a student is already registered for an event
     * @param {string} studentEmail - Student's email address
     * @param {string} eventId - Workshop event ID
     * @returns {Promise<Object|null>} Existing registration or null
     */
    async checkExistingRegistration(studentEmail, eventId) {
        throw new Error('checkExistingRegistration() must be implemented by adapter');
    }

    /**
     * Get registration count for an event
     * @param {string} eventId - Workshop event ID
     * @returns {Promise<number>} Count of registered students (not waitlisted)
     */
    async getRegistrationCount(eventId) {
        throw new Error('getRegistrationCount() must be implemented by adapter');
    }

    /**
     * Insert a new registration
     * @param {Object} registrationData - Registration data object
     * @returns {Promise<Object>} Inserted registration data
     */
    async insertRegistration(registrationData) {
        throw new Error('insertRegistration() must be implemented by adapter');
    }

    /**
     * Get all registrations for an event (admin function)
     * @param {string} eventId - Workshop event ID
     * @returns {Promise<Array>} Array of registrations
     */
    async getRegistrations(eventId) {
        throw new Error('getRegistrations() must be implemented by adapter');
    }
}

