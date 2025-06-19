import { useState, useEffect } from 'react';

export const useScrollVisibility = (threshold: number = 50) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollTop <= threshold);
    };

    // 初期状態を設定（ページ読み込み時は非表示）
    setIsVisible(false);

    // スクロールイベントリスナーを追加
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 少し遅延してから初回チェック（初期レンダリング後）
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [threshold]);

  return isVisible;
};