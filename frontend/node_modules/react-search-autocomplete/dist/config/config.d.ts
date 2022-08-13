import Fuse from 'fuse.js';
export interface DefaultTheme {
    height?: string;
    border?: string;
    borderRadius?: string;
    backgroundColor?: string;
    boxShadow?: string;
    hoverBackgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    iconColor?: string;
    lineColor?: string;
    placeholderColor?: string;
    zIndex?: number;
    clearIconMargin?: string;
    searchIconMargin?: string;
}
declare const defaultTheme: DefaultTheme;
declare const defaultFuseOptions: Fuse.IFuseOptions<any>;
export { defaultTheme, defaultFuseOptions };
