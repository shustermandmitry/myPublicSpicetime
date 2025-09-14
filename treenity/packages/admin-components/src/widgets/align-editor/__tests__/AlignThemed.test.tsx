/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ThemeProvider from '@/utils/ThemeProvider';
import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { CookieContext, createCookies, parseCookies, setCookie } from '@treenity/repository/client';
import AlignThemed from '../index';
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
          <AlignThemed
            onChange={updateMock}
            value={valueMock}
            orientation={orientation[0]}
            display={'flex'}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );
    screen.debug(undefined, 3000000);
    const root = container.querySelector(`div[class="css-1nfl3cs"]`);
    const matrix = root!.querySelector(`div[class="css-104qive"]`);
    const icons = root!.querySelectorAll(`div[class="css-1y0qc01"]`);
    const selectors = root!.querySelectorAll(`div[class="css-cwg4x1"]`);
    const justifySelectInput = selectors[0]!.querySelector(`input`);
    const alignSelect = selectors[1]!.querySelector(`input`);
    const justifySelectInputValue = selectors[0]!.querySelector(
      `div[class="ant-select-selection-item"]`,
    );
    const alignSelectValue = selectors[1]!.querySelector(`div[class="ant-select-selection-item"]`);

    // expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(matrix).toBeInTheDocument();
    expect(icons).toHaveLength(9);
    expect(justifySelectInput).toBeInTheDocument();
    expect(alignSelect).toBeInTheDocument();
    expect(justifySelectInputValue).not.toBeInTheDocument();
    expect(alignSelectValue).not.toBeInTheDocument();
  });

  // it('should open the dropdown and select an option', () => {
  //   const { container, rerender } = render(
  //     <CookieContext.Provider value={ cookies }>
  //       <ThemeProvider>
  //         <align-editor onChange={updateMock} value={valueMock} orientation="row" />
  //       </ThemeProvider>
  //     </CookieContext.Provider>,
  //   );
  //   screen.debug(undefined, 3000000);
  //   const selectors = container.querySelectorAll(`div[class="css-cwg4x1"]`);
  //   expect(selectors).toHaveLength(2);
  //   const justifySelectComponent = selectors[0]!.querySelector(`div[class^="ant-select"]`);
  //   expect(justifySelectComponent).toBeInTheDocument();
  //   const alignSelectComponent = selectors[1]!.querySelector(`div[class^="ant-select"]`);
  //   expect(alignSelectComponent).toBeInTheDocument();
  //
  //   fireEvent.mouseDown(justifySelectComponent!);
  //
  //   const dropdown = document.querySelector(`div[class*="ant-select-dropdown"]`);
  //   expect(dropdown).toBeInTheDocument();
  //   const options = dropdown!.querySelectorAll(
  //     `div[class="ant-select-item ant-select-item-option"]`,
  //   );
  //   expect(options).toHaveLength(5);
  //
  //   fireEvent.click(options[0]);
  //
  //   rerender(
  //     <CookieContext.Provider value={ cookies }>
  //       <ThemeProvider>
  //         <align-editor onChange={updateMock} value={valueMock} orientation="row" />
  //       </ThemeProvider>
  //     </CookieContext.Provider>,
  //   );
  //
  //   const selectedValue = justifySelectComponent!.querySelector(
  //     `div[class="ant-select-selection-item"]`,
  //   );
  //   expect(selectedValue).toHaveTextContent('Option 1');
  // });
});
