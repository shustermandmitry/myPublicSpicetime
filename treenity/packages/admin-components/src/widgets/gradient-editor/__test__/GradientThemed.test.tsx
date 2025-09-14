/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ThemeProvider from '@/utils/ThemeProvider';
import { jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import GradientThemed, { GradientThemedValues } from '../index';

const defaultValue: GradientThemedValues = {
  points: {
    0: {
      position: 12,
      color: 'rgb(255,0,0)',
    },
    1: {
      position: 48,
      color: 'rgb(0,255,0)',
    },
  },
  angle: 182,
};

const cookies = createCookies(parseCookies(document.cookie), setCookie);
let valueMock: GradientThemedValues = defaultValue;

const updateMock = jest.fn((value: GradientThemedValues) => {
  valueMock = value;
  return valueMock;
});

const removeMock = jest.fn((key: number) => key);

describe('GradientThemed', () => {
  beforeEach(() => {
    updateMock.mockClear();
    valueMock = defaultValue;
  });

  it('render gradient-editor component', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <GradientThemed value={valueMock} onChange={updateMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-1863npy"]`);
    const angleSelector = container.querySelector(`div[class="css-6qlw1o"]`);
    const slider = container.querySelector(`div[class^="ant-slider css-n1fsnp"]`);
    const points = container.querySelector(`div[class="css-149v6x7"]`);
    const preview = container.querySelector(`div[class="css-16yzsto"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(angleSelector).toBeInTheDocument();
    expect(slider).toBeInTheDocument();
    expect(points).toBeInTheDocument();
    expect(preview).toBeInTheDocument();
    expect(preview).toBeInTheDocument();

    const outerCircle = angleSelector!.querySelector(`div[class="css-jf8qcu"]`);

    expect(outerCircle).toHaveStyle(`transform: rotate(92deg)`);

    act(() => {
      fireEvent.mouseDown(outerCircle!, { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(outerCircle!, { clientX: 40, clientY: 20 });
      fireEvent.mouseUp(outerCircle!, { clientX: 40, clientY: 20 });
    });

    expect(updateMock.mock.calls).toHaveLength(2);
    expect(updateMock.mock.calls.at(-1)).toEqual([
      {
        angle: 116,
        points: {
          '0': {
            color: 'rgb(39,174,96)',
            position: 0,
          },
          '1': {
            color: 'rgb(39,174,96)',
            position: 100,
          },
        },
      },
    ]);

    expect(outerCircle).toHaveStyle(`transform: rotate(92deg)`);

    const listPointsContainer = points!.querySelectorAll(`div[class="css-1pg4spb"]`);

    expect(listPointsContainer).toHaveLength(2);

    const newColors = [
      [255, 0, 255, 70],
      [0, 255, 0, 80],
    ];

    [...listPointsContainer].forEach((containerPoint, index) => {
      const positionInput = containerPoint.querySelector(`input[class^="ant-input ant-input-sm"]`);
      const colorTrigger = containerPoint.querySelector(`div[class^="ant-color-picker-trigger"]`);
      expect(positionInput).toBeInTheDocument();
      expect(colorTrigger).toBeInTheDocument();

      fireEvent.click(colorTrigger!);

      const colorPickerPopover = containerPoint!.querySelector(
        `div[class^="ant-popover ant-zoom-big-appear"]`,
      );
      expect(colorPickerPopover).toBeInTheDocument();
      const colorPickerInputWrapper = colorPickerPopover!.querySelector(
        `div[class="ant-color-picker-input-container"]`,
      );
      expect(colorPickerInputWrapper).toBeInTheDocument();
      const colorPickerInputs = colorPickerInputWrapper!.querySelectorAll(
        `input[class="ant-input-number-input"]`,
      );

      expect(colorPickerInputs).toHaveLength(4);

      fireEvent.change(positionInput!, { target: { value: 15 * (index + 1) } });

      [...colorPickerInputs].forEach((input, indexColor) => {
        expect(input).toBeInTheDocument();
        fireEvent.change(input!, { target: { value: newColors[index][indexColor] } });
      });

      fireEvent.click(colorTrigger!);

      const colorPickerPopover2 = containerPoint!.querySelector(
        `div[class^="ant-popover ant-zoom-big-appear"]`,
      );
      expect(colorPickerPopover2).not.toBeInTheDocument();
    });

    expect(updateMock.mock.calls.at(-1)).toEqual([
      {
        angle: 0,
        points: {
          '0': {
            color: 'rgba(255, 0, 255, 0.7)',
            position: 15,
          },
          '1': {
            color: 'rgba(0, 255, 0, 0.8)',
            position: 30,
          },
        },
      },
    ]);
  });

  it('add new points', async () => {
    const { container, rerender } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <GradientThemed value={valueMock} onChange={updateMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-1863npy"]`);
    const points = root!.querySelector(`div[class="css-149v6x7"]`);
    const listPointsContainer = points!.querySelectorAll(`div[class="css-1pg4spb"]`);
    const addPointButton = points!.querySelector(`button[class^="ant-btn"][id="add-button"]`);
    const addPointButtonText = addPointButton!.querySelector(`span[class="css-zn03tt"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(points).toBeInTheDocument();
    expect(addPointButton).toBeInTheDocument();
    expect(addPointButtonText).toBeInTheDocument();
    expect(addPointButtonText).toHaveTextContent('Add');
    expect(listPointsContainer).toHaveLength(2);

    fireEvent.click(addPointButton!);

    rerender(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <GradientThemed value={valueMock} onChange={updateMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const listPointsContainer2 = points!.querySelectorAll(`div[class="css-8owrcs"]`);

    expect(listPointsContainer2).toHaveLength(3);
  });
});
