from flask import Blueprint, request, jsonify
import uuid
import json
from datetime import datetime
from src.models.campaign import Campaign
from src.models.user import db
from src.services.dsp_service import DSPService

campaign_bp = Blueprint('campaign', __name__)
dsp_service = DSPService()

@campaign_bp.route('/campaigns', methods=['POST'])
def create_campaign():
    try:
        data = request.get_json()
        
        # Generate unique campaign ID
        campaign_id = str(uuid.uuid4())
        
        # Create campaign in our database first
        campaign = Campaign(
            id=campaign_id,
            name=data.get('name', 'Untitled Campaign'),
            status='Draft',
            budget=data.get('budget'),
            start_date=datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
            end_date=datetime.fromisoformat(data['end_date']) if data.get('end_date') else None,
            campaign_type=data.get('campaign_type'),
            budget_type=data.get('budget_type'),
            pacing_strategy=data.get('pacing_strategy'),
            frequency_cap=data.get('frequency_cap'),
            geo_targeting=json.dumps(data.get('geo_targeting', {})),
            audience_targeting=json.dumps(data.get('audience_targeting', {})),
            inventory_targeting=json.dumps(data.get('inventory_targeting', {}))
        )
        
        db.session.add(campaign)
        db.session.commit()
        
        # Create campaign in Amazon DSP (simulated for now)
        dsp_response = dsp_service.create_campaign(data)
        
        # Update campaign with DSP campaign ID
        campaign.dsp_campaign_id = dsp_response.get('campaignId')
        campaign.status = 'Active' if dsp_response.get('status') == 'ACTIVE' else 'Draft'
        db.session.commit()
        
        return jsonify({
            "message": "Campaign created successfully",
            "campaign": campaign.to_dict(),
            "dsp_response": dsp_response
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@campaign_bp.route('/campaigns', methods=['GET'])
def get_campaigns():
    try:
        # Get campaigns from our database
        campaigns = Campaign.query.all()
        campaigns_data = [campaign.to_dict() for campaign in campaigns]
        
        # Optionally sync with DSP campaigns (for demonstration)
        dsp_campaigns = dsp_service.get_campaigns()
        
        return jsonify({
            "campaigns": campaigns_data,
            "dsp_campaigns": dsp_campaigns
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@campaign_bp.route('/campaigns/<campaign_id>', methods=['GET'])
def get_campaign(campaign_id):
    try:
        campaign = Campaign.query.get_or_404(campaign_id)
        
        # Get performance data from DSP if campaign is active
        performance_data = None
        if campaign.dsp_campaign_id:
            performance_data = dsp_service.get_campaign_performance(campaign.dsp_campaign_id)
        
        return jsonify({
            "campaign": campaign.to_dict(),
            "performance": performance_data
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@campaign_bp.route('/campaigns/<campaign_id>', methods=['PUT'])
def update_campaign(campaign_id):
    try:
        campaign = Campaign.query.get_or_404(campaign_id)
        data = request.get_json()
        
        # Update campaign in our database
        if 'name' in data:
            campaign.name = data['name']
        if 'budget' in data:
            campaign.budget = data['budget']
        if 'start_date' in data:
            campaign.start_date = datetime.fromisoformat(data['start_date'])
        if 'end_date' in data:
            campaign.end_date = datetime.fromisoformat(data['end_date'])
        if 'status' in data:
            campaign.status = data['status']
        
        campaign.updated_at = datetime.utcnow()
        
        # Update campaign in DSP if it exists
        dsp_response = None
        if campaign.dsp_campaign_id:
            dsp_response = dsp_service.update_campaign(campaign.dsp_campaign_id, data)
        
        db.session.commit()
        
        return jsonify({
            "message": "Campaign updated successfully",
            "campaign": campaign.to_dict(),
            "dsp_response": dsp_response
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


