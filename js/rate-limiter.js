// Rate Limiting Protection
// Prevents script-based attacks and spam submissions

class RateLimiter {
    constructor() {
        this.storageKey = 'newegg_ai_registration_attempts';
        this.maxAttempts = 5; // Maximum attempts per time window
        this.timeWindow = 15 * 60 * 1000; // 15 minutes in milliseconds
        this.lockoutDuration = 60 * 60 * 1000; // 1 hour lockout after max attempts
    }

    // Get attempts from localStorage
    getAttempts() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return { attempts: [], lockoutUntil: null };
            return JSON.parse(stored);
        } catch (error) {
            console.error('Error reading rate limit data:', error);
            return { attempts: [], lockoutUntil: null };
        }
    }

    // Save attempts to localStorage
    saveAttempts(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving rate limit data:', error);
        }
    }

    // Check if user is currently locked out
    isLockedOut() {
        const data = this.getAttempts();
        if (!data.lockoutUntil) return false;
        
        const now = Date.now();
        if (now < data.lockoutUntil) {
            const minutesRemaining = Math.ceil((data.lockoutUntil - now) / 60000);
            return {
                locked: true,
                minutesRemaining: minutesRemaining,
                message: `Too many registration attempts. Please try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}.`
            };
        }
        
        // Lockout expired, clear it
        this.saveAttempts({ attempts: [], lockoutUntil: null });
        return false;
    }

    // Record an attempt
    recordAttempt() {
        const data = this.getAttempts();
        const now = Date.now();
        
        // Check if locked out
        const lockoutCheck = this.isLockedOut();
        if (lockoutCheck && lockoutCheck.locked) {
            return lockoutCheck;
        }
        
        // Remove old attempts outside the time window
        data.attempts = data.attempts.filter(timestamp => 
            (now - timestamp) < this.timeWindow
        );
        
        // Add current attempt
        data.attempts.push(now);
        
        // Check if max attempts reached
        if (data.attempts.length >= this.maxAttempts) {
            data.lockoutUntil = now + this.lockoutDuration;
            this.saveAttempts(data);
            return {
                locked: true,
                minutesRemaining: Math.ceil(this.lockoutDuration / 60000),
                message: `Too many registration attempts. Please try again in ${Math.ceil(this.lockoutDuration / 60000)} minutes.`
            };
        }
        
        // Save updated attempts
        this.saveAttempts(data);
        
        // Return remaining attempts
        return {
            locked: false,
            remainingAttempts: this.maxAttempts - data.attempts.length,
            message: null
        };
    }

    // Check if user can submit (called before form submission)
    canSubmit() {
        // Check lockout first
        const lockoutCheck = this.isLockedOut();
        if (lockoutCheck && lockoutCheck.locked) {
            return {
                allowed: false,
                message: lockoutCheck.message
            };
        }
        
        // Check current attempts
        const attempt = this.recordAttempt();
        if (attempt.locked) {
            return {
                allowed: false,
                message: attempt.message
            };
        }
        
        return {
            allowed: true,
            remainingAttempts: attempt.remainingAttempts,
            message: attempt.remainingAttempts < 3 
                ? `Warning: ${attempt.remainingAttempts} attempt${attempt.remainingAttempts !== 1 ? 's' : ''} remaining.`
                : null
        };
    }

    // Reset attempts (for testing or manual reset)
    reset() {
        this.saveAttempts({ attempts: [], lockoutUntil: null });
    }

    // Get current status
    getStatus() {
        const data = this.getAttempts();
        const now = Date.now();
        const recentAttempts = data.attempts.filter(timestamp => 
            (now - timestamp) < this.timeWindow
        );
        
        const lockoutCheck = this.isLockedOut();
        if (lockoutCheck && lockoutCheck.locked) {
            return {
                locked: true,
                attempts: recentAttempts.length,
                maxAttempts: this.maxAttempts,
                lockoutMinutes: lockoutCheck.minutesRemaining
            };
        }
        
        return {
            locked: false,
            attempts: recentAttempts.length,
            maxAttempts: this.maxAttempts,
            remainingAttempts: this.maxAttempts - recentAttempts.length
        };
    }
}

// Create global instance
window.RateLimiter = RateLimiter;
window.rateLimiter = new RateLimiter();

