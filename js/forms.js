// Form handling for registration

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    
    if (!registrationForm) return;
    
    // Get form fields
    const studentNameField = document.getElementById('studentName');
    const studentEmailField = document.getElementById('studentEmail');
    const studentGradeField = document.getElementById('studentGrade');
    const parentNameField = document.getElementById('parentName');
    const parentEmailField = document.getElementById('parentEmail');
    const parentPhoneField = document.getElementById('parentPhone');
    
    // Name formatting and validation
    if (studentNameField) {
        studentNameField.addEventListener('blur', () => {
            if (studentNameField.value) {
                const formatted = FormValidation.formatName(studentNameField.value);
                studentNameField.value = formatted;
                
                if (!FormValidation.validateName(formatted)) {
                    FormValidation.showError(studentNameField, 'Please enter a valid name (at least 2 characters, letters only)');
                } else {
                    FormValidation.showSuccess(studentNameField);
                }
            } else {
                FormValidation.resetField(studentNameField);
            }
        });
    }
    
    if (parentNameField) {
        parentNameField.addEventListener('blur', () => {
            if (parentNameField.value) {
                const formatted = FormValidation.formatName(parentNameField.value);
                parentNameField.value = formatted;
                
                if (!FormValidation.validateName(formatted)) {
                    FormValidation.showError(parentNameField, 'Please enter a valid name (at least 2 characters, letters only)');
                } else {
                    FormValidation.showSuccess(parentNameField);
                }
            } else {
                FormValidation.resetField(parentNameField);
            }
        });
    }
    
    // Email validation
    if (studentEmailField) {
        studentEmailField.addEventListener('blur', () => {
            if (studentEmailField.value) {
                const email = studentEmailField.value.trim().toLowerCase();
                studentEmailField.value = email;
                
                if (!FormValidation.validateEmail(email)) {
                    FormValidation.showError(studentEmailField, 'Please enter a valid email address (e.g., student@example.com)');
                } else {
                    FormValidation.showSuccess(studentEmailField);
                }
            } else {
                FormValidation.resetField(studentEmailField);
            }
        });
    }
    
    if (parentEmailField) {
        parentEmailField.addEventListener('blur', () => {
            if (parentEmailField.value) {
                const email = parentEmailField.value.trim().toLowerCase();
                parentEmailField.value = email;
                
                if (!FormValidation.validateEmail(email)) {
                    FormValidation.showError(parentEmailField, 'Please enter a valid email address (e.g., parent@example.com)');
                } else {
                    FormValidation.showSuccess(parentEmailField);
                }
            } else {
                FormValidation.resetField(parentEmailField);
            }
        });
    }
    
    // Phone number formatting and validation
    if (parentPhoneField) {
        // Format as user types
        parentPhoneField.addEventListener('input', (e) => {
            const formatted = FormValidation.formatPhoneNumber(e.target.value);
            if (formatted !== e.target.value) {
                e.target.value = formatted;
            }
        });
        
        // Validate on blur
        parentPhoneField.addEventListener('blur', () => {
            if (parentPhoneField.value) {
                if (!FormValidation.validatePhone(parentPhoneField.value)) {
                    FormValidation.showError(parentPhoneField, 'Please enter a valid 10-digit phone number (e.g., (555) 123-4567)');
                } else {
                    FormValidation.showSuccess(parentPhoneField);
                }
            } else {
                FormValidation.resetField(parentPhoneField);
            }
        });
    }
    
    // Grade validation
    if (studentGradeField) {
        studentGradeField.addEventListener('change', () => {
            if (studentGradeField.value) {
                if (!FormValidation.validateGrade(studentGradeField.value)) {
                    FormValidation.showError(studentGradeField, 'Please select a valid grade level');
                } else {
                    FormValidation.showSuccess(studentGradeField);
                }
            } else {
                FormValidation.resetField(studentGradeField);
            }
        });
    }
    
    // Form submission
           registrationForm.addEventListener('submit', async (e) => {
               e.preventDefault();
               
               // Rate limiting check
               if (window.rateLimiter) {
                   const rateLimitCheck = window.rateLimiter.canSubmit();
                   if (!rateLimitCheck.allowed) {
                       alert(rateLimitCheck.message);
                       return;
                   }
                   // Show warning if low attempts remaining
                   if (rateLimitCheck.message) {
                       console.warn(rateLimitCheck.message);
                   }
               }
        
        // Get form elements
        const submitButton = registrationForm.querySelector('button[type="submit"]');
        const submitText = document.getElementById('submitText');
        const submitSpinner = document.getElementById('submitSpinner');
        const formSuccess = document.getElementById('formSuccess');
        
        // Check if registration is still open
        const registrationStatus = RegistrationStatus.checkRegistrationStatus(DB_CONFIG.currentEventId);
        if (!registrationStatus.isOpen) {
            alert(`Registration is closed: ${registrationStatus.reason}`);
            return;
        }
        
        // Enhanced form validation
        let isValid = true;
        
        // Validate student name
        if (!studentNameField.value.trim()) {
            FormValidation.showError(studentNameField, 'Student name is required');
            isValid = false;
        } else if (!FormValidation.validateName(studentNameField.value)) {
            FormValidation.showError(studentNameField, 'Please enter a valid name');
            isValid = false;
        }
        
        // Validate student email
        if (!studentEmailField.value.trim()) {
            FormValidation.showError(studentEmailField, 'Student email is required');
            isValid = false;
        } else if (!FormValidation.validateEmail(studentEmailField.value)) {
            FormValidation.showError(studentEmailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate student grade
        if (!studentGradeField.value) {
            FormValidation.showError(studentGradeField, 'Please select a grade level');
            isValid = false;
        }
        
        // Validate parent name
        if (!parentNameField.value.trim()) {
            FormValidation.showError(parentNameField, 'Parent/guardian name is required');
            isValid = false;
        } else if (!FormValidation.validateName(parentNameField.value)) {
            FormValidation.showError(parentNameField, 'Please enter a valid name');
            isValid = false;
        }
        
        // Validate parent email
        if (!parentEmailField.value.trim()) {
            FormValidation.showError(parentEmailField, 'Parent/guardian email is required');
            isValid = false;
        } else if (!FormValidation.validateEmail(parentEmailField.value)) {
            FormValidation.showError(parentEmailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate parent phone
        if (!parentPhoneField.value.trim()) {
            FormValidation.showError(parentPhoneField, 'Parent/guardian phone is required');
            isValid = false;
        } else if (!FormValidation.validatePhone(parentPhoneField.value)) {
            FormValidation.showError(parentPhoneField, 'Please enter a valid 10-digit phone number');
            isValid = false;
        }
        
        // Validate motivation/expectations (optional field - only validate if something is entered)
        const motivationField = document.getElementById('motivation');
        if (motivationField && motivationField.value.trim() && motivationField.value.trim().length < 10) {
            FormValidation.showError(motivationField, 'Please provide more details (at least 10 characters) or leave blank');
            isValid = false;
        }
        
        // Check if emails are different
        if (studentEmailField.value.trim().toLowerCase() === parentEmailField.value.trim().toLowerCase()) {
            FormValidation.showError(parentEmailField, 'Parent email should be different from student email');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        if (submitText) submitText.textContent = 'Submitting...';
        if (submitSpinner) submitSpinner.style.display = 'inline-block';
        
        // Collect form data
        const formData = new FormData(registrationForm);
        const registrationData = {
            // Student Information
            student_name: formData.get('studentName'),
            student_email: formData.get('studentEmail'),
            student_grade: formData.get('studentGrade'),
            student_experience: formData.get('studentExperience'),
            // Parent/Guardian Information
            parent_name: formData.get('parentName'),
            parent_email: formData.get('parentEmail'),
            parent_phone: formData.get('parentPhone'),
            // Workshop Information
            workshop_level: formData.get('workshopLevel'),
            workshop_event_id: DB_CONFIG.currentEventId,
            motivation: formData.get('motivation') || '', // Optional field - default to empty string
            // Status (default to 'registered', will be 'waitlisted' if over capacity)
            status: 'registered'
        };
        
        // Save to database using adapter
        try {
            // Initialize database adapter if not already done
            if (!window.dbAdapter) {
                window.dbAdapter = await initializeDatabase();
            }
            
            if (!window.dbAdapter) {
                throw new Error('Database adapter not initialized. Please check your configuration.');
            }
            
            // Check if student is already registered for this event
            const existingRegistration = await window.dbAdapter.checkExistingRegistration(
                registrationData.student_email,
                registrationData.workshop_event_id
            );
            
            if (existingRegistration) {
                // Student already registered for this event
                alert('This student is already registered for this workshop event. Each student can only register once per event.');
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                if (submitText) submitText.textContent = 'Register for Explorer Level';
                if (submitSpinner) submitSpinner.style.display = 'none';
                return;
            }
            
            // Check current registration count for this event
            const count = await window.dbAdapter.getRegistrationCount(registrationData.workshop_event_id);
            
            // Get max capacity for this event
            const eventConfig = WORKSHOP_EVENTS[DB_CONFIG.currentEventId];
            const maxCapacity = eventConfig ? eventConfig.maxCapacity : 12;
            
            // If at capacity, set status to waitlisted
            if (count >= maxCapacity) {
                registrationData.status = 'waitlisted';
            }
            
            // Insert registration into database
            const insertedData = await window.dbAdapter.insertRegistration(registrationData);
            
            // Success!
            console.log('Registration saved:', insertedData);
            
            // Optional: Send to analytics or tracking service
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Registration',
                    'event_label': registrationData.workshop_level,
                    'status': registrationData.status
                });
            }
            
            // Redirect to confirmation page
            const studentName = encodeURIComponent(registrationData.student_name);
            const status = registrationData.status;
            const confirmationUrl = `confirmation.html?status=${status}&student=${studentName}`;
            
            // Redirect to confirmation page
            window.location.href = confirmationUrl;
            
        } catch (error) {
            console.error('Registration error:', error);
            
            // Show user-friendly error message
            let errorMessage = 'Sorry, there was an error submitting your registration. Please try again or contact support.';
            
            if (error.message) {
                if (error.message.includes('already registered') || error.code === 'DUPLICATE') {
                    errorMessage = 'This student is already registered for this workshop event.';
                } else if (error.message.includes('Database adapter not initialized') || error.message.includes('not initialized')) {
                    errorMessage = 'Database connection error. Please check your configuration or contact support.';
                } else if (error.message.includes('API error') || error.message.includes('fetch')) {
                    errorMessage = 'Unable to connect to registration system. Please check your internet connection and try again.';
                } else if (error.message.includes('Supabase') || error.message.includes('supabase')) {
                    errorMessage = 'Database connection error. Please ensure the database is properly configured.';
                } else {
                    // Show more specific error for debugging (in development)
                    errorMessage = `Error: ${error.message}`;
                }
            }
            
            alert(errorMessage);
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            if (submitText) submitText.textContent = 'Register for Explorer Level';
            if (submitSpinner) submitSpinner.style.display = 'none';
        }
    });
    
    // Clear errors on input (real-time feedback)
    registrationForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => {
            FormValidation.resetField(field);
        });
    });
});

