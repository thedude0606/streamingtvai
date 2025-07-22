import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/campaigns');
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'draft':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading campaigns...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Your Campaigns</h2>
        <Button onClick={fetchCampaigns}>Refresh</Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
              <p className="text-gray-600 mb-4">Create your first streaming TV campaign to get started.</p>
              <Button>Create Campaign</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
                <CardDescription>
                  Campaign ID: {campaign.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {campaign.budget && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Budget:</span>
                      <span className="text-sm font-medium">${campaign.budget.toLocaleString()}</span>
                    </div>
                  )}
                  {campaign.start_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <span className="text-sm">{new Date(campaign.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {campaign.end_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">End Date:</span>
                      <span className="text-sm">{new Date(campaign.end_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {campaign.dsp_campaign_id && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">DSP ID:</span>
                      <span className="text-sm font-mono text-xs">{campaign.dsp_campaign_id}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignList;

