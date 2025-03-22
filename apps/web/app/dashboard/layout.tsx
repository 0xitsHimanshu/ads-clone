"use client"

import type React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, Layers, LayoutGrid, FileText } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1">
          <div className="flex h-16 items-center border-b px-4">
            <SidebarTrigger />
            <h1 className="ml-4 font-heading text-xl font-medium tracking-tight">Dashboard</h1>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}

function DashboardSidebar() {
  return (
    <Sidebar className="border-r border-black/10">
      <SidebarHeader className="p-4">
        <h2 className="font-heading text-xl font-medium tracking-tight">Google Ads</h2>
        <p className="text-xs text-muted-foreground">Management Dashboard</p>
      </SidebarHeader>
      <Separator className="mb-4" />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <a href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span>Overview</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/dashboard/campaigns">
                <Layers className="h-4 w-4" />
                <span>Campaigns</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/dashboard/ad-groups">
                <LayoutGrid className="h-4 w-4" />
                <span>Ad Groups</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/dashboard/ads">
                <FileText className="h-4 w-4" />
                <span>Ads</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

