import { serviceManager } from '../../../../tree/services/server';
import { warn } from '../../../../utils/log';
import { PaymentServiceMeta } from '../../../payment/Payment.meta';
import { TelegramActionSendCoins } from './TelegramActionSendCoins.meta';

export function getPaymentService(node) {
  const paymentServiceNode = node.findAllParents({ '_m._t': 'payment.service' })[0];
  const paymentMeta = paymentServiceNode.getMeta(PaymentServiceMeta);

  const paymentService = serviceManager.services[paymentMeta._id];

  if (!paymentService) {
    warn('TG-PAYMENT', 'payment service not started');
    return;
  }

  return paymentService;
}

TelegramActionSendCoins.extend({
  helpers: {
    run(ctx) {
      const paymentService = getPaymentService(this.node());

      const fromNodeId = ctx.format(this.fromNodeId);
      const toNodeId = ctx.format(this.toNodeId);
      const amount = Number.parseFloat(ctx.format(this.amount));

      paymentService.sendCoinsByNodeId(fromNodeId, toNodeId, this.coinName, amount);
    },

    callback(ctx) {},
  },
});
