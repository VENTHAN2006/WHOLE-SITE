from datetime import datetime
from app import db
from flask_login import UserMixin


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    role = db.Column(db.String(20), default='agent')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    customers = db.relationship('Customer', backref='agent', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.username}>'


class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    agent_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    interactions = db.relationship('Interaction', backref='customer', lazy='dynamic')
    preferences = db.relationship('CustomerPreference', backref='customer', lazy='dynamic')
    purchases = db.relationship('Purchase', backref='customer', lazy='dynamic')
    
    def __repr__(self):
        return f'<Customer {self.first_name} {self.last_name}>'
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(64))
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    purchases = db.relationship('Purchase', backref='product', lazy='dynamic')
    
    def __repr__(self):
        return f'<Product {self.name}>'


class CustomerPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    category = db.Column(db.String(64), nullable=False)
    preference_level = db.Column(db.Integer, default=1)  # 1-5 scale
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<CustomerPreference {self.category} {self.preference_level}>'


class Interaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    agent_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    interaction_type = db.Column(db.String(64))  # call, email, chat, etc.
    notes = db.Column(db.Text)
    recommendations = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    agent = db.relationship('User', backref='interactions')
    
    def __repr__(self):
        return f'<Interaction {self.id} {self.interaction_type}>'


class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False)
    
    def __repr__(self):
        return f'<Purchase {self.id} {self.amount}>'


class Promotion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    discount_percentage = db.Column(db.Float)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    product_category = db.Column(db.String(64))
    
    def __repr__(self):
        return f'<Promotion {self.name}>'
