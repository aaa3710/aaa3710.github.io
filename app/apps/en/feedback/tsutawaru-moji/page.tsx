import { TsutawaruPage } from '@/components/tsutawaru-page';
import { tsutawaruMetadata } from '@/lib/tsutawaru';

export const dynamic = 'force-static';
export const metadata = tsutawaruMetadata('en', 'feedback');

export default function Page() {
  return <TsutawaruPage locale="en" kind="feedback" />;
}
