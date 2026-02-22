'use client';

import NewsletterForm from '@/components/NewsletterForm';

export default function NewsletterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">📬 MemeDesk Daily</h3>
            <p className="text-sm text-white/60">Get the signal in the noise.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="mt-4">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
