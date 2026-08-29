import { PlaceholderPage } from '@/components/placeholder-page';
import { placeholderMetadata } from '@/lib/placeholder-metadata';

export const dynamic = 'force-static';

export const metadata = placeholderMetadata('ja', 'card-relay', 'CardRelay');

export default function Page() {
  return <PlaceholderPage locale="ja" slug="card-relay" />;
}
