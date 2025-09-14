import { TextContent } from '@/components/typography';
import { ITypographyComponent } from '@/components/typography/types';
import styled from '@emotion/styled';
import { TitleTagType } from '../types';

const defaultProps: ITypographyComponent<TitleTagType> = {
  size: 16,
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: -0.8,
};

const Text = styled((props: ITypographyComponent<TitleTagType>) =>
  TextContent({ ...props, ...defaultProps }),
)`
  color: ${p => p.theme.colorTextBase};
  margin-bottom: 24px;
`;

export default Text;
