from app import db
from models import Customer, Product, CustomerPreference, Purchase, Promotion
import datetime

def get_recommendations(customer_id):
    """
    Generate product recommendations for a specific customer based on
    their preferences, purchase history, and available promotions.
    
    Args:
        customer_id (int): The ID of the customer to generate recommendations for
        
    Returns:
        list: A list of recommendation dictionaries containing product and promotion info
    """
    try:
        # Get customer data
        customer = Customer.query.get(customer_id)
        if not customer:
            return []
        
        # Get customer preferences
        preferences = CustomerPreference.query.filter_by(customer_id=customer_id).all()
        preferred_categories = {p.category: p.preference_level for p in preferences}
        
        # Get previous purchases
        purchases = Purchase.query.filter_by(customer_id=customer_id).all()
        purchased_product_ids = [p.product_id for p in purchases]
        
        # Get current promotions
        current_date = datetime.datetime.now()
        active_promotions = Promotion.query.filter(
            Promotion.start_date <= current_date,
            Promotion.end_date >= current_date
        ).all()
        
        # Get all products
        all_products = Product.query.all()
        
        # Generate recommendations
        recommendations = []
        
        for product in all_products:
            # Skip products the customer has already purchased
            if product.id in purchased_product_ids:
                continue
                
            # Calculate a recommendation score based on preferences
            score = 1  # Base score
            
            # Check if the product category is in the customer's preferences
            if product.category in preferred_categories:
                score += preferred_categories[product.category]
            
            # Check if there's an active promotion for this product
            applicable_promotions = []
            for promotion in active_promotions:
                if promotion.product_category == product.category or promotion.product_category == "All":
                    applicable_promotions.append({
                        "id": promotion.id,
                        "name": promotion.name,
                        "description": promotion.description,
                        "discount_percentage": promotion.discount_percentage,
                        "discounted_price": round(product.price * (1 - promotion.discount_percentage / 100), 2)
                    })
                    # Boost score for products with promotions
                    score += 1
            
            # Only include products that meet a minimum score threshold
            if score >= 2:
                recommendations.append({
                    "product_id": product.id,
                    "name": product.name,
                    "category": product.category,
                    "description": product.description,
                    "price": product.price,
                    "score": score,
                    "promotions": applicable_promotions
                })
        
        # Sort recommendations by score (highest first)
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        
        # Return top 5 recommendations
        return recommendations[:5]
        
    except Exception as e:
        print(f"Error generating recommendations: {str(e)}")
        return []

def get_product_recommendations_by_category(category):
    """
    Get product recommendations based on category
    
    Args:
        category (str): Product category to filter by
        
    Returns:
        list: List of products in the specified category
    """
    try:
        products = Product.query.filter_by(category=category).all()
        return [
            {
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "description": p.description,
                "price": p.price
            }
            for p in products
        ]
    except Exception as e:
        print(f"Error getting products by category: {str(e)}")
        return []
