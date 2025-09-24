import { useState, useCallback } from 'react';
import { getCharacterStrokeData,removeDuplicates } from '@/utils';

/**
 * 汉字笔画数据缓存模型
 * 用于管理和缓存所有汉字的笔画数据
 * 任何需要获取汉字笔画数据的组件都可以通过 useModel('CHAR_CACHE') 访问
 */
export default function useCharCacheModel() {
  // 存储汉字及其实际笔画数的映射
  const [charStrokeCounts, setCharStrokeCounts] = useState<Map<string, number> | undefined>(undefined);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  
  /**
   * 批量获取一组汉字的笔画数据并缓存
   * @param characters 要获取笔画数据的汉字数组
   * @returns Promise<Map<string, number>> 汉字笔画数映射
   */
  const fetchCharStrokeCounts = useCallback(async (characters: string): Promise<Map<string, number>> => {
    if (!characters || characters.length === 0) {
      return new Map();
    }
    console.log('fetchCharStrokeCounts',characters)
    try {
      setLoading(true);
      // 去重
      const uniqueChars =  Array.from(new Set(characters));
      // 创建新的映射，保留已有的缓存数据
      const newCharMap = new Map(charStrokeCounts);
      
      // 过滤掉已经缓存的字符
      const charsToFetch = uniqueChars.filter(char => !newCharMap.has(char));
      
      if (charsToFetch.length > 0) {
        // 并行获取所有汉字的笔画数据
        const promises = charsToFetch.map(async (char) => {
          const strokes = await getCharacterStrokeData(char);
          newCharMap.set(char, strokes.length);
        });

        await Promise.all(promises);
        // 更新缓存
        setCharStrokeCounts(newCharMap);
      }
      
      return newCharMap;
    } catch (error) {
      console.error('获取汉字笔画数失败:', error);
      return new Map();
    } finally {
      setLoading(false);
    }
  }, [charStrokeCounts]);

  /**
   * 获取单个汉字的笔画数
   * @param character 汉字
   * @returns 笔画数，如果没有缓存则返回undefined
   */
  const getStrokeCount = useCallback((character: string): number | undefined => {
    return charStrokeCounts?.get(character);
  }, [charStrokeCounts]);

  /**
   * 清除缓存
   * @param character 可选，指定要清除的字符，不传则清除所有缓存
   */
  const clearCache = useCallback((character?: string) => {
    if (!charStrokeCounts) return;
    
    const newCache = new Map(charStrokeCounts);
    
    if (character) {
      newCache.delete(character);
      console.log(`已清理字符"${character}"的笔画数据缓存`);
    } else {
      const cacheSize = newCache.size;
      newCache.clear();
      console.log(`已清理所有笔画数据缓存 (${cacheSize}个字符)`);
    }
    
    setCharStrokeCounts(newCache);
  }, [charStrokeCounts]);

  return {
    // 状态
    charStrokeCounts,
    loading,
    
    // 操作方法
    fetchCharStrokeCounts,
    getStrokeCount,
    clearCache,
  };
}