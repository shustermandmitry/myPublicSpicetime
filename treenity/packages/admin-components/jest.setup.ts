import '@testing-library/jest-dom';
import 'core-js';
import { matchers } from '@emotion/jest';
import { jest } from '@jest/globals';
import { ENTITY_MARKER } from '@treenity/entity';
import useSWR from 'swr';

expect.extend(matchers);

const lightThemeId = '6zM5w74E3TLZEgLvM8323';
const darkThemeId = '6zM5w74E3TLZEgLvM8324';
const lightTheme = {
  $id: lightThemeId,
  $name: 'mxI',
  $type: 'theme',
  config: {
    algorithmKey: 'light',
    token: {},
    components: {},
  },
  name: 'light',
};
const darkTheme = {
  $id: darkThemeId,
  $name: 'mXD',
  $type: 'theme',
  config: {
    algorithmKey: 'dark',
    token: {},
    components: {},
  },
  name: 'dark',
};

jest.mock('@treenity/tree-api', () => {
  const actualTreeApi = jest.requireActual('@treenity/tree-api');

  return {
    //@ts-ignore
    ...actualTreeApi,
    useTree: () => ({
      useNode: (url: string) => {
        if (url === '/sys/themes/light') {
          return {
            data: lightTheme,
          };
        }

        if (url === '/sys/themes/dark') {
          return {
            data: darkTheme,
          };
        }
      },
    }),
  };
});

jest.mock('swr');

const useSWRMocked = useSWR as jest.Mocked<typeof useSWR>;
//@ts-ignore
useSWRMocked.mockImplementation(key => {
  if (key === `light-theme` + lightThemeId) {
    return {
      data: {
        ...lightTheme,
        [ENTITY_MARKER]: true,
      },
    };
  }
  if (key === `dark-theme` + darkThemeId) {
    return {
      data: {
        ...darkTheme,
        [ENTITY_MARKER]: true,
      },
    };
  }
  return { data: null };
});

//@ts-ignore
window.ENV = {
  VITE_BACKEND_API: 'ws://localhost:9000/ws',
  // DOMAIN: 'http://localhost:3000',
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
