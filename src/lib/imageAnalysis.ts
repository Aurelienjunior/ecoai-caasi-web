
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js for in-browser use
env.allowLocalModels = false;
env.useBrowserCache = true;

// Define the types for our analysis result
export interface AnalysisResult {
  volume: string;
  price: string;
  wasteType: string;
  detectedItems?: string[];
  error?: string;
}

// Helper to load a file blob into an HTMLImageElement
export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = URL.createObjectURL(file);
  });
};

// The core analysis function
export const analyzeTrashImage = async (imageElement: HTMLImageElement): Promise<AnalysisResult> => {
  try {
    // Initialize the image segmentation pipeline
    // This will download the model from Hugging Face Hub the first time it's run.
    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512');

    // Run segmentation on the image
    const segmentationResult = await segmenter(imageElement.src);

    if (!Array.isArray(segmentationResult)) {
      return { volume: 'N/A', price: 'N/A', wasteType: 'N/A', error: 'Analysis failed: Invalid result format.', detectedItems: [] };
    }
    
    // Define labels that we consider as trash items
    const trashLabels = ['bag', 'box', 'carton', 'bottle', 'can', 'barrel', 'case', 'container', 'package', 'waste', 'trash'];

    // Filter for trash items based on labels
    const trashItems = segmentationResult.filter(item => trashLabels.includes(item.label));

    // Get unique labels of detected items
    const detectedItemLabels = [...new Set(trashItems.map(item => item.label))];
    
    const itemCount = trashItems.length;

    // Determine volume and price based on the number of detected items
    if (itemCount === 0) {
      return { volume: 'Small', price: 'XAF 250', wasteType: 'General', detectedItems: [] };
    } else if (itemCount <= 2) {
      return { volume: 'Medium', price: 'XAF 500', wasteType: 'General', detectedItems: detectedItemLabels };
    } else if (itemCount <= 5) {
      return { volume: 'Large', price: 'XAF 1000', wasteType: 'General', detectedItems: detectedItemLabels };
    } else {
      return { volume: 'Extra Large', price: 'XAF 1500', wasteType: 'General', detectedItems: detectedItemLabels };
    }

  } catch (error) {
    console.error('Error during image analysis:', error);
    return { volume: 'N/A', price: 'N/A', wasteType: 'N/A', error: 'Could not analyze image. The model may have failed to load.', detectedItems: [] };
  }
};
