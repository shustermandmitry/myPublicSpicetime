/*
 * Copyright (c) 2024. Treenity Inc.
 */
import ThemeProvider from '@/utils/ThemeProvider';
import { jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import BorderMatrix, { BorderMatrixItems } from '../BorderMatrix';

const cookies = createCookies(parseCookies(document.cookie), setCookie);
let valueMock: BorderMatrixItems = 'all';

const updateMock = jest.fn((value: BorderMatrixItems) => {
  valueMock = value;
  return value;
});

const defaultValue = 'all';

describe('BorderMatrix', () => {
  beforeEach(() => {
    updateMock.mockClear();
    valueMock = 'all';
  });

  it('render BorderMatrix component', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderMatrix onChange={updateMock} value={defaultValue} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-en83df"]`);
    const buttons = root!.querySelectorAll(`button[class^="ant-btn"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(buttons).toHaveLength(5);
    [...buttons].forEach((button, index) => {
      if (index === 2) {
        expect(button).toHaveClass('ant-btn-primary');
      } else {
        expect(button).not.toHaveClass('ant-btn-primary');
        expect(button).toHaveClass('ant-btn-default');
      }
    });
  });

  it('change BorderMatrix component', async () => {
    const { container, rerender } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderMatrix onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-en83df"]`);
    const buttons = root!.querySelectorAll(`button[class^="ant-btn"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();

    expect(buttons).toHaveLength(5);
    [...buttons].forEach((button, index) => {
      if (index === 2) {
        expect(button).toHaveClass('ant-btn-primary');
      } else {
        expect(button).not.toHaveClass('ant-btn-primary');
        expect(button).toHaveClass('ant-btn-default');
      }
    });

    expect(valueMock).toBe('all');

    await waitFor(() => fireEvent.click(buttons[4]));

    rerender(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderMatrix onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(valueMock).toBe('bottom');

    expect(updateMock).toHaveBeenCalledTimes(1);

    [...buttons].forEach((button, index) => {
      if (index === 4) {
        expect(button).toHaveClass('ant-btn-primary');
      } else {
        expect(button).not.toHaveClass('ant-btn-primary');
        expect(button).toHaveClass('ant-btn-default');
      }
    });
  });
});
