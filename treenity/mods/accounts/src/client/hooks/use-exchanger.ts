import { createLoaderStore, LoadState } from '@treenity/ui-kit/store';
import { ExchangerEntity } from '../../services/exchanger.entity';
import type { DecimalBN, Token } from '@treenity/js-shared/utils';
import { createToken, SymbolPosition } from '@treenity/js-shared/utils';
import { DEFAULT_TOKEN } from '../../utils/default-token';

type ExchangerMapData = { token: Token; exchanger: ExchangerEntity };

export interface ExchangerStore extends LoadState<ExchangerStore> {
  exchangers: Map<string, ExchangerMapData>;
  convert(amount: number): DecimalBN;
  useLoad(): void;
}

const KEY = 'exchanger';

const getKey = (from?: string | null, to?: string | null): string => `${from}-${to}`;

const createExchangerStore = (client: any, from?: string | null, to?: string | null) =>
  createLoaderStore<ExchangerStore>((set, get, store) => ({
    exchangers: new Map<string, ExchangerMapData>(),

    convert(amount: number): DecimalBN {
      const storage = get();
      const key = getKey(from, to);

      if (!storage.exchangers.has(key)) {
        // console.warn(`⚠️ Exchanger ${key} not found`);
        return DEFAULT_TOKEN.parse(0);
      }
      const { exchanger } = storage.exchangers.get(key)!;

      return exchanger.convert(amount);
    },

    useLoad() {
      const storage = get();
      const exist = storage.exchangers.has(getKey(from, to));
      if (exist) {
        storage.useLoader(
          KEY + from + to,
          () => Promise.resolve(),
          state => {},
        );
        return;
      }

      storage.useLoader(
        KEY + from + to,
        () => client.sys.accounts.exchanger.get(null!, { query: { from, to }, entity: true }),
        (state, exchanger: ExchangerEntity) => {
          //TODO: if to account equal null test it
          const toAccount = exchanger.to!;
          const token = createToken(toAccount.token, toAccount.precision, toAccount.precision, {
            icon: toAccount.symbol || '',
            position: toAccount.symbolPosition as SymbolPosition,
          });
          state.exchangers.set(getKey(exchanger.fromId, exchanger.toId), {
            exchanger,
            token,
          });
        },
      );
    },
  }));

const exchangerStores: Record<string, any> = {};

function getExchangerStore(client: any, from?: string | null, to?: string | null) {
  const id = getKey(from, to);
  return (exchangerStores[id] ||= createExchangerStore(client, from, to));
}

export const useExchanger = (
  client: any,
  from: string | null,
  to?: string | null,
): ExchangerStore => {
  const useStore = getExchangerStore(client, from, to);
  return useStore();
};
