import React, { useRef } from 'react';
import { useAppContext } from '../AppContext';
import { Spinner } from './ui';

// Dummy images for mock generation
const mockGeneratedImages = [
    "https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508245/Gemini_Generated_Image_uy97e2uy97e2uy97_mdmaia.png",
    "https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508246/Gemini_Generated_Image_1hptla1hptla1hpt_emd99d.png",
    "https://res.cloudinary.com/dlrwldqhr/image/upload/v1762508307/Gemini_Generated_Image_f2z6x3f2z6x3f2z6_ziz4ye.png",
    "https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550069/Gemini_Generated_Image_e36lr8e36lr8e36l_bl7eks.png",
    "https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550069/Gemini_Generated_Image_3n2y2q3n2y2q3n2y_cbq87c.png",
    "https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550067/Gemini_Generated_Image_rxpq3vrxpq3vrxpq_hwfzv8.png",
    "https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550066/Gemini_Generated_Image_jsl84yjsl84yjsl8_zxvarw.png",
    "https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550035/Gemini_Generated_Image_4jmtlj4jmtlj4jmt_mv63o3.png",
    "https://res.cloudinary.com/dlrwldqhr/image/upload/v1762550033/Gemini_Generated_Image_61t61d61t61d61t6_lqyp98.png",
];


const BackgroundCreator: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { productFile, generatedBackgrounds, isGenerating } = state.backgroundCreatorState;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            dispatch({
                type: 'UPDATE_BACKGROUND_CREATOR_STATE',
                payload: { productFile: files[0], generatedBackgrounds: [] }
            });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            handleFileSelected(Array.from(event.target.files));
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files) {
            handleFileSelected(Array.from(event.dataTransfer.files));
        }
    };
    
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    // Mock generation function
    const handleGenerate = () => {
        dispatch({ type: 'UPDATE_BACKGROUND_CREATOR_STATE', payload: { isGenerating: true, generatedBackgrounds: [] } });
        
        // Simulate API call
        setTimeout(() => {
            dispatch({ 
                type: 'UPDATE_BACKGROUND_CREATOR_STATE', 
                payload: { 
                    isGenerating: false, 
                    // Shuffle mock images for variety
                    generatedBackgrounds: [...mockGeneratedImages].sort(() => 0.5 - Math.random()) 
                } 
            });
        }, 2000);
    };

    return (
        <div className="bg-[#1f2024] text-white font-display h-screen flex items-center justify-center p-8">
            <div className="grid grid-cols-12 gap-8 w-full max-w-7xl mx-auto">
                {/* Left Column */}
                <div className="col-span-4 flex flex-col justify-center items-center text-center">
                    <div className="w-full max-w-sm">
                        <h2 className="text-2xl font-bold mb-2">Paso 1: Sube tu producto</h2>
                        <p className="text-gray-400 mb-6">Una foto clara sobre un fondo simple funciona mejor.</p>
                        
                        <div
                            onClick={handleUploadClick}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="aspect-square w-full rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center mb-6 cursor-pointer hover:border-blue-500 transition-colors p-4"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            {productFile ? (
                                <img src={URL.createObjectURL(productFile)} alt="Product Preview" className="max-w-full max-h-full object-contain rounded-md" />
                            ) : (
                                <p className="text-gray-500">Haz clic o arrastra una imagen</p>
                            )}
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={!productFile || isGenerating}
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                            <span>{isGenerating ? 'Generando...' : 'Generar 9 Fotos'}</span>
                        </button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-8">
                    <h2 className="text-2xl font-bold mb-2">Paso 2: Tus fotos generadas por IA</h2>
                    <p className="text-gray-400 mb-6">9 nuevas imágenes listas para tu tienda.</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                        {isGenerating ? (
                            Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-800 rounded-lg animate-pulse"></div>
                            ))
                        ) : generatedBackgrounds.length > 0 ? (
                            generatedBackgrounds.map((imgSrc, i) => (
                                <div key={i} className="aspect-square bg-gray-800 rounded-lg overflow-hidden group relative">
                                    <img src={imgSrc} alt={`Generated background ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                             <span className="material-symbols-outlined">download</span>
                                         </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                             Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-800/50 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-600 text-4xl">photo_library</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackgroundCreator;
