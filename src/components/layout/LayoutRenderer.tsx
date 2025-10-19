import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { useColorStore } from '@/store/colorStore';
import { ColorPicker } from '@/components/ColorPicker';
import { ColorRecommendations, ToneRecommendations } from '@/components/ColorRecommendations';
import { ImageUpload } from '@/components/ImageUpload';
import { ExtractedColorsDisplay } from '@/components/ExtractedColorsDisplay';
import { SkinColorRecommendations } from '@/components/SkinColorRecommendations';
import { HueToneExtraction } from '@/components/HueToneExtraction';
// import { PaintCanvas, type PaintCanvasRef } from '@/components/PaintCanvas';
import { CanvasColorRecommendations, type CanvasColorRecommendationsRef } from '@/components/CanvasColorRecommendations';
import { COMPONENT_CONFIG, LAYOUT_CONFIG, type ComponentKey, type LayoutColumn } from '@/constants/layout';

interface LayoutRendererProps {
  columns: readonly LayoutColumn[];
  isMobile: boolean;
  isDebugMode: boolean;
  paintCanvasRef: React.RefObject<CanvasColorRecommendationsRef | null>;
  handleExtractColorsFromCanvas: () => void;
  handleImageUpload: (file: File) => void;
  collapseStates: Record<string, boolean>;
  setCollapseState: (key: string, value: boolean) => void;
}

// 色使用量バーコンポーネント
const ColorUsageBar = () => {
  const { extractedColors } = useColorStore();
  
  return (
    <div className="pt-4 mt-4 px-6 pb-4 bg-orange-200">
      {/* 実際の抽出色バー（強制表示） */}
      <div className="mt-4 mb-4 mx-2 w-full h-4 rounded-sm overflow-hidden flex border border-white bg-white">
        {extractedColors.map((color, index) => (
          <div
            key={`${color.hex}-segment-${index}`}
            className="h-full"
            style={{
              backgroundColor: color.hex,
              width: `${color.usage * 100}%`,
              minWidth: '20px',
              height: '16px'
            }}
            title={`${color.hex}: ${(color.usage * 100).toFixed(1)}%`}
          >
            &nbsp;
          </div>
        ))}
      </div>
    </div>
  );
};

// コンポーネントマッピング
const ComponentMap = {
  canvas: () => (
    <div>Canvas component disabled</div>
  ),
  baseColor: ({ handleImageUpload, isMobile }: any) => (
    <div className={isMobile ? "space-y-1" : "space-y-4"}>
      <div className={isMobile ? "flex gap-1" : "grid grid-cols-2 gap-4"}>
        <ColorPicker />
        <ImageUpload onImageUpload={handleImageUpload} />
      </div>
      <ColorUsageBar />
      <ExtractedColorsDisplay isMobile={isMobile} />
    </div>
  ),
  colorRecommendation: ({ isMobile }: any) => (
    <ColorRecommendations isMobile={isMobile} />
  ),
  toneRecommendation: ({ isMobile }: any) => (
    <ToneRecommendations isMobile={isMobile} />
  ),
  skinColor: ({ isMobile }: any) => (
    <SkinColorRecommendations isMobile={isMobile} />
  ),
  hueToneExtraction: () => (
    <HueToneExtraction />
  ),
  canvasColorRecommendation: ({ paintCanvasRef, isDebugMode }: any) => (
    <CanvasColorRecommendations ref={paintCanvasRef} isDebugMode={isDebugMode} />
  )
};

// セクションヘッダーコンポーネント（折り畳み機能無効化版）
const SectionHeader = ({
  componentKey,
  isCollapsed,
  onToggle,
  handleExtractColorsFromCanvas,
  isMobile
}: {
  componentKey: ComponentKey;
  isCollapsed: boolean;
  onToggle: () => void;
  handleExtractColorsFromCanvas?: () => void;
  isMobile: boolean;
}) => {
  const { t } = useTranslation();
  const config = COMPONENT_CONFIG[componentKey];

  return (
    <h3
      className={`${isMobile ? 'text-xs' : 'text-lg'} font-medium ${
        componentKey === 'canvas' ? 'mb-0' : 'mb-2'
      } text-foreground flex items-center justify-between leading-tight min-h-[2rem]`}
    >
      <span>
        {`${config.step}. ${t(config.titleKey)}`}
      </span>
      <div className="flex items-center gap-2">
        {config.hasUpdateButton && handleExtractColorsFromCanvas && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExtractColorsFromCanvas();
            }}
            className="p-1 hover:bg-muted rounded-md border border-border transition-colors bg-transparent"
            title="キャンバスから色を抽出"
          >
            <RefreshCw className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-foreground`} />
          </button>
        )}
      </div>
    </h3>
  );
};

// セクションコンポーネント
const Section = ({ 
  componentKey, 
  props, 
  collapseStates, 
  setCollapseState,
  isMobile,
  isDebugMode,
  isAnimationEnabled
}: {
  componentKey: ComponentKey;
  props: any;
  collapseStates: Record<string, boolean>;
  setCollapseState: (key: string, value: boolean) => void;
  isMobile: boolean;
  isDebugMode: boolean;
  isAnimationEnabled: boolean;
}) => {
  const config = COMPONENT_CONFIG[componentKey];
  const isCollapsed = collapseStates[config.collapseState];
  const Component = ComponentMap[componentKey];

  return (
    <section className={componentKey === 'canvas' && !isMobile ? "flex-shrink-0 flex-1 flex flex-col min-h-[700px] h-full" : "flex-shrink-0"} style={componentKey === 'canvas' && !isMobile && isDebugMode ? { backgroundColor: '#ffeb3b', padding: '8px' } : {}}>
      <SectionHeader
        componentKey={componentKey}
        isCollapsed={isCollapsed}
        onToggle={() => {}} // 折り畳み機能無効化
        handleExtractColorsFromCanvas={config.hasUpdateButton ? props.handleExtractColorsFromCanvas : undefined}
        isMobile={isMobile}
      />
      {/* 常に表示（折り畳み機能無効化） */}
      <div className={componentKey === 'canvas' && !isMobile ? "flex-1 min-h-[650px] h-full" : ""} style={componentKey === 'canvas' && !isMobile && isDebugMode ? { backgroundColor: '#9c27b0', padding: '8px' } : {}}>
        <Component {...props} />
        {/* canvasセクションの下部余白をデバッグ表示 */}
        {componentKey === 'canvas' && (
          <div style={{ backgroundColor: 'red', height: '10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'white' }}>DEBUG: セクション下部余白</span>
          </div>
        )}
      </div>
    </section>
  );
};

// メインレイアウトレンダラー
export const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  columns,
  isMobile,
  isDebugMode,
  paintCanvasRef,
  handleExtractColorsFromCanvas,
  handleImageUpload,
  collapseStates,
  setCollapseState
}) => {
  const { isAnimationEnabled } = useColorStore();
  
  const commonProps = {
    isMobile,
    paintCanvasRef,
    handleExtractColorsFromCanvas,
    handleImageUpload,
    isDebugMode
  };

  if (isMobile) {
    // モバイル: 縦積みレイアウト
    // columnsから利用可能なコンポーネントのリストを取得（フィルタリング済み）
    const availableComponents = new Set(
      columns.flatMap(column => column.components)
    );

    // LAYOUT_CONFIGの順序を保持しつつ、利用可能なコンポーネントのみを使用
    const allComponents: ComponentKey[] = (LAYOUT_CONFIG.mobile.order as unknown as ComponentKey[])
      .filter(componentKey => availableComponents.has(componentKey));

    return (
      <div className="flex flex-col overflow-y-auto">
        {allComponents.map((componentKey) => (
          <div key={componentKey} className={componentKey !== 'skinColor' ? "mb-1" : ""}>
            <Section
              componentKey={componentKey}
              props={commonProps}
              collapseStates={collapseStates}
              setCollapseState={setCollapseState}
              isMobile={isMobile}
              isDebugMode={isDebugMode}
              isAnimationEnabled={isAnimationEnabled}
            />
          </div>
        ))}
      </div>
    );
  }

  // デスクトップ: 2列レイアウト（折り畳み機能無効化により幅調整不要）
  return (
    <div className="flex flex-1 gap-6" style={isDebugMode ? { padding: '16px', backgroundColor: '#673ab7' } : { padding: '16px' }}>
      {isDebugMode && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded font-bold z-40">
          🖥️ DESKTOP LAYOUT (≥800px)
        </div>
      )}

      {columns.filter(column => column.components.length > 0).map((column) => {
        return (
          <div
            key={column.id}
            className={`${column.width} flex flex-col min-h-0 ${
              column.id !== 'canvas' ? 'space-y-4 overflow-y-auto' : ''
            }`}
          style={isDebugMode ? {
            padding: column.id === 'canvas' ? '8px' : '16px',
            backgroundColor: column.id === 'canvas' ? '#00bcd4' : '#e91e63'
          } : {
            padding: column.id === 'canvas' ? '8px' : '16px'
          }}
        >
          {isDebugMode && (
            <h1 className="text-4xl text-black">
              {column.id.toUpperCase()} PANEL
            </h1>
          )}

          {column.components.map((componentKey) => (
            <Section
              key={componentKey}
              componentKey={componentKey as ComponentKey}
              props={commonProps}
              collapseStates={collapseStates}
              setCollapseState={setCollapseState}
              isMobile={isMobile}
              isDebugMode={isDebugMode}
              isAnimationEnabled={isAnimationEnabled}
            />
          ))}
        </div>
        );
      })}
    </div>
  );
};