import { IconNamesMap } from '@/components/icon/icon-component/types';
import { CollapseProps } from 'antd';

export type CollapseListType = {
  /** @title Label */
  label: string;
  /**
   * @title Text
   * @widget treenity.textarea
   **/
  children: string;
  /** @title Active */
  active?: boolean;
  /** @title Show arrow */
  showArrow?: boolean;
  /**
   * @title Icon
   * @widget treenity.selectIcon
   **/
  extra?: IconNamesMap;
};

export interface ICollapseProps {
  list: CollapseListType[];
  size: CollapseProps['size'];
  accordion: CollapseProps['accordion'];
  bordered: CollapseProps['bordered'];
  expandIconPosition?: 'start' | 'end';
  ghost: CollapseProps['ghost'];
  collapsible: CollapseProps['collapsible'];
}
