
export function Video({ url, title }: { url: string; title: string }) {
  return (
    <div className="m-3 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-3 shadow-xl shadow-black/20">
      <video src={url} controls className="h-[260px] w-full rounded-xl object-cover bg-black" />
      <div className="mt-3 px-1 text-sm font-medium text-neutral-100">{title}</div>
    </div>
  );
}