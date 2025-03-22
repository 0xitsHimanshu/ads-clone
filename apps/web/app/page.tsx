import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md border-black/10 shadow-sm">
        <CardHeader className="space-y-1 pb-6">
          <h1 className="font-heading text-3xl font-medium tracking-tight">Welcome</h1>
          <p className="text-muted-foreground">Please sign in or create an account to get started.</p>
        </CardHeader>
        <Separator className="mb-6" />
        <CardContent className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-none border-black/20 hover:bg-accent hover:text-accent-foreground"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="flex-1 rounded-none bg-black text-white hover:bg-black/90">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground pt-0">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  )
}

