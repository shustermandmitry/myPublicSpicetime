import { getPaymentService } from './TelegramActionSendCoins.server';
import { TelegramActionSplitCoins } from './TelegramActionSplitCoins.meta';

TelegramActionSplitCoins.extend({
  helpers: {
    run(ctx) {
      const paymentService = getPaymentService(this.node());

      const fromNodeId = ctx.format(this.fromNodeId);
      const amount = Number.parseFloat(ctx.format(this.amount));
      const tag = ctx.format(this.toNodesByTag);
      const nodesByTag = ctx.usersNode.findChildren({ _tg: tag });

      const amountPart = this.splitEqualParts ? Math.floor(amount / nodesByTag.length) : amount;
      nodesByTag.forEach(node => {
        paymentService.sendCoinsByNodeId(fromNodeId, node._id, this.coinName, amountPart);
      });
    },
    callback(ctx) {},
  },
});
