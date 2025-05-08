/**
 * Customer Service AI Assistant - Main JavaScript
 * This file contains common functionality used across the application
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Customer Service AI Assistant Initialized');
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
    
    // Auto-close alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert-auto-close');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
    
    // Theme toggle functionality (if implemented)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            document.body.classList.toggle('dark-theme');
            
            // Save theme preference to localStorage
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
        });
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
                document.body.classList.remove('dark-theme');
            } else {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
            }
        }
    }
    
    // Add animation classes to elements as they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run animation check on page load
    animateOnScroll();
    
    // Run animation check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Handle form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
    
    // Display current date in appropriate elements
    const dateElements = document.querySelectorAll('.current-date');
    if (dateElements.length > 0) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const currentDate = new Date().toLocaleDateString('en-US', options);
        
        dateElements.forEach(element => {
            element.textContent = currentDate;
        });
    }
    
    // Initialize dropdowns
    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });
});

/**
 * Show a notification to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 * @param {number} duration - How long to show the notification in ms
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.role = 'alert';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add notification to container
    container.appendChild(notification);
    
    // Initialize Bootstrap alert
    const alert = new bootstrap.Alert(notification);
    
    // Auto-close after duration
    setTimeout(() => {
        alert.close();
    }, duration);
}

/**
 * Format currency values consistently
 * @param {number} value - The value to format as currency
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value);
}

/**
 * Format date values consistently
 * @param {string|Date} date - The date to format
 * @param {boolean} includeTime - Whether to include the time
 * @returns {string} Formatted date string
 */
function formatDate(date, includeTime = false) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', options);
}

/**
 * Create and return a chart object
 * @param {string} elementId - The ID of the canvas element
 * @param {string} type - The type of chart (bar, line, pie, etc.)
 * @param {Object} data - The data for the chart
 * @param {Object} options - The options for the chart
 * @returns {Chart} Chart object
 */
function createChart(elementId, type, data, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID '${elementId}' not found`);
        return null;
    }
    
    // Default options for dark theme
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            }
        }
    };
    
    // Merge default options with provided options
    const mergedOptions = { ...defaultOptions, ...options };
    
    return new Chart(element, {
        type: type,
        data: data,
        options: mergedOptions
    });
}
