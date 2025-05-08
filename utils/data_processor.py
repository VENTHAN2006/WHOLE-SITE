from app import db
from models import Customer, Product, Purchase, Interaction, CustomerPreference
from sqlalchemy import func, desc

def get_customer_analytics():
    """
    Generate analytics about customer data, interactions and purchases
    
    Returns:
        dict: Analytics data about customers, products and interactions
    """
    try:
        # Total customers
        total_customers = Customer.query.count()
        
        # Total products sold
        total_products_sold = Purchase.query.count()
        
        # Total interactions
        total_interactions = Interaction.query.count()
        
        # Most popular product categories (based on purchases)
        popular_categories = db.session.query(
            Product.category, 
            func.count(Purchase.id).label('purchase_count')
        ).join(Purchase, Purchase.product_id == Product.id) \
         .group_by(Product.category) \
         .order_by(desc('purchase_count')) \
         .all()
         
        # Customer preferences by category
        preference_data = db.session.query(
            CustomerPreference.category,
            func.avg(CustomerPreference.preference_level).label('avg_preference')
        ).group_by(CustomerPreference.category) \
         .order_by(desc('avg_preference')) \
         .all()
        
        # Most common interaction types
        interaction_types = db.session.query(
            Interaction.interaction_type,
            func.count(Interaction.id).label('count')
        ).group_by(Interaction.interaction_type) \
         .order_by(desc('count')) \
         .all()
        
        # Best selling products
        best_sellers = db.session.query(
            Product.id,
            Product.name,
            func.count(Purchase.id).label('purchase_count')
        ).join(Purchase, Purchase.product_id == Product.id) \
         .group_by(Product.id) \
         .order_by(desc('purchase_count')) \
         .limit(5) \
         .all()
        
        # Format the data for the frontend
        analytics = {
            "total_customers": total_customers,
            "total_products_sold": total_products_sold,
            "total_interactions": total_interactions,
            "popular_categories": [
                {"category": cat, "count": count} 
                for cat, count in popular_categories
            ],
            "preference_data": [
                {"category": cat, "average": float(avg)} 
                for cat, avg in preference_data
            ],
            "interaction_types": [
                {"type": itype, "count": count} 
                for itype, count in interaction_types
            ],
            "best_sellers": [
                {"id": pid, "name": name, "count": count} 
                for pid, name, count in best_sellers
            ]
        }
        
        return analytics
        
    except Exception as e:
        print(f"Error generating analytics: {str(e)}")
        return {
            "total_customers": 0,
            "total_products_sold": 0,
            "total_interactions": 0,
            "popular_categories": [],
            "preference_data": [],
            "interaction_types": [],
            "best_sellers": []
        }

def get_customer_purchases(customer_id):
    """
    Get purchase history for a specific customer
    
    Args:
        customer_id (int): The ID of the customer
        
    Returns:
        list: List of purchase records with product details
    """
    try:
        purchases = db.session.query(
            Purchase, Product
        ).join(Product, Purchase.product_id == Product.id) \
         .filter(Purchase.customer_id == customer_id) \
         .order_by(Purchase.purchase_date.desc()) \
         .all()
        
        return [
            {
                "purchase_id": p.id,
                "product_name": prod.name,
                "product_category": prod.category,
                "amount": p.amount,
                "date": p.purchase_date.strftime('%Y-%m-%d')
            }
            for p, prod in purchases
        ]
    except Exception as e:
        print(f"Error getting customer purchases: {str(e)}")
        return []
