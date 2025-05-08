/**
 * Customer Service AI Assistant - Analytics JavaScript
 * This file contains functionality for analytics visualizations and data processing
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Analytics module initialized');
    
    // Define chart color palette (dark blue and violet theme)
    const chartColors = {
        primaryColors: [
            'rgba(63, 81, 181, 0.7)',  // Dark Blue
            'rgba(103, 58, 183, 0.7)', // Violet
            'rgba(156, 39, 176, 0.7)', // Purple
            'rgba(83, 91, 242, 0.7)',  // Hover Blue
            'rgba(123, 31, 162, 0.7)', // Deep Purple
            'rgba(74, 20, 140, 0.7)'   // Dark Violet
        ],
        borderColors: [
            'rgba(63, 81, 181, 1)',    // Dark Blue
            'rgba(103, 58, 183, 1)',   // Violet
            'rgba(156, 39, 176, 1)',   // Purple
            'rgba(83, 91, 242, 1)',    // Hover Blue
            'rgba(123, 31, 162, 1)',   // Deep Purple
            'rgba(74, 20, 140, 1)'     // Dark Violet
        ],
        textColor: 'rgba(255, 255, 255, 0.7)',
        gridColor: 'rgba(255, 255, 255, 0.1)',
        successColor: 'rgba(76, 175, 80, 0.7)',
        infoColor: 'rgba(33, 150, 243, 0.7)',
        warningColor: 'rgba(255, 152, 0, 0.7)',
        dangerColor: 'rgba(244, 67, 54, 0.7)'
    };
    
    // Default chart options for dark theme
    const defaultChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: chartColors.textColor
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1
            }
        }
    };
    
    // Line & Bar Chart Default Options
    const axisChartOptions = {
        ...defaultChartOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: chartColors.textColor
                },
                grid: {
                    color: chartColors.gridColor
                }
            },
            x: {
                ticks: {
                    color: chartColors.textColor
                },
                grid: {
                    color: chartColors.gridColor
                }
            }
        }
    };
    
    // Radar Chart Default Options
    const radarChartOptions = {
        ...defaultChartOptions,
        scales: {
            r: {
                beginAtZero: true,
                angleLines: {
                    color: chartColors.gridColor
                },
                grid: {
                    color: chartColors.gridColor
                },
                pointLabels: {
                    color: chartColors.textColor
                },
                ticks: {
                    backdropColor: 'transparent',
                    color: chartColors.textColor
                }
            }
        }
    };
    
    // Pie & Doughnut Chart Default Options
    const pieChartOptions = {
        ...defaultChartOptions
    };
    
    /**
     * Initialize categories chart
     * @param {string} elementId - The ID of the canvas element
     * @param {Array} categories - Categories data
     * @param {Array} counts - Category counts
     */
    function initCategoriesChart(elementId, categories, counts) {
        const ctx = document.getElementById(elementId);
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: counts,
                    backgroundColor: chartColors.primaryColors,
                    borderColor: chartColors.borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                ...pieChartOptions,
                plugins: {
                    ...pieChartOptions.plugins,
                    title: {
                        display: true,
                        text: 'Product Categories by Popularity',
                        color: chartColors.textColor,
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    /**
     * Initialize preferences chart
     * @param {string} elementId - The ID of the canvas element
     * @param {Array} categories - Category names
     * @param {Array} averages - Average preference values
     */
    function initPreferencesChart(elementId, categories, averages) {
        const ctx = document.getElementById(elementId);
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Average Preference Level',
                    data: averages,
                    backgroundColor: 'rgba(103, 58, 183, 0.2)',
                    borderColor: 'rgba(103, 58, 183, 1)',
                    pointBackgroundColor: 'rgba(103, 58, 183, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(103, 58, 183, 1)'
                }]
            },
            options: radarChartOptions
        });
    }
    
    /**
     * Initialize interaction types chart
     * @param {string} elementId - The ID of the canvas element
     * @param {Array} types - Interaction types
     * @param {Array} counts - Interaction counts
     */
    function initInteractionTypesChart(elementId, types, counts) {
        const ctx = document.getElementById(elementId);
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: types,
                datasets: [{
                    data: counts,
                    backgroundColor: chartColors.primaryColors,
                    borderColor: chartColors.borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                ...pieChartOptions,
                plugins: {
                    ...pieChartOptions.plugins,
                    title: {
                        display: true,
                        text: 'Interaction Types Distribution',
                        color: chartColors.textColor,
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    /**
     * Initialize best sellers chart
     * @param {string} elementId - The ID of the canvas element
     * @param {Array} products - Product names
     * @param {Array} counts - Sales counts
     */
    function initBestSellersChart(elementId, products, counts) {
        const ctx = document.getElementById(elementId);
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: products,
                datasets: [{
                    label: 'Number of Sales',
                    data: counts,
                    backgroundColor: chartColors.primaryColors,
                    borderColor: chartColors.borderColors,
                    borderWidth: 1
                }]
            },
            options: axisChartOptions
        });
    }
    
    /**
     * Initialize customer trends chart
     * @param {string} elementId - The ID of the canvas element
     * @param {Array} months - Month labels
     * @param {Array} customers - New customer counts
     * @param {Array} interactions - Interaction counts
     */
    function initCustomerTrendsChart(elementId, months, customers, interactions) {
        const ctx = document.getElementById(elementId);
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'New Customers',
                        data: customers,
                        borderColor: chartColors.primaryColors[0],
                        backgroundColor: 'transparent',
                        tension: 0.4
                    },
                    {
                        label: 'Interactions',
                        data: interactions,
                        borderColor: chartColors.primaryColors[1],
                        backgroundColor: 'transparent',
                        tension: 0.4
                    }
                ]
            },
            options: axisChartOptions
        });
    }
    
    /**
     * Initialize conversion rate chart
     * @param {string} elementId - The ID of the canvas element
     * @param {Array} months - Month labels
     * @param {Array} rates - Conversion rates
     */
    function initConversionRateChart(elementId, months, rates) {
        const ctx = document.getElementById(elementId);
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Conversion Rate (%)',
                    data: rates,
                    borderColor: chartColors.successColor,
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: axisChartOptions
        });
    }
    
    /**
     * Initialize customer satisfaction chart
     * @param {string} elementId - The ID of the canvas element
     * @param {Array} categories - Rating categories
     * @param {Array} ratings - Average ratings
     */
    function initSatisfactionChart(elementId, categories, ratings) {
        const ctx = document.getElementById(elementId);
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Average Rating',
                    data: ratings,
                    backgroundColor: chartColors.infoColor,
                    borderColor: 'rgba(33, 150, 243, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                ...axisChartOptions,
                scales: {
                    ...axisChartOptions.scales,
                    y: {
                        ...axisChartOptions.scales.y,
                        max: 5,
                        ticks: {
                            ...axisChartOptions.scales.y.ticks,
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Format percentage for display
     * @param {number} value - The value to format as percentage
     * @returns {string} Formatted percentage string
     */
    function formatPercentage(value) {
        return `${value.toFixed(1)}%`;
    }
    
    /**
     * Create KPI card
     * @param {string} elementId - The ID of the container element
     * @param {string} title - The KPI title
     * @param {number|string} value - The KPI value
     * @param {string} icon - The icon class (FontAwesome)
     * @param {string} trend - The trend direction (up, down, neutral)
     * @param {number|string} trendValue - The trend value
     */
    function createKpiCard(elementId, title, value, icon, trend = 'neutral', trendValue = '') {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        let trendHtml = '';
        let trendClass = '';
        
        if (trend === 'up') {
            trendHtml = `<i class="fas fa-arrow-up"></i> ${trendValue}`;
            trendClass = 'trend-up';
        } else if (trend === 'down') {
            trendHtml = `<i class="fas fa-arrow-down"></i> ${trendValue}`;
            trendClass = 'trend-down';
        }
        
        const cardHtml = `
            <div class="kpi-card">
                <div class="kpi-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="kpi-content">
                    <h5 class="kpi-title">${title}</h5>
                    <h2 class="kpi-value">${value}</h2>
                    <div class="kpi-trend ${trendClass}">${trendHtml}</div>
                </div>
            </div>
        `;
        
        container.innerHTML = cardHtml;
    }
    
    /**
     * Create a heat map for customer engagement
     * @param {string} elementId - The ID of the container element
     * @param {Array} data - The heatmap data
     */
    function createEngagementHeatmap(elementId, data) {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Create heatmap header
        const header = document.createElement('div');
        header.className = 'heatmap-header';
        
        // Add time slots to header
        for (let i = 9; i <= 17; i++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'heatmap-time-slot';
            timeSlot.textContent = `${i}:00`;
            header.appendChild(timeSlot);
        }
        
        container.appendChild(header);
        
        // Create day rows
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        days.forEach((day, dayIndex) => {
            const row = document.createElement('div');
            row.className = 'heatmap-row';
            
            // Add day label
            const dayLabel = document.createElement('div');
            dayLabel.className = 'heatmap-day';
            dayLabel.textContent = day;
            row.appendChild(dayLabel);
            
            // Add cells
            for (let hour = 9; hour <= 17; hour++) {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                
                // Get engagement level from data (0-4)
                const cellData = data[dayIndex] ? data[dayIndex][hour - 9] || 0 : 0;
                
                // Add appropriate class based on engagement level
                cell.classList.add(`engagement-level-${cellData}`);
                
                // Add tooltip
                cell.setAttribute('data-bs-toggle', 'tooltip');
                cell.setAttribute('data-bs-placement', 'top');
                cell.setAttribute('title', `${day} ${hour}:00 - Engagement: ${cellData}`);
                
                row.appendChild(cell);
            }
            
            container.appendChild(row);
        });
        
        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    /**
     * Create customer journey visualization
     * @param {string} elementId - The ID of the container element
     * @param {Array} stages - The journey stages
     * @param {Array} counts - The count of customers at each stage
     */
    function createCustomerJourney(elementId, stages, counts) {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Create journey container
        const journeyContainer = document.createElement('div');
        journeyContainer.className = 'customer-journey';
        
        // Calculate max value for scaling
        const maxCount = Math.max(...counts);
        
        // Create stage elements
        stages.forEach((stage, index) => {
            // Create stage container
            const stageElement = document.createElement('div');
            stageElement.className = 'journey-stage';
            
            // Create stage visual bar
            const bar = document.createElement('div');
            bar.className = 'journey-bar';
            
            // Set height based on percentage of max
            const heightPercentage = (counts[index] / maxCount) * 100;
            bar.style.height = `${heightPercentage}%`;
            
            // Add count number
            const countElement = document.createElement('div');
            countElement.className = 'journey-count';
            countElement.textContent = counts[index];
            
            // Add label
            const labelElement = document.createElement('div');
            labelElement.className = 'journey-label';
            labelElement.textContent = stage;
            
            // Add arrow if not last stage
            if (index < stages.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'journey-arrow';
                arrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
                stageElement.appendChild(arrow);
            }
            
            // Assemble stage
            stageElement.appendChild(countElement);
            stageElement.appendChild(bar);
            stageElement.appendChild(labelElement);
            
            // Add to journey container
            journeyContainer.appendChild(stageElement);
        });
        
        container.appendChild(journeyContainer);
    }
    
    /**
     * Fetch analytics data from the server
     * @returns {Promise} Promise object representing the analytics data
     */
    async function fetchAnalyticsData() {
        try {
            const response = await fetch('/api/analytics');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            return null;
        }
    }
    
    /**
     * Initialize all analytics charts
     */
    async function initializeCharts() {
        // Try to get data from the API
        let analyticsData;
        
        try {
            analyticsData = await fetchAnalyticsData();
        } catch (error) {
            console.error('Could not load analytics data:', error);
            
            // Show error message
            const chartsError = document.getElementById('chartsError');
            if (chartsError) {
                chartsError.classList.remove('d-none');
            }
            
            return;
        }
        
        if (!analyticsData) return;
        
        // Extract data for charts from the API response
        
        // Categories Chart
        if (document.getElementById('categoriesChart')) {
            const categories = analyticsData.popular_categories.map(item => item.category);
            const categoryCounts = analyticsData.popular_categories.map(item => item.count);
            initCategoriesChart('categoriesChart', categories, categoryCounts);
        }
        
        // Preferences Chart
        if (document.getElementById('preferencesChart')) {
            const prefCategories = analyticsData.preference_data.map(item => item.category);
            const prefAverages = analyticsData.preference_data.map(item => item.average);
            initPreferencesChart('preferencesChart', prefCategories, prefAverages);
        }
        
        // Interaction Types Chart
        if (document.getElementById('interactionTypesChart')) {
            const interactionTypes = analyticsData.interaction_types.map(item => item.type);
            const interactionCounts = analyticsData.interaction_types.map(item => item.count);
            initInteractionTypesChart('interactionTypesChart', interactionTypes, interactionCounts);
        }
        
        // Best Sellers Chart
        if (document.getElementById('bestSellersChart')) {
            const productNames = analyticsData.best_sellers.map(item => item.name);
            const productCounts = analyticsData.best_sellers.map(item => item.count);
            initBestSellersChart('bestSellersChart', productNames, productCounts);
        }
    }
    
    // Initialize charts when the page loads
    initializeCharts();
    
    // Set up refresh button
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', function() {
            // Show loading indicator
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Refreshing...';
            this.disabled = true;
            
            // Reload charts
            initializeCharts().then(() => {
                // Restore button state
                this.innerHTML = '<i class="fas fa-sync-alt me-1"></i> Refresh Data';
                this.disabled = false;
                
                // Show success notification
                showNotification('Analytics data refreshed successfully', 'success');
            }).catch(error => {
                // Restore button state
                this.innerHTML = '<i class="fas fa-sync-alt me-1"></i> Refresh Data';
                this.disabled = false;
                
                // Show error notification
                showNotification('Failed to refresh analytics data', 'error');
            });
        });
    }
    
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
    
    // Export functions for use in other modules
    window.analyticsModule = {
        initCategoriesChart,
        initPreferencesChart,
        initInteractionTypesChart,
        initBestSellersChart,
        initCustomerTrendsChart,
        initConversionRateChart,
        initSatisfactionChart,
        createKpiCard,
        createEngagementHeatmap,
        createCustomerJourney,
        fetchAnalyticsData,
        formatPercentage,
        showNotification
    };
});
