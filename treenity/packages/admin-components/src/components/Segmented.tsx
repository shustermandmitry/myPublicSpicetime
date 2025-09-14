import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { Segmented as AntdSegmented, SegmentedProps } from 'antd';

interface SegmentedStyledProps<ValueType> extends Omit<SegmentedProps<ValueType>, 'ref'> {
  independent?: boolean;
  onChange?(value: unknown): void;
}

const Segmented = <ValueType,>({ ...restProps }: SegmentedStyledProps<ValueType>) => {
  return <SegmentedStyled {...restProps} />;
};

const SegmentedStyled = styled(AntdSegmented, omitProps('independent'))<SegmentedStyledProps<any>>`
  border: 1px solid ${p => (p.independent ? 'transparent' : p.theme.colorBorder)};
  padding: 1px;
  font-weight: 700;

  &&& {
    transition: border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86) !important;

    .ant-segmented,
    .ant-segmented .ant-segmented-item {
      transition:
        background 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
        color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
        border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86) !important;
    }

    && {
      ${p =>
        p.size === 'small' &&
        css`
          border-radius: 6px;

          &.ant-segmented.ant-segmented-sm .ant-segmented-item,
          &.ant-segmented.ant-segmented-sm .ant-segmented-thumb {
            border-radius: 4px;
          }
        `}

      ${p =>
        (p.size === 'middle' || !p.size) &&
        css`
          border-radius: 6px;

          &.ant-segmented .ant-segmented-item,
          &.ant-segmented .ant-segmented-thumb {
            border-radius: 4px;
          }
        `}
    }

    ${p =>
      p.independent &&
      css`
        .ant-segmented-group {
          gap: 4px;
        }

        background-color: transparent;
      `};

    i {
      font-size: ${p => (p.size === 'large' ? '18px' : p.size === 'middle' ? '14px' : '12px')};
    }

    // Needed to center icon's ReactNodes

    .ant-segmented-item-icon,
    .ant-segmented-item-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
`;

export default Segmented;
