import { Link } from "react-router";
import { ArrowRight, Play, Sparkles, Wand2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Video } from "@/components/Video";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const featureCards = [
  {
    icon: Wand2,
    title: "Prompt to portrait",
    text: "Turn a concept into cinematic avatar footage with just a few words.",
  },
  {
    icon: Zap,
    title: "Fast iteration",
    text: "Explore aesthetics, framing, and storyboards without leaving the studio.",
  },
  {
    icon: Sparkles,
    title: "Brand-ready polish",
    text: "Build product videos, social ads, and campaign previews in one workflow.",
  },
];

const demoVideos = [
  {
    title: "Build a product teaser",
    url: "https://cdn.higgsfield.ai/card/e74330e3-39d7-470b-817a-483cce45c255.mp4",
  },
  {
    title: "Launch a fantasy campaign",
    url: "https://cdn.higgsfield.ai/card/7f5704c9-77bd-416a-8d7f-8f7e8baf6a21.mp4",
  },
  {
    title: "Create a premium social story",
    url: "https://cdn.higgsfield.ai/card/6a4f43d6-53d4-44f3-9a64-3b161d1f100a.mp4",
  },
  {
    title: "Showcase a polished motion ad",
    url: "https://cdn.higgsfield.ai/card/c0a8d26c-8a9e-4680-90bb-595cda1d29f3.mp4",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(163,230,53,0.24),transparent_32%),radial-gradient(circle_at_right,_rgba(255,255,255,0.12),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-[0.18em] text-lime-300 uppercase">
            <Sparkles className="size-3.5" />
            AI video studio
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Create standout videos from a single creative spark.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-300">
                Higgsy helps teams craft cinematic avatars, animated stories, and launch-ready product visuals in minutes instead of days.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild className="rounded-full bg-lime-300 px-6 text-neutral-950 hover:bg-lime-200">
                  <Link to="/signup">
                    Start creating
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10">
                  <Link to="/video-creator">
                    <Play className="size-4" />
                    Explore studio
                  </Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-8 text-sm text-neutral-300">
                <div>
                  <div className="text-2xl font-semibold text-white">2.4x</div>
                  <div>Faster ideation</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-white">120+</div>
                  <div>Scenes shipped</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-white">4.9/5</div>
                  <div>Creator rating</div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-lime-200/5">
              <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-neutral-900">
                <Video
                  title="launch campaign preview"
                  url="https://cdn.higgsfield.ai/card/e74330e3-39d7-470b-817a-483cce45c255.mp4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium tracking-[0.22em] text-lime-300 uppercase">What you can do</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">A motion studio built for modern creators.</h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-lime-300/15 text-lime-300">
                <Icon className="size-5" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
              <p className="text-sm leading-6 text-neutral-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium tracking-[0.22em] text-lime-300 uppercase">Featured ideas</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Motion samples</h2>
          </div>
          <Button asChild variant="ghost" className="text-white hover:bg-white/5">
            <Link to="/dashboard">Open dashboard</Link>
          </Button>
        </div>

        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {demoVideos.map((video) => (
              <CarouselItem key={video.title} className="basis-full md:basis-1/2 xl:basis-1/3">
                <Video title={video.title} url={video.url} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-white/10 bg-white/5 text-white hover:bg-white/10" />
          <CarouselNext className="border-white/10 bg-white/5 text-white hover:bg-white/10" />
        </Carousel>
      </section>
    </main>
  );
}

