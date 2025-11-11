import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../AppContext';
import { processLimpiadorMagico } from '../services/n8nService';
import { Asset, ProcessedImage } from '../types';
import { Spinner } from './ui';

const backgroundOptions = {
    solido: [
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508328/generated-image-4_ugu1qg.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508327/generated-image-8_jlbyhp.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508325/generated-image-9_mfu3l5.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508324/generated-image-3_bautwd.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508323/generated-image-2_zuu0pt.png'
    ],
    estudio: [
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508245/Gemini_Generated_Image_uy97e2uy97e2uy97_mdmaia.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508246/Gemini_Generated_Image_1hptla1hptla1hpt_emd99d.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508245/Gemini_Generated_Image_kfyj51kfyj51kfyj_dbl5ig.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508246/Gemini_Generated_Image_oa169ooa169ooa16_d7s6tq.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508248/Gemini_Generated_Image_lqjde9lqjde9lqjd_lffxfm.png'
    ],
    mostrador: [
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508304/Gemini_Generated_Image_e8ncdhe8ncdhe8nc_o7q3c7.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508304/Gemini_Generated_Image_grsjdugrsjdugrsj_fa5nnx.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508305/Gemini_Generated_Image_396src396src396s_yyrohw.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508307/Gemini_Generated_Image_6ogmur6ogmur6ogm_vcn0kz.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508307/Gemini_Generated_Image_f2z6x3f2z6x3f2z6_ziz4ye.png'
    ],
};

type BgTab = 'solido' | 'estudio' | 'mostrador' | 'subir';

const MagicCleaner: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { originalFiles, processedImages } = state.magicCleanerState;
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedBg, setSelectedBg] = useState<string | File>(backgroundOptions.estudio[0]);
    const [activeBgTab, setActiveBgTab] = useState<BgTab>('estudio');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const customBgInputRef = useRef<HTMLInputElement>(null);

    const previewUrls = useMemo(() => {
        return originalFiles.map(file => URL.createObjectURL(file));
    }, [originalFiles]);

    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            handleFilesSelected(Array.from(event.target.files));
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files) {
            handleFilesSelected(Array.from(event.dataTransfer.files));
        }
    };
    
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFilesSelected = (files: File[]) => {
        const newFiles = Array.from(files);
        const initialProcessedImages: ProcessedImage[] = newFiles.map(file => ({ originalName: file.name, status: 'idle' }));
        dispatch({ type: 'UPDATE_MAGIC_CLEANER_STATE', payload: { originalFiles: newFiles, processedImages: initialProcessedImages } });
        setError(null);
    };

    const handleCustomBgSelected = (files: File[]) => {
        if (files.length > 0) {
            setSelectedBg(files[0]);
        }
    };

    const handleCustomBgUploadClick = () => {
        customBgInputRef.current?.click();
    };
    
    const handleCustomBgFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            handleCustomBgSelected(Array.from(event.target.files));
        }
    };
    
    const handleCustomBgDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files) {
            handleCustomBgSelected(Array.from(event.dataTransfer.files));
        }
    };
    
    const handleCustomBgDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleCleanImages = async () => {
        setError(null);
        if (selectedBg instanceof File) {
            setError("Los fondos personalizados no son compatibles en este momento. Por favor, selecciona un fondo predefinido.");
            return;
        }
        if (originalFiles.length === 0) {
            setError("Por favor, sube al menos una imagen de producto.");
            return;
        }

        setIsProcessing(true);
        const loadingImages = originalFiles.map(file => ({ originalName: file.name, status: 'loading' as const }));
        dispatch({ type: 'UPDATE_MAGIC_CLEANER_STATE', payload: { processedImages: loadingImages } });

        const processingPromises = originalFiles.map(async (file): Promise<ProcessedImage> => {
            try {
                const response = await processLimpiadorMagico(
                    file,
                    selectedBg,
                    `limpiado-${file.name.split('.')[0]}-${Date.now()}`
                );
                
                if (response.success && response.driveUrl) {
                     const newAsset: Asset = { 
                        id: uuidv4(), 
                        name: `Limpio - ${file.name.split('.')[0]}`, 
                        type: 'image', 
                        url: response.driveUrl, 
                        thumbnailUrl: URL.createObjectURL(file), 
                        createdAt: new Date().toISOString() 
                    };
                    dispatch({ type: 'ADD_ASSET', payload: newAsset });
                    return { originalName: file.name, status: 'success', url: response.driveUrl };
                } else {
                    return { originalName: file.name, status: 'failed', error: response.message };
                }
            } catch (err) {
                 return { originalName: file.name, status: 'failed', error: err instanceof Error ? err.message : 'Error desconocido' };
            }
        });
        
        const newProcessedImages = await Promise.all(processingPromises);

        dispatch({ type: 'UPDATE_MAGIC_CLEANER_STATE', payload: { processedImages: newProcessedImages } });
        setIsProcessing(false);
    };
    
    const isBgSelected = (bg: string | File) => {
        if (selectedBg instanceof File && bg instanceof File) {
            return selectedBg.name === bg.name && selectedBg.size === bg.size;
        }
        return selectedBg === bg;
    };

    const renderBackgroundContent = () => {
        const renderImageGrid = (images: string[]) => (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map(bg => (
                    <div key={bg} onClick={() => setSelectedBg(bg)} className={`aspect-square bg-cover bg-center rounded-lg cursor-pointer transition-all ${isBgSelected(bg) ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-light dark:ring-offset-surface-dark' : ''}`} style={{ backgroundImage: `url("${bg}")` }} />
                ))}
            </div>
        );

        switch (activeBgTab) {
            case 'solido':
                return renderImageGrid(backgroundOptions.solido);
            case 'estudio':
                return renderImageGrid(backgroundOptions.estudio);
            case 'mostrador':
                return renderImageGrid(backgroundOptions.mostrador);
            case 'subir':
                return (
                    <div
                        onClick={handleCustomBgUploadClick}
                        onDrop={handleCustomBgDrop}
                        onDragOver={handleCustomBgDragOver}
                        className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-[#693049] px-6 py-8 flex-grow cursor-pointer hover:border-primary transition-colors h-full"
                    >
                        <input
                            type="file"
                            ref={customBgInputRef}
                            onChange={handleCustomBgFileChange}
                            className="hidden"
                            multiple={false}
                            accept="image/*"
                        />
                        {selectedBg instanceof File ? (
                            <>
                                <img src={URL.createObjectURL(selectedBg)} alt="Previsualización del fondo" className="max-h-24 rounded object-contain" />
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate max-w-full mt-2">{selectedBg.name}</p>
                                <p className="text-xs text-primary mt-1">Haz clic para cambiar</p>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-4xl text-text-secondary-light dark:text-text-secondary-dark">upload</span>
                                <p className="font-bold text-text-primary-light dark:text-white">Subir Fondo</p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Arrastra o haz clic aquí</p>
                            </>
                        )}
                    </div>
                )
            default:
                return null;
        }
    };

    return (
        <main className="p-6 flex flex-col h-screen overflow-hidden">
            <header className="flex-shrink-0">
                <div className="flex flex-wrap justify-between gap-2 mb-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-text-primary-light dark:text-text-primary-dark text-3xl font-black leading-tight tracking-[-0.033em]">Limpiador Mágico</h1>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Sube tus imágenes para eliminar el fondo con un solo clic.</p>
                    </div>
                </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-shrink-0">
                <div className="flex flex-col gap-4">
                    <div 
                        onClick={handleUploadClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#693049] px-6 py-4 cursor-pointer hover:border-primary transition-colors"
                    >
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            multiple={true}
                            accept="image/*"
                        />
                        <p className="text-text-primary-light dark:text-white text-base font-bold">Sube tu Imagen</p>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">Arrastra y suelta tu archivo aquí o haz clic para buscar</p>
                        <div className="mt-2 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-slate-200 dark:bg-[#492233] text-slate-800 dark:text-white text-sm font-bold tracking-[0.015em] hover:bg-slate-300 dark:hover:bg-primary-dark transition-colors">
                            <span className="truncate">Buscar en el Dispositivo</span>
                        </div>
                    </div>
                    {error && <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-400/50 rounded-lg text-red-700 dark:text-red-300 text-sm">{error}</div>}
                    <button onClick={handleCleanImages} disabled={originalFiles.length === 0 || isProcessing} className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="truncate">{isProcessing ? 'Procesando...' : `Limpiar ${originalFiles.length} Imagen(es)`}</span>
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-white/10 p-4 h-full">
                        <h2 className="text-text-primary-light dark:text-white text-lg font-bold leading-tight px-1 mb-2">Elige un Nuevo Fondo</h2>
                        <div className="flex items-center border-b border-slate-200 dark:border-white/10 mb-4 flex-shrink-0">
                            {(['Color Sólido', 'Fondos de Estudio', 'Mostrador', 'Subir Fondo'] as const).map(name => {
                                const tabKey: BgTab = name === 'Color Sólido' ? 'solido' : name === 'Fondos de Estudio' ? 'estudio' : name === 'Mostrador' ? 'mostrador' : 'subir';
                                return (
                                    <button key={name} onClick={() => setActiveBgTab(tabKey)} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeBgTab === tabKey ? 'border-primary text-primary dark:text-white' : 'border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white'}`}>
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="overflow-y-auto custom-scrollbar pr-2 flex-grow">
                            {renderBackgroundContent()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pt-4 flex-grow min-h-0">
                 <div className="flex flex-col gap-2 h-full">
                    <h2 className="text-text-primary-light dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4">Original</h2>
                    <div className="flex-grow p-2 overflow-y-auto custom-scrollbar bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-white/10 min-h-0">
                        {previewUrls.length > 0 ? (
                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                               {previewUrls.map((url, index) => (
                                   <div key={index} className="aspect-square rounded overflow-hidden bg-white/5 flex items-center justify-center">
                                       <img src={url} alt={`Original ${index + 1}`} className="w-full h-full object-contain" />
                                   </div>
                               ))}
                           </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-white/20">image</span>
                           </div>
                        )}
                    </div>
                </div>
                 <div className="flex flex-col gap-2 h-full">
                    <h2 className="text-text-primary-light dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4">Resultado</h2>
                    <div className="flex-grow p-2 overflow-y-auto custom-scrollbar bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-white/10 min-h-0">
                        {processedImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {processedImages.map((image, index) => (
                                    <div key={index} className="aspect-square rounded bg-slate-100 dark:bg-white/5 flex items-center justify-center p-2">
                                        {image.status === 'success' && image.url && (
                                            <a href={image.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-2 text-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors w-full h-full bg-green-50 dark:bg-green-500/10 rounded-md">
                                                <span className="material-symbols-outlined text-4xl">download_for_offline</span>
                                                <span className="text-xs font-bold">Ver y Descargar</span>
                                            </a>
                                        )}
                                        {image.status === 'loading' && <Spinner message="" />}
                                        {image.status === 'failed' && <span className="material-symbols-outlined text-red-500 text-4xl" title={image.error}>error</span>}
                                        {image.status === 'idle' && <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-white/20">hourglass_empty</span>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="flex items-center justify-center h-full">
                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-white/20">auto_awesome</span>
                           </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MagicCleaner;