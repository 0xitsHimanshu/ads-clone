// apps/web/components/AdGroupsSection.tsx
import { useState, useEffect } from 'react';

interface Campaign {
  _id: string; // or '_id' depending on your preference
  name: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  status?: string;
}

interface AdGroup {
  _id: string; // or '_id'
  name: string;
  campaignId: Campaign | string; // Allow campaignId to be either an object or a string
  keywords?: string[];
}

interface AdGroupsSectionProps {
  openModal: (content: React.ReactNode) => void;
}

export default function AdGroupsSection({ openModal }: AdGroupsSectionProps) {
  const [adGroups, setAdGroups] = useState<AdGroup[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        const [adGroupsRes, campaignsRes] = await Promise.all([
          fetch('/api/ad-groups', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/campaigns', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!adGroupsRes.ok || !campaignsRes.ok) throw new Error('Failed to fetch data');

        const adGroupsData = await adGroupsRes.json();
        const campaignsData = await campaignsRes.json();

        // Normalize adGroups to always be an array
        setAdGroups(Array.isArray(adGroupsData) ? adGroupsData : [adGroupsData]);
        setCampaigns(campaignsData);

        console.log('Ad Groups Data:', adGroupsData);
        console.log('Campaigns Data:', campaignsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateAdGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const campaignId = formData.get('campaignId') as string;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ad-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, campaignId }),
      });
      if (!response.ok) throw new Error('Failed to create ad group');
      const newAdGroup: AdGroup = await response.json();
      setAdGroups([...adGroups, newAdGroup]);
      openModal(null); // Close modal
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading ad groups...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Ad Groups</h2>
      {adGroups.length > 0 ? (
        <ul>
          {adGroups.map((adGroup) => (
            <li key={adGroup._id} className="mb-2">
              {adGroup.name} (Campaign: {typeof adGroup.campaignId === 'string' ? adGroup.campaignId : adGroup.campaignId.name})
            </li>
          ))}
        </ul>
      ) : (
        <p>No ad groups found.</p>
      )}
      <button
        onClick={() =>
          openModal(
            <form onSubmit={handleCreateAdGroup} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Ad Group Name"
                className="border p-2 w-full"
                required
              />
              <select name="campaignId" className="border p-2 w-full" required>
                <option value="">Select Campaign</option>
                {campaigns.map((campaign) => (
                  <option key={campaign._id} value={campaign._id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Create Ad Group
              </button>
            </form>,
          )
        }
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
      >
        Create Ad Group
      </button>
    </div>
  );
}