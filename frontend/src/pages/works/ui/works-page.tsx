import { Layout } from 'widgets/sidebar';
import { MainPageLayout } from './main-layout';

export function WorksPage() {
  return (
    <div className="flex">
      <Layout />
      <MainPageLayout />
    </div>
  );
}
