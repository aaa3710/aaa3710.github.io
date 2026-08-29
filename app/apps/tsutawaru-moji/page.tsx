import { PlaceholderPage } from '@/components/placeholder-page';
import { placeholderMetadata } from '@/lib/placeholder-metadata';

export const dynamic = 'force-static';

export const metadata = placeholderMetadata(
  'ja',
  'tsutawaru-moji',
  'TsutawaruMoji',
);

export default function Page() {
  return <PlaceholderPage locale="ja" slug="tsutawaru-moji" />;
}
