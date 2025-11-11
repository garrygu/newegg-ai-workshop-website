// MSSQL Database Adapter
// To use this adapter, you'll need to set up a backend API endpoint
// that connects to MSSQL and exposes REST endpoints

class MSSQLAdapter extends DatabaseAdapter {
    constructor(config) {
        super();
        this.config = config; // { apiUrl: 'https://your-api.com/api' }
    }

    async initialize() {
        if (!this.config.apiUrl) {
            console.error('MSSQL adapter requires apiUrl in config');
            return false;
        }
        console.log('MSSQL adapter initialized (via API)');
        return true;
    }

    async checkExistingRegistration(studentEmail, eventId) {
        try {
            const response = await fetch(`${this.config.apiUrl}/registrations/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentEmail, eventId })
            });

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data.registration || null;
        } catch (error) {
            console.error('Error checking existing registration:', error);
            throw error;
        }
    }

    async getRegistrationCount(eventId) {
        try {
            const response = await fetch(`${this.config.apiUrl}/registrations/count?eventId=${eventId}`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data.count || 0;
        } catch (error) {
            console.error('Error getting registration count:', error);
            throw error;
        }
    }

    async insertRegistration(registrationData) {
        try {
            const response = await fetch(`${this.config.apiUrl}/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (errorData.code === 'DUPLICATE' || response.status === 409) {
                    const duplicateError = new Error('Student already registered for this event');
                    duplicateError.code = 'DUPLICATE';
                    throw duplicateError;
                }
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data.registration;
        } catch (error) {
            console.error('Error inserting registration:', error);
            throw error;
        }
    }

    async getRegistrations(eventId) {
        try {
            const response = await fetch(`${this.config.apiUrl}/registrations?eventId=${eventId}`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data.registrations || [];
        } catch (error) {
            console.error('Error getting registrations:', error);
            throw error;
        }
    }
}

