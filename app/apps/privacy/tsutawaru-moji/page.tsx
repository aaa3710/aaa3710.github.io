import { TsutawaruPage } from '@/components/tsutawaru-page';
import { tsutawaruMetadata } from '@/lib/tsutawaru';

export const dynamic = 'force-static';
export const metadata = tsutawaruMetadata('ja', 'privacy');

export default function Page() {
  return <TsutawaruPage locale="ja" kind="privacy" />;
}
