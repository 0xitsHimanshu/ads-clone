// @app/dashboard/ads/page.tsx

"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AdsSection from "../../../components/AdsSection";

export default function AdsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (content: React.ReactNode, title = "Details") => {
    if (content === null) {
      setModalOpen(false);
      return;
    }

    setModalContent(content);
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Ads
        </h1>
        <p className="text-muted-foreground">
          Create and manage your individual ads.
        </p>
      </div>

      <Card className="border-black/10 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-xl font-medium">
            Ad Management
          </CardTitle>
          <CardDescription>
            Create and optimize your advertising content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdsSection openModal={openModal} />
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
