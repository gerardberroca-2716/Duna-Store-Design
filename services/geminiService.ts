import { ModelCriteria, AppAction } from '../types';

// TODO: Reemplaza esta URL con la URL de tu webhook de n8n.
const N8N_WEBHOOK_URL = 'https://n8n-n8n.wjxct0.easypanel.host/webhook-test/661f599b-9835-4c50-a91c-4f1bdb90981e';

// Función helper para manejar las peticiones a n8n
const postToN8n = async (body: object) => {
    const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la llamada a n8n: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return result.data; // Asumimos que n8n devuelve { "data": { ... } }
};


export const cleanProductImage = async (
  dispatch: (action: AppAction) => void,
  taskId: string,
  base64Image: string,
  mimeType: string,
  background?: { type: 'url' | 'base64'; value: string }
): Promise<string> => {
  try {
    const payload = {
        task: 'cleanImage',
        image: base64Image,
        mimeType: mimeType,
        background,
    };
    const result = await postToN8n(payload);
    
    if (!result.imageBase64) {
        throw new Error('La respuesta de n8n no contenía los datos de imagen esperados.');
    }
    return result.imageBase64;
  } catch (error) {
    console.error("Error en cleanProductImage vía n8n:", error);
    dispatch({ type: 'COMPLETE_TASK', payload: { taskId, status: 'failed', error: 'Error al limpiar la imagen.' } });
    throw error;
  }
};

export const generateVirtualModel = async (
  dispatch: (action: AppAction) => void,
  taskId: string,
  productImage: string,
  mimeType: string,
  criteria: ModelCriteria,
  scene: string,
  modelImageBase64?: string
): Promise<string> => {
  try {
    const payload = {
        task: 'generateModel',
        image: productImage,
        modelImage: modelImageBase64,
        mimeType: mimeType,
        criteria: { ...criteria, scene }
    };
    const result = await postToN8n(payload);

    if (!result.imageBase64) {
        throw new Error('La respuesta de n8n no contenía los datos de imagen esperados.');
    }
    return result.imageBase64;
  } catch (error) {
    console.error("Error en generateVirtualModel vía n8n:", error);
    dispatch({ type: 'COMPLETE_TASK', payload: { taskId, status: 'failed', error: 'Error al generar el modelo.' } });
    throw error;
  }
};

export const generateAdVideo = async (
  dispatch: (action: AppAction) => void,
  taskId: string,
  assetImage: string,
  mimeType: string,
  templatePrompt: string
): Promise<string> => {
    try {
        const payload = {
            task: 'generateVideo',
            image: assetImage,
            mimeType: mimeType,
            prompt: templatePrompt
        };
        const result = await postToN8n(payload);

        if (!result.videoUrl) {
            throw new Error("La respuesta de n8n no contenía la URL del video esperada.");
        }
        
        // n8n puede devolver una URL pública directamente, o podrías configurarlo para devolver los bytes del video.
        // Aquí asumimos que devuelve una URL pública que el navegador puede usar directamente.
        return result.videoUrl;

    } catch (error) {
        console.error("Error en generateAdVideo vía n8n:", error);
        dispatch({ type: 'COMPLETE_TASK', payload: { taskId, status: 'failed', error: 'Error al generar el video.' } });
        throw error;
    }
};