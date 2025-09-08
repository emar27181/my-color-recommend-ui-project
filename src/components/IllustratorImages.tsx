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
        <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2 min-h-[80px]">
          <ImageOff className="w-6 h-6 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground text-center">画像なし</span>
        </div>
      );
    }

    return (
      <div className="relative group">
        {!isLoaded && (
          <div className="flex items-center justify-center bg-muted rounded-md p-2 min-h-[80px]">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          title={title}
          className={`rounded-md w-full transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
          } hover:opacity-90 cursor-pointer ${
            rank === 1 ? 'object-contain' : 'object-cover'
          }`}
          style={{ 
            aspectRatio: rank === 1 ? 'auto' : '1/1', 
            maxHeight: rank === 1 ? '200px' : '120px' 
          }}
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

      {/* TOP3いいね画像 - コンパクトレイアウト */}
      {showTopLiked && hasImages && top3Urls.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-red-500" />
            <h5 className="text-xs font-semibold text-foreground">いいね数TOP3</h5>
          </div>
          
          {/* 引用表示 - スタイリッシュなデザイン */}
          <div className="border-b border-muted/40 pb-1 mb-1">
            <p className="text-xs text-muted-foreground font-medium">
              引用: 
              <a
                href={`https://instagram.com/${name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/70 transition-colors ml-1 font-medium underline decoration-dotted underline-offset-2"
              >
                @{name}
              </a>
            </p>
          </div>
          
          {/* TOP1 - 大きく表示 */}
          {top3Urls[0] && (
            <div className="mb-1">
              <ImageComponent
                src={top3Urls[0]}
                alt={`${name}のいいね数1位の作品`}
                title="いいね数1位"
                rank={1}
              />
            </div>
          )}
          
          {/* TOP2/3 - 小さく横並び */}
          {(top3Urls[1] || top3Urls[2]) && (
            <div className="grid grid-cols-2 gap-1">
              {top3Urls[1] && (
                <div className="aspect-square">
                  <ImageComponent
                    src={top3Urls[1]}
                    alt={`${name}のいいね数2位の作品`}
                    title="いいね数2位"
                  />
                </div>
              )}
              {top3Urls[2] && (
                <div className="aspect-square">
                  <ImageComponent
                    src={top3Urls[2]}
                    alt={`${name}のいいね数3位の作品`}
                    title="いいね数3位"
                  />
                </div>
              )}
            </div>
          )}
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