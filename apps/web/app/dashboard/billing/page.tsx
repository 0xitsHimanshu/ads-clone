"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { apiFetch } from "@/utils/api" // Adjust path as needed
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, AlertCircle, Download, Clock, FileText, DollarSign, Wallet } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface BillingAccountData {
  paymentMode: string
  paymentThreshold: number
  balance: number
  paymentMethod?: { type: string; lastFour: string; expiry: string }
  invoicingEligible: boolean
  accruedCosts: number
}

export default function BillingPage() {
  const [billingAccount, setBillingAccount] = useState<BillingAccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentMode, setPaymentMode] = useState<string>("automatic")
  const [threshold, setThreshold] = useState<number>(50)
  const [manualPaymentAmount, setManualPaymentAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<{ type: string; lastFour: string; expiry: string }>({
    type: "",
    lastFour: "",
    expiry: "",
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchBillingAccount = async () => {
      try {
        const data = await apiFetch("/api/billing/account")
        setBillingAccount(data)
        setPaymentMode(data.paymentMode)
        setThreshold(data.paymentThreshold)
        if (data.paymentMethod) setPaymentMethod(data.paymentMethod)
      } catch (error: any) {
        setError(error.message || "Failed to fetch billing account")
      } finally {
        setLoading(false)
      }
    }
    fetchBillingAccount()
  }, [])

  const handleUpdatePaymentMode = async () => {
    try {
      setIsUpdating(true)
      const updatedAccount = await apiFetch("/api/billing/payment-mode", "PUT", { paymentMode })
      setBillingAccount(updatedAccount)
      // Toast notification would be better than alert
      // alert("Payment mode updated successfully")
    } catch (error) {
      alert("Failed to update payment mode")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateThreshold = async () => {
    try {
      setIsUpdating(true)
      const updatedAccount = await apiFetch("/api/billing/threshold", "PUT", { threshold })
      setBillingAccount(updatedAccount)
      // alert("Payment threshold updated successfully")
    } catch (error) {
      alert("Failed to update threshold")
    } finally {
      setIsUpdating(false)
    }
  }


  const handleBillingAutomaticPayment = async () => {
    try{
      handleUpdatePaymentMode()
      handleUpdateThreshold()
      alert("Payment mode and threshold updated successfully")
    } catch(error){
      alert("Failed to update payment mode and threshold")
    }
  }
  

  const handleAddPaymentMethod = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsUpdating(true)
      const updatedAccount = await apiFetch("/api/billing/payment-method", "POST", paymentMethod)
      setBillingAccount(updatedAccount)
      alert("Payment method added successfully")
    } catch (error) {
      alert("Failed to add payment method")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMakeManualPayment = async () => {
    if (manualPaymentAmount <= 0) {
      alert("Please enter a valid amount")
      return
    }
    try {
      setIsUpdating(true)
      const updatedAccount = await apiFetch("/api/billing/manual-payment", "POST", { amount: manualPaymentAmount })
      setBillingAccount(updatedAccount)
      setManualPaymentAmount(0)
      alert("Manual payment successful")
    } catch (error) {
      alert("Failed to make manual payment")
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight">Billing</h1>
          <p className="text-muted-foreground">Manage your subscription and payment methods.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32 mt-1" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32 mt-1" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight">Billing</h1>
          <p className="text-red-600">Error: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-none bg-black text-white hover:bg-black/90"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage your payment methods and billing settings.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md rounded-none border-b border-black/10 bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Payment Methods
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Billing History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Billing Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-black/10 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg font-medium flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold">${billingAccount?.balance.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground mt-1">Available for ad spend</p>
              </CardContent>
            </Card>

            <Card className="border-black/10 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg font-medium flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Accrued Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold">${billingAccount?.accruedCosts.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground mt-1">Current billing period</p>
              </CardContent>
            </Card>

            <Card className="border-black/10 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg font-medium flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Payment Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-xl font-bold capitalize">{billingAccount?.paymentMode}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {billingAccount?.paymentMode === "automatic"
                    ? `Threshold: $${billingAccount?.paymentThreshold}`
                    : billingAccount?.paymentMode === "manual"
                      ? "Add funds manually"
                      : "Invoiced monthly"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-medium">Billing Settings</CardTitle>
              <CardDescription>Configure your payment preferences</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMode" className="text-sm font-medium">
                      Payment Mode
                    </Label>
                    <Select onValueChange={setPaymentMode} defaultValue={billingAccount?.paymentMode}>
                      <SelectTrigger
                        id="paymentMode"
                        className="mt-1 rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                      >
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-black/10">
                        <SelectItem value="automatic">Automatic Payments</SelectItem>
                        <SelectItem value="manual">Manual Payments</SelectItem>
                        {billingAccount?.invoicingEligible && (
                          <SelectItem value="invoicing">Monthly Invoicing</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {paymentMode === "automatic"
                        ? "Your card will be charged automatically when you reach the threshold."
                        : paymentMode === "manual"
                          ? "You'll need to add funds manually to your account."
                          : "You'll receive a monthly invoice for your ad spend."}
                    </p>
                  </div>

                  {paymentMode === "automatic" && (
                    <div>
                      <Label htmlFor="threshold" className="text-sm font-medium">
                        Payment Threshold ($)
                      </Label>
                      <Input
                        id="threshold"
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        min={50}
                        step={10}
                        className="mt-1 rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Your card will be charged when your costs reach this amount.
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleBillingAutomaticPayment}
                    disabled={isUpdating}
                    className="rounded-none bg-black text-white hover:bg-black/90 mt-2"
                  >
                    {isUpdating ? "Updating..." : "Update Payment Settings"}
                  </Button>
                </div>

                {paymentMode === "manual" && (
                  <div className="space-y-4 p-4 border border-black/10 bg-muted/20">
                    <h3 className="font-heading text-lg font-medium">Add Funds</h3>
                    <p className="text-sm text-muted-foreground">
                      Add money to your account to pay for your advertising costs.
                    </p>

                    <div>
                      <Label htmlFor="manualPayment" className="text-sm font-medium">
                        Amount ($)
                      </Label>
                      <Input
                        id="manualPayment"
                        type="number"
                        value={manualPaymentAmount}
                        onChange={(e) => setManualPaymentAmount(Number(e.target.value))}
                        placeholder="Enter amount"
                        min={1}
                        className="mt-1 rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                      />
                    </div>

                    <Button
                      onClick={handleMakeManualPayment}
                      disabled={isUpdating || manualPaymentAmount <= 0}
                      className="rounded-none bg-black text-white hover:bg-black/90 w-full"
                    >
                      {isUpdating ? "Processing..." : "Add Funds"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          {/* Payment Methods */}
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-medium">Current Payment Method</CardTitle>
              <CardDescription>Your saved payment details</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {billingAccount?.paymentMethod ? (
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-12 w-12 rounded-none bg-muted/20 p-2 flex items-center justify-center">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {billingAccount.paymentMethod.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                      ending in {billingAccount.paymentMethod.lastFour}
                    </p>
                    <p className="text-sm text-muted-foreground">Expires {billingAccount.paymentMethod.expiry}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4 mb-4 p-4 border border-dashed border-black/10 rounded-sm bg-muted/20">
                  <div className="h-12 w-12 rounded-none bg-muted/30 p-2 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">No payment method added</p>
                    <p className="text-sm text-muted-foreground">Add a payment method to enable automatic payments</p>
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              <form id="payment-method-form" onSubmit={handleAddPaymentMethod} className="space-y-4">
                <h3 className="font-heading text-lg font-medium">
                  {billingAccount?.paymentMethod ? "Update Payment Method" : "Add Payment Method"}
                </h3>

                <div>
                  <Label htmlFor="type" className="text-sm font-medium">
                    Payment Type
                  </Label>
                  <Select
                    onValueChange={(value) => setPaymentMethod({ ...paymentMethod, type: value })}
                    defaultValue={paymentMethod.type}
                  >
                    <SelectTrigger
                      id="type"
                      className="mt-1 rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                    >
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-black/10">
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="debit_card">Debit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="lastFour" className="text-sm font-medium">
                    Last Four Digits
                  </Label>
                  <Input
                    id="lastFour"
                    value={paymentMethod.lastFour}
                    onChange={(e) => setPaymentMethod({ ...paymentMethod, lastFour: e.target.value })}
                    maxLength={4}
                    className="mt-1 rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                  />
                </div>

                <div>
                  <Label htmlFor="expiry" className="text-sm font-medium">
                    Expiry (MM/YY)
                  </Label>
                  <Input
                    id="expiry"
                    value={paymentMethod.expiry}
                    onChange={(e) => setPaymentMethod({ ...paymentMethod, expiry: e.target.value })}
                    placeholder="MM/YY"
                    className="mt-1 rounded-none border-black/20 focus-visible:ring-0 focus-visible:border-black"
                  />
                </div>

                <div className="flex items-center text-sm text-muted-foreground bg-muted/20 p-3 border-l-2 border-black">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p>
                    In a production environment, you would use a secure payment processor like Stripe to handle card
                    details.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isUpdating || !paymentMethod.type || !paymentMethod.lastFour || !paymentMethod.expiry}
                  className="rounded-none bg-black text-white hover:bg-black/90"
                >
                  {isUpdating
                    ? "Processing..."
                    : billingAccount?.paymentMethod
                      ? "Update Payment Method"
                      : "Add Payment Method"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Billing History */}
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-medium">Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
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
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>INV-001</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">Mar 15, 2023</td>
                      <td className="py-3 px-4 font-medium">$49.99</td>
                      <td className="py-3 px-4">
                        <Badge className="rounded-none bg-green-50 text-green-800 hover:bg-green-50">Paid</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 rounded-none">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b border-black/10">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>INV-002</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">Feb 15, 2023</td>
                      <td className="py-3 px-4 font-medium">$49.99</td>
                      <td className="py-3 px-4">
                        <Badge className="rounded-none bg-green-50 text-green-800 hover:bg-green-50">Paid</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 rounded-none">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b border-black/10">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>INV-003</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">Jan 15, 2023</td>
                      <td className="py-3 px-4 font-medium">$49.99</td>
                      <td className="py-3 px-4">
                        <Badge className="rounded-none bg-green-50 text-green-800 hover:bg-green-50">Paid</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 rounded-none">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

