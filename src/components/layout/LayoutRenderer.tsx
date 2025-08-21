import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
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
  canvasColorRecommendation: ({ paintCanvasRef }: any) => (
    <CanvasColorRecommendations ref={paintCanvasRef} />
  )
};

// セクションヘッダーコンポーネント
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
      className={`${isMobile ? 'text-xs' : 'text-lg'} font-medium ${componentKey === 'canvas' ? 'mb-1' : 'mb-2'} text-foreground cursor-pointer flex items-center justify-between leading-tight`}
      onClick={onToggle}
    >
      <span>{config.step}. {t(config.titleKey)}</span>
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
        {isCollapsed ? (
          <ChevronDown className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
        ) : (
          <ChevronUp className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
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
  isMobile 
}: {
  componentKey: ComponentKey;
  props: any;
  collapseStates: Record<string, boolean>;
  setCollapseState: (key: string, value: boolean) => void;
  isMobile: boolean;
}) => {
  const config = COMPONENT_CONFIG[componentKey];
  const isCollapsed = collapseStates[config.collapseState];
  const Component = ComponentMap[componentKey];

  return (
    <section className={componentKey === 'canvas' && !isMobile ? "flex-shrink-0 flex-1 flex flex-col min-h-[700px] h-full" : "flex-shrink-0"}>
      <SectionHeader
        componentKey={componentKey}
        isCollapsed={isCollapsed}
        onToggle={() => setCollapseState(config.collapseState, !isCollapsed)}
        handleExtractColorsFromCanvas={config.hasUpdateButton ? props.handleExtractColorsFromCanvas : undefined}
        isMobile={isMobile}
      />
      {!isCollapsed && (
        <div className={componentKey === 'canvas' && !isMobile ? "flex-1 min-h-[650px] h-full" : ""}>
          <Component {...props} />
          {/* canvasセクションの下部余白をデバッグ表示 */}
          {componentKey === 'canvas' && (
            <div style={{ backgroundColor: 'red', height: '10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'white' }}>DEBUG: セクション下部余白</span>
            </div>
          )}
        </div>
      )}
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
  const commonProps = {
    isMobile,
    paintCanvasRef,
    handleExtractColorsFromCanvas,
    handleImageUpload
  };

  if (isMobile) {
    // モバイル: 縦積みレイアウト（LAYOUT_CONFIGの順序を使用）
    const allComponents: ComponentKey[] = LAYOUT_CONFIG.mobile.order as unknown as ComponentKey[];
    
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
            />
          </div>
        ))}
      </div>
    );
  }

  // デスクトップ: 2列レイアウト
  return (
    <div className="flex flex-1 gap-6" style={isDebugMode ? { padding: '32px', backgroundColor: 'yellow' } : { padding: '16px' }}>
      {isDebugMode && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded font-bold z-40">
          🖥️ DESKTOP LAYOUT (≥800px)
        </div>
      )}
      
      {columns.filter(column => column.components.length > 0).map((column, columnIndex) => (
        <div 
          key={column.id} 
          className={`${column.width} flex flex-col min-h-0 ${
            column.id !== 'canvas' ? 'space-y-4 overflow-y-auto' : ''
          }`}
          style={isDebugMode ? { 
            padding: '32px', 
            backgroundColor: columnIndex === 0 ? 'red' : columnIndex === 1 ? 'blue' : 'green' 
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
            />
          ))}
        </div>
      ))}
    </div>
  );
};