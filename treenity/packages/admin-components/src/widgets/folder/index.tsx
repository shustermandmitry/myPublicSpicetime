import Button from '@/components/button';
import Icon from '@/components/icon';
import FooterFolder from '@/widgets/folder/footers/FooterFolder';
import FooterProject from '@/widgets/folder/footers/FooterProject';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { Popover, Tooltip } from 'antd';
import { FC, useState } from 'react';
import HeaderFolderButtons from './HeaderButtons';
import type { AssetFolderType, IFolderComponent } from './types';

const getFooterComponent = (type: AssetFolderType) => {
  switch (type) {
    case 'folder':
    case 'file':
    case 'template': {
      return FooterFolder;
    }
    case 'project': {
      return FooterProject;
    }
  }
};

const align = { offset: [8, 8] };

const FolderComponent: FC<IFolderComponent> = ({
  title,
  image,
  contextMenu,
  type = 'folder',
  draggable,
  disabled,
  onDragStart,
  onSelected,
  isBorder,
  onClick,
  publicLink,
}) => {
  const [isSelect, setIsSelect] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const onOpenPublicLink = () => {
    publicLink && window.open(publicLink, '_blank');
  };

  const onSelect = () => {
    setIsSelect(!isSelect);
    onSelected?.();
  };

  const FooterComponent = getFooterComponent(type);
  const isShowHeaderButtons =
    type === 'project' && !!onSelected && !disabled && (isHover || isSelect);

  return (
    <Root
      data-testid="folder"
      draggable={draggable}
      onDragStart={onDragStart}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      disabled={disabled}
      isSelect={isSelect}
      isBorder={isBorder}
      type={type}
      onClick={e => !disabled && onClick(e)}
    >
      <Header>
        <ImageContainer disabled={disabled} type={type}>
          {typeof image === 'string' ? (
            <Image src={image} alt={`${type}-image`} />
          ) : image ? (
            image
          ) : null}
        </ImageContainer>
        {isShowHeaderButtons && (
          <HeaderFolderButtons onSelect={onSelect} disabled={disabled} isSelect={isSelect} />
        )}
        {contextMenu && (
          <Mask>
            {publicLink && (
              <Tooltip title="Open public page in new tab" placement="top">
                <Button
                  data-testid="globe-button"
                  type="secondary-outlined"
                  size="small"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenPublicLink();
                  }}
                  icon={<Icon name="globe-wired_outlined" />}
                />
              </Tooltip>
            )}
            <Popover
              placement="bottomRight"
              trigger="click"
              content={() => contextMenu}
              align={align}
              //@ts-ignore
              getPopupContainer={() => document.getElementById('sider-layout')}
            >
              <Button
                data-testid="folder-context-menu-button"
                type="secondary-outlined"
                size="small"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                icon={<IconStyled name="kebab-v_filled" />}
              />
            </Popover>
          </Mask>
        )}
      </Header>
      {/*@ts-ignore*/}
      <FooterComponent title={title} disabled={disabled} type={type} />
    </Root>
  );
};

const IconStyled = styled(Icon)`
  i {
    color: ${p => p.theme.colorTextBase};
  }
`;

const Mask = styled.div`
  z-index: 2;
  position: absolute;
  right: 4px;
  top: 4px;
  display: flex;
  flex-direction: row;
  gap: 2px;

  .ant-popover {
    inset: 36px -8px auto auto !important;
  }
`;

const Image = styled.img`
  width: 100%;
  display: block;
  object-fit: contain;
`;

const ImageContainer = styled('div', omitProps('disabled', 'type'))<{
  disabled?: boolean;
  type: AssetFolderType;
}>`
  overflow: hidden;
  position: relative;
  border-radius: 12px 12px 6px 6px;

  ${p => css`
    ${p.disabled &&
    css`
      opacity: 0.4;
    `}

    ${(p.type === 'folder' || p.type === 'file') &&
    css`
      height: 120px;
    `}

    ${p.type === 'project' &&
    css`
      height: calc(100% - 34px);
    `}
  `}
`;

const Header = styled.div`
  position: relative;
  flex: 1;
`;

const Root = styled('div', omitProps('disabled', 'isSelect', 'type', 'isBorder'))<{
  disabled?: boolean;
  isSelect?: boolean;
  isBorder?: boolean;
  type: AssetFolderType;
}>`
  padding: 4px 4px 0 4px;
  min-width: 183px;
  border-radius: 16px 16px 12px 12px;
  border: 1px solid ${p => (p.isBorder ? p.theme.colorPrimary : p.theme.gray400)};
  background: #fff;
  display: flex;
  flex-direction: column;

  position: relative;
  transition:
    border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
    color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
    background 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  background: ${p => p.theme.colorBgBase};

  ${p => css`
    ${!p.disabled &&
    css`
      ${p.isSelect &&
      css`
        border: 2px solid ${p.theme.colorPrimary};
      `}
    `}

    ${(p.type === 'folder' || p.type === 'file' || p.type === 'template') &&
    css`
      cursor: pointer;

      ${p.disabled &&
      css`
        cursor: not-allowed;
      `}
    `}

    ${(p.type === 'folder' || p.type === 'file') &&
    css`
      height: 154px;
    `}

    ${p.type === 'template' &&
    css`
      height: 208px;
    `}

    ${p.type === 'project' &&
    css`
      height: 166px;
      cursor: default;
    `}
  `}
`;

export default FolderComponent;
