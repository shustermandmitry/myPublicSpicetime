import { createLoaderStore, LoadState } from '@treenity/ui-kit/store';
import { AccountEntity } from '../../services/account.entity';

export interface AccountStore extends LoadState<AccountStore> {
  account?: AccountEntity;
}

const KEY = 'account';

const createAccountStore = (client: any, id: string) =>
  createLoaderStore<AccountStore>((set, get, store) => ({
    account: undefined,

    useLoad() {
      const storage = get();
      if (storage.account) {
        storage.useLoader(
          KEY + id,
          () => Promise.resolve(),
          state => {},
        );
        return;
      }

      storage.useLoader(
        KEY + id,
        () => client.sys.accounts.get(id, { entity: true }),
        (state, account: AccountEntity | undefined) => {
          if (account) {
            state.account = account;
          }
        },
      );
    },
  }));

const accountStore: Record<string, any> = {};

function getAccountStore(client: any, id: string) {
  return (accountStore[id] ||= createAccountStore(client, id));
}

export const useAccount = (client: any, id: string): AccountStore => {
  const useStore = getAccountStore(client, id);
  return useStore();
};
