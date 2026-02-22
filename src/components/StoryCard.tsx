import ChainBadge from '@/components/ChainBadge';
import { timeAgo } from '@/lib/format';

interface Story {
  id: string;
  headline: string;
  summary: string;
  timestamp: string;
  chain: 'SOL' | 'ETH' | 'BASE' | 'MULTI';
  emoji: string;
}

export default function StoryCard({ story }: { story: Story }) {
  return (
    <article className="group flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10">
      <div className="flex items-start justify-between">
        <span className="text-2xl">{story.emoji}</span>
        <ChainBadge chain={story.chain} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300">{story.headline}</h3>
        <p className="mt-2 text-sm text-white/70">{story.summary}</p>
      </div>
      <div className="text-xs text-white/50">{timeAgo(story.timestamp)}</div>
    </article>
  );
}
