import ThemeProvider from '@/utils/ThemeProvider';
import { fireEvent, render } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import React from 'react';
import PositionThemed, { defaultValue, POSITION_OPTIONS } from '../index';

const cookies = createCookies(parseCookies(document.cookie), setCookie);

describe('PositionThemed', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  const renderComponent = (props = {}) => {
    return render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <PositionThemed onChange={mockOnChange} {...props} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );
  };

  it('renders position-editor component with default values', () => {
    const { container } = renderComponent();

    const root = container.querySelector('.css-1jibmi3')!;
    expect(root).toBeInTheDocument();

    const sections = container.querySelectorAll('.css-1vyuchv')!;
    expect(sections.length).toBe(1); // Only Position section should be visible initially

    const positionLabel = sections[0].querySelector('.ant-typography')!;
    expect(positionLabel).toHaveTextContent('Position');

    const segmentedItems = container.querySelectorAll('.ant-segmented-item')!;
    expect(segmentedItems).toHaveLength(POSITION_OPTIONS.length);

    POSITION_OPTIONS.forEach((option, index) => {
      //@ts-ignore
      expect(segmentedItems[index]).toHaveTextContent(option.label);
    });

    expect(root).toMatchSnapshot();
  });

  it('changes position and shows additional settings', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();

    const absoluteButton = Array.from(
      container.querySelectorAll('.ant-segmented-item-label')!,
    ).find(el => el.textContent === 'Absolute')!;
    fireEvent.click(absoluteButton);

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ position: 'absolute' }));

    // Re-render the component with the new position to simulate the change
    const { container: newContainer } = renderComponent({ value: { position: 'absolute' } });

    const sections = newContainer.querySelectorAll('.css-1vyuchv')!;
    expect(sections.length).toBe(4); // Position, Offset, Relative, Z-index

    expect(sections[0].querySelector('.ant-typography')).toHaveTextContent('Position');
    expect(sections[1].querySelector('.ant-typography')).toHaveTextContent('Offset');
    expect(sections[2].querySelector('.ant-typography')).toHaveTextContent('Relative');
    expect(sections[3].querySelector('.ant-typography')).toHaveTextContent('Z-index');
  });

  it('updates offset values', () => {
    const { container } = renderComponent({ value: { ...defaultValue, position: 'absolute' } });

    expect(container).toMatchSnapshot();

    const offsetInputs = container.querySelectorAll('.css-1cddgo7 input')!;
    const topInput = offsetInputs[0];
    fireEvent.change(topInput, { target: { value: '10' } });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        offset: { bottom: '0px', left: '0px', right: '0px', top: '10px' },
        position: 'absolute',
        relative: '#body',
        zIndex: 'auto',
      }),
    );
  });

  it('synchronizes vertical offset values', () => {
    const { container } = renderComponent({ value: { ...defaultValue, position: 'absolute' } });

    expect(container).toMatchSnapshot();

    const syncButtons = container.querySelectorAll('.css-2nmk3i')!;
    const syncVerticalButton = syncButtons[0];
    fireEvent.click(syncVerticalButton);

    const offsetInputs = container.querySelectorAll('.css-1cddgo7 input')!;
    const topInput = offsetInputs[0];
    fireEvent.change(topInput, { target: { value: '20px' } });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        offset: { bottom: '20px', left: '0px', right: '0px', top: '20px' },
        position: 'absolute',
        relative: '#body',
        zIndex: 'auto',
      }),
    );
  });

  it('updates relative value', () => {
    const { container } = renderComponent({ value: { ...defaultValue, position: 'absolute' } });

    expect(container).toMatchSnapshot();

    const relativeInput = container.querySelector('input[placeholder="#body"]')!;
    fireEvent.change(relativeInput, { target: { value: '#container' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ relative: '#container' }));
  });

  it('updates z-index value', () => {
    const { container } = renderComponent({ value: { ...defaultValue, position: 'absolute' } });

    expect(container).toMatchSnapshot();

    const zIndexInput = container.querySelector('input[placeholder="auto"]')!;
    fireEvent.change(zIndexInput, { target: { value: 10 } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ zIndex: 10 }));
  });

  it('handles invalid z-index input', () => {
    const { container } = renderComponent({
      value: { ...defaultValue, position: 'absolute', zIndex: 123 },
    });

    expect(container).toMatchSnapshot();

    const zIndexInput = container.querySelector('input[placeholder="auto"]')!;
    expect(zIndexInput).toBeInTheDocument();
    fireEvent.change(zIndexInput, { target: { value: '' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ zIndex: 'auto' }));
  });
});
