import React from 'react';
import { useConditionStore, CONDITIONS, type ExperimentCondition } from '@/store/conditionStore';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

/**
 * 実験条件選択セレクタコンポーネント
 * 管理者/開発者が条件を手動で切り替えるためのUI
 * 実験モード時のみ表示される
 */
export const ConditionSelector: React.FC = () => {
  const { condition, setCondition, isExperimentMode } = useConditionStore();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  // 実験モードでない場合は非表示
  if (!isExperimentMode) {
    return null;
  }

  const isJapanese = i18n.language === 'ja';

  const handleSelect = (cond: ExperimentCondition) => {
    setCondition(cond);
    setIsOpen(false);
  };

  const currentCondition = CONDITIONS[condition];
  const currentLabel = isJapanese ? currentCondition.label : currentCondition.labelEn;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-background hover:bg-muted border border-border rounded-md transition-colors"
      >
        <span className="text-base">{currentCondition.icon}</span>
        <span className="hidden sm:inline">{isJapanese ? '推薦条件' : 'Condition'}:</span>
        <span className="font-bold">{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <>
          {/* 背景オーバーレイ */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* ドロップダウンコンテンツ */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-2 space-y-1">
              {(Object.keys(CONDITIONS) as ExperimentCondition[]).map((key) => {
                const cond = CONDITIONS[key];
                const label = isJapanese ? cond.label : cond.labelEn;
                const description = isJapanese ? cond.description : cond.descriptionEn;
                const isSelected = condition === key;

                return (
                  <button
                    key={key}
                    onClick={() => handleSelect(key)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg flex-shrink-0">{cond.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{label}</div>
                        <div className="text-xs opacity-80 mt-0.5">{description}</div>
                        <div className="text-xs opacity-60 mt-1 space-y-0.5">
                          <div>
                            {isJapanese ? '色相推薦' : 'Hue'}:{' '}
                            {cond.HUE_RECO_ON ? '✓ ON' : '✗ OFF'}
                          </div>
                          <div>
                            {isJapanese ? 'トーン推薦' : 'Tone'}:{' '}
                            {cond.TONE_RECO_ON ? '✓ ON' : '✗ OFF'}
                          </div>
                          <div>
                            {isJapanese ? 'ハーモニー順位' : 'Harmony'}:{' '}
                            {cond.HARMONY_RANK_ON ? '✓ ON' : '✗ OFF'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
