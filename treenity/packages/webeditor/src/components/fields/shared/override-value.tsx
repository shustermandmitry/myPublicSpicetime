import { Button, Flex, Tooltip } from 'antd';

export interface OverrideValueProps {
  hasOverrideValue: boolean;
  onRemoveValue?: () => void;
}

export const OverrideValue = ({ hasOverrideValue, onRemoveValue }: OverrideValueProps) => {
  return (
    <>
      {hasOverrideValue ? (
        <Flex gap={'middle'} justify={'right'}>
          <Tooltip placement={'top'} title={`This prop has override value for current screen size`}>
            <Button onClick={onRemoveValue} size={'middle'}>
              Remove override value
            </Button>
          </Tooltip>
        </Flex>
      ) : null}
    </>
  );
};
