export default function Sidebar({ hidePro }: { hidePro?: boolean }) {
  return (
    <aside className="sticky top-24 space-y-6">
      {!hidePro && (
        <div className="rounded-2xl border border-emerald-400/30 bg-black/60 p-5">
          <h3 className="text-lg font-semibold">Go Pro ⚡</h3>
          <p className="text-sm text-white/60">Unlock whale alerts, real-time signals, and portfolio intel.</p>
          <button className="mt-4 w-full rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-300">
            Upgrade
          </button>
        </div>
      )}
    </aside>
  );
}
