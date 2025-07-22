import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const CampaignForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    start_date: '',
    end_date: '',
    campaign_type: '',
    budget_type: '',
    pacing_strategy: '',
    frequency_cap: '',
    geo_targeting: {
      locations: []
    },
    audience_targeting: {
      segments: []
    },
    inventory_targeting: {
      deals: []
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          frequency_cap: formData.frequency_cap ? parseInt(formData.frequency_cap) : null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const result = await response.json();
      console.log('Campaign created:', result);
      
      // Navigate back to campaign list
      navigate('/');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Create New Campaign</h2>
        <p className="text-gray-600 mt-2">Set up your streaming TV advertising campaign</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Campaign name, budget, and schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter campaign name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="5000"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="frequency_cap">Frequency Cap</Label>
                <Input
                  id="frequency_cap"
                  name="frequency_cap"
                  type="number"
                  value={formData.frequency_cap}
                  onChange={handleInputChange}
                  placeholder="3"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Settings</CardTitle>
            <CardDescription>Configure campaign type and bidding strategy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign_type">Campaign Type</Label>
                <Select onValueChange={(value) => handleSelectChange('campaign_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="display">Display</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget_type">Budget Type</Label>
                <Select onValueChange={(value) => handleSelectChange('budget_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="pacing_strategy">Pacing Strategy</Label>
              <Select onValueChange={(value) => handleSelectChange('pacing_strategy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pacing strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="even">Even</SelectItem>
                  <SelectItem value="accelerated">Accelerated</SelectItem>
                  <SelectItem value="frontloaded">Front-loaded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Targeting (Simplified for now) */}
        <Card>
          <CardHeader>
            <CardTitle>Targeting</CardTitle>
            <CardDescription>Define your audience and inventory preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="geo_notes">Geographic Targeting Notes</Label>
              <Textarea
                id="geo_notes"
                placeholder="Describe your geographic targeting preferences (e.g., 'Target major US cities', 'Focus on California and Texas')"
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="audience_notes">Audience Targeting Notes</Label>
              <Textarea
                id="audience_notes"
                placeholder="Describe your target audience (e.g., 'Adults 25-54 interested in automotive', 'Parents with children under 12')"
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;

