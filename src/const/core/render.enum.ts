
/**
 * 字帖渲染类型
 */
export const enum RENDER_TYPE {
    NORMAL = 'normal', // 普通模式
    ANIMATION = 'animation', // 动画模式
    STROKE = 'stroke', // 笔画模式
}

/**
 * 背景类型枚举
 */
export const enum BACKGROUND_TYPE {
    NONE = 'none', // 没有背景
    DOT_GRID = 'dotGrid', // 米字格
    SQUARE_GRID = 'squareGrid', // 田字格
}

/**
 * 字帖布局类型枚举
 */
export const enum TEMPLATE_LAYOUT_TYPE {
    NORMAL = 'normal', // 常规字帖布局
    PRACTICE = 'practice', // 练字贴布局（n排一个字）
    POETRY = 'poetry', // 诗词布局
}

export const enum RENDERING_ENGINE {
    HANZI = 'hanzi', // hanzi-writer 渲染
    FONT = 'font', // font-family生成
}
