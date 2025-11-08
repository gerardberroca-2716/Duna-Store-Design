import React, { useState, Suspense } from 'react';
import { Tab } from './types';
import { Spinner } from './components/ui';
import Login from './components/Login';
import { useAppContext } from './AppContext';
import { GlobalTaskRunner } from './components/GlobalTaskRunner';
import { DunaStoreLogo } from './components/Logo';


const Welcome = React.lazy(() => import('./components/Welcome'));
const MagicCleaner = React.lazy(() => import('./components/MagicCleaner'));
const VirtualModels = React.lazy(() => import('./components/VirtualModels'));
const AdCreator = React.lazy(() => import('./components/AdCreator'));
const BackgroundCreator = React.lazy(() => import('./components/BackgroundCreator'));

const tabComponents: Record<Tab, React.LazyExoticComponent<React.FC<any>>> = {
  [Tab.Home]: Welcome,
  [Tab.MagicCleaner]: MagicCleaner,
  [Tab.VirtualModels]: VirtualModels,
  [Tab.AdCreator]: AdCreator,
  [Tab.BackgroundCreator]: BackgroundCreator,
};

const tabIcons: Record<Tab, string> = {
  [Tab.Home]: 'home',
  [Tab.MagicCleaner]: 'auto_fix_high',
  [Tab.VirtualModels]: 'person',
  [Tab.AdCreator]: 'campaign',
  [Tab.BackgroundCreator]: 'wallpaper',
}

const App: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Home);
  const ActiveComponent = tabComponents[activeTab];

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  if (!state.isAuthenticated) {
    return <Login onLoginSuccess={(username) => dispatch({ type: 'LOGIN', payload: username })} />;
  }

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-display">
      <aside className="flex w-64 flex-col justify-between bg-surface-dark p-4 shrink-0">
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
                 <div className="size-10 flex items-center justify-center">
                    <DunaStoreLogo />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white text-base font-bold leading-normal">Duna Store</h1>
                    <p className="text-text-secondary-dark/70 text-sm font-normal leading-normal">AI Studio</p>
                </div>
            </div>
            <nav className="flex flex-col gap-2">
                {(Object.values(Tab) as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                            activeTab === tab
                            ? 'bg-primary-dark text-white'
                            : 'text-text-secondary-dark hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <span className={`material-symbols-outlined ${activeTab === tab ? 'fill' : ''}`}>{tabIcons[tab]}</span>
                        <p className="text-sm font-medium leading-normal">{tab}</p>
                    </button>
                ))}
            </nav>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
            <GlobalTaskRunner />
             <button onClick={handleLogout} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-text-secondary-dark w-full text-left">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-primary-darker flex items-center justify-center font-bold text-white">
                        {state.currentUser?.[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{state.currentUser}</span>
                </div>
                <span className="material-symbols-outlined">logout</span>
            </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Spinner message="Cargando Módulo..." /></div>}>
            <ActiveComponent setActiveTab={setActiveTab} />
        </Suspense>
      </main>
    </div>
  );
};

export default App;