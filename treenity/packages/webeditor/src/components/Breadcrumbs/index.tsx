import styled from '@emotion/styled';
import { FC } from 'react';
import { useEditor } from '@craftjs/core';

interface Ancestor {
  id: string;
  type: string;
}

interface BreadcrumbsProps {
  ancestors: Ancestor[];
}

const BreadcrumbsRoot = styled.div`
  display: flex;
  align-items: center;
  /* gap: 4px; */
`;

const Separator = styled.span`
  color: ${p => p.theme.colorTextBase};
  font-size: 12px;
  opacity: 0.5;
`;

const BreadcrumbItem = styled.button`
  all: unset;
  color: ${p => p.theme.colorTextDescription};
  font-size: 10px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.2px;
  text-align: center;
  padding-inline: 0.25rem;
  cursor: pointer;
  &:hover {
    color: ${p => p.theme.colorTextBase};
  }

  &:focus {
    outline: none;
  }
`;

const Breadcrumbs: FC<BreadcrumbsProps> = ({ ancestors }) => {
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
    <BreadcrumbsRoot>
      {ancestors.map((ancestor, index) => (
        <>
          <BreadcrumbItem key={ancestor.id} onClick={() => handleClick(ancestor.id)}>
            {ancestor.type}
          </BreadcrumbItem>
          <Separator>/</Separator>
        </>
      ))}
    </BreadcrumbsRoot>
  );
};

export default Breadcrumbs;
