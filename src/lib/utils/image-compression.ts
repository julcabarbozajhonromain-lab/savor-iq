import imageCompression from 'browser-image-compression';

export interface CompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

/**
 * Comprime una imagen tomada con la cámara o seleccionada del dispositivo
 * y devuelve el string base64 listo para enviar al servidor.
 */
export async function compressAndConvertToBase64(
  file: File,
  customOptions?: CompressOptions
): Promise<string> {
  const options = {
    maxSizeMB: customOptions?.maxSizeMB ?? 0.8,
    maxWidthOrHeight: customOptions?.maxWidthOrHeight ?? 1280,
    useWebWorker: true,
  };

  try {
    // Si la imagen ya es pequeña (< 400KB), no es necesario sobrecomprimirla
    const fileToProcess = file.size > 400 * 1024 ? await imageCompression(file, options) : file;

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Obtenemos solo los bytes base64 sin prefijo
        const base64Data = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64Data);
      };
      reader.onerror = (err) => reject(new Error('Error al leer el archivo de imagen: ' + err));
      reader.readAsDataURL(fileToProcess);
    });
  } catch (error) {
    console.warn('Advertencia en compresión de imagen, enviando original:', error);
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
