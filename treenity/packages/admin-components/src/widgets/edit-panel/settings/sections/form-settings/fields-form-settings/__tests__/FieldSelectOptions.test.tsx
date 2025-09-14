import ThemeProvider from '@/utils/ThemeProvider';
import type { IFieldFormSettingsValue } from '@/widgets/edit-panel/settings/sections/form-settings/types';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import React from 'react';
import FieldsFormComponent from '../FieldsFormComponent';

const cookies = createCookies(parseCookies(document.cookie), setCookie);

describe('FieldsFormComponent', () => {
  const mockOnChange = jest.fn();
  const mockOnCancel = jest.fn();

  let mockValue: IFieldFormSettingsValue = {
    key: 'input-0',
    component: 'input',
    params: {
      name: 'input',
      label: 'Input',
    },
  };

  const renderComponent = (props = {}) => {
    return render(
      <CookieContext.Provider value={cookies}>
        <ThemeProvider>
          <FieldsFormComponent
            value={mockValue}
            onChange={mockOnChange}
            onCancel={mockOnCancel}
            {...props}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with initial values', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();

    const form = container.querySelector('form.css-gp2ups');
    expect(form).toBeInTheDocument();

    const fieldSelect = container.querySelector('.ant-select-selector');
    expect(fieldSelect).toBeInTheDocument();
    expect(fieldSelect).toHaveTextContent('input');

    const idInput = container.querySelector('input#params_id');
    expect(idInput).toBeInTheDocument();

    const labelInput = container.querySelector('input#params_label');
    expect(labelInput).toBeInTheDocument();
    expect(labelInput).toHaveValue('Input');

    const nameInput = container.querySelector('input#params_name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('input');

    const placeholderInput = container.querySelector('input#params_placeholder');
    expect(placeholderInput).toBeInTheDocument();

    const moreOptionsButton = container.querySelector('button.css-1ux4dfx');
    expect(moreOptionsButton).toBeInTheDocument();
    expect(moreOptionsButton).toHaveTextContent('More options');

    const cancelButton = container.querySelector('button.css-towndk');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('Cancel');

    const saveButton = container.querySelector('button.css-1vdjel7');
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveTextContent('Save');
  });

  it('toggles more options when clicking the More options button', async () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
    const moreOptionsButton = container.querySelector('button.css-1ux4dfx')!;
    fireEvent.click(moreOptionsButton);

    await waitFor(() => {
      const iconInput = container.querySelector('[id="params_icon"]');
      expect(iconInput).toBeInTheDocument();

      const valueInput = container.querySelector('input[placeholder="value"]');
      expect(valueInput).toBeInTheDocument();

      const requiredSwitch = container.querySelector('.ant-switch');
      expect(requiredSwitch).toBeInTheDocument();

      const maxLengthInput = container.querySelector('input[placeholder="100"]');
      expect(maxLengthInput).toBeInTheDocument();

      const minLengthInput = container.querySelector('input[placeholder="1"]');
      expect(minLengthInput).toBeInTheDocument();
    });
  });

  it('changes form items when selecting a different component type', async () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
    const fieldSelect = container.querySelector('.ant-select-selector')!;
    fireEvent.mouseDown(fieldSelect);

    await waitFor(() => {
      const selectOption = document.querySelector('.ant-select-item-option[title="select"]')!;
      fireEvent.click(selectOption);
    });

    await waitFor(() => {
      const optionsFormItem = container.querySelector('.css-mfr7vp');
      expect(optionsFormItem).toBeInTheDocument();
    });
  });

  it('calls onCancel when clicking the Cancel button', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
    const cancelButton = container.querySelector('button.css-towndk')!;
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onChange with form values when clicking the Save button', async () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
    const nameInput = container.querySelector('input#params_name')!;
    fireEvent.change(nameInput, { target: { value: 'newName' } });

    const saveButton = container.querySelector('button.css-1vdjel7')!;
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          component: 'input',
          params: expect.objectContaining({
            name: 'newName',
            label: 'Input',
          }),
        }),
      );
    });
  });

  it('updates form when changing component type to textarea', async () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
    const fieldSelect = container.querySelector('.ant-select-selector')!;
    fireEvent.mouseDown(fieldSelect);

    await waitFor(() => {
      const selectOption = document.querySelector('.ant-select-item-option[title="textarea"]')!;
      fireEvent.click(selectOption);
    });

    const moreOptionsButton = container.querySelector('button.css-1ux4dfx')!;
    expect(moreOptionsButton).toBeInTheDocument();
    fireEvent.click(moreOptionsButton);

    await waitFor(() => {
      const minRowsInput = container.querySelector('input[id="params_minRows"]');
      expect(minRowsInput).toBeInTheDocument();
      const maxRowsInput = container.querySelector('input[id="params_maxRows"]');
      expect(maxRowsInput).toBeInTheDocument();
    });
  });

  it('updates form when changing component type to checkbox', async () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
    const fieldSelect = container.querySelector('.ant-select-selector')!;
    fireEvent.mouseDown(fieldSelect);

    await waitFor(() => {
      const checkboxOption = document.querySelector('.ant-select-item-option[title="checkbox"]')!;
      fireEvent.click(checkboxOption);
    });

    const moreOptionsButton = container.querySelector('button.css-1ux4dfx')!;
    expect(moreOptionsButton).toBeInTheDocument();
    fireEvent.click(moreOptionsButton);

    await waitFor(() => {
      const checkedSwitch = container.querySelector('button#params_checked');
      expect(checkedSwitch).toBeInTheDocument();
      const requiredSwitch = container.querySelector('button#params_required');
      expect(requiredSwitch).toBeInTheDocument();
    });
  });

  it('validates required fields before saving', async () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
    const nameInput = container.querySelector('input#params_name')!;
    fireEvent.change(nameInput, { target: { value: '' } });

    await waitFor(() => userEvent.tab());

    await waitFor(() => {
      const errorMessage = container.querySelector('.ant-form-item-explain-error');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Required field'); // Предполагаемый текст ошибки, может отличаться в вашем случае
    });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('resets form when cancelling', async () => {
    const { container, rerender } = renderComponent();

    expect(container).toMatchSnapshot();
    const nameInput = container.querySelector('input#params_name')!;
    fireEvent.change(nameInput, { target: { value: 'newName' } });
    const cancelButton = container.querySelector('button.css-towndk')!;
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);

    rerender(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <FieldsFormComponent value={mockValue} onChange={mockOnChange} onCancel={mockOnCancel} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const nameInput2 = container.querySelector('input#params_name')!;

    await waitFor(() => {
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(nameInput2).toHaveValue('input');
    });
  });

  it('updates options for select component', async () => {
    mockValue = {
      key: 'select-0',
      component: 'select',
      params: {
        name: 'select',
        label: 'Select',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
      },
    };

    const { container, rerender } = renderComponent();

    expect(container).toMatchSnapshot();
    // Проверяем, что компонент FieldSelectOptions отображается
    const optionsContainer = container.querySelector('.css-mfr7vp');
    expect(optionsContainer).toBeInTheDocument();

    // Проверяем начальное состояние опций
    const initialOptions = container.querySelectorAll('.css-1lhd7sn');
    expect(initialOptions).toHaveLength(2);

    // Добавляем новую опцию
    const addButton = Array.from(container.querySelectorAll('button')).find(
      button => button.textContent === 'Add select option',
    );
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton!);

    await waitFor(() => {
      const updatedOptions = container.querySelectorAll('.css-1lhd7sn');
      expect(updatedOptions).toHaveLength(3);
    });

    // Редактируем созданную опцию
    const editButtons = container.querySelectorAll('.css-1lhd7sn button:nth-child(3)');

    [...editButtons].forEach(button => {
      fireEvent.click(button);
    });

    const labelInputs = container.querySelectorAll('.css-1lhd7sn input:nth-child(1)');
    const valueInputs = container.querySelectorAll('.css-1lhd7sn input:nth-child(2)');

    [...labelInputs].forEach((input, index) => {
      fireEvent.change(input, { target: { value: `New-Option-${index}` } });
    });

    [...valueInputs].forEach((input, index) => {
      fireEvent.change(input, { target: { value: `New-Option-${index}` } });
    });

    const saveButtons = container.querySelectorAll('.css-1lhd7sn button:nth-child(3)');

    [...saveButtons].forEach(button => {
      fireEvent.click(button);
    });

    // Удаляем вторую опцию
    const deleteButtons = container.querySelectorAll('.css-1lhd7sn button:nth-child(4)');
    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      const finalOptions = container.querySelectorAll('.css-1lhd7sn');
      expect(finalOptions).toHaveLength(2);
    });

    const saveButton = container.querySelector('button.css-1vdjel7')!;
    expect(saveButton).toBeInTheDocument();
    await act(() => fireEvent.click(saveButton));

    // Проверяем, что onChange был вызван с правильными данными
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        component: 'select',
        params: expect.objectContaining({
          name: 'select',
          label: 'Select',
          options: [
            { label: 'New-Option-0', value: 'New-Option-0' },
            { label: 'New-Option-2', value: 'New-Option-2' },
          ],
        }),
      }),
    );
  });
});
