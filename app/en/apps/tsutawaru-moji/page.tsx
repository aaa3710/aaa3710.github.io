import { PlaceholderPage } from '@/components/placeholder-page';
import { placeholderMetadata } from '@/lib/placeholder-metadata';

export const dynamic = 'force-static';

export const metadata = placeholderMetadata(
  'en',
  'tsutawaru-moji',
  'TsutawaruMoji',
);

export default function Page() {
  return <PlaceholderPage locale="en" slug="tsutawaru-moji" />;
}
