import ThemeProvider from '@/utils/ThemeProvider';
import { fireEvent, render } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import React from 'react';
import SpacingThemed, { defaultValue } from '../index';

const cookies = createCookies(parseCookies(document.cookie), setCookie);

describe('SpacingThemed', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  const renderComponent = (props = {}) => {
    return render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <SpacingThemed onChange={mockOnChange} {...props} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );
  };

  it('renders spacing-editor component with default values', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();

    const root = container.querySelector('.css-1ptitav')!;
    expect(root).toBeInTheDocument();

    const marginLabel = container.querySelector('.css-169il8u')!;
    expect(marginLabel).toHaveTextContent('Margin');

    const paddingLabel = container.querySelectorAll('.css-169il8u')[1]!;
    expect(paddingLabel).toHaveTextContent('Padding');

    const allInputs = container.querySelectorAll('input');
    expect(allInputs).toHaveLength(8); // 4 for margin, 4 for padding

    allInputs.forEach(input => {
      expect(input).toHaveValue('0');
    });

    const tieButtons = container.querySelectorAll('.css-2nmk3i');
    expect(tieButtons).toHaveLength(4); // 4 for padding, none for margin
  });

  it('updates margin values correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();

    const marginInputs = container.querySelectorAll(
      '.css-1ptitav > .css-cou6ip input, .css-1ptitav > .css-hdtzot input',
    );
    fireEvent.change(marginInputs[0], { target: { value: '10' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultValue,
      margin: { ...defaultValue.margin, top: '10px' },
    });
  });

  it('updates padding values correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();

    const paddingInputs = container.querySelectorAll('.css-1ptitav .css-1ptitav input');
    fireEvent.change(paddingInputs[0], { target: { value: '20' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultValue,
      padding: { ...defaultValue.padding, top: '20px' },
    });
  });

  it('synchronizes padding values when tie button is clicked', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();

    const tieButtons = container.querySelectorAll('.css-2nmk3i');
    fireEvent.click(tieButtons[0]); // Click vertical tie button

    const paddingInputs = container.querySelectorAll('.css-1ptitav .css-1ptitav input');
    fireEvent.change(paddingInputs[0], { target: { value: '30' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultValue,
      padding: { ...defaultValue.padding, top: '30px', bottom: '30px' },
    });
  });

  it('renders with custom values', () => {
    const customValue = {
      margin: { top: '10px', right: '20px', bottom: '30px', left: '40px' },
      padding: { top: '5px', right: '15px', bottom: '25px', left: '35px' },
    };
    const { container } = renderComponent({ value: customValue });

    expect(container).toMatchSnapshot();

    const allInputs = container.querySelectorAll('input');
    const inputValues = Array.from(allInputs).map(input => input.value);

    expect(inputValues).toEqual(['10', '40', '5', '35', '15', '25', '20', '30']);
  });
});
