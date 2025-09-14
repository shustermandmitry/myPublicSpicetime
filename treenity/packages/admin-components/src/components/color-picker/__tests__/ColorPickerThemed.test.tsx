import ColorPicker from '@/components/color-picker';
import ThemeProvider from '@/utils/ThemeProvider';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
// @ts-ignore
import { AggregationColor } from 'antd/lib/color-picker/color.js';
import React from 'react';

const cookies = createCookies(parseCookies(document.cookie), setCookie);

describe('ColorPicker', () => {
  const mockOnChange = jest.fn();
  const mockOnChangeComplete = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnChangeComplete.mockClear();
  });

  it('renders color-picker component', () => {
    const { container } = render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <ColorPicker onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const root = container.querySelector('div.css-pyqgzr');
    expect(root).toBeInTheDocument();

    const colorBlock = container.querySelector('.ant-color-picker-color-block');
    expect(colorBlock).toBeInTheDocument();

    const colorText = container.querySelector('.ant-color-picker-trigger-text');
    expect(colorText).toHaveTextContent('#27AE60');
  });

  it('opens color picker dropdown when clicked', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <ColorPicker onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const colorPicker = container.querySelector('.ant-color-picker-trigger');
    expect(colorPicker).toBeInTheDocument();
    fireEvent.click(colorPicker!);

    await waitFor(() => {
      const popover = container.querySelector('.ant-popover');
      expect(popover).toBeInTheDocument();
    });
  });

  it('changes color when a new color is selected', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <ColorPicker onChange={mockOnChange} onChangeComplete={mockOnChangeComplete} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const colorPicker = container.querySelector('.ant-color-picker-trigger');
    expect(colorPicker).toBeInTheDocument();
    fireEvent.click(colorPicker!);

    await waitFor(() => {
      const hexInput = container.querySelector('.ant-color-picker-hex-input input');
      expect(hexInput).toBeInTheDocument();
      fireEvent.change(hexInput!, { target: { value: 'ff0000' } });
    });

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(AggregationColor), '#ff0000');
    expect(mockOnChangeComplete).toHaveBeenCalledWith(expect.any(AggregationColor));
  });

  it('resets to default color when reset button is clicked', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <ColorPicker onChange={mockOnChange} onChangeComplete={mockOnChangeComplete} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const resetButton = container.querySelector('button.ant-btn-text');
    expect(resetButton).toBeInTheDocument();
    fireEvent.click(resetButton!);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          metaColor: expect.objectContaining({
            r: 39,
            g: 174,
            b: 96,
            a: 1,
          }),
        }),
        '27ae60',
      );
      expect(mockOnChangeComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          metaColor: expect.objectContaining({
            r: 39,
            g: 174,
            b: 96,
            a: 1,
          }),
        }),
      );
    });
  });

  it('adds color to presets when "+ Add to Presets" is clicked', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <ColorPicker onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const colorPicker = container.querySelector('.ant-color-picker-trigger');
    expect(colorPicker).toBeInTheDocument();
    fireEvent.click(colorPicker!);

    await waitFor(() => {
      const addToPresetsButton = container.querySelector('.css-psta8o .css-1ro2kyp');
      expect(addToPresetsButton).toBeInTheDocument();
      fireEvent.click(addToPresetsButton!);
    });

    const presetColors = container.querySelectorAll('.css-psta8o .css-1ro2kyp');
    expect(presetColors.length).toBeGreaterThan(1);
  });

  it('selects color from presets when clicked', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <ColorPicker onChange={mockOnChange} value="#27ae60" />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const colorPicker = container.querySelector('.ant-color-picker-trigger');
    expect(colorPicker).toBeInTheDocument();
    fireEvent.click(colorPicker!);

    await waitFor(() => {
      const popover = container.querySelector('.ant-popover');
      expect(popover).toBeInTheDocument();
    });

    const addToPresetsButton = container.querySelector('.css-psta8o .css-1ro2kyp');
    expect(addToPresetsButton).toBeInTheDocument();
    fireEvent.click(addToPresetsButton!);

    const presetColors = container.querySelector('.css-psta8o .css-14x6vl2');
    expect(presetColors).toBeInTheDocument();
    fireEvent.click(presetColors!);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });

    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
    expect(lastCall[1]).toMatch(/^#[0-9a-f]{6}$/);
  });
});
