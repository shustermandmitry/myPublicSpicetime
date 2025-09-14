/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ThemeProvider from '@/utils/ThemeProvider';
import { jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import { createCookies, parseCookies, setCookie, CookieContext } from '@treenity/repository/client';
import BorderRadius, { BorderRadiusValues } from '../BorderRadius';

const cookies = createCookies(parseCookies(document.cookie), setCookie);

const defaultValue = {
  topLeft: '0px',
  topRight: '0px',
  bottomLeft: '0px',
  bottomRight: '0px',
};

let valueMock: BorderRadiusValues = defaultValue;

const updateMock = jest.fn((value: BorderRadiusValues) => {
  valueMock = value;
  return value;
});

describe('BorderRadius', () => {
  beforeEach(() => {
    updateMock.mockClear();
    valueMock = defaultValue;
  });

  it('render BorderRadius component', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderRadius onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-87h8hl"]`);
    const radioButtonContainer = root!.querySelector(`div[class^="ant-segmented css-kjymc3"]`);
    expect(radioButtonContainer).toBeInTheDocument();
    const radioButtons = radioButtonContainer!.querySelectorAll(
      `label[class^="ant-segmented-item"]`,
    );
    const allTypeButton = radioButtons[0];
    const individualTypeButton = radioButtons[1];
    const allTypeInput = root!.querySelector(`div[class="css-25sofq"]`);
    const allTypeInputComponent = allTypeInput!.querySelector(`input`);
    const individualInputs = root!.querySelectorAll(`input[class="css-7smjqm"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(allTypeInput).toBeInTheDocument();
    expect(allTypeInputComponent).toBeInTheDocument();
    expect(allTypeInputComponent).not.toBeDisabled();
    expect(allTypeButton).toBeInTheDocument();
    expect(individualTypeButton).toBeInTheDocument();
    expect(radioButtons).toHaveLength(2);
    expect(individualInputs).toHaveLength(0);
    [...radioButtons].forEach((radioButton, index) => {
      if (index === 0) {
        expect(radioButton).toHaveClass('ant-segmented-item-selected');
      } else {
        expect(radioButton).not.toHaveClass('ant-segmented-item-selected');
      }
    });
  });

  it('change type BorderRadius component', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderRadius onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-87h8hl"]`);
    const radioButtonContainer = root!.querySelector(`div[class^="ant-segmented css-kjymc3"]`);
    const radioButtons = radioButtonContainer!.querySelectorAll(
      `label[class^="ant-segmented-item"]`,
    );
    const allTypeButton = radioButtons[0];
    const individualTypeButton = radioButtons[1];
    const allTypeInput = root!.querySelector(`div[class="css-25sofq"]`);
    const allTypeInputComponent = allTypeInput!.querySelector(`input`);
    const individualInputs0 = root!.querySelectorAll(`div[class="css-7smjqm"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(radioButtonContainer).toBeInTheDocument();
    expect(allTypeInput).toBeInTheDocument();
    expect(allTypeInputComponent).toBeInTheDocument();
    expect(allTypeInputComponent).not.toBeDisabled();
    expect(allTypeButton).toBeInTheDocument();
    expect(individualTypeButton).toBeInTheDocument();
    expect(radioButtons).toHaveLength(2);
    expect(individualInputs0).toHaveLength(0);
    [...radioButtons].forEach((radioButton, index) => {
      if (index === 0) {
        expect(radioButton).toHaveClass('ant-segmented-item-selected');
      } else {
        expect(radioButton).not.toHaveClass('ant-segmented-item-selected');
      }
    });

    fireEvent.click(individualTypeButton);

    const individualInputs1 = root!.querySelectorAll(`div[class="css-7smjqm"]`);
    expect(individualInputs1).toHaveLength(4);

    [...radioButtons].forEach((radioButton, index) => {
      if (index === 1) {
        expect(radioButton).toHaveClass('ant-segmented-item-selected');
      } else {
        expect(radioButton).not.toHaveClass('ant-segmented-item-selected');
      }
    });

    [...individualInputs1].forEach((individualInput, index) => {
      const individualInputIcon = individualInput!.querySelector(`i`);
      const individualInputComponent = individualInput!.querySelector(`input[class^="ant-input"]`);
      expect(individualInputIcon).toBeInTheDocument();
      expect(individualInput).toBeInTheDocument();
      expect(individualInputComponent).toBeInTheDocument();
      expect(individualInputComponent).toHaveValue('0');
    });

    expect(allTypeInputComponent).toBeDisabled();
  });

  it('check all initialValues BorderRadius component', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderRadius
            onChange={updateMock}
            value={{
              topLeft: '2px',
              topRight: '2px',
              bottomLeft: '2px',
              bottomRight: '2px',
            }}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-87h8hl"]`);
    const radioButtonContainer = root!.querySelector(`div[class^="ant-segmented css-kjymc3"]`);
    const radioButtons = radioButtonContainer!.querySelectorAll(
      `label[class^="ant-segmented-item"]`,
    );
    const allTypeButton = radioButtons[0];
    const individualTypeButton = radioButtons[1];
    const allTypeInput = root!.querySelector(`div[class="css-25sofq"]`);
    const allTypeInputComponent = allTypeInput!.querySelector(`input`);
    const individualInputs = root!.querySelectorAll(`div[class="css-7smjqm"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(radioButtonContainer).toBeInTheDocument();
    expect(allTypeInput).toBeInTheDocument();
    expect(allTypeInputComponent).toHaveValue('2');
    expect(allTypeInputComponent).toBeInTheDocument();
    expect(allTypeInputComponent).not.toBeDisabled();
    expect(allTypeButton).toBeInTheDocument();
    expect(individualTypeButton).toBeInTheDocument();
    expect(radioButtons).toHaveLength(2);
    expect(individualInputs).toHaveLength(0);
    [...radioButtons].forEach((radioButton, index) => {
      if (index === 0) {
        expect(radioButton).toHaveClass('ant-segmented-item-selected');
      } else {
        expect(radioButton).not.toHaveClass('ant-segmented-item-selected');
      }
    });
  });

  it('check individual initialValues BorderRadius component', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderRadius
            onChange={updateMock}
            value={{
              topLeft: '1px',
              topRight: '2px',
              bottomLeft: '3px',
              bottomRight: '4px',
            }}
          />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-87h8hl"]`);
    const radioButtonContainer = root!.querySelector(`div[class^="ant-segmented css-kjymc3"]`);
    const radioButtons = radioButtonContainer!.querySelectorAll(
      `label[class^="ant-segmented-item"]`,
    );
    const allTypeButton = radioButtons[0];
    const individualTypeButton = radioButtons[1];
    const allTypeInput = root!.querySelector(`div[class="css-25sofq"]`);
    const allTypeInputComponent = allTypeInput!.querySelector(`input`);
    const individualInputs = root!.querySelectorAll(`div[class="css-7smjqm"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(radioButtonContainer).toBeInTheDocument();
    expect(allTypeInput).toBeInTheDocument();
    expect(allTypeInputComponent).toBeInTheDocument();
    expect(allTypeInputComponent).toBeDisabled();
    expect(allTypeButton).toBeInTheDocument();
    expect(individualTypeButton).toBeInTheDocument();
    expect(radioButtons).toHaveLength(2);
    expect(individualInputs).toHaveLength(4);
    [...radioButtons].forEach((radioButton, index) => {
      if (index === 1) {
        expect(radioButton).toHaveClass('ant-segmented-item-selected');
      } else {
        expect(radioButton).not.toHaveClass('ant-segmented-item-selected');
      }
    });

    [...individualInputs].forEach((individualInput, index) => {
      const individualInputIcon = individualInput!.querySelector(`i`);
      const individualInputComponent = individualInput!.querySelector(`input[class^="ant-input"]`);
      expect(individualInputIcon).toBeInTheDocument();
      expect(individualInput).toBeInTheDocument();
      expect(individualInputComponent).toBeInTheDocument();
      expect(individualInputComponent).toHaveValue(String(index + 1));
    });
  });

  it('change all type BorderRadius component', async () => {
    const { container } = render(
      <CookieContext.Provider value={ cookies }>
        <ThemeProvider>
          <BorderRadius onChange={updateMock} value={valueMock} />
        </ThemeProvider>
      </CookieContext.Provider>,
    );

    const root = container.querySelector(`div[class="css-87h8hl"]`);
    const radioButtonContainer = root!.querySelector(`div[class^="ant-segmented css-kjymc3"]`);
    const radioButtons = radioButtonContainer!.querySelectorAll(
      `label[class^="ant-segmented-item"]`,
    );
    const allTypeButton = radioButtons[0];
    const individualTypeButton = radioButtons[1];
    const allTypeInput = root!.querySelector(`div[class="css-25sofq"]`);
    const allTypeInputComponent = allTypeInput!.querySelector(`input`);
    const individualInputs = root!.querySelectorAll(`div[class="css-7smjqm"]`);

    expect(root).toMatchSnapshot();
    expect(root).toBeInTheDocument();
    expect(radioButtonContainer).toBeInTheDocument();
    expect(allTypeInput).toBeInTheDocument();
    expect(allTypeInputComponent).toHaveValue('0');
    expect(allTypeInputComponent).toBeInTheDocument();
    expect(allTypeInputComponent).not.toBeDisabled();
    expect(allTypeButton).toBeInTheDocument();
    expect(individualTypeButton).toBeInTheDocument();
    expect(radioButtons).toHaveLength(2);
    expect(individualInputs).toHaveLength(0);

    [...radioButtons].forEach((radioButton, index) => {
      if (index === 0) {
        expect(radioButton).toHaveClass('ant-segmented-item-selected');
      } else {
        expect(radioButton).not.toHaveClass('ant-segmented-item-selected');
      }
    });

    fireEvent.change(allTypeInputComponent!, { target: { value: '3' } });

    expect(allTypeInputComponent).toHaveValue('3');

    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        topLeft: '3px',
        topRight: '3px',
        bottomLeft: '3px',
        bottomRight: '3px',
      },
    ]);

    fireEvent.click(individualTypeButton);

    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        topLeft: '3px',
        topRight: '3px',
        bottomLeft: '3px',
        bottomRight: '3px',
      },
    ]);

    const individualInputs1 = root!.querySelectorAll(`div[class="css-7smjqm"]`);

    [...radioButtons].forEach((radioButton, index) => {
      if (index === 1) {
        expect(radioButton).toHaveClass('ant-segmented-item-selected');
      } else {
        expect(radioButton).not.toHaveClass('ant-segmented-item-selected');
      }
    });

    [...individualInputs1].forEach((individualInput, index) => {
      const individualInputIcon = individualInput!.querySelector(`i`);
      const individualInputComponent = individualInput!.querySelector(`input[class^="ant-input"]`);
      expect(individualInputIcon).toBeInTheDocument();
      expect(individualInput).toBeInTheDocument();
      expect(individualInputComponent).toBeInTheDocument();
      expect(individualInputComponent).toHaveValue(String(3));
    });

    expect(allTypeInputComponent).toBeDisabled();
    expect(individualInputs1).toHaveLength(4);
    const individualInputComponent2 =
      individualInputs1[0]!.querySelector(`input[class^="ant-input"]`);

    fireEvent.change(individualInputComponent2!, { target: { value: '7' } });

    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        topLeft: '7px',
        topRight: '3px',
        bottomLeft: '3px',
        bottomRight: '3px',
      },
    ]);

    fireEvent.click(allTypeButton);

    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        topLeft: '7px',
        topRight: '7px',
        bottomLeft: '7px',
        bottomRight: '7px',
      },
    ]);

    const individualInputs2 = root!.querySelectorAll(`div[class="css-7smjqm"]`);

    expect(individualInputs2).toHaveLength(0);
    expect(allTypeInputComponent).toHaveValue('7');

    fireEvent.click(individualTypeButton);

    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        topLeft: '7px',
        topRight: '7px',
        bottomLeft: '7px',
        bottomRight: '7px',
      },
    ]);

    const individualInputs3 = root!.querySelectorAll(`div[class="css-7smjqm"]`);

    expect(individualInputs3).toHaveLength(4);

    [...individualInputs3].forEach((individualInput, index) => {
      const individualInputIcon = individualInput!.querySelector(`i`);
      const individualInputComponent = individualInput!.querySelector(`input[class^="ant-input"]`);
      expect(individualInputIcon).toBeInTheDocument();
      expect(individualInput).toBeInTheDocument();
      expect(individualInputComponent).toBeInTheDocument();
      expect(individualInputComponent).toHaveValue(String(7));
    });

    const individualInputComponent3 =
      individualInputs3[1]!.querySelector(`input[class^="ant-input"]`);

    fireEvent.change(individualInputComponent3!, { target: { value: '9' } });

    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        topLeft: '7px',
        topRight: '9px',
        bottomLeft: '7px',
        bottomRight: '7px',
      },
    ]);

    [...individualInputs3].forEach((individualInput, index) => {
      const individualInputIcon = individualInput!.querySelector(`i`);
      const individualInputComponent = individualInput!.querySelector(`input[class^="ant-input"]`);
      expect(individualInputIcon).toBeInTheDocument();
      expect(individualInput).toBeInTheDocument();
      expect(individualInputComponent).toBeInTheDocument();
      if (index === 1) {
        expect(individualInputComponent).toHaveValue(String(9));
      } else {
        expect(individualInputComponent).toHaveValue(String(7));
      }
    });

    fireEvent.click(allTypeButton);

    expect(updateMock.mock.calls.at(-1)).toStrictEqual([
      {
        topLeft: '7px',
        topRight: '7px',
        bottomLeft: '7px',
        bottomRight: '7px',
      },
    ]);

    const individualInputs4 = root!.querySelectorAll(`div[class="css-7smjqm"]`);

    expect(individualInputs4).toHaveLength(0);
    expect(allTypeInputComponent).toHaveValue('7');
  });
});
