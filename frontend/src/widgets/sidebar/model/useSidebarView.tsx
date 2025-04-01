import { createContext, useContext, useState } from 'react';

export type SidebarView = 'main' | 'settings';

const SidebarViewContext = createContext<{
  view: SidebarView;
  setView: (view: SidebarView) => void;
}>({
  view: 'main',
  setView: () => {},
});

export const SidebarViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [view, setView] = useState<SidebarView>('main');
  return (
    <SidebarViewContext.Provider value={{ view, setView }}>
      {children}
    </SidebarViewContext.Provider>
  );
};

export const useSidebarView = () => {
  return useContext(SidebarViewContext);
};
