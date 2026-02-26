import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const prevHref = currentPage === 2 ? '/' : `/page/${currentPage - 1}`;
  const nextHref = `/page/${currentPage + 1}`;

  return (
    <div className="flex items-center justify-center gap-6 text-xs text-white/40">
      {currentPage > 1 ? (
        <Link href={prevHref} className="text-emerald-400 hover:text-emerald-300 transition">
          ← Prev
        </Link>
      ) : (
        <span className="text-white/20">← Prev</span>
      )}
      <span className="text-white/60">Page {currentPage} of {totalPages}</span>
      {currentPage < totalPages ? (
        <Link href={nextHref} className="text-emerald-400 hover:text-emerald-300 transition">
          Next →
        </Link>
      ) : (
        <span className="text-white/20">Next →</span>
      )}
    </div>
  );
}
