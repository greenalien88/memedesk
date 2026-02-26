import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoryCard from '@/components/StoryCard';
import CTFeed from '@/components/CTFeed';
import Pagination from '@/components/Pagination';
import { getAllArticles } from '@/lib/articles';

const FIRST_PAGE_ARTICLES = 12; // featured(1) + secondary(2) + grid(9)
const ARTICLES_PER_PAGE = 9;

function getTotalPages(total: number) {
  return 1 + Math.ceil(Math.max(0, total - FIRST_PAGE_ARTICLES) / ARTICLES_PER_PAGE);
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `MemeDesk — Page ${page}`,
    description: 'Daily memecoin intelligence: KOL calls, token analysis, rug alerts, and degen signal reports.',
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  const totalPages = getTotalPages(articles.length);
  return Array.from({ length: totalPages - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export const revalidate = 60;

export default async function PaginatedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageParam } = await params;
  const currentPage = parseInt(pageParam, 10);

  const articles = getAllArticles();
  const totalPages = getTotalPages(articles.length);

  if (isNaN(currentPage) || currentPage < 2 || currentPage > totalPages) notFound();

  const start = FIRST_PAGE_ARTICLES + (currentPage - 2) * ARTICLES_PER_PAGE;
  const pageArticles = articles.slice(start, start + ARTICLES_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="text-sm text-white/40">
            Page {currentPage} of {totalPages}
          </div>
          <CTFeed />
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {pageArticles.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">More Stories</h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {pageArticles.map((article) => (
                  <StoryCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-white/40 text-sm py-12 text-center">No more stories.</div>
          )}

          {/* Leaderboard ad */}
          <div className="flex justify-center">
            <a
              href="https://jup.ag"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full max-w-[728px] h-[90px] overflow-hidden rounded-xl border border-white/10 hover:border-white/20 transition block"
            >
              <video
                src="/jupiter-sushi-ad.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1.5 right-2 text-[9px] text-white/30 tracking-widest uppercase bg-black/40 px-1.5 py-0.5 rounded">Sponsored</span>
              <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xs font-semibold">Jupiter × Sushi</span>
                <span className="text-emerald-300 text-xs font-semibold">Trade on Solana →</span>
              </div>
            </a>
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
