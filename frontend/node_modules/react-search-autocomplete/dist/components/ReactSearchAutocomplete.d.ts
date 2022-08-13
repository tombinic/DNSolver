import { default as Fuse } from 'fuse.js';
import { FocusEventHandler } from 'react';
import { DefaultTheme } from '../config/config';
export declare const DEFAULT_INPUT_DEBOUNCE = 200;
export declare const MAX_RESULTS = 10;
export interface ReactSearchAutocompleteProps<T> {
    items: T[];
    fuseOptions?: Fuse.IFuseOptions<T>;
    inputDebounce?: number;
    onSearch?: (keyword: string, results: T[]) => void;
    onHover?: (result: T) => void;
    onSelect?: (result: T) => void;
    onFocus?: FocusEventHandler<HTMLInputElement>;
    onClear?: Function;
    showIcon?: boolean;
    showClear?: boolean;
    maxResults?: number;
    placeholder?: string;
    autoFocus?: boolean;
    styling?: DefaultTheme;
    resultStringKeyName?: string;
    inputSearchString?: string;
    formatResult?: Function;
}
export default function ReactSearchAutocomplete<T>({ items, fuseOptions, inputDebounce, onSearch, onHover, onSelect, onFocus, onClear, showIcon, showClear, maxResults, placeholder, autoFocus, styling, resultStringKeyName, inputSearchString, formatResult }: ReactSearchAutocompleteProps<T>): JSX.Element;
