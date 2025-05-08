/**
 * Customer Service AI Assistant - Recommendations JavaScript
 * This file contains functionality for the recommendation engine
 */

/**
 * Fetch product recommendations for a customer
 * @param {number} customerId - The ID of the customer
 * @returns {Promise} Promise object represents the recommendations
 */
async function fetchRecommendations(customerId) {
    try {
        const response = await fetch(`/api/recommendations/${customerId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
}

/**
 * Display product recommendations in the specified container
 * @param {number} customerId - The ID of the customer
 * @param {string} containerId - The ID of the container element
 */
async function displayRecommendations(customerId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found`);
        return;
    }
    
    // Show loading indicator
    container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    
    try {
        const recommendations = await fetchRecommendations(customerId);
        
        if (recommendations.length === 0) {
            container.innerHTML = '<p class="text-muted text-center py-3">No recommendations available for this customer.</p>';
            return;
        }
        
        let html = '';
        
        recommendations.forEach(rec => {
            let promotionsHtml = '';
            
            if (rec.promotions && rec.promotions.length > 0) {
                rec.promotions.forEach(promo => {
                    promotionsHtml += `
                        <div class="recommendation-promotion">
                            <span class="badge bg-success">${promo.name}: ${promo.discount_percentage}% OFF</span>
                            <span class="price-display">
                                <span class="original-price">$${rec.price}</span>
                                <span class="discounted-price">$${promo.discounted_price}</span>
                            </span>
                        </div>
                    `;
                });
            } else {
                promotionsHtml = `<span class="price-display">$${rec.price}</span>`;
            }
            
            html += `
                <div class="recommendation-item">
                    <div class="recommendation-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="recommendation-details">
                        <h6>${rec.name}</h6>
                        <p>${rec.description}</p>
                        ${promotionsHtml}
                    </div>
                    <div class="recommendation-actions">
                        <button class="btn btn-sm btn-primary recommend-btn" data-product-id="${rec.product_id}">
                            <i class="fas fa-thumbs-up me-1"></i> Recommend
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Add event listeners to recommend buttons
        const recommendBtns = container.querySelectorAll('.recommend-btn');
        recommendBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                const productName = this.closest('.recommendation-item').querySelector('h6').textContent;
                recommendProduct(customerId, productId, productName);
            });
        });
        
    } catch (error) {
        console.error('Error displaying recommendations:', error);
        container.innerHTML = '<p class="text-danger text-center py-3">Error loading recommendations. Please try again later.</p>';
    }
}

/**
 * Recommend a product to a customer
 * @param {number} customerId - The ID of the customer
 * @param {number} productId - The ID of the product
 * @param {string} productName - The name of the product
 */
function recommendProduct(customerId, productId, productName) {
    // In a real application, this would record the recommendation
    // and potentially open an interaction form
    
    // For demonstration, we'll just show a notification
    showNotification(`Product "${productName}" has been recommended to the customer.`, 'success');
    
    // If there's a new interaction modal on the page, open it with pre-filled data
    const interactionModal = document.getElementById('newInteractionModal');
    if (interactionModal) {
        const bsModal = new bootstrap.Modal(interactionModal);
        
        // Pre-fill the form
        document.getElementById('interactionType').value = 'call';
        document.getElementById('interactionNotes').value = 'Discussed product recommendations with customer.';
        document.getElementById('interactionRecommendations').value = `Recommended ${productName} based on customer preferences and AI suggestions.`;
        
        bsModal.show();
    }
}

/**
 * Save a new customer interaction
 * @param {Object} interactionData - The interaction data
 * @returns {Promise} Promise object represents the save operation
 */
async function saveInteraction(interactionData) {
    try {
        const response = await fetch('/api/save_interaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(interactionData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving interaction:', error);
        throw error;
    }
}

/**
 * Submit interaction form data
 * @param {HTMLFormElement} form - The form element
 */
function submitInteractionForm(form) {
    const customerId = form.querySelector('#customerId').value;
    const interactionType = form.querySelector('#interactionType').value;
    const notes = form.querySelector('#interactionNotes').value;
    const recommendations = form.querySelector('#interactionRecommendations').value;
    
    // Validate form
    if (!interactionType || !notes) {
        showNotification('Please fill out all required fields', 'warning');
        return;
    }
    
    const interactionData = {
        customer_id: parseInt(customerId),
        interaction_type: interactionType,
        notes: notes,
        recommendations: recommendations
    };
    
    // Save interaction
    saveInteraction(interactionData)
        .then(result => {
            if (result.success) {
                showNotification('Interaction saved successfully!', 'success');
                
                // Close modal if it exists
                const modal = bootstrap.Modal.getInstance(document.getElementById('newInteractionModal'));
                if (modal) {
                    modal.hide();
                }
                
                // Reload page after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showNotification('Error saving interaction', 'error');
            }
        })
        .catch(error => {
            showNotification('Error: ' + error.message, 'error');
        });
}

// Initialize recommendation handlers when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup interaction form submission
    const interactionForm = document.getElementById('interactionForm');
    const saveInteractionBtn = document.getElementById('saveInteractionBtn');
    
    if (interactionForm && saveInteractionBtn) {
        saveInteractionBtn.addEventListener('click', function() {
            submitInteractionForm(interactionForm);
        });
    }
    
    // Setup suggestion buttons
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const recommendation = this.getAttribute('data-recommendation');
            const recommendationsTextarea = document.getElementById('interactionRecommendations');
            
            if (recommendationsTextarea) {
                const currentText = recommendationsTextarea.value;
                if (currentText) {
                    recommendationsTextarea.value = currentText + "\n" + recommendation;
                } else {
                    recommendationsTextarea.value = recommendation;
                }
            }
        });
    });
});
