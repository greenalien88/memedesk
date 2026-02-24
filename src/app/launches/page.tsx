import type { Metadata } from 'next';
import LaunchTable from '@/components/LaunchTable';
import launches from '../../../data/launches.json';

export const metadata: Metadata = {
  title: 'New Launches',
  description: 'Latest memecoin launches on pump.fun and beyond.',
  alternates: { canonical: 'https://memedesk.vercel.app/launches' },
};

export default function LaunchesPage() {
  return (
    <div className="space-y-6">
      <LaunchTable launches={launches} />
    </div>
  );
}
