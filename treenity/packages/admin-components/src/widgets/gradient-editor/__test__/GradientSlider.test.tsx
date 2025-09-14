/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ThemeProvider from '@/utils/ThemeProvider';
import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import GradientSlider, { GradientSliderColors } from '../GradientSlider';

const defaultValue: number[] = [0, 100];

const cookies = createCookies(parseCookies(document.cookie), setCookie);
let valueMock: number[] = defaultValue;
let colorsMock: GradientSliderColors[] = [
  { position: valueMock[0], color: 'red' },
  { position: valueMock[1], color: 'green' },
];

const updateMock = jest.fn((value: number[]) => {
  valueMock = value;
  return value;
});

describe('GradientSlider', () => {
  beforeEach(() => {
    updateMock.mockClear();
    valueMock = defaultValue;
  });

  it('render GradientSlider component', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <GradientSlider
            onChange={updateMock}
            value={valueMock}
            colors={colorsMock}
            range={true}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class^="ant-slider css-uvzcrr"]`);
    const sliders = root!.querySelectorAll(`div[class^="ant-slider-handle"][role="slider"]`);
    const rail = root!.querySelector(`div[class="ant-slider-rail"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(rail).toBeInTheDocument();
    expect(sliders).toHaveLength(valueMock.length);
    expect(rail).toHaveStyle(
      `background: linear-gradient(90deg, ${colorsMock
        .map((color, position) => `${color} ${position}`)
        .join(',')})`,
    );

    [...sliders].forEach((slider, index) => {
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute('aria-valuenow', `${valueMock[index]}`);
    });
  });

  it('change slider', async () => {
    const newValues = [30, 70];
    const newColors: GradientSliderColors[] = [
      { position: newValues[0], color: 'red' },
      { position: newValues[1], color: 'green' },
    ];

    const { container, rerender } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <GradientSlider
            onChange={updateMock}
            value={valueMock}
            colors={colorsMock}
            range={true}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class^="ant-slider css-uvzcrr"]`);
    const sliders = root!.querySelectorAll(`div[class^="ant-slider-handle"][role="slider"]`);
    const rail = root!.querySelector(`div[class="ant-slider-rail"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(rail).toBeInTheDocument();
    expect(sliders).toHaveLength(valueMock.length);
    expect(rail).toHaveStyle(
      `background: linear-gradient(90deg, ${colorsMock
        .map((color, position) => `${color} ${position}`)
        .join(',')})`,
    );

    [...sliders].forEach((slider, index) => {
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute('aria-valuenow', `${valueMock[index]}`);
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    rerender(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <GradientSlider onChange={updateMock} value={newValues} colors={newColors} range={true} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    [...sliders].forEach((slider, index) => {
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute('aria-valuenow', `${newValues[index]}`);
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    expect(rail).toHaveStyle(
      `background: linear-gradient(90deg, ${newColors
        .map((color, position) => `${color} ${position}`)
        .join(',')})`,
    );
  });
});
