import { useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Heart, X, RotateCcw } from 'lucide-react';
import palettesData from '@/data/palettes.json';

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">スワイプ式色推薦</h1>
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} / {palettes.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm">
          {/* Color Card */}
          <motion.div
            {...swipeHandlers}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onDrag={(_, info) => setDragX(info.offset.x)}
            animate={{
              x: isAnimating ? (swipeResults[swipeResults.length - 1]?.liked ? 300 : -300) : 0,
              rotate: dragX * 0.1,
              opacity: isAnimating ? 0 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="bg-card border border-border rounded-xl p-6 shadow-lg cursor-grab active:cursor-grabbing select-none"
          >
            {/* Main Color */}
            <div className="mb-4">
              <div 
                className="w-full h-32 rounded-lg mb-2"
                style={{ backgroundColor: currentPalette.mainColor }}
              />
              <p className="text-center text-sm font-mono text-muted-foreground">
                {currentPalette.mainColor}
              </p>
            </div>

            {/* Color Palette */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground mb-2">カラーパレット</h3>
              <div className="flex space-x-2">
                {currentPalette.colors.map((color, index) => (
                  <div key={index} className="flex-1">
                    <div 
                      className="w-full h-12 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-xs font-mono text-muted-foreground mt-1 text-center">
                      {color}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technique and Tone */}
            <div className="mb-4 space-y-2">
              <div>
                <span className="text-sm font-medium text-foreground">配色技法: </span>
                <span className="text-sm text-muted-foreground">{currentPalette.technique}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">トーン: </span>
                <span className="text-sm text-muted-foreground">{currentPalette.tone}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {currentPalette.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Swipe Indicators */}
          <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
            <motion.div
              animate={{ opacity: dragX > 50 ? 1 : 0 }}
              className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium"
            >
              LIKE
            </motion.div>
            <motion.div
              animate={{ opacity: dragX < -50 ? 1 : 0 }}
              className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium"
            >
              NOPE
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 p-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleSwipe(false)}
            disabled={isAnimating}
            className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-full shadow-lg transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={() => handleSwipe(true)}
            disabled={isAnimating}
            className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-full shadow-lg transition-colors"
          >
            <Heart className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeRecommender;