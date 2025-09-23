import React, { useState, useEffect } from 'react';
import { getCharacterPinyin, PinyinConfig } from '@/utils/render/pinyin.render';
import styles from './index.less';

/**
 * 拼音组件的属性接口
 */
interface PinyinProps {
  /** 要显示拼音的汉字 */
  char: string;
  /** 拼音配置 */
  config?: PinyinConfig;
}

/**
 * 拼音展示组件
 * 子组件，负责获取和显示汉字的拼音
 */
const Pinyin: React.FC<PinyinProps> = ({
  char,
  config = {}
}) => {
  const [pinyin, setPinyin] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // 如果字符为空，直接返回
    if (!char || char.length === 0) {
      setPinyin('');
      return;
    }

    // 获取拼音
    const fetchPinyin = () => {
      try {
        setLoading(true);
        setError(false);
        const result = getCharacterPinyin(char, config);
        if (result.hasError) {
          setError(true);
          setPinyin('pinyin');
        } else {
          setPinyin(result.pinyin);
        }
      } catch (error) {
        console.error('获取拼音失败:', error);
        setError(true);
        setPinyin('pinyin');
      } finally {
        setLoading(false);
      }
    };

    fetchPinyin();
  }, [char, config]);

  // 加载状态
  if (loading) {
    return (
      <div className={`${styles['grid-row-pinyin']} ${styles['pinyin-loading']}`}>
        加载中...
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={`${styles['grid-row-pinyi']} ${styles['pinyin-error']}`}>
        {pinyin}
      </div>
    );
  }

  // 正常状态
  return (
    <div className={styles['grid-row-pinyin']}>
      {pinyin}
    </div>
  );
};

export default Pinyin;