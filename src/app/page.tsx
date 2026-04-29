import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="text-lg font-bold">ContentPilot</span>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          AI-Powered Content Creation
        </Badge>
        <h1 className="max-w-2xl text-5xl font-bold tracking-tight">
          Social media content on autopilot
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          Generate engaging posts with AI, schedule them, and publish to X and
          Instagram — all from one dashboard.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/login">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t bg-muted/50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-3xl font-bold">
            Simple pricing
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <p className="text-3xl font-bold">
                  $0<span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>10 AI-generated posts / month</li>
                  <li>1 social account</li>
                  <li>Basic scheduling</li>
                </ul>
                <Link href="/login" className="mt-6 block">
                  <Button variant="outline" className="w-full">
                    Start Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pro</CardTitle>
                  <Badge>Popular</Badge>
                </div>
                <p className="text-3xl font-bold">
                  $25<span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Unlimited AI-generated posts</li>
                  <li>Unlimited social accounts</li>
                  <li>Advanced scheduling</li>
                  <li>Priority support</li>
                </ul>
                <Link href="/login" className="mt-6 block">
                  <Button className="w-full">Get Pro</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-6 text-center text-sm text-muted-foreground">
        ContentPilot &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
