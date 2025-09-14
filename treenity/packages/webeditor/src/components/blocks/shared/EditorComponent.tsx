/*
 * Copyright (c) 2024. Treenity Inc.
 */

import React, { Children, useEffect, useMemo, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface WithInlineTextProps {
  children: React.ReactNode;
  initialValue?: string;
  isEditMode?: boolean;
  onChange: (value: string) => void;
}

const getInitialValue = (children: React.ReactNode, initialValue?: string): string => {
  if (React.isValidElement(children)) {
    if (Children.count(children) > 1) {
      throw new Error('Only one child is allowed');
    }
    return (children.props.children as string) || initialValue || '';
  }

  return (children as string) || '';
};

const useInlineTextState = (
  children: React.ReactNode,
  initialValue: string | undefined,
  onChange: (value: string) => void,
) => {
  const syncedValue = useRef(getInitialValue(children, initialValue));

  const debouncedCallback = useDebouncedCallback((value: string) => {
    syncedValue.current = value;
    onChange(value);
  }, 150);

  return { syncedValue, debouncedCallback };
};

export function EditorComponent({
  children,
  initialValue,
  onChange,
  isEditMode = false,
}: WithInlineTextProps) {
  const ref = useRef<HTMLElement>(null);

  const { syncedValue, debouncedCallback } = useInlineTextState(children, initialValue, onChange);

  useEffect(() => {
    if (!ref.current || !isEditMode) return;

    const newValue = getInitialValue(children, initialValue);

    if (newValue !== syncedValue.current) {
      syncedValue.current = newValue;
      ref.current.innerHTML = newValue;
    }
  }, [children, initialValue, isEditMode]);

  const childProps: React.HTMLAttributes<HTMLElement> = React.isValidElement(children)
    ? children.props
    : {};

  const extraProps = useMemo(
    () => ({
      style: {
        ...childProps?.style,
        pointerEvents: 'all' as const,
        cursor: 'text',
      },
      contentEditable: isEditMode,
      ref,
      onInput: (e: React.FormEvent<HTMLElement>) => debouncedCallback(e.currentTarget.innerHTML),
      suppressContentEditableWarning: true,
      dangerouslySetInnerHTML: { __html: syncedValue.current },
    }),
    [isEditMode, debouncedCallback],
  );

  if (React.isValidElement(children)) {
    return React.cloneElement(children, { ...childProps, ...extraProps }, null);
  }

  return isEditMode ? <span {...extraProps} /> : children;
}
