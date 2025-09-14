/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ThemeProvider from '@/utils/ThemeProvider';
import { fireEvent, render } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import React from 'react';
import ShadowThemed from '../index';

const cookies = createCookies(parseCookies(document.cookie), setCookie);

const handleChange = jest.fn();

describe('shadow-editor component', () => {
  beforeEach(() => {
    handleChange.mockClear();
  });

  const renderComponent = (props = {}) =>
    render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <ShadowThemed {...props} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

  it('renders with correct structure and styles', () => {
    const { container } = renderComponent({ value: {}, onChange: jest.fn() });

    const rootElement = container.firstChild;
    expect(rootElement).toHaveClass('css-1jibmi3');

    const gridElement = rootElement!.firstChild;
    expect(gridElement).toHaveClass('css-v3ywfp');

    const panelItems = container.querySelectorAll('.css-1vyuchv');
    expect(panelItems).toHaveLength(5); // 4 inputs + 1 color picker
  });

  it('renders all input fields and color picker', () => {
    const { container } = renderComponent({ value: {}, onChange: jest.fn() });

    const inputFields = container.querySelectorAll('.ant-input-affix-wrapper');
    expect(inputFields).toHaveLength(4); // X, Y, Blur, Spread

    const colorPicker = container.querySelector('.ant-color-picker-trigger');
    expect(colorPicker).toBeInTheDocument();
  });

  it('displays correct labels for all fields', () => {
    const { container } = renderComponent({ value: {}, onChange: jest.fn() });

    const labels = container.querySelectorAll('.ant-typography');
    expect(labels).toHaveLength(5); // X, Y, Blur, Spread, Color

    const labelTexts = Array.from(labels).map(label => label.textContent);
    expect(labelTexts).toEqual(['X', 'Y', 'Blur', 'Spread', 'Color']);
  });

  it('displays correct icons for input fields', () => {
    const { container } = renderComponent({ value: {}, onChange: jest.fn() });

    const icons = container.querySelectorAll('.ant-input-prefix i');
    expect(icons).toHaveLength(4);

    const iconClasses = Array.from(icons).map(icon => icon.className);
    expect(iconClasses.some(className => className.includes('icon-x-axis_outlined'))).toBeTruthy();
    expect(iconClasses.some(className => className.includes('icon-y-axis_outlined'))).toBeTruthy();
    expect(
      iconClasses.some(className => className.includes('icon-shadow-blur_outlined')),
    ).toBeTruthy();
    expect(
      iconClasses.some(className => className.includes('icon-shadow-spread_outlined')),
    ).toBeTruthy();
  });

  it('calls onChange with correct values when inputs change', () => {
    const { container } = renderComponent({ value: {}, onChange: handleChange });

    const inputs = container.querySelectorAll('.ant-input');
    fireEvent.change(inputs[0], { target: { value: '10' } });

    expect(handleChange).toHaveBeenCalledWith({
      x: '10px',
      y: '0px',
      blur: '0px',
      spread: '0px',
      color: '#000000',
    });
  });

  it('maintains other values when changing one input', () => {
    const initialValue = { x: '10px', y: '20px', blur: '5px', spread: '2px', color: '#FF0000' };
    const { container } = renderComponent({ value: initialValue, onChange: handleChange });

    const inputs = container.querySelectorAll('.ant-input');
    fireEvent.change(inputs[2], { target: { value: '15' } });

    expect(handleChange).toHaveBeenCalledWith({
      ...initialValue,
      blur: '15px',
    });
  });

  it('sets undefined when all values are removed', () => {
    const { container } = renderComponent({
      value: { x: '10px', y: '0px', blur: '0px', spread: '0px', color: '#000000' },
      onChange: handleChange,
    });

    const inputs = container.querySelectorAll('.ant-input');
    fireEvent.change(inputs[0], { target: { value: '' } });

    expect(handleChange).toHaveBeenCalledWith(undefined);
  });

  it('displays correct initial values', () => {
    const initialValue = { x: '10px', y: '20px', blur: '5px', spread: '2px', color: '#FF0000' };
    const { container } = renderComponent({ value: initialValue, onChange: jest.fn() });

    const inputs = container.querySelectorAll('.ant-input');
    expect(inputs[0]).toHaveValue('10');
    expect(inputs[1]).toHaveValue('20');
    expect(inputs[2]).toHaveValue('5');
    expect(inputs[3]).toHaveValue('2');

    const colorPicker = container.querySelector('.ant-color-picker-trigger-text');
    expect(colorPicker).toHaveTextContent('#FF0000');
  });
});
