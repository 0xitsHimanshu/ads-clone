// @app/components/AdsGroupSection.tsx

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Eye, MoreHorizontal, Trash, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Campaign {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  status?: string;
}

interface AdGroup {
  _id: string;
  name: string;
  campaignId: Campaign | string;
  keywords: string[];
}

interface AdGroupsSectionProps {
  openModal: (content: React.ReactNode, title?: string) => void;
}

export default function AdGroupsSection({ openModal }: AdGroupsSectionProps) {
  const [adGroups, setAdGroups] = useState<AdGroup[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAdGroup, setEditingAdGroup] = useState<AdGroup | null>(null);
  const [deletingAdGroup, setDeletingAdGroup] = useState<AdGroup | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");
        const [adGroupsRes, campaignsRes] = await Promise.all([
          fetch("/api/ad-groups", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/campaigns", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!adGroupsRes.ok || !campaignsRes.ok)
          throw new Error("Failed to fetch data");
        setAdGroups(await adGroupsRes.json());
        setCampaigns(await campaignsRes.json());
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
    const name = formData.get("name") as string;
    const campaignId = formData.get("campaignId") as string;
    const keywords = (formData.get("keywords") as string)
      .split(",")
      .map((kw) => kw.trim());

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ad-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, campaignId, keywords }),
      });
      if (!response.ok) throw new Error("Failed to create ad group");
      const newAdGroup: AdGroup = await response.json();
      setAdGroups([...adGroups, newAdGroup]);
      openModal(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateAdGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAdGroup) return;
    const formData = new FormData(e.currentTarget);
    const updatedAdGroupData = {
      name: formData.get("name") as string,
      campaignId: formData.get("campaignId") as string,
      keywords: (formData.get("keywords") as string)
        .split(",")
        .map((kw) => kw.trim()),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/ad-groups/${editingAdGroup._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAdGroupData),
      });
      if (!response.ok) throw new Error("Failed to update ad group");
      const updatedAdGroup: AdGroup = await response.json();
      setAdGroups(
        adGroups.map((ag) =>
          ag._id === updatedAdGroup._id ? updatedAdGroup : ag
        )
      );
      setEditingAdGroup(null);
      openModal(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteAdGroup = (adGroup: AdGroup) => {
    setDeletingAdGroup(adGroup);
    openModal(
      <div className="py-4">
        <p>Are you sure you want to delete this ad group?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => openModal(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDeleteAdGroup}>
            Delete
          </Button>
        </div>
      </div>,
      "Confirm Deletion"
    );
  };

  const confirmDeleteAdGroup = async () => {
    if (!deletingAdGroup) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/ad-groups/${deletingAdGroup._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete ad group");
      setAdGroups(adGroups.filter((ag) => ag._id !== deletingAdGroup._id));
      setDeletingAdGroup(null);
      openModal(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleViewAdGroup = (adGroup: AdGroup) => {
    const campaignName =
      typeof adGroup.campaignId === "string"
        ? campaigns.find((c) => c._id === adGroup.campaignId)?.name ||
          adGroup.campaignId
        : adGroup.campaignId.name;

    openModal(
      <div className="py-4">
        <h3 className="font-medium mb-2">Ad Group Details</h3>
        <p className="mb-1">
          <span className="text-muted-foreground">Name:</span> {adGroup.name}
        </p>
        <p className="mb-1">
          <span className="text-muted-foreground">Campaign:</span>{" "}
          {campaignName}
        </p>
        <div className="mb-1">
          <span className="text-muted-foreground block mb-2">Keywords:</span>
          <div className="flex flex-wrap gap-2">
            {adGroup.keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded-none border-black/20 bg-muted/20"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>,
      adGroup.name
    );
  };

  const openCreateAdGroupModal = () => {
    openModal(
      <form onSubmit={handleCreateAdGroup} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Group Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter ad group name"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="campaignId">Campaign</Label>
          <select
            id="campaignId"
            name="campaignId"
            className="flex h-10 w-full rounded-none border border-black/20 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select Campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign._id} value={campaign._id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords (comma-separated)</Label>
          <Input
            id="keywords"
            name="keywords"
            placeholder="e.g. marketing, digital ads, promotion"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full rounded-none bg-black text-white hover:bg-black/90"
          >
            Create Ad Group
          </Button>
        </div>
      </form>,
      "Create New Ad Group"
    );
  };

  const openEditAdGroupModal = (adGroup: AdGroup) => {
    setEditingAdGroup(adGroup);
    openModal(
      <form onSubmit={handleUpdateAdGroup} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Group Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={adGroup.name}
            placeholder="Enter ad group name"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="campaignId">Campaign</Label>
          <select
            id="campaignId"
            name="campaignId"
            defaultValue={
              typeof adGroup.campaignId === "string"
                ? adGroup.campaignId
                : adGroup.campaignId._id
            }
            className="flex h-10 w-full rounded-none border border-black/20 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select Campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign._id} value={campaign._id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords (comma-separated)</Label>
          <Input
            id="keywords"
            name="keywords"
            defaultValue={adGroup.keywords.join(", ")}
            placeholder="e.g. marketing, digital ads, promotion"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full rounded-none bg-black text-white hover:bg-black/90"
          >
            Update Ad Group
          </Button>
        </div>
      </form>,
      "Edit Ad Group"
    );
  };

  const getCampaignName = (adGroup: AdGroup) => {
    if (typeof adGroup.campaignId === "string") {
      const campaign = campaigns.find((c) => c._id === adGroup.campaignId);
      return campaign ? campaign.name : "Unknown Campaign";
    }
    return adGroup.campaignId.name;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="destructive"
        className="rounded-none border-red-500/50 bg-red-50 text-red-900"
      >
        <AlertDescription>Error: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-xl font-medium">Ad Groups</h2>
        <Button
          onClick={openCreateAdGroupModal}
          className="rounded-none bg-black text-white hover:bg-black/90"
        >
          Create Ad Group
        </Button>
      </div>
      <Separator className="my-4" />
      {adGroups.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="border-black/10">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Campaign</TableHead>
              <TableHead className="font-medium">Keywords</TableHead>
              <TableHead className="font-medium w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adGroups.map((adGroup) => (
              <TableRow key={adGroup._id} className="border-black/10">
                <TableCell className="font-medium">{adGroup.name}</TableCell>
                <TableCell>{getCampaignName(adGroup)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {adGroup.keywords.slice(0, 3).map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="rounded-none border-black/20 bg-muted/20"
                      >
                        {keyword}
                      </Badge>
                    ))}
                    {adGroup.keywords.length > 3 && (
                      <Badge
                        variant="outline"
                        className="rounded-none border-black/20 bg-muted/20"
                      >
                        +{adGroup.keywords.length - 3} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-none border-black/10"
                    >
                      <DropdownMenuItem
                        onClick={() => handleViewAdGroup(adGroup)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openEditAdGroupModal(adGroup)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteAdGroup(adGroup)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-12 border border-dashed border-black/10 rounded-sm bg-muted/20">
          <p className="text-muted-foreground">No ad groups found.</p>
          <Button
            onClick={openCreateAdGroupModal}
            variant="outline"
            className="mt-4 rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
          >
            Create your first ad group
          </Button>
        </div>
      )}
    </div>
  );
}
