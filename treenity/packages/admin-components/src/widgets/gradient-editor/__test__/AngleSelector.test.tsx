/*
 * Copyright (c) 2024. Treenity Inc.
 */
import ThemeProvider from '@/utils/ThemeProvider';
import { jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import AngleSelector from '../AngleSelector';

const defaultValue: number = 0;

const cookies = createCookies(parseCookies(document.cookie), setCookie);
let valueMock: number = defaultValue;

const updateMock = jest.fn((value: number) => {
  valueMock = value;
  return value;
});

describe('AngleSelector', () => {
  beforeEach(() => {
    updateMock.mockClear();
    valueMock = defaultValue;
  });

  it('render AngleSelector component', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <AngleSelector onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-6qlw1o"]`);
    const outerCircle = root!.querySelector(`div[class="css-rp54ss"]`);
    const input = root!.querySelector(`input[class^="ant-input"]`);
    const buttonContainer = root!.querySelector(`div[class="css-5t8zso"]`);
    const buttons = buttonContainer!.querySelectorAll(`button[class^="ant-btn"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(outerCircle).toBeInTheDocument();
    expect(outerCircle).toHaveStyle(`transform: rotate(-90deg)`);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(0);
    expect(buttonContainer).toBeInTheDocument();

    [...buttons].forEach(button => {
      const buttonIcon = root!.querySelector(`i`);
      expect(button).toBeInTheDocument();
      expect(buttonIcon).toBeInTheDocument();
    });
  });

  it('change arrow', async () => {
    const { container, rerender } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <AngleSelector onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-6qlw1o"]`);
    const outerCircle = root!.querySelector(`div[class="css-rp54ss"]`);
    const input = root!.querySelector(`input[class^="ant-input"]`);
    const buttonContainer = root!.querySelector(`div[class="css-5t8zso"]`);
    const buttons = buttonContainer!.querySelectorAll(`button[class^="ant-btn"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(outerCircle).toBeInTheDocument();
    expect(outerCircle).toHaveStyle(`transform: rotate(-90deg)`);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(0);
    expect(buttonContainer).toBeInTheDocument();
    expect(buttons).toHaveLength(2);

    [...buttons].forEach((button, index) => {
      const buttonIcon = root!.querySelector(`i`);
      expect(button).toBeInTheDocument();
      expect(buttonIcon).toBeInTheDocument();
    });

    act(() => {
      fireEvent.mouseDown(outerCircle!, { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(outerCircle!, { clientX: 20, clientY: 40 });
      fireEvent.mouseUp(outerCircle!, { clientX: 20, clientY: 40 });
    });

    rerender(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <AngleSelector onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(input).toHaveValue(153);
    expect(updateMock.mock.calls).toHaveLength(2);
    expect(valueMock).toBe(153);
    expect(updateMock.mock.calls.at(-1)).toEqual([153]);
    expect(outerCircle).toHaveStyle(`transform: rotate(63deg)`);

    fireEvent.change(input!, { target: { value: '100' } });

    rerender(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <AngleSelector onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(updateMock.mock.calls.at(-1)).toEqual([100]);
    expect(outerCircle).toHaveStyle(`transform: rotate(10deg)`);

    fireEvent.click(buttons[0]!);
    expect(updateMock.mock.calls.at(-1)).toEqual([99]);
    expect(outerCircle).toHaveStyle(`transform: rotate(10deg)`);

    fireEvent.click(buttons[1]!);
    fireEvent.click(buttons[1]!);
    expect(updateMock.mock.calls.at(-1)).toEqual([101]);
    expect(outerCircle).toHaveStyle(`transform: rotate(10deg)`);
  });
});
