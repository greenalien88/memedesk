import RugAlert from '@/components/RugAlert';
import rugs from '../../../data/rugs.json';

export default function RugWatchPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">⚠️ Rug Watch</h1>
        <p className="text-sm text-white/60">Investigative signals on high-risk meme tokens.</p>
      </div>
      <div className="grid gap-4">
        {rugs.map((rug) => (
          <RugAlert key={rug.name} rug={rug} />
        ))}
      </div>
    </div>
  );
}
