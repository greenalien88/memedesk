import ctFeed from '@/data/ct-feed.json';
import { timeAgo } from '@/lib/format';

const CTFeed = () => {
  const items = (ctFeed ?? []) as Array<{
    author: string;
    text: string;
    url: string;
    publishedAt: string;
    fetchedAt?: string;
  }>;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-white/80">🔥 Trenches CT Feed</h2>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/50">
          No signals from the trenches yet
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <a
              key={`${item.author}-${item.publishedAt}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between h-[200px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
            >
              <div>
                <div className="text-white/50 text-xs">@{item.author}</div>
                <div className="mt-2 text-white/80 text-sm line-clamp-5">{item.text}</div>
              </div>
              <div className="mt-3 text-white/40 text-xs">{timeAgo(item.publishedAt)}</div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

export default CTFeed;
