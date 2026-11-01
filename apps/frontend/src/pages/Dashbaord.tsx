import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ImagePlus, Sparkles, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { BACKEND_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserSession = {
  id: string;
  username: string;
};

type Avatar = {
  id: string;
  name: string;
  userId: string;
};

function getCurrentUser(): UserSession | null {
  try {
    const raw = window.localStorage.getItem("higgsy-user");
    return raw ? (JSON.parse(raw) as UserSession) : null;
  } catch {
    return null;
  }
}

async function createAvatar({ url, name, userId }: { url: string; name: string; userId: string }) {
  const response = await axios.post<{ id: string; name: string; userId: string }>(`${BACKEND_URL}/api/v1/avatar`, {
    name,
    image: url,
    userId,
  });
  return response.data;
}

async function getAvatars(userId: string): Promise<Avatar[]> {
  const response = await axios.get<{ avatars: Avatar[] }>(`${BACKEND_URL}/api/v1/avatars?userId=${encodeURIComponent(userId)}`);
  return response.data.avatars;
}

export function Dashboard() {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80");
  const [name, setName] = useState("Luna");
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["avatars", currentUser?.id],
    queryFn: () => (currentUser ? getAvatars(currentUser.id) : Promise.resolve([])),
    enabled: Boolean(currentUser?.id),
  });

  const mutation = useMutation({
    mutationFn: ({ url, name }: { url: string; name: string }) => {
      if (!currentUser) {
        throw new Error("No active user found.");
      }
      return createAvatar({ url, name, userId: currentUser.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avatars"] });
    },
  });

  const stats = [
    { label: "Avatars", value: String(query.data?.length ?? 0) },
    { label: "Scenes", value: "18" },
    { label: "Exports", value: "7" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-[0.2em] text-lime-300 uppercase">Creative workspace</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Welcome back, {currentUser?.username ?? "creator"}</h1>
        </div>
        <Button asChild className="rounded-full bg-lime-300 text-neutral-950 hover:bg-lime-200">
          <a href="/video-creator">Open studio</a>
        </Button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-neutral-300">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px,1fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-lime-300/15 text-lime-300">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Create avatar</h2>
              <p className="text-sm text-neutral-300">Build a new look for your campaign.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-neutral-300">Avatar name</label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Luna"
                className="border-white/10 bg-neutral-900 text-white placeholder:text-neutral-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-neutral-300">Reference image URL</label>
              <Input
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
                placeholder="https://..."
                className="border-white/10 bg-neutral-900 text-white placeholder:text-neutral-500"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-dashed border-white/15 bg-neutral-900 p-2">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar preview" className="h-52 w-full rounded-xl object-cover" />
              ) : (
                <div className="flex h-52 items-center justify-center rounded-xl bg-neutral-800 text-neutral-400">
                  <div className="text-center">
                    <ImagePlus className="mx-auto mb-3 size-8" />
                    Add an image URL
                  </div>
                </div>
              )}
            </div>

            <Button
              type="button"
              disabled={mutation.isPending || !currentUser}
              onClick={() => mutation.mutate({ name, url: avatarUrl })}
              className="w-full rounded-full bg-white text-neutral-950 hover:bg-neutral-200"
            >
              {mutation.isPending ? "Saving..." : "Save avatar"}
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent avatars</h2>
              <p className="text-sm text-neutral-300">Your active visual library.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-3 py-1 text-xs text-neutral-300">
              <Video className="size-3.5" />
              {query.data?.length ?? 0} items
            </div>
          </div>

          {query.isLoading ? (
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 text-neutral-300">Loading avatars...</div>
          ) : query.data?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {query.data.map((avatar) => (
                <div key={avatar.id} className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
                  <img
                    src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80"}
                    alt={avatar.name}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="text-base font-semibold text-white">{avatar.name}</p>
                    <p className="mt-1 text-xs text-neutral-400">Avatar #{avatar.id.slice(0, 6)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-neutral-900/50 p-8 text-center text-neutral-300">
              No avatars yet. Create your first one to begin building scenes.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}