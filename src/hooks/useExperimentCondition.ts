import { useEffect } from 'react';
import { useConditionStore, type ExperimentCondition } from '@/store/conditionStore';

/**
 * URLクエリから実験条件を読み取り、ストアに反映するカスタムフック
 *
 * 使用方法:
 * - ?cond=C0 → 推薦なし
 * - ?cond=C1 → 色相推薦のみ
 * - ?cond=C2 → トーン推薦のみ
 * - ?cond=C3 → 二段階推薦（デフォルト）
 *
 * クエリパラメータがない場合は、LocalStorageの値またはデフォルト値（C3）を使用
 */
export const useExperimentCondition = () => {
  const { condition, setCondition, setExperimentMode } = useConditionStore();

  useEffect(() => {
    // URLクエリパラメータを取得
    const params = new URLSearchParams(window.location.search);
    const condParam = params.get('cond');

    if (condParam) {
      // クエリパラメータが存在する場合
      const upperCond = condParam.toUpperCase();

      // 有効な条件値かチェック
      if (['C0', 'C1', 'C2', 'C3'].includes(upperCond)) {
        setCondition(upperCond as ExperimentCondition);
        setExperimentMode(true); // 実験モードON（UI要素表示）
        console.log('Experiment condition set from URL:', upperCond);
      } else {
        console.warn('Invalid condition parameter:', condParam);
      }
    } else {
      // クエリパラメータがない場合は通常モード（実験UI非表示）
      setExperimentMode(false);
      console.log('Normal mode: No condition parameter in URL');
    }
  }, [setCondition, setExperimentMode]);

  return { condition };
};
