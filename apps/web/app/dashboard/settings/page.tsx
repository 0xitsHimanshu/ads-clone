// @app/dashboard/settings/page.tsx

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 max-w-md rounded-none border-b border-black/10 bg-transparent p-0">
          <TabsTrigger
            value="general"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-medium">
                General Settings
              </CardTitle>
              <CardDescription>
                Manage your basic account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="rounded-none border-black/20 focus:ring-0">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-black/10">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger className="rounded-none border-black/20 focus:ring-0">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-black/10">
                    <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                    <SelectItem value="est">Eastern Time (GMT-5)</SelectItem>
                    <SelectItem value="pst">Pacific Time (GMT-8)</SelectItem>
                    <SelectItem value="cet">
                      Central European Time (GMT+1)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing">Marketing emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and updates
                  </p>
                </div>
                <Switch id="marketing" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="border-t border-black/10 p-6">
              <Button className="rounded-none bg-black text-white hover:bg-black/90">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-medium">
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the dashboard looks
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground justify-start px-3 py-6 h-auto"
                  >
                    <div className="w-4 h-4 rounded-full bg-white border border-black/20 mr-2"></div>
                    Light
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground justify-start px-3 py-6 h-auto"
                  >
                    <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
                    Dark
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground justify-start px-3 py-6 h-auto"
                  >
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-white to-black mr-2"></div>
                    System
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="densityToggle">Compact mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Display more content on the screen
                  </p>
                </div>
                <Switch id="densityToggle" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animationsToggle">Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable animations throughout the interface
                  </p>
                </div>
                <Switch id="animationsToggle" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="border-t border-black/10 p-6">
              <Button className="rounded-none bg-black text-white hover:bg-black/90">
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-medium">
                Notification Settings
              </CardTitle>
              <CardDescription>
                Control when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Campaign performance alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when campaigns reach performance thresholds
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Budget alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when campaigns approach budget limits
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New feature announcements</Label>
                    <p className="text-sm text-muted-foreground">
                      Be the first to know about new features
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-black/10 p-6">
              <Button className="rounded-none bg-black text-white hover:bg-black/90">
                Update Notifications
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-medium">
                Advanced Settings
              </CardTitle>
              <CardDescription>
                Configure advanced options for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>API Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable API access for third-party integrations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Data Export</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Download your campaign data
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
                  >
                    Export as CSV
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
                  >
                    Export as JSON
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-red-600">Danger Zone</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Permanently delete your account and all data
                </p>
                <Button
                  variant="outline"
                  className="rounded-none border-red-500/20 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
