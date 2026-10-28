import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Avatar = {
  id: string;
  name: string;
};

async function createAvatar({ url, name }: { url: string; name: string }) {
  const response = await axios.post(`${BACKEND_URL}/api/v1/avatar`, {
    name,
    image: url,
  });
  return response.data;
}

async function getAvatars(): Promise<Avatar[]> {
  const response = await axios.get<{ avatars: Avatar[] }>(`${BACKEND_URL}/api/v1/avatars`);
  return response.data.avatars;
}

export function Dashboard() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAvatar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["avatars"] }),
  });

  const query = useQuery({
    queryFn: getAvatars,
    queryKey: ["avatars"],
  });

  return (
    <div>
      Dashboard page
      <div className="w-md border p-4">
        <Input placeholder="name" value={name} onChange={event => setName(event.target.value)} />
        <Input placeholder="url" value={avatarUrl} onChange={event => setAvatarUrl(event.target.value)} />
        <Button
          disabled={mutation.isPending}
          onClick={() => mutation.mutate({ name, url: avatarUrl })}
        >
          Create avatar
        </Button>
      </div>

      <div>
        <b>Avatars</b>
        {query.data?.map(avatar => (
          <div key={avatar.id}>{avatar.name}</div>
        ))}
      </div>
    </div>
  );
}