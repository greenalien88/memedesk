import LaunchTable from '@/components/LaunchTable';
import launches from '../../../data/launches.json';

export default function LaunchesPage() {
  return (
    <div className="space-y-6">
      <LaunchTable launches={launches} />
    </div>
  );
}
