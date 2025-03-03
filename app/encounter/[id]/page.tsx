import { Suspense } from 'react';
import EncounterPage from '../../components/EncounterPage';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function EncounterRoute({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EncounterPage encounterId={parseInt(params.id)} />
    </Suspense>
  );
}