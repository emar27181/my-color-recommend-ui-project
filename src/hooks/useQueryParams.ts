import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useExperimentStore, type ExperimentCondition } from '@/store/experimentStore';

/**
 * URLクエリパラメータから実験条件を読み取り、ストアに反映するカスタムフック
 *
 * 使用例:
 * - /experiment?cond=C0  → 推薦なし
 * - /experiment?cond=C1  → 色相推薦のみ
 * - /experiment?cond=C2  → トーン推薦のみ
 * - /experiment?cond=C3  → 二段階推薦
 */
export const useExperimentQuery = () => {
  const [searchParams] = useSearchParams();
  const { condition, setCondition } = useExperimentStore();

  useEffect(() => {
    const condParam = searchParams.get('cond');

    // URLパラメータが有効な条件の場合のみ更新
    if (condParam && isValidCondition(condParam)) {
      const newCondition = condParam as ExperimentCondition;
      if (newCondition !== condition) {
        setCondition(newCondition);
        console.log('Condition set from URL:', newCondition);
      }
    }
  }, [searchParams, condition, setCondition]);

  return { condition };
};

// 有効な実験条件かチェックする関数
const isValidCondition = (cond: string): cond is ExperimentCondition => {
  return ['C0', 'C1', 'C2', 'C3', 'UI1', 'UI2'].includes(cond);
};

/**
 * 汎用的なクエリパラメータフック
 *
 * 使用例:
 * const { getParam, setParam } = useQueryParams();
 * const userId = getParam('user');
 * setParam('user', 'U001');
 */
export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key: string): string | null => {
    return searchParams.get(key);
  };

  const setParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  const deleteParam = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  return {
    getParam,
    setParam,
    deleteParam,
    searchParams,
  };
};
