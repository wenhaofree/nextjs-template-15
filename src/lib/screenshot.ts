interface ScreenshotParams {
  url: string;
  size?: '16:9' | '4:3' | '1:1';
}

interface ScreenshotResult {
  success: boolean;
  url?: string;
  error?: string;
  timestamp: string;
}

/**
 * Takes a screenshot of a URL and uploads it to R2 storage
 * @param params Screenshot parameters including URL and aspect ratio
 * @returns Promise with screenshot result including upload URL
 */
export async function captureAndUploadScreenshot(
  params: ScreenshotParams
): Promise<ScreenshotResult> {
  const timestamp = new Date().toISOString();

  try {
    // Prepare screenshot parameters
    const screenshotParams = {
      url: params.url,
      size: params.size || '16:9' as const
    };

    console.log('📸 Initiating screenshot capture:', {
      timestamp,
      ...screenshotParams
    });

    // Use relative paths instead of full URLs
    const response = await fetch('/api/screenshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(screenshotParams),
    });

    if (!response.ok) {
      throw new Error(`Screenshot capture failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    
    console.log('✅ Screenshot captured:', {
      timestamp,
      size: blob.size,
      type: blob.type
    });

    // Prepare upload
    const formData = new FormData();
    const filename = `screenshot-${Date.now()}.png`;
    formData.append('file', blob, filename);

    // Use relative path for upload
    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    const { url } = await uploadResponse.json();

    console.log('✅ Screenshot uploaded:', {
      timestamp,
      url
    });

    return {
      success: true,
      url,
      timestamp
    };

  } catch (error) {
    console.error('❌ Screenshot process failed:', {
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error',
      params
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Screenshot process failed',
      timestamp
    };
  }
} 