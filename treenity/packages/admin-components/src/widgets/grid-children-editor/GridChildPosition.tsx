import InputNumber from '@/components/input-number';
import Segmented from '@/components/Segmented';
import Select from '@/components/select';
import styled from '@emotion/styled';
import { isEqual } from '@s-libs/micro-dash';
import { omitProps } from '@treenity/ui-kit/utils';
import React, { FC, useMemo, useState } from 'react';
import { areaLabel } from '../grid-settings/Item';
import PanelItem from '../panel-item';
import { positionOptions } from './lists';
import type {
  GridChildPositionProps,
  GridChildPositionType,
  IGridChildPositionOptions,
} from './types';

const GridChildPosition: FC<GridChildPositionProps> = ({ value, onChange, areas }) => {
  const positionSegmentedValue = value ? (Object.keys(value)[0] as GridChildPositionType) : 'auto';
  const [positionValue, setPositionValue] = useState(positionSegmentedValue);

  const handleChange = <K extends keyof IGridChildPositionOptions>(
    name: K,
    newValue: IGridChildPositionOptions[K],
  ) => {
    const updatedValue = {
      [name]: newValue,
    } as IGridChildPositionOptions;

    onChange?.(updatedValue);
  };

  const handleAreaChange = (selectedIndex: number) => {
    if (areas && selectedIndex >= 0 && selectedIndex < areas.length) {
      handleChange('area', areas[selectedIndex]);
    }
  };

  const isDisableAreas = !areas?.length;

  const isAuto = positionValue === 'auto';
  const isArea = positionValue === 'area';
  const isManual = positionValue === 'manual';

  const areasOptions = useMemo(
    () =>
      areas?.map((area, index) => ({
        label: areaLabel(area, index),
        value: index,
      })),
    [areas],
  );

  const areaSelectValue = useMemo(() => {
    if (!value?.area || !areas) return undefined;
    return areas.findIndex(area => isEqual(area, value.area));
  }, [value?.area, areas]);

  return (
    <Root>
      <PanelItem width={120} align="center" label="Position">
        <Segmented<GridChildPositionType>
          size="small"
          block
          options={positionOptions(isDisableAreas)}
          onChange={setPositionValue}
          value={positionValue}
        />
        {isAuto ? (
          <Flex>
            <InputNumber
              size="x-small"
              placeholder="0"
              value={value?.auto?.columns_span}
              onChange={newValue =>
                handleChange('auto', {
                  ...value?.auto,
                  columns_span: Number(newValue),
                })
              }
            />
            <InputNumber
              size="x-small"
              placeholder="0"
              value={value?.auto?.rows_span}
              onChange={newValue =>
                handleChange('auto', {
                  ...value?.auto,
                  rows_span: Number(newValue),
                })
              }
            />
            <span>columns span</span>
            <span>rows span</span>
          </Flex>
        ) : isManual ? (
          <Flex columns={4}>
            <InputNumber
              size="x-small"
              placeholder="0"
              value={value?.manual?.column_start}
              onChange={newValue =>
                handleChange('manual', {
                  ...value?.manual,
                  column_start: Number(newValue),
                })
              }
            />
            <InputNumber
              size="x-small"
              placeholder="0"
              value={value?.manual?.column_end}
              onChange={newValue =>
                handleChange('manual', {
                  ...value?.manual,
                  column_end: Number(newValue),
                })
              }
            />
            <InputNumber
              size="x-small"
              placeholder="0"
              value={value?.manual?.row_start}
              onChange={newValue =>
                handleChange('manual', {
                  ...value?.manual,
                  row_start: newValue,
                })
              }
            />
            <InputNumber
              size="x-small"
              placeholder="0"
              value={value?.manual?.row_end}
              onChange={newValue =>
                handleChange('manual', {
                  ...value?.manual,
                  row_end: newValue,
                })
              }
            />
            <span>columns start/end</span>
            <span>rows start/end</span>
          </Flex>
        ) : (
          isArea && (
            <Flex columns={1}>
              <Select
                placeholder="Select area"
                size="x-small"
                options={areasOptions}
                value={areaSelectValue}
                onChange={handleAreaChange}
              />
              <span>grid area</span>
            </Flex>
          )
        )}
      </PanelItem>
    </Root>
  );
};

const Root = styled.div`
  & > div > div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

const Flex = styled('div', omitProps('columns'))<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${p => p.columns ?? 2}, 1fr);
  column-gap: 4px;
  row-gap: 2px;

  & > span {
    color: ${p => p.theme.colorGrayText};
    text-align: center;
    font-size: 8px;
    font-weight: 800;
    line-height: 8px;
    letter-spacing: -0.32px;
    text-transform: uppercase;
    grid-column: span ${p => (p.columns || 2) / 2};
  }
`;

export default GridChildPosition;
