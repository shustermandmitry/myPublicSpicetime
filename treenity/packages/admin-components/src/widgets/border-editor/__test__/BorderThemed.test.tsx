import ThemeProvider from '@/utils/ThemeProvider';
import { jest } from '@jest/globals';
import { merge } from '@s-libs/micro-dash';
import { fireEvent, render } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import BorderThemed, { BorderThemedValue } from '../index';

const defaultValue: BorderThemedValue = {
  radius: {
    topLeft: '0px',
    topRight: '0px',
    bottomLeft: '0px',
    bottomRight: '0px',
  },
  styles: {
    top: {
      width: '0px',
      color: '#000000',
      style: 'solid',
    },
    right: {
      width: '0px',
      color: '#000000',
      style: 'solid',
    },
    bottom: {
      width: '0px',
      color: '#000000',
      style: 'solid',
    },
    left: {
      width: '0px',
      color: '#000000',
      style: 'solid',
    },
  },
};

const cookies = createCookies(parseCookies(document.cookie), setCookie);
let valueMock: BorderThemedValue = { ...defaultValue };

const updateMock = jest.fn((value: BorderThemedValue) => {
  valueMock = merge({}, valueMock, value);
  return value;
});

describe('BorderThemed', () => {
  beforeEach(() => {
    updateMock.mockClear();
    valueMock = defaultValue;
  });

  it('render', async () => {
    const { container, rerender } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderThemed onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector('div');
    expect(root).toBeInTheDocument();
    const borderMatrix = container.querySelector(`div[class="css-en83df"]`);
    expect(borderMatrix).toBeInTheDocument();
    const borderMatrixButtons = borderMatrix!.querySelectorAll('button');
    const borderRadius = container.querySelector(`div[class="css-87h8hl"]`);
    expect(borderRadius).toBeInTheDocument();
    const borderRadiusInputContainer = borderRadius!.querySelector(`div[class="css-25sofq"]`);
    expect(borderRadiusInputContainer).toBeInTheDocument();
    const borderRadiusInput =
      borderRadiusInputContainer!.querySelector(`input[class^="ant-input"]`);
    expect(borderRadiusInput).toBeInTheDocument();

    const borderStyle = container.querySelector(`div[class="css-1jibmi3"]`);
    const borderStyleInputContainers = borderStyle!.querySelectorAll(`div[class="css-1vyuchv"]`);
    const borderStyleWidthInput =
      borderStyleInputContainers[0].querySelector(`input[class^="ant-input"]`);
    const borderStyleColorInputTrigger = borderStyleInputContainers[1].querySelector(
      `div[class^="ant-color-picker-trigger ant-color-picker-sm"]`,
    );

    expect(root).toMatchSnapshot();
    expect(borderMatrixButtons).toHaveLength(5);
    expect(borderStyle).toBeInTheDocument();
    expect(borderStyleWidthInput).toBeInTheDocument();
    expect(borderStyleColorInputTrigger).toBeInTheDocument();
    expect(borderStyleInputContainers).toHaveLength(3);
    expect(updateMock.mock.calls).toHaveLength(0);
    expect(updateMock.mock.calls.at(-1)).toBeUndefined();
    expect(valueMock).toEqual({
      radius: {
        topLeft: '0px',
        topRight: '0px',
        bottomLeft: '0px',
        bottomRight: '0px',
      },
      styles: {
        top: { width: '0px', color: '#000000', style: 'solid' },
        right: { width: '0px', color: '#000000', style: 'solid' },
        bottom: { width: '0px', color: '#000000', style: 'solid' },
        left: { width: '0px', color: '#000000', style: 'solid' },
      },
    });

    fireEvent.click(borderMatrixButtons[0]);

    expect(updateMock.mock.calls).toHaveLength(0);
    expect(updateMock.mock.calls.at(-1)).toBeUndefined();
    expect(valueMock).toEqual({
      radius: {
        topLeft: '0px',
        topRight: '0px',
        bottomLeft: '0px',
        bottomRight: '0px',
      },
      styles: {
        top: { width: '0px', color: '#000000', style: 'solid' },
        right: { width: '0px', color: '#000000', style: 'solid' },
        bottom: { width: '0px', color: '#000000', style: 'solid' },
        left: { width: '0px', color: '#000000', style: 'solid' },
      },
    });

    fireEvent.change(borderRadiusInput!, { target: { value: '6' } });

    expect(updateMock.mock.calls).toHaveLength(1);
    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        radius: {
          bottomLeft: '6px',
          bottomRight: '6px',
          topLeft: '6px',
          topRight: '6px',
        },
        styles: {
          bottom: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          left: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          right: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          top: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
        },
      },
    ]);

    expect(valueMock).toEqual({
      radius: {
        topLeft: '6px',
        topRight: '6px',
        bottomLeft: '6px',
        bottomRight: '6px',
      },
      styles: {
        top: { width: '0px', color: '#000000', style: 'solid' },
        right: { width: '0px', color: '#000000', style: 'solid' },
        bottom: { width: '0px', color: '#000000', style: 'solid' },
        left: { width: '0px', color: '#000000', style: 'solid' },
      },
    });

    fireEvent.change(borderStyleWidthInput!, { target: { value: '5' } });

    expect(updateMock.mock.calls).toHaveLength(4);
    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        radius: {
          bottomLeft: '6px',
          bottomRight: '6px',
          topLeft: '6px',
          topRight: '6px',
        },
        styles: {
          bottom: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          left: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          right: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          top: {
            color: '#000000',
            style: 'solid',
            width: '5px',
          },
        },
      },
    ]);

    expect(valueMock).toEqual({
      radius: {
        topLeft: '6px',
        topRight: '6px',
        bottomLeft: '6px',
        bottomRight: '6px',
      },
      styles: {
        top: { width: '5px', color: '#000000', style: 'solid' },
        right: { width: '0px', color: '#000000', style: 'solid' },
        bottom: { width: '0px', color: '#000000', style: 'solid' },
        left: { width: '0px', color: '#000000', style: 'solid' },
      },
    });

    fireEvent.click(borderStyleColorInputTrigger!);

    expect(updateMock.mock.calls).toHaveLength(4);
    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        radius: {
          bottomLeft: '6px',
          bottomRight: '6px',
          topLeft: '6px',
          topRight: '6px',
        },
        styles: {
          bottom: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          left: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          right: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          top: {
            color: '#000000',
            style: 'solid',
            width: '5px',
          },
        },
      },
    ]);

    expect(valueMock).toEqual({
      radius: {
        topLeft: '6px',
        topRight: '6px',
        bottomLeft: '6px',
        bottomRight: '6px',
      },
      styles: {
        top: { width: '5px', color: '#000000', style: 'solid' },
        right: { width: '0px', color: '#000000', style: 'solid' },
        bottom: { width: '0px', color: '#000000', style: 'solid' },
        left: { width: '0px', color: '#000000', style: 'solid' },
      },
    });

    const colorPickerPopover = root!.querySelector(`div[class^="ant-popover ant-zoom-big-appear"]`);
    const colorPickerInputWrapper = colorPickerPopover!.querySelector(
      `div[class="ant-color-picker-input"]`,
    );
    const colorPickerInput = colorPickerInputWrapper!.querySelector(`input[class^="ant-input"]`);

    expect(colorPickerPopover).toBeInTheDocument();
    expect(colorPickerInputWrapper).toBeInTheDocument();
    expect(colorPickerInput).toBeInTheDocument();

    fireEvent.change(colorPickerInput!, { target: { value: '#FFFFFF' } });

    expect(updateMock.mock.calls).toHaveLength(7);
    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        radius: {
          bottomLeft: '6px',
          bottomRight: '6px',
          topLeft: '6px',
          topRight: '6px',
        },
        styles: {
          bottom: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          left: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          right: {
            color: '#000000',
            style: 'solid',
            width: '0px',
          },
          top: {
            color: '#ffffff',
            style: 'solid',
            width: '5px',
          },
        },
      },
    ]);

    expect(valueMock).toEqual({
      radius: {
        topLeft: '6px',
        topRight: '6px',
        bottomLeft: '6px',
        bottomRight: '6px',
      },
      styles: {
        top: { width: '5px', color: '#ffffff', style: 'solid' },
        right: { width: '0px', color: '#000000', style: 'solid' },
        bottom: { width: '0px', color: '#000000', style: 'solid' },
        left: { width: '0px', color: '#000000', style: 'solid' },
      },
    });
  });
});
