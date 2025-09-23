import React from 'react';
import Pinyin from '../pinyin';
import StrokeOrder from '../strokeOrder';
import styles from './index.less';

/**
 * 提示容器组件的属性接口
 */
interface TipsContainerProps {
  /** 组件ID */
  id?: string;
  /** 要显示的汉字 */
  char: string;
  /** 自定义类名 */
  className?: string;
  /** 是否显示拼音 */
  showPinyin?: boolean;
  /** 是否显示笔画顺序 */
  showStrokeOrder?: boolean;
  /** 拼音配置 */
  pinyinConfig?: any;
  /** 笔画顺序配置 */
  strokeOrderConfig?: any;
}

/**
 * 提示容器组件 - 封装拼音和笔画顺序展示
 * 父组件，内部包含Pinyin和StrokeOrder两个子组件
 */
const TipsContainer: React.FC<TipsContainerProps> = ({
  id,
  char,
  className = '',
  showPinyin = false,
  showStrokeOrder = false,
  pinyinConfig = {},
  strokeOrderConfig = {}
}) => {
  // 如果没有需要显示的内容，直接返回null
  if (!showPinyin && !showStrokeOrder) {
    return null;
  }

  return (
    <div id={id} className={`${styles['grid-row-tip-container']} ${className}`}>
      {showPinyin && (
        <Pinyin 
          char={char}
          config={pinyinConfig}
        />
      )}
      {showStrokeOrder && (
        <StrokeOrder 
          char={char}
          config={strokeOrderConfig}
        />
      )}
    </div>
  );
};

export default TipsContainer;