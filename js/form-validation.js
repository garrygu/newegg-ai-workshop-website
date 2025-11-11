// Enhanced Form Validation and Formatting Utilities

const FormValidation = {
    /**
     * Validate email format
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate phone number (US format: accepts various formats)
     */
    validatePhone(phone) {
        // Remove all non-digits
        const digits = phone.replace(/\D/g, '');
        // Accept 10 or 11 digits (with or without country code)
        return digits.length === 10 || digits.length === 11;
    },

    /**
     * Format phone number as user types (US format)
     */
    formatPhoneNumber(value) {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        
        // Limit to 11 digits (country code + 10 digits)
        const limited = digits.slice(0, 11);
        
        // Format: (XXX) XXX-XXXX
        if (limited.length <= 3) {
            return limited;
        } else if (limited.length <= 6) {
            return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
        } else {
            return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6, 10)}`;
        }
    },

    /**
     * Format name (capitalize first letter of each word)
     */
    formatName(name) {
        return name
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim();
    },

    /**
     * Validate name (at least 2 characters, letters and spaces only)
     */
    validateName(name) {
        const trimmed = name.trim();
        if (trimmed.length < 2) return false;
        // Allow letters, spaces, hyphens, apostrophes
        const re = /^[a-zA-Z\s'-]+$/;
        return re.test(trimmed);
    },

    /**
     * Validate grade selection
     */
    validateGrade(grade) {
        const validGrades = ['9_or_below', '10', '11', '12_or_above'];
        return validGrades.includes(grade);
    },

    /**
     * Show field error
     */
    showError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        this.clearError(field);

        // Add error class to field
        field.style.borderColor = '#ff4444';
        field.classList.add('error');

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    },

    /**
     * Clear field error
     */
    clearError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove error class
        field.style.borderColor = '';
        field.classList.remove('error');

        // Remove error message
        const errorDiv = formGroup.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    },

    /**
     * Show success indicator
     */
    showSuccess(field) {
        this.clearError(field);
        field.style.borderColor = '#22c55e';
    },

    /**
     * Reset field styling
     */
    resetField(field) {
        field.style.borderColor = '';
        field.classList.remove('error');
        this.clearError(field);
    }
};

// Make available globally
window.FormValidation = FormValidation;

