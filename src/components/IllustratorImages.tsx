import { useState } from 'react';
import { getIllustratorImageUrl } from '@/lib/imageUtils';
import { getActualTop3Images, hasTopLikedImages } from '@/lib/imageLoader';
import { Image, ImageOff, Heart } from 'lucide-react';

interface IllustratorImagesProps {
  name: string;
  showTopLiked?: boolean;
  showRepresentative?: boolean;
  className?: string;
}

export default function IllustratorImages({ 
  name, 
  showTopLiked = false, 
  showRepresentative = true,
  className = ""
}: IllustratorImagesProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => ({ ...prev, [imageUrl]: true }));
  };

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => ({ ...prev, [imageUrl]: true }));
  };

  const representativeUrl = getIllustratorImageUrl(name);
  const top3Urls = getActualTop3Images(name);
  const hasImages = hasTopLikedImages(name);

  const ImageComponent = ({ 
    src, 
    alt, 
    title,
    rank 
  }: { 
    src: string; 
    alt: string; 
    title?: string;
    rank?: number;
  }) => {
    const hasError = imageErrors[src];
    const isLoaded = loadedImages[src];

    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-2 min-h-[80px]">
          <ImageOff className="w-6 h-6 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground text-center">画像なし</span>
        </div>
      );
    }

    return (
      <div className="relative group">
        {!isLoaded && (
          <div className="flex items-center justify-center bg-muted rounded-lg p-2 min-h-[80px]">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          title={title}
          className={`rounded-lg object-cover w-full transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
          } hover:opacity-90 cursor-pointer`}
          style={{ aspectRatio: '1/1', maxHeight: '120px' }}
          onError={() => handleImageError(src)}
          onLoad={() => handleImageLoad(src)}
        />
        {/* いいね順位表示 */}
        {rank && isLoaded && !hasError && (
          <div className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {rank}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 代表画像 */}
      {showRepresentative && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-muted-foreground" />
            <h5 className="text-xs font-medium text-foreground">代表作品</h5>
          </div>
          <ImageComponent
            src={representativeUrl}
            alt={`${name}の代表作品`}
            title="代表作品"
          />
        </div>
      )}

      {/* TOP3いいね画像 */}
      {showTopLiked && hasImages && top3Urls.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <h5 className="text-xs font-medium text-foreground">いいね数TOP3</h5>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {top3Urls.map((url, index) => (
              <ImageComponent
                key={url}
                src={url}
                alt={`${name}のいいね数${index + 1}位の作品`}
                title={`いいね数${index + 1}位`}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* 画像がない場合のメッセージ */}
      {showTopLiked && !hasImages && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <h5 className="text-xs font-medium text-foreground">いいね数TOP3</h5>
          </div>
          <div className="flex items-center justify-center bg-muted rounded-lg p-4 min-h-[80px]">
            <span className="text-xs text-muted-foreground">画像データなし</span>
          </div>
        </div>
      )}
    </div>
  );
}