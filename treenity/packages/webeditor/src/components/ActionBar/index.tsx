import styled from '@emotion/styled';
import { ComponentProps, FC, PropsWithChildren } from 'react';
import AncestorsPanel from 'src/components/AncestorsPanel';

const ActionBar: FC<
  PropsWithChildren<
    {
      label?: string;
      ancestors?: { id: string; type: string }[];
    } & ComponentProps<'div'>
  >
> = ({ label, ancestors, children, ...props }) => {
  return (
    <ActionBarRoot {...props} id="action-bar-panel">
      <AncestorsPanel label={label ?? ''} parentsList={ancestors} />
      <Group>{children}</Group>
    </ActionBarRoot>
  );
};

const ActionBarRoot = styled.div`
  position: relative;
  color: black;
  display: flex;
  border: 1px solid ${p => p.theme.gray400};
  border-radius: 0.375rem;
  height: 32px;
  align-items: center;
  background-color: ${p => p.theme.colorBgContainer};
  font-size: 12px;
  transition:
    background-color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
    border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

  .delete-section {
    display: flex;
    flex-direction: row;
    gap: 2px;
    justify-content: center;
    height: 100%;
    align-items: center;
    border: 0;
    max-height: 32px;
    padding-inline: 8px;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 100%;
  align-items: center;
`;

export { ActionBar as default, Group };
