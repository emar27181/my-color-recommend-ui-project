import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToastContext } from '@/contexts/ToastContext';
import { useColorStore } from '@/store/colorStore';
import { extractColorsFromImage, validateImageFile } from '@/lib/colorExtractor';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { ExtractedColor } from '@/lib/colorExtractor';

interface ImageUploadProps {
  onColorsExtracted?: (colors: ExtractedColor[], dominantColor: ExtractedColor) => void;
}

export const ImageUpload = ({ onColorsExtracted }: ImageUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
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
    
    try {
      // プレビュー画像を設定
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // 色を抽出
      const result = await extractColorsFromImage(file, 8);
      
      // ストアに保存
      setExtractedColors(result.colors, result.dominantColor);
      
      // 親コンポーネントに結果を通知
      onColorsExtracted?.(result.colors, result.dominantColor);
      
      showToast(`${result.colors.length}色を抽出しました`, 'success');
    } catch (error) {
      console.error('Color extraction failed:', error);
      showToast('色の抽出に失敗しました', 'error');
    } finally {
      setIsLoading(false);
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          画像から色を抽出
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          画像をアップロードして、使用されている色を抽出します
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* アップロードエリア */}
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
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
              <p className="text-muted-foreground">色を抽出中...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                画像をドラッグ&ドロップするか、クリックして選択
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG、PNG、GIF、WebP（最大10MB）
              </p>
            </div>
          )}
        </div>

        {/* プレビュー画像 */}
        {previewImage && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">アップロードした画像:</h3>
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