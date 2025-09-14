import { getComponentInfo } from '../../../tree';
import { TelegramAction } from './TelegramAction.meta';

TelegramAction.extend({
  helpers: {
    run(ctx) {
      const info = getComponentInfo(this, ['bot', 'action']);
      if (!info) throw new Error(`component not found for: ${this._t}, "bot action"`);

      return info.component({ ctx, value: this, node: this.node(), ...info.props });
    },
  },
});
