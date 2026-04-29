import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

const statusColors: Record<string, string> = {
  draft: "secondary",
  scheduled: "default",
  published: "default",
  failed: "destructive",
};

export default async function PostsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const posts = await prisma.post.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Posts</h1>
        <p className="mt-2 text-muted-foreground">
          {posts.length} post{posts.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No posts yet. Head to Generate to create your first post!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={statusColors[post.status] as "default" | "secondary" | "destructive"}>
                    {post.status}
                  </Badge>
                  <Badge variant="outline">
                    {post.platform === "twitter" ? "X / Twitter" : "Instagram"}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{post.content}</p>
                {post.scheduledAt && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Scheduled for {new Date(post.scheduledAt).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
