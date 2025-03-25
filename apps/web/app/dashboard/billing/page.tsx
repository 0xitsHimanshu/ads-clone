// @app/dashboard/billing/page.tsx

"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payment methods.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-black/10 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg font-medium">Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Pro Plan</h3>
                <p className="text-muted-foreground">$49.99 / month</p>
              </div>
              <Badge className="rounded-none bg-black text-white">Active</Badge>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Unlimited campaigns</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Custom reporting</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-black/10 p-6 flex justify-between">
            <p className="text-sm text-muted-foreground">Next billing date: April 15, 2023</p>
            <Button
              variant="outline"
              className="rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
            >
              Change Plan
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-black/10 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg font-medium">Payment Method</CardTitle>
            <CardDescription>Manage your payment details</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 rounded-none bg-muted/20 p-2 flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 04/2025</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 mr-2" />
              <p>Your card will be charged automatically on the billing date.</p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-black/10 p-6 flex justify-between">
            <Button
              variant="outline"
              className="rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
            >
              Update Payment Method
            </Button>
            <Button
              variant="outline"
              className="rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
            >
              View Billing History
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="border-black/10 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-lg font-medium">Billing History</CardTitle>
          <CardDescription>View your recent invoices</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="text-left py-3 px-4 font-medium">Invoice</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black/10">
                  <td className="py-3 px-4">INV-001</td>
                  <td className="py-3 px-4">Mar 15, 2023</td>
                  <td className="py-3 px-4">$49.99</td>
                  <td className="py-3 px-4">
                    <Badge className="rounded-none bg-green-50 text-green-800 hover:bg-green-50">Paid</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 rounded-none">
                      Download
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-black/10">
                  <td className="py-3 px-4">INV-002</td>
                  <td className="py-3 px-4">Feb 15, 2023</td>
                  <td className="py-3 px-4">$49.99</td>
                  <td className="py-3 px-4">
                    <Badge className="rounded-none bg-green-50 text-green-800 hover:bg-green-50">Paid</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 rounded-none">
                      Download
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-black/10">
                  <td className="py-3 px-4">INV-003</td>
                  <td className="py-3 px-4">Jan 15, 2023</td>
                  <td className="py-3 px-4">$49.99</td>
                  <td className="py-3 px-4">
                    <Badge className="rounded-none bg-green-50 text-green-800 hover:bg-green-50">Paid</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 rounded-none">
                      Download
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

