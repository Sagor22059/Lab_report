// Lab Report System - Main JavaScript
console.log("Lab Report System loaded");

// Utility Functions
const Utils = {
    // Show notification
    showNotification: (message, type = 'info') => {
        const alertClass = `alert-${type}`;
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        const container = document.createElement('div');
        container.innerHTML = alertHtml;
        document.body.insertBefore(container.firstElementChild, document.body.firstChild);
    },

    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Format date
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};

// Form Validation
document.addEventListener('DOMContentLoaded', function() {
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        const bsAlert = new bootstrap.Alert(alert);
        setTimeout(() => {
            bsAlert.close();
        }, 5000);
    });

    // Form validation for register
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            if (!name || !email || !password || !role) {
                e.preventDefault();
                Utils.showNotification('All fields are required!', 'warning');
                return false;
            }

            if (!Utils.validateEmail(email)) {
                e.preventDefault();
                Utils.showNotification('Please enter a valid email address', 'warning');
                return false;
            }

            if (password.length < 6) {
                e.preventDefault();
                Utils.showNotification('Password must be at least 6 characters long', 'warning');
                return false;
            }
        });
    }

    // Add loading state to submit buttons
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
            }
        });
    });
});

// Expose Utils globally
window.Utils = Utils;