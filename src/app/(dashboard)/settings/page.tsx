import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { socialConnections: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plan</span>
            <Badge variant={user?.plan === "pro" ? "default" : "secondary"}>
              {user?.plan === "pro" ? "Pro" : "Free"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {!user?.socialConnections.length ? (
            <p className="text-muted-foreground">
              No social accounts connected yet. This will be available soon.
            </p>
          ) : (
            <div className="space-y-3">
              {user.socialConnections.map((conn) => (
                <div key={conn.id} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">
                      {conn.platform === "twitter" ? "X / Twitter" : "Instagram"}
                    </span>
                    {conn.platformUsername && (
                      <span className="ml-2 text-muted-foreground">
                        @{conn.platformUsername}
                      </span>
                    )}
                  </div>
                  <Badge variant={conn.connected ? "default" : "destructive"}>
                    {conn.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
