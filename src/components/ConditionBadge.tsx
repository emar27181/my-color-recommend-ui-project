import React from 'react';
import { useConditionStore, CONDITIONS } from '@/store/conditionStore';
import { useTranslation } from 'react-i18next';

/**
 * 実験条件バッジコンポーネント
 * 画面上部に現在の推薦条件を表示
 * 実験モード時のみ表示される
 */
export const ConditionBadge: React.FC = () => {
  const { condition, isExperimentMode } = useConditionStore();
  const { i18n } = useTranslation();

  // 実験モードでない場合は非表示
  if (!isExperimentMode) {
    return null;
  }

  const conditionInfo = CONDITIONS[condition];
  const isJapanese = i18n.language === 'ja';
  const label = isJapanese ? conditionInfo.label : conditionInfo.labelEn;

  // 条件に応じたバッジ色を設定
  const getBadgeColor = () => {
    switch (condition) {
      case 'C0':
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-400';
      case 'C1':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-400';
      case 'C2':
        return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-400';
      case 'C3':
        return 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-400';
    }
  };

  return (
    <div className="w-full flex justify-center py-2 bg-background/95 backdrop-blur-sm border-b border-border">
      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium ${getBadgeColor()}`}
      >
        <span className="text-base">{conditionInfo.icon}</span>
        <span>{isJapanese ? '現在の条件' : 'Current Condition'}:</span>
        <span className="font-bold">{label}</span>
      </div>
    </div>
  );
};
