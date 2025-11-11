// Registration Status and Deadline Management

const RegistrationStatus = {
    /**
     * Check if registration is open for an event
     * @param {string} eventId - Workshop event ID
     * @returns {Object} { isOpen: boolean, reason: string, deadline: Date|null }
     */
    checkRegistrationStatus(eventId) {
        const event = WORKSHOP_EVENTS[eventId];
        
        if (!event) {
            return {
                isOpen: false,
                reason: 'Event not found',
                deadline: null
            };
        }
        
        // Check deadline
        if (event.registrationDeadline) {
            const deadline = this.parseDeadline(event.registrationDeadline, event.registrationDeadlineTime);
            const now = new Date();
            
            if (now > deadline) {
                return {
                    isOpen: false,
                    reason: 'Registration deadline has passed',
                    deadline: deadline
                };
            }
        }
        
        return {
            isOpen: true,
            reason: 'Registration is open',
            deadline: event.registrationDeadline ? this.parseDeadline(event.registrationDeadline, event.registrationDeadlineTime) : null
        };
    },
    
    /**
     * Parse deadline date and time
     * @param {string} dateStr - Date string (YYYY-MM-DD)
     * @param {string} timeStr - Time string (HH:MM) optional
     * @returns {Date} Deadline date
     */
    parseDeadline(dateStr, timeStr = '23:59') {
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        // Create date in local timezone
        const deadline = new Date(year, month - 1, day, hours || 23, minutes || 59, 59, 999);
        
        return deadline;
    },
    
    /**
     * Format deadline for display
     * @param {Date} deadline - Deadline date
     * @returns {string} Formatted deadline string
     */
    formatDeadline(deadline) {
        if (!deadline) return null;
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        
        return deadline.toLocaleDateString('en-US', options);
    },
    
    /**
     * Get time remaining until deadline
     * @param {Date} deadline - Deadline date
     * @returns {Object} { days: number, hours: number, minutes: number, seconds: number, expired: boolean }
     */
    getTimeRemaining(deadline) {
        if (!deadline) return null;
        
        const now = new Date();
        const diff = deadline - now;
        
        if (diff <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                expired: true
            };
        }
        
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return {
            days,
            hours,
            minutes,
            seconds,
            expired: false
        };
    },
    
    /**
     * Format countdown display
     * @param {Object} timeRemaining - Time remaining object
     * @returns {string} Formatted countdown string
     */
    formatCountdown(timeRemaining) {
        if (!timeRemaining || timeRemaining.expired) {
            return '00:00:00:00';
        }
        
        const days = String(timeRemaining.days).padStart(2, '0');
        const hours = String(timeRemaining.hours).padStart(2, '0');
        const minutes = String(timeRemaining.minutes).padStart(2, '0');
        const seconds = String(Math.floor((timeRemaining.seconds || 0) % 60)).padStart(2, '0');
        
        return `${days}:${hours}:${minutes}:${seconds}`;
    },
    
    /**
     * Update deadline display on page
     */
    updateDeadlineDisplay() {
        const eventId = DB_CONFIG.currentEventId;
        const status = this.checkRegistrationStatus(eventId);
        const event = WORKSHOP_EVENTS[eventId];
        
        // Update registration status section (merged with countdown)
        const statusSection = document.getElementById('registrationStatusSection');
        const deadlineInfo = document.getElementById('deadlineInfo');
        
        if (status.deadline) {
            const timeRemaining = this.getTimeRemaining(status.deadline);
            
            if (timeRemaining.expired) {
                // Registration closed
                if (statusSection) {
                    statusSection.innerHTML = `
                        <div class="status-badge" style="background: rgba(255, 68, 68, 0.2); border-color: #ff4444;">
                            <span style="color: #ff4444;">●</span>
                            <span style="color: #ff4444;">Registration Closed</span>
                        </div>
                        <p style="color: var(--newegg-text-secondary); margin: var(--spacing-sm) 0 0 0;">
                            Registration deadline was ${this.formatDeadline(status.deadline)}
                        </p>
                    `;
                }
                if (deadlineInfo) deadlineInfo.innerHTML = '';
            } else {
                // Calculate seconds for countdown
                const now = new Date();
                const diff = status.deadline - now;
                const totalSeconds = Math.floor(diff / 1000);
                const seconds = totalSeconds % 60;
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const hours = Math.floor((totalSeconds % 86400) / 3600);
                const days = Math.floor(totalSeconds / 86400);
                
                // Compact merged display
                if (statusSection) {
                    statusSection.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--spacing-md);">
                            <div style="flex: 1; min-width: 200px;">
                                <div class="status-badge open">
                                    <span>●</span>
                                    <span>Registration Open</span>
                                </div>
                                <p style="color: var(--newegg-text-secondary); margin: var(--spacing-xs) 0 0 0; font-size: 0.9rem;">
                                    Limited to 12 students. Additional registrations will be waitlisted.
                                </p>
                            </div>
                            <div style="flex: 1; min-width: 250px; text-align: right;">
                                <div style="margin-bottom: var(--spacing-xs);">
                                    <span style="color: var(--newegg-text-secondary); font-size: 0.85rem;">Closes in:</span>
                                </div>
                                <div id="countdownTimer" style="font-size: 1.8rem; font-weight: 700; color: var(--newegg-orange); font-family: 'Courier New', monospace; letter-spacing: 1px; line-height: 1.2;">
                                    ${this.formatCountdown({ days, hours, minutes, seconds, expired: false })}
                                </div>
                                <div style="display: flex; justify-content: flex-end; gap: var(--spacing-sm); margin-top: var(--spacing-xs); font-size: 0.75rem; color: var(--newegg-text-secondary);">
                                    <span>D</span><span>H</span><span>M</span><span>S</span>
                                </div>
                                <p style="margin: var(--spacing-xs) 0 0 0; color: var(--newegg-text-secondary); font-size: 0.8rem;">
                                    ${this.formatDeadline(status.deadline)}
                                </p>
                            </div>
                        </div>
                    `;
                }
                if (deadlineInfo) deadlineInfo.innerHTML = '';
            }
        } else {
            // No deadline set - show basic status
            if (statusSection) {
                statusSection.innerHTML = `
                    <div class="status-badge open">
                        <span>●</span>
                        <span>Registration Open</span>
                    </div>
                    <p style="color: var(--newegg-text-secondary); margin: var(--spacing-sm) 0 0 0;">
                        Registration is open for the YouthAI Explorer Level workshop. <strong>Limited to 12 students.</strong> 
                        If we receive more than 12 registrations, additional students will be placed on a waitlist and notified 
                        if a spot becomes available.
                    </p>
                `;
            }
            if (deadlineInfo) deadlineInfo.innerHTML = '';
        }
        
        // Disable form if registration is closed
        const registrationForm = document.getElementById('registrationForm');
        const submitButton = registrationForm?.querySelector('button[type="submit"]');
        
        if (!status.isOpen && registrationForm && submitButton) {
            registrationForm.style.opacity = '0.6';
            registrationForm.style.pointerEvents = 'none';
            submitButton.disabled = true;
            submitButton.textContent = 'Registration Closed';
            
            // Show closed message
            if (!document.getElementById('registrationClosedMessage')) {
                const closedMsg = document.createElement('div');
                closedMsg.id = 'registrationClosedMessage';
                closedMsg.style.cssText = `
                    background: rgba(255, 68, 68, 0.1);
                    border: 2px solid #ff4444;
                    border-radius: 8px;
                    padding: var(--spacing-lg);
                    margin: var(--spacing-lg) 0;
                    text-align: center;
                `;
                closedMsg.innerHTML = `
                    <h3 style="color: #ff4444; margin-bottom: var(--spacing-sm);">Registration Closed</h3>
                    <p style="color: var(--newegg-text-secondary);">
                        ${status.reason}. ${status.deadline ? `The deadline was ${this.formatDeadline(status.deadline)}.` : ''}
                    </p>
                `;
                registrationForm.parentNode.insertBefore(closedMsg, registrationForm);
            }
        }
    }
};

// Make available globally
window.RegistrationStatus = RegistrationStatus;

// Auto-update countdown every second
let countdownInterval = null;

function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Update immediately
    if (typeof RegistrationStatus !== 'undefined' && typeof DB_CONFIG !== 'undefined') {
        RegistrationStatus.updateDeadlineDisplay();
    }
    
    // Update every second for countdown
    countdownInterval = setInterval(() => {
        if (typeof RegistrationStatus !== 'undefined' && typeof DB_CONFIG !== 'undefined') {
            const eventId = DB_CONFIG.currentEventId;
            const status = RegistrationStatus.checkRegistrationStatus(eventId);
            
            if (status.deadline) {
                const timeRemaining = RegistrationStatus.getTimeRemaining(status.deadline);
                
                // Update countdown timer if it exists
                const countdownTimer = document.getElementById('countdownTimer');
                if (countdownTimer && !timeRemaining.expired) {
                    countdownTimer.textContent = RegistrationStatus.formatCountdown(timeRemaining);
                } else if (timeRemaining.expired) {
                    // Deadline passed, update display and stop countdown
                    RegistrationStatus.updateDeadlineDisplay();
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                    }
                }
            }
        }
    }, 1000); // Update every second
}

// Start countdown when page loads
if (typeof DB_CONFIG !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startCountdown);
    } else {
        startCountdown();
    }
}

