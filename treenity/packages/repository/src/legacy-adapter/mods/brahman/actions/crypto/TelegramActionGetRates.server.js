import { get } from '@s-libs/micro-dash';
import fetch from 'node-fetch';

import { TelegramActionGetParams } from './TelegramActionGetRates.meta';

TelegramActionGetParams.extend({
  helpers: {
    async run(ctx) {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${this.coin}&vs_currencies=${this.curr}&include_24hr_change=true`,
      );
      const rates = await response.json();
      const rate = rates[this.coin][this.curr];
      const amount = parseFloat(get(ctx.session, this.amountFrom.split('.')));
      const factor = Number.parseFloat(this.factor);
      ctx.session.data[this.saveTo] =
        factor > 0
          ? (amount * factor * rate + Math.random() * this.random).toFixed(2)
          : ((amount * -factor) / rate + Math.random() * this.random).toFixed(8);
    },
  },
});
