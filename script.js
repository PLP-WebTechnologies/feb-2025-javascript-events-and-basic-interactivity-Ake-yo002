document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const prevBtn = document.getElementById('prev-tab');
    const nextBtn = document.getElementById('next-tab');
    const submitBtn = document.getElementById('submit-btn');
    let currentTab = 0;
    
    // Initialize tabs
    showTab(currentTab);
    
    // Tab button click event
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Next button click event
    nextBtn.addEventListener('click', function() {
        if (validateCurrentTab()) {
            currentTab++;
            showTab(currentTab);
        }
    });
    
    // Previous button click event
    prevBtn.addEventListener('click', function() {
        currentTab--;
        showTab(currentTab);
    });
    
    // Form submission
    const form = document.getElementById('registration-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            // Simulate form submission
            alert('Registration successful! Welcome to Dark Academia.');
            form.reset();
            currentTab = 0;
            showTab(currentTab);
        }
    });
    
    // Show the current tab
    function showTab(n) {
        tabContents.forEach(content => content.classList.remove('active'));
        tabButtons.forEach(button => button.classList.remove('active'));
        
        const currentContent = document.querySelectorAll('.tab-content')[n];
        const currentButton = document.querySelectorAll('.tab-btn')[n];
        
        currentContent.classList.add('active');
        currentButton.classList.add('active');
        
        // Update button visibility
        prevBtn.classList.toggle('hidden', n === 0);
        nextBtn.classList.toggle('hidden', n === tabContents.length - 1);
        submitBtn.classList.toggle('hidden', n !== tabContents.length - 1);
    }
    
    // Switch to specific tab by ID
    function switchTab(tabId) {
        const tabIndex = Array.from(tabButtons).findIndex(btn => btn.getAttribute('data-tab') === tabId);
        if (tabIndex !== -1) {
            currentTab = tabIndex;
            showTab(currentTab);
        }
    }
    
    // Validate current tab before proceeding
    function validateCurrentTab() {
        const currentContent = document.querySelectorAll('.tab-content')[currentTab];
        let isValid = true;
        
        if (currentTab === 0) { // Personal info tab
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            
            // Validate name
            if (name.value.trim() === '') {
                showError(name, 'Name is required');
                isValid = false;
            } else {
                clearError(name);
            }
            
            // Validate email
            if (email.value.trim() === '') {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            } else {
                clearError(email);
            }
            
            // Validate password
            if (password.value === '') {
                showError(password, 'Password is required');
                isValid = false;
            } else if (!isPasswordValid(password.value)) {
                showError(password, 'Password does not meet requirements');
                isValid = false;
            } else {
                clearError(password);
            }
            
            // Validate confirm password
            if (confirmPassword.value !== password.value) {
                showError(confirmPassword, 'Passwords do not match');
                isValid = false;
            } else {
                clearError(confirmPassword);
            }
        } else if (currentTab === 1) { // Academic info tab
            const country = document.getElementById('country');
            const courses = document.querySelectorAll('input[name="course"]:checked');
            const courseError = document.getElementById('course-error');
            
            // Validate country
            if (country.value === '') {
                showError(country, 'Please select your country');
                isValid = false;
            } else {
                clearError(country);
            }
            
            // Validate at least one course selected
            if (courses.length === 0) {
                courseError.textContent = 'Please select at least one course';
                courseError.style.display = 'block';
                isValid = false;
            } else {
                courseError.textContent = '';
                courseError.style.display = 'none';
            }
        }
        
        return isValid;
    }
    
    // Validate entire form
    function validateForm() {
        let isValid = true;
        
        // Validate all tabs
        for (let i = 0; i < tabContents.length; i++) {
            currentTab = i;
            if (!validateCurrentTab()) {
                isValid = false;
            }
        }
        
        // If all valid, show payment method specific fields
        if (isValid) {
            const paymentMethod = document.getElementById('payment-method').value;
            document.getElementById('credit-card-fields').classList.toggle('hidden', paymentMethod !== 'credit');
            document.getElementById('mpesa-fields').classList.toggle('hidden', paymentMethod !== 'mpesa');
        }
        
        return isValid;
    }
    
    // Show error message for a field
    function showError(field, message) {
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
            field.style.borderColor = 'var(--error)';
        }
    }
    
    // Clear error message for a field
    function clearError(field) {
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = '';
            field.style.borderColor = '#2c3a58';
        }
    }
    
    // Email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Password validation
    function isPasswordValid(password) {
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
    }
    
    // Real-time password validation
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        // Update password rules indicators
        document.querySelector('.rule[data-rule="length"]').classList.toggle('valid', password.length >= 8);
        document.querySelector('.rule[data-rule="uppercase"]').classList.toggle('valid', /[A-Z]/.test(password));
        document.querySelector('.rule[data-rule="number"]').classList.toggle('valid', /\d/.test(password));
        document.querySelector('.rule[data-rule="special"]').classList.toggle('valid', /[!@#$%^&*(),.?":{}|<>]/.test(password));
        
        // Clear error if valid
        if (isPasswordValid(password)) {
            clearError(this);
        }
    });
    
    // Real-time email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        if (this.value.trim() !== '' && !isValidEmail(this.value)) {
            showError(this, 'Please enter a valid email');
        } else {
            clearError(this);
        }
    });
    
    // Confirm password real-time validation
    const confirmPasswordInput = document.getElementById('confirm-password');
    confirmPasswordInput.addEventListener('input', function() {
        const password = document.getElementById('password').value;
        
        if (this.value !== password) {
            showError(this, 'Passwords do not match');
        } else {
            clearError(this);
        }
    });
    
    // Payment method change event
    const paymentMethodSelect = document.getElementById('payment-method');
    paymentMethodSelect.addEventListener('change', function() {
        document.getElementById('credit-card-fields').classList.toggle('hidden', this.value !== 'credit');
        document.getElementById('mpesa-fields').classList.toggle('hidden', this.value !== 'mpesa');
    });
    
    // Accordion functionality
    const accordionBtn = document.querySelector('.accordion-btn');
    const accordionContent = document.querySelector('.accordion-content');
    
    accordionBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        if (accordionContent.style.maxHeight) {
            accordionContent.style.maxHeight = null;
        } else {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
        }
    });
    
    // Image gallery functionality
    const images = [
        'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ];
    
    const galleryImage = document.getElementById('gallery-image');
    const prevBtnGallery = document.getElementById('prev-btn');
    const nextBtnGallery = document.getElementById('next-btn');
    let currentImageIndex = 0;
    
    prevBtnGallery.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateGalleryImage();
    });
    
    nextBtnGallery.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateGalleryImage();
    });
    
    function updateGalleryImage() {
        galleryImage.style.opacity = 0;
        setTimeout(() => {
            galleryImage.src = images[currentImageIndex];
            galleryImage.style.opacity = 1;
        }, 300);
    }
    
    // Keypress detection for secret action (Ctrl+Alt+D)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
            showSecretMessage();
        }
    });
    
    // Double click detection for secret action
    const formContainer = document.querySelector('.form-container');
    formContainer.addEventListener('dblclick', function() {
        showSecretMessage();
    });
    
    // Long press detection for secret action
    let pressTimer;
    formContainer.addEventListener('mousedown', function() {
        pressTimer = setTimeout(() => {
            showSecretMessage();
        }, 2000); // 2 seconds for long press
    });
    
    formContainer.addEventListener('mouseup', function() {
        clearTimeout(pressTimer);
    });
    
    formContainer.addEventListener('mouseleave', function() {
        clearTimeout(pressTimer);
    });
    
    function showSecretMessage() {
        const secretMessage = document.getElementById('secret-message');
        secretMessage.classList.toggle('hidden');
        
        // Hide after 5 seconds
        setTimeout(() => {
            secretMessage.classList.add('hidden');
        }, 5000);
    }
    
    // Button color change on hover
    const buttons = document.querySelectorAll('button:not(.tab-btn)');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#c12d4b';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'var(--highlight)';
        });
    });
    
    // Submit button text change on click
    submitBtn.addEventListener('click', function() {
        const originalText = this.textContent;
        this.textContent = 'Processing...';
        
        setTimeout(() => {
            this.textContent = originalText;
        }, 2000);
    });
});
