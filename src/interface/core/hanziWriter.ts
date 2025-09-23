export interface IDefaultBorderStyleConfig {
    showBorder: boolean;
    useDashedLines: boolean;
    backgroundColor: string;
    lineWidth: number;
    lineColor: string;
    borderColor: string;
    borderDash: boolean;
}

export interface IBaseFontRenderConfig {
    width: number;
    height: number;
    fontSize: number;
    strokeWidth: number;
    strokeColor: string;
    radicalColor: string; 
    padding: number;
}

export interface IDefaultStrokeFontRenderConfig extends IBaseFontRenderConfig {
    renderMode: string;
    showOutline: boolean;
    radicalColor: string;
    fontSizeRatio: number;
    showBorder: boolean;

}