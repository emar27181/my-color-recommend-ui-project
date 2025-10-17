import { create } from 'zustand';

// 実験条件の型定義
export type ExperimentCondition = 'C0' | 'C1' | 'C2' | 'C3';

// イベントログの型定義
export interface ExperimentEvent {
  type: string;           // イベントタイプ（例: 'color_pick', 'recommendation_click', 'apply_color'）
  value: string;          // 値（例: HEX色コード）
  target?: string;        // 対象（例: 'hair', 'eyes', 'canvas'）
  time: number;           // 実験開始からの経過時間（秒）
  timestamp?: string;     // タイムスタンプ（ISO 8601形式）
}

// デバイス情報の型定義
export interface DeviceInfo {
  type: 'PC' | 'tablet' | 'mobile' | 'unknown';
  inputMethod?: 'mouse' | 'touch' | 'pen' | 'unknown';
  os?: string;
  browser?: string;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  userAgent: string;
}

// 条件ごとのログ
export interface ConditionLog {
  condition: ExperimentCondition;
  start_time: string;
  end_time: string | null;
  task_duration_sec: number | null;
  events: ExperimentEvent[];
}

// 実験ログ全体の型定義
export interface ExperimentLog {
  participant_id: string;
  device: DeviceInfo;
  experiment_start_time: string;
  experiment_end_time: string | null;
  total_duration_sec: number | null;
  conditions: ConditionLog[];
}

// 実験状態の型定義
export interface ExperimentState {
  // 状態
  participantId: string;
  condition: ExperimentCondition;
  isExperimentRunning: boolean;
  startTime: number | null;
  endTime: number | null;
  events: ExperimentEvent[];
  deviceInfo: DeviceInfo;

  // フロー管理
  experimentStartTime: number | null; // 全体の実験開始時刻
  experimentEndTime: number | null;   // 全体の実験終了時刻
  conditionLogs: ConditionLog[];      // 各条件のログ
  currentConditionIndex: number;      // 現在の条件インデックス (0=C0, 1=C1, 2=C2, 3=C3)
  conditionOrder: ExperimentCondition[]; // 実験順序

  // アクション
  setParticipantId: (id: string) => void;
  setCondition: (condition: ExperimentCondition) => void;
  startExperiment: () => void;
  endExperiment: () => void;
  recordEvent: (type: string, value: string, target?: string) => void;
  getExperimentLog: () => ExperimentLog;
  exportLog: () => void;
  resetExperiment: () => void;

  // フロー管理アクション
  startFullExperiment: () => void;           // 全体実験開始（C0から）
  nextCondition: () => boolean;              // 次の条件に進む（戻り値: 次があるかどうか）
  getCurrentCondition: () => ExperimentCondition; // 現在の条件を取得
  hasNextCondition: () => boolean;           // 次の条件があるか
  getNextCondition: () => ExperimentCondition | null; // 次の条件を取得
  completeCurrentCondition: () => void;      // 現在の条件を完了

  // 条件による機能フラグ
  getFeatureFlags: () => {
    HUE_RECO_ON: boolean;
    TONE_RECO_ON: boolean;
    HARMONY_RANK_ON: boolean;
  };
}

// デバイス情報を自動収集する関数
const collectDeviceInfo = (): DeviceInfo => {
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();

  // デバイスタイプ判定
  let deviceType: DeviceInfo['type'] = 'unknown';
  if (width < 768) {
    deviceType = 'mobile';
  } else if (width < 1024) {
    deviceType = 'tablet';
  } else {
    deviceType = 'PC';
  }

  // OS判定（簡易版）
  let os = 'unknown';
  if (userAgent.includes('win')) os = 'Windows';
  else if (userAgent.includes('mac')) os = 'macOS';
  else if (userAgent.includes('linux')) os = 'Linux';
  else if (userAgent.includes('android')) os = 'Android';
  else if (userAgent.includes('ios') || userAgent.includes('iphone') || userAgent.includes('ipad')) os = 'iOS';

  // ブラウザ判定（簡易版）
  let browser = 'unknown';
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) browser = 'Chrome';
  else if (userAgent.includes('safari') && !userAgent.includes('chrome')) browser = 'Safari';
  else if (userAgent.includes('firefox')) browser = 'Firefox';
  else if (userAgent.includes('edg')) browser = 'Edge';

  return {
    type: deviceType,
    os,
    browser,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    userAgent: navigator.userAgent,
  };
};

// 初期デバイス情報
const initialDeviceInfo = collectDeviceInfo();

export const useExperimentStore = create<ExperimentState>((set, get) => ({
  // 初期状態
  participantId: '',
  condition: 'C0',
  isExperimentRunning: false,
  startTime: null,
  endTime: null,
  events: [],
  deviceInfo: initialDeviceInfo,

  // フロー管理
  experimentStartTime: null,
  experimentEndTime: null,
  conditionLogs: [],
  currentConditionIndex: 0,
  conditionOrder: ['C0', 'C1', 'C2', 'C3'],

  // 参加者IDを設定
  setParticipantId: (id: string) => {
    set({ participantId: id });
  },

  // 実験条件を設定
  setCondition: (condition: ExperimentCondition) => {
    set({ condition });
  },

  // 実験開始
  startExperiment: () => {
    const now = Date.now();
    set({
      isExperimentRunning: true,
      startTime: now,
      endTime: null,
      events: [],
      deviceInfo: collectDeviceInfo(), // 実験開始時に最新のデバイス情報を収集
    });
    console.log('Experiment started at:', new Date(now).toISOString());
  },

  // 実験終了
  endExperiment: () => {
    const now = Date.now();
    set({
      isExperimentRunning: false,
      endTime: now,
    });
    console.log('Experiment ended at:', new Date(now).toISOString());
  },

  // イベントを記録
  recordEvent: (type: string, value: string, target?: string) => {
    const state = get();
    if (!state.isExperimentRunning) {
      console.warn('Cannot record event: experiment is not running');
      return;
    }

    if (state.startTime === null) {
      console.error('Cannot record event: startTime is null');
      return;
    }

    const now = Date.now();
    const elapsedTime = (now - state.startTime) / 1000; // ミリ秒から秒に変換

    const event: ExperimentEvent = {
      type,
      value,
      target,
      time: parseFloat(elapsedTime.toFixed(2)),
      timestamp: new Date(now).toISOString(),
    };

    set(state => ({
      events: [...state.events, event],
    }));

    console.log('Event recorded:', event);
  },

  // 実験ログを取得
  getExperimentLog: (): ExperimentLog => {
    const state = get();
    return {
      participant_id: state.participantId,
      device: state.deviceInfo,
      experiment_start_time: state.experimentStartTime ? new Date(state.experimentStartTime).toISOString() : '',
      experiment_end_time: state.experimentEndTime ? new Date(state.experimentEndTime).toISOString() : null,
      total_duration_sec: state.experimentStartTime && state.experimentEndTime
        ? parseFloat(((state.experimentEndTime - state.experimentStartTime) / 1000).toFixed(2))
        : null,
      conditions: state.conditionLogs,
    };
  },

  // JSONログをエクスポート
  exportLog: () => {
    const state = get();
    const log = state.getExperimentLog();

    // JSONファイルとしてダウンロード
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log_${state.participantId || 'anonymous'}_all_conditions.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('Log exported:', log);
  },

  // 実験をリセット
  resetExperiment: () => {
    set({
      isExperimentRunning: false,
      startTime: null,
      endTime: null,
      events: [],
      deviceInfo: collectDeviceInfo(),
      experimentStartTime: null,
      experimentEndTime: null,
      conditionLogs: [],
      currentConditionIndex: 0,
      condition: 'C0',
    });
    console.log('Experiment reset');
  },

  // 全体実験開始（C0から）
  startFullExperiment: () => {
    const now = Date.now();
    set({
      experimentStartTime: now,
      experimentEndTime: null,
      conditionLogs: [],
      currentConditionIndex: 0,
      condition: 'C0',
      isExperimentRunning: true,
      startTime: now,
      endTime: null,
      events: [],
      deviceInfo: collectDeviceInfo(),
    });
    console.log('Full experiment started at:', new Date(now).toISOString());
  },

  // 現在の条件を取得
  getCurrentCondition: () => {
    const state = get();
    return state.conditionOrder[state.currentConditionIndex];
  },

  // 次の条件があるか
  hasNextCondition: () => {
    const state = get();
    return state.currentConditionIndex < state.conditionOrder.length - 1;
  },

  // 次の条件を取得
  getNextCondition: () => {
    const state = get();
    if (state.currentConditionIndex < state.conditionOrder.length - 1) {
      return state.conditionOrder[state.currentConditionIndex + 1];
    }
    return null;
  },

  // 現在の条件を完了
  completeCurrentCondition: () => {
    const state = get();
    const now = Date.now();

    // 現在の条件のログを保存
    const conditionLog: ConditionLog = {
      condition: state.condition,
      start_time: state.startTime ? new Date(state.startTime).toISOString() : '',
      end_time: new Date(now).toISOString(),
      task_duration_sec: state.startTime
        ? parseFloat(((now - state.startTime) / 1000).toFixed(2))
        : null,
      events: [...state.events],
    };

    set({
      conditionLogs: [...state.conditionLogs, conditionLog],
      isExperimentRunning: false,
      endTime: now,
    });

    console.log(`Condition ${state.condition} completed`, conditionLog);
  },

  // 次の条件に進む
  nextCondition: () => {
    const state = get();

    if (state.currentConditionIndex >= state.conditionOrder.length - 1) {
      // 全条件完了
      const now = Date.now();
      set({
        experimentEndTime: now,
        isExperimentRunning: false,
      });
      console.log('All conditions completed');
      return false;
    }

    // 次の条件に進む
    const nextIndex = state.currentConditionIndex + 1;
    const nextCondition = state.conditionOrder[nextIndex];
    const now = Date.now();

    set({
      currentConditionIndex: nextIndex,
      condition: nextCondition,
      isExperimentRunning: true,
      startTime: now,
      endTime: null,
      events: [],
    });

    console.log(`Moved to condition ${nextCondition}`);
    return true;
  },

  // 条件による機能フラグを取得
  getFeatureFlags: () => {
    const { condition } = get();
    return {
      HUE_RECO_ON: condition === 'C1' || condition === 'C3',
      TONE_RECO_ON: condition === 'C2' || condition === 'C3',
      HARMONY_RANK_ON: condition === 'C3',
    };
  },
}));
