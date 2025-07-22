from src.models.user import db
from datetime import datetime

class Campaign(db.Model):
    __tablename__ = 'campaigns'
    
    id = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Draft')
    budget = db.Column(db.Float, nullable=True)
    start_date = db.Column(db.DateTime, nullable=True)
    end_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Amazon DSP specific fields
    dsp_campaign_id = db.Column(db.String(100), nullable=True)
    campaign_type = db.Column(db.String(50), nullable=True)
    budget_type = db.Column(db.String(50), nullable=True)
    pacing_strategy = db.Column(db.String(50), nullable=True)
    frequency_cap = db.Column(db.Integer, nullable=True)
    
    # Targeting information (stored as JSON strings for flexibility)
    geo_targeting = db.Column(db.Text, nullable=True)  # JSON string
    audience_targeting = db.Column(db.Text, nullable=True)  # JSON string
    inventory_targeting = db.Column(db.Text, nullable=True)  # JSON string
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'status': self.status,
            'budget': self.budget,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'dsp_campaign_id': self.dsp_campaign_id,
            'campaign_type': self.campaign_type,
            'budget_type': self.budget_type,
            'pacing_strategy': self.pacing_strategy,
            'frequency_cap': self.frequency_cap,
            'geo_targeting': self.geo_targeting,
            'audience_targeting': self.audience_targeting,
            'inventory_targeting': self.inventory_targeting
        }

