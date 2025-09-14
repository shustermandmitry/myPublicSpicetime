/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ThemeProvider from '@/utils/ThemeProvider';
import { jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import { IPoint } from '../index';
import PointInput from '../PointInput';

const defaultValue: IPoint = {
  position: 30,
  color: 'rgb(255, 0, 0)',
};

const cookies = createCookies(parseCookies(document.cookie), setCookie);
let valueMock: IPoint = defaultValue;

const updateMock = jest.fn((value: IPoint) => {
  valueMock = value;
  return value;
});

const removeMock = jest.fn((key: number) => key);

describe('PointInputs', () => {
  beforeEach(() => {
    updateMock.mockClear();
    valueMock = defaultValue;
  });

  it('render PointInput component', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <PointInput
            index={0}
            count={2}
            value={valueMock}
            onChange={updateMock}
            onRemove={removeMock}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-1pg4spb"]`);
    const positionInput = root!.querySelector(`input[max="100"][min="0"][type="number"]`);
    const colorTrigger = root!.querySelector(`div[class^="ant-color-picker-trigger"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(positionInput).toBeInTheDocument();
    expect(colorTrigger).toBeInTheDocument();
    expect(colorTrigger).toHaveTextContent(defaultValue.color);
  });

  it('change values', async () => {
    const newColor = [255, 255, 0, 100];
    const newPosition = 10;

    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <PointInput
            index={0}
            count={2}
            value={valueMock}
            onChange={updateMock}
            onRemove={removeMock}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-1pg4spb"]`);
    const positionInput = root!.querySelector(`input[max="100"][min="0"][type="number"]`);
    const colorTrigger = root!.querySelector(`div[class^="ant-color-picker-trigger"]`);

    // expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(positionInput).toBeInTheDocument();
    expect(colorTrigger).toBeInTheDocument();
    expect(colorTrigger).toHaveTextContent(defaultValue.color);

    expect(updateMock.mock.calls).toHaveLength(0);

    fireEvent.click(colorTrigger!);

    expect(updateMock.mock.calls).toHaveLength(0);

    const colorPickerPopover = root!.querySelector(`div[class^="ant-popover ant-zoom-big-appear"]`);
    const colorPickerInputWrapper = colorPickerPopover!.querySelector(
      `div[class="ant-color-picker-input-container"]`,
    );
    const colorPickerInputs = colorPickerInputWrapper!.querySelectorAll(
      `input[class="ant-input-number-input"]`,
    );

    expect(colorPickerPopover).toBeInTheDocument();
    expect(colorPickerInputWrapper).toBeInTheDocument();

    expect(colorPickerInputs).toHaveLength(4);

    [...colorPickerInputs].forEach((input, index) => {
      expect(input).toBeInTheDocument();

      if (index === 3) {
        expect(input).toHaveAttribute('aria-valuemax', '100');
        expect(input).toHaveAttribute('aria-valuemin', '0');
      } else {
        expect(input).toHaveAttribute('aria-valuemax', '255');
        expect(input).toHaveAttribute('aria-valuemin', '0');
      }

      fireEvent.change(input!, { target: { value: newColor[index] } });
    });

    expect(updateMock.mock.calls).toHaveLength(1);

    expect(updateMock.mock.calls.at(-1)).toEqual([
      {
        color: `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`,
        position: defaultValue.position,
      },
    ]);

    fireEvent.change(positionInput!, { target: { value: newPosition } });

    expect(updateMock.mock.calls).toHaveLength(2);

    expect(updateMock.mock.calls.at(-1)).toEqual([
      {
        color: `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`,
        position: newPosition,
      },
    ]);
  });
});
