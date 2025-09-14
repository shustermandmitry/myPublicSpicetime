import { TelegramActionGetWallet } from './TelegramActionGetWallet.meta';
import { getPaymentService } from './TelegramActionSendCoins.server';

TelegramActionGetWallet.extend({
  helpers: {
    run(ctx) {
      const paymentService = getPaymentService(this.node());
      const fromNodeId = ctx.format(this.fromNodeId);
      const userWallet = paymentService.getWallet(fromNodeId, this.coinName);

      if (userWallet) {
        ctx.session.data[this.saveTo] = userWallet;
        ctx.userNode.save();
      }
    },
    callback(ctx) {},
  },
});
