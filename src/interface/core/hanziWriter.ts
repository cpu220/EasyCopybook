export interface IDefaultBorderStyle {
    showBorder: boolean;
    useDashedLines: boolean;
    backgroundColor: string;
    lineWidth: number;
    lineColor: string;
    borderColor: string;
    borderDash: boolean;
}

export interface IBaseFontRenderOptions {
    width: number;
    height: number;
    fontSize: number;
    strokeWidth: number;
    strokeColor: string;
    radicalColor: string;
    useGridBackground: boolean;
    gridColor: string;
    padding: number;
    useLocalData: boolean;
}

export interface IStrokeFontRenderOptions extends IBaseFontRenderOptions {
    renderMode: string;
    showOutline: boolean;
    radicalColor: string;
    fontSizeRatio: number;
    showBorder: boolean;

}