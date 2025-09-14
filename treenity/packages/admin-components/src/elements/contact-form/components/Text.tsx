import { TextContent } from '@/components/typography';
import { ITypographyComponent } from '@/components/typography/types';
import { TitleTagType } from '@/elements/components/Title';
import styled from '@emotion/styled';

const defaultProps: ITypographyComponent<TitleTagType> = {
  size: 16,
  fontWeight: 500,
  letterSpacing: -0.64,
  lineHeight: -0.64,
};

const Text = styled((props: ITypographyComponent<TitleTagType>) =>
  TextContent({ ...props, ...defaultProps }),
)`
  margin-bottom: 0;
`;

export default Text;
