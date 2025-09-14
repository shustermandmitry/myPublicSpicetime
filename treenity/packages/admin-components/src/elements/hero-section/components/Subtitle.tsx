import { TextContent } from '@/components/typography';
import { ITypographyComponent } from '@/components/typography/types';
import styled from '@emotion/styled';
import { TitleTagType } from '../types';

const defaultProps: ITypographyComponent<TitleTagType> = {
  size: 16,
  fontWeight: 800,
  lineHeight: 1,
  color: 'colorPrimary',
};

const Subtitle = styled((props: ITypographyComponent<TitleTagType>) =>
  TextContent({ ...props, ...defaultProps }),
)`
  margin-bottom: 6px;
  text-transform: uppercase;
  color: ${p => p.theme.colorTextBase};
`;

export default Subtitle;
