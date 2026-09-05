import { LocationLoggerPage } from '@/components/location-logger-page';
import { locationLoggerMetadata } from '@/lib/location-logger';

export const dynamic = 'force-static';
export const metadata = locationLoggerMetadata('ja', 'feedback');

export default function Page() {
  return <LocationLoggerPage locale="ja" kind="feedback" />;
}
