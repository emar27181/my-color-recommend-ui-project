import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToastContext } from '@/contexts/ToastContext';
import { useColorStore } from '@/store/colorStore';
import { extractColorsFromImage, validateImageFile } from '@/lib/colorExtractor';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { ExtractedColor } from '@/lib/colorExtractor';

interface ImageUploadProps {
  onColorsExtracted?: (colors: ExtractedColor[], dominantColor: ExtractedColor) => void;
}

export const ImageUpload = ({ onColorsExtracted }: ImageUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToastContext();
  const { setExtractedColors } = useColorStore();

  const handleFileSelect = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      showToast(validation.error || '無効なファイルです', 'error');
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      // プレビュー画像を設定
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // 色を抽出（プログレスコールバック付き）
      const result = await extractColorsFromImage(file, 8, (progressValue) => {
        setProgress(progressValue);
      });

      // ストアに保存
      setExtractedColors(result.colors, result.dominantColor);

      // 親コンポーネントに結果を通知
      onColorsExtracted?.(result.colors, result.dominantColor);

      showToast(`${result.colors.length}色を抽出しました`, 'success');
    } catch (error) {
      console.error('Color extraction failed:', error);
      showToast('色の抽出に失敗しました', 'error');
      setProgress(0);
    } finally {
      setIsLoading(false);
      // プログレス完了後、少し待ってから非表示
      setTimeout(() => setProgress(0), 1500);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };


  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="space-y-1 pt-1 flex-1 flex flex-col">
        {/* アップロードエリア */}
        <div
          className="border-2 border-dashed border-border rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer flex-1 flex items-center justify-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <div className="w-full max-w-xs">
                <ProgressBar
                  value={progress}
                  size="md"
                  variant="default"
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground text-center">
                  色を抽出中... ({Math.round(progress)}%)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-0">
              <Upload className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* プレビュー画像 */}
        {previewImage && (
          <div className="mt-4">
            <div className="relative max-w-md mx-auto">
              <img
                src={previewImage}
                alt="アップロードされた画像"
                className="w-full h-auto rounded-lg shadow-sm"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};