import { TextContent } from '@/components/typography';
import { ITypographyComponent } from '@/components/typography/types';
import styled from '@emotion/styled';
import { TitleTagType } from '../types';

const defaultProps: ITypographyComponent<TitleTagType> = {
  size: 48,
  fontWeight: 800,
  letterSpacing: -2.56,
};

const Title = styled((props: ITypographyComponent<TitleTagType>) =>
  TextContent({ ...props, ...defaultProps }),
)`
  color: ${p => p.theme.colorTextBase};
  margin-bottom: 24px;
`;

export default Title;
