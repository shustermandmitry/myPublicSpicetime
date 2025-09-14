import Icon from '@/components/icon';
import { Collapse, CollapseProps } from 'antd';
import { EditorProps } from '../EditorProps';
import { ICollapseProps } from './types';

const CollapseTFC: EditorProps<ICollapseProps> = ({
  mergedMeta: { list, size, accordion, bordered, expandIconPosition, ghost, collapsible },
}) => {
  let defaultActiveKey: Array<string | number> = [];

  const items: CollapseProps['items'] = list.map(
    ({ label, children, active, showArrow = true, extra }, index) => {
      if (active) {
        defaultActiveKey.push(index);
      }

      return {
        key: index,
        label,
        children,
        showArrow,
        extra: extra && <Icon name={extra} />,
      };
    },
  );

  return (
    <Collapse
      bordered={bordered}
      accordion={accordion}
      size={size}
      items={items}
      defaultActiveKey={defaultActiveKey}
      expandIconPosition={expandIconPosition}
      ghost={ghost}
      collapsible={collapsible}
    />
  );
};

export default CollapseTFC;
