// @app/components/AdsSection.tsx

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
import {
  Edit,
  Eye,
  MoreHorizontal,
  Trash,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface AdGroup {
  _id: string;
  name: string;
  campaignId: string; // Or a Campaign type if applicable
  keywords: string[];
}

interface Ad {
  _id: string;
  title: string;
  description: string;
  targetUrl: string;
  maxCpc: number;
  adGroupId: string | AdGroup; // Can be a string (ID) or a populated object
  impressions: number;
  clicks: number;
}

interface AdsSectionProps {
  openModal: (content: React.ReactNode, title?: string) => void;
}

export default function AdsSection({ openModal }: AdsSectionProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [adGroups, setAdGroups] = useState<AdGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [deletingAd, setDeletingAd] = useState<Ad | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");
        const [adsRes, adGroupsRes] = await Promise.all([
          fetch("/api/ads", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/ad-groups", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!adsRes.ok || !adGroupsRes.ok)
          throw new Error("Failed to fetch data");
        const adsData = await adsRes.json();
        setAds(adsData);
        setAdGroups(await adGroupsRes.json());
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const trackImpression = async (adId: string) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/ads/${adId}/impression`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const trackClick = async (adId: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/ads/${adId}/click`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const updatedAd = await response.json();
      setAds(ads.map((ad) => (ad._id === adId ? updatedAd : ad)));
    }
  };

  const handleCreateAd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const adData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      targetUrl: formData.get("targetUrl") as string,
      maxCpc: Number(formData.get("maxCpc")),
      adGroupId: formData.get("adGroupId") as string,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adData),
      });
      if (!response.ok) throw new Error("Failed to create ad");
      const newAd: Ad = await response.json();
      setAds([...ads, newAd]);
      openModal(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleViewAd = (ad: Ad) => {
    const adGroupName =
      typeof ad.adGroupId === "string"
        ? adGroups.find((g) => g._id === ad.adGroupId)?.name || ad.adGroupId
        : ad.adGroupId.name;

    openModal(
      <div className="py-4">
        <h3 className="font-medium mb-2">Ad Details</h3>
        <p className="mb-1">
          <span className="text-muted-foreground">Title:</span> {ad.title}
        </p>
        <p className="mb-1">
          <span className="text-muted-foreground">Description:</span>{" "}
          {ad.description}
        </p>
        <p className="mb-1">
          <span className="text-muted-foreground">Target URL:</span>{" "}
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center"
            onClick={() => trackClick(ad._id)}
          >
            {ad.targetUrl.length > 30
              ? ad.targetUrl.substring(0, 30) + "..."
              : ad.targetUrl}
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </p>
        <p className="mb-1">
          <span className="text-muted-foreground">Ad Group:</span> {adGroupName}
        </p>
        <p className="mb-1">
          <span className="text-muted-foreground">Max CPC:</span> $
          {ad.maxCpc.toFixed(2)}
        </p>
        <p className="mb-1">
          <span className="text-muted-foreground">Impressions:</span>{" "}
          {ad.impressions}
        </p>
        <p className="mb-1">
          <span className="text-muted-foreground">Clicks:</span> {ad.clicks}
        </p>
        <p className="mb-1">
          <span className="text-muted-foreground">CTR:</span>{" "}
          {ad.impressions > 0
            ? ((ad.clicks / ad.impressions) * 100).toFixed(2)
            : 0}
          %
        </p>
      </div>,
      ad.title
    );
  };

  const handleEditAd = (ad: Ad) => {
    setEditingAd(ad);
    openModal(
      <form onSubmit={handleUpdateAd} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Ad Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={ad.title}
            placeholder="Enter ad title"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Ad Description</Label>
          <Input
            id="description"
            name="description"
            defaultValue={ad.description}
            placeholder="Enter ad description"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetUrl">Target URL</Label>
          <Input
            id="targetUrl"
            name="targetUrl"
            type="url"
            defaultValue={ad.targetUrl}
            placeholder="https://example.com"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxCpc">Max CPC ($)</Label>
          <Input
            id="maxCpc"
            name="maxCpc"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={ad.maxCpc}
            placeholder="0.50"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="adGroupId">Ad Group</Label>
          <select
            id="adGroupId"
            name="adGroupId"
            defaultValue={
              typeof ad.adGroupId === "string" ? ad.adGroupId : ad.adGroupId._id
            }
            className="flex h-10 w-full rounded-none border border-black/20 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select Ad Group</option>
            {adGroups.map((adGroup) => (
              <option key={adGroup._id} value={adGroup._id}>
                {adGroup.name}
              </option>
            ))}
          </select>
        </div>
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full rounded-none bg-black text-white hover:bg-black/90"
          >
            Update Ad
          </Button>
        </div>
      </form>,
      "Edit Ad"
    );
  };

  const handleUpdateAd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAd) return;
    const formData = new FormData(e.currentTarget);
    const updatedAdData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      targetUrl: formData.get("targetUrl") as string,
      maxCpc: Number(formData.get("maxCpc")),
      adGroupId: formData.get("adGroupId") as string,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/ads/${editingAd._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAdData),
      });
      if (!response.ok) throw new Error("Failed to update ad");
      const updatedAd: Ad = await response.json();
      setAds(ads.map((ad) => (ad._id === updatedAd._id ? updatedAd : ad)));
      setEditingAd(null);
      openModal(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteAd = (ad: Ad) => {
    setDeletingAd(ad);
    openModal(
      <div className="py-4">
        <p>Are you sure you want to delete this ad?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => openModal(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDeleteAd}>
            Delete
          </Button>
        </div>
      </div>,
      "Confirm Deletion"
    );
  };

  const confirmDeleteAd = async () => {
    if (!deletingAd) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/ads/${deletingAd._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete ad");
      setAds(ads.filter((ad) => ad._id !== deletingAd._id));
      setDeletingAd(null);
      openModal(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePreviewAd = (ad: Ad) => {
    trackImpression(ad._id);
    openModal(
      <div className="py-4">
        <h3 className="font-medium mb-2">Ad Preview</h3>
        <div className="border p-4 rounded-sm bg-white">
          <h4 className="text-lg font-semibold">{ad.title}</h4>
          <p className="text-sm text-gray-600">{ad.description}</p>
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={() => trackClick(ad._id)}
          >
            {ad.targetUrl}
          </a>
        </div>
      </div>,
      "Ad Preview"
    );
  };

  const openCreateAdModal = () => {
    openModal(
      <form onSubmit={handleCreateAd} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Ad Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter ad title"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Ad Description</Label>
          <Input
            id="description"
            name="description"
            placeholder="Enter ad description"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetUrl">Target URL</Label>
          <Input
            id="targetUrl"
            name="targetUrl"
            type="url"
            placeholder="https://example.com"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxCpc">Max CPC ($)</Label>
          <Input
            id="maxCpc"
            name="maxCpc"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.50"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adGroupId">Ad Group</Label>
          <select
            id="adGroupId"
            name="adGroupId"
            className="flex h-10 w-full rounded-none border border-black/20 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select Ad Group</option>
            {adGroups.map((adGroup) => (
              <option key={adGroup._id} value={adGroup._id}>
                {adGroup.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full rounded-none bg-black text-white hover:bg-black/90"
          >
            Create Ad
          </Button>
        </div>
      </form>,
      "Create New Ad"
    );
  };

  const getAdGroupName = (ad: Ad) => {
    if (typeof ad.adGroupId === "string") {
      const adGroup = adGroups.find((g) => g._id === ad.adGroupId);
      return adGroup ? adGroup.name : "Unknown Ad Group";
    }
    return ad.adGroupId.name;
  };

  const calculateCTR = (ad: Ad) => {
    if (ad.impressions === 0) return "0.00%";
    return ((ad.clicks / ad.impressions) * 100).toFixed(2) + "%";
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
        <h2 className="font-heading text-xl font-medium">Ads</h2>
        <Button
          onClick={openCreateAdModal}
          className="rounded-none bg-black text-white hover:bg-black/90"
        >
          Create Ad
        </Button>
      </div>

      <Separator className="my-4" />

      {ads.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="border-black/10">
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Description</TableHead>
              <TableHead className="font-medium">Ad Group</TableHead>
              <TableHead className="font-medium">Max CPC</TableHead>
              <TableHead className="font-medium">Impressions</TableHead>
              <TableHead className="font-medium">Clicks</TableHead>
              <TableHead className="font-medium">CTR</TableHead>
              <TableHead className="font-medium w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad._id} className="border-black/10">
                <TableCell className="font-medium">{ad.title}</TableCell>
                <TableCell
                  className="max-w-[200px] truncate"
                  title={ad.description}
                >
                  {ad.description}
                </TableCell>
                <TableCell>{getAdGroupName(ad)}</TableCell>
                <TableCell>${ad.maxCpc.toFixed(2)}</TableCell>
                <TableCell>{ad.impressions}</TableCell>
                <TableCell>{ad.clicks}</TableCell>
                <TableCell>{calculateCTR(ad)}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewAd(ad)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePreviewAd(ad)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Preview</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditAd(ad)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <a
                          href={ad.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                          onClick={() => trackClick(ad._id)}
                        >
                          Visit URL
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteAd(ad)}
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
          <p className="text-muted-foreground">No ads found.</p>
          <Button
            onClick={openCreateAdModal}
            variant="outline"
            className="mt-4 rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
          >
            Create your first ad
          </Button>
        </div>
      )}
    </div>
  );
}
