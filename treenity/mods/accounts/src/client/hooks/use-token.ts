import { createLoaderStore, LoadState } from '@treenity/ui-kit/store';
import { AccountEntity } from '../../services/account.entity';
import { createToken, SymbolPosition, Token } from '@treenity/js-shared/utils';

export interface TokenStore extends LoadState<TokenStore> {
  token?: Token;
}

const KEY = 'token';

const createTokenStore = (client: any, token: string, account: string = 'master') =>
  createLoaderStore<TokenStore>((set, get, store) => ({
    token: undefined,

    useLoad() {
      const storage = get();
      if (storage.token) {
        storage.useLoader(
          KEY + account + token,
          () => Promise.resolve(),
          state => {},
        );
        return;
      }

      storage.useLoader(
        KEY + account + token,
        () => client.sys.accounts.get(account + token, { entity: true }),
        (state, account: AccountEntity | undefined) => {
          if (account) {
            state.token = createToken(account.token, account.precision, account.precision, {
              icon: account.symbol || '',
              position: account.symbolPosition as SymbolPosition,
            });
          }
        },
      );
    },
  }));

const tokensStore: Record<string, any> = {};

function getTokenStore(client: any, token: string, account?: string) {
  return (tokensStore[`${account}_${token}`] ||= createTokenStore(client, token, account));
}

export const useToken = (client: any, token: string, account?: string): TokenStore => {
  const useStore = getTokenStore(client, token, account);
  return useStore();
};
