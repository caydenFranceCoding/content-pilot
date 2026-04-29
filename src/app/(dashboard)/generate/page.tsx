"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GeneratePage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [platform, setPlatform] = useState("twitter");
  const [count, setCount] = useState("3");
  const [posts, setPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<number | null>(null);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, platform, count: parseInt(count) }),
      });
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(content: string, index: number) {
    setSaving(index);
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, platform, status: "draft" }),
      });
      setPosts((prev) => prev.filter((_, i) => i !== index));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Generate Content</h1>
        <p className="mt-2 text-muted-foreground">
          Tell the AI what to write about and it will create posts for you.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Tips for saving on energy bills"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => v && setTone(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={(v) => v && setPlatform(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">X / Twitter</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number of posts</Label>
              <Select value={count} onValueChange={(v) => v && setCount(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!topic || loading}
            className="w-full"
          >
            {loading ? "Generating..." : "Generate Posts"}
          </Button>
        </CardContent>
      </Card>

      {posts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generated Posts</h2>
          {posts.map((post, i) => (
            <GeneratedPostCard
              key={i}
              content={post}
              platform={platform}
              onSave={() => handleSave(post, i)}
              saving={saving === i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GeneratedPostCard({
  content,
  platform,
  onSave,
  saving,
}: {
  content: string;
  platform: string;
  onSave: () => void;
  saving: boolean;
}) {
  const [edited, setEdited] = useState(content);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {platform === "twitter" ? "X / Twitter" : "Instagram"}
          </Badge>
          {platform === "twitter" && (
            <span
              className={`text-xs ${
                edited.length > 280 ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {edited.length}/280
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={edited}
          onChange={(e) => setEdited(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={onSave} disabled={saving} size="sm">
          {saving ? "Saving..." : "Save as Draft"}
        </Button>
      </CardFooter>
    </Card>
  );
}
