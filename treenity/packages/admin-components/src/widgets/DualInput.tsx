import Button from '@/components/button';
import Icon from '@/components/icon';
import { TextContent } from '@/components/typography';
import styled from '@emotion/styled';
import { FC, useState } from 'react';

type TDualInputValueProps = {
  [key: string]: string | undefined;
};

interface IDualInputs {
  FirstInput: FC<any>;
  SecondInput: FC<any>;
  firstInputDesc?: string;
  secondInputDesc?: string;
  firstName: string;
  secondName: string;
  onChange?(value: TDualInputValueProps): void;
  value?: TDualInputValueProps;
}

const DualInput: FC<IDualInputs> = ({
  FirstInput,
  firstInputDesc,
  SecondInput,
  secondInputDesc,
  firstName,
  secondName,
  value = {},
  onChange,
}) => {
  const [isLinked, setIsLinked] = useState<boolean>(false);

  const handleFirstChange = (newValue: string) => {
    onChange?.({
      [firstName]: newValue,
      [secondName]: isLinked ? newValue : value[secondName],
    });
  };

  const handleSecondChange = (newValue: string) => {
    onChange?.({
      [firstName]: isLinked ? newValue : value[firstName],
      [secondName]: newValue,
    });
  };

  const handleLinkToggle = () => {
    setIsLinked(prevLinked => {
      if (!prevLinked) {
        const _value = value[firstName] || value[secondName];

        if (_value) {
          onChange?.({
            [firstName]: _value,
            [secondName]: _value,
          });
        }
      }

      return !prevLinked;
    });
  };

  return (
    <Root>
      <div>
        <FirstInput value={value[firstName]} onChange={handleFirstChange} />
        <Description size={8} fontWeight={800}>
          {firstInputDesc}
        </Description>
      </div>
      <SyncButton type="text" onClick={handleLinkToggle}>
        <Icon name="bundle_outlined" color={isLinked ? 'primary' : 'default'} />
      </SyncButton>
      <div>
        <SecondInput value={value[secondName]} onChange={handleSecondChange} />
        <Description size={8} fontWeight={800}>
          {secondInputDesc}
        </Description>
      </div>
    </Root>
  );
};

const Description = styled(TextContent)`
  color: ${p => p.theme.colorGrayText};
  text-transform: uppercase;
  letter-spacing: -0.32px;
  text-align: center;
  line-height: 8px;
`;

const Root = styled.div`
  display: flex;
  align-items: start;

  .ant-form-item {
    margin: 0;

    .ant-form-item-control-input {
      min-height: initial;
    }
  }
`;

const SyncButton = styled(Button)`
  width: 20px;
  min-width: 20px;
  height: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  outline: none;

  && i {
    font-size: 12px;
  }
`;

export default DualInput;
