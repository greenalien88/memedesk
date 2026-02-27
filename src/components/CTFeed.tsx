'use client';

import ctFeed from '@/data/ct-feed.json';
import kolAccounts from '@/data/kol-accounts.json';
import { timeAgo } from '@/lib/format';

type FeedItem = {
  author: string;
  name?: string;
  text: string;
  url: string;
  publishedAt: string;
  fetchedAt?: string;
  cashtags?: string[];
  avatar?: string;
  followers?: string;
};

type KolAccount = {
  handle: string;
  name: string;
  tier: number;
  weight: number;
  followers?: string;
};

const CTFeed = () => {
  const items = (ctFeed ?? []) as FeedItem[];
  const kolMap = Object.fromEntries(
    (kolAccounts as KolAccount[]).map((k) => [k.handle.toLowerCase(), k])
  );

  const displayItems = items.slice(0, 5);

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-white/80">Trenches CT Feed</h2>
      {displayItems.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/50">
          No signals from the trenches yet
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayItems.map((item) => {
            const kol = kolMap[item.author.toLowerCase()];
            const displayName = item.name || kol?.name || item.author;
            const followers = item.followers || kol?.followers;
            const avatarUrl = item.avatar || `https://unavatar.io/x/${item.author}`;

            return (
              <a
                key={`${item.author}-${item.publishedAt}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
              >
                {/* Author header */}
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    width={36}
                    height={36}
                    className="rounded-full w-9 h-9 object-cover flex-shrink-0 border border-white/10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://api.dicebear.com/7.x/identicon/svg?seed=${item.author}`;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-white text-xs font-semibold">{displayName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/40 text-[11px] mt-0.5">
                      <span>@{item.author}</span>
                      {followers && (
                        <>
                          <span>·</span>
                          <span>{followers} followers</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tweet text */}
                <p className="text-white/80 text-sm line-clamp-4 leading-relaxed">{item.text}</p>

                {/* Cashtags + time */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {(item.cashtags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#00ff88]/10 text-[#00ff88] font-medium"
                      >
                        ${tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-white/40 text-[11px] flex-shrink-0">
                    {timeAgo(item.publishedAt)}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CTFeed;
