/*
 * Copyright (c) 2024. Treenity Inc.
 */
import { IconNamesMap } from '@/components';
import CollapseContainer from '@/widgets/CollapseContainer';
import type { ElementItemProps } from '@/widgets/edit-panel/elements/Item';
import ElementItem from '@/widgets/edit-panel/elements/Item';
import styled from '@emotion/styled';
import { FC, ReactNode } from 'react';

export interface ElementGroup {
  title: string;
  icon: IconNamesMap;
  items: ElementItemProps[];
}

interface ElementsProps {
  data?: ElementGroup[];
  GroupWrapper?: FC<{ children: ReactNode; groupIndex: number }>;
  ItemWrapper?: FC<{ children: ReactNode; item: ElementItemProps; itemIndex: number }>;
}

const elementsData: ElementGroup[] = [
  {
    title: 'Basic elements',
    icon: 'par_outlined',
    items: [
      { title: 'RichText', icon: 'align-left_outlined', name: 'ui.button' },
      { title: 'List', icon: 'add-bulleted-list_outlined', name: 'ui.button' },
      { title: 'Link', icon: 'bundle_outlined', name: 'ui.button' },
      { title: 'Image', icon: 'image_outlined', name: 'ui.button' },
      { title: 'Video', icon: 'play_outlined', name: 'ui.button' },
      { title: 'Button', image: '/public/components/button.png', name: 'ui.button' },
    ],
  },
  {
    title: 'Markup elements',
    icon: 'add-table_outlined',
    items: [
      { title: 'Section', icon: 'section_outlined', name: 'ui.button' },
      { title: 'Container', icon: 'container_outlined', name: 'ui.button' },
      { title: 'Flex Columns', icon: 'flex-rows-container_outlined', name: 'ui.button' },
      { title: 'Flex Rows', icon: 'flex-columns-container_outlined', name: 'ui.button' },
      { title: 'Grid', icon: 'grid_outlined', name: 'ui.button' },
      { title: '', name: '', divider: true },
      { title: 'Divider-H', icon: 'divider-h_outlined', name: 'ui.button' },
      { title: 'Divider-V', icon: 'divider-v_outlined', name: 'ui.button' },
    ],
  },
  {
    title: 'Advanced elements',
    icon: 'lightinhg_outlined',
    items: [
      { title: 'Breadcrumbs', icon: 'flag_outlined', name: 'ui.button' },
      { title: 'Slider', icon: 'carousel_outlined', name: 'ui.button' },
      { title: 'Accordion', icon: 'accordion_outlined', name: 'ui.button' },
      { title: 'Table', icon: 'add-table_outlined', name: 'ui.button' },
      { title: 'Drawer Menu', icon: 'sider_outlined', name: 'ui.button' },
      { title: 'Icon', icon: 'favourite_outlined', name: 'ui.button' },
    ],
  },
  {
    title: 'Layout components',
    icon: 'add-table_outlined',
    items: [
      { title: 'Header', image: '/public/components/headers.jpg', name: 'ui.button' },
      { title: 'Header', image: '/public/components/headers-1.jpg', name: 'ui.button' },
      { title: 'Header', image: '/public/components/headers-2.jpg', name: 'ui.button' },
      { title: '', name: '', divider: true },
      { title: 'Hero section', image: '/public/components/hero.jpg', name: 'ui.button' },
      { title: 'Hero section', image: '/public/components/hero-1.jpg', name: 'ui.button' },
      { title: 'Hero section', image: '/public/components/hero-2.jpg', name: 'ui.button' },
      { title: '', name: '', divider: true },
      { title: 'Footer', image: '/public/components/footers.jpg', name: 'ui.horizontal-footer' },
      { title: 'Footer', image: '/public/components/footers-1.jpg', name: 'ui.vertical-footer' },
    ],
  },
  {
    title: 'Form components',
    icon: 'file-text_outlined',
    items: [
      { title: 'Action form', image: '/public/components/contact-form.jpg', name: 'ui.button' },
      { title: 'Action form', image: '/public/components/contact-form-1.jpg', name: 'ui.button' },
      { title: 'Action form', image: '/public/components/contact-form-2.jpg', name: 'ui.button' },
      { title: '', name: '', divider: true },
      { title: 'Input', icon: 'input_outlined', name: 'ui.button' },
      { title: 'Select', icon: 'select_outlined', name: 'ui.button' },
      { title: 'Switch', icon: 'add-toggle-list_outlined', name: 'ui.button' },
      { title: 'Checkbox', icon: 'check-in-square_outlined', name: 'ui.button' },
      { title: 'Radio', icon: 'radio_outlined', name: 'ui.button' },
    ],
  },
];

const Elements: FC<ElementsProps> = ({
  data = elementsData,
  GroupWrapper = ({ children }) => <>{children}</>,
  ItemWrapper = ({ children }) => <>{children}</>,
}) => {
  return (
    <Root>
      {data.map((group, groupIndex) => (
        <GroupWrapper key={groupIndex} groupIndex={groupIndex}>
          <CollapseContainer title={group.title} variant="container" icon={group.icon} isOpen>
            <List>
              {group.items.map((item, itemIndex) => {
                if (!item?.divider) {
                  return (
                    <ItemWrapper key={itemIndex} item={item} itemIndex={itemIndex}>
                      <ElementItem {...item} />
                    </ItemWrapper>
                  );
                } else {
                  return <Divider />;
                }
              })}
            </List>
          </CollapseContainer>
        </GroupWrapper>
      ))}
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  * {
    user-select: none;
  }
`;

const Divider = styled.div`
  grid-column: span 3;
  height: 1px;
  width: 100%;
  background: ${p => p.theme.base400};
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
`;

export default Elements;
