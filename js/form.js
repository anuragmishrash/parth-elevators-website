'use strict';

/**
 * PARTH ELEVATORS — CONTACT FORM HANDLING & VALIDATION
 * Independent client-side validation, error feedback, and submission simulation
 */

/**
 * Validates form data according to Parth Elevators business requirements
 * @param {Object} data - Key/value pairs from form fields
 * @returns {Object} { valid: boolean, errors: Object }
 */
function validateForm(data) {
  const errors = {};

  // Name: Required, min 2 characters
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }

  // Phone: Required, exactly 10 digits numeric
  const phoneDigits = data.phone ? data.phone.replace(/[\s\-\(\)\+]/g, '') : '';
  const is10Digits = /^\d{10}$/.test(phoneDigits);
  if (!data.phone || !is10Digits) {
    errors.phone = 'Please enter a valid 10-digit mobile number.';
  }

  // Email: Optional, but if provided must follow standard format
  if (data.email && data.email.trim().length > 0) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
  }

  // Service: Required, must be selected
  if (!data.service || data.service.trim() === '') {
    errors.service = 'Please select a service required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Displays error message and highlights invalid input element
 * @param {string} fieldName - Input name attribute
 * @param {string} message - Validation failure message
 */
function showFieldError(fieldName, message) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (!field) return;

  field.classList.add('error');

  const parent = field.closest('.form-group');
  if (parent) {
    // Avoid creating duplicate error messages
    const existingError = parent.querySelector('.field-error');
    if (!existingError) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.textContent = message;
      parent.appendChild(errorDiv);
    }
  }
}

/**
 * Clears all error styles and removes error messages
 */
function clearErrors() {
  const errorFields = document.querySelectorAll('.form-group .error');
  errorFields.forEach(field => field.classList.remove('error'));

  const errorMessages = document.querySelectorAll('.field-error');
  errorMessages.forEach(msg => msg.remove());
}

/**
 * Handles form submission with validation and simulated dispatch
 * @param {Event} event - Submit event
 */
function handleSubmit(event) {
  event.preventDefault();
  clearErrors();

  const form = event.target;
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    service: formData.get('service'),
    message: formData.get('message')
  };

  const validation = validateForm(data);

  if (!validation.valid) {
    for (const [field, errorMsg] of Object.entries(validation.errors)) {
      showFieldError(field, errorMsg);
    }
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : 'Send Enquiry';
  const successBox = document.getElementById('formSuccess');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
  }

  // TODO: Replace setTimeout simulation with real EmailJS or backend API call
  // Example EmailJS integration:
  // emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', form, 'PUBLIC_KEY')
  //   .then(() => { ... })
  //   .catch((err) => { ... });

  setTimeout(() => {
    if (successBox) {
      successBox.classList.add('show');
    }

    form.reset();

    if (submitButton) {
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }, 3000);
    }
  }, 1200);
}

// Attach event listener once DOM content is ready
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleSubmit);
  }
});
