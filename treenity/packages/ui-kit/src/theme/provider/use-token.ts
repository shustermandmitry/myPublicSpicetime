/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { theme } from 'antd';
import { MergedTokensComponents } from '../types';

type UseTokenResult = Omit<ReturnType<typeof theme.useToken>, 'token'> & {
  token: MergedTokensComponents;
};

export function useToken(): UseTokenResult {
  // @ts-ignore
  return theme.useToken() as UseTokenResult;
}
