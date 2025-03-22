"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Eye, MoreHorizontal, Trash, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

interface Campaign {
  _id: string
  name: string
  budget: number
  startDate?: string
  endDate?: string
}

interface CampaignsSectionProps {
  openModal: (content: React.ReactNode, title?: string) => void
}

export default function CampaignsSection({ openModal }: CampaignsSectionProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Authentication required")
        const response = await fetch("/api/campaigns", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error("Failed to fetch campaigns")
        const data: Campaign[] = await response.json()
        setCampaigns(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  const handleCreateCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const budget = Number(formData.get("budget"))
    const startDate = formData.get("startDate")
    const endDate = formData.get("endDate")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, budget, startDate, endDate }),
      })
      if (!response.ok) throw new Error("Failed to create campaign")
      const newCampaign: Campaign = await response.json()
      setCampaigns([...campaigns, newCampaign])
      // Close modal by passing null to openModal
      openModal(null)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleViewCampaign = (campaign: Campaign) => {
    openModal(
      <div className="py-4">
        <h3 className="font-medium mb-2">Campaign Details</h3>
        <p className="mb-1">
          <span className="text-muted-foreground">Name:</span> {campaign.name}
        </p>
        <p className="mb-1">
          <span className="text-muted-foreground">Budget:</span> ${campaign.budget}
        </p>
        {campaign.startDate && (
          <p className="mb-1">
            <span className="text-muted-foreground">Start Date:</span>{" "}
            {new Date(campaign.startDate).toLocaleDateString()}
          </p>
        )}
        {campaign.endDate && (
          <p className="mb-1">
            <span className="text-muted-foreground">End Date:</span> {new Date(campaign.endDate).toLocaleDateString()}
          </p>
        )}
      </div>,
      campaign.name,
    )
  }

  const openCreateCampaignModal = () => {
    openModal(
      <form onSubmit={handleCreateCampaign} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Campaign Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter campaign name"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget ($)</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            placeholder="Enter budget amount"
            className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full rounded-none bg-black text-white hover:bg-black/90">
            Create Campaign
          </Button>
        </div>
      </form>,
      "Create New Campaign",
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="rounded-none border-red-500/50 bg-red-50 text-red-900">
        <AlertDescription>Error: {error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-xl font-medium">Your Campaigns</h2>
        <Button onClick={openCreateCampaignModal} className="rounded-none bg-black text-white hover:bg-black/90">
          Create Campaign
        </Button>
      </div>

      <Separator className="my-4" />

      {campaigns.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="border-black/10">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Budget</TableHead>
              <TableHead className="font-medium">Start Date</TableHead>
              <TableHead className="font-medium">End Date</TableHead>
              <TableHead className="font-medium w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign._id} className="border-black/10">
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>${campaign.budget}</TableCell>
                <TableCell>{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "-"}</TableCell>
                <TableCell>{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none border-black/10">
                      <DropdownMenuItem onClick={() => handleViewCampaign(campaign)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
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
          <p className="text-muted-foreground">No campaigns found.</p>
          <Button
            onClick={openCreateCampaignModal}
            variant="outline"
            className="mt-4 rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
          >
            Create your first campaign
          </Button>
        </div>
      )}
    </div>
  )
}

