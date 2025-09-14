/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Icon from '@/components/icon';
import ThemeProvider from '@/utils/ThemeProvider';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import { Button, Form } from 'antd';
import React from 'react';
import InputWithUnits from '../index';

const cookies = createCookies(parseCookies(document.cookie), setCookie);

describe('input-with-units component (Independent)', () => {
  const renderComponent = (props = {}) =>
    render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <InputWithUnits {...props} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

  it('renders input-with-units component', () => {
    const { container } = renderComponent({ value: '10px' });
    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('displays the initial value and unit', () => {
    const { getByDisplayValue, getByText } = renderComponent({ value: '10px' });
    expect(getByDisplayValue('10')).toBeInTheDocument();
    expect(getByText('px')).toBeInTheDocument();
  });

  it('changes unit when a new unit is selected', async () => {
    const handleChange = jest.fn();
    const { container, getByRole } = renderComponent({
      value: '10px',
      onChange: handleChange,
    });

    const unitSpan = container.querySelector('.ant-dropdown-trigger') as HTMLElement;
    fireEvent.click(unitSpan);

    const menu = await waitFor(() => getByRole('menu'));
    const unitItem = within(menu).getByText('%').closest('li');
    fireEvent.click(unitItem!);

    expect(unitSpan).toHaveTextContent('%');
    expect(handleChange).toHaveBeenCalledWith('10%');
  });

  it('changes value when input value is changed', () => {
    const handleChange = jest.fn();
    const { getByDisplayValue } = renderComponent({ value: '20px', onChange: handleChange });
    const input = getByDisplayValue('20') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '30' } });

    expect(input.value).toBe('30');
    expect(handleChange).toHaveBeenCalledWith('30px');
  });

  it('handles invalid input correctly', () => {
    const handleChange = jest.fn();
    const { getByDisplayValue } = renderComponent({ value: '20px', onChange: handleChange });
    const input = getByDisplayValue('20') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'abc' } });

    expect(input.value).toBe('');
    expect(handleChange).toHaveBeenCalledWith(undefined);
  });

  it('displays the slider when withRange prop is provided', () => {
    const { container } = renderComponent({ withRange: [0, 100], value: '50px' });
    expect(container.querySelector('.ant-slider')).toBeInTheDocument();
  });

  it('changes value when slider is used', () => {
    const handleChange = jest.fn();
    const { container } = renderComponent({
      withRange: [0, 100],
      value: '50px',
      onChange: handleChange,
    });

    const slider = container.querySelector('.ant-slider') as HTMLElement;
    fireEvent.mouseDown(slider, { clientX: 50 });
    fireEvent.mouseMove(slider, { clientX: 100 });
    fireEvent.mouseUp(slider);

    expect(handleChange).toHaveBeenCalledWith('100px');
  });

  it('shows icon when icon prop is provided', () => {
    const { container } = renderComponent({
      icon: <Icon name="add-folder_filled" />,
      value: '10px',
    });

    const icon = container.querySelector('.icon-add-folder_filled');
    expect(icon).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

describe('input-with-units component (inside Form)', () => {
  const renderInsideForm = (props = {}, initialValues = {}, onSubmit = jest.fn()) =>
    render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <Form initialValues={initialValues} onFinish={onSubmit}>
            <Form.Item name="testInput">
              <InputWithUnits {...props} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </ThemeProvider>
      </CookieContext.Provider>,
    );

  it('submits form with valid input', async () => {
    const handleSubmit = jest.fn();
    const { getByText, getByDisplayValue } = renderInsideForm(
      {},
      { testInput: '10px' },
      handleSubmit,
    );

    const input = getByDisplayValue('10') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '35' } });
    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ testInput: '35px' });
    });
  });

  it('changes unit and value correctly within form', async () => {
    const { container, getByDisplayValue, getByRole } = renderInsideForm({}, { testInput: '10px' });

    const unitTrigger = container.querySelector('.ant-dropdown-trigger') as HTMLElement;
    expect(unitTrigger).toHaveTextContent('px');
    fireEvent.click(unitTrigger);

    const menu = await waitFor(() => getByRole('menu'));
    const unitItem = within(menu).getByText('%');
    fireEvent.click(unitItem);

    await waitFor(() => {
      expect(unitTrigger).toHaveTextContent('%');
    });

    const input = getByDisplayValue('10') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '30' } });

    expect(input.value).toBe('30');
  });

  it('sets form value to undefined if input is empty', async () => {
    const handleSubmit = jest.fn();
    const { getByText, getByDisplayValue } = renderInsideForm(
      {},
      { testInput: '10px' },
      handleSubmit,
    );

    const input = getByDisplayValue('10') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ testInput: undefined });
    });
  });
});
