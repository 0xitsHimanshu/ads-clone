//@app/dashboard/page.tsx
"use client";

import type React from "react";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CampaignsSection from "../../components/CampaignSection";
import AdGroupsSection from "../../components/AdsGroupSection";
import AdsSection from "../../components/AdsSection";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (content: React.ReactNode, title = "Details") => {
    setModalContent(content);
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl font-medium tracking-tight">
          Campaign Management
        </h2>
        <Button
          variant="outline"
          className="rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
          onClick={() =>
            openModal(
              <div>Create new campaign form would go here</div>,
              "Create Campaign"
            )
          }
        >
          Create New
        </Button>
      </div>

      <Card className="border-black/10 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-xl font-medium">
            Performance Overview
          </CardTitle>
          <CardDescription>
            Manage your advertising campaigns, ad groups, and ads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="campaigns"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6 rounded-none border-b border-black/10 bg-transparent p-0">
              <TabsTrigger
                value="campaigns"
                className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Campaigns
              </TabsTrigger>
              <TabsTrigger
                value="ad-groups"
                className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Ad Groups
              </TabsTrigger>
              <TabsTrigger
                value="ads"
                className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Ads
              </TabsTrigger>
            </TabsList>
            <TabsContent value="campaigns">
              <CampaignsSection openModal={openModal} />
            </TabsContent>
            <TabsContent value="ad-groups">
              <AdGroupsSection openModal={openModal} />
            </TabsContent>
            <TabsContent value="ads">
              <AdsSection openModal={openModal} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-none border-black/10">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-medium">
              {modalTitle}
            </DialogTitle>
            <DialogDescription>
              View and manage the details below.
            </DialogDescription>
          </DialogHeader>
          {modalContent}
        </DialogContent>
      </Dialog>
    </div>
  );
}
