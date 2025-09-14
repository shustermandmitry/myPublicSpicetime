import ThemeProvider from '@/utils/ThemeProvider';
import { backgroundDefaultValue } from '@/widgets/background-editor';
import { fireEvent, render, screen } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import React from 'react';
import BgPositionThemed, { defaultBgPositionValues } from '../index';

const cookies = createCookies(parseCookies(document.cookie), setCookie);

describe('BgPositionThemed', () => {
  let imageStyle = backgroundDefaultValue;
  const mockOnChange = jest.fn(value => {
    imageStyle = value;
    return value;
  });

  beforeEach(() => {
    mockOnChange.mockClear();
    imageStyle = backgroundDefaultValue;
  });

  const renderComponent = (props = {}) => {
    return render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BgPositionThemed
            onChange={mockOnChange}
            imageStyle={imageStyle}
            value={backgroundDefaultValue.backgroundPosition}
            {...props}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );
  };

  it('renders BgPositionThemed component with default values', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();

    const root = container.querySelector('.css-f2e85r')!;
    expect(root).toBeInTheDocument();

    const positionMatrix = container.querySelector('.css-svojyp')!;
    expect(positionMatrix).toBeInTheDocument();

    const selectInputs = container.querySelectorAll('.ant-select-selector');
    expect(selectInputs).toHaveLength(2);

    const repeatOptions = container.querySelectorAll('.ant-segmented-item');
    expect(repeatOptions).toHaveLength(4);
    screen.debug(undefined, 3000000);
    const preview = container.querySelector('.css-b8uopw')!;
    expect(preview).toBeInTheDocument();
  });

  it('updates position values correctly', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
    const matrixButtons = container.querySelectorAll('.css-svojyp button');
    expect(matrixButtons).toHaveLength(9);

    fireEvent.click(matrixButtons[4]);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultBgPositionValues,
      positions: { x: 'center', y: 'center' },
    });
  });

  it('updates repeat value correctly', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();

    const repeatOptions = container.querySelectorAll('.ant-segmented-item');
    fireEvent.click(repeatOptions[1]);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultBgPositionValues,
      repeat: 'repeat',
    });
  });

  // it('handles X position select changes', async () => {
  //   const { container } = renderComponent();
  //    expect(container).toMatchSnapshot();
  //
  //   const xSelect = container.querySelectorAll('.ant-select')[0]!;
  //   expect(xSelect).toBeInTheDocument();
  //   await userEvent.click(xSelect);
  //   await screen.debug(undefined, 3000000);
  //
  //   const option = container.querySelector('.ant-select-item-option[title="Right"]')!;
  //
  //   await userEvent.click(option);
  //
  //   expect(mockOnChange).toHaveBeenCalledWith({
  //     ...defaultBgPositionValues,
  //     positions: { ...defaultBgPositionValues.positions, x: 'right' },
  //   });
  // });
  //
  // it('handles Y position select changes', () => {
  //   const { container } = renderComponent();
  //    expect(container).toMatchSnapshot();
  //
  //   const ySelect = container.querySelectorAll('div[class^="ant-select"]')[1]!;
  //   expect(mockOnChange).toBeInTheDocument();
  //   expect(ySelect);
  //   fireEvent.mouseDown(ySelect);
  //   const option = document.querySelector('.ant-select-item-option[title="Bottom"]')!;
  //   fireEvent.click(option);
  //
  //   expect(mockOnChange).toHaveBeenCalledWith({
  //     ...defaultBgPositionValues,
  //     positions: { ...defaultBgPositionValues.positions, y: 'bottom' },
  //   });
  // });

  it('renders with custom values', () => {
    const customValue = {
      positions: { x: 'right', y: 'bottom' },
      repeat: 'repeat-x',
    };
    const { container } = renderComponent({ value: customValue });
    expect(container).toMatchSnapshot();

    const xSelect = container.querySelectorAll('.ant-select')[0]!;
    expect(xSelect.textContent).toContain('Right');

    const ySelect = container.querySelectorAll('.ant-select')[1]!;
    expect(ySelect.textContent).toContain('Bottom');
    const repeatOptions = container.querySelectorAll('.ant-segmented-item');
    expect(repeatOptions[3]).toHaveClass('ant-segmented-item-selected');

    const matrixButtons = container.querySelectorAll('.css-svojyp button');
    expect(matrixButtons[8]).toHaveStyle('color: rgb(23, 135, 73)');
  });
});
