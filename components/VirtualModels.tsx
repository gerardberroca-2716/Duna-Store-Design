import React, { useState, useMemo, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../AppContext';
import { fileToBase64 } from '../services/utils';
import { Asset, ModelCriteria } from '../types';
import { Spinner } from './ui';

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

const backgrounds = {
    'Estudio': [
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550073/Gemini_Generated_Image_o25kzro25kzro25k_glrmeb.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550074/Gemini_Generated_Image_bwl7nhbwl7nhbwl7_mt2d3n.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550071/Gemini_Generated_Image_2lq7ro2lq7ro2lq7_lb4ago.png',
    ],
    'Urbano': [
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550069/Gemini_Generated_Image_e36lr8e36lr8e36l_bl7eks.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550069/Gemini_Generated_Image_3n2y2q3n2y2q3n2y_cbq87c.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550067/Gemini_Generated_Image_rxpq3vrxpq3vrxpq_hwfzv8.png',
    ],
    'Casero': [
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550066/Gemini_Generated_Image_jsl84yjsl84yjsl8_zxvarw.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550063/Gemini_Generated_Image_5p7xgu5p7xgu5p7x_qzlcxv.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550062/Gemini_Generated_Image_mcgck8mcgck8mcgc_of95wv.png',
    ],
    'Profesional': [
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550035/Gemini_Generated_Image_4jmtlj4jmtlj4jmt_mv63o3.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550033/Gemini_Generated_Image_61t61d61t61d61t6_lqyp98.png',
        'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550033/Gemini_Generated_Image_v8qzrqv8qzrqv8qz_ag3zvk.png',
    ]
};

const ageRanges = ['5-12 años', '13-17 años', '18-25 años', '26-40 años', '41-60 años', '60+ años'];
const skinColors = ['Clara', 'Latina', 'Morena', 'Asiática'];
const hairColors = ['Castaño', 'Negro', 'Rubio', 'Pelirrojo', 'Blanco/Gris'];

const CustomSelect = ({ label, name, value, onChange, options, ...props }: { label: string, name: keyof ModelCriteria, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark" htmlFor={name}>{label}</label>
        <select name={name} id={name} value={value} onChange={onChange} className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/20 rounded-lg text-sm px-3 py-2 text-text-primary-light dark:text-white focus:ring-primary focus:border-primary hover:bg-slate-200 dark:hover:bg-white/10 transition-colors appearance-none" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23e6e6e6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}} {...props}>
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);


const VirtualModels: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { productFile, criteria, generatedImages } = state.virtualModelsState;
    const [isProcessing, setIsProcessing] = useState(false);
    const [creationMode, setCreationMode] = useState<'choose' | 'create'>('choose');
    const [selectedPredefinedGender, setSelectedPredefinedGender] = useState<'female' | 'male'>('female');
    const modelsToShow = useMemo(() => selectedPredefinedGender === 'female' ? femaleModels : maleModels, [selectedPredefinedGender]);
    const [selectedModel, setSelectedModel] = useState(modelsToShow[0].url);
    const [activeBgTab, setActiveBgTab] = useState<keyof typeof backgrounds>('Estudio');
    const [selectedBg, setSelectedBg] = useState(backgrounds['Estudio'][0]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSelectedModel(modelsToShow[0].url);
    }, [modelsToShow]);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            dispatch({ type: 'UPDATE_VIRTUAL_MODELS_STATE', payload: { productFile: files[0], generatedImages: [] } });
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) handleFileSelected(Array.from(event.target.files));
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files) handleFileSelected(Array.from(event.dataTransfer.files));
    };
    
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    
    const handleUploadClick = () => fileInputRef.current?.click();

    const handleCriteriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newCriteria: ModelCriteria = { ...criteria, [name]: value };
        dispatch({ type: 'UPDATE_VIRTUAL_MODELS_STATE', payload: { criteria: newCriteria } });
    };

    const handleGenerateModel = () => {
        if (!productFile) return;
        setIsProcessing(true);
        dispatch({ type: 'UPDATE_VIRTUAL_MODELS_STATE', payload: { generatedImages: [] } });
        
        // MOCK: Simulate API processing
        setTimeout(() => {
            const mockImageUrl = "https://res.cloudinary.com/dlrwldqhr/image/upload/v1762900898/mock-generated-model_qj8nku.png";

            dispatch({ type: 'UPDATE_VIRTUAL_MODELS_STATE', payload: { generatedImages: [mockImageUrl] } });
            
            const newAsset: Asset = { 
                id: uuidv4(), 
                name: `Modelo - ${productFile.name.split('.')[0]}`, 
                type: 'image', 
                url: mockImageUrl, 
                thumbnailUrl: mockImageUrl, 
                createdAt: new Date().toISOString() 
            };
            dispatch({ type: 'ADD_ASSET', payload: newAsset });

            setIsProcessing(false);
        }, 2500); // 2.5 second delay
    };

    return (
        <main className="flex-1 p-8 grid grid-rows-[auto_1fr] gap-8 h-screen overflow-hidden">
            <header>
                <p className="text-text-primary-light dark:text-text-primary-dark text-4xl font-black leading-tight tracking-[-0.033em]">Modelos Virtuales</p>
            </header>
            <div className="grid grid-cols-12 gap-6 h-full min-h-0">
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 h-full">
                    
                    <div className="flex flex-col gap-4 rounded-xl p-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-white/10">
                        <h2 className="text-text-primary-light dark:text-white text-base font-bold leading-tight tracking-[-0.015em]">Sube tu Producto</h2>
                        <div onClick={handleUploadClick} onDrop={handleDrop} onDragOver={handleDragOver} className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-[#693049] p-6 flex-grow cursor-pointer hover:border-primary transition-colors">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple={false} accept="image/*" />
                            {productFile ? (
                                <img src={URL.createObjectURL(productFile)} alt="Product preview" className="size-24 rounded object-contain" />
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <button type="button" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors gap-2">
                                        <span className="material-symbols-outlined">upload</span>
                                        <span className="truncate">Subir Archivo</span>
                                    </button>
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2">o arrastra y suelta aquí</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-white/10 flex-grow">
                        <h2 className="text-text-primary-light dark:text-white text-base font-bold leading-tight tracking-[-0.015em]">Elige Fondo</h2>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {(Object.keys(backgrounds) as Array<keyof typeof backgrounds>).map(tab => (
                                    <button key={tab} onClick={() => setActiveBgTab(tab)} className={`w-full rounded-lg text-sm px-3 py-2 transition-colors border ${activeBgTab === tab ? 'bg-primary/10 dark:bg-white/10 border-primary text-primary-dark dark:text-white font-bold' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/20 text-text-secondary-light dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {backgrounds[activeBgTab].map(imgUrl => (
                                    <div key={imgUrl} className={`relative aspect-square rounded-lg overflow-hidden group cursor-pointer ring-2 transition-all ${selectedBg === imgUrl ? 'ring-primary' : 'ring-transparent hover:ring-primary/50'}`} onClick={() => setSelectedBg(imgUrl)}>
                                        <img className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" src={imgUrl} alt={`Fondo ${activeBgTab}`} />
                                        {selectedBg === imgUrl && (
                                             <div className="absolute top-1.5 right-1.5 bg-primary rounded-full p-0.5 shadow-md"><span className="material-symbols-outlined text-sm text-white" style={{fontVariationSettings: "'FILL' 1, 'wght' 700"}}>check</span></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        <button onClick={handleGenerateModel} disabled={!productFile || isProcessing} className="w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors shadow-[0_5px_20px_-5px_rgba(247,38,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                            <span className="truncate">{isProcessing ? 'Generando...' : 'Generar Modelo'}</span>
                        </button>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-7 h-full flex flex-col gap-6">
                     <div className="flex flex-col gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-white/10">
                        <div className="flex flex-col gap-3">
                             <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-lg">
                                <button onClick={() => setCreationMode('choose')} className={`w-1/2 py-1 px-3 text-sm font-bold rounded-md transition-colors ${creationMode === 'choose' ? 'bg-primary text-white shadow' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>Elegir Modelo</button>
                                <button onClick={() => setCreationMode('create')} className={`w-1/2 py-1 px-3 text-sm font-bold rounded-md transition-colors ${creationMode === 'create' ? 'bg-primary text-white shadow' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>Crear Modelo</button>
                            </div>
                        </div>

                        {creationMode === 'create' && (
                             <div className="flex flex-col gap-4">
                                <h3 className="text-text-primary-light dark:text-white text-base font-bold leading-tight tracking-[-0.015em]">Define tu Modelo</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CustomSelect label="Género" name="gender" value={criteria.gender} onChange={handleCriteriaChange} options={['Femenino', 'Masculino']} />
                                    <CustomSelect label="Edad" name="age" value={criteria.age} onChange={handleCriteriaChange} options={ageRanges} />
                                    <CustomSelect label="Color de Piel" name="skinColor" value={criteria.skinColor} onChange={handleCriteriaChange} options={skinColors} />
                                    <CustomSelect label="Color de Cabello" name="hairColor" value={criteria.hairColor} onChange={handleCriteriaChange} options={hairColors} />
                                </div>
                            </div>
                        )}

                        {creationMode === 'choose' && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-text-primary-light dark:text-white text-base font-bold leading-tight tracking-[-0.015em]">Modelos Predefinidos</h3>
                                    <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-lg">
                                        <button onClick={() => setSelectedPredefinedGender('female')} className={`py-1 px-3 text-sm font-bold rounded-md transition-colors ${selectedPredefinedGender === 'female' ? 'bg-primary text-white shadow' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>Mujer</button>
                                        <button onClick={() => setSelectedPredefinedGender('male')} className={`py-1 px-3 text-sm font-bold rounded-md transition-colors ${selectedPredefinedGender === 'male' ? 'bg-primary text-white shadow' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>Hombre</button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="flex overflow-x-auto custom-scrollbar -mx-2 px-2 py-4">
                                        <div className="flex items-stretch gap-4">
                                            {modelsToShow.map(model => (
                                                <div key={model.id} onClick={() => setSelectedModel(model.url)} className={`flex-shrink-0 w-32 aspect-[3/4] rounded-xl overflow-hidden cursor-pointer ring-2 transition-all ${selectedModel === model.url ? 'ring-primary ring-offset-2 ring-offset-surface-light dark:ring-offset-surface-dark' : 'ring-transparent hover:ring-primary/50'}`}>
                                                    <img src={model.url} alt={`Modelo ${model.id}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col flex-grow min-h-0">
                        <h2 className="text-text-primary-light dark:text-white text-base font-bold leading-tight tracking-[-0.015em] mb-3">Resultados</h2>
                        <div className="flex flex-col flex-grow items-center justify-center gap-4 rounded-xl bg-surface-light dark:bg-surface-dark p-6 text-center border border-slate-200 dark:border-white/10">
                             {isProcessing ? (
                                <Spinner message="Generando modelo..." />
                            ) : generatedImages.length > 0 ? (
                                <img src={generatedImages[0]} alt="Generated model" className="rounded-lg object-contain max-h-full max-w-full" />
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-white/30">image_search</span>
                                    <p className="text-text-secondary-light dark:text-white/70">El resultado de tu modelo generado aparecerá aquí.</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VirtualModels;