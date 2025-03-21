// apps/web/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import CampaignsSection from '../../components/CampaignSection';
import AdGroupsSection from '../../components/AdsGroupSection';
import AdsSection from '../../components/AdsSection';
import Modal from '../../components/Modal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`p-2 ${activeTab === 'campaigns' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Campaigns
        </button>
        <button
          onClick={() => setActiveTab('ad-groups')}
          className={`p-2 ${activeTab === 'ad-groups' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Ad Groups
        </button>
        <button
          onClick={() => setActiveTab('ads')}
          className={`p-2 ${activeTab === 'ads' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Ads
        </button>
      </div>
      {activeTab === 'campaigns' && <CampaignsSection openModal={openModal} />}
      {activeTab === 'ad-groups' && <AdGroupsSection openModal={openModal} />}
      {activeTab === 'ads' && <AdsSection openModal={openModal} />}
      {modalOpen && <Modal onClose={() => setModalOpen(false)}>{modalContent}</Modal>}
    </div>
  );
}