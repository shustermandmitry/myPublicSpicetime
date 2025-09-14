import { createLoaderStore, invalidate, LoadState } from '@treenity/ui-kit/store';
import { WalletEntity } from '../../services/wallet.entity';
import { AccountEntity } from '../../services/account.entity';

export interface WalletStore extends LoadState<WalletStore> {
  wallet?: WalletEntity;
  account?: AccountEntity;
}

const KEY = 'wallet_storage';

const loadFunc = async (client: any, id: string): Promise<[WalletEntity, AccountEntity]> => {
  const wallet = await client.sys.accounts.wallet.get(id);
  const account = await client.sys.accounts.get(wallet.accountId);
  return [wallet, account];
};

const createWalletStore = (client: any, id: string) =>
  createLoaderStore<WalletStore>((set, get, store) => ({
    wallet: undefined,
    account: undefined,

    useLoad() {
      const storage = get();
      if (storage.wallet) {
        storage.useLoader(
          KEY + id,
          () => Promise.resolve(),
          state => {},
        );
        return;
      }

      storage.useLoader(
        KEY + id,
        () => loadFunc(client, id),
        (state, [wallet, account]: [WalletEntity, AccountEntity]) => {
          state.account = account;
          state.wallet = wallet;
        },
      );
    },

    reload() {
      invalidate(KEY + id);
    },
  }));

const walletStore: Record<string, any> = {};

function getWalletStore(client: any, id: string) {
  return (walletStore[id] ||= createWalletStore(client, id));
}

export const useWallet = (client: any, id: string): WalletStore => {
  const useStore = getWalletStore(client, id);
  return useStore();
};
