// This file was auto-generated to fix missing type definitions.

export enum Tab {
  Home = 'HOME',
  MagicCleaner = 'Limpiador Mágico',
  VirtualModels = 'Modelos Virtuales',
  AdCreator = 'Creador de Anuncios',
  BackgroundCreator = 'Creador de Fondos',
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  createdAt: string; // ISO date string
}

export interface Task {
  id:string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  error?: string | null;
}

export interface ProcessedImage {
  originalName: string;
  status: 'loading' | 'success' | 'failed' | 'idle';
  url?: string; // only on success
  error?: string; // only on failure
}

export interface MagicCleanerState {
  originalFiles: File[];
  processedImages: ProcessedImage[];
  error: string | null;
}

export interface ModelCriteria {
  gender: string;
  age: string;
  skinColor: string;
  hairColor: string;
}

export interface VirtualModelsState {
  productFile: File | null;
  criteria: ModelCriteria;
  generatedImages: string[];
  error: string | null;
}

export interface AdCreatorState {
  selectedTemplateId: string | null;
  assetFile: File | null;
  generatedVideos: { a: string | null; b: string | null };
  error: string | null;
}

export interface BackgroundCreatorState {
  productFile: File | null;
  generatedBackgrounds: string[];
  isGenerating: boolean;
  error: string | null;
}

export interface AppState {
  isAuthenticated: boolean;
  currentUser: string | null;
  assets: Asset[];
  tasks: Task[];
  magicCleanerState: MagicCleanerState;
  virtualModelsState: VirtualModelsState;
  adCreatorState: AdCreatorState;
  backgroundCreatorState: BackgroundCreatorState;
}

export type AppAction =
  | { type: 'LOGIN'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'ADD_ASSET'; payload: Asset }
  | { type: 'REMOVE_ASSET'; payload: string }
  | { type: 'START_TASK'; payload: Task }
  | { type: 'COMPLETE_TASK'; payload: { taskId: string; status: 'completed' | 'failed'; error?: string | null } }
  | { type: 'CLEAR_COMPLETED_TASKS' }
  | { type: 'UPDATE_MAGIC_CLEANER_STATE'; payload: Partial<MagicCleanerState> }
  | { type: 'UPDATE_VIRTUAL_MODELS_STATE'; payload: Partial<VirtualModelsState> }
  | { type: 'UPDATE_AD_CREATOR_STATE'; payload: Partial<AdCreatorState> }
  | { type: 'UPDATE_BACKGROUND_CREATOR_STATE'; payload: Partial<BackgroundCreatorState> };