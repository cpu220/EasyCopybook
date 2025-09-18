/**
 * 全局通用Context
 * 使用useReducer管理全局状态，提供通用的set/get方法
 * 支持任意类型的数据存储和获取
 */

import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';

// 全局状态类型定义 - 支持任意键值对
interface GlobalState {
  [key: string]: any;
}

// 操作动作类型定义
type GlobalAction = 
  | { type: 'SET'; key: string; value: any }
  | { type: 'DELETE'; key: string }
  | { type: 'CLEAR' }
  | { type: 'BATCH_SET'; data: Record<string, any> };

// 初始状态
const initialState: GlobalState = {};

/**
 * 全局状态Reducer函数
 * 处理所有全局状态的变更操作
 * @param state 当前状态
 * @param action 操作动作
 * @returns 新的状态
 */
function globalReducer(state: GlobalState, action: GlobalAction): GlobalState {
  switch (action.type) {
    case 'SET':
      // 设置单个键值对
      return {
        ...state,
        [action.key]: action.value
      };

    case 'DELETE':
      // 删除指定键
      const { [action.key]: deleted, ...rest } = state;
      return rest;

    case 'CLEAR':
      // 清空所有数据
      return {};

    case 'BATCH_SET':
      // 批量设置多个键值对
      return {
        ...state,
        ...action.data
      };

    default:
      console.warn('Unknown global action type:', (action as any).type);
      return state;
  }
}

// Context类型定义
interface GlobalContextType {
  /** 当前全局状态 */
  state: GlobalState;
  /** 原始dispatch函数 */
  dispatch: React.Dispatch<GlobalAction>;
  /** 便捷操作方法 */
  actions: {
    /** 设置数据 */
    set: <T = any>(key: string, value: T) => void;
    /** 获取数据 */
    get: <T = any>(key: string, defaultValue?: T) => T | undefined;
    /** 删除数据 */
    remove: (key: string) => void;
    /** 清空所有数据 */
    clear: () => void;
    /** 批量设置数据 */
    batchSet: (data: Record<string, any>) => void;
    /** 检查键是否存在 */
    has: (key: string) => boolean;
    /** 获取所有键名 */
    keys: () => string[];
    /** 获取所有值 */
    values: () => any[];
  };
}

// 创建Context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Provider组件Props
interface GlobalProviderProps {
  children: ReactNode;
  /** 初始数据（可选） */
  initialData?: Record<string, any>;
}

/**
 * 全局状态Provider组件
 * 为整个应用提供全局状态管理功能
 * 
 * @param children 子组件
 * @param initialData 初始数据（可选）
 */
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ 
  children, 
  initialData = {} 
}) => {
  const [state, dispatch] = useReducer(globalReducer, { ...initialState, ...initialData });

  // 使用useMemo优化actions对象，避免不必要的重新创建
  const actions = useMemo(() => ({
    /**
     * 设置数据
     * @param key 键名
     * @param value 值
     */
    set: <T = any>(key: string, value: T) => {
      dispatch({ type: 'SET', key, value });
    },

    /**
     * 获取数据
     * @param key 键名
     * @param defaultValue 默认值
     * @returns 获取到的值或默认值
     */
    get: <T = any>(key: string, defaultValue?: T): T | undefined => {
      return state.hasOwnProperty(key) ? state[key] : defaultValue;
    },

    /**
     * 删除数据
     * @param key 键名
     */
    remove: (key: string) => {
      dispatch({ type: 'DELETE', key });
    },

    /**
     * 清空所有数据
     */
    clear: () => {
      dispatch({ type: 'CLEAR' });
    },

    /**
     * 批量设置数据
     * @param data 要设置的数据对象
     */
    batchSet: (data: Record<string, any>) => {
      dispatch({ type: 'BATCH_SET', data });
    },

    /**
     * 检查键是否存在
     * @param key 键名
     * @returns 是否存在
     */
    has: (key: string): boolean => {
      return state.hasOwnProperty(key);
    },

    /**
     * 获取所有键名
     * @returns 键名数组
     */
    keys: (): string[] => {
      return Object.keys(state);
    },

    /**
     * 获取所有值
     * @returns 值数组
     */
    values: (): any[] => {
      return Object.values(state);
    }
  }), [state]);

  // 使用useMemo优化context value
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    actions
  }), [state, actions]);

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

/**
 * 使用全局状态的Hook
 * 提供完整的全局状态管理功能
 * 
 * @returns 全局状态和操作方法
 * @throws 如果在GlobalProvider外部使用会抛出错误
 */
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};

/**
 * 便捷Hook - 只获取set和get方法
 * 用于只需要基本操作的组件
 * 
 * @returns set和get方法
 */
export const useGlobalActions = () => {
  const { actions } = useGlobal();
  return useMemo(() => ({
    set: actions.set,
    get: actions.get
  }), [actions.set, actions.get]);
};

/**
 * 便捷Hook - 订阅特定键的值
 * 当指定键的值发生变化时，组件会重新渲染
 * 
 * @param key 要订阅的键名
 * @param defaultValue 默认值
 * @returns 当前值和设置方法
 */
export const useGlobalValue = <T = any>(key: string, defaultValue?: T) => {
  const { state, actions } = useGlobal();
  
  const value = state.hasOwnProperty(key) ? state[key] : defaultValue;
  
  return useMemo(() => ({
    value: value as T,
    setValue: (newValue: T) => actions.set(key, newValue),
    hasValue: state.hasOwnProperty(key)
  }), [value, key, actions.set, state]);
};

/**
 * 便捷Hook - 订阅多个键的值
 * 当任意一个键的值发生变化时，组件会重新渲染
 * 
 * @param keys 要订阅的键名数组
 * @returns 包含所有键值的对象
 */
export const useGlobalValues = (keys: string[]) => {
  const { state } = useGlobal();
  
  return useMemo(() => {
    const result: Record<string, any> = {};
    keys.forEach(key => {
      result[key] = state[key];
    });
    return result;
  }, [state, keys]);
};