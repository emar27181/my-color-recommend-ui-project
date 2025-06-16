export interface CopyResult {
  success: boolean;
  error?: string;
}

export const copyToClipboard = async (text: string): Promise<CopyResult> => {
  try {
    if (!navigator.clipboard) {
      // フォールバック: execCommandを使用
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        return { success: true };
      } else {
        return { success: false, error: 'Copy command failed' };
      }
    }

    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};