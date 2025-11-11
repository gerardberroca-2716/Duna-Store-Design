import React, { useState, useEffect, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../AppContext';
import { Asset, ModelCriteria } from '../types';
import { Spinner, CustomSelect } from './ui';
import { AssetInput } from './AssetInput';

// --- Templates for "Artículos" ---
const articleTemplates = [
    {
        id: 'template-1',
        name: 'Anuncio Casero',
        prompt: 'Un video dinámico y emocionante de unboxing del producto en la imagen, con confeti y destellos de luz. Estilo de anuncio de redes sociales.',
        videoUrl: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577955/TOP_Rol_ia_director_202511071634_ulp7q_noi3sp.mp4',
        thumbnail: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577955/TOP_Rol_ia_director_202511071634_ulp7q_noi3sp.jpg',
    },
    {
        id: 'template-2',
        name: '360 de producto',
        prompt: 'Un video de exhibición elegante, el producto en la imagen gira lentamente 360 grados sobre un pedestal minimalista. Iluminación de estudio profesional.',
        videoUrl: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577955/TOP_Rol_ia_artista_202511071634_ntzf6_kgqpu0.mp4',
        thumbnail: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577955/TOP_Rol_ia_artista_202511071634_ntzf6_kgqpu0.jpg',
    },
    {
        id: 'template-3',
        name: 'Unboxing',
        prompt: 'El producto en la imagen se revela épicamente en la cima de una montaña al amanecer, con nubes arremolinándose a su alrededor. Estilo cinematográfico.',
        videoUrl: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577952/TOP_Necesito_crear_videos_202511071636_jfxe2_qy37zs.mp4',
        thumbnail: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577952/TOP_Necesito_crear_videos_202511071636_jfxe2_qy37zs.jpg',
    },
    {
        id: 'template-4',
        name: 'Zoom Producto',
        prompt: 'Un video tipo testimonio, donde el producto es presentado en un ambiente hogareño y acogedor, como si un cliente satisfecho lo estuviera mostrando.',
        videoUrl: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577951/TOP_Necesito_crear_videos_202511071637_tz7lj_hs7scl.mp4',
        thumbnail: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577951/TOP_Necesito_crear_videos_202511071637_tz7lj_hs7scl.jpg',
    },
];

// --- Templates for "Modelos" ---
const modelTemplates = [
    {
        id: 'model-template-1',
        name: 'Urbano pasarela',
        prompt: 'Un video reel moderno y rápido para Instagram o TikTok. Un modelo usa el producto en un entorno urbano genial. Música enérgica y cortes rápidos.',
        videoUrl: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577961/TOPRol_ia_fotografa_202511071629_hnkgd_a4bm3v.mp4',
        thumbnail: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577961/TOPRol_ia_fotografa_202511071629_hnkgd_a4bm3v.jpg',
    },
    {
        id: 'model-template-2',
        name: 'Reel cambio de fondo',
        prompt: 'Un video cálido y acogedor que muestra a un modelo usando el producto de forma natural en un hogar confortable. Enfocado en la relajación y el uso diario.',
        videoUrl: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577958/TOP_Rol_ia_director_202511071630_9wxp3_w2gmdi.mp4',
        thumbnail: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577958/TOP_Rol_ia_director_202511071630_9wxp3_w2gmdi.jpg',
    },
    {
        id: 'model-template-3',
        name: 'Modelo Posando',
        prompt: 'Un video sofisticado y elegante. Un modelo presenta el producto en un estudio de lujo o un entorno minimalista. Movimientos lentos y elegantes.',
        videoUrl: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577958/TOP_Rol_ia_fotografa_202511071632_fcfl0_wvryww.mp4',
        thumbnail: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577958/TOP_Rol_ia_fotografa_202511071632_fcfl0_wvryww.jpg',
    },
    {
        id: 'model-template-4',
        name: 'Prenda y modelo',
        prompt: 'Un video inspirador y aventurero. Un modelo usa el producto mientras explora la naturaleza. Enfocado en la durabilidad y la libertad.',
        videoUrl: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577952/TOP_Necesito_crear_videos_202511071635_pc4yl_y332yv.mp4',
        thumbnail: 'https://res.cloudinary.com/dlrwldqhr/video/upload/v1762577952/TOP_Necesito_crear_videos_202511071635_pc4yl_y332yv.jpg',
    },
];

const femaleModels = [
    { id: 'f1', url: 'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762547116/Gemini_Generated_Image_eq5my2eq5my2eq5m_puzefi.png' },
    { id: 'f2', url: 'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762547112/Gemini_Generated_Image_8ut1sn8ut1sn8ut1_mqhs20.png' },
    { id: 'f3', url: 'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762547112/Gemini_Generated_Image_pxp2gmpxp2gmpxp2_hoa3wb.png' },
    { id: 'f4', url: 'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762547111/Gemini_Generated_Image_y7t2rpy7t2rpy7t2_vszoo9.png' },
    { id: 'f5', url: 'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762547111/Gemini_Generated_Image_6k168g6k168g6k16_wxywlq.png' },
];

const maleModels = [
    { id: 'm1', url: 'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762547112/Gemini_Generated_Image_gpn40hgpn40hgpn4_wdzip6.png' },
    { id: 'm2', url: 'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762547122/Gemini_Generated_Image_w4mzydw4mzydw4mz_yxwffp.png' },
    { id: 'm3', url: 'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762547120/Gemini_Generated_Image_ipzis8ipzis8ipzi_biyqmz.png' },
    { id: 'm4', url: 'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762547119/Gemini_Generated_Image_9wacgs9wacgs9wac_reuce4.png' },
    { id: 'm5', url: 'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762547118/Gemini_Generated_Image_lmesxclmesxclmes_a6shp1.png' },
];

const ageRanges = ['5-12 años', '13-17 años', '18-25 años', '26-40 años', '41-60 años', '60+ años'];
const skinColors = ['Clara', 'Latina', 'Morena', 'Asiática'];
const hairColors = ['Castaño', 'Negro', 'Rubio', 'Pelirrojo', 'Blanco/Gris'];

const TemplateVideo: React.FC<{
    videoUrl: string;
    thumbnail: string;
}> = ({ videoUrl, thumbnail }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        videoRef.current?.play().catch(error => console.warn("Autoplay was prevented:", error));
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-slate-800 rounded-lg" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={thumbnail}
                muted
                loop
                playsInline
                src={videoUrl}
                preload="metadata"
            />
        </div>
    );
};


const AdCreator: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { selectedTemplateId, assetFile, modelCriteria, generatedVideos } = state.adCreatorState;
    const [isProcessing, setIsProcessing] = useState(false);
    const [adType, setAdType] = useState<'articles' | 'models'>('articles');
    
    const [displayableVideoUrl, setDisplayableVideoUrl] = useState<string | null>(null);

    // State for model selection
    const [creationMode, setCreationMode] = useState<'choose' | 'create'>('choose');
    const [selectedPredefinedGender, setSelectedPredefinedGender] = useState<'female' | 'male'>('female');
    const modelsToShow = useMemo(() => selectedPredefinedGender === 'female' ? femaleModels : maleModels, [selectedPredefinedGender]);
    const [selectedModel, setSelectedModel] = useState(modelsToShow[0]?.url);

    useEffect(() => {
        if (modelsToShow.length > 0) {
            setSelectedModel(modelsToShow[0].url);
        }
    }, [modelsToShow]);


    const templatesToShow = adType === 'articles' ? articleTemplates : modelTemplates;
    
    useEffect(() => {
        // Reset template selection when ad type changes
        dispatch({ type: 'UPDATE_AD_CREATOR_STATE', payload: { selectedTemplateId: null } });
    }, [adType, dispatch]);

    useEffect(() => {
        let objectUrl: string | null = null;
        const sourceUrl = generatedVideos.a;

        const fetchResultVideo = async () => {
            if (!sourceUrl) {
                setDisplayableVideoUrl(null);
                return;
            }
            // If it's already a blob, don't re-fetch
            if (sourceUrl.startsWith('blob:')) {
                setDisplayableVideoUrl(sourceUrl);
                return;
            }

            try {
                const response = await fetch(sourceUrl);
                if (!response.ok) throw new Error('Failed to fetch result video');
                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);
                setDisplayableVideoUrl(objectUrl);
            } catch (error) {
                console.error("Error fetching result video:", error);
                setDisplayableVideoUrl(null); 
            }
        };

        fetchResultVideo();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [generatedVideos.a]);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            dispatch({ type: 'UPDATE_AD_CREATOR_STATE', payload: { assetFile: files[0], generatedVideos: { a: null, b: null } } });
        }
    };

    const handleSelectTemplate = (id: string) => {
        dispatch({ type: 'UPDATE_AD_CREATOR_STATE', payload: { selectedTemplateId: id } });
    };

    const handleCriteriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newCriteria: ModelCriteria = { ...modelCriteria, [name as keyof ModelCriteria]: value };
        dispatch({ type: 'UPDATE_AD_CREATOR_STATE', payload: { modelCriteria: newCriteria } });
    };

    const handleGenerateVideo = () => {
        if (!assetFile || !selectedTemplateId) return;

        setIsProcessing(true);
        
        // MOCK: Simulate API processing
        setTimeout(() => {
            const template = templatesToShow.find(t => t.id === selectedTemplateId);
            if (!template) {
                setIsProcessing(false);
                return;
            };

            const videoUrl = template.videoUrl;
            
            dispatch({ type: 'UPDATE_AD_CREATOR_STATE', payload: { generatedVideos: { ...generatedVideos, a: videoUrl } } });
            const newAsset: Asset = { id: uuidv4(), name: `${template.name} - ${assetFile.name.split('.')[0]}`, type: 'video', url: videoUrl, thumbnailUrl: URL.createObjectURL(assetFile), createdAt: new Date().toISOString() };
            dispatch({ type: 'ADD_ASSET', payload: newAsset });
            
            setIsProcessing(false);
        }, 3000); // 3 second delay
    };

    return (
        <main className="flex-1 p-8 flex flex-col overflow-hidden h-screen">
            <div className="flex flex-col h-full">
                <header className="flex flex-wrap justify-between gap-3 mb-6">
                    <h1 className="text-text-primary-light dark:text-text-primary-dark text-4xl font-black leading-tight tracking-[-0.033em]">Creador de Anuncios</h1>
                </header>
                
                 <div className="flex flex-col flex-1 gap-6 min-h-0">
                    <section className="flex flex-col gap-4">
                        <h2 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold leading-tight tracking-[-0.015em]">Tipo de Anuncio</h2>
                        <div className="flex gap-4">
                            <button onClick={() => setAdType('articles')} className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 w-7/12 justify-center transition-colors ${adType === 'articles' ? 'border-primary text-primary dark:text-text-primary-dark bg-primary/10' : 'border-slate-200 dark:border-white/20 text-text-secondary-light dark:text-text-secondary-dark hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                                <span className="material-symbols-outlined">inventory_2</span>
                                <span>Artículos</span>
                            </button>
                            <button onClick={() => setAdType('models')} className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 w-5/12 justify-center transition-colors ${adType === 'models' ? 'border-primary text-primary dark:text-text-primary-dark bg-primary/10' : 'border-slate-200 dark:border-white/20 text-text-secondary-light dark:text-text-secondary-dark hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                                <span className="material-symbols-outlined">person</span>
                                <span>Modelos</span>
                            </button>
                        </div>
                    </section>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                        {/* --- LEFT COLUMN --- */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            <section className="flex flex-col">
                                <h2 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Sección 1: Elige una Plantilla</h2>
                                <div className="grid grid-cols-4 gap-4">
                                    {templatesToShow.map(template => (
                                        <div key={template.id} onClick={() => handleSelectTemplate(template.id)} className={`flex flex-col gap-2 rounded-xl w-full cursor-pointer border-2 transition-all ${selectedTemplateId === template.id ? 'border-primary ring-4 ring-primary/20' : 'border-transparent hover:border-primary/50'}`}>
                                            <div className="w-full bg-center bg-no-repeat aspect-[9/16] bg-cover rounded-lg flex flex-col items-center justify-center bg-slate-800 overflow-hidden">
                                                <TemplateVideo
                                                    videoUrl={template.videoUrl}
                                                    thumbnail={template.thumbnail}
                                                />
                                            </div>
                                            <div className="px-1 pb-1">
                                                <p className="text-text-primary-light dark:text-text-primary-dark text-xs font-medium leading-normal truncate">{template.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="flex flex-col gap-4 bg-surface-light dark:bg-surface-dark p-6 rounded-xl flex-1">
                                <h2 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold leading-tight tracking-[-0.015em]">
                                    {adType === 'articles' ? 'Sección 2: Sube tu Activo' : 'Sección 3: Sube tu Producto'}
                                </h2>
                                <AssetInput onFilesSelected={handleFileSelected} multiple={false}>
                                    {assetFile ? (
                                        <div className="flex flex-col items-center gap-2 text-center">
                                            <img src={URL.createObjectURL(assetFile)} alt="Asset preview" className="max-h-32 rounded object-contain" />
                                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark truncate">{assetFile.name}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <span className="material-symbols-outlined text-text-secondary-light/70 dark:text-text-secondary-dark/70 text-4xl mb-3">upload_file</span>
                                            <p className="mb-2 text-sm text-text-secondary-light/70 dark:text-text-secondary-dark/70"><span className="font-semibold">Arrastra tu imagen o video</span></p>
                                            <p className="text-xs text-text-secondary-light/50 dark:text-text-secondary-dark/50">o haz clic para buscar</p>
                                        </div>
                                    )}
                                </AssetInput>
                            </section>
                        </div>
                        
                        {/* --- RIGHT COLUMN --- */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                           {adType === 'models' && (
                                <section className="flex flex-col gap-4 bg-surface-light dark:bg-surface-dark p-6 rounded-xl">
                                    <h2 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold leading-tight tracking-[-0.015em]">Sección 2: Elige un Modelo</h2>
                                    
                                    <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-lg">
                                        <button onClick={() => setSelectedPredefinedGender('female')} className={`w-1/2 py-1 px-3 text-sm font-bold rounded-md transition-colors ${selectedPredefinedGender === 'female' ? 'bg-primary text-white shadow' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>Mujer</button>
                                        <button onClick={() => setSelectedPredefinedGender('male')} className={`w-1/2 py-1 px-3 text-sm font-bold rounded-md transition-colors ${selectedPredefinedGender === 'male' ? 'bg-primary text-white shadow' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>Hombre</button>
                                    </div>
                                    
                                    <div className="relative">
                                        <div className="flex overflow-x-auto custom-scrollbar -mx-2 px-2 py-4">
                                            <div className="flex items-stretch gap-4">
                                                {modelsToShow.map(model => (
                                                    <div key={model.id} onClick={() => setSelectedModel(model.url)} className={`flex-shrink-0 w-24 aspect-[3/4] rounded-xl overflow-hidden cursor-pointer ring-2 transition-all ${selectedModel === model.url ? 'ring-primary ring-offset-2 ring-offset-surface-light dark:ring-offset-surface-dark' : 'ring-transparent hover:ring-primary/50'}`}>
                                                        <img src={model.url} alt={`Modelo ${model.id}`} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            <section className="flex flex-col gap-4 bg-surface-light dark:bg-surface-dark p-6 rounded-xl flex-1">
                                <h2 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold leading-tight tracking-[-0.015em]">
                                    {adType === 'articles' ? 'Sección 3: Resultados' : 'Sección 4: Resultado del Video'}
                                </h2>
                                <div className="flex items-center justify-center w-full flex-1 rounded-xl bg-background-light dark:bg-background-dark min-h-[250px]">
                                    {isProcessing ? (
                                        <Spinner message="Generando video..." />
                                    ) : displayableVideoUrl ? (
                                        <video src={displayableVideoUrl} controls autoPlay loop className="w-full h-full object-contain rounded-lg" />
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-slate-300 dark:text-text-secondary-dark/30 text-6xl">videocam</span>
                                            <p className="mt-2 text-text-secondary-light/50 dark:text-text-secondary-dark/50 text-sm">El video aparecerá aquí</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-shrink-0">
                                    <button onClick={handleGenerateVideo} disabled={!assetFile || !selectedTemplateId || isProcessing} className="bg-primary hover:bg-primary-dark w-full text-white font-bold py-3 px-8 rounded-lg transition-colors text-base shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                        <span>{isProcessing ? 'Generando...' : 'Generar Anuncio'}</span>
                                    </button>
                                </div>
                            </section>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdCreator;