import ThemeProvider from '@/utils/ThemeProvider';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import React from 'react';
import TextPropsThemed, { defaultValue } from '../index';

const cookies = createCookies(parseCookies(document.cookie), setCookie);

describe('TextPropsThemed', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders text-editor component', () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );
    expect(container).toMatchSnapshot();
    const root = container.querySelector('div[class^="css-"]');
    expect(root).toBeInTheDocument();

    const panelItems = container.querySelectorAll('div[class="css-1vyuchv"]');
    expect(panelItems).toHaveLength(12);
  });

  it('calls onChange with default values on initial render', () => {
    render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining(defaultValue));
  });

  it('updates text align when clicked', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const alignButtons = container.querySelectorAll('div[class="ant-segmented-group"] label');
    fireEvent.click(alignButtons[1]);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          align: 'center',
        }),
      );
    });
  });

  it('updates text input when changed', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const textInput = container.querySelector('input[type="text"]');
    fireEvent.change(textInput!, { target: { value: 'New Text' } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'New Text',
        }),
      );
    });
  });

  it('updates color when color picker is changed', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const colorPicker = container.querySelector('.ant-color-picker-trigger');
    expect(colorPicker).toBeInTheDocument();

    fireEvent.click(colorPicker!);

    const colorPickerPopover = container.querySelector(
      `div[class^="ant-popover ant-zoom-big-appear"]`,
    );
    const colorPickerInputWrapper = colorPickerPopover!.querySelector(
      `div[class="ant-color-picker-input"]`,
    );
    const colorPickerInput = colorPickerInputWrapper!.querySelector(`input[class^="ant-input"]`);
    expect(colorPickerInput).toBeInTheDocument();

    fireEvent.change(colorPickerInput!, { target: { value: '#FF0000' } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          color: '#ff0000',
        }),
      );
    });
  });

  it('updates font family when changed', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const fontFamilySelect = container.querySelector('.ant-select-selector');
    fireEvent.mouseDown(fontFamilySelect!);

    const option = document.querySelector('.ant-select-item-option[title="Open Sans"]');
    fireEvent.click(option!);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          fontFamily: 'openSans',
        }),
      );
    });
  });

  it('updates font weight when changed', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const fontWeightSelect = container.querySelectorAll('.ant-select-selector')[1];
    fireEvent.mouseDown(fontWeightSelect!);

    const option = document.querySelector('.ant-select-item-option[title="Bold 700"]');
    fireEvent.click(option!);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          fontWeight: '700',
        }),
      );
    });
  });

  it('updates size when changed', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const sizeInput = container.querySelector('input[placeholder="0"]');
    fireEvent.change(sizeInput!, { target: { value: '20' } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          size: '20px',
        }),
      );
    });
  });

  it('updates text transform when clicked', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const transformSelect = container.querySelector('[data-testid="segmentedTransform"]');
    expect(transformSelect).toBeInTheDocument();

    const transformButtons = transformSelect!.querySelectorAll('label.ant-segmented-item');
    expect(transformButtons.length).toBe(4);

    fireEvent.click(transformButtons[2]);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          textTransform: 'uppercase',
        }),
      );
    });
  });

  it('updates text style when clicked', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const segmentedStyle = container.querySelector('[data-testid="segmentedStyle"]');
    expect(segmentedStyle).toBeInTheDocument();

    const styleButtons = segmentedStyle!.querySelectorAll('label.ant-segmented-item');
    expect(styleButtons.length).toBe(2);

    fireEvent.click(styleButtons[1]);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          textStyle: 'italic',
        }),
      );
    });
  });
  //NEW TESTS
  it('updates opacity when changed', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const lineHeightComponent = container.querySelector('div[data-testid="input-opacity"]');
    expect(lineHeightComponent).toBeInTheDocument();
    const opacityInput = lineHeightComponent!.querySelector('input[class^="ant-input"]');
    expect(opacityInput).toBeInTheDocument();

    fireEvent.change(opacityInput!, { target: { value: '50' } });

    //TODO: Fix input-with-units
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        opacity: '50px',
      }),
    );
  });

  it('updates line height when changed', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const lineHeightComponent = container.querySelector('div[data-testid="input-line-height"]');
    expect(lineHeightComponent).toBeInTheDocument();
    const lineHeightInput = lineHeightComponent!.querySelector('input[class^="ant-input"]');
    expect(lineHeightInput).toBeInTheDocument();

    fireEvent.change(lineHeightInput!, { target: { value: '200' } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          lineHeight: '200px',
        }),
      );
    });
  });

  it('updates letter spacing when changed', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const letterSpacing = container.querySelector('div[data-testid="input-letter-spacing"]');
    const letterSpacingInput = letterSpacing!.querySelector('input[class^="ant-input"]');
    fireEvent.change(letterSpacingInput!, { target: { value: '2' } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          letterSpacing: '2px',
        }),
      );
    });
  });

  it('updates text decoration when clicked', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const segmentedDecoration = container.querySelector('[data-testid="segmentedDecoration"]');
    expect(segmentedDecoration).toBeInTheDocument();

    const decorationButtons = segmentedDecoration!.querySelectorAll('label.ant-segmented-item');
    expect(decorationButtons.length).toBe(4);

    fireEvent.click(decorationButtons[2]); // Предполагаем, что это кнопка 'underline'

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          textDecoration: 'underline',
        }),
      );
    });
  });

  it('updates text type when dropdown option is selected', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const typeDropdownComponent = container.querySelector('div[data-testid="input-text-type"]');
    const typeDropdownTrigger = typeDropdownComponent!.querySelector('button[type="button"]');
    expect(typeDropdownTrigger).toBeInTheDocument();

    fireEvent.click(typeDropdownTrigger!);

    const dropdownOption = typeDropdownComponent!.querySelector('div[class^="ant-dropdown"]');
    const quotingItem = dropdownOption!.querySelectorAll('li[class^="ant-dropdown-menu-item"]');
    fireEvent.click(quotingItem[1]!);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          textType: 'quote',
        }),
      );
    });
  });

  it('updates list style when dropdown option is selected', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <TextPropsThemed onChange={mockOnChange} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    expect(container).toMatchSnapshot();
    const typeDropdownComponent = container.querySelector('div[data-testid="input-text-list"]');
    const typeDropdownTrigger = typeDropdownComponent!.querySelector('button[type="button"]');
    expect(typeDropdownTrigger).toBeInTheDocument();

    fireEvent.click(typeDropdownTrigger!);

    const dropdownOption = typeDropdownComponent!.querySelector('div[class^="ant-dropdown"]');
    const quotingItem = dropdownOption!.querySelectorAll('li[class^="ant-dropdown-menu-item"]');
    fireEvent.click(quotingItem[1]!);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          textList: 'addListSquareOutlined',
        }),
      );
    });
  });
});
