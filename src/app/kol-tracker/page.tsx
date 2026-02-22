import KolTable from '@/components/KolTable';
import kols from '../../../data/kols.json';

export default function KolTrackerPage() {
  return (
    <div className="space-y-6">
      <KolTable kols={kols} />
    </div>
  );
}
