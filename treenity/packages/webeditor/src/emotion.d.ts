/* eslint-disable @typescript-eslint/no-empty-object-type */
import { MergedTokensComponents } from '@treenity/ui-kit/theme';

declare module '@emotion/react' {
  export interface Theme extends MergedTokensComponents {}
}
