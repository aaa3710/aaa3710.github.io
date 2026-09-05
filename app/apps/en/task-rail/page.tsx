import { PlaceholderPage } from '@/components/placeholder-page';
import { placeholderMetadata } from '@/lib/placeholder-metadata';

export const dynamic = 'force-static';

export const metadata = placeholderMetadata('en', 'task-rail', 'TaskRail');

export default function Page() {
  return <PlaceholderPage locale="en" slug="task-rail" />;
}
