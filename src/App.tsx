import { type CanvasColorRecommendationsRef } from '@/components/CanvasColorRecommendations';
import { LayoutRenderer } from '@/components/layout/LayoutRenderer';
import { LAYOUT_CONFIG } from '@/constants/layout';
import { useEffect, useState, useRef, useCallback } from 'react';

const App = () => {

  const [isDebugMode, setIsDebugMode] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [hasLoadedDefaultImage, setHasLoadedDefaultImage] = useState(false);

  // デバイス判定（閾値800px）
  const isMobile = screenSize.width < 800;

  // CanvasColorRecommendationsへの参照
  const canvasColorRecommendationsRef = useRef<CanvasColorRecommendationsRef>(null);

  const DEFAULT_CANVAS_IMAGE = '/images/illust_bear.png';

  // 画像アップロード時の処理
  const handleImageUpload = (imageFile: File) => {
    console.log('Image uploaded, drawing to canvas:', imageFile.name);
    canvasColorRecommendationsRef.current?.drawImageToCanvas(imageFile);
  };

  // キャンバスから色を抽出する処理
  const handleExtractColorsFromCanvas = useCallback(async () => {
    try {
      console.log('Attempting to extract colors from canvas...');

      if (!canvasColorRecommendationsRef.current) {
        console.error('CanvasColorRecommendations ref is null');
        return;
      }

      await canvasColorRecommendationsRef.current.extractColorsFromCanvas();
      console.log('Color extraction completed successfully');
    } catch (error) {
      console.error('Canvas color extraction failed:', error);
    }
  }, []);

  // ホーム画面表示時にレイヤー1へデフォルトのくま線画を読み込み
  useEffect(() => {
    if (hasLoadedDefaultImage) {
      return;
    }

    let timeoutId: number;
    let attempts = 0;
    const maxAttempts = 6;

    const attemptLoad = () => {
      const canvasRef = canvasColorRecommendationsRef.current;
      if (canvasRef) {
        canvasRef.loadImageFromUrl(DEFAULT_CANVAS_IMAGE);
        setHasLoadedDefaultImage(true);
        return;
      }

      if (attempts < maxAttempts) {
        attempts += 1;
        timeoutId = window.setTimeout(attemptLoad, 300);
      }
    };

    timeoutId = window.setTimeout(attemptLoad, 600);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [hasLoadedDefaultImage]);

  useEffect(() => {
    // 初期表示時にページの最上端を表示
    window.scrollTo(0, 0);

    // localStorageから設定を読み込み、なければダークモードをデフォルトに設定
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // 画面サイズを取得・更新する関数
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // 初期画面サイズ設定
    updateScreenSize();

    // F5キーでデバッグモード切り替え
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F5') {
        event.preventDefault(); // ページリロードを防ぐ
        setIsDebugMode(prev => !prev);
      }
    };

    // リサイズイベントリスナー
    window.addEventListener('resize', updateScreenSize);
    document.addEventListener('keydown', handleKeyDown);
    
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', updateScreenSize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 初期スクロール位置を60px下に設定
  useEffect(() => {
    const setScrollPosition = () => {
      // 複数の方法でスクロール位置を設定
      window.scrollTo({ top: 60, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 60;
      document.body.scrollTop = 60;
    };

    // 即座に実行
    setScrollPosition();

    // requestAnimationFrame で次のフレームで実行
    const rafId = requestAnimationFrame(() => {
      setScrollPosition();
    });

    // タイマーでも実行（フォールバック）
    const timerId = setTimeout(() => {
      setScrollPosition();
    }, 0);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, []);

  const deviceType = isMobile ? 'MOBILE/TABLET' : 'DESKTOP';

  return (
    <main className="flex-1 pb-2 min-h-0 flex flex-col" style={isDebugMode ? { backgroundColor: '#607d8b', padding: '16px' } : {}}>
      {/* デバッグ情報表示 */}
      {isDebugMode && (
        <div className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded text-xs font-mono">
          <div>画面: {screenSize.width}x{screenSize.height}</div>
          <div>デバイス: {deviceType}</div>
          <div>800px閾値: {screenSize.width >= 800 ? 'DESKTOP' : 'MOBILE'}</div>
        </div>
      )}

      {/* モバイル表示 */}
      <div className={`${isMobile ? 'flex' : 'hidden'}`}>
        {isDebugMode && (
          <div className="bg-red-600 text-white p-2 text-center font-bold">
            📱 MOBILE/TABLET LAYOUT (&lt;800px)
          </div>
        )}
        <LayoutRenderer
          columns={LAYOUT_CONFIG.desktop.columns}
          isMobile={true}
          isDebugMode={isDebugMode}
          paintCanvasRef={canvasColorRecommendationsRef}
          handleExtractColorsFromCanvas={handleExtractColorsFromCanvas}
          handleImageUpload={handleImageUpload}
        />
      </div>

      {/* デスクトップ表示 */}
      <div className={`${isMobile ? 'hidden' : 'flex'} flex-1`} style={isDebugMode ? { backgroundColor: '#795548', padding: '12px' } : {}}>
        <LayoutRenderer
          columns={LAYOUT_CONFIG.desktop.columns}
          isMobile={false}
          isDebugMode={isDebugMode}
          paintCanvasRef={canvasColorRecommendationsRef}
          handleExtractColorsFromCanvas={handleExtractColorsFromCanvas}
          handleImageUpload={handleImageUpload}
        />
      </div>
    </main>
  );
};

export default App;
