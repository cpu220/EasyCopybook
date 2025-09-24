import React, { useState, useEffect } from 'react';
import { generateStrokeData, getCharacterStrokeData } from '@/utils';
import styles from './index.less';

/**
 * 笔画顺序展示组件的属性接口
 */
interface StrokeOrderProps {
  /** 要显示笔画顺序的汉字 */
  char: string;
  /** 笔画数据配置 */
  config?: any;
}

/**
 * 笔画顺序展示组件
 * 使用hanziWriterRender中的generateStrokeData方法获取笔画数据
 */
const StrokeOrder: React.FC<StrokeOrderProps> = ({ 
  char, 
  config = {} 
}) => {
  const [strokeData, setStrokeData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 如果字符为空，直接返回
    if (!char || char.length === 0) {
      setLoading(false);
      return;
    }

    // 加载笔画数据
    const loadStrokeData = async () => {
      try {
        setLoading(true);
        const data = await generateStrokeData(char, {
          ...config,
          strokeSize: 20, // 小尺寸，适合在tips区域展示
          colorMode: 'stroke', // 每个笔画使用不同颜色
          includeArrows: true
        });
        setStrokeData(data);
      } catch (error) {
        console.error('加载笔画数据失败:', error);
        // 出错时，尝试直接获取笔画数作为备用方案
        const getStrokeCount = async () => {
          try {
            const strokes = await getCharacterStrokeData(char);
            return strokes.length;
          } catch (innerError) {
            console.error('获取笔画数失败:', innerError);
            return 0;
          }
        };
        
        getStrokeCount().then(count => {
          setStrokeData({
            character: char,
            strokeCount: count,
            hasError: true,
            errorMessage: '加载失败'
          });
        });
      } finally {
        setLoading(false);
      }
    };

    loadStrokeData();
  }, [char]); // 移除config作为依赖项，避免对象引用变化导致的无限循环

  // 如果加载中，显示加载状态
  if (loading) {
    return <span className={`${styles['grid-row-storke']} ${styles['stroke-order-loading']}`}>加载中...</span>;
  }

  // 如果没有笔画数据或出错，显示基本信息
//   if (!strokeData || strokeData.hasError) {
//     return (
//       <span className={`${styles['grid-row-storke']} ${styles['stroke-order-error']}`}>
//         笔画顺序：共{strokeData?.strokeCount || 0}笔
//       </span>
//     );
//   }

  // 渲染笔画顺序
  return (
    <div className={`${styles['grid-row-storke']} ${styles['stroke-order-container']}`}>
      {/* 笔画顺序：共{strokeData.strokeCount}笔 */}
      <div className={styles['stroke-order-strokes']}>
        {renderStrokeOrderVisualization(strokeData)}
      </div>
    </div>
  );
};

/**
 * 渲染笔画顺序可视化
 * @param strokeData 笔画数据
 * @returns JSX元素
 */
const renderStrokeOrderVisualization = (strokeData: any) => {
  if (!strokeData || !strokeData.strokeSVGs || strokeData.strokeSVGs.length === 0) {
    return null;
  }

  const strokeElements = [];
  
  // 渲染每个笔画的缩略图
  for (let i = 0; i < strokeData.strokeSVGs.length; i++) {
    const strokeIndex = i + 1;
    
    strokeElements.push(
      <div key={i} className={styles['stroke-order-item']}>
        <div 
          className={styles['stroke-order-svg']}
          dangerouslySetInnerHTML={{ __html: strokeData.strokeSVGs[i] }}
        />
        {/* <span className="stroke-order-number">{strokeIndex}</span> */}
      </div>
    );
    
    // // 在笔画之间添加箭头（除了最后一个）
    // if (i < strokeData.strokeSVGs.length - 1 && strokeData.includeArrows) {
    //   strokeElements.push(
    //     <span key={`arrow-${i}`} className={styles['stroke-order-arrow']}>
    //       {strokeData.arrowChar || '→'}
    //     </span>
    //   );
    // }
  }
  
  return strokeElements;
};



export default StrokeOrder;