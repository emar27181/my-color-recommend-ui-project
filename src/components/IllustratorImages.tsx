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

  // シンプルな画像コンポーネント（アニメーション一切なし）
  const StaticImageComponent = ({ 
    src, 
    alt, 
    rank 
  }: { 
    src: string; 
    alt: string; 
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
      <div 
        className="relative" 
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        onMouseEnter={undefined}
        onMouseLeave={undefined}
        onMouseOver={undefined}
        onMouseOut={undefined}
      >
        {/* ローディング表示 */}
        {!isLoaded && (
          <div className="flex items-center justify-center bg-muted rounded-md p-2 min-h-[80px]">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          </div>
        )}
        
        {/* 画像要素（マウスアクション完全無効） */}
        <img
          src={src}
          alt={alt}
          className={`rounded-md w-full block ${
            rank === 1 ? 'object-contain' : 'object-cover'
          } ${isLoaded ? 'block' : 'hidden'}`}
          style={{ 
            aspectRatio: rank === 1 ? 'auto' : '1/1', 
            maxHeight: rank === 1 ? '200px' : '120px',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
          onError={() => handleImageError(src)}
          onLoad={() => handleImageLoad(src)}
          onMouseEnter={undefined}
          onMouseLeave={undefined}
          onMouseOver={undefined}
          onMouseOut={undefined}
          draggable={false}
        />
        
        {/* ランキングバッジ */}
        {rank && isLoaded && !hasError && (
          <div 
            className="absolute top-1 right-1 bg-black bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {rank}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`space-y-3 ${className}`}
      style={{ pointerEvents: 'auto' }}
    >
      {/* 代表画像 */}
      {showRepresentative && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-foreground" />
            <h5 className="text-xs font-medium text-foreground">代表作品</h5>
          </div>
          <StaticImageComponent
            src={representativeUrl}
            alt={`${name}の代表作品`}
          />
        </div>
      )}

      {/* TOP3いいね画像 */}
      {showTopLiked && hasImages && top3Urls.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-red-500" />
            <h5 className="text-xs font-semibold text-foreground">いいね数TOP3</h5>
          </div>
          
          {/* 引用表示 */}
          <div className="border-b border-muted pb-1 mb-1">
            <p className="text-xs text-muted-foreground font-medium">
              引用: 
              <a
                href={`https://instagram.com/${name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary ml-1 font-medium underline"
              >
                @{name}
              </a>
            </p>
          </div>
          
          {/* TOP1画像 */}
          {top3Urls[0] && (
            <div className="mb-1">
              <StaticImageComponent
                src={top3Urls[0]}
                alt={`${name}のいいね数1位の作品`}
                rank={1}
              />
            </div>
          )}
          
          {/* TOP2/3画像 */}
          {(top3Urls[1] || top3Urls[2]) && (
            <div className="grid grid-cols-2 gap-1">
              {top3Urls[1] && (
                <div className="aspect-square">
                  <StaticImageComponent
                    src={top3Urls[1]}
                    alt={`${name}のいいね数2位の作品`}
                  />
                </div>
              )}
              {top3Urls[2] && (
                <div className="aspect-square">
                  <StaticImageComponent
                    src={top3Urls[2]}
                    alt={`${name}のいいね数3位の作品`}
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