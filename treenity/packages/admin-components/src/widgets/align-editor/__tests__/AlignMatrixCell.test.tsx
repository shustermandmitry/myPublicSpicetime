/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ThemeProvider from '@/utils/ThemeProvider';
import { jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import { CookieContext, createCookies, parseCookies, setCookie } from '@treenity/repository/client';
import AlignMatrixCell, { alignIcons } from '../AlignMatrixCell';
import type { AlignOrientationProps, AlignVariation } from '../types';

const cookies = createCookies(parseCookies(document.cookie), setCookie);

const defaultValue: AlignVariation = 'left_start';

let valueMock: AlignVariation = defaultValue;

const updateMock = jest.fn((value: AlignVariation) => {
  valueMock = value;
  return value;
});

const orientation: AlignOrientationProps[] = ['row', 'column'];
const value = 'left_start';

describe('AlignMatrixCell', () => {
  beforeEach(() => {
    updateMock.mockClear();
    valueMock = defaultValue;
  });

  it('render AlignMatrixCell component', async () => {
    const { container } = render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrixCell
            display={'flex'}
            key={0}
            value={value}
            orientation={orientation[0]}
            selected={false}
            cellsType="full"
            onClick={() => updateMock(value)}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`body > div > div`);
    const icon = root!.querySelector(`i`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('icon-matrix-point_outlined');
    expect(icon).not.toHaveClass(`icon-${alignIcons['flex'][orientation[0]][value]}`);
  });

  it('change selected', async () => {
    const { container } = render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrixCell
            display={'flex'}
            key={0}
            value={value}
            orientation={orientation[0]}
            selected={true}
            cellsType="full"
            onClick={() => updateMock(value)}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`body > div > div`);
    const icon = root!.querySelector(`i`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveClass('icon-matrix-point_outlined');
    expect(icon).toHaveClass(`icon-${alignIcons['flex'][orientation[0]][value]}`);
  });

  it('change selected and orientation', async () => {
    const { container } = render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrixCell
            display={'flex'}
            key={0}
            value={value}
            orientation={orientation[1]}
            selected={true}
            cellsType="full"
            onClick={() => updateMock(value)}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`body > div > div`);
    const icon = root!.querySelector(`i`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveClass('icon-matrix-point_outlined');
    expect(icon).toHaveClass(`icon-${alignIcons['flex'][orientation[1]][value]}`);
  });

  it('change value', async () => {
    const newValue = 'center_start';

    const { container } = render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrixCell
            display={'flex'}
            key={0}
            value={newValue}
            orientation={orientation[0]}
            selected={true}
            cellsType="full"
            onClick={() => updateMock(value)}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`body > div > div`);
    const icon = root!.querySelector(`i`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveClass('icon-matrix-point_outlined');
    expect(icon).toHaveClass(`icon-${alignIcons['flex'][orientation[0]][newValue]}`);
  });

  it('hovered', async () => {
    const newValue = 'center_start';

    const { container } = render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrixCell
            display={'flex'}
            key={0}
            value={newValue}
            orientation={orientation[0]}
            selected={valueMock === newValue}
            cellsType="full"
            onClick={() => updateMock(value)}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`body > div > div`);
    const icon = root!.querySelector(`i`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('icon-matrix-point_outlined');
    expect(icon).not.toHaveClass(`icon-${alignIcons['flex'][orientation[0]][newValue]}`);

    fireEvent.mouseEnter(root!);

    const icon2 = root!.querySelector(`i`);
    expect(icon2).toBeInTheDocument();
    expect(icon2).not.toHaveClass('icon-matrix-point_outlined');
    expect(icon2).toHaveClass(`icon-${alignIcons['flex'][orientation[0]][newValue]}`);
  });

  it('clicked', async () => {
    const newValue = 'center_start';

    const { container, rerender } = render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrixCell
            display={'flex'}
            key={0}
            value={newValue}
            orientation={orientation[0]}
            selected={valueMock === newValue}
            cellsType="full"
            onClick={() => updateMock(value)}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`body > div > div`);
    const icon = root!.querySelector(`i`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('icon-matrix-point_outlined');
    expect(icon).not.toHaveClass(`icon-${alignIcons['flex'][orientation[0]][newValue]}`);

    fireEvent.click(root!);

    rerender(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <AlignMatrixCell
            display={'flex'}
            key={0}
            value={'left_start'}
            orientation={orientation[0]}
            selected={valueMock === 'left_start'}
            cellsType="full"
            onClick={() => updateMock(value)}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(updateMock.mock.calls).toHaveLength(1);

    expect(updateMock.mock.calls.at(-1)).toEqual(['left_start']);

    const icon2 = root!.querySelector(`i`);
    expect(icon2).toBeInTheDocument();
    expect(icon2).not.toHaveAttribute('icon-matrix-point_outlined');
    expect(icon2).toHaveClass(`icon-${alignIcons['flex'][orientation[0]]['left_start']}`);
  });
});
