import { useState } from 'react';

export type SidebarView = 'main' | 'settings';

export const useSidebarView = () => {
  const [view, setView] = useState<SidebarView>('main');
  return { view, setView };
};
