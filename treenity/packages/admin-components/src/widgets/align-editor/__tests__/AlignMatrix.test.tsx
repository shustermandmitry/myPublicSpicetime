/*
 * Copyright (c) 2024. Treenity Inc.
 */
import ThemeProvider from '@/utils/ThemeProvider';
import { jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import { CookieContext, createCookies, parseCookies, setCookie } from '@treenity/repository/client';
import AlignMatrix from '../AlignMatrix';
import { alignIcons } from '../AlignMatrixCell';
import type { AlignOrientationProps, AlignVariation } from '../types';

const cookies = createCookies(parseCookies(document.cookie), setCookie);

const defaultValue: AlignVariation | undefined = undefined;

let valueMock: AlignVariation | undefined = defaultValue;

const updateMock = jest.fn((value: AlignVariation) => {
  valueMock = value;
  return value;
});

const orientation: AlignOrientationProps[] = ['row', 'column'];

describe('AlignMatrix', () => {
  beforeEach(() => {
    updateMock.mockClear();
    valueMock = defaultValue;
  });

  it('render AlignMatrix component', async () => {
    const { container } = render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrix
            orientation={orientation[0]}
            onSelect={updateMock}
            value={valueMock}
            display={'flex'}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`body > div > div`);
    const items = root!.querySelectorAll(`body > div > div > div`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(items).toHaveLength(9);

    [...items].forEach((item, index) => {
      const icon = item.querySelector(`i`);
      expect(item).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('icon-matrix-point_outlined');
    });
  });

  it('render AlignMatrix component with triple value', async () => {
    const newValue = 'left_stretch';

    const { container, rerender } = render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrix
            orientation={orientation[0]}
            onSelect={updateMock}
            value={newValue}
            display={'flex'}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`body > div > div`);
    expect(root).toBeInTheDocument();
    const items = root!.querySelectorAll(`body > div > div > div`);

    expect(root).toMatchSnapshot();
    expect(items).toHaveLength(3);

    [...items].forEach((item, index) => {
      const icons = item.querySelectorAll(`i`);
      expect(item).toBeInTheDocument();

      if (index === 0) {
        expect(icons).toHaveLength(1);
        expect(icons[0]).toBeInTheDocument();
        expect(icons[0]).toHaveClass('icon-stretch-horizontal_outlined');
      } else {
        [...icons].forEach(icon => {
          expect(icons).toHaveLength(3);
          expect(icon).toBeInTheDocument();
          expect(icon).toHaveClass('icon-matrix-point_outlined');
        });
      }
    });

    fireEvent.click(items[1]);

    rerender(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrix
            orientation={orientation[0]}
            onSelect={updateMock}
            value={valueMock}
            display={'flex'}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(updateMock.mock.calls).toHaveLength(1);

    expect(updateMock.mock.calls.at(-1)).toEqual(['center_stretch']);

    const items2 = root!.querySelectorAll(`body > div > div > div`);
    expect(items2[1]).toBeInTheDocument();
    const icon = items2[1]!.querySelector(`i`);
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveClass('icon-matrix-point_outlined');
    expect(icon).toHaveClass(`icon-${alignIcons['flex'][orientation[0]][valueMock!]}`);
  });

  it('render AlignMatrix component with triple and origin column', async () => {
    const newValue = 'left_stretch';

    const { container, rerender } = render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrix
            orientation={orientation[1]}
            onSelect={updateMock}
            value={newValue}
            display={'flex'}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`body > div > div`);
    expect(root).toBeInTheDocument();
    const items = root!.querySelectorAll(`body > div > div > div`);

    expect(root).toMatchSnapshot();
    expect(items).toHaveLength(3);

    [...items].forEach((item, index) => {
      const icons = item.querySelectorAll(`i`);
      expect(item).toBeInTheDocument();

      if (index === 0) {
        expect(icons).toHaveLength(1);
        expect(icons[0]).toBeInTheDocument();
        expect(icons[0]).toHaveClass('icon-stretch-vertical_outlined');
      } else {
        [...icons].forEach(icon => {
          expect(icons).toHaveLength(3);
          expect(icon).toBeInTheDocument();
          expect(icon).toHaveClass('icon-matrix-point_outlined');
        });
      }
    });

    fireEvent.click(items[1]);

    rerender(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrix
            orientation={orientation[0]}
            onSelect={updateMock}
            value={valueMock}
            display={'flex'}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(updateMock.mock.calls).toHaveLength(1);

    expect(updateMock.mock.calls.at(-1)).toEqual(['center_stretch']);

    const items2 = root!.querySelectorAll(`body > div > div > div`);
    expect(items2[1]).toBeInTheDocument();
    const icon = items2[1]!.querySelector(`i`);
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveClass('icon-matrix-point_outlined');
    expect(icon).toHaveClass(`icon-${alignIcons['flex'][orientation[0]][valueMock!]}`);
  });

  it('render AlignMatrix component with single value', async () => {
    const newValue = 'space-around_stretch';

    const { container, rerender } = render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrix
            orientation={orientation[1]}
            onSelect={updateMock}
            value={newValue}
            display={'flex'}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`body > div > div`);
    expect(root).toBeInTheDocument();
    const items = root!.querySelectorAll(`body > div > div > div`);

    expect(root).toMatchSnapshot();
    expect(items).toHaveLength(1);

    [...items].forEach((item, index) => {
      const icons = item.querySelectorAll(`i`);
      expect(item).toBeInTheDocument();

      if (index === 0) {
        expect(icons).toHaveLength(1);
        expect(icons[0]).toBeInTheDocument();
        expect(icons[0]).toHaveClass('icon-space-around-vertical_outlined');
      } else {
        [...icons].forEach(icon => {
          expect(icons).toHaveLength(3);
          expect(icon).toBeInTheDocument();
          expect(icon).toHaveClass('icon-matrix-point_outlined');
        });
      }
    });

    fireEvent.click(items[0]);

    rerender(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrix
            orientation={orientation[0]}
            onSelect={updateMock}
            value={valueMock}
            display={'flex'}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(updateMock.mock.calls).toHaveLength(1);
    expect(updateMock.mock.calls.at(-1)).toEqual(['space-around_stretch']);
    const items2 = root!.querySelectorAll(`body > div > div > div`);
    expect(items2).toHaveLength(1);
    expect(items2[0]).toBeInTheDocument();
    const icon = items2[0]!.querySelector(`i`);
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveClass('icon-matrix-point_outlined');
    expect(icon).toHaveClass(`icon-${alignIcons['flex'][orientation[0]][valueMock!]}`);
  });
});
