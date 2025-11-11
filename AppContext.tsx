import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { AppState, AppAction, Asset, MagicCleanerState, VirtualModelsState, AdCreatorState, BackgroundCreatorState, ModelCriteria } from './types';

const initialMagicCleanerState: MagicCleanerState = {
  originalFiles: [],
  processedImages: [],
  error: null,
};

const initialVirtualModelsState: VirtualModelsState = {
  productFile: null,
  criteria: {
    gender: 'Femenino',
    age: '26-40 años',
    skinColor: 'Latina',
    hairColor: 'Castaño',
  },
  generatedImages: [],
  error: null,
};

const initialAdCreatorState: AdCreatorState = {
  selectedTemplateId: null,
  assetFile: null,
  modelCriteria: {
    gender: 'Femenino',
    age: '26-40 años',
    skinColor: 'Latina',
    hairColor: 'Castaño',
  },
  generatedVideos: { a: null, b: null },
  error: null,
};

const initialBackgroundCreatorState: BackgroundCreatorState = {
  productFile: null,
  generatedBackgrounds: [],
  isGenerating: false,
  error: null,
};


const initialState: AppState = {
  isAuthenticated: false,
  currentUser: null,
  assets: [],
  tasks: [],
  magicCleanerState: initialMagicCleanerState,
  virtualModelsState: initialVirtualModelsState,
  adCreatorState: initialAdCreatorState,
  backgroundCreatorState: initialBackgroundCreatorState,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, currentUser: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('dunaAppState');
      // Reset tool states but keep assets for the session
      return { 
          ...initialState, 
          assets: state.assets,
          magicCleanerState: initialMagicCleanerState,
          virtualModelsState: initialVirtualModelsState,
          adCreatorState: initialAdCreatorState,
          backgroundCreatorState: initialBackgroundCreatorState,
       };
    case 'ADD_ASSET':
      // Prevent duplicate assets
      if (state.assets.some(asset => asset.url === action.payload.url)) return state;
      return { ...state, assets: [action.payload, ...state.assets] };
    case 'REMOVE_ASSET':
      return { ...state, assets: state.assets.filter(asset => asset.id !== action.payload) };
    case 'START_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'COMPLETE_TASK':
        return {
            ...state,
            tasks: state.tasks.map(task =>
                task.id === action.payload.taskId
                    ? { ...task, status: action.payload.status, error: action.payload.error }
                    : task
            ),
        };
    case 'CLEAR_COMPLETED_TASKS':
        return {
            ...state,
            tasks: state.tasks.filter(task => task.status === 'running'),
        };
    case 'UPDATE_MAGIC_CLEANER_STATE':
        return { ...state, magicCleanerState: { ...state.magicCleanerState, ...action.payload }};
    case 'UPDATE_VIRTUAL_MODELS_STATE':
        return { ...state, virtualModelsState: { ...state.virtualModelsState, ...action.payload }};
    case 'UPDATE_AD_CREATOR_STATE':
        return { ...state, adCreatorState: { ...state.adCreatorState, ...action.payload }};
    case 'UPDATE_BACKGROUND_CREATOR_STATE':
        return { ...state, backgroundCreatorState: { ...state.backgroundCreatorState, ...action.payload }};
    default:
      return state;
  }
};


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    try {
        const storedState = localStorage.getItem('dunaAppState');
        if (storedState) {
            const parsed = JSON.parse(storedState);
            // Blobs can't be stored. Filter out any assets that rely on expired blob URLs.
            if (parsed.assets) {
                parsed.assets = parsed.assets.filter((asset: Asset) => !asset.url.startsWith('blob:'));
            }
             // Same for generated videos in the AdCreator state
            if (parsed.adCreatorState && parsed.adCreatorState.generatedVideos) {
                if (parsed.adCreatorState.generatedVideos.a?.startsWith('blob:')) {
                    parsed.adCreatorState.generatedVideos.a = null;
                }
                 if (parsed.adCreatorState.generatedVideos.b?.startsWith('blob:')) {
                    parsed.adCreatorState.generatedVideos.b = null;
                }
            }
            return { ...initial, ...parsed, tasks: [] }; // Reset tasks on load
        }
    } catch (error) {
        console.error("Failed to parse state from localStorage", error);
    }
    return initial;
  });

  useEffect(() => {
    // CRITICAL: Create a copy of the state and remove non-serializable File objects before persisting.
    const stateToPersist = JSON.parse(JSON.stringify(state));
    
    // Remove File objects to prevent state corruption on reload
    delete stateToPersist.tasks;
    if (stateToPersist.magicCleanerState) {
        stateToPersist.magicCleanerState.originalFiles = [];
    }
    if (stateToPersist.virtualModelsState) {
        stateToPersist.virtualModelsState.productFile = null;
    }
    if (stateToPersist.adCreatorState) {
        stateToPersist.adCreatorState.assetFile = null;
    }
    if (stateToPersist.backgroundCreatorState) {
        stateToPersist.backgroundCreatorState.productFile = null;
    }

    localStorage.setItem('dunaAppState', JSON.stringify(stateToPersist));
  }, [state]);


  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);