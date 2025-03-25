"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiFetch } from "@/utils/api" // Assuming this is the path to your API helper

interface ProfileData {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  profilePicture: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch('/api/profile')
        setProfile(data)
      } catch (err) {
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Handle profile update
  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updateData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      company: formData.get('company') as string,
      profilePicture: formData.get('profilePicture') as string,
    }

    try {
      const updatedProfile = await apiFetch('/api/profile', 'PUT', updateData)
      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (err) {
      alert('Failed to update profile')
    }
  }

  if (loading) {
    return <div className="space-y-6">Loading profile...</div>
  }

  if (error) {
    return <div className="space-y-6">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences.</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md rounded-none border-b border-black/10 bg-transparent p-0">
          <TabsTrigger
            value="personal"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Personal Info
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-heading text-lg font-medium">Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
                <Button
                  variant="outline"
                  className="rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <form onSubmit={handleSaveProfile}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.profilePicture || "/placeholder.svg?height=96&width=96"} alt="User" />
                      <AvatarFallback className="bg-black text-white text-xl">
                        {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
                        type="button" // Prevent form submission
                      >
                        Change Photo
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          defaultValue={profile?.firstName || ""}
                          readOnly={!isEditing}
                          className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          defaultValue={profile?.lastName || ""}
                          readOnly={!isEditing}
                          className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        defaultValue={profile?.email || ""}
                        readOnly // Email is typically not editable
                        className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        defaultValue={profile?.company || ""}
                        readOnly={!isEditing}
                        className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                      />
                    </div>

                    {isEditing && (
                      <div className="space-y-2">
                        <Label htmlFor="profilePicture">Profile Picture URL</Label>
                        <Input
                          id="profilePicture"
                          name="profilePicture"
                          defaultValue={profile?.profilePicture || ""}
                          className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter className="border-t border-black/10 p-6">
                  <Button
                    type="submit"
                    className="rounded-none bg-black text-white hover:bg-black/90"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              )}
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-medium">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-black/10 p-6">
              <Button className="rounded-none bg-black text-white hover:bg-black/90">Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-medium">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Campaign Updates</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your campaign performance</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="campaignEmail"
                      className="h-4 w-4 rounded-none border-black/20 focus:ring-0"
                      defaultChecked
                    />
                    <Label htmlFor="campaignEmail" className="text-sm">
                      Email
                    </Label>

                    <input
                      type="checkbox"
                      id="campaignPush"
                      className="h-4 w-4 rounded-none border-black/20 focus:ring-0 ml-4"
                      defaultChecked
                    />
                    <Label htmlFor="campaignPush" className="text-sm">
                      Push
                    </Label>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Billing Alerts</p>
                    <p className="text-sm text-muted-foreground">Receive notifications about your billing status</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="billingEmail"
                      className="h-4 w-4 rounded-none border-black/20 focus:ring-0"
                      defaultChecked
                    />
                    <Label htmlFor="billingEmail" className="text-sm">
                      Email
                    </Label>

                    <input
                      type="checkbox"
                      id="billingPush"
                      className="h-4 w-4 rounded-none border-black/20 focus:ring-0 ml-4"
                      defaultChecked
                    />
                    <Label htmlFor="billingPush" className="text-sm">
                      Push
                    </Label>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Features</p>
                    <p className="text-sm text-muted-foreground">Get updates about new features and improvements</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featuresEmail"
                      className="h-4 w-4 rounded-none border-black/20 focus:ring-0"
                      defaultChecked
                    />
                    <Label htmlFor="featuresEmail" className="text-sm">
                      Email
                    </Label>

                    <input
                      type="checkbox"
                      id="featuresPush"
                      className="h-4 w-4 rounded-none border-black/20 focus:ring-0 ml-4"
                    />
                    <Label htmlFor="featuresPush" className="text-sm">
                      Push
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-black/10 p-6">
              <Button className="rounded-none bg-black text-white hover:bg-black/90">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}