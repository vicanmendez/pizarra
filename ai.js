// Archivo: ai.js (Versión 3 - CORREGIDA Y SIMPLIFICADA)

/**
 * @class GeminiImageProcessor
 * Clase para procesar una imagen (desde una Data URL) con la API de Google Gemini.
 * Utiliza el método de una sola llamada multimodal, ideal para el navegador.
 */
class GeminiImageProcessor {
    /**
     * @param {string} apiKey - La clave de API de Google Gemini.
     */
    constructor(apiKey) {
      if (typeof window.google === 'undefined' || typeof window.google.generativeai === 'undefined') {
        throw new Error("El SDK de Google Generative AI no se ha cargado. Revisa el orden de los scripts en tu HTML.");
      }
      if (!apiKey) {
        throw new Error("Se requiere una clave de API de Gemini para inicializar la clase.");
      }
      this.genAI = new window.google.generativeai.GoogleGenerativeAI(apiKey);
    }
  
    /**
     * Convierte una Data URL (base64) a un objeto GenerativePart para la API.
     * La API de Gemini puede procesar imágenes en formato base64 directamente.
     * @private
     * @param {string} dataUrl - La cadena 'data:image/png;base64,...'.
     * @returns {object} Un objeto compatible con la API de Gemini.
     */
    #dataUrlToGenerativePart(dataUrl) {
      // Extraemos el tipo MIME y los datos en base64 de la URL
      const match = dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,(.*)$/);
      if (!match) {
          throw new Error("Formato de Data URL inválido. Debe ser una imagen png, jpeg o webp en base64.");
      }
      
      return {
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      };
    }
    
    /**
     * Procesa una imagen desde una Data URL y genera contenido.
     *
     * @param {string} dataUrl - La cadena 'data:image/png;base64,...'.
     * @param {string} prompt - El prompt o la pregunta sobre la imagen.
     * @param {string} [generativeModel="gemini-1.5-flash"] - El modelo a usar.
     * @returns {Promise<string>} El texto generado por el modelo.
     */
    async generateContentFromDataUrl(dataUrl, prompt, generativeModel = "gemini-1.5-flash") {
      console.log("Iniciando proceso de IA desde Data URL...");
      try {
        // 1. Obtener el modelo generativo.
        const model = this.genAI.getGenerativeModel({ model: generativeModel });
  
        // 2. Convertir la Data URL a una parte que la API entiende.
        const imagePart = this.#dataUrlToGenerativePart(dataUrl);
  
        // 3. Enviar el prompt y la imagen en una sola petición.
        console.log("Generando contenido...");
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
  
        console.log("Proceso completado exitosamente.");
        return text;
  
      } catch (error) {
        console.error("Error en el proceso de Gemini:", error);
        // Devolvemos el mensaje de error para que la UI lo pueda mostrar.
        throw new Error(`Error al procesar con IA: ${error.message}`);
      }
    }
  }