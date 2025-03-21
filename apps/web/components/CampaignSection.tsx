// apps/web/components/CampaignsSection.tsx
import { useState, useEffect } from 'react';

interface Campaign {
  _id: string;
  name: string;
  budget: number;
}

interface CampaignsSectionProps {
  openModal: (content: React.ReactNode) => void;
}

export default function CampaignsSection({ openModal }: CampaignsSectionProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');
        const response = await fetch('/api/campaigns', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch campaigns');
        const data: Campaign[] = await response.json();
        setCampaigns(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const budget = Number(formData.get('budget'));
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, budget , startDate, endDate}),
      });
      if (!response.ok) throw new Error('Failed to create campaign');
      const newCampaign: Campaign = await response.json();
      setCampaigns([...campaigns, newCampaign]);
      openModal(null); // Close modal
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Campaigns</h2>
      {campaigns.length > 0 ? (
        <ul>
          {campaigns.map((campaign) => (
            <li key={campaign._id} className="mb-2">
              {campaign.name} - Budget: ${campaign.budget}
            </li>
          ))}
        </ul>
      ) : (
        <p>No campaigns found.</p>
      )}
      <button
        onClick={() =>
          openModal(
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Campaign Name"
                className="border p-2 w-full"
                required
              />
              <input
                type="number"
                name="budget"
                placeholder="Budget"
                className="border p-2 w-full"
                required
              />
              <input
                type="date"
                name="startDate"
                placeholder="Start Date"
                className="border p-2 w-full"
                required
              />
              <input
                type="date"
                name="endDate"
                placeholder="End Date"
                className="border p-2 w-full"
                required
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Create Campaign
              </button>
            </form>,
          )
        }
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
      >
        Create Campaign
      </button>
    </div>
  );
}