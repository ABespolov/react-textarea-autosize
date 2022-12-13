import * as React from 'react';
import calculateNodeHeight from './calculateNodeHeight';
import getSizingData, { SizingData } from './getSizingData';
import { useComposedRef, useWindowResizeListener } from './hooks';
import { noop } from './utils';
import { getFormattedText } from './getFormattedText';
import { ClipboardEventHandler, useEffect } from 'react';
import { getCursorPos } from './cursorPosition';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type Style = Omit<
  NonNullable<TextareaProps['style']>,
  'maxHeight' | 'minHeight'
> & {
  height?: number;
};

export type TextareaHeightChangeMeta = {
  rowHeight: number;
};
export interface TextareaAutosizeProps
  extends Omit<TextareaProps, 'style' | 'onChange'> {
  maxRows?: number;
  minRows?: number;
  onHeightChange?: (height: number, meta: TextareaHeightChangeMeta) => void;
  cacheMeasurements?: boolean;
  style?: Style;
  maxHeight?: number;
  onChange: (v: string) => void;
}

const availableSymbols =
  /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n\s\t]*$/;

const TextareaAutosize: React.ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaAutosizeProps
> = (
  {
    cacheMeasurements,
    maxRows,
    minRows,
    onChange,
    onHeightChange = noop,
    maxHeight,
    value,
    style,
    ...props
  },
  userRef: React.Ref<HTMLTextAreaElement>,
) => {
  if (process.env.NODE_ENV !== 'production' && props.style) {
    if ('maxHeight' in props.style) {
      throw new Error(
        'Using `style.maxHeight` for <TextareaAutosize/> is not supported. Please use `maxRows`.',
      );
    }
    if ('minHeight' in props.style) {
      throw new Error(
        'Using `style.minHeight` for <TextareaAutosize/> is not supported. Please use `minRows`.',
      );
    }
  }
  const isControlled = props.value !== undefined;
  const libRef = React.useRef<HTMLTextAreaElement | null>(null);
  const ref = useComposedRef(libRef, userRef);
  const heightRef = React.useRef(0);
  const measurementsCacheRef = React.useRef<SizingData>();

  const resizeTextarea = () => {
    const node = libRef.current!;
    const nodeSizingData =
      cacheMeasurements && measurementsCacheRef.current
        ? measurementsCacheRef.current
        : getSizingData(node);

    if (!nodeSizingData) {
      return;
    }

    measurementsCacheRef.current = nodeSizingData;

    const [height, rowHeight] = calculateNodeHeight(
      nodeSizingData,
      node.value || node.placeholder || 'x',
      minRows,
      maxRows,
    );

    if (heightRef.current !== height) {
      heightRef.current = height;
      node.style.setProperty('height', `${height}px`, 'important');
      onHeightChange(height, { rowHeight });
    }
  };

  const handleChange = () => {
    const inp = libRef.current!;
    const pos = getCursorPos(inp);

    if (!isControlled) {
      resizeTextarea();
    }

    const str = getFormattedText(libRef.current);
    libRef.current!.value = str;

    if (
      inp.value[inp.value.length - 1] === ' ' &&
      inp.value[inp.value.length - 2] === '\n'
    ) {
      inp.value = inp.value.slice(0, -2);
    }

    while (
      (maxHeight !== undefined && heightRef.current > maxHeight) ||
      !availableSymbols.test(inp.value)
    ) {
      inp.value = inp.value.slice(0, -1);
      resizeTextarea();
    }

    inp.selectionEnd = pos.end;

    onChange(inp.value);
  };

  const onPaste = (e: any) => {
    if (libRef.current && !availableSymbols.test(libRef.current.value)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const inp = libRef.current;

    if (value && inp) {
      inp.value = String(value);
    }

    resizeTextarea();

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'style') {
          handleChange();
        }
      });
    });

    const observerConfig = {
      attributes: true,
      attributeFilter: ['style'],
    };

    observer.observe(inp as any, observerConfig);
  }, []);

  if (typeof document !== 'undefined') {
    React.useLayoutEffect(resizeTextarea);
    useWindowResizeListener(resizeTextarea);
  }

  const handleFocus = (e: any) => {
    e.stopPropagation();
    libRef.current?.focus({ preventScroll: true });
  };

  return (
    <div onClick={handleFocus}>
      <textarea
        {...props}
        ref={ref}
        style={{ ...style, whiteSpace: 'pre-wrap', pointerEvents: 'none' }}
        onInput={handleChange}
        onPaste={onPaste}
      />
    </div>
  );
};

export default /* #__PURE__ */ React.forwardRef(TextareaAutosize);
