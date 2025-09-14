import { MergedTokensComponents } from './dist/theme/types';

declare module '@emotion/react' {
  export interface Theme extends MergedTokensComponents {}
}
