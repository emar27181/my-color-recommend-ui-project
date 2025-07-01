import { useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Heart, X, RotateCcw } from 'lucide-react';
import palettesData from '@/data/palettes.json';

// コントラスト比を計算して適切なテキスト色を決定
const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

interface ColorPalette {
  id: string;
  colors: string[];
  mainColor: string;
  technique: string;
  tone: string;
  tags: string[];
}

interface SwipeResult {
  paletteId: string;
  liked: boolean;
}

const SwipeRecommender = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeResults, setSwipeResults] = useState<SwipeResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragX, setDragX] = useState(0);

  const palettes: ColorPalette[] = palettesData;
  const currentPalette = palettes[currentIndex];
  const isLastCard = currentIndex >= palettes.length - 1;

  // Debug logging
  console.log('Current palette:', currentPalette);
  console.log('Palettes data:', palettes);

  const handleSwipe = (liked: boolean) => {
    if (isAnimating || !currentPalette) return;
    
    setIsAnimating(true);
    
    // Record the swipe result
    const result: SwipeResult = {
      paletteId: currentPalette.id,
      liked
    };
    
    setSwipeResults(prev => [...prev, result]);
    
    // Move to next card after animation
    setTimeout(() => {
      if (currentIndex < palettes.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
      setIsAnimating(false);
      setDragX(0);
    }, 300);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      handleSwipe(offset > 0);
    } else {
      setDragX(0);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSwipeResults([]);
    setIsAnimating(false);
    setDragX(0);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(false),
    onSwipedRight: () => handleSwipe(true),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  if (isLastCard && swipeResults.length > 0) {
    const likedCount = swipeResults.filter(r => r.liked).length;
    const dislikedCount = swipeResults.filter(r => !r.liked).length;

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground">結果</h2>
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-2">
                  <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-muted-foreground">好き</p>
                <p className="text-xl font-bold text-foreground">{likedCount}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full mb-2">
                  <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-sm text-muted-foreground">嫌い</p>
                <p className="text-xl font-bold text-foreground">{dislikedCount}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center justify-center w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            もう一度試す
          </button>
        </div>
      </div>
    );
  }

  if (!currentPalette) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">配色データが見つかりません</p>
      </div>
    );
  }

  const textColor = currentPalette ? getContrastColor(currentPalette.mainColor) : '#ffffff';

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden px-8 py-6"
      style={{ backgroundColor: currentPalette?.mainColor || '#000000' }}
    >
      {/* Status Bar */}
      <div className="absolute top-8 left-8 right-8 z-20 flex items-center justify-between">
        <div 
          className="px-4 py-2 rounded-2xl backdrop-blur-md text-sm font-medium font-display border-0"
          style={{ 
            backgroundColor: `${textColor}08`,
            color: textColor
          }}
        >
          {currentIndex + 1} / {palettes.length}
        </div>
        <div 
          className="px-4 py-2 rounded-2xl backdrop-blur-md text-sm font-medium font-display border-0"
          style={{ 
            backgroundColor: `${textColor}08`,
            color: textColor
          }}
        >
          SWIPE TO RATE
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex items-center justify-center px-8 py-8">
        <div className="relative w-[80vw] max-w-sm">
          <motion.div
            {...swipeHandlers}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onDrag={(_, info) => setDragX(info.offset.x)}
            animate={{
              x: isAnimating ? (swipeResults[swipeResults.length - 1]?.liked ? 300 : -300) : 0,
              rotate: dragX * 0.15,
              opacity: isAnimating ? 0 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="cursor-grab active:cursor-grabbing select-none"
          >
            {/* Main Color Info Card */}
            <div 
              className="rounded-[2rem] p-10 mb-8 backdrop-blur-md shadow-2xl"
              style={{ 
                backgroundColor: `${textColor}05`,
                border: `4px solid ${textColor}30`
              }}
            >
              {/* Main Color Code */}
              <div className="text-center mb-10">
                <h1 
                  className="text-4xl font-bold mb-4 tracking-[0.2em] font-mono leading-none"
                  style={{ color: textColor }}
                >
                  {currentPalette.mainColor}
                </h1>
                <p 
                  className="text-base opacity-70 font-stylish font-medium tracking-widest uppercase"
                  style={{ color: textColor }}
                >
                  Main Color
                </p>
              </div>

              {/* Color Palette Strip */}
              <div className="mb-8 mx-auto w-[90%]">
                <div className="flex rounded-[1.5rem] overflow-hidden shadow-xl h-20">
                  {currentPalette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1 relative group transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span 
                          className="text-xs font-mono font-medium px-3 py-2 rounded-xl backdrop-blur-md shadow-lg"
                          style={{ 
                            backgroundColor: `${getContrastColor(color)}25`,
                            color: getContrastColor(color)
                          }}
                        >
                          {color}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="space-y-4 mx-auto w-[90%]">
                <div 
                  className="flex items-center justify-between py-4 px-6 rounded-[1.25rem] border-0"
                  style={{ backgroundColor: `${textColor}03` }}
                >
                  <span className="text-sm opacity-60 font-stylish tracking-wider uppercase" style={{ color: textColor }}>
                    Technique
                  </span>
                  <span className="font-semibold font-heading text-base" style={{ color: textColor }}>
                    {currentPalette.technique}
                  </span>
                </div>
                <div 
                  className="flex items-center justify-between py-4 px-6 rounded-[1.25rem] border-0"
                  style={{ backgroundColor: `${textColor}03` }}
                >
                  <span className="text-sm opacity-60 font-stylish tracking-wider uppercase" style={{ color: textColor }}>
                    Tone
                  </span>
                  <span className="font-semibold font-heading text-base" style={{ color: textColor }}>
                    {currentPalette.tone}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mt-6 mx-auto w-[90%]">
                {currentPalette.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 text-sm rounded-[1rem] font-stylish font-medium tracking-wide border-0"
                    style={{ 
                      backgroundColor: `${textColor}06`,
                      color: textColor
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Swipe Indicators */}
          <div className="absolute top-16 left-8 right-8 flex justify-between pointer-events-none z-10">
            <motion.div
              animate={{ 
                opacity: dragX > 50 ? 1 : 0,
                scale: dragX > 50 ? 1.1 : 1
              }}
              className="bg-green-500/95 text-white px-6 py-3 rounded-[1.25rem] text-base font-bold font-display shadow-2xl backdrop-blur-sm"
            >
              ❤️ LIKE
            </motion.div>
            <motion.div
              animate={{ 
                opacity: dragX < -50 ? 1 : 0,
                scale: dragX < -50 ? 1.1 : 1
              }}
              className="bg-red-500/95 text-white px-6 py-3 rounded-[1.25rem] text-base font-bold font-display shadow-2xl backdrop-blur-sm"
            >
              ❌ NOPE
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 p-8 pb-12">
        <div className="flex justify-center space-x-12">
          <button
            onClick={() => handleSwipe(false)}
            disabled={isAnimating}
            className="flex items-center justify-center w-20 h-20 bg-red-500/85 hover:bg-red-500/95 disabled:bg-red-300/40 text-white rounded-[1.5rem] shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-md border-0"
          >
            <X className="w-9 h-9" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => handleSwipe(true)}
            disabled={isAnimating}
            className="flex items-center justify-center w-20 h-20 bg-green-500/85 hover:bg-green-500/95 disabled:bg-green-300/40 text-white rounded-[1.5rem] shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-md border-0"
          >
            <Heart className="w-9 h-9" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeRecommender;