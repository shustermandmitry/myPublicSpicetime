import { IconNamesMap } from '@/components/icon/icon-component/types';
import { generateNeighbourColors } from '@/utils/generate-neighbour-colors';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { normalizeComponentSize, omitProps } from '@treenity/ui-kit/utils';
import { Button as ButtonAntd } from 'antd';
import { ButtonProps } from 'antd/es/button/button';
import React, { ReactNode } from 'react';
import Icon from '../icon';

export type ButtonStyledType =
  | ButtonProps['type']
  | 'outlined'
  | 'secondary-outlined'
  | 'secondary-filled'
  | 'text-filled';
export type ButtonStyledSize = ButtonProps['size'] | 'x-small' | 'x-large';

export interface ButtonStyledProps extends Omit<ButtonProps, 'type' | 'size' | 'icon'> {
  type?: ButtonStyledType;
  size?: ButtonStyledSize;
  icon?: IconNamesMap | ReactNode;
  suffix?: string | ReactNode;
  iconsColor?: string;
  danger?: boolean;
}

const calculateIndentWithIcon = (p: any, size: 'XL' | 'LG' | '' | 'SM' | 'XS', indent: number) => {
  const padding = `${p.theme.Button[`paddingInline${size}`] - indent}px`;
  return css`
    ${p.block
      ? (p.icon || p.suffix) &&
        css`
          padding-inline: ${padding};
        `
      : p.icon
        ? css`
            padding-inline-start: ${padding};
          `
        : p.suffix
          ? css`
              padding-inline-end: ${padding};
            `
          : null};
  `;
};

const OmitButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonStyledProps>(
  (
    { type = 'default', size = 'middle', icon, suffix, iconsColor, loading, danger, ...restProps },
    ref,
  ) => {
    if (
      type === 'secondary-outlined' ||
      type === 'secondary-filled' ||
      type === 'outlined' ||
      type === 'text-filled'
    ) {
      type = 'default';
    }

    if (typeof icon === 'string') {
      icon = <Icon name={icon as IconNamesMap} />;
    }

    if (typeof suffix === 'string') {
      suffix = <Icon name={suffix as IconNamesMap} />;
    }

    return (
      <ButtonAntd
        ref={ref}
        type={type}
        size={normalizeComponentSize(size)}
        icon={!restProps.children ? icon || suffix : undefined}
        aria-label={restProps['aria-label'] || restProps.title}
        loading={false}
        danger={danger}
        {...restProps}
      >
        {restProps.children && (
          <>
            {loading ? (
              <Icon name="loader_filled" spin />
            ) : icon ? (
              icon
            ) : suffix && restProps.block ? (
              <Empty size={size} />
            ) : null}
            <Text>{restProps.children}</Text>
            {suffix ? (
              suffix
            ) : (icon && restProps.block) || (loading && restProps.block) ? (
              <Empty size={size} />
            ) : null}
          </>
        )}
      </ButtonAntd>
    );
  },
);

const Empty = styled('span', omitProps('size'))<{ size?: ButtonStyledSize }>`
  ${p => css`
    ${p.size === 'x-large' &&
    css`
      width: 24px;
      height: 24px;
    `};

    ${p.size === 'large' &&
    css`
      width: 20px;
      height: 20px;
    `};

    ${(p.size === 'middle' || !p.size) &&
    css`
      width: 16px;
      height: 16px;
    `};

    ${p.size === 'small' &&
    css`
      width: 12px;
      height: 12px;
    `};

    ${p.size === 'x-small' &&
    css`
      width: 12px;
      height: 12px;
    `};
  `}
`;

const Text = styled.span`
  flex: 1;
  text-align: center;
`;

const Button = styled(OmitButton, omitProps('iconsColor'))<
  ButtonStyledProps & { iconsColor?: string }
>`
  display: flex;
  align-items: center;
  box-shadow: none;
  font-weight: 600;
  vertical-align: middle;
  line-height: 1;
  transition:
    background 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
    color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
    border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86) !important;

  .ant-wave {
    display: none !important;
  }

  & > span {
    display: flex;
    align-items: center;
    justify-content: ${p =>
      p.children === undefined ? 'center' : 'space-between'}; // Case with empty button text at all
    width: 100%;
  }

  ${p =>
    p.iconsColor &&
    css`
      i {
        color: ${p.iconsColor} !important;
      }

      &:hover {
        i {
          color: ${generateNeighbourColors(p.iconsColor).hover} !important;
        }
      }

      &:active {
        i {
          color: ${generateNeighbourColors(p.iconsColor).active} !important;
        }
      }
    `};

  i {
    transition:
      background 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
      color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
      border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86) !important;
  }

  &.ant-btn.ant-btn-round {
    ${p => css`
      ${p.size === 'x-large' &&
      css`
        padding-inline: ${p.theme.Button.paddingInlineXL}px;
      `};

      ${p.size === 'large' &&
      css`
        padding-inline: ${p.theme.Button.paddingInlineLG}px;
      `};

      ${(p.size === 'middle' || !p.size) &&
      css`
        padding-inline: ${p.theme.Button.paddingInline}px;
        ${!p.children &&
        p.icon &&
        css`
          width: ${p.theme.Button.controlHeight}px;
        `}
      `};

      ${p.size === 'small' &&
      css`
        padding-inline: ${p.theme.Button.paddingInlineSM}px;
      `};

      ${p.size === 'x-small' &&
      css`
        padding-inline: ${p.theme.Button.paddingInlineXS}px;
      `};
    `}
  }

  ${p => css`
    ${p.type === 'outlined' &&
    css`
      i {
        color: ${p.danger ? p.theme.Button.dangerOutlinedColor : p.theme.colorPrimary};
      }

      background: ${p.danger ? p.theme.Button.dangerOutlinedBg : p.theme.Button.secOutlinedBg};
      color: ${p.danger ? p.theme.Button.dangerOutlinedColor : p.theme.Button.colorPrimary};
      border-color: ${p.danger
        ? p.theme.Button.dangerOutlinedBorderColor
        : p.theme.Button.colorPrimary};

      &.ant-btn-default:not(:disabled):not(&.ant-btn-disabled):hover {
        background: ${p.danger
          ? p.theme.Button.dangerOutlinedHoverBg
          : p.theme.Button.secOutlinedHoverBg};
        color: ${p.danger ? p.theme.Button.dangerOutlinedHoverColor : p.theme.colorPrimaryHover};
        border-color: ${p.danger
          ? p.theme.Button.dangerOutlinedHoverBorderColor
          : p.theme.colorPrimaryHover};

        i {
          color: ${p.danger ? p.theme.Button.dangerOutlinedHoverColor : p.theme.colorPrimaryHover};
        }
      }

      &.ant-btn-default:not(:disabled):not(&.ant-btn-disabled):active {
        background: ${p.danger
          ? p.theme.Button.dangerOutlinedActiveBg
          : p.theme.Button.secOutlinedActiveBg};
        color: ${p.danger
          ? p.theme.Button.dangerOutlinedActiveColor
          : p.theme.Button.colorPrimaryActive};
        border-color: ${p.danger
          ? p.theme.Button.dangerOutlinedActiveBorderColor
          : p.theme.Button.colorPrimaryActive};

        i {
          color: ${p.danger
            ? p.theme.Button.dangerOutlinedActiveColor
            : p.theme.Button.colorPrimaryActive};
        }
      }
    `};

    ${p.type === 'secondary-outlined' &&
    css`
      background: ${p.theme.Button.secOutlinedBg};
      color: ${p.theme.Button.secOutlinedColor};
      border-color: ${p.theme.Button.secOutlinedBorderColor};

      &:not(:disabled):not(&.ant-btn-disabled) {
        i {
          color: ${p.theme.colorPrimary};
        }
      }

      &.ant-btn-default:not(:disabled):not(&.ant-btn-disabled):hover {
        background: ${p.theme.Button.secOutlinedHoverBg};
        color: ${p.theme.Button.secOutlinedHoverColor};
        border-color: ${p.theme.Button.secOutlinedHoverBorderColor};

        i {
          color: ${p.theme.Button.secOutlinedHoverColor};
        }
      }

      &.ant-btn-default:not(:disabled):not(&.ant-btn-disabled):active {
        background: ${p.theme.Button.secOutlinedActiveBg};
        color: ${p.theme.Button.secOutlinedActiveColor};
        border-color: ${p.theme.Button.secOutlinedActiveBorderColor};

        i {
          color: ${p.theme.Button.secOutlinedActiveColor};
        }
      }
    `};

    ${(p.type === 'primary' || p.type === 'default' || !p.type) &&
    css`
      border: none;
      background: ${p.danger ? p.theme.Button.dangerFilledColor : p.theme.colorPrimary};
      color: ${p.theme.colorWhite};

      &.ant-btn-primary:not(:disabled):not(&.ant-btn-disabled):hover,
      &.ant-btn:not(:disabled):not(&.ant-btn-disabled):hover {
        background: ${p.danger
          ? p.theme.Button.dangerOutlinedHoverColor
          : p.theme.colorPrimaryHover};
        color: ${p.theme.colorWhite};
      }

      &.ant-btn-primary:not(:disabled):not(&.ant-btn-disabled):active,
      &.ant-btn:not(:disabled):not(&.ant-btn-disabled):active {
        background: ${p.danger
          ? p.theme.Button.dangerOutlinedActiveColor
          : p.theme.colorPrimaryActive};
        color: ${p.theme.colorWhite};
      }
    `};

    ${p.type === 'text' &&
    css`
      border: none;
      background-color: transparent !important;
      color: ${p.danger ? p.theme.colorError : p.theme.colorText};

      &.ant-btn:not(:disabled):not(&.ant-btn-disabled):hover {
        color: ${p.danger ? p.theme.colorErrorHover : p.theme.colorPrimaryHover};
      }

      &.ant-btn:not(:disabled):not(&.ant-btn-disabled):active {
        color: ${p.danger ? p.theme.colorErrorActive : p.theme.colorPrimaryActive};
      }
    `};

    ${p.type === 'text-filled' &&
    css`
      border: none;
      background: ${p.danger ? p.theme.Button.dangerFilledBg : p.theme.Button.secFilledBg};
      color: ${p.danger ? p.theme.Button.dangerFilledColor : p.theme.Button.secFilledColor};

      &:not(:disabled):not(&.ant-btn-disabled) {
        i {
          color: ${p.danger ? p.theme.Button.dangerFilledColor : p.theme.colorText};
        }

        &.ant-btn-default:not(:disabled):not(&.ant-btn-disabled):hover {
          background: ${
            p.danger ? p.theme.Button.dangerFilledHoverBg : p.theme.Button.secFilledHoverBg
          };
          color: ${p.danger ? p.theme.Button.dangerFilledHoverColor : p.theme.colorText};
          border-color: ${
            p.danger
              ? p.theme.Button.dangerFilledHoverBorderColor
              : p.theme.Button.secFilledHoverBorderColor
          };

          i {
            color: ${
              p.danger ? p.theme.Button.dangerFilledHoverColor : p.theme.Button.secFilledHoverColor
            };
          }
        }

        &.ant-btn-default:not(:disabled):not(&.ant-btn-disabled):active {
          background: ${
            p.danger ? p.theme.Button.dangerFilledActiveBg : p.theme.Button.secFilledActiveBg
          };
          color: ${p.danger ? p.theme.Button.dangerFilledActiveColor : p.theme.colorText};
          border-color: ${
            p.danger
              ? p.theme.Button.dangerFilledActiveBorderColor
              : p.theme.Button.secFilledActiveBorderColor
          };

          i {
            color: ${
              p.danger
                ? p.theme.Button.dangerFilledActiveColor
                : p.theme.Button.secFilledActiveColor
            };
          }
        }
    `};

    ${p.type === 'secondary-filled' &&
    css`
      && {
        border: none;
        background: ${p.danger ? p.theme.Button.dangerFilledBg : p.theme.Button.secFilledBg};
        color: ${p.danger ? p.theme.Button.dangerFilledColor : p.theme.Button.secFilledColor};
        border-color: ${p.danger
          ? p.theme.Button.dangerFilledBorderColor
          : p.theme.Button.secFilledBorderColor};
      }

      &:not(:disabled):not(&.ant-btn-disabled) {
        i {
          color: ${p.danger ? p.theme.Button.dangerFilledColor : p.theme.colorPrimary};
        }
      }

      &.ant-btn-default:not(:disabled):not(&.ant-btn-disabled):hover {
        background: ${p.danger
          ? p.theme.Button.dangerFilledHoverBg
          : p.theme.Button.secFilledHoverBg};
        color: ${p.danger
          ? p.theme.Button.dangerFilledHoverColor
          : p.theme.Button.secFilledHoverColor};
        border-color: ${p.danger
          ? p.theme.Button.dangerFilledHoverBorderColor
          : p.theme.Button.secFilledHoverBorderColor};

        i {
          color: ${p.danger
            ? p.theme.Button.dangerFilledHoverColor
            : p.theme.Button.secFilledHoverColor};
        }
      }

      &.ant-btn-default:not(:disabled):not(&.ant-btn-disabled):active {
        background: ${p.danger
          ? p.theme.Button.dangerFilledActiveBg
          : p.theme.Button.secFilledActiveBg};
        color: ${p.danger
          ? p.theme.Button.dangerFilledActiveColor
          : p.theme.Button.secFilledActiveColor};
        border-color: ${p.danger
          ? p.theme.Button.dangerFilledActiveBorderColor
          : p.theme.Button.secFilledActiveBorderColor};

        i {
          color: ${p.danger
            ? p.theme.Button.dangerFilledActiveColor
            : p.theme.Button.secFilledActiveColor};
        }
      }
    `};

    i {
      font-size: 16px;
    }

    ${p.size === 'x-large' &&
    css`
      height: ${p.theme.Button.controlHeightXL}px;
      padding: ${p.theme.Button.paddingBlockXL}px ${p.theme.Button.paddingInlineXL}px;
      border-radius: ${p.theme.Button.borderRadiusXL}px;

      ${!p.children &&
      p.icon &&
      css`
        &&& {
          width: ${p.theme.Button.controlHeightXL}px;
          min-width: ${p.theme.Button.controlHeightXL}px;
        }
      `}

      ${calculateIndentWithIcon(p, 'XL', 4)};

      & > span {
        gap: 8px;
      }

      span {
        font-size: 16px;
      }

      && > span > span > i,
      && > span > i {
        font-size: 24px;
      }
    `}

    ${p.size === 'large' &&
    css`
      height: ${p.theme.Button.controlHeightLG}px;
      padding: ${p.theme.Button.paddingBlockLG}px ${p.theme.Button.paddingInlineLG}px;

      ${!p.children &&
      p.icon &&
      css`
        &&& {
          width: ${p.theme.Button.controlHeightLG}px;
          min-width: ${p.theme.Button.controlHeightLG}px;
        }
      `}

      ${calculateIndentWithIcon(p, 'LG', 4)};

      & > span {
        gap: 8px;
      }

      span {
        font-size: 16px;
      }

      && > span > span > i,
      && > span > i {
        font-size: 20px;
      }
    `}

    ${(!p.size || p.size === 'middle') &&
    css`
      ${calculateIndentWithIcon(p, '', 2)};

      & > span {
        gap: 6px;
      }

      span {
        font-size: 12px;
      }

      && > span > span > i,
      && > span > i {
        font-size: 16px;
      }
    `}

    ${p.size === 'small' &&
    css`
      ${calculateIndentWithIcon(p, 'SM', 2)};

      border-radius: ${p.theme.Button.borderRadiusSM}px;
      height: ${p.theme.Button.controlHeightSM}px;

      ${!p.children &&
      p.icon &&
      css`
        &&& {
          width: ${p.theme.Button.controlHeightSM}px;
          min-width: ${p.theme.Button.controlHeightSM}px;
        }
      `};

      & > span {
        gap: 4px;
      }

      &,
      span {
        line-height: 12px;
      }

      span {
        font-size: 10px;
      }

      && > span > span > i,
      && > span > i {
        font-size: 12px;
      }
    `};

    ${p.size === 'x-small' &&
    css`
      padding: ${p.theme.Button.paddingBlockXS}px ${p.theme.Button.paddingInlineXS}px;

      ${calculateIndentWithIcon(p, 'XS', 2)};

      & > span {
        gap: 4px;
      }

      &,
      span {
        line-height: 10px;
      }

      && > span > span > i,
      && > span > i {
        font-size: 12px;
      }

      border-radius: ${p.theme.Button.borderRadiusXS}px;
      height: ${p.theme.Button.controlHeightXS}px;
      font-size: 10px;

      ${!p.children &&
      p.icon &&
      css`
        width: ${p.theme.Button.controlHeightXS}px !important;
        min-width: ${p.theme.Button.controlHeightXS}px !important;
      `};
    `}
  `};
`;

Button.displayName = 'TreenityButton';

export default Button;
