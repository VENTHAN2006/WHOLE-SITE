from flask import render_template, request, redirect, url_for, flash, jsonify, session
from app import app, db
from models import User, Customer, Product, Interaction, CustomerPreference, Promotion, Purchase
from utils.recommendation_engine import get_recommendations
from utils.data_processor import get_customer_analytics
import datetime
import json

# Sample data for initial views
# These would normally come from a database, but added here for demonstration
sample_products = [
    {"id": 1, "name": "Premium Account", "category": "Service", "price": 99.99, "description": "Top tier service with 24/7 support."},
    {"id": 2, "name": "Basic Plan", "category": "Service", "price": 49.99, "description": "Entry level service with basic features."},
    {"id": 3, "name": "Security Package", "category": "Software", "price": 149.99, "description": "Advanced security features for your account."},
    {"id": 4, "name": "Mobile Add-on", "category": "Add-on", "price": 9.99, "description": "Mobile access to all services."},
    {"id": 5, "name": "Business Analytics", "category": "Service", "price": 199.99, "description": "Detailed analytics for your business."},
]

sample_promotions = [
    {"id": 1, "name": "Summer Discount", "discount_percentage": 20, "product_category": "Service", 
     "description": "20% off all services for summer!", "start_date": "2023-06-01", "end_date": "2023-08-31"},
    {"id": 2, "name": "New Customer", "discount_percentage": 15, "product_category": "All", 
     "description": "15% off first purchase for new customers", "start_date": "2023-01-01", "end_date": "2023-12-31"},
    {"id": 3, "name": "Software Bundle", "discount_percentage": 25, "product_category": "Software", 
     "description": "25% off when buying multiple software products", "start_date": "2023-05-01", "end_date": "2023-07-31"},
]

# Initialize database with sample data
def initialize_db():
    # This function will be called when the app starts
    # Check if we already have products in the database
    if Product.query.count() == 0:
        # Add sample products
        for product_data in sample_products:
            product = Product(
                name=product_data["name"],
                description=product_data["description"],
                category=product_data["category"],
                price=product_data["price"]
            )
            db.session.add(product)
        
        # Add sample promotions
        for promo_data in sample_promotions:
            promotion = Promotion(
                name=promo_data["name"],
                description=promo_data["description"],
                discount_percentage=promo_data["discount_percentage"],
                start_date=datetime.datetime.strptime(promo_data["start_date"], "%Y-%m-%d"),
                end_date=datetime.datetime.strptime(promo_data["end_date"], "%Y-%m-%d"),
                product_category=promo_data["product_category"]
            )
            db.session.add(promotion)
        
        # Create a sample agent
        agent = User(
            username="agent1",
            email="agent1@example.com",
            password_hash="$2b$12$tDCfUvdcgCwqVP7Fez2n8eI3JWtgX6F.ZRnJyQn3iKU2RGpx2wrQy"  # password is 'password'
        )
        db.session.add(agent)
        
        # Create some sample customers
        customers = [
            {"first_name": "John", "last_name": "Doe", "email": "john@example.com", "phone": "555-1234"},
            {"first_name": "Jane", "last_name": "Smith", "email": "jane@example.com", "phone": "555-5678"},
            {"first_name": "Bob", "last_name": "Johnson", "email": "bob@example.com", "phone": "555-9012"}
        ]
        
        for customer_data in customers:
            customer = Customer(
                first_name=customer_data["first_name"],
                last_name=customer_data["last_name"],
                email=customer_data["email"],
                phone=customer_data["phone"]
            )
            db.session.add(customer)
        
        db.session.commit()
        
        # Now add some relationships after initial commit
        # Add agent to customers
        agent = User.query.first()
        for customer in Customer.query.all():
            customer.agent_id = agent.id
        
        # Add some preferences
        preferences = [
            {"customer_id": 1, "category": "Software", "preference_level": 4},
            {"customer_id": 1, "category": "Service", "preference_level": 3},
            {"customer_id": 2, "category": "Add-on", "preference_level": 5},
            {"customer_id": 3, "category": "Service", "preference_level": 4}
        ]
        
        for pref_data in preferences:
            pref = CustomerPreference(
                customer_id=pref_data["customer_id"],
                category=pref_data["category"],
                preference_level=pref_data["preference_level"]
            )
            db.session.add(pref)
        
        # Add some interactions
        interactions = [
            {"customer_id": 1, "agent_id": 1, "interaction_type": "call", 
             "notes": "Customer inquired about premium services", 
             "recommendations": "Recommended Premium Account and Security Package"},
            {"customer_id": 2, "agent_id": 1, "interaction_type": "email", 
             "notes": "Customer had billing questions", 
             "recommendations": "Explained billing process and recommended Mobile Add-on"},
            {"customer_id": 3, "agent_id": 1, "interaction_type": "chat", 
             "notes": "Customer needed technical support", 
             "recommendations": "Resolved issue and recommended Security Package"}
        ]
        
        for int_data in interactions:
            interaction = Interaction(
                customer_id=int_data["customer_id"],
                agent_id=int_data["agent_id"],
                interaction_type=int_data["interaction_type"],
                notes=int_data["notes"],
                recommendations=int_data["recommendations"]
            )
            db.session.add(interaction)
        
        # Add some purchases
        purchases = [
            {"customer_id": 1, "product_id": 1, "amount": 99.99},
            {"customer_id": 2, "product_id": 4, "amount": 9.99},
            {"customer_id": 3, "product_id": 2, "amount": 49.99}
        ]
        
        for pur_data in purchases:
            purchase = Purchase(
                customer_id=pur_data["customer_id"],
                product_id=pur_data["product_id"],
                amount=pur_data["amount"]
            )
            db.session.add(purchase)
        
        db.session.commit()

@app.route('/')
def index():
    """Home page with agent dashboard"""
    customers = Customer.query.all()
    products = Product.query.all()
    promotions = Promotion.query.all()
    
    return render_template('index.html', 
                          customers=customers, 
                          products=products, 
                          promotions=promotions)

@app.route('/customer/<int:customer_id>')
def customer_profile(customer_id):
    """Customer profile page"""
    customer = Customer.query.get_or_404(customer_id)
    interactions = Interaction.query.filter_by(customer_id=customer_id).order_by(Interaction.created_at.desc()).all()
    preferences = CustomerPreference.query.filter_by(customer_id=customer_id).all()
    purchases = Purchase.query.filter_by(customer_id=customer_id).all()
    
    # Get product recommendations for this customer
    recommendations = get_recommendations(customer_id)
    
    return render_template('customer_profile.html', 
                          customer=customer, 
                          interactions=interactions,
                          preferences=preferences,
                          purchases=purchases,
                          recommendations=recommendations)

@app.route('/analytics')
def analytics():
    """Analytics dashboard page"""
    customers = Customer.query.all()
    customer_analytics = get_customer_analytics()
    
    return render_template('analytics.html', 
                          customers=customers, 
                          analytics=customer_analytics)

@app.route('/api/recommendations/<int:customer_id>')
def api_recommendations(customer_id):
    """API endpoint to get recommendations for a customer"""
    recommendations = get_recommendations(customer_id)
    return jsonify(recommendations)

@app.route('/api/save_interaction', methods=['POST'])
def save_interaction():
    """API endpoint to save a new customer interaction"""
    data = request.json
    
    interaction = Interaction(
        customer_id=data['customer_id'],
        agent_id=data.get('agent_id', 1),  # Default to first agent for demo
        interaction_type=data['interaction_type'],
        notes=data['notes'],
        recommendations=data['recommendations']
    )
    
    db.session.add(interaction)
    db.session.commit()
    
    return jsonify({"success": True, "interaction_id": interaction.id})

@app.route('/api/analytics')
def api_analytics():
    """API endpoint to get analytics data"""
    analytics = get_customer_analytics()
    return jsonify(analytics)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500
