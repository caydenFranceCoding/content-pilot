import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome back, {session.user.name || "there"}!</h1>
      <p className="mt-2 text-muted-foreground">
        Your content command center. Generate posts, schedule them, and watch them go live.
      </p>
    </div>
  );
}
