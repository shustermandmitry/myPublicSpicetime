import { useEditor, useNode } from '@craftjs/core';
import styled from '@emotion/styled';
import { Button } from '@treenity/admin-components/components';
import { Popover } from 'antd';
import React, { FC, useCallback } from 'react';

const PARENTS_SHOWN = 2;

export interface INearbyComponent {
  type: string;
  id: string;
}

interface NearComponentsPanelProps {
  type?: string;
  label: string;
  parentsList?: INearbyComponent[];
}

const formatLabel = (label: string, type?: string, secondary: boolean = false) => {
  if (!type) {
    return label;
  }

  if (!secondary) {
    return `${type.charAt(0).toUpperCase() + type.slice(1)}.${label}`;
  }

  return (
    <>
      <TypeSuffix>{type.charAt(0).toUpperCase() + type.slice(1)}.</TypeSuffix>
      {label}
    </>
  );
};

const AncestorsPanel: FC<NearComponentsPanelProps> = ({ label, type, parentsList }) => {
  const getPopupContainer = useCallback(() => document.body, []);
  const visibleParents = parentsList?.slice(0, 2);
  const {
    connectors: { drag },
  } = useNode();

  const { actions } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent('selected').first();
    return {
      itemId: currentlySelectedNodeId,
    };
  });

  const handleClick = (ancestorId: string) => {
    actions.selectNode(ancestorId);
  };

  return (
    <Root>
      {/* @ts-ignore */}
      <ButtonStyled size="x-small" type="primary" ref={drag}>
        {formatLabel(label, type)}
      </ButtonStyled>
      {visibleParents?.map(({ id, type: itemType }, index) => {
        return (
          <Button
            size="x-small"
            type="secondary-outlined"
            key={`${label}-parent-${index}`}
            onClick={() => handleClick(id)}
          >
            {formatLabel(itemType, undefined, true)}
          </Button>
        );
      })}
      {parentsList && parentsList?.length > PARENTS_SHOWN && (
        <Popover
          arrow={false}
          placement="bottom"
          trigger="click"
          getPopupContainer={getPopupContainer}
          content={
            <PopoverContent>
              {parentsList?.slice(2).map(({ id, type: itemType }, index) => (
                <Button
                  size="x-small"
                  type="secondary-outlined"
                  key={`${label}-list-parent-${index}`}
                  onClick={() => handleClick(id)}
                >
                  {formatLabel(itemType, undefined, true)}
                </Button>
              ))}
            </PopoverContent>
          }
        >
          <Button size="x-small" type="secondary-outlined" onClick={() => {}}>
            ...
          </Button>
        </Popover>
      )}
    </Root>
  );
};

const Root = styled.div`
  position: absolute;
  top: -24px;
  left: 0;

  display: flex;
  flex-direction: row;
  gap: 2px;
`;

const TypeSuffix = styled.span`
  color: ${p => p.theme.colorGrayText};
`;

const PopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ButtonStyled = styled(Button)`
  cursor: move;
`;

export default AncestorsPanel;
