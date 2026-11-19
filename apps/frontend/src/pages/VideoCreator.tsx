
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Camera, CheckCircle2, Download, Loader2, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { BACKEND_URL } from "@/config";
import { Button } from "@/components/ui/button";

const sampleImages = [
  "https://raw.githubusercontent.com/100xdevs-bootcamp-1/higgsy/refs/heads/main/apps/backend/assets/09578560-870f-4b23-a1cb-b549aa38a23f.png",
  "https://raw.githubusercontent.com/100xdevs-bootcamp-1/higgsy/refs/heads/main/apps/backend/assets/a9d55f96-bc90-45e6-b078-7593b8bc3b11.png",
  "https://raw.githubusercontent.com/100xdevs-bootcamp-1/higgsy/refs/heads/main/apps/backend/assets/8106a04c-bed5-4ac4-94ef-970c5aee1518.png",
];

type UserSession = {
  id: string;
  username: string;
};

function getCurrentUser(): UserSession | null {
  try {
    const raw = window.localStorage.getItem("higgsy-user");
    return raw ? (JSON.parse(raw) as UserSession) : null;
  } catch {
    return null;
  }
}

async function generateVideo({ prompt, userId }: { prompt: string; userId?: string }) {
  const response = await axios.post<{ success: boolean; videoUrl?: string; message?: string }>(`${BACKEND_URL}/api/v1/video`, {
    prompt,
    imageUrls: sampleImages,
    userId,
  });

  return response.data;
}

export function VideoCreator() {
  const defaultPrompt =
    "A cinematic lifestyle ad with a confident creator walking through a luminous studio, wearing luxury fashion, dramatic lighting, and smooth camera motion.";
  const samplePrompt =
    "A sleek product reveal in a high-contrast studio with dramatic reflections, cinematic camera movement, and luxury styling.";

  const [prompt, setPrompt] = useState(defaultPrompt);
  const [resultUrl, setResultUrl] = useState("");
  const currentUser = getCurrentUser();

  const mutation = useMutation({
    mutationFn: (text: string) => generateVideo({ prompt: text, userId: currentUser?.id }),
    onSuccess: (data) => {
      if (data.videoUrl) {
        setResultUrl(`${BACKEND_URL}${data.videoUrl}`);
      }
    },
  });

  const handleGenerate = () => {
    setResultUrl("");
    mutation.mutate(prompt.trim());
  };

  const handleSamplePrompt = () => {
    setPrompt(samplePrompt);
    setResultUrl("");
  };

  const handleClearPrompt = () => {
    setPrompt("");
    setResultUrl("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-lime-300/15 text-lime-300">
          <Wand2 className="size-5" />
        </div>
        <div>
          <p className="text-sm font-medium tracking-[0.2em] text-lime-300 uppercase">Video studio</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Create cinematic motion</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section
          aria-busy={mutation.isPending}
          className="rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-neutral-300">
            <Camera className="size-4 text-lime-300" />
            Storyboard prompt
          </div>

          <textarea
            aria-label="Video prompt"
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              setResultUrl("");
            }}
            rows={8}
            className="w-full resize-none rounded-2xl border border-white/10 bg-neutral-900 p-4 text-base text-white placeholder:text-neutral-500 focus:border-lime-300/80 focus:outline-none"
            placeholder="Describe the scene you want to generate..."
          />

          <div className="mt-2 flex items-center justify-between px-1 text-xs text-neutral-400">
            <span>
              {prompt.trim().length < 8 ? (
                <span className="text-amber-400">At least 8 characters required ({prompt.trim().length}/8)</span>
              ) : (
                <span>{prompt.trim().length} / 1200 characters</span>
              )}
            </span>
            {prompt.length > 0 && (
              <button
                type="button"
                onClick={handleClearPrompt}
                className="inline-flex items-center gap-1 text-neutral-400 hover:text-white"
              >
                <RotateCcw className="size-3" />
                Clear
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {sampleImages.map((image, index) => (
              <div key={image} className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
                <img
                  src={image}
                  alt={`Storyboard reference ${index + 1}`}
                  loading="lazy"
                  className="h-20 w-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={mutation.isPending || prompt.trim().length < 8}
              className="rounded-full bg-lime-300 text-neutral-950 hover:bg-lime-200"
            >
              {mutation.isPending ? "Generating..." : "Generate video"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSamplePrompt}
              className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Use sample prompt
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <Sparkles className="size-4 text-lime-300" />
              Output preview
            </div>
            {resultUrl && (
              <a
                href={resultUrl}
                download="generated-video.mp4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-lime-300 hover:bg-white/10 hover:text-lime-200"
              >
                <Download className="size-3.5" />
                Download MP4
              </a>
            )}
          </div>

          {mutation.isPending ? (
            <div className="flex h-[360px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-neutral-900/80 p-6 text-center text-neutral-300">
              <Loader2 className="mb-4 size-10 animate-spin text-lime-300" />
              <p className="text-base font-semibold text-white">Synthesizing cinematic motion...</p>
              <p className="mt-2 max-w-xs text-xs text-neutral-400">
                Generating video frames via Google Veo. This process typically takes around 30 to 60 seconds.
              </p>
            </div>
          ) : mutation.isError ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
              {axios.isAxiosError(mutation.error) ? mutation.error.response?.data?.message ?? "Generation failed." : "Generation failed."}
            </div>
          ) : resultUrl ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
              <video
                src={resultUrl}
                controls
                playsInline
                preload="metadata"
                aria-label="Generated video preview"
                className="h-[360px] w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-neutral-900/80 p-6 text-center text-neutral-300">
              <div>
                <CheckCircle2 className="mx-auto mb-3 size-8 text-lime-300" />
                Your generated video will appear here.
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}