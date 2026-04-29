import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const scheduledPosts = await prisma.post.findMany({
    where: {
      userId: session.user.id,
      status: "scheduled",
      scheduledAt: { not: null },
    },
    orderBy: { scheduledAt: "asc" },
  });

  const grouped = scheduledPosts.reduce<Record<string, typeof scheduledPosts>>(
    (acc, post) => {
      const date = new Date(post.scheduledAt!).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(post);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Calendar</h1>
        <p className="mt-2 text-muted-foreground">
          Your upcoming scheduled posts.
        </p>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No scheduled posts yet. Generate content and schedule it to see it
            here.
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([date, posts]) => (
          <div key={date} className="space-y-3">
            <h2 className="text-lg font-semibold">{date}</h2>
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Badge variant="outline">
                    {post.platform === "twitter" ? "X / Twitter" : "Instagram"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.scheduledAt!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
