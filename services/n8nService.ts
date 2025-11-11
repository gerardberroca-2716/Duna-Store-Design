// src/services/n8nService.ts
import { fileToBase64 } from './utils';

const N8N_WEBHOOK_URL = 'https://n8n-n8n.wjxct0.easypanel.host/webhook/a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5g6h7';

export interface LimpiadorMagicoResponse {
  success: boolean;
  message: string;
  driveUrl?: string;
  fileName?: string;
  details?: any;
}

export async function processLimpiadorMagico(
  productFile: File,
  backgroundUrl: string,
  imageTitle: string,
  productDescription?: string,
  backgroundStyle?: string
): Promise<LimpiadorMagicoResponse> {
  try {
    console.log('🚀 Enviando a n8n como JSON:', {
      productFileName: productFile.name,
      productFileSize: productFile.size,
      backgroundUrl,
      imageTitle
    });

    const productImageBase64 = await fileToBase64(productFile);

    const payload = {
      'function': 'limpiador-magico',
      productImage: {
        fileName: productFile.name,
        mimeType: productFile.type,
        data: productImageBase64,
      },
      backgroundUrl,
      imageTitle,
      productDescription,
      backgroundStyle,
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: LimpiadorMagicoResponse = await response.json();
    console.log('✅ Respuesta de n8n:', data);

    return data;
  } catch (error) {
    console.error('❌ Error en processLimpiadorMagico:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
      details: error,
    };
  }
}
