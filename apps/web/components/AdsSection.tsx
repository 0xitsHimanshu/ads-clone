// apps/web/components/AdsSection.tsx
import { useState, useEffect } from 'react';

interface Ad {
  _id: string;
  title: string;
  description: string;
  targetUrl: string;
  maxCpc: number;
  adGroupId: string;
  impressions: number;
  clicks: number;
}

interface AdGroup {
  _id: string;
  name: string;
}

interface AdsSectionProps {
  openModal: (content: React.ReactNode) => void;
}

export default function AdsSection({ openModal }: AdsSectionProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [adGroups, setAdGroups] = useState<AdGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');
        const [adsRes, adGroupsRes] = await Promise.all([
          fetch('/api/ads', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/ad-groups', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!adsRes.ok || !adGroupsRes.ok) throw new Error('Failed to fetch data');
        setAds(await adsRes.json());
        setAdGroups(await adGroupsRes.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateAd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const adData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      targetUrl: formData.get('targetUrl') as string,
      maxCpc: Number(formData.get('maxCpc')),
      adGroupId: formData.get('adGroupId') as string,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adData),
      });
      if (!response.ok) throw new Error('Failed to create ad');
      const newAd: Ad = await response.json();
      setAds([...ads, newAd]);
      openModal(null); // Close modal
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading ads...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Ads</h2>
      {ads.length > 0 ? (
        <ul>
          {ads.map((ad) => (
            <li key={ad._id} className="mb-2">
              {ad.title} - {ad.description} (Ad Group ID: {ad.adGroupId}, Max CPC: ${ad.maxCpc})
            </li>
          ))}
        </ul>
      ) : (
        <p>No ads found.</p>
      )}
      <button
        onClick={() =>
          openModal(
            <form onSubmit={handleCreateAd} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Ad Title"
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Ad Description"
                className="border p-2 w-full"
                required
              />
              <input
                type="url"
                name="targetUrl"
                placeholder="Target URL"
                className="border p-2 w-full"
                required
              />
              <input
                type="number"
                name="maxCpc"
                placeholder="Max CPC"
                step="0.01"
                className="border p-2 w-full"
                required
              />
              <select name="adGroupId" className="border p-2 w-full" required>
                <option value="">Select Ad Group</option>
                {adGroups.map((adGroup) => (
                  <option key={adGroup._id} value={adGroup._id}>
                    {adGroup.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Create Ad
              </button>
            </form>,
          )
        }
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
      >
        Create Ad
      </button>
    </div>
  );
}