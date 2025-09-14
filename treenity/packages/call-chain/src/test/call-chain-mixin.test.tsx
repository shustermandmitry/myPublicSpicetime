/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { renderHook, act, waitFor, RenderHookResult } from '@testing-library/react';
import React, { Fragment, useState } from 'react';
import { SWRResponse } from 'swr';
import { chainCall } from '../call-chain';
import '../util-mixins';
import '../react-mixins';

import { jest as Jest } from '@jest/globals';

const jest: any = Jest;

// await (await (await nodeData.getEvent({ active: true })).getEvent({ active: true })).bot.test();
export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

// Mock API implementation
interface User {
  id: number;
  name: string;
  api: UserAPI;
}

interface UserAPI {
  getUser(id: number): Promise<User>;
  updateUser(user: User): Promise<void>;
  searchUsers(query: string): Promise<User[]>;
}

const wrapper: React.FC<{ children: React.ReactNode }> = props => {
  return <Fragment>{props?.children}</Fragment>;
};

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

async function waitLoading(hookResult: any): Promise<any> {
  let result = hookResult.result.current;
  await waitFor(
    async () => {
      while (result.isLoading) {
        result = hookResult.result.current;
        await wait(50);
      }
      return true;
    },
    { timeout: 2000 },
  );

  return result;
}

describe('call-chain-mixin', () => {
  let mockAPI: UserAPI;
  let getUserSpy: jest.SpyInstance;
  let updateUserSpy: jest.SpyInstance;

  beforeEach(() => {
    const api: UserAPI = (mockAPI = {
      getUser: jest.fn(async (id: number) => ({ id, name: `User ${id}`, api })),
      updateUser: jest.fn(async (user: User) => {}),
      searchUsers: jest.fn(async (query: string) => [
        { id: 1, name: `${query} User 1`, api },
        { id: 2, name: `${query} User 2`, api },
      ]),
    });

    getUserSpy = jest.spyOn(mockAPI, 'getUser');
    updateUserSpy = jest.spyOn(mockAPI, 'updateUser');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('use()', () => {
    it('should return loading state initially', async () => {
      const api = chainCall(mockAPI);

      let hookResult: RenderHookResult<SWRResponse<User, any>, void>;
      hookResult = renderHook(() => api.getUser(1).$use());
      let result = hookResult.result.current;

      expect(result.isLoading).toBe(true);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeUndefined();

      result = await waitLoading(hookResult);

      expect(result.isLoading).toBe(false);
      expect(result.data).toStrictEqual({ id: 1, name: 'User 1', api: mockAPI });
      expect(result.error).toBeUndefined();
    });

    it('should return loading state deep', async () => {
      const api = chainCall(mockAPI);

      let hookResult: RenderHookResult<SWRResponse<User, any>, void>;
      hookResult = renderHook(() =>
        api.getUser(1).api.searchUsers('test')[0].api.getUser(5).$use(),
      );
      let result = hookResult.result.current;

      expect(result.isLoading).toBe(true);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeUndefined();

      result = await waitLoading(hookResult);

      expect(result.isLoading).toBe(false);
      expect(result.data).toStrictEqual({ id: 5, name: 'User 5', api: mockAPI });
      expect(result.error).toBeUndefined();
    });

    it('should pass map freely', async () => {
      const api = chainCall(mockAPI);

      let hookResult: any;
      hookResult = renderHook(() => {
        return api
          .getUser(1)
          .$map(u => u.name)
          .$use();
      });

      let result = await waitLoading(hookResult);

      expect(result.isLoading).toBe(false);
      expect(result.data).toBe('User 1');
      expect(result.error).toBeUndefined();
    });
  });
});
