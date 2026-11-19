
export function Video({ url, title }: { url: string; title: string }) {
  return (
    <div className="m-3 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-3 shadow-xl shadow-black/20 transition-transform duration-200 hover:scale-[1.01]">
      <video
        src={url}
        controls
        playsInline
        preload="metadata"
        className="h-[260px] w-full rounded-xl object-cover bg-black"
      />
      <div className="mt-3 px-1 text-sm font-medium capitalize text-neutral-100">{title}</div>
    </div>
  );
}