import { TranscriptionResponse } from '../types';

export const transcribeAudio = async (audioBlob: Blob, token: string): Promise<string> => {
  if (!token) {
    throw new Error("SiliconFlow API Token is missing. Please configure it in Settings.");
  }

  const formData = new FormData();
  // SiliconFlow expects 'file' and 'model'. 
  // We append the blob with a filename to ensure correct MIME type handling on the server.
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'TeleAI/TeleSpeechASR');

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Note: Do NOT set Content-Type header manually when using FormData, 
        // the browser sets it with the correct boundary.
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorBody}`);
    }

    const data: TranscriptionResponse = await response.json();
    return data.text;
  } catch (error) {
    console.error("Transcription failed:", error);
    throw error;
  }
};
