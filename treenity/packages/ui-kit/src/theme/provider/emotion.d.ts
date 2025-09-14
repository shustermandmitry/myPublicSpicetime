/*
 * Copyright (c) 2024. Treenity Inc.
 */

// import { OverrideToken } from 'antd';
//
// declare module '@emotion/react' {
//   export interface Theme {
//     token: ThemeToken;
//     components: OverrideToken;
//   }
// }
import 'antd';
import { MergedTokensComponents } from '@/theme';

declare module '@emotion/react' {
  export interface Theme extends MergedTokensComponents {}
}

declare namespace antd {
  export const _default: {
    useToken(): {
      token: any;
      hashId: string;
    };
  };
}
