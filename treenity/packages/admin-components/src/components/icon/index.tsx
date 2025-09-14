import iconsNames from '@/components/icon/icon-component/icons-names';
import styled from '@emotion/styled';
import type { IIcon } from '@treenity/ui-kit';
import { FC } from 'react';
import IconComponent from './icon-component';

const Icon: FC<IIcon<typeof iconsNames>> = ({ className, style, ...restProps }) => {
  return (
    <IconWrapper className={`anticon ${className}`} style={style}>
      <IconComponent {...restProps} />
    </IconWrapper>
  );
};

const IconWrapper = styled.span`
  i {
    font-size: 15px;
  }
`;

export default Icon;
