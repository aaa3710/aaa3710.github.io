import { TsutawaruPage } from '@/components/tsutawaru-page';
import { tsutawaruMetadata } from '@/lib/tsutawaru';

export const dynamic = 'force-static';
export const metadata = tsutawaruMetadata('en', 'support');

export default function Page() {
  return <TsutawaruPage locale="en" kind="support" />;
}
