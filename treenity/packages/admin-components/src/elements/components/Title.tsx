import { TextContent } from '@/components/typography';
import { ITypographyComponent } from '@/components/typography/types';
import styled from '@emotion/styled';

export type TitleTagType = 'h1' | 'h2' | 'h3' | 'p' | 'span';

const defaultProps: ITypographyComponent<TitleTagType> = {
  size: 48,
  fontWeight: 700,
  letterSpacing: -1.92,
};

const Title = styled((props: ITypographyComponent<TitleTagType>) =>
  TextContent({ ...props, ...defaultProps }),
)`
  color: ${p => p.theme.colorTextBase};
  margin-bottom: 16px;
`;

export default Title;
