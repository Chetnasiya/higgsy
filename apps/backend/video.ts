import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const API_URL = "https://openrouter.ai/api/v1/videos";
const POLL_INTERVAL_MS = 30_000;

type VideoJob = {
  id: string;
  status: string;
  error?: string;
};

async function readJson(response: Response): Promise<Record<string, unknown>> {
  const body: unknown = await response.json();
  if (!response.ok) {
    throw new Error(`OpenRouter request failed (${response.status}): ${JSON.stringify(body)}`);
  }
  if (!body || typeof body !== "object") {
    throw new Error("OpenRouter returned an invalid response.");
  }
  return body as Record<string, unknown>;
}

function parseJob(body: Record<string, unknown>): VideoJob {
  if (typeof body.id !== "string" || typeof body.status !== "string") {
    throw new Error("OpenRouter returned a video job without an id or status.");
  }
  return {
    id: body.id,
    status: body.status,
    error: typeof body.error === "string" ? body.error : undefined,
  };
}

export async function generateVideo(prompt: string, imageUrls: string[], outputPath: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is required for video generation.");
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const submitResponse = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "google/veo-3.1",
      prompt,
      duration: 8,
      generate_audio: false,
      input_references: imageUrls.map(url => ({
        type: "image_url",
        image_url: { url },
      })),
    }),
  });
  let job = parseJob(await readJson(submitResponse));
  console.log(`Video job submitted: ${job.id}`);

  while (job.status === "pending" || job.status === "in_progress") {
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
    const pollResponse = await fetch(`${API_URL}/${encodeURIComponent(job.id)}`, { headers });
    job = parseJob(await readJson(pollResponse));
    console.log(`Video job ${job.id}: ${job.status}`);
  }

  if (job.status !== "completed") {
    throw new Error(`Video generation ${job.status}: ${job.error ?? "No further details provided."}`);
  }

  const contentUrl = `${API_URL}/${encodeURIComponent(job.id)}/content?index=0`;
  const videoResponse = await fetch(contentUrl, { headers });
  if (!videoResponse.ok) {
    const errorBody = await videoResponse.text();
    throw new Error(`Video download failed (${videoResponse.status}): ${errorBody}`);
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, Buffer.from(await videoResponse.arrayBuffer()));
  return outputPath;
}
