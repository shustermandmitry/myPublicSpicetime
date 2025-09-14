import ThemeProvider from '@/utils/ThemeProvider';
import { jest } from '@jest/globals';
import { merge } from '@s-libs/micro-dash';
import { fireEvent, render, screen } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import BorderStyle, { BorderStylesProps } from '../BorderStyle';

const defaultValue: BorderStylesProps = {
  width: '0px',
  color: '#000000',
  style: 'none',
};

const cookies = createCookies(parseCookies(document.cookie), setCookie);
let valueMock: BorderStylesProps = defaultValue;

const updateMock = jest.fn((value: BorderStylesProps) => {
  valueMock = merge({}, valueMock, value);
  return value;
});

const icons = [
  'icon-x-axis_outlined',
  'icon-border-solid_outlined',
  'icon-border-dash_outlined',
  'icon-border-dotted_outlined',
];

describe('BorderStyles', () => {
  beforeEach(() => {
    updateMock.mockClear();
    valueMock = defaultValue;
  });

  it('render', async () => {
    const { container, rerender } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderStyle onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-1jibmi3"]`);
    const items = root!.querySelectorAll(`div[class="css-1vyuchv"]`);

    const firstItem = items[0];
    const secondItem = items[1];
    const thirdItem = items[2];

    const firstItemLabel = items[0].querySelector('p[class^="ant-typography text-content"]');
    const secondItemLabel = items[1].querySelector('p[class^="ant-typography text-content"]');
    const thirdItemLabel = items[2].querySelector('p[class^="ant-typography text-content"]');

    const firstItemInput = items[0].querySelector('input[class^="ant-input"]');
    const secondItemInput = items[1].querySelector('div[class^="ant-color-picker-trigger"]');
    const thirdItemInput = items[2].querySelector('div[class="ant-segmented-group"]');
    const thirdInputItems = thirdItemInput!.querySelectorAll('label[class^="ant-segmented-item"]');

    expect(root).toMatchSnapshot();
    // @ts-ignore
    expect(root).toBeInTheDocument();
    expect(items).toHaveLength(3);
    // @ts-ignore
    expect(firstItem).toBeInTheDocument();
    // @ts-ignore
    expect(secondItem).toBeInTheDocument();
    // @ts-ignore
    expect(thirdItem).toBeInTheDocument();
    // @ts-ignore
    expect(firstItemLabel).toBeInTheDocument();
    // @ts-ignore
    expect(secondItemLabel).toBeInTheDocument();
    // @ts-ignore
    expect(thirdItemLabel).toBeInTheDocument();
    // @ts-ignore
    expect(firstItemInput).toBeInTheDocument();
    // @ts-ignore
    expect(secondItemInput).toBeInTheDocument();
    // @ts-ignore
    expect(thirdItemInput).toBeInTheDocument();
    // @ts-ignore
    expect(firstItemLabel).toHaveTextContent('Width');
    // @ts-ignore
    expect(secondItemLabel).toHaveTextContent('Color');
    // @ts-ignore
    expect(thirdItemLabel).toHaveTextContent('Style');
    // @ts-ignore
    expect(firstItemInput).toHaveValue('0');
    // @ts-ignore
    expect(secondItemInput).toHaveTextContent('#000000');
    screen.debug(undefined, 3000000);
    expect(thirdInputItems).toHaveLength(4);

    [...thirdInputItems].forEach((thirdInputItem, index) => {
      const input = thirdInputItem.querySelector('input[class="ant-segmented-item-input"]');
      const icon = thirdInputItem.querySelector('i');
      // @ts-ignore
      expect(thirdInputItem).toBeInTheDocument();
      // @ts-ignore
      expect(icon).toBeInTheDocument();
      // @ts-ignore
      expect(icon).toHaveClass(icons[index]);
      // @ts-ignore
      expect(input).toBeInTheDocument();

      if (index === 0) {
        expect(input).toBeChecked();
      }
    });

    expect(updateMock.mock.calls).toHaveLength(0);
  });

  it('change width', async () => {
    const { container, rerender } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderStyle onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-1jibmi3"]`);
    const items = root!.querySelectorAll(`div[class="css-1vyuchv"]`);

    const firstItem = items[0];
    const secondItem = items[1];
    const thirdItem = items[2];

    const firstItemLabel = items[0].querySelector('p[class^="ant-typography text-content"]');
    const secondItemLabel = items[1].querySelector('p[class^="ant-typography text-content"]');
    const thirdItemLabel = items[2].querySelector('p[class^="ant-typography text-content"]');

    const firstItemInput = items[0].querySelector('input[class^="ant-input"]');
    const secondItemInput = items[1].querySelector('div[class^="ant-color-picker-trigger"]');
    const thirdItemInput = items[2].querySelector('div[class="ant-segmented-group"]');
    const thirdInputItems = thirdItemInput!.querySelectorAll('label[class^="ant-segmented-item"]');

    expect(root).toMatchSnapshot();
    // @ts-ignore
    expect(root).toBeInTheDocument();
    expect(items).toHaveLength(3);
    // @ts-ignore
    expect(firstItem).toBeInTheDocument();
    // @ts-ignore
    expect(secondItem).toBeInTheDocument();
    // @ts-ignore
    expect(thirdItem).toBeInTheDocument();
    // @ts-ignore
    expect(firstItemLabel).toBeInTheDocument();
    // @ts-ignore
    expect(secondItemLabel).toBeInTheDocument();
    // @ts-ignore
    expect(thirdItemLabel).toBeInTheDocument();
    // @ts-ignore
    expect(firstItemInput).toBeInTheDocument();
    // @ts-ignore
    expect(secondItemInput).toBeInTheDocument();
    // @ts-ignore
    expect(thirdItemInput).toBeInTheDocument();
    // @ts-ignore
    expect(firstItemLabel).toHaveTextContent('Width');
    // @ts-ignore
    expect(secondItemLabel).toHaveTextContent('Color');
    // @ts-ignore
    expect(thirdItemLabel).toHaveTextContent('Style');
    // @ts-ignore
    expect(firstItemInput).toHaveValue('0');
    // @ts-ignore
    expect(secondItemInput).toHaveTextContent('#000000');
    expect(thirdInputItems).toHaveLength(4);

    [...thirdInputItems].forEach((thirdInputItem, index) => {
      const input = thirdInputItem.querySelector('input[class="ant-segmented-item-input"]');
      const icon = thirdInputItem.querySelector('i');
      // @ts-ignore
      expect(thirdInputItem).toBeInTheDocument();
      // @ts-ignore
      expect(icon).toBeInTheDocument();
      // @ts-ignore
      expect(icon).toHaveClass(icons[index]);
      // @ts-ignore
      expect(input).toBeInTheDocument();

      if (index === 0) {
        // @ts-ignore
        expect(input).toBeChecked();
      }
    });

    expect(updateMock.mock.calls).toHaveLength(0);

    fireEvent.change(firstItemInput!, { target: { value: '3' } });

    expect(updateMock.mock.calls).toHaveLength(1);

    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        color: '#000000',
        style: 'none',
        width: '3px',
      },
    ]);
  });

  it('change color', async () => {
    const { container, rerender } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderStyle onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-1jibmi3"]`);
    const items = root!.querySelectorAll(`div[class="css-1vyuchv"]`);

    const firstItem = items[0];
    const secondItem = items[1];
    const thirdItem = items[2];

    const firstItemLabel = items[0].querySelector('p[class^="ant-typography text-content"]');
    const secondItemLabel = items[1].querySelector('p[class^="ant-typography text-content"]');
    const thirdItemLabel = items[2].querySelector('p[class^="ant-typography text-content"]');

    const firstItemInput = items[0].querySelector('input[class^="ant-input"]');
    const secondItemInput = items[1].querySelector('div[class^="ant-color-picker-trigger"]');
    const thirdItemInput = items[2].querySelector('div[class="ant-segmented-group"]');
    const thirdInputItems = thirdItemInput!.querySelectorAll('label[class^="ant-segmented-item"]');

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(items).toHaveLength(3);
    expect(firstItem).toBeInTheDocument();
    expect(secondItem).toBeInTheDocument();
    expect(thirdItem).toBeInTheDocument();
    expect(firstItemLabel).toBeInTheDocument();
    expect(secondItemLabel).toBeInTheDocument();
    expect(thirdItemLabel).toBeInTheDocument();
    expect(firstItemInput).toBeInTheDocument();
    expect(secondItemInput).toBeInTheDocument();
    expect(thirdItemInput).toBeInTheDocument();
    expect(firstItemLabel).toHaveTextContent('Width');
    expect(secondItemLabel).toHaveTextContent('Color');
    expect(thirdItemLabel).toHaveTextContent('Style');
    expect(firstItemInput).toHaveValue('0');
    expect(secondItemInput).toHaveTextContent('#000000');
    expect(thirdInputItems).toHaveLength(4);

    [...thirdInputItems].forEach((thirdInputItem, index) => {
      const input = thirdInputItem.querySelector('input[class="ant-segmented-item-input"]');
      const icon = thirdInputItem.querySelector('i');
      expect(thirdInputItem).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(icons[index]);
      expect(input).toBeInTheDocument();

      if (index === 0) {
        expect(input).toBeChecked();
      }
    });

    expect(updateMock.mock.calls).toHaveLength(0);

    fireEvent.click(secondItemInput!);

    const colorPickerPopover = root!.querySelector(`div[class^="ant-popover ant-zoom-big-appear"]`);
    const colorPickerInputWrapper = colorPickerPopover!.querySelector(
      `div[class="ant-color-picker-input"]`,
    );
    const colorPickerInput = colorPickerInputWrapper!.querySelector(`input[class^="ant-input"]`);

    expect(colorPickerPopover).toBeInTheDocument();
    expect(colorPickerInputWrapper).toBeInTheDocument();
    expect(colorPickerInput).toBeInTheDocument();

    fireEvent.change(colorPickerInput!, { target: { value: '#FFFFFF' } });

    expect(updateMock.mock.calls).toHaveLength(1);

    expect(updateMock.mock.calls.at(-1)).toEqual([
      {
        color: '#ffffff',
        style: 'none',
        width: '0px',
      },
    ]);
  });

  it('change type', async () => {
    const { container, rerender } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderStyle onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-1jibmi3"]`);
    const items = root!.querySelectorAll(`div[class="css-1vyuchv"]`);

    const firstItem = items[0];
    const secondItem = items[1];
    const thirdItem = items[2];

    const firstItemLabel = items[0].querySelector('p[class^="ant-typography text-content"]');
    const secondItemLabel = items[1].querySelector('p[class^="ant-typography text-content"]');
    const thirdItemLabel = items[2].querySelector('p[class^="ant-typography text-content"]');

    const firstItemInput = items[0].querySelector('input[class^="ant-input"]');
    const secondItemInput = items[1].querySelector('div[class^="ant-color-picker-trigger"]');
    const thirdItemInput = items[2].querySelector('div[class="ant-segmented-group"]');
    const thirdInputItems = thirdItemInput!.querySelectorAll('label[class^="ant-segmented-item"]');

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(items).toHaveLength(3);
    expect(firstItem).toBeInTheDocument();
    expect(secondItem).toBeInTheDocument();
    expect(thirdItem).toBeInTheDocument();
    expect(firstItemLabel).toBeInTheDocument();
    expect(secondItemLabel).toBeInTheDocument();
    expect(thirdItemLabel).toBeInTheDocument();
    expect(firstItemInput).toBeInTheDocument();
    expect(secondItemInput).toBeInTheDocument();
    expect(thirdItemInput).toBeInTheDocument();
    expect(firstItemLabel).toHaveTextContent('Width');
    expect(secondItemLabel).toHaveTextContent('Color');
    expect(thirdItemLabel).toHaveTextContent('Style');
    expect(firstItemInput).toHaveValue('0');
    expect(secondItemInput).toHaveTextContent('#000000');
    expect(thirdInputItems).toHaveLength(4);

    [...thirdInputItems].forEach((thirdInputItem, index) => {
      const input = thirdInputItem.querySelector('input[class="ant-segmented-item-input"]');
      const icon = thirdInputItem.querySelector('i');
      expect(thirdInputItem).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(icons[index]);
      expect(input).toBeInTheDocument();

      if (index === 0) {
        expect(input).toBeChecked();
      }
    });

    expect(updateMock.mock.calls).toHaveLength(0);

    fireEvent.click(thirdInputItems[1]!);

    expect(updateMock.mock.calls.at(-1)).toEqual([
      {
        color: '#000000',
        style: 'solid',
        width: '0px',
      },
    ]);
  });
});
