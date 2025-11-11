// Supabase/PostgreSQL Database Adapter

class SupabaseAdapter extends DatabaseAdapter {
    constructor(config) {
        super();
        this.config = config;
        this.client = null;
    }

    async initialize() {
        if (typeof supabase === 'undefined') {
            console.error('Supabase library not loaded');
            return false;
        }

        if (!this.config.url || !this.config.anonKey) {
            console.error('Supabase configuration missing');
            return false;
        }

        try {
            this.client = supabase.createClient(this.config.url, this.config.anonKey);
            console.log('Supabase adapter initialized');
            return true;
        } catch (error) {
            console.error('Error initializing Supabase:', error);
            return false;
        }
    }

    async checkExistingRegistration(studentEmail, eventId) {
        try {
            // Note: This will fail with current RLS (SELECT restricted to authenticated)
            // But that's okay - we'll handle it gracefully
            const { data, error } = await this.client
                .from('workshop_registrations')
                .select('id, status')
                .eq('student_email', studentEmail)
                .eq('workshop_event_id', eventId)
                .maybeSingle(); // Use maybeSingle instead of single to avoid error if not found

            // If RLS blocks SELECT, that's expected - we'll just proceed
            // The unique constraint will catch duplicates on INSERT anyway
            if (error) {
                // If it's a permission error, that's okay - we'll check on insert
                if (error.code === '42501' || error.message?.includes('row-level security')) {
                    console.warn('SELECT blocked by RLS (expected), will check on insert');
                    return null; // Assume not found, let INSERT handle duplicate check
                }
                // Other errors, log but don't throw
                console.warn('Error checking existing registration:', error);
                return null;
            }

            return data || null;
        } catch (error) {
            console.error('Error checking existing registration:', error);
            throw error;
        }
    }

    async getRegistrationCount(eventId) {
        try {
            // This will fail with current RLS (SELECT restricted)
            // For now, we'll skip the count check and let the database handle capacity
            // You can create a function or view that allows counting
            const { count, error } = await this.client
                .from('workshop_registrations')
                .select('*', { count: 'exact', head: true })
                .eq('workshop_event_id', eventId)
                .eq('status', 'registered');

            if (error) {
                // If RLS blocks this, default to 0 and let INSERT handle it
                if (error.code === '42501' || error.message?.includes('row-level security')) {
                    console.warn('Count query blocked by RLS, defaulting to 0');
                    return 0; // Will check capacity on insert
                }
                throw error;
            }
            return count || 0;
        } catch (error) {
            console.error('Error getting registration count:', error);
            throw error;
        }
    }

    async insertRegistration(registrationData) {
        try {
            // Request minimal returning payload so anon role doesn't need SELECT rights
            const { error } = await this.client
                .from('workshop_registrations')
                .insert([registrationData], { returning: 'minimal' });

            if (error) {
                // Handle unique constraint violation
                if (error.code === '23505') {
                    const duplicateError = new Error('Student already registered for this event');
                    duplicateError.code = 'DUPLICATE';
                    throw duplicateError;
                }
                throw error;
            }

            // Return data we already have so callers can continue logging
            return { ...registrationData };
        } catch (error) {
            console.error('Error inserting registration:', error);
            throw error;
        }
    }

    async getRegistrations(eventId) {
        try {
            const { data, error } = await this.client
                .from('workshop_registrations')
                .select('*')
                .eq('workshop_event_id', eventId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting registrations:', error);
            throw error;
        }
    }
}
