import Button from '@/components/button';
import Icon from '@/components/icon';
import { TextContent } from '@/components/typography';
import styled from '@emotion/styled';
import { merge } from '@s-libs/micro-dash';
import { getImageUrl, omitProps } from '@treenity/ui-kit/utils';
import { produce } from 'immer';
import { FC, useCallback, useMemo } from 'react';
import AngleSelector from './AngleSelector';
import GradientSlider from './GradientSlider';
import PointInput, { PointItem } from './PointInput';

const defaultColor = null;

export interface IPoint {
  position: number;
  color: string | null;
}

type IPoints = Record<number, IPoint | undefined>;

export interface GradientThemedValues {
  points: IPoints;
  angle: number;
}

interface GradientThemedProps {
  onChange?(values: GradientThemedValues): void;
  value: GradientThemedValues;
}

export const defaultBgGradientValues: GradientThemedValues = {
  angle: 0,
  points: {
    0: {
      position: 0,
      color: defaultColor,
    },
    1: {
      position: 100,
      color: defaultColor,
    },
  },
};

const GradientThemed: FC<GradientThemedProps> = ({ onChange, value }) => {
  const handleChange = <K extends keyof GradientThemedValues>(
    name: K,
    newValue: GradientThemedValues[K],
  ) => {
    const updateValue = {
      ...value,
      [name]: newValue,
    } as GradientThemedValues;

    onChange?.(updateValue);
  };

  const onReset = () => {
    onChange?.({ angle: defaultBgGradientValues.angle, points: defaultBgGradientValues.points });
  };

  const onChangePosition = (values: number[]) => {
    const newPoints = produce(value.points, draft => {
      values.forEach((position, index) => {
        if (draft[index]) {
          //@ts-ignore
          draft[index].position = position;
        }
      });
    });

    handleChange('points', newPoints);
  };

  const { colors, positions } = useMemo(() => {
    const colors: (string | null)[] = [];
    const positions: number[] = [];

    Object.values(value.points).forEach(value => {
      if (value) {
        colors.push(value.color);
        positions.push(Number(value.position));
      }
    });

    return { colors, positions };
  }, [value.points]);

  const onAddPoint = () => {
    const countPoints = Object.keys(value.points).length;

    const newPoints = Array.from({ length: countPoints + 1 }, (_, i) => ({
      position: Math.floor((i * 100) / countPoints),
      color: value.points[i]?.color || defaultColor,
    })).reduce((acc, point, i) => {
      acc[i] = point;
      return acc;
    }, {} as IPoints);

    handleChange('points', newPoints);
  };

  const onRemove = useCallback(
    (key: number) => {
      const newPoints = { ...value.points };
      delete newPoints[key];

      handleChange('points', newPoints);
    },
    [value.points],
  );

  const onChangePoints = (values: IPoint, index: number) => {
    const res = merge({}, value.points, { [index]: values });
    handleChange('points', res);
  };

  const mergeColorsPositions = positions
    .map((position, index) => ({
      color: colors[index],
      position,
    }))
    .sort((a, b) => a.position - b.position);

  return (
    <Root>
      <AngleSelector value={value.angle} onChange={newAngle => handleChange('angle', newAngle)} />
      <RightSide>
        <GradientSlider
          onChange={onChangePosition}
          range
          value={positions}
          colors={mergeColorsPositions}
        />
        <PointItem showButton={colors.length > 2}>
          <Label size={8} fontWeight={800}>
            Position
          </Label>
          <Label size={8} fontWeight={800}>
            Colors
          </Label>
        </PointItem>
        <ListPoints>
          {Object.values(value.points).map((point, index) => (
            <PointInput
              key={index}
              index={index}
              count={colors.length}
              value={point}
              onChange={(values: IPoint) => onChangePoints(values, index)}
              onRemove={onRemove}
            />
          ))}
          <Button
            size="x-small"
            id="add-button"
            type="secondary-outlined"
            icon={<Icon name="plus_outlined" />}
            onClick={onAddPoint}
          >
            Add
          </Button>
        </ListPoints>
        <Preview
          angle={value.angle}
          colors={mergeColorsPositions}
          backgroundImage={getImageUrl(
            224,
            110,
            '78a3df59d78e38bf95b2ac606cdab5a2aa28470ce47c31354af3b5375b5a876c',
          )}
        >
          <Button
            onClick={onReset}
            type="secondary-filled"
            size="x-small"
            icon={<Icon name="trash_filled" color="danger" />}
          />
        </Preview>
      </RightSide>
    </Root>
  );
};

const Preview = styled('div', omitProps('angle', 'colors', 'backgroundImage'))<{
  angle: number;
  colors: { color: string | null; position: number }[];
  backgroundImage: string;
}>`
  height: 110px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid ${p => p.theme.gray400};
  display: flex;
  justify-content: end;
  align-items: end;
  background: linear-gradient(
      ${p =>
        `${p.angle}deg, ${p.colors.map(
          ({ color, position }) => ` ${color === null ? 'transparent' : color} ${position}%`,
        )}`}
    ),
    url(${p => p.backgroundImage});
`;

const ListPoints = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
`;

const Label = styled(TextContent)`
  color: ${p => p.theme.colorGrayText};
  text-transform: uppercase;
  letter-spacing: -0.32px;
  line-height: 8px;
  margin-bottom: 4px;
`;

const Root = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
`;

const RightSide = styled.div`
  flex: 1;
`;

export default GradientThemed;
