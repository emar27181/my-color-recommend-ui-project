import { create } from 'zustand';
import JSZip from 'jszip';

// 実験条件の型定義
export type ExperimentCondition = 'Test1' | 'Test2' | 'Test3';

// イベントログの型定義
export interface ExperimentEvent {
  type: string;           // イベントタイプ（例: 'color_pick', 'recommendation_click', 'apply_color'）
  value: string;          // 値（例: HEX色コード）
  target?: string;        // 対象（例: 'hair', 'eyes', 'canvas'）
  time: number;           // 実験開始からの経過時間（秒）
  timestamp?: string;     // タイムスタンプ（ISO 8601形式）
}

// デバイス情報の型定義（自動検出）
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

// 参加者情報の型定義（手動入力）
export interface ParticipantInfo {
  deviceType: 'PC' | 'tablet' | 'smartphone' | '';  // 使用デバイス（ユーザー選択）
  illustrationExperience: 'beginner' | 'some' | 'hobby' | 'professional' | '';  // イラスト経験
  ageRange?: '10s' | '20s' | '30s' | '40s' | '50s' | '60s+' | '';  // 年齢層（オプション）
}

// 条件ごとのログ
export interface ConditionLog {
  condition: ExperimentCondition;
  start_time: string;
  end_time: string | null;
  task_duration_sec: number | null;
  events: ExperimentEvent[];
  canvas_image?: string; // キャンバス画像のbase64データURL
}

// アンケート回答の型定義
export interface SurveyResponse {
  usability: number[];      // SUS簡易版(5問) - 1〜5段階評価
  effectiveness: number[];  // TAM(3問) - 1〜5段階評価
  creativity: number[];     // Mini-CSI(3問) - 1〜5段階評価
  favoriteUI: string[];     // 最も使いやすかったUI (Test1/Test2/Test3 複数選択可)
  reason: string;           // 理由（自由記述）
  improvement: string;      // 改善点（自由記述）
}

// 実験ログ全体の型定義
export interface ExperimentLog {
  participant_id: string;
  participant_info: ParticipantInfo;  // 参加者情報（手動入力）
  device: DeviceInfo;                 // デバイス情報（自動検出）
  experiment_start_time: string;
  experiment_end_time: string | null;
  total_duration_sec: number | null;
  conditions: ConditionLog[];
  survey?: SurveyResponse; // アンケート結果（オプショナル）
}

// 実験状態の型定義
export interface ExperimentState {
  // 状態
  participantId: string;
  participantInfo: ParticipantInfo;  // 参加者情報（手動入力）
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
  currentConditionIndex: number;      // 現在の条件インデックス (0=Test1, 1=Test2, 2=Test3)
  conditionOrder: ExperimentCondition[]; // 実験順序

  // アンケート
  surveyResponse: SurveyResponse | null; // アンケート回答

  // アクション
  setParticipantId: (id: string) => void;
  setParticipantInfo: (info: ParticipantInfo) => void;  // 参加者情報を設定
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
  completeCurrentCondition: (canvasImage?: string) => void;      // 現在の条件を完了

  // アンケートアクション
  setSurveyResponse: (survey: SurveyResponse) => void; // アンケート回答を保存

  // 条件による機能フラグ
  getFeatureFlags: () => {
    MASS_COLOR_GRID_ON: boolean;    // Test1: 全色相×複数トーンのグリッド表示
    HUE_WHEEL_SLIDER_ON: boolean;   // Test2: 色相環UI＋トーンスライダー
    HUE_RECO_ON: boolean;           // Test3: 色相推薦
    TONE_RECO_ON: boolean;          // Test3: トーン推薦
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
  participantInfo: {
    deviceType: '',
    illustrationExperience: '',
    ageRange: '',
  },
  condition: 'Test1',
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
  conditionOrder: ['Test1', 'Test3'],

  // アンケート
  surveyResponse: null,

  // 参加者IDを設定
  setParticipantId: (id: string) => {
    set({ participantId: id });
  },

  // 参加者情報を設定
  setParticipantInfo: (info: ParticipantInfo) => {
    set({ participantInfo: info });
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
      participant_info: state.participantInfo,  // 参加者情報（手動入力）
      device: state.deviceInfo,
      experiment_start_time: state.experimentStartTime ? new Date(state.experimentStartTime).toISOString() : '',
      experiment_end_time: state.experimentEndTime ? new Date(state.experimentEndTime).toISOString() : null,
      total_duration_sec: state.experimentStartTime && state.experimentEndTime
        ? parseFloat(((state.experimentEndTime - state.experimentStartTime) / 1000).toFixed(2))
        : null,
      conditions: state.conditionLogs,
      survey: state.surveyResponse || undefined, // アンケート回答を含める
    };
  },

  // JSONログとキャンバス画像をZIPでエクスポート
  exportLog: async () => {
    const state = get();
    const log = state.getExperimentLog();

    // ZIPファイルを作成
    const zip = new JSZip();

    // JSONログを追加
    zip.file(`log_${state.participantId || 'anonymous'}.json`, JSON.stringify(log, null, 2));

    // 各条件のキャンバス画像を追加
    state.conditionLogs.forEach((condLog) => {
      if (condLog.canvas_image) {
        // base64データURLから画像データを抽出
        const base64Data = condLog.canvas_image.replace(/^data:image\/\w+;base64,/, '');
        zip.file(`${condLog.condition}_canvas.png`, base64Data, { base64: true });
      }
    });

    // ZIPファイルを生成してダウンロード
    try {
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `experiment_${state.participantId || 'anonymous'}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      console.log('Log and canvas images exported as ZIP');
    } catch (error) {
      console.error('Failed to create ZIP file:', error);
    }
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
      condition: 'Test1',
      surveyResponse: null, // アンケート回答をリセット
    });
    console.log('Experiment reset');
  },

  // 全体実験開始（Test1から）
  startFullExperiment: () => {
    const now = Date.now();
    set({
      experimentStartTime: now,
      experimentEndTime: null,
      conditionLogs: [],
      currentConditionIndex: 0,
      condition: 'Test1',
      isExperimentRunning: true,
      startTime: now,
      endTime: null,
      events: [],
      deviceInfo: collectDeviceInfo(),
      surveyResponse: null, // アンケート回答をリセット
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
  completeCurrentCondition: (canvasImage?: string) => {
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
      canvas_image: canvasImage, // キャンバス画像を保存
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

  // アンケート回答を保存
  setSurveyResponse: (survey: SurveyResponse) => {
    set({ surveyResponse: survey });
    console.log('Survey response saved:', survey);
  },

  // 条件による機能フラグを取得
  getFeatureFlags: () => {
    const { condition } = get();
    return {
      MASS_COLOR_GRID_ON: condition === 'Test1',   // Test1: 全色相×複数トーンのグリッド表示
      HUE_WHEEL_SLIDER_ON: condition === 'Test2',  // Test2: 色相環UI＋トーンスライダー
      HUE_RECO_ON: condition === 'Test3',          // Test3: 色相推薦
      TONE_RECO_ON: condition === 'Test3',         // Test3: トーン推薦
    };
  },
}));
